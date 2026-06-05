import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import {
  topicsTable,
  quizQuestionsTable,
  progressTable,
  courseMasteryAttemptsTable,
} from "@workspace/db";
import { eq, and, inArray } from "drizzle-orm";
import { requireUserId } from "../lib/userId";
import { shuffle } from "../lib/shuffle";

const router = Router();

// A topic is "completed" once its progress score reaches this threshold —
// mirrors COMPLETION_THRESHOLD in progress.ts.
const COMPLETION_THRESHOLD = 70;
// Mastery exams require a higher bar than the per-topic 70% pass mark.
const MASTERY_PASSING_SCORE = 90;
// Question pool is clamped to this ceiling; the floor (50) is naturally honored
// whenever the course has at least that many questions available.
const MASTERY_MAX_QUESTIONS = 100;

router.get("/courses/:category/mastery-exam", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const category = decodeURIComponent(String(req.params.category));

    const topics = await db.select().from(topicsTable).where(eq(topicsTable.category, category));
    if (topics.length === 0) {
      res.status(404).json({ error: "Course not found" });
      return;
    }
    const topicIds = topics.map((t) => t.id);

    // Gate: EVERY topic in the course must be completed before the mastery
    // exam unlocks. Enforced server-side so the lock can't be bypassed by
    // navigating straight to the URL.
    const progressRows = await db
      .select({ topicId: progressTable.topicId, score: progressTable.score })
      .from(progressTable)
      .where(and(eq(progressTable.userId, userId), inArray(progressTable.topicId, topicIds)));
    const completed = new Set(
      progressRows.filter((r) => r.score >= COMPLETION_THRESHOLD).map((r) => r.topicId),
    );
    const completedCount = topicIds.filter((id) => completed.has(id)).length;
    if (completedCount < topicIds.length) {
      res.status(403).json({
        error: "Course not yet completed",
        message: `Complete all ${topicIds.length} lessons in ${category} to unlock the Course Mastery Exam.`,
        completedTopics: completedCount,
        totalTopics: topicIds.length,
      });
      return;
    }

    // Pool every quiz question across the course's topics. Comprehensive by
    // design — the mastery exam draws from the entire course, not one topic.
    const questions = await db
      .select()
      .from(quizQuestionsTable)
      .where(inArray(quizQuestionsTable.topicId, topicIds));
    const availableCount = questions.length;
    if (availableCount === 0) {
      res.status(404).json({ error: "No questions available for this course" });
      return;
    }

    // 50–100 questions depending on how much content the course has: use up to
    // 100, and everything available when the course has fewer than 100.
    const finalCount = Math.min(availableCount, MASTERY_MAX_QUESTIONS);
    const shuffled = shuffle(questions).slice(0, finalCount);
    // 1 minute per question.
    const timeLimit = finalCount * 60;

    res.json({
      category,
      title: `${category} Mastery Exam`,
      passingScore: MASTERY_PASSING_SCORE,
      timeLimit,
      availableCount,
      totalTopics: topicIds.length,
      questions: shuffled.map((q) => ({
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
    req.log.error({ err }, "Error getting course mastery exam");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/course-mastery-attempts", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const body = req.body as { category?: unknown; score?: unknown; correct?: unknown; total?: unknown };
    const category = typeof body.category === "string" ? body.category.trim() : "";
    const score = Number(body.score);
    const correct = Number(body.correct);
    const total = Number(body.total);
    if (
      !category ||
      !Number.isInteger(total) || total <= 0 ||
      !Number.isInteger(correct) || correct < 0 || correct > total ||
      !Number.isInteger(score) || score < 0 || score > 100
    ) {
      res.status(400).json({
        error: "category is required; correct/total/score must be valid integers (0 <= correct <= total, 0 <= score <= 100)",
      });
      return;
    }
    const passed = score >= MASTERY_PASSING_SCORE;
    const [row] = await db
      .insert(courseMasteryAttemptsTable)
      .values({ userId, category, score, correct, total, passed })
      .returning();
    res.json({
      id: row.id,
      category: row.category,
      score: row.score,
      correct: row.correct,
      total: row.total,
      passed: row.passed,
      completedAt: row.completedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error recording course mastery attempt");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
