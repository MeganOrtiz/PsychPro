// =============================================================================
// File: apps/api-server/src/lib/mcpServer.ts (ADDITIONS)
//
// Append these tool registrations to the existing buildMcpServer() function,
// after the existing add_practice_exam registration. Also update the imports
// at the top of the file to include the mastery exam tables.
// =============================================================================

// -----------------------------------------------------------------------------
// At the top of mcpServer.ts, expand the existing db import block:
// -----------------------------------------------------------------------------
/*
import {
  db,
  topicsTable,
  flashcardsTable,
  quizQuestionsTable,
  studyGuidesTable,
  practiceExamsTable,
  practiceExamQuestionsTable,
  // NEW imports:
  coursesTable,
  masteryExamsTable,
  masteryExamQuestionsTable,
} from "@workspace/db";
*/

// -----------------------------------------------------------------------------
// Append the following tool registrations inside buildMcpServer(),
// after the existing add_practice_exam registration.
// -----------------------------------------------------------------------------

server.registerTool(
  "list_courses",
  {
    title: "List PsychPro courses with mastery exam status",
    description:
      "List all PsychPro courses. For each course, returns the lesson count, the mastery exam (if one exists), and the current pool size. Use this first to discover course_id values before authoring mastery exam questions.",
    inputSchema: {},
  },
  async () => {
    const courses = await db
      .select()
      .from(coursesTable)
      .orderBy(asc(coursesTable.displayOrder));
    const enriched = await Promise.all(
      courses.map(async (c) => {
        const [lc] = await db
          .select({ c: count() })
          .from(topicsTable)
          .where(eq(topicsTable.courseId, c.id));
        const [exam] = await db
          .select()
          .from(masteryExamsTable)
          .where(eq(masteryExamsTable.courseId, c.id));
        let poolSize = 0;
        if (exam) {
          const [ps] = await db
            .select({ c: count() })
            .from(masteryExamQuestionsTable)
            .where(eq(masteryExamQuestionsTable.masteryExamId, exam.id));
          poolSize = Number(ps?.c ?? 0);
        }
        return {
          id: c.id,
          name: c.name,
          description: c.description,
          lessonCount: Number(lc?.c ?? 0),
          masteryExam: exam
            ? {
                id: exam.id,
                title: exam.title,
                questionCount: exam.questionCount,
                timeLimitMinutes: exam.timeLimitMinutes,
                passingScore: exam.passingScore,
                masteryScore: exam.masteryScore,
                unlockThreshold: exam.unlockThreshold,
                poolSize,
              }
            : null,
        };
      }),
    );
    return textResult({ courses: enriched });
  },
);

server.registerTool(
  "add_mastery_exam",
  {
    title: "Create or replace a Mastery Exam for a course",
    description:
      "Create a Mastery Exam tied to a course. Each course can have only one Mastery Exam; if one exists, it will be replaced (its question pool links are wiped — questions themselves are kept and re-attached by subsequent add_mastery_exam_questions calls). Defaults match the standard: 75 questions per attempt, 120 min, 70/90 thresholds, 90% lesson mastery to unlock.",
    inputSchema: {
      course_id: z.number().int().positive(),
      title: z.string().min(1).max(300),
      question_count: z.number().int().min(10).max(225).default(75),
      time_limit_minutes: z.number().int().min(10).max(600).default(120),
      passing_score: z.number().int().min(0).max(100).default(70),
      mastery_score: z.number().int().min(0).max(100).default(90),
      unlock_threshold: z.number().int().min(0).max(100).default(90),
    },
  },
  async (args) => {
    const [course] = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.id, args.course_id));
    if (!course) return errorResult(`Course ${args.course_id} does not exist.`);

    const result = await db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(masteryExamsTable)
        .where(eq(masteryExamsTable.courseId, args.course_id));
      if (existing) {
        await tx
          .delete(masteryExamQuestionsTable)
          .where(eq(masteryExamQuestionsTable.masteryExamId, existing.id));
        const [updated] = await tx
          .update(masteryExamsTable)
          .set({
            title: args.title,
            questionCount: args.question_count,
            timeLimitMinutes: args.time_limit_minutes,
            passingScore: args.passing_score,
            masteryScore: args.mastery_score,
            unlockThreshold: args.unlock_threshold,
          })
          .where(eq(masteryExamsTable.id, existing.id))
          .returning();
        return { exam: updated, replaced: true };
      }
      const [created] = await tx
        .insert(masteryExamsTable)
        .values({
          courseId: args.course_id,
          title: args.title,
          questionCount: args.question_count,
          timeLimitMinutes: args.time_limit_minutes,
          passingScore: args.passing_score,
          masteryScore: args.mastery_score,
          unlockThreshold: args.unlock_threshold,
        })
        .returning();
      return { exam: created, replaced: false };
    });

    return textResult({
      ok: true,
      action: result.replaced ? "replaced" : "created",
      exam: result.exam,
    });
  },
);

const masteryQuestionSchema = z.object({
  question: z.string().min(1).max(4000),
  optionA: z.string().min(1).max(1000),
  optionB: z.string().min(1).max(1000),
  optionC: z.string().min(1).max(1000),
  optionD: z.string().min(1).max(1000),
  correctAnswer: z.enum(["A", "B", "C", "D"]),
  explanation: z.string().min(1).max(4000),
  // Optional: anchor each question to a representative lesson for the per-lesson
  // breakdown on the results screen. If omitted, leaves the question unanchored.
  anchorTopicId: z.number().int().positive().optional(),
});

server.registerTool(
  "add_mastery_exam_questions",
  {
    title: "Bulk-add mastery-only integrative questions to a Mastery Exam",
    description:
      "Bulk-add new integrative vignette-style questions to a Mastery Exam's question pool. These questions are stored in quiz_questions with examOnly=true and linked exclusively to this Mastery Exam — they never appear in lesson quizzes or lesson practice exams. Provide an anchor_topic_id per question to enable per-lesson breakdown on the results screen (use the topic_id of the lesson most closely related to the question's content).",
    inputSchema: {
      course_id: z.number().int().positive(),
      questions: z.array(masteryQuestionSchema).min(1).max(50),
    },
  },
  async (args) => {
    const [course] = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.id, args.course_id));
    if (!course) return errorResult(`Course ${args.course_id} does not exist.`);

    const [exam] = await db
      .select()
      .from(masteryExamsTable)
      .where(eq(masteryExamsTable.courseId, args.course_id));
    if (!exam) {
      return errorResult(
        `No Mastery Exam exists for course ${args.course_id}. Call add_mastery_exam first.`,
      );
    }

    // For unanchored questions, fall back to the first lesson in the course
    // so quiz_questions.topicId (NOT NULL in current schema) is satisfied.
    const [firstLesson] = await db
      .select({ id: topicsTable.id })
      .from(topicsTable)
      .where(eq(topicsTable.courseId, args.course_id))
      .limit(1);
    if (!firstLesson) {
      return errorResult(
        `Course ${args.course_id} has no lessons — add lessons before authoring mastery questions.`,
      );
    }
    const fallbackTopicId = firstLesson.id;

    const result = await db.transaction(async (tx) => {
      // Validate any provided anchorTopicId values belong to this course
      const providedAnchors = args.questions
        .map((q) => q.anchorTopicId)
        .filter((id): id is number => typeof id === "number");
      if (providedAnchors.length > 0) {
        const anchorRows = await tx
          .select({ id: topicsTable.id })
          .from(topicsTable)
          .where(
            and(
              inArray(topicsTable.id, providedAnchors),
              eq(topicsTable.courseId, args.course_id),
            ),
          );
        const validAnchors = new Set(anchorRows.map((r) => r.id));
        for (const id of providedAnchors) {
          if (!validAnchors.has(id)) {
            throw new Error(
              `anchor_topic_id ${id} does not belong to course ${args.course_id}.`,
            );
          }
        }
      }

      // Insert questions into quiz_questions with examOnly=true
      const insertedQuestions = await tx
        .insert(quizQuestionsTable)
        .values(
          args.questions.map((q) => ({
            topicId: q.anchorTopicId ?? fallbackTopicId,
            question: q.question,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            examOnly: true,
          })),
        )
        .returning({ id: quizQuestionsTable.id });

      // Determine next questionOrder for this exam
      const [{ existingCount = 0 } = {}] = await tx
        .select({ existingCount: count() })
        .from(masteryExamQuestionsTable)
        .where(eq(masteryExamQuestionsTable.masteryExamId, exam.id));
      const startOrder = Number(existingCount ?? 0);

      await tx.insert(masteryExamQuestionsTable).values(
        insertedQuestions.map((q, idx) => ({
          masteryExamId: exam.id,
          questionId: q.id,
          questionOrder: startOrder + idx,
        })),
      );

      return { inserted: insertedQuestions.length, ids: insertedQuestions.map((q) => q.id) };
    });

    return textResult({
      ok: true,
      examId: exam.id,
      courseId: args.course_id,
      ...result,
    });
  },
);

server.registerTool(
  "link_lesson_questions_to_mastery_exam",
  {
    title: "Pull existing lesson questions into a Mastery Exam pool",
    description:
      "Link existing quiz_questions from lessons in this course into the Mastery Exam's pool. Use this to populate the lesson-bank half of the 50/50 pool. Pass count=N to randomly sample N questions stratified across the course's lessons, or pass question_ids explicitly. Idempotent — skips questions already linked.",
    inputSchema: {
      course_id: z.number().int().positive(),
      count: z.number().int().min(1).max(500).optional()
        .describe("Random stratified sample size across all lessons in the course"),
      question_ids: z.array(z.number().int().positive()).optional()
        .describe("Specific quiz question IDs to link (alternative to count)"),
    },
  },
  async (args) => {
    const [exam] = await db
      .select()
      .from(masteryExamsTable)
      .where(eq(masteryExamsTable.courseId, args.course_id));
    if (!exam) {
      return errorResult(
        `No Mastery Exam exists for course ${args.course_id}. Call add_mastery_exam first.`,
      );
    }

    let candidateIds: number[] = [];

    if (args.question_ids && args.question_ids.length > 0) {
      // Validate IDs belong to lessons in this course
      const valid = await db
        .select({ id: quizQuestionsTable.id })
        .from(quizQuestionsTable)
        .innerJoin(topicsTable, eq(quizQuestionsTable.topicId, topicsTable.id))
        .where(
          and(
            inArray(quizQuestionsTable.id, args.question_ids),
            eq(topicsTable.courseId, args.course_id),
          ),
        );
      candidateIds = valid.map((v) => v.id);
    } else if (args.count) {
      // Random stratified sample: ~equal questions per lesson
      const lessons = await db
        .select({ id: topicsTable.id })
        .from(topicsTable)
        .where(eq(topicsTable.courseId, args.course_id));
      if (lessons.length === 0) {
        return errorResult(`Course ${args.course_id} has no lessons.`);
      }
      const perLesson = Math.ceil(args.count / lessons.length);
      for (const lesson of lessons) {
        const rows = await db
          .select({ id: quizQuestionsTable.id })
          .from(quizQuestionsTable)
          .where(eq(quizQuestionsTable.topicId, lesson.id));
        const shuffled = [...rows].sort(() => Math.random() - 0.5);
        candidateIds.push(...shuffled.slice(0, perLesson).map((r) => r.id));
      }
      candidateIds = candidateIds.slice(0, args.count);
    } else {
      return errorResult("Provide either count or question_ids.");
    }

    // Skip questions already linked to this exam
    const alreadyLinked = await db
      .select({ id: masteryExamQuestionsTable.questionId })
      .from(masteryExamQuestionsTable)
      .where(eq(masteryExamQuestionsTable.masteryExamId, exam.id));
    const linkedSet = new Set(alreadyLinked.map((r) => r.id));
    const toLink = candidateIds.filter((id) => !linkedSet.has(id));

    if (toLink.length === 0) {
      return textResult({ ok: true, linked: 0, alreadyLinked: candidateIds.length });
    }

    const [{ existingCount = 0 } = {}] = await db
      .select({ existingCount: count() })
      .from(masteryExamQuestionsTable)
      .where(eq(masteryExamQuestionsTable.masteryExamId, exam.id));
    const startOrder = Number(existingCount ?? 0);

    await db.insert(masteryExamQuestionsTable).values(
      toLink.map((qid, idx) => ({
        masteryExamId: exam.id,
        questionId: qid,
        questionOrder: startOrder + idx,
      })),
    );

    return textResult({
      ok: true,
      examId: exam.id,
      linked: toLink.length,
      alreadyLinked: candidateIds.length - toLink.length,
    });
  },
);

// -----------------------------------------------------------------------------
// REMINDER: also add `import { asc } from "drizzle-orm"` if not already present
// at the top of mcpServer.ts (used by list_courses above).
// -----------------------------------------------------------------------------
