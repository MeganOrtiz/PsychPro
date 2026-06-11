// =============================================================================
// File: apps/api-server/src/routes/mastery-exams.ts (NEW)
//
// Mount in your Express app (server.ts or wherever you wire routes):
//
//   import masteryExamsRouter from "./routes/mastery-exams";
//   app.use("/api", masteryExamsRouter);
//
// Routes:
//   GET  /api/courses
//   GET  /api/courses/:courseId
//   GET  /api/courses/:courseId/mastery-state
//   GET  /api/courses/:courseId/mastery-exam
//   POST /api/courses/:courseId/mastery-exam/attempt
//   GET  /api/users/me/course-mastery
// =============================================================================

import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import {
  coursesTable,
  topicsTable,
  quizQuestionsTable,
  practiceExamsTable,
  practiceExamQuestionsTable,
  masteryExamsTable,
  masteryExamQuestionsTable,
  masteryExamAttemptsTable,
  progressTable,
  usersTable,
} from "@workspace/db";
import { eq, and, count, asc, desc, sql, inArray, max } from "drizzle-orm";
import { requireUserId, getUserId } from "../lib/userId";
import { isCallerAdmin } from "../lib/isAdmin";
import { hasEpppAccess } from "../lib/entitlements";
import { isEpppCourse } from "../lib/eppp";

const router = Router();

const PRO_TIERS = new Set(["pro", "scholar"]);

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

async function getUserTier(userId: string | null): Promise<"free" | "pro" | "scholar"> {
  if (!userId) return "free";
  const [u] = await db
    .select({ status: usersTable.subscriptionStatus })
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  const s = u?.status ?? "free";
  if (s === "pro" || s === "scholar") return s;
  return "free";
}

/**
 * Returns the user's best practice-exam score for each topic in the course,
 * plus a derived "unlocked" boolean using the exam's unlockThreshold.
 */
async function getCourseUnlockState(
  userId: string | null,
  courseId: number,
  unlockThreshold: number,
  isAdmin = false,
) {
  const lessons = await db
    .select({ id: topicsTable.id, name: topicsTable.name })
    .from(topicsTable)
    .where(eq(topicsTable.courseId, courseId));

  if (lessons.length === 0) {
    return { unlocked: false, totalLessons: 0, masteredCount: 0, lessonStates: [] };
  }

  if (!userId) {
    return {
      unlocked: false,
      totalLessons: lessons.length,
      masteredCount: 0,
      lessonStates: lessons.map((l) => ({ ...l, bestScore: null, mastered: false })),
    };
  }

  const lessonIds = lessons.map((l) => l.id);
  const progressRows = await db
    .select({ topicId: progressTable.topicId, score: progressTable.score })
    .from(progressTable)
    .where(
      and(
        eq(progressTable.userId, userId),
        inArray(progressTable.topicId, lessonIds),
      ),
    );

  const scoreByTopic = new Map(progressRows.map((r) => [r.topicId, r.score]));
  const lessonStates = lessons.map((l) => {
    const bestScore = scoreByTopic.get(l.id) ?? null;
    return {
      id: l.id,
      name: l.name,
      bestScore,
      mastered: bestScore !== null && bestScore >= unlockThreshold,
    };
  });

  const masteredCount = lessonStates.filter((l) => l.mastered).length;
  // Admins (project owner / allowlisted staff) bypass the prerequisite so they
  // can preview and test any course's mastery exam without first acing every
  // lesson. Regular users still must master all lessons.
  const unlocked = isAdmin || masteredCount === lessons.length;

  return { unlocked, totalLessons: lessons.length, masteredCount, lessonStates };
}

async function getBestAttempt(userId: string, masteryExamId: number) {
  const [best] = await db
    .select({
      bestPercentage: max(masteryExamAttemptsTable.percentage),
    })
    .from(masteryExamAttemptsTable)
    .where(
      and(
        eq(masteryExamAttemptsTable.userId, userId),
        eq(masteryExamAttemptsTable.masteryExamId, masteryExamId),
      ),
    );

  const [{ attemptCount = 0 } = {}] = await db
    .select({ attemptCount: count() })
    .from(masteryExamAttemptsTable)
    .where(
      and(
        eq(masteryExamAttemptsTable.userId, userId),
        eq(masteryExamAttemptsTable.masteryExamId, masteryExamId),
      ),
    );

  return {
    bestPercentage: best?.bestPercentage ?? null,
    attemptCount: Number(attemptCount ?? 0),
  };
}

function deriveCourseMasteryState(
  unlocked: boolean,
  bestPercentage: number | null,
  passingScore: number,
  masteryScore: number,
): "locked" | "not_started" | "in_progress" | "passed" | "mastered" {
  if (!unlocked) return "locked";
  if (bestPercentage === null) return "not_started";
  if (bestPercentage >= masteryScore) return "mastered";
  if (bestPercentage >= passingScore) return "passed";
  return "in_progress";
}

// -----------------------------------------------------------------------------
// GET /api/courses
// List all courses with mastery-exam metadata and per-user state
// -----------------------------------------------------------------------------
router.get("/courses", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    const admin = await isCallerAdmin(req);

    const courses = await db
      .select()
      .from(coursesTable)
      .orderBy(asc(coursesTable.displayOrder));

    const result = await Promise.all(
      courses.map(async (course) => {
        const [lessonCount] = await db
          .select({ c: count() })
          .from(topicsTable)
          .where(eq(topicsTable.courseId, course.id));

        const [exam] = await db
          .select()
          .from(masteryExamsTable)
          .where(eq(masteryExamsTable.courseId, course.id));

        let masteryState: ReturnType<typeof deriveCourseMasteryState> = "locked";
        let bestPercentage: number | null = null;
        let unlocked = false;
        let masteredCount = 0;

        if (exam) {
          const unlockState = await getCourseUnlockState(
            userId,
            course.id,
            exam.unlockThreshold,
            admin,
          );
          unlocked = unlockState.unlocked;
          masteredCount = unlockState.masteredCount;

          if (userId) {
            const best = await getBestAttempt(userId, exam.id);
            bestPercentage = best.bestPercentage;
          }
          masteryState = deriveCourseMasteryState(
            unlocked,
            bestPercentage,
            exam.passingScore,
            exam.masteryScore,
          );
        }

        return {
          id: course.id,
          name: course.name,
          description: course.description,
          displayOrder: course.displayOrder,
          lessonCount: Number(lessonCount?.c ?? 0),
          masteryExam: exam
            ? {
                id: exam.id,
                title: exam.title,
                questionCount: exam.questionCount,
                timeLimitMinutes: exam.timeLimitMinutes,
                passingScore: exam.passingScore,
                masteryScore: exam.masteryScore,
                unlockThreshold: exam.unlockThreshold,
                unlocked,
                masteredCount,
                totalLessons: Number(lessonCount?.c ?? 0),
                bestPercentage,
                masteryState,
              }
            : null,
        };
      }),
    );

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Error listing courses");
    res.status(500).json({ error: "Internal server error" });
  }
});

// -----------------------------------------------------------------------------
// GET /api/courses/:courseId
// Course detail + lessons with per-user mastery state
// -----------------------------------------------------------------------------
router.get("/courses/:courseId", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    const admin = await isCallerAdmin(req);
    const courseId = parseInt(String(req.params.courseId));

    const [course] = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.id, courseId));
    if (!course) {
      res.status(404).json({ error: "Course not found" });
      return;
    }

    const [exam] = await db
      .select()
      .from(masteryExamsTable)
      .where(eq(masteryExamsTable.courseId, courseId));

    const unlockThreshold = exam?.unlockThreshold ?? 90;
    const unlockState = await getCourseUnlockState(userId, courseId, unlockThreshold, admin);

    let bestPercentage: number | null = null;
    let attemptCount = 0;
    if (exam && userId) {
      const best = await getBestAttempt(userId, exam.id);
      bestPercentage = best.bestPercentage;
      attemptCount = best.attemptCount;
    }

    const masteryState = exam
      ? deriveCourseMasteryState(
          unlockState.unlocked,
          bestPercentage,
          exam.passingScore,
          exam.masteryScore,
        )
      : "locked";

    res.json({
      id: course.id,
      name: course.name,
      description: course.description,
      lessons: unlockState.lessonStates,
      masteryExam: exam
        ? {
            id: exam.id,
            title: exam.title,
            questionCount: exam.questionCount,
            timeLimitMinutes: exam.timeLimitMinutes,
            passingScore: exam.passingScore,
            masteryScore: exam.masteryScore,
            unlockThreshold: exam.unlockThreshold,
            unlocked: unlockState.unlocked,
            masteredCount: unlockState.masteredCount,
            totalLessons: unlockState.totalLessons,
            bestPercentage,
            attemptCount,
            masteryState,
          }
        : null,
    });
  } catch (err) {
    req.log.error({ err }, "Error getting course");
    res.status(500).json({ error: "Internal server error" });
  }
});

// -----------------------------------------------------------------------------
// GET /api/courses/:courseId/mastery-state
// Compact endpoint for the dashboard or polling after a lesson exam
// -----------------------------------------------------------------------------
router.get("/courses/:courseId/mastery-state", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    const admin = await isCallerAdmin(req);
    const courseId = parseInt(String(req.params.courseId));

    const [exam] = await db
      .select()
      .from(masteryExamsTable)
      .where(eq(masteryExamsTable.courseId, courseId));

    if (!exam) {
      res.status(404).json({ error: "Mastery exam not found for this course" });
      return;
    }

    const unlockState = await getCourseUnlockState(userId, courseId, exam.unlockThreshold, admin);
    let bestPercentage: number | null = null;
    let attemptCount = 0;
    if (userId) {
      const best = await getBestAttempt(userId, exam.id);
      bestPercentage = best.bestPercentage;
      attemptCount = best.attemptCount;
    }

    res.json({
      unlocked: unlockState.unlocked,
      masteredCount: unlockState.masteredCount,
      totalLessons: unlockState.totalLessons,
      bestPercentage,
      attemptCount,
      masteryState: deriveCourseMasteryState(
        unlockState.unlocked,
        bestPercentage,
        exam.passingScore,
        exam.masteryScore,
      ),
    });
  } catch (err) {
    req.log.error({ err }, "Error getting mastery state");
    res.status(500).json({ error: "Internal server error" });
  }
});

// -----------------------------------------------------------------------------
// GET /api/courses/:courseId/mastery-exam
// Returns exam metadata + a randomized question sample.
// Enforces paywall (402) AND prerequisite (403).
// -----------------------------------------------------------------------------
router.get("/courses/:courseId/mastery-exam", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const courseId = parseInt(String(req.params.courseId));
    const admin = await isCallerAdmin(req);
    // EPPP courses gate on EPPP access; general courses gate on Master/Scholar.
    const eppp = await isEpppCourse(courseId);
    const paidOk = eppp ? await hasEpppAccess(userId) : PRO_TIERS.has(await getUserTier(userId));
    if (!admin && !paidOk) {
      res.status(402).json({
        error: eppp ? "EPPP Mastery Suite access required" : "Mastery Exams require a paid plan",
        upgrade: true,
        eppp,
      });
      return;
    }

    const [exam] = await db
      .select()
      .from(masteryExamsTable)
      .where(eq(masteryExamsTable.courseId, courseId));
    if (!exam) {
      res.status(404).json({ error: "Mastery exam not found for this course" });
      return;
    }

    const unlockState = await getCourseUnlockState(userId, courseId, exam.unlockThreshold, admin);
    if (!unlockState.unlocked) {
      res.status(403).json({
        error: "Mastery Exam locked",
        reason: "prerequisite_not_met",
        masteredCount: unlockState.masteredCount,
        totalLessons: unlockState.totalLessons,
        unlockThreshold: exam.unlockThreshold,
      });
      return;
    }

    // Pull the full question pool, then random-sample down to exam.questionCount
    const pool = await db
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
      })
      .from(masteryExamQuestionsTable)
      .innerJoin(
        quizQuestionsTable,
        eq(masteryExamQuestionsTable.questionId, quizQuestionsTable.id),
      )
      .where(eq(masteryExamQuestionsTable.masteryExamId, exam.id));

    if (pool.length === 0) {
      res.status(503).json({
        error: "Mastery exam question pool not yet populated",
      });
      return;
    }

    // Fisher–Yates shuffle
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const served = shuffled.slice(0, Math.min(exam.questionCount, pool.length));

    res.json({
      id: exam.id,
      courseId,
      title: exam.title,
      questionCount: served.length,
      poolSize: pool.length,
      timeLimitMinutes: exam.timeLimitMinutes,
      passingScore: exam.passingScore,
      masteryScore: exam.masteryScore,
      questions: served,
    });
  } catch (err) {
    req.log.error({ err }, "Error getting mastery exam");
    res.status(500).json({ error: "Internal server error" });
  }
});

// -----------------------------------------------------------------------------
// POST /api/courses/:courseId/mastery-exam/attempt
// Record an attempt. Server re-validates prerequisite + paywall.
// -----------------------------------------------------------------------------
router.post(
  "/courses/:courseId/mastery-exam/attempt",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = requireUserId(req, res);
      if (!userId) return;

      const courseId = parseInt(String(req.params.courseId));
      const { score, total } = req.body as { score?: number; total?: number };
      if (typeof score !== "number" || typeof total !== "number" || total <= 0) {
        res.status(400).json({ error: "score and total are required and total must be > 0" });
        return;
      }

      const admin = await isCallerAdmin(req);
      const eppp = await isEpppCourse(courseId);
      const paidOk = eppp ? await hasEpppAccess(userId) : PRO_TIERS.has(await getUserTier(userId));
      if (!admin && !paidOk) {
        res.status(402).json({ error: eppp ? "EPPP Mastery Suite access required" : "Mastery Exams require a paid plan", eppp });
        return;
      }

      const [exam] = await db
        .select()
        .from(masteryExamsTable)
        .where(eq(masteryExamsTable.courseId, courseId));
      if (!exam) {
        res.status(404).json({ error: "Mastery exam not found for this course" });
        return;
      }

      const unlockState = await getCourseUnlockState(userId, courseId, exam.unlockThreshold, admin);
      if (!unlockState.unlocked) {
        res.status(403).json({ error: "Mastery Exam locked", reason: "prerequisite_not_met" });
        return;
      }

      const percentage = Math.round((score / total) * 100);

      const [created] = await db
        .insert(masteryExamAttemptsTable)
        .values({
          userId,
          masteryExamId: exam.id,
          score,
          total,
          percentage,
        })
        .returning();

      // Recompute course-level state to return to client
      const best = await getBestAttempt(userId, exam.id);
      const masteryState = deriveCourseMasteryState(
        true,
        best.bestPercentage,
        exam.passingScore,
        exam.masteryScore,
      );

      res.json({
        attempt: created,
        bestPercentage: best.bestPercentage,
        attemptCount: best.attemptCount,
        masteryState,
        newlyMastered:
          best.bestPercentage !== null &&
          best.bestPercentage >= exam.masteryScore &&
          percentage >= exam.masteryScore,
      });
    } catch (err) {
      req.log.error({ err }, "Error recording mastery exam attempt");
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// -----------------------------------------------------------------------------
// GET /api/users/me/course-mastery
// Compact dashboard payload — one row per course
// -----------------------------------------------------------------------------
router.get("/users/me/course-mastery", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const admin = await isCallerAdmin(req);

    const courses = await db
      .select()
      .from(coursesTable)
      .orderBy(asc(coursesTable.displayOrder));

    const out = await Promise.all(
      courses.map(async (course) => {
        const [exam] = await db
          .select()
          .from(masteryExamsTable)
          .where(eq(masteryExamsTable.courseId, course.id));

        if (!exam) {
          return {
            courseId: course.id,
            courseName: course.name,
            masteryState: "locked" as const,
            bestPercentage: null,
            unlocked: false,
            masteredCount: 0,
            totalLessons: 0,
          };
        }

        const unlockState = await getCourseUnlockState(userId, course.id, exam.unlockThreshold, admin);
        const best = await getBestAttempt(userId, exam.id);
        return {
          courseId: course.id,
          courseName: course.name,
          masteryState: deriveCourseMasteryState(
            unlockState.unlocked,
            best.bestPercentage,
            exam.passingScore,
            exam.masteryScore,
          ),
          bestPercentage: best.bestPercentage,
          unlocked: unlockState.unlocked,
          masteredCount: unlockState.masteredCount,
          totalLessons: unlockState.totalLessons,
        };
      }),
    );

    res.json(out);
  } catch (err) {
    req.log.error({ err }, "Error getting course mastery summary");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
