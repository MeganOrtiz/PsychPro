// =============================================================================
// Shared, idempotent full-length exam time-limit fix.
//
// The EPPP full-length exams ("EPPP Part 1/2 — Full-Length Exam") were seeded
// with practice_exams.time_limit = 255, intending 255 MINUTES. The exam runner
// (practice-exam.tsx) reads time_limit as SECONDS, so the timer started at
// 4:15 instead of 255:00. Correct any full-length exam whose budget is
// implausibly small (< 1 hour) to the proper 15300s (255 minutes).
//
// This is DATA seeding, NOT schema management. It is idempotent and race-safe:
// the correction is a single conditional UPDATE guarded by `time_limit < 3600`,
// so once a row is 15300 it no longer matches, concurrent autoscale instances
// converge without redundant writes, and a deliberately-set sane large budget
// is never clobbered.
//
// Two callers:
//   - the api-server startup hook (the ONLY path that can fix PRODUCTION, since
//     production is read-only to tooling and is never reached by seed.ts)
//   - any future manual CLI invocation
// =============================================================================

import { and, ilike, inArray, lt } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "./schema";
import { practiceExamsTable, topicsTable } from "./schema";

type Database = NodePgDatabase<typeof schema>;

// 255 minutes — the real EPPP full-length exam time budget, in seconds.
const FULL_LENGTH_TIME_LIMIT_SEC = 255 * 60; // 15300
// Any full-length budget below this is the minutes-stored-as-seconds bug.
const IMPLAUSIBLE_BUDGET_SEC = 60 * 60; // 1 hour

export interface BackfillFullLengthExamTimeResult {
  skipped: boolean;
  examsUpdated: number;
}

export async function backfillFullLengthExamTime(
  database: Database,
): Promise<BackfillFullLengthExamTimeResult> {
  const fullLengthTopics = await database
    .select({ id: topicsTable.id })
    .from(topicsTable)
    .where(ilike(topicsTable.name, "%Full-Length%"));

  const topicIds = fullLengthTopics.map((t) => t.id);
  if (topicIds.length === 0) {
    return { skipped: true, examsUpdated: 0 };
  }

  // Single conditional UPDATE — the `< 3600` guard lives in the WHERE clause so
  // the operation is strictly idempotent, race-safe, and minimal-write.
  const updated = await database
    .update(practiceExamsTable)
    .set({ timeLimit: FULL_LENGTH_TIME_LIMIT_SEC })
    .where(
      and(
        inArray(practiceExamsTable.topicId, topicIds),
        lt(practiceExamsTable.timeLimit, IMPLAUSIBLE_BUDGET_SEC),
      ),
    )
    .returning({ id: practiceExamsTable.id });

  return { skipped: updated.length === 0, examsUpdated: updated.length };
}
