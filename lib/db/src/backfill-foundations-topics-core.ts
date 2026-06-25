// =============================================================================
// Shared, idempotent "Foundations" course lesson seeding + description repair.
//
// Inserts the lessons (topics) for the main-site "Foundations" course and keeps
// their short descriptions in sync. Lesson CONTENT (flashcards, quizzes, study
// guides, practice exams) is authored separately via Claude/MCP into prod; this
// module only owns the topic rows and their one-line descriptions. The `courses`
// row itself is created by `backfillCoursesFromTopics`, which promotes the
// distinct `topics.category` strings into first-class courses; run this before
// that backfill so the new course is created and linked in the same boot.
//
// This is DATA seeding, NOT schema management. It is safe to run repeatedly and
// safe to run concurrently across autoscale instances: inserts use ON CONFLICT
// DO NOTHING on the unique `topics.name`, and the description repair only
// overwrites rows that still carry the original placeholder text — so it never
// clobbers a later owner/Claude edit and is a no-op once applied.
//
// Two callers, mirroring backfill-courses-core.ts:
//   - a manual dev CLI / one-off invocation
//   - the api-server startup hook (the ONLY path that can seed PRODUCTION, since
//     production is read-only to tooling and seed.ts never runs in production)
// =============================================================================

import { and, eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "./schema";
import { topicsTable } from "./schema";

type Database = NodePgDatabase<typeof schema>;

// MUST match the COURSE_DISPLAY_ORDER / COURSE_DESCRIPTIONS key in
// backfill-courses-core.ts and the CATEGORY_ICONS key in the Courses page.
export const FOUNDATIONS_CATEGORY = "Foundations";

// The original content-free placeholder text. Lessons were seeded with this
// before their content existed. The repair step below upgrades any row still
// showing it to the real description; matching on this exact string keeps the
// repair idempotent and prevents clobbering subsequent manual edits.
export const FOUNDATIONS_PLACEHOLDER_DESCRIPTION =
  "Placeholder lesson — content coming soon.";

// Lessons in their intended teaching order with their real one-line summaries.
// The Courses page renders the description in a 2-line clamp, so keep these to
// ~1–2 short sentences. (The page groups/sorts lessons alphabetically, so this
// ordering is documentation only.)
export const FOUNDATIONS_TOPICS: ReadonlyArray<{
  name: string;
  description: string;
}> = [
  {
    name: "History of Psychology",
    description:
      "From Wundt's 1879 Leipzig lab to the cognitive revolution — the schools, key figures, and turning points that shaped the field.",
  },
  {
    name: "Social Determinants",
    description:
      "How social and economic conditions shape health — the SES gradient, ACEs, allostatic load, and fundamental-cause theory.",
  },
  {
    name: "Social Psychology",
    description:
      "How situations shape behavior — attribution, conformity, obedience, attitudes, persuasion, and group and intergroup processes.",
  },
  {
    name: "Community Psychology",
    description:
      "Prevention, empowerment, and ecological thinking — working at the community and systems level rather than the individual.",
  },
  {
    name: "Organizational Psychology",
    description:
      "Psychology applied to the workplace — motivation, leadership, commitment, justice, culture, burnout, and selection.",
  },
];

export interface BackfillFoundationsResult {
  skipped: boolean;
  topicsCreated: number;
  descriptionsRepaired: number;
}

export async function backfillFoundationsPlaceholders(
  database: Database,
): Promise<BackfillFoundationsResult> {
  let topicsCreated = 0;
  let descriptionsRepaired = 0;

  for (const topic of FOUNDATIONS_TOPICS) {
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

    // Upgrade pre-existing rows still showing the placeholder to the real
    // description. Guarded on the exact placeholder string so it runs at most
    // once per row and never overwrites a later manual edit.
    const repaired = await database
      .update(topicsTable)
      .set({ description: topic.description })
      .where(
        and(
          eq(topicsTable.name, topic.name),
          eq(topicsTable.description, FOUNDATIONS_PLACEHOLDER_DESCRIPTION),
        ),
      )
      .returning({ id: topicsTable.id });
    descriptionsRepaired += repaired.length;
  }

  return {
    skipped: topicsCreated === 0 && descriptionsRepaired === 0,
    topicsCreated,
    descriptionsRepaired,
  };
}
