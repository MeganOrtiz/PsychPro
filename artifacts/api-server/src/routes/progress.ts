import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { progressTable, topicsTable, usersTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { getAuth } from "@clerk/express";

const router = Router();

function getUserId(req: Request): string | null {
  return getAuth(req).userId ?? null;
}

router.get("/progress", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
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
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
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
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
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
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
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

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    const FREE_LIMIT = 10;

    res.json({
      totalTopics,
      topicsStudied,
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

export default router;
