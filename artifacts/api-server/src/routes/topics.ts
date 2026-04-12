import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { topicsTable, flashcardsTable, quizQuestionsTable, studyGuidesTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";

const router = Router();

router.get("/topics", async (req: Request, res: Response): Promise<void> => {
  try {
    const topics = await db.select().from(topicsTable);
    const result = await Promise.all(
      topics.map(async (topic) => {
        const [fc] = await db.select({ count: count() }).from(flashcardsTable).where(eq(flashcardsTable.topicId, topic.id));
        const [qc] = await db.select({ count: count() }).from(quizQuestionsTable).where(eq(quizQuestionsTable.topicId, topic.id));
        return {
          ...topic,
          flashcardCount: Number(fc?.count ?? 0),
          quizCount: Number(qc?.count ?? 0),
        };
      })
    );
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Error getting topics");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/topics/:topicId", async (req: Request, res: Response): Promise<void> => {
  try {
    const topicId = parseInt(String(req.params.topicId));
    const [topic] = await db.select().from(topicsTable).where(eq(topicsTable.id, topicId));
    if (!topic) {
      res.status(404).json({ error: "Topic not found" });
      return;
    }
    const [fc] = await db.select({ count: count() }).from(flashcardsTable).where(eq(flashcardsTable.topicId, topicId));
    const [qc] = await db.select({ count: count() }).from(quizQuestionsTable).where(eq(quizQuestionsTable.topicId, topicId));
    res.json({ ...topic, flashcardCount: Number(fc?.count ?? 0), quizCount: Number(qc?.count ?? 0) });
  } catch (err) {
    req.log.error({ err }, "Error getting topic");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/topics/:topicId/flashcards", async (req: Request, res: Response): Promise<void> => {
  try {
    const topicId = parseInt(String(req.params.topicId));
    const flashcards = await db.select().from(flashcardsTable).where(eq(flashcardsTable.topicId, topicId));
    res.json(flashcards);
  } catch (err) {
    req.log.error({ err }, "Error getting flashcards");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/topics/:topicId/quizzes", async (req: Request, res: Response): Promise<void> => {
  try {
    const topicId = parseInt(String(req.params.topicId));
    const questions = await db
      .select()
      .from(quizQuestionsTable)
      .where(eq(quizQuestionsTable.topicId, topicId));
    const filtered = questions.filter(q => !q.examOnly);
    res.json(
      filtered.map(q => ({
        id: q.id,
        topicId: q.topicId,
        question: q.question,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Error getting quizzes");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/topics/:topicId/study-guide", async (req: Request, res: Response): Promise<void> => {
  try {
    const topicId = parseInt(String(req.params.topicId));
    const [guide] = await db.select().from(studyGuidesTable).where(eq(studyGuidesTable.topicId, topicId));
    if (!guide) {
      res.status(404).json({ error: "Study guide not found" });
      return;
    }
    res.json(guide);
  } catch (err) {
    req.log.error({ err }, "Error getting study guide");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/topics/:topicId/practice-exam", async (req: Request, res: Response): Promise<void> => {
  try {
    const topicId = parseInt(String(req.params.topicId));
    const [topic] = await db.select().from(topicsTable).where(eq(topicsTable.id, topicId));
    if (!topic) {
      res.status(404).json({ error: "Topic not found" });
      return;
    }
    const allQuestions = await db
      .select()
      .from(quizQuestionsTable)
      .where(eq(quizQuestionsTable.topicId, topicId));
    const examQs = allQuestions.length >= 10 ? allQuestions.slice(0, 10) : allQuestions;
    res.json({
      id: topicId,
      topicId,
      title: `${topic.name} Practice Exam`,
      questions: examQs.map(q => ({
        id: q.id,
        topicId: q.topicId,
        question: q.question,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Error getting practice exam");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
