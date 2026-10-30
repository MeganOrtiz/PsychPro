import { randomBytes } from "node:crypto";
import { Router, type IRouter, type Request, type Response } from "express";
import { and, count, countDistinct, gte, lt, sql } from "drizzle-orm";
import {
  GetAdminInsightsResponse,
  GetAdminInsightsQueryParams,
  RecordAnalyticsPageviewBody,
} from "@workspace/api-zod";
import {
  anonymousPageviewsTable,
  db,
  paidConversionLedgerTable,
  usersTable,
} from "@workspace/db";
import { apiActionRateLimit } from "../middlewares/apiActionRateLimit";
import { requireInsightsOwner } from "../lib/isAdmin";

const router: IRouter = Router();
const PAGEVIEW_COOKIE = "pp_visitor_id";
const PAGEVIEW_COOKIE_MAX_AGE_SECONDS = 13 * 30 * 24 * 60 * 60;
const VALID_DAYS = new Set([7, 30, 90, 365]);
const TRACKED_CATEGORIES = new Set([
  "landing",
  "plans",
  "authentication",
  "onboarding",
  "psychpro",
  "eppp",
  "other",
]);

type SourceName = "traffic" | "accounts" | "trials" | "paid";
type BucketUnit = "day" | "week" | "month";

function readBrowserId(req: Request): string | null {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${PAGEVIEW_COOKIE}=`));
  const value = cookie?.slice(PAGEVIEW_COOKIE.length + 1);
  return value && /^[a-f0-9]{64}$/.test(value) ? value : null;
}

function issueBrowserCookie(req: Request, res: Response, browserId: string): void {
  const secure = process.env.NODE_ENV === "production" || req.secure;
  const cookie = [
    `${PAGEVIEW_COOKIE}=${browserId}`,
    "Path=/",
    `Max-Age=${PAGEVIEW_COOKIE_MAX_AGE_SECONDS}`,
    "HttpOnly",
    "SameSite=Lax",
    ...(secure ? ["Secure"] : []),
  ].join("; ");
  // A single cookie name is written by this endpoint; do not log its value.
  res.append("Set-Cookie", cookie);
}

function isLikelyCrawler(userAgent: string): boolean {
  return /bot|crawler|spider|slurp|headless|preview|facebookexternalhit|pingdom|uptime|monitor/i
    .test(userAgent);
}

function getBucketUnit(days: number): BucketUnit {
  if (days <= 30) return "day";
  if (days <= 90) return "week";
  return "month";
}

function bucketLabel(
  column: typeof anonymousPageviewsTable.occurredAt,
  unit: BucketUnit,
) {
  return sql<string>`to_char(
    date_trunc(${unit}, ${column} at time zone 'UTC'),
    'YYYY-MM-DD'
  )`;
}

function userBucketLabel(unit: BucketUnit) {
  return sql<string>`to_char(
    date_trunc(${unit}, ${usersTable.createdAt}),
    'YYYY-MM-DD'
  )`;
}

function buildBucketLabels(start: Date, end: Date, unit: BucketUnit): string[] {
  const cursor = new Date(start);
  cursor.setUTCHours(0, 0, 0, 0);
  if (unit === "week") {
    const daysSinceMonday = (cursor.getUTCDay() + 6) % 7;
    cursor.setUTCDate(cursor.getUTCDate() - daysSinceMonday);
  } else if (unit === "month") {
    cursor.setUTCDate(1);
  }

  const labels: string[] = [];
  while (cursor <= end && labels.length < 400) {
    labels.push(cursor.toISOString().slice(0, 10));
    if (unit === "day") cursor.setUTCDate(cursor.getUTCDate() + 1);
    else if (unit === "week") cursor.setUTCDate(cursor.getUTCDate() + 7);
    else cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return labels;
}

async function loadSource<T>(
  req: Request,
  source: SourceName,
  load: () => Promise<T>,
): Promise<{ value: T } | { error: true }> {
  try {
    return { value: await load() };
  } catch (err) {
    req.log.error({ err, source }, "Admin insights metric source failed");
    return { error: true };
  }
}

router.post(
  "/analytics/pageview",
  apiActionRateLimit("analyticsPageview"),
  async (req, res): Promise<void> => {
    const parsed = RecordAnalyticsPageviewBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid analytics event" });
      return;
    }
    if (!TRACKED_CATEGORIES.has(parsed.data.routeCategory)) {
      res.status(400).json({ error: "Invalid analytics event" });
      return;
    }

    // Preview and development events are intentionally excluded from the
    // production metrics. Return a valid response so the caller stays quiet.
    if (process.env.NODE_ENV !== "production") {
      res.status(202).json({ accepted: false });
      return;
    }

    if (isLikelyCrawler(req.get("user-agent") ?? "")) {
      res.status(202).json({ accepted: false });
      return;
    }

    const existingBrowserId = readBrowserId(req);
    const browserId = existingBrowserId ?? randomBytes(32).toString("hex");
    if (!existingBrowserId) issueBrowserCookie(req, res, browserId);

    try {
      await db.insert(anonymousPageviewsTable).values({
        browserId,
        routeCategory: parsed.data.routeCategory,
      });
    } catch (err) {
      // Best-effort tracking must never make a visitor's navigation fail.
      req.log.warn({ err }, "Anonymous analytics event could not be stored");
      res.status(202).json({ accepted: false });
      return;
    }

    res.status(202).json({ accepted: true });
  },
);

router.get("/admin/insights", async (req, res): Promise<void> => {
  if (!(await requireInsightsOwner(req, res))) return;

  const rawDays = req.query.days;
  const daysValue = rawDays === undefined
    ? undefined
    : typeof rawDays === "string"
      ? Number(rawDays)
      : Number.NaN;
  const parsed = GetAdminInsightsQueryParams.safeParse({ days: daysValue });
  if (!parsed.success || !VALID_DAYS.has(parsed.data.days)) {
    res.status(400).json({ error: "Reporting window must be 7, 30, 90, or 365 days" });
    return;
  }

  const days = parsed.data.days;
  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  const unit = getBucketUnit(days);
  const trafficLabel = bucketLabel(anonymousPageviewsTable.occurredAt, unit);
  const accountsLabel = userBucketLabel(unit);
  const [trafficResult, accountsResult, trialsResult, paidResult] = await Promise.all([
    loadSource(req, "traffic", async () => {
      const [totals] = await db
        .select({
          uniqueBrowsers: countDistinct(anonymousPageviewsTable.browserId),
          pageviews: count(),
        })
        .from(anonymousPageviewsTable)
        .where(and(
          gte(anonymousPageviewsTable.occurredAt, start),
          lt(anonymousPageviewsTable.occurredAt, end),
        ));
      const buckets = await db
        .select({
          label: trafficLabel,
          uniqueBrowsers: countDistinct(anonymousPageviewsTable.browserId),
          pageviews: count(),
        })
        .from(anonymousPageviewsTable)
        .where(and(
          gte(anonymousPageviewsTable.occurredAt, start),
          lt(anonymousPageviewsTable.occurredAt, end),
        ))
        .groupBy(trafficLabel)
        .orderBy(trafficLabel);
      return { totals, buckets };
    }),
    loadSource(req, "accounts", async () => {
      const [totals] = await db
        .select({ newAccounts: count() })
        .from(usersTable)
        .where(and(gte(usersTable.createdAt, start), lt(usersTable.createdAt, end)));
      const buckets = await db
        .select({
          label: accountsLabel,
          newAccounts: count(),
        })
        .from(usersTable)
        .where(and(gte(usersTable.createdAt, start), lt(usersTable.createdAt, end)))
        .groupBy(accountsLabel)
        .orderBy(accountsLabel);
      return { totals, buckets };
    }),
    loadSource(req, "trials", async () => {
      const [psychpro] = await db
        .select({ value: count() })
        .from(usersTable)
        .where(and(
          gte(usersTable.psychproTrialStartedAt, start),
          lt(usersTable.psychproTrialStartedAt, end),
        ));
      const [eppp] = await db
        .select({ value: count() })
        .from(usersTable)
        .where(and(
          gte(usersTable.epppPromoRedeemedAt, start),
          lt(usersTable.epppPromoRedeemedAt, end),
        ));
      return { psychpro: psychpro?.value ?? 0, eppp: eppp?.value ?? 0 };
    }),
    loadSource(req, "paid", async () => {
      const rows = await db
        .select({
          suite: paidConversionLedgerTable.suite,
          planCategory: paidConversionLedgerTable.planCategory,
          count: count(),
        })
        .from(paidConversionLedgerTable)
        .where(and(
          gte(paidConversionLedgerTable.paidAt, start),
          lt(paidConversionLedgerTable.paidAt, end),
        ))
        .groupBy(paidConversionLedgerTable.suite, paidConversionLedgerTable.planCategory);
      const psychpro = rows
        .filter((row) => row.suite === "psychpro")
        .reduce((sum, row) => sum + Number(row.count), 0);
      const eppp = rows
        .filter((row) => row.suite === "eppp")
        .reduce((sum, row) => sum + Number(row.count), 0);
      const byPlanCategory = rows
        .filter((row) => row.suite === "psychpro" || row.suite === "eppp")
        .map((row) => ({
          suite: row.suite as "psychpro" | "eppp",
          planCategory: row.planCategory,
          count: Number(row.count),
        }));
      return { psychpro, eppp, byPlanCategory };
    }),
  ]);

  const unavailableSources: SourceName[] = [];
  if ("error" in trafficResult) unavailableSources.push("traffic");
  if ("error" in accountsResult) unavailableSources.push("accounts");
  if ("error" in trialsResult) unavailableSources.push("trials");
  if ("error" in paidResult) unavailableSources.push("paid");

  const traffic = "value" in trafficResult ? trafficResult.value : null;
  const accounts = "value" in accountsResult ? accountsResult.value : null;
  const trials = "value" in trialsResult ? trialsResult.value : null;
  const paid = "value" in paidResult ? paidResult.value : null;
  const bucketMap = new Map<
    string,
    { uniqueBrowsers: number | null; pageviews: number | null; newAccounts: number | null }
  >();

  for (const label of buildBucketLabels(start, end, unit)) {
    bucketMap.set(label, {
      uniqueBrowsers: traffic ? 0 : null,
      pageviews: traffic ? 0 : null,
      newAccounts: accounts ? 0 : null,
    });
  }
  for (const bucket of traffic?.buckets ?? []) {
    const item = bucketMap.get(bucket.label);
    if (item) {
      item.uniqueBrowsers = Number(bucket.uniqueBrowsers);
      item.pageviews = Number(bucket.pageviews);
    }
  }
  for (const bucket of accounts?.buckets ?? []) {
    const item = bucketMap.get(bucket.label);
    if (item) item.newAccounts = Number(bucket.newAccounts);
  }

  res.setHeader("Cache-Control", "private, no-store");
  res.json(GetAdminInsightsResponse.parse({
    period: {
      days,
      start: start.toISOString(),
      end: end.toISOString(),
      refreshedAt: new Date().toISOString(),
    },
    traffic: {
      uniqueBrowsers: traffic ? Number(traffic.totals?.uniqueBrowsers ?? 0) : null,
      pageviews: traffic ? Number(traffic.totals?.pageviews ?? 0) : null,
    },
    accounts: {
      newAccounts: accounts ? Number(accounts.totals?.newAccounts ?? 0) : null,
    },
    trials: {
      psychpro: trials?.psychpro ?? null,
      eppp: trials?.eppp ?? null,
    },
    paid: {
      psychpro: paid?.psychpro ?? null,
      eppp: paid?.eppp ?? null,
      byPlanCategory: paid?.byPlanCategory ?? [],
    },
    trend: [...bucketMap.entries()].map(([label, values]) => ({ label, ...values })),
    unavailableSources,
  }));
});

export default router;
