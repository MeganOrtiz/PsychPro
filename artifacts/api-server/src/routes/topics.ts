import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { topicsTable, flashcardsTable, quizQuestionsTable, studyGuidesTable, practiceExamsTable, practiceExamQuestionsTable } from "@workspace/db";
import { eq, count, asc } from "drizzle-orm";
import { requireUserId } from "../lib/userId";
import { shuffle } from "../lib/shuffle";
import { getEntitlements, FREE_FLASHCARD_PREVIEW } from "../lib/entitlements";

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
    // examQuestionCount = number of questions actually linked to this topic's
    // practice exam (not just any quiz question). The setup screen uses this
    // to clamp the 25/50 picker so users never get fewer than they chose.
    const [exam] = await db.select().from(practiceExamsTable).where(eq(practiceExamsTable.topicId, topicId));
    let examQuestionCount = 0;
    if (exam) {
      const [ec] = await db
        .select({ count: count() })
        .from(practiceExamQuestionsTable)
        .where(eq(practiceExamQuestionsTable.examId, exam.id));
      examQuestionCount = Number(ec?.count ?? 0);
    }
    res.json({
      ...topic,
      flashcardCount: Number(fc?.count ?? 0),
      quizCount: Number(qc?.count ?? 0),
      examQuestionCount,
    });
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
    const ent = await getEntitlements(userId);
    // Free users get only the first N cards (stable id-asc order) — the
    // remainder never leaves the server. Subscribed/admin users get all.
    const baseQuery = db
      .select()
      .from(flashcardsTable)
      .where(eq(flashcardsTable.topicId, topicId))
      .orderBy(asc(flashcardsTable.id));
    const flashcards = ent.flashcardsCapped
      ? await baseQuery.limit(FREE_FLASHCARD_PREVIEW)
      : await baseQuery;
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
    // Free-tier cap: 1 completed quiz total (lifetime, across all topics).
    // The completion increment happens implicitly via the quiz-attempts
    // insert in progress.ts — re-checking here gates 2nd+ entry server-side.
    const ent = await getEntitlements(userId);
    if (ent.quizLocked) {
      res.status(402).json({
        error: "Free quiz limit reached",
        message: `Free accounts can complete ${ent.quizLimit} quiz. Upgrade to PsychPro Master for unlimited quizzes.`,
        quizzesCompleted: ent.quizzesCompleted,
        quizLimit: ent.quizLimit,
      });
      return;
    }
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
    // Study guides are paid-only (Master/Scholar). Free users get 402 and
    // the frontend renders a shown-but-locked surface in its place.
    const ent = await getEntitlements(userId);
    if (ent.studyGuideLocked) {
      res.status(402).json({
        error: "Study guides require a subscription",
        message: "Upgrade to PsychPro Master to unlock comprehensive study guides for every topic.",
      });
      return;
    }
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
    // Free-tier cap: 1 completed exam total (lifetime).
    const ent = await getEntitlements(userId);
    if (ent.examLocked) {
      res.status(402).json({
        error: "Free exam limit reached",
        message: `Free accounts can complete ${ent.examLimit} practice exam. Upgrade to PsychPro Master for unlimited practice exams.`,
        examsCompleted: ent.examsCompleted,
        examLimit: ent.examLimit,
      });
      return;
    }
    // Standard practice exams cap at 50 questions; full-length EPPP exams
    // (Part 1 / Part 2) need their entire linked pool, so allow up to 250 when
    // a higher count is explicitly requested. The result is still clamped to
    // the questions actually linked to this topic's exam (see finalCount below).
    const requestedCount = parseInt(String(req.query.count ?? "25")) || 25;
    const count = Math.min(Math.max(requestedCount, 1), 250);

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
    // Never silently deliver more than exists — clamp to availableCount.
    const availableCount = linkedQuestions.length;
    const finalCount = Math.min(count, availableCount);
    const shuffled = shuffle(linkedQuestions).slice(0, finalCount);

    res.json({
      id: exam.id,
      topicId: exam.topicId,
      title: exam.title,
      timeLimit: exam.timeLimit,
      passingScore: exam.passingScore,
      availableCount,
      questions: shuffled.map(({ questionOrder: _order, ...q }) => q),
    });
  } catch (err) {
    req.log.error({ err }, "Error getting practice exam");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
