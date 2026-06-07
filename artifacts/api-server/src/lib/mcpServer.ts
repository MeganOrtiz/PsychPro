import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  db,
  topicsTable,
  flashcardsTable,
  quizQuestionsTable,
  studyGuidesTable,
  practiceExamsTable,
  practiceExamQuestionsTable,
  coursesTable,
  masteryExamsTable,
  masteryExamQuestionsTable,
} from "@workspace/db";
import { eq, count, inArray, asc, and } from "drizzle-orm";

function textResult(payload: unknown) {
  return {
    content: [
      { type: "text" as const, text: JSON.stringify(payload, null, 2) },
    ],
  };
}

function errorResult(message: string) {
  return {
    isError: true,
    content: [{ type: "text" as const, text: `Error: ${message}` }],
  };
}

export function buildMcpServer(): McpServer {
  const server = new McpServer({
    name: "psychpro",
    version: "1.0.0",
  });

  server.registerTool(
    "list_topics",
    {
      title: "List PsychPro topics",
      description:
        "List all study topics currently in PsychPro, with counts of how many flashcards and quiz questions each has. Use this first so you know what topic_id to attach new content to.",
      inputSchema: {},
    },
    async () => {
      const topics = await db.select().from(topicsTable);
      const enriched = await Promise.all(
        topics.map(async (t) => {
          const [fc] = await db.select({ c: count() }).from(flashcardsTable).where(eq(flashcardsTable.topicId, t.id));
          const [qc] = await db.select({ c: count() }).from(quizQuestionsTable).where(eq(quizQuestionsTable.topicId, t.id));
          return {
            id: t.id,
            name: t.name,
            category: t.category,
            description: t.description,
            flashcardCount: Number(fc?.c ?? 0),
            quizQuestionCount: Number(qc?.c ?? 0),
          };
        }),
      );
      return textResult({ topics: enriched });
    },
  );

  server.registerTool(
    "add_topic",
    {
      title: "Add a new topic",
      description:
        "Create a new study topic in PsychPro. Topic names must be unique. Returns the new topic's id.",
      inputSchema: {
        name: z.string().min(1).max(200).describe("Unique topic name, e.g. 'Defense Mechanisms'"),
        category: z.string().min(1).max(100).describe("Parent category, e.g. 'Personality' or 'Neuroanatomy'"),
        description: z.string().min(1).max(2000).describe("One-paragraph summary of what the topic covers"),
      },
    },
    async (args) => {
      try {
        const [created] = await db
          .insert(topicsTable)
          .values({ name: args.name, category: args.category, description: args.description })
          .returning();
        return textResult({ ok: true, topic: created });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.toLowerCase().includes("unique") || msg.toLowerCase().includes("duplicate")) {
          return errorResult(`A topic named "${args.name}" already exists.`);
        }
        return errorResult(msg);
      }
    },
  );

  const flashcardSchema = z.object({
    question: z.string().min(1).max(2000),
    answer: z.string().min(1).max(4000),
    difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  });

  server.registerTool(
    "add_flashcards",
    {
      title: "Add flashcards to a topic",
      description:
        "Bulk-add flashcards to an existing topic. Pass an array of {question, answer, difficulty}. Use list_topics first to find the topic_id.",
      inputSchema: {
        topic_id: z.number().int().positive().describe("ID of the topic these flashcards belong to"),
        cards: z.array(flashcardSchema).min(1).max(100).describe("Up to 100 flashcards per call"),
      },
    },
    async (args) => {
      const [topic] = await db.select().from(topicsTable).where(eq(topicsTable.id, args.topic_id));
      if (!topic) return errorResult(`Topic ${args.topic_id} does not exist.`);
      const rows = await db
        .insert(flashcardsTable)
        .values(args.cards.map((c) => ({
          topicId: args.topic_id,
          question: c.question,
          answer: c.answer,
          difficulty: c.difficulty,
        })))
        .returning({ id: flashcardsTable.id });
      return textResult({ ok: true, inserted: rows.length, ids: rows.map((r) => r.id) });
    },
  );

  const quizQuestionSchema = z.object({
    question: z.string().min(1).max(2000),
    optionA: z.string().min(1).max(500),
    optionB: z.string().min(1).max(500),
    optionC: z.string().min(1).max(500),
    optionD: z.string().min(1).max(500),
    correctAnswer: z.enum(["A", "B", "C", "D"]),
    explanation: z.string().min(1).max(2000),
    examOnly: z.boolean().default(false).describe("If true, only appears in practice exams, not in quizzes."),
  });

  server.registerTool(
    "add_quiz_questions",
    {
      title: "Add quiz questions to a topic",
      description:
        "Bulk-add multiple-choice quiz questions to a topic. Each question has 4 options A-D, a correct answer letter, and an explanation. Set examOnly=true for questions that should only show up in practice exams.",
      inputSchema: {
        topic_id: z.number().int().positive(),
        questions: z.array(quizQuestionSchema).min(1).max(100),
      },
    },
    async (args) => {
      const [topic] = await db.select().from(topicsTable).where(eq(topicsTable.id, args.topic_id));
      if (!topic) return errorResult(`Topic ${args.topic_id} does not exist.`);
      const rows = await db
        .insert(quizQuestionsTable)
        .values(args.questions.map((q) => ({
          topicId: args.topic_id,
          question: q.question,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          examOnly: q.examOnly,
        })))
        .returning({ id: quizQuestionsTable.id });
      return textResult({ ok: true, inserted: rows.length, ids: rows.map((r) => r.id) });
    },
  );

  server.registerTool(
    "add_study_guide",
    {
      title: "Add or replace a study guide for a topic",
      description:
        "Attach a long-form study guide (markdown) to a topic. If a guide already exists for this topic, it will be replaced. Pass replace=false to refuse overwriting an existing guide.",
      inputSchema: {
        topic_id: z.number().int().positive(),
        title: z.string().min(1).max(300),
        content: z.string().min(1).max(200_000).describe("Markdown body of the study guide"),
        replace: z.boolean().default(true).describe("If true, overwrite an existing guide for this topic."),
      },
    },
    async (args) => {
      const [topic] = await db.select().from(topicsTable).where(eq(topicsTable.id, args.topic_id));
      if (!topic) return errorResult(`Topic ${args.topic_id} does not exist.`);
      const [existing] = await db.select().from(studyGuidesTable).where(eq(studyGuidesTable.topicId, args.topic_id));
      if (existing && !args.replace) {
        return errorResult(`A study guide already exists for topic ${args.topic_id}. Pass replace=true to overwrite it.`);
      }
      if (existing) {
        const [updated] = await db
          .update(studyGuidesTable)
          .set({ title: args.title, content: args.content })
          .where(eq(studyGuidesTable.id, existing.id))
          .returning();
        return textResult({ ok: true, action: "updated", guide: { id: updated.id, topicId: updated.topicId, title: updated.title } });
      }
      const [created] = await db
        .insert(studyGuidesTable)
        .values({ topicId: args.topic_id, title: args.title, content: args.content })
        .returning();
      return textResult({ ok: true, action: "created", guide: { id: created.id, topicId: created.topicId, title: created.title } });
    },
  );

  server.registerTool(
    "add_practice_exam",
    {
      title: "Create a practice exam for a topic",
      description:
        "Create a practice exam tied to a topic. Provide either question_ids (IDs of existing quiz questions to include) or set use_all=true to include every quiz question for that topic. Each topic can have only one practice exam; if one exists, it will be replaced.",
      inputSchema: {
        topic_id: z.number().int().positive(),
        title: z.string().min(1).max(300),
        time_limit_minutes: z.number().int().min(0).max(600).default(60),
        passing_score: z.number().int().min(0).max(100).default(70),
        question_ids: z.array(z.number().int().positive()).optional().describe("Specific quiz question IDs to include, in order."),
        use_all: z.boolean().default(false).describe("If true and question_ids omitted, includes all quiz questions for the topic."),
      },
    },
    async (args) => {
      const [topic] = await db.select().from(topicsTable).where(eq(topicsTable.id, args.topic_id));
      if (!topic) return errorResult(`Topic ${args.topic_id} does not exist.`);

      let questionIds: number[] = [];
      if (args.question_ids && args.question_ids.length > 0) {
        const rows = await db
          .select({ id: quizQuestionsTable.id, topicId: quizQuestionsTable.topicId })
          .from(quizQuestionsTable)
          .where(inArray(quizQuestionsTable.id, args.question_ids));
        const valid = new Set(rows.filter((r) => r.topicId === args.topic_id).map((r) => r.id));
        questionIds = args.question_ids.filter((id) => valid.has(id));
        if (questionIds.length === 0) {
          return errorResult("None of the provided question_ids belong to that topic.");
        }
      } else if (args.use_all) {
        const rows = await db.select({ id: quizQuestionsTable.id }).from(quizQuestionsTable).where(eq(quizQuestionsTable.topicId, args.topic_id));
        questionIds = rows.map((r) => r.id);
        if (questionIds.length === 0) {
          return errorResult("No quiz questions exist for that topic yet. Add quiz questions first.");
        }
      } else {
        return errorResult("Provide either question_ids or set use_all=true.");
      }

      const result = await db.transaction(async (tx) => {
        const [existingExam] = await tx.select().from(practiceExamsTable).where(eq(practiceExamsTable.topicId, args.topic_id));
        let examId: number;
        if (existingExam) {
          await tx.delete(practiceExamQuestionsTable).where(eq(practiceExamQuestionsTable.examId, existingExam.id));
          const [updated] = await tx
            .update(practiceExamsTable)
            .set({ title: args.title, timeLimit: args.time_limit_minutes, passingScore: args.passing_score })
            .where(eq(practiceExamsTable.id, existingExam.id))
            .returning();
          examId = updated.id;
        } else {
          const [created] = await tx
            .insert(practiceExamsTable)
            .values({
              topicId: args.topic_id,
              title: args.title,
              timeLimit: args.time_limit_minutes,
              passingScore: args.passing_score,
            })
            .returning();
          examId = created.id;
        }
        await tx.insert(practiceExamQuestionsTable).values(
          questionIds.map((qid, idx) => ({ examId, questionId: qid, questionOrder: idx })),
        );
        return { examId, replaced: Boolean(existingExam) };
      });

      return textResult({
        ok: true,
        action: result.replaced ? "replaced" : "created",
        exam: { id: result.examId, topicId: args.topic_id, questionCount: questionIds.length },
      });
    },
  );

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

  return server;
}
