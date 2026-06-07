// =============================================================================
// Shared, idempotent course backfill.
//
// Promotes the distinct `topics.category` strings into first-class `courses`
// rows and links each topic to its course via `topics.course_id`.
//
// This is DATA seeding, NOT schema management — the `courses` table and the
// `topics.course_id` column are created by Replit's publish-time schema diff,
// never here. It is safe to run repeatedly and safe to run concurrently across
// multiple autoscale instances (course inserts use ON CONFLICT DO NOTHING on the
// unique `courses.name`; topic links only touch rows whose course_id is null).
//
// Two callers:
//   - the CLI script `scripts/backfill-courses.ts` (manual, dev)
//   - the api-server startup hook (the ONLY path that can seed PRODUCTION, since
//     production is read-only to tooling and is never reached by seed.ts)
// =============================================================================

import { and, eq, isNull } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "./schema";
import { topicsTable, coursesTable } from "./schema";

type Database = NodePgDatabase<typeof schema>;

// Display order of courses on the Courses page.
// Keys MUST match `topics.category` strings EXACTLY. Production's category is
// "Pediatric & Neuropsychiatric Conditions" (the dev DB snapshot lacks it), so
// the key here must be the full production string or that course would fall back
// to displayOrder 99 with a null description once it is seeded in production.
const COURSE_DISPLAY_ORDER: Record<string, number> = {
  "Neuroscience": 1,
  "Neuropsychology": 2,
  "Pediatric & Neuropsychiatric Conditions": 3,
  "Assessment": 4,
  "Psychotherapy": 5,
  "Psychology": 6,
  "Research Methods": 7,
  "Special Topics": 8,
};

const COURSE_DESCRIPTIONS: Record<string, string> = {
  "Neuroscience":
    "Foundations of brain and behavior — neurons, neurotransmitters, neuroanatomy, and the biological systems that underlie psychological function.",
  "Neuropsychology":
    "Brain-behavior relationships, cognitive functions, and the neuropsychological assessment of cortical and subcortical dysfunction.",
  "Pediatric & Neuropsychiatric Conditions":
    "Pediatric neuropsychology and neuropsychiatric conditions across the lifespan.",
  "Assessment":
    "Psychological testing, measurement theory, and clinical assessment instruments.",
  "Psychotherapy":
    "Evidence-based psychotherapy theories, interventions, and clinical applications.",
  "Psychology":
    "Core psychological theories — cognition, emotion, motivation, personality, and social psychology.",
  "Research Methods":
    "Research design, statistics, and the critical evaluation of psychological research.",
  "Special Topics":
    "Specialized clinical and applied topics in contemporary psychology practice.",
};

export interface BackfillCoursesResult {
  skipped: boolean;
  distinctCategories: string[];
  coursesCreated: number;
  topicsLinked: number;
}

export async function backfillCoursesFromTopics(
  database: Database,
): Promise<BackfillCoursesResult> {
  // Distinct, non-empty categories currently present in topics.
  const rows = await database
    .select({ category: topicsTable.category })
    .from(topicsTable);
  const distinctCategories = Array.from(
    new Set(rows.map((r) => r.category).filter((c): c is string => Boolean(c))),
  );

  // Fast path: if every category already has a course AND no topic is unlinked,
  // there is nothing to do. Keeps steady-state autoscale cold starts cheap.
  const existingCourses = await database.select().from(coursesTable);
  const existingNames = new Set(existingCourses.map((c) => c.name));
  const [unlinked] = await database
    .select({ id: topicsTable.id })
    .from(topicsTable)
    .where(isNull(topicsTable.courseId))
    .limit(1);
  const allCategoriesHaveCourses = distinctCategories.every((c) =>
    existingNames.has(c),
  );
  if (allCategoriesHaveCourses && !unlinked) {
    return {
      skipped: true,
      distinctCategories,
      coursesCreated: 0,
      topicsLinked: 0,
    };
  }

  // Upsert a course per category. ON CONFLICT DO NOTHING (unique courses.name)
  // makes concurrent autoscale instances safe.
  let coursesCreated = 0;
  for (const name of distinctCategories) {
    if (existingNames.has(name)) continue;
    const created = await database
      .insert(coursesTable)
      .values({
        name,
        description: COURSE_DESCRIPTIONS[name] ?? null,
        displayOrder: COURSE_DISPLAY_ORDER[name] ?? 99,
      })
      .onConflictDoNothing({ target: coursesTable.name })
      .returning({ id: coursesTable.id });
    coursesCreated += created.length;
  }

  // Link any topic with a null courseId to the course matching its category.
  const allCourses = await database.select().from(coursesTable);
  let topicsLinked = 0;
  for (const course of allCourses) {
    const updated = await database
      .update(topicsTable)
      .set({ courseId: course.id })
      .where(
        and(
          eq(topicsTable.category, course.name),
          isNull(topicsTable.courseId),
        ),
      )
      .returning({ id: topicsTable.id });
    topicsLinked += updated.length;
  }

  return { skipped: false, distinctCategories, coursesCreated, topicsLinked };
}
