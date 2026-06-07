// =============================================================================
// File: packages/db/src/schema/mastery-exams.ts (NEW)
//
// Add this file to @workspace/db and re-export the tables from the package
// index so they're importable as:
//   import { coursesTable, masteryExamsTable, ... } from "@workspace/db";
//
// Also requires a one-line addition to topicsTable — see bottom of this file.
// =============================================================================

import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";

// Existing tables — adjust import path to match your schema layout
import { topicsTable } from "./topics";
import { quizQuestionsTable } from "./quiz-questions";
import { usersTable } from "./users";

// -----------------------------------------------------------------------------
// coursesTable
// Promotes "category" strings on topics to a first-class entity.
// Backfill: insert one row per distinct topicsTable.category, then populate
// the new topicsTable.courseId column (see backfill script in this folder).
// -----------------------------------------------------------------------------
export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  displayOrder: integer("display_order").notNull().default(0),
  iconAsset: text("icon_asset"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// -----------------------------------------------------------------------------
// masteryExamsTable
// One mastery exam per course. Configurable thresholds per-exam so we can tune
// individual courses without a code change.
// -----------------------------------------------------------------------------
export const masteryExamsTable = pgTable("mastery_exams", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .notNull()
    .unique()
    .references(() => coursesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  questionCount: integer("question_count").notNull().default(75),
  timeLimitMinutes: integer("time_limit_minutes").notNull().default(120),
  passingScore: integer("passing_score").notNull().default(70),
  masteryScore: integer("mastery_score").notNull().default(90),
  // Lesson-level practice-exam score required to unlock this mastery exam
  unlockThreshold: integer("unlock_threshold").notNull().default(90),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// -----------------------------------------------------------------------------
// masteryExamQuestionsTable
// Many-to-many between mastery exams and quiz questions. Mastery-only
// integrative questions live in quiz_questions with examOnly=true and are
// linked here exclusively (never appear in topic quizzes / practice exams).
// -----------------------------------------------------------------------------
export const masteryExamQuestionsTable = pgTable(
  "mastery_exam_questions",
  {
    masteryExamId: integer("mastery_exam_id")
      .notNull()
      .references(() => masteryExamsTable.id, { onDelete: "cascade" }),
    questionId: integer("question_id")
      .notNull()
      .references(() => quizQuestionsTable.id, { onDelete: "cascade" }),
    questionOrder: integer("question_order").notNull().default(0),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.masteryExamId, t.questionId] }),
    byExam: index("mastery_exam_questions_exam_idx").on(
      t.masteryExamId,
      t.questionOrder,
    ),
  }),
);

// -----------------------------------------------------------------------------
// masteryExamAttemptsTable
// One row per completed attempt. Best-score-wins is computed at query time
// (no aggregate table needed for v1 — promote to a view if dashboard latency
// becomes a problem).
// -----------------------------------------------------------------------------
export const masteryExamAttemptsTable = pgTable(
  "mastery_exam_attempts",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    masteryExamId: integer("mastery_exam_id")
      .notNull()
      .references(() => masteryExamsTable.id, { onDelete: "cascade" }),
    score: integer("score").notNull(), // raw correct count
    total: integer("total").notNull(), // total questions served
    percentage: integer("percentage").notNull(), // pre-computed for fast best-score queries
    completedAt: timestamp("completed_at").defaultNow().notNull(),
  },
  (t) => ({
    byUserExam: index("mastery_exam_attempts_user_exam_idx").on(
      t.userId,
      t.masteryExamId,
    ),
    byUserBest: index("mastery_exam_attempts_user_best_idx").on(
      t.userId,
      t.percentage,
    ),
  }),
);

// =============================================================================
// REQUIRED ADDITION TO topicsTable
// Add the following column to your existing topicsTable definition.
// Keep the existing `category` text column as a denormalized shim during
// migration — drop it in a later release once everything reads courseId.
// =============================================================================
//
//   courseId: integer("course_id").references(() => coursesTable.id),
//
// =============================================================================
