import { type Request, type Response, type NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import {
  clientErrorRateHitsTable,
  clientErrorRateWarningsTable,
} from "@workspace/db";
import { and, asc, eq, lte, sql } from "drizzle-orm";

function readPositiveIntEnv(name: string, defaultValue: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") return defaultValue;
  const trimmed = raw.trim();
  const n = Number(trimmed);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) {
    throw new Error(
      `Invalid ${name} env value: ${JSON.stringify(raw)} (must be a positive integer)`,
    );
  }
  return n;
}

// Per-IP throttle for POST /api/client-errors. Defaults preserve the original
// hard-coded behaviour (60s window, 30 requests). Operators can override per
// environment via CLIENT_ERRORS_RATE_LIMIT_WINDOW_MS and
// CLIENT_ERRORS_RATE_LIMIT_MAX (see PUBLISHING.md). Invalid values throw at
// module load → the API server fails fast at startup with a clear message.
const WINDOW_MS = readPositiveIntEnv(
  "CLIENT_ERRORS_RATE_LIMIT_WINDOW_MS",
  60_000,
);
const MAX_REQUESTS_PER_WINDOW = readPositiveIntEnv(
  "CLIENT_ERRORS_RATE_LIMIT_MAX",
  30,
);
const GLOBAL_CLEANUP_EVERY_REQUESTS = 100;

let requestsSinceLastCleanup = 0;

function getClientKey(req: Request): string {
  // `req.ip` is derived by Express via the `proxy-addr` package using the
  // app's `trust proxy` setting (configured to 1 in app.ts). With one trusted
  // hop, this returns the address the immediate proxy reports as the client,
  // which clients cannot forge by sending their own X-Forwarded-For header.
  // We deliberately do NOT read X-Forwarded-For directly from headers here.
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

function getAuthUserIdSafe(req: Request): string | null {
  try {
    return getAuth(req).userId ?? null;
  } catch {
    return null;
  }
}

interface RateLimitDecision {
  kind: "allowed" | "limited";
  retryAfterSec?: number;
  shouldWarn?: boolean;
}

async function evaluateRateLimit(
  key: string,
  now: Date,
  windowStart: Date,
): Promise<RateLimitDecision> {
  return db.transaction(async (tx) => {
    // Serialize concurrent requests for the same client across all replicas.
    // Different keys hash to different lock IDs, so unrelated traffic is not
    // blocked. The lock is released when the transaction ends.
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${key}))`);

    // Drop hits that have aged out of the window so the count below reflects
    // only the current sliding window. Matches the prior in-memory behaviour,
    // which kept only timestamps strictly newer than `windowStart`.
    await tx
      .delete(clientErrorRateHitsTable)
      .where(
        and(
          eq(clientErrorRateHitsTable.clientKey, key),
          lte(clientErrorRateHitsTable.hitAt, windowStart),
        ),
      );

    const recent = await tx
      .select({ hitAt: clientErrorRateHitsTable.hitAt })
      .from(clientErrorRateHitsTable)
      .where(eq(clientErrorRateHitsTable.clientKey, key))
      .orderBy(asc(clientErrorRateHitsTable.hitAt));

    if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
      const oldest = recent[0]?.hitAt ?? now;
      const retryAfterSec = Math.max(
        1,
        Math.ceil((oldest.getTime() + WINDOW_MS - now.getTime()) / 1000),
      );

      const [warning] = await tx
        .select()
        .from(clientErrorRateWarningsTable)
        .where(eq(clientErrorRateWarningsTable.clientKey, key));
      const warnedThisWindow =
        warning !== undefined && warning.warnedAt > windowStart;

      let shouldWarn = false;
      if (!warnedThisWindow) {
        await tx
          .insert(clientErrorRateWarningsTable)
          .values({ clientKey: key, warnedAt: now })
          .onConflictDoUpdate({
            target: clientErrorRateWarningsTable.clientKey,
            set: { warnedAt: now },
          });
        shouldWarn = true;
      }

      return { kind: "limited", retryAfterSec, shouldWarn };
    }

    await tx
      .insert(clientErrorRateHitsTable)
      .values({ clientKey: key, hitAt: now });

    return { kind: "allowed" };
  });
}

async function runOpportunisticCleanup(windowStart: Date): Promise<void> {
  // Hits and warnings for keys that never come back would otherwise grow
  // without bound. We sweep them out probabilistically to keep storage in
  // check without paying the cost on every request.
  await db
    .delete(clientErrorRateHitsTable)
    .where(lte(clientErrorRateHitsTable.hitAt, windowStart));
  await db
    .delete(clientErrorRateWarningsTable)
    .where(lte(clientErrorRateWarningsTable.warnedAt, windowStart));
}

export async function clientErrorsRateLimit(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const key = getClientKey(req);
  const now = new Date();
  const windowStart = new Date(now.getTime() - WINDOW_MS);

  let decision: RateLimitDecision;
  try {
    decision = await evaluateRateLimit(key, now, windowStart);
  } catch (err) {
    // Fail open: if the shared store is unavailable, do not punish legitimate
    // clients. The error is logged so operators can react.
    req.log.warn(
      { err },
      "clientErrorsRateLimit store unavailable; allowing request",
    );
    next();
    return;
  }

  requestsSinceLastCleanup += 1;
  if (requestsSinceLastCleanup >= GLOBAL_CLEANUP_EVERY_REQUESTS) {
    requestsSinceLastCleanup = 0;
    void runOpportunisticCleanup(windowStart).catch((err: unknown) => {
      req.log.warn({ err }, "clientErrorsRateLimit cleanup failed");
    });
  }

  if (decision.kind === "limited") {
    const retryAfterSec = decision.retryAfterSec ?? 1;
    res.setHeader("Retry-After", String(retryAfterSec));
    res.status(429).json({ error: "Too many client error reports" });

    if (decision.shouldWarn) {
      const userAgent = req.headers["user-agent"] ?? null;
      const userId = getAuthUserIdSafe(req);
      req.log.warn(
        {
          clientErrorsRateLimit: {
            ip: key,
            userAgent,
            userId,
            windowMs: WINDOW_MS,
            limit: MAX_REQUESTS_PER_WINDOW,
          },
        },
        "Client error reports throttled: a single client exceeded the per-IP rate limit",
      );
    }
    return;
  }

  next();
}
