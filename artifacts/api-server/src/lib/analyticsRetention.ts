import type { Logger } from "pino";
import { lte } from "drizzle-orm";
import {
  anonymousPageviewsTable,
  db,
  paidConversionLedgerTable,
} from "@workspace/db";

const DAY_MS = 24 * 60 * 60 * 1000;

function retentionCutoff(now: Date): Date {
  const cutoff = new Date(now);
  const dayOfMonth = cutoff.getUTCDate();
  cutoff.setUTCDate(1);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - 13);
  const lastDayOfTargetMonth = new Date(Date.UTC(
    cutoff.getUTCFullYear(),
    cutoff.getUTCMonth() + 1,
    0,
  )).getUTCDate();
  cutoff.setUTCDate(Math.min(dayOfMonth, lastDayOfTargetMonth));
  return cutoff;
}

export async function pruneExpiredAnonymousPageviews(
  now: Date = new Date(),
): Promise<number> {
  const cutoff = retentionCutoff(now);
  const pageviews = await db
    .delete(anonymousPageviewsTable)
    .where(lte(anonymousPageviewsTable.occurredAt, cutoff));
  const conversions = await db
    .delete(paidConversionLedgerTable)
    .where(lte(paidConversionLedgerTable.paidAt, cutoff));
  return (pageviews.rowCount ?? 0) + (conversions.rowCount ?? 0);
}

export function startAnalyticsRetentionCleanup(
  logger: Logger,
  intervalMs: number = DAY_MS,
): { stop(): void } {
  if (!Number.isFinite(intervalMs) || !Number.isInteger(intervalMs) || intervalMs <= 0) {
    throw new Error(`Invalid analytics cleanup interval: ${String(intervalMs)}`);
  }

  const run = async () => {
    try {
      const deleted = await pruneExpiredAnonymousPageviews();
      if (deleted > 0) {
        logger.info({ deleted }, "Expired anonymous analytics events removed");
      }
    } catch (err) {
      logger.warn({ err }, "Anonymous analytics retention cleanup failed");
    }
  };

  void run();
  const timer = setInterval(() => void run(), intervalMs);
  timer.unref();
  return { stop: () => clearInterval(timer) };
}
