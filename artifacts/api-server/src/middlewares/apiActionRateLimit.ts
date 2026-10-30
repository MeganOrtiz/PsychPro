import { createHmac } from "node:crypto";
import type { Logger } from "pino";
import type { Request, RequestHandler } from "express";
import { and, count, eq, gt, lte, min, sql } from "drizzle-orm";
import { apiRateLimitHitsTable, db } from "@workspace/db";
import { getOptionalUserId } from "../lib/userId";

const HOUR_MS = 60 * 60 * 1000;
const RETENTION_MS = 24 * HOUR_MS;

export const API_ACTION_RATE_LIMIT_RULES = {
  customDeckGeneration: {
    windowMs: HOUR_MS,
    accountLimit: 10,
    ipLimit: 300,
  },
  uploadUrl: {
    windowMs: HOUR_MS,
    accountLimit: 20,
    ipLimit: 600,
  },
  checkoutSession: {
    windowMs: HOUR_MS,
    accountLimit: 5,
    ipLimit: 100,
  },
  studyTrial: {
    windowMs: HOUR_MS,
    accountLimit: 5,
    ipLimit: 100,
  },
  analyticsPageview: {
    windowMs: HOUR_MS,
    accountLimit: 300,
    ipLimit: 600,
  },
} as const;

export type ApiActionRateLimit = keyof typeof API_ACTION_RATE_LIMIT_RULES;

export interface ApiActionRateLimitRule {
  windowMs: number;
  accountLimit: number;
  ipLimit: number;
}

export type ApiActionRateLimitDecision =
  | { allowed: true }
  | {
      allowed: false;
      retryAfterSec: number;
      limitedBy: "account" | "ip";
    };

interface Bucket {
  action: string;
  subjectHash: string;
  limit: number;
  limitedBy: "account" | "ip";
}

function getHashSecret(): string {
  const secret =
    process.env.SESSION_SECRET ??
    process.env.CLERK_SECRET_KEY ??
    process.env.CLERK_SK_OVERRIDE;
  if (!secret) {
    throw new Error("No server-side secret is configured for API rate-limit hashing");
  }
  return secret;
}

function hashSubject(action: string, scope: "account" | "ip", subject: string): string {
  return createHmac("sha256", getHashSecret())
    .update(`${action}\0${scope}\0${subject}`)
    .digest("hex");
}

function clientIp(req: Request): string {
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

/**
 * Atomically checks both the verified account and source-IP buckets, then
 * records the accepted request in Postgres. Advisory locks make the check
 * safe when concurrent requests land on different API instances.
 */
export async function checkApiActionRateLimit(
  action: string,
  userId: string,
  ip: string,
  rule: ApiActionRateLimitRule,
  now: Date = new Date(),
): Promise<ApiActionRateLimitDecision> {
  const windowStart = new Date(now.getTime() - rule.windowMs);
  const buckets: Bucket[] = [
    {
      action,
      subjectHash: hashSubject(action, "account", userId),
      limit: rule.accountLimit,
      limitedBy: "account",
    },
    {
      action,
      subjectHash: hashSubject(action, "ip", ip),
      limit: rule.ipLimit,
      limitedBy: "ip",
    },
  ];

  return db.transaction(async (tx) => {
    // Always lock in the same order so requests sharing both buckets cannot
    // deadlock one another.
    const lockKeys = buckets
      .map((bucket) => `${bucket.action}:${bucket.subjectHash}`)
      .sort();
    for (const lockKey of lockKeys) {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${lockKey}))`);
    }

    let limitingDecision:
      | Extract<ApiActionRateLimitDecision, { allowed: false }>
      | undefined;

    for (const bucket of buckets) {
      const [stats] = await tx
        .select({
          hitCount: count(),
          oldestHitAt: min(apiRateLimitHitsTable.hitAt),
        })
        .from(apiRateLimitHitsTable)
        .where(
          and(
            eq(apiRateLimitHitsTable.action, bucket.action),
            eq(apiRateLimitHitsTable.subjectHash, bucket.subjectHash),
            gt(apiRateLimitHitsTable.hitAt, windowStart),
          ),
        );

      const hitCount = Number(stats?.hitCount ?? 0);
      if (hitCount < bucket.limit) continue;

      const oldestHitAt = stats?.oldestHitAt;
      const retryAfterSec = Math.max(
        1,
        Math.ceil(
          ((oldestHitAt instanceof Date ? oldestHitAt : now).getTime() +
            rule.windowMs -
            now.getTime()) /
            1000,
        ),
      );
      if (!limitingDecision || retryAfterSec > limitingDecision.retryAfterSec) {
        limitingDecision = {
          allowed: false,
          retryAfterSec,
          limitedBy: bucket.limitedBy,
        };
      }
    }

    if (limitingDecision) return limitingDecision;

    await tx.insert(apiRateLimitHitsTable).values(
      buckets.map((bucket) => ({
        action: bucket.action,
        subjectHash: bucket.subjectHash,
        hitAt: now,
      })),
    );
    return { allowed: true };
  });
}

type RateLimitChecker = (
  action: ApiActionRateLimit,
  userId: string,
  ip: string,
) => Promise<ApiActionRateLimitDecision>;

export function createApiActionRateLimitMiddleware(
  checker: RateLimitChecker = (action, userId, ip) =>
    checkApiActionRateLimit(
      action,
      userId,
      ip,
      API_ACTION_RATE_LIMIT_RULES[action],
    ),
): (action: ApiActionRateLimit) => RequestHandler {
  return (action) => async (req, res, next) => {
    const userId = getOptionalUserId(req);
    const ip = clientIp(req);
    // Public pageview collection is limited by a keyed IP hash even when
    // there is no signed-in account. Other actions keep their existing
    // anonymous behavior and let route-level auth return the normal 401.
    if (!userId && action !== "analyticsPageview") {
      next();
      return;
    }

    let decision: ApiActionRateLimitDecision;
    try {
      decision = await checker(action, userId ?? `anonymous:${ip}`, ip);
    } catch (err) {
      req.log.error({ err, action }, "API action rate-limit check failed; blocking request");
      res.status(503).json({
        error: "This action is temporarily unavailable. Please try again shortly.",
        code: "rate_limit_unavailable",
      });
      return;
    }

    if (!decision.allowed) {
      res.setHeader("Retry-After", String(decision.retryAfterSec));
      req.log.warn(
        { apiActionRateLimit: { action, limitedBy: decision.limitedBy } },
        "API action rate limit reached",
      );
      res.status(429).json({
        error: "Too many requests. Please try again later.",
        code: "rate_limited",
      });
      return;
    }

    next();
  };
}

export const apiActionRateLimit = createApiActionRateLimitMiddleware();

export async function pruneExpiredApiActionRateLimitHits(
  now: Date = new Date(),
): Promise<number> {
  const retentionStart = new Date(now.getTime() - RETENTION_MS);
  const result = await db
    .delete(apiRateLimitHitsTable)
    .where(lte(apiRateLimitHitsTable.hitAt, retentionStart));
  return result.rowCount ?? 0;
}

export interface ApiActionRateLimitCleanupHandle {
  stop(): void;
}

export function startApiActionRateLimitCleanup(
  logger: Logger,
  intervalMs: number = HOUR_MS,
): ApiActionRateLimitCleanupHandle {
  if (!Number.isFinite(intervalMs) || !Number.isInteger(intervalMs) || intervalMs <= 0) {
    throw new Error(
      `startApiActionRateLimitCleanup: intervalMs must be a positive integer, got ${String(intervalMs)}`,
    );
  }

  const handle = setInterval(() => {
    pruneExpiredApiActionRateLimitHits()
      .then((deleted) => {
        if (deleted > 0) {
          logger.info(
            { apiActionRateLimitCleanup: { deleted } },
            "API action rate-limit cleanup pruned expired rows",
          );
        }
      })
      .catch((err: unknown) => {
        logger.warn({ err }, "Scheduled API action rate-limit cleanup failed");
      });
  }, intervalMs);
  if (typeof handle.unref === "function") handle.unref();

  logger.info(
    { apiActionRateLimitCleanup: { intervalMs, retentionMs: RETENTION_MS } },
    "Started API action rate-limit cleanup sweeper",
  );

  return {
    stop(): void {
      clearInterval(handle);
    },
  };
}
