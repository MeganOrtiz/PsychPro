import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { topicsTable, flashcardsTable, quizQuestionsTable, studyGuidesTable, practiceExamsTable, practiceExamQuestionsTable, usersTable } from "@workspace/db";
import { eq, count, asc } from "drizzle-orm";
import { requireUserId } from "../lib/userId";
import { shuffle } from "../lib/shuffle";
import { enforceTopicAccess } from "../lib/topicAccess";

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
    const userId = requireUserId(req, res);
    if (!userId) return;
    const topicId = parseInt(String(req.params.topicId));
    // Server-side gate: free users can only consume study content for their
    // allotted topics. Without this, a direct API call bypasses the topic
    // detail page's client-side gate.
    if (!(await enforceTopicAccess(userId, topicId, res))) return;
    const flashcards = await db.select().from(flashcardsTable).where(eq(flashcardsTable.topicId, topicId));
    res.json(flashcards);
  } catch (err) {
    req.log.error({ err }, "Error getting flashcards");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/topics/:topicId/quizzes", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const topicId = parseInt(String(req.params.topicId));
    if (!(await enforceTopicAccess(userId, topicId, res))) return;
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
    const userId = requireUserId(req, res);
    if (!userId) return;
    const topicId = parseInt(String(req.params.topicId));
    // Free-tier model: a user's allotted topics get FULL access including
    // the study guide. The old subscription-only 402 here contradicted the
    // "2 topics fully unlocked" promise. Now we gate the same way as
    // flashcards/quizzes — by topic entitlement.
    if (!(await enforceTopicAccess(userId, topicId, res))) return;
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
    const userId = requireUserId(req, res);
    if (!userId) return;
    const topicId = parseInt(String(req.params.topicId));
    if (!(await enforceTopicAccess(userId, topicId, res))) return;
    const requestedCount = parseInt(String(req.query.count ?? "25")) || 25;
    const count = Math.min(Math.max(requestedCount, 1), 50);

    const [exam] = await db.select().from(practiceExamsTable).where(eq(practiceExamsTable.topicId, topicId));
    if (!exam) {
      res.status(404).json({ error: "Practice exam not found" });
      return;
    }
    const linkedQuestions = await db
      .select({
        id: quizQuestionsTable.id,
        topicId: quizQuestionsTable.topicId,
        question: quizQuestionsTable.question,
        optionA: quizQuestionsTable.optionA,
        optionB: quizQuestionsTable.optionB,
        optionC: quizQuestionsTable.optionC,
        optionD: quizQuestionsTable.optionD,
        correctAnswer: quizQuestionsTable.correctAnswer,
        explanation: quizQuestionsTable.explanation,
        questionOrder: practiceExamQuestionsTable.questionOrder,
      })
      .from(practiceExamQuestionsTable)
      .innerJoin(quizQuestionsTable, eq(practiceExamQuestionsTable.questionId, quizQuestionsTable.id))
      .where(eq(practiceExamQuestionsTable.examId, exam.id))
      .orderBy(asc(practiceExamQuestionsTable.questionOrder));

    // Shuffle and return requested count (Fisher–Yates, see lib/shuffle.ts).
    const shuffled = shuffle(linkedQuestions).slice(0, count);

    res.json({
      id: exam.id,
      topicId: exam.topicId,
      title: exam.title,
      timeLimit: exam.timeLimit,
      passingScore: exam.passingScore,
      questions: shuffled.map(({ questionOrder: _order, ...q }) => q),
    });
  } catch (err) {
    req.log.error({ err }, "Error getting practice exam");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
