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
} from "@workspace/db";
import { eq, count, inArray } from "drizzle-orm";

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
        "Bulk-add multiple-choice quiz questions to a topic. Each question has 4 options A-D, a correct answer letter, and an explanation. Set exam_only=true for questions that should only show up in practice exams.",
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

  return server;
}
