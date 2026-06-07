// =============================================================================
// File: packages/db/src/scripts/backfill-courses.ts (NEW)
//
// Run after applying the mastery-exams schema migration. Idempotent —
// safe to run multiple times.
//
// Usage:
//   pnpm --filter @workspace/db exec tsx src/scripts/backfill-courses.ts
// =============================================================================

import { db } from "../index";
import { topicsTable, coursesTable } from "../index";
import { eq, isNull } from "drizzle-orm";

// Display order of courses on the Courses page — adjust to match your design.
// Names MUST match existing topicsTable.category strings exactly.
const COURSE_DISPLAY_ORDER: Record<string, number> = {
  "Neuroscience": 1,
  "Neuropsychology": 2,
  "Pediatric & Neuropsychiatric": 3,
  "Assessment": 4,
  "Psychotherapy": 5,
  "Psychology": 6,
  "Research Methods": 7,
  "Special Topics": 8,
};

// Optional course descriptions — extend as needed.
const COURSE_DESCRIPTIONS: Record<string, string> = {
  "Neuroscience":
    "Foundations of brain and behavior — neurons, neurotransmitters, neuroanatomy, and the biological systems that underlie psychological function.",
  "Neuropsychology":
    "Brain-behavior relationships, cognitive functions, and the neuropsychological assessment of cortical and subcortical dysfunction.",
  "Pediatric & Neuropsychiatric":
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

async function main() {
  console.log("Starting course backfill…");

  // Step 1: Find all distinct categories currently in topicsTable
  const allTopics = await db.select({ category: topicsTable.category }).from(topicsTable);
  const distinctCategories = Array.from(
    new Set(allTopics.map((t) => t.category).filter(Boolean)),
  );
  console.log(`Found ${distinctCategories.length} distinct categories:`, distinctCategories);

  // Step 2: Upsert a courses row for each category
  for (const categoryName of distinctCategories) {
    const [existing] = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.name, categoryName));

    if (existing) {
      console.log(`✓ Course "${categoryName}" already exists (id=${existing.id})`);
      continue;
    }

    const [created] = await db
      .insert(coursesTable)
      .values({
        name: categoryName,
        description: COURSE_DESCRIPTIONS[categoryName] ?? null,
        displayOrder: COURSE_DISPLAY_ORDER[categoryName] ?? 99,
      })
      .returning();
    console.log(`+ Created course "${created.name}" (id=${created.id})`);
  }

  // Step 3: Backfill topicsTable.courseId for any topics with null courseId
  const allCourses = await db.select().from(coursesTable);
  const courseByName = new Map(allCourses.map((c) => [c.name, c.id]));

  const unlinkedTopics = await db
    .select()
    .from(topicsTable)
    .where(isNull(topicsTable.courseId));

  console.log(`Linking ${unlinkedTopics.length} unlinked topics to courses…`);

  for (const topic of unlinkedTopics) {
    const courseId = courseByName.get(topic.category);
    if (!courseId) {
      console.warn(`! No course found for topic "${topic.name}" (category="${topic.category}")`);
      continue;
    }
    await db
      .update(topicsTable)
      .set({ courseId })
      .where(eq(topicsTable.id, topic.id));
  }

  console.log("Course backfill complete.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Backfill failed:", err);
    process.exit(1);
  });
