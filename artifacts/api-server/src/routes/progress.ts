import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import {
  progressTable,
  topicsTable,
  usersTable,
  quizAttemptsTable,
  examAttemptsTable,
  quizQuestionsTable,
  practiceExamsTable,
  practiceExamQuestionsTable,
} from "@workspace/db";
import { eq, and, desc, inArray } from "drizzle-orm";
import { requireUserId } from "../lib/userId";
import { getEntitlements } from "../lib/entitlements";

const router = Router();

const COMPLETION_THRESHOLD = 70;

function startOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function dayKey(d: Date) {
  return startOfDay(d).toISOString();
}

function computeStreakFromDates(dates: (Date | null | undefined)[]) {
  const days = new Set(
    dates
      .filter((d): d is Date => d != null)
      .map((d) => dayKey(d))
  );
  let streak = 0;
  const cursor = startOfDay(new Date());
  while (days.has(cursor.toISOString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

router.get("/progress", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const rows = await db
      .select({
        id: progressTable.id,
        userId: progressTable.userId,
        topicId: progressTable.topicId,
        score: progressTable.score,
        lastAccessed: progressTable.lastAccessed,
        topicName: topicsTable.name,
      })
      .from(progressTable)
      .leftJoin(topicsTable, eq(progressTable.topicId, topicsTable.id))
      .where(eq(progressTable.userId, userId))
      .orderBy(desc(progressTable.lastAccessed));
    res.json(rows.map(r => ({ ...r, topicName: r.topicName ?? "", lastAccessed: r.lastAccessed?.toISOString() })));
  } catch (err) {
    req.log.error({ err }, "Error getting progress");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/progress/:topicId", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const topicId = parseInt(String(req.params.topicId));
    const [row] = await db
      .select({
        id: progressTable.id,
        userId: progressTable.userId,
        topicId: progressTable.topicId,
        score: progressTable.score,
        lastAccessed: progressTable.lastAccessed,
        topicName: topicsTable.name,
      })
      .from(progressTable)
      .leftJoin(topicsTable, eq(progressTable.topicId, topicsTable.id))
      .where(and(eq(progressTable.userId, userId), eq(progressTable.topicId, topicId)));
    if (!row) {
      res.status(404).json({ error: "Progress not found" });
      return;
    }
    res.json({ ...row, topicName: row.topicName ?? "", lastAccessed: row.lastAccessed?.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Error getting topic progress");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/progress/:topicId", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    // Strict path-param parsing: reject anything that isn't a pure decimal
    // integer. parseInt would silently accept "12abc" → 12, masking client
    // bugs and letting partial garbage through to the DB lookup.
    const rawTopicId = String(req.params.topicId);
    const topicId = /^\d+$/.test(rawTopicId) ? Number(rawTopicId) : NaN;
    if (!Number.isInteger(topicId) || topicId <= 0) {
      res.status(400).json({ error: "topicId must be a positive integer" });
      return;
    }
    // Strict body validation: score must arrive as a JSON number in [0,100].
    // We deliberately reject strings ("80"), NaN, Infinity, booleans, etc.
    // — the raw value flows straight into the DB row, so any laxness here
    // corrupts downstream dashboard stats (averageScore, weakAreas,
    // completion threshold).
    const rawScore = (req.body as { score?: unknown } | null)?.score;
    if (typeof rawScore !== "number" || !Number.isInteger(rawScore) || rawScore < 0 || rawScore > 100) {
      res.status(400).json({ error: "score must be a JSON integer between 0 and 100" });
      return;
    }
    const score = rawScore;
    const [topic] = await db.select().from(topicsTable).where(eq(topicsTable.id, topicId));
    const existing = await db
      .select()
      .from(progressTable)
      .where(and(eq(progressTable.userId, userId), eq(progressTable.topicId, topicId)));
    let row;
    if (existing.length === 0) {
      [row] = await db.insert(progressTable).values({ userId, topicId, score, lastAccessed: new Date() }).returning();
    } else {
      [row] = await db
        .update(progressTable)
        .set({ score, lastAccessed: new Date() })
        .where(and(eq(progressTable.userId, userId), eq(progressTable.topicId, topicId)))
        .returning();
    }
    res.json({ ...row, topicName: topic?.name ?? "", lastAccessed: row.lastAccessed?.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Error updating progress");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/dashboard/summary", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const allTopicsRows = await db.select().from(topicsTable);
    const totalTopics = allTopicsRows.length;

    const progressRows = await db
      .select({
        id: progressTable.id,
        userId: progressTable.userId,
        topicId: progressTable.topicId,
        score: progressTable.score,
        lastAccessed: progressTable.lastAccessed,
        topicName: topicsTable.name,
      })
      .from(progressTable)
      .leftJoin(topicsTable, eq(progressTable.topicId, topicsTable.id))
      .where(eq(progressTable.userId, userId))
      .orderBy(desc(progressTable.lastAccessed));

    const topicsStudied = progressRows.length;
    const avgScore = topicsStudied > 0
      ? Math.round(progressRows.reduce((sum, r) => sum + r.score, 0) / topicsStudied)
      : 0;

    const recentTopics = progressRows.slice(0, 5).map(r => ({ ...r, topicName: r.topicName ?? "", lastAccessed: r.lastAccessed?.toISOString() }));
    const weakAreas = [...progressRows].sort((a, b) => a.score - b.score).slice(0, 5).map(r => ({ ...r, topicName: r.topicName ?? "", lastAccessed: r.lastAccessed?.toISOString() }));

    const topicsCompleted = new Set(
      progressRows.filter((r) => r.score >= COMPLETION_THRESHOLD).map((r) => r.topicId),
    ).size;

    const quizAttempts = await db
      .select({ id: quizAttemptsTable.id, completedAt: quizAttemptsTable.completedAt })
      .from(quizAttemptsTable)
      .where(eq(quizAttemptsTable.userId, userId));
    const examAttempts = await db
      .select({ id: examAttemptsTable.id, completedAt: examAttemptsTable.completedAt })
      .from(examAttemptsTable)
      .where(eq(examAttemptsTable.userId, userId));

    const allDates: (Date | null | undefined)[] = [
      ...progressRows.map((r) => r.lastAccessed),
      ...quizAttempts.map((a) => a.completedAt),
      ...examAttempts.map((a) => a.completedAt),
    ];
    const currentStreak = computeStreakFromDates(allDates);

    // Build weeklyActivity: Sunday-anchored current week, one entry per day,
    // marked active if any progress/quiz/exam activity was recorded that day.
    const today = startOfDay(new Date());
    const daysActive = new Set(
      allDates.filter((d): d is Date => d != null).map((d) => dayKey(d)),
    );
    const weekStart = startOfDay(new Date(today));
    weekStart.setDate(today.getDate() - today.getDay()); // Sunday
    const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return { date: d.toISOString(), active: daysActive.has(dayKey(d)) };
    });

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    const FREE_LIMIT = 10;

    res.json({
      totalTopics,
      topicsStudied,
      topicsCompleted,
      quizzesCompleted: quizAttempts.length,
      examsCompleted: examAttempts.length,
      currentStreak,
      averageScore: avgScore,
      recentTopics,
      weakAreas,
      weeklyActivity,
      subscriptionStatus: user?.subscriptionStatus ?? "free",
      usageCount: user?.usageCount ?? 0,
      freeLimit: FREE_LIMIT,
    });
  } catch (err) {
    req.log.error({ err }, "Error getting dashboard summary");
    res.status(500).json({ error: "Internal server error" });
  }
});

async function recordAttempt(
  req: Request,
  res: Response,
  table: typeof quizAttemptsTable | typeof examAttemptsTable,
  kind: "quiz" | "exam",
): Promise<void> {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const body = req.body as { topicId?: number; score?: number; total?: number; missedQuestionIds?: unknown };
    const topicId = Number(body.topicId);
    const score = Number(body.score);
    const total = Number(body.total);
    const rawMissedIds = Array.isArray(body.missedQuestionIds)
      ? [...new Set(
          body.missedQuestionIds
            .map((n) => Number(n))
            .filter((n) => Number.isInteger(n) && n > 0),
        )]
      : [];
    if (
      !Number.isInteger(topicId) || topicId <= 0 ||
      !Number.isInteger(total) || total <= 0 ||
      !Number.isInteger(score) || score < 0 || score > total
    ) {
      res.status(400).json({
        error: "topicId must be a positive integer, total must be a positive integer, and score must be an integer between 0 and total",
      });
      return;
    }

    // Server-authoritative free-tier cap enforcement. The content-fetch
    // routes (/topics/:id/quizzes, /topics/:id/practice-exam) also block
    // free users at the cap, but the Retake button reuses already-fetched
    // questions and would otherwise let a free user submit unlimited
    // attempts. We re-check here so the cap is enforced at the write
    // boundary too.
    const ent = await getEntitlements(userId);
    const locked = kind === "quiz" ? ent.quizLocked : ent.examLocked;
    if (locked) {
      const limit = kind === "quiz" ? ent.quizLimit : ent.examLimit;
      const completed = kind === "quiz" ? ent.quizzesCompleted : ent.examsCompleted;
      res.status(402).json({
        error: `Free ${kind} limit reached`,
        message: `Free accounts can complete ${limit} ${kind} total. Upgrade to PsychPro Master for unlimited ${kind}s.`,
        [`${kind}sCompleted`]: completed,
        [`${kind}Limit`]: limit,
      });
      return;
    }

    // Never trust client-supplied missed-question IDs. They are later resolved
    // to full question text/options/explanations by GET /eppp/missed-questions,
    // so a forged ID could leak content from unrelated or locked topics. Keep
    // only IDs that actually belong to the question set this attempt could have
    // served: quiz attempts -> the topic's quizzable questions; exam attempts ->
    // the questions linked to the topic's practice/full-length exam.
    let missedQuestionIds: number[] | undefined = undefined;
    if (rawMissedIds.length > 0) {
      let allowedRows: { id: number }[];
      if (kind === "quiz") {
        allowedRows = await db
          .select({ id: quizQuestionsTable.id })
          .from(quizQuestionsTable)
          .where(
            and(
              eq(quizQuestionsTable.topicId, topicId),
              inArray(quizQuestionsTable.id, rawMissedIds),
            ),
          );
      } else {
        allowedRows = await db
          .select({ id: practiceExamQuestionsTable.questionId })
          .from(practiceExamQuestionsTable)
          .innerJoin(
            practiceExamsTable,
            eq(practiceExamQuestionsTable.examId, practiceExamsTable.id),
          )
          .where(
            and(
              eq(practiceExamsTable.topicId, topicId),
              inArray(practiceExamQuestionsTable.questionId, rawMissedIds),
            ),
          );
      }
      const allowed = new Set(allowedRows.map((r) => r.id));
      const valid = rawMissedIds.filter((id) => allowed.has(id));
      missedQuestionIds = valid.length > 0 ? valid : undefined;
    }

    const [row] = await db
      .insert(table)
      .values({ userId, topicId, score, total, missedQuestionIds })
      .returning();
    res.json({
      id: row.id,
      topicId: row.topicId,
      score: row.score,
      total: row.total,
      completedAt: row.completedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error recording attempt");
    res.status(500).json({ error: "Internal server error" });
  }
}

router.post("/quiz-attempts", (req, res) => recordAttempt(req, res, quizAttemptsTable, "quiz"));
router.post("/exam-attempts", (req, res) => recordAttempt(req, res, examAttemptsTable, "exam"));

// Aggregate the questions this user has answered incorrectly across every
// quiz AND practice/full-length exam attempt. We return each missed
// question joined to its HOME topic (name + category) and a `timesMissed`
// count; part/domain bucketing is done client-side so the EPPP taxonomy
// stays in one place (eppp-content.ts). Legacy attempts with no
// `missedQuestionIds` simply contribute nothing.
router.get("/eppp/missed-questions", async (req, res) => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const [quizRows, examRows] = await Promise.all([
      db
        .select({ missed: quizAttemptsTable.missedQuestionIds })
        .from(quizAttemptsTable)
        .where(eq(quizAttemptsTable.userId, userId)),
      db
        .select({ missed: examAttemptsTable.missedQuestionIds })
        .from(examAttemptsTable)
        .where(eq(examAttemptsTable.userId, userId)),
    ]);

    const counts = new Map<number, number>();
    for (const r of [...quizRows, ...examRows]) {
      for (const id of r.missed ?? []) {
        counts.set(id, (counts.get(id) ?? 0) + 1);
      }
    }

    const ids = [...counts.keys()];
    if (ids.length === 0) {
      res.json({ questions: [] });
      return;
    }

    const rows = await db
      .select({
        id: quizQuestionsTable.id,
        question: quizQuestionsTable.question,
        optionA: quizQuestionsTable.optionA,
        optionB: quizQuestionsTable.optionB,
        optionC: quizQuestionsTable.optionC,
        optionD: quizQuestionsTable.optionD,
        correctAnswer: quizQuestionsTable.correctAnswer,
        explanation: quizQuestionsTable.explanation,
        topicId: topicsTable.id,
        topicName: topicsTable.name,
        topicCategory: topicsTable.category,
      })
      .from(quizQuestionsTable)
      .innerJoin(topicsTable, eq(quizQuestionsTable.topicId, topicsTable.id))
      .where(inArray(quizQuestionsTable.id, ids));

    const questions = rows
      .map((r) => ({ ...r, timesMissed: counts.get(r.id) ?? 1 }))
      .sort((a, b) => b.timesMissed - a.timesMissed);

    res.json({ questions });
  } catch (err) {
    req.log.error({ err }, "Error fetching missed questions");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
