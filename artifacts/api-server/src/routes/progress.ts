import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import {
  progressTable,
  topicsTable,
  usersTable,
  quizAttemptsTable,
  examAttemptsTable,
} from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireUserId } from "../lib/userId";

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
    const topicId = parseInt(String(req.params.topicId));
    const { score } = req.body as { score: number };
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
): Promise<void> {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const body = req.body as { topicId?: number; score?: number; total?: number };
    const topicId = Number(body.topicId);
    const score = Number(body.score);
    const total = Number(body.total);
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
    const [row] = await db
      .insert(table)
      .values({ userId, topicId, score, total })
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

router.post("/quiz-attempts", (req, res) => recordAttempt(req, res, quizAttemptsTable));
router.post("/exam-attempts", (req, res) => recordAttempt(req, res, examAttemptsTable));

export default router;
