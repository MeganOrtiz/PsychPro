// =============================================================================
// Shared, idempotent "Foundations" course placeholder seeding.
//
// Inserts the placeholder lessons (topics) for the main-site "Foundations"
// course. They are intentionally CONTENT-FREE placeholders — flashcards,
// quizzes, study guides, and practice exams are authored separately. The
// `courses` row itself is created by `backfillCoursesFromTopics`, which promotes
// the distinct `topics.category` strings into first-class courses; run this
// before that backfill so the new course is created and linked in the same boot.
//
// This is DATA seeding, NOT schema management. It is safe to run repeatedly and
// safe to run concurrently across autoscale instances (inserts use ON CONFLICT
// DO NOTHING on the unique `topics.name`).
//
// Two callers, mirroring backfill-courses-core.ts:
//   - a manual dev CLI / one-off invocation
//   - the api-server startup hook (the ONLY path that can seed PRODUCTION, since
//     production is read-only to tooling and seed.ts never runs in production)
// =============================================================================

import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "./schema";
import { topicsTable } from "./schema";

type Database = NodePgDatabase<typeof schema>;

// MUST match the COURSE_DISPLAY_ORDER / COURSE_DESCRIPTIONS key in
// backfill-courses-core.ts and the CATEGORY_ICONS key in the Courses page.
export const FOUNDATIONS_CATEGORY = "Foundations";

// Placeholder lessons in their intended teaching order. The Courses page groups
// and sorts lessons alphabetically, so this order is documentation only.
export const FOUNDATIONS_PLACEHOLDER_TOPICS: ReadonlyArray<{
  name: string;
  description: string;
}> = [
  {
    name: "History of Psychology",
    description: "Placeholder lesson — content coming soon.",
  },
  {
    name: "Social Determinants",
    description: "Placeholder lesson — content coming soon.",
  },
  {
    name: "Social Psychology",
    description: "Placeholder lesson — content coming soon.",
  },
  {
    name: "Community Psychology",
    description: "Placeholder lesson — content coming soon.",
  },
  {
    name: "Organizational Psychology",
    description: "Placeholder lesson — content coming soon.",
  },
];

export interface BackfillFoundationsResult {
  skipped: boolean;
  topicsCreated: number;
}

export async function backfillFoundationsPlaceholders(
  database: Database,
): Promise<BackfillFoundationsResult> {
  let topicsCreated = 0;
  for (const topic of FOUNDATIONS_PLACEHOLDER_TOPICS) {
    const created = await database
      .insert(topicsTable)
      .values({
        name: topic.name,
        category: FOUNDATIONS_CATEGORY,
        description: topic.description,
      })
      .onConflictDoNothing({ target: topicsTable.name })
      .returning({ id: topicsTable.id });
    topicsCreated += created.length;
  }
  return { skipped: topicsCreated === 0, topicsCreated };
}
