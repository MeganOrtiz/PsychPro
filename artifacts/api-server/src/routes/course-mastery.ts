import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import {
  topicsTable,
  quizQuestionsTable,
  examAttemptsTable,
  courseMasteryAttemptsTable,
} from "@workspace/db";
import { eq, and, inArray } from "drizzle-orm";
import { requireUserId } from "../lib/userId";
import { isCallerAdmin } from "../lib/isAdmin";
import { shuffle } from "../lib/shuffle";

const router = Router();

// A lesson's PRACTICE EXAM must be passed at this percentage before it counts
// toward unlocking the Course Mastery Exam. Owner-defined gate: every lesson in
// the course must have a practice-exam attempt scoring >= this.
const PRACTICE_EXAM_PASS_PCT = 90;
// The Course Mastery Exam itself must be passed at this percentage for the
// course to be considered "mastered".
const MASTERY_PASSING_SCORE = 90;
// Question pool is clamped to this ceiling; the floor (50) is naturally honored
// whenever the course has at least that many questions available.
const MASTERY_MAX_QUESTIONS = 100;

interface LessonStatus {
  topicId: number;
  name: string;
  bestExamPct: number | null;
  passed: boolean;
}

interface CourseMasteryStatus {
  category: string;
  unlocked: boolean;
  mastered: boolean;
  passingScore: number;
  totalTopics: number;
  passedTopics: number;
  bestMasteryScore: number | null;
  lessons: LessonStatus[];
}

// Single source of truth for unlock/mastery state, shared by both the
// mastery-exam gate and the status endpoint so the UI and the server can never
// disagree about whether a course is unlocked.
async function computeCourseMasteryStatus(
  userId: string,
  category: string,
  isAdmin = false,
): Promise<CourseMasteryStatus | null> {
  const topics = await db.select().from(topicsTable).where(eq(topicsTable.category, category));
  if (topics.length === 0) return null;
  const topicIds = topics.map((t) => t.id);

  // Best practice-exam percentage per topic. examAttempts.score is the raw
  // correct count (0..total), so the percentage is correct/total.
  const attempts = await db
    .select({
      topicId: examAttemptsTable.topicId,
      score: examAttemptsTable.score,
      total: examAttemptsTable.total,
    })
    .from(examAttemptsTable)
    .where(and(eq(examAttemptsTable.userId, userId), inArray(examAttemptsTable.topicId, topicIds)));
  // Track the best EXACT ratio (correct/total) per topic. The pass decision must
  // use the exact ratio, not a rounded percentage — rounding would let 89.6%
  // round up to 90 and wrongly unlock a lesson that did not truly hit >= 90%.
  const bestRatio = new Map<number, number>();
  for (const a of attempts) {
    if (!a.total || a.total <= 0) continue;
    const ratio = a.score / a.total;
    const prev = bestRatio.get(a.topicId);
    if (prev === undefined || ratio > prev) bestRatio.set(a.topicId, ratio);
  }

  const lessons: LessonStatus[] = topics.map((t) => {
    const ratio = bestRatio.has(t.id) ? bestRatio.get(t.id)! : null;
    return {
      topicId: t.id,
      name: t.name,
      // Rounded percentage purely for display.
      bestExamPct: ratio === null ? null : Math.round(ratio * 100),
      // Exact-ratio comparison for the gate.
      passed: ratio !== null && ratio * 100 >= PRACTICE_EXAM_PASS_PCT,
    };
  });
  const passedTopics = lessons.filter((l) => l.passed).length;
  // Admins (project owner / allowlisted staff) bypass the prerequisite so they
  // can preview any course's mastery exam without acing every lesson first.
  const unlocked = lessons.length > 0 && (isAdmin || passedTopics === lessons.length);

  const masteryRows = await db
    .select({ score: courseMasteryAttemptsTable.score, passed: courseMasteryAttemptsTable.passed })
    .from(courseMasteryAttemptsTable)
    .where(and(eq(courseMasteryAttemptsTable.userId, userId), eq(courseMasteryAttemptsTable.category, category)));
  const mastered = masteryRows.some((r) => r.passed);
  const bestMasteryScore = masteryRows.length
    ? Math.max(...masteryRows.map((r) => r.score))
    : null;

  return {
    category,
    unlocked,
    mastered,
    passingScore: MASTERY_PASSING_SCORE,
    totalTopics: topics.length,
    passedTopics,
    bestMasteryScore,
    lessons,
  };
}

// Lightweight unlock/mastery summary for a course. Drives the mastery-exam
// button's locked/unlocked state and the per-lesson progress display without
// fetching the (potentially large) exam itself.
router.get("/courses/:category/mastery-status", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const category = decodeURIComponent(String(req.params.category));
    const admin = await isCallerAdmin(req);
    const status = await computeCourseMasteryStatus(userId, category, admin);
    if (!status) {
      res.status(404).json({ error: "Course not found" });
      return;
    }
    res.json(status);
  } catch (err) {
    req.log.error({ err }, "Error getting course mastery status");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/courses/:category/mastery-exam", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const category = decodeURIComponent(String(req.params.category));

    const admin = await isCallerAdmin(req);
    const status = await computeCourseMasteryStatus(userId, category, admin);
    if (!status) {
      res.status(404).json({ error: "Course not found" });
      return;
    }

    // Gate: EVERY lesson in the course must have its PRACTICE EXAM passed at
    // >= 90% before the mastery exam unlocks. Enforced server-side so the lock
    // can't be bypassed by navigating straight to the URL.
    if (!status.unlocked) {
      res.status(403).json({
        error: "Course not yet unlocked",
        message: `Score ${PRACTICE_EXAM_PASS_PCT}% or higher on the practice exam for all ${status.totalTopics} lessons in ${category} to unlock the Course Mastery Exam.`,
        passedTopics: status.passedTopics,
        totalTopics: status.totalTopics,
      });
      return;
    }

    const topics = await db.select().from(topicsTable).where(eq(topicsTable.category, category));
    const topicIds = topics.map((t) => t.id);

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
