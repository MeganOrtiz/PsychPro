import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { feedbackTable, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { getAuth } from "@clerk/express";

const router = Router();

function getUserId(req: Request): string | null {
  return getAuth(req).userId ?? null;
}

async function requireAdmin(req: Request, res: Response): Promise<boolean> {
  const userId = getUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user?.isAdmin) {
    res.status(403).json({ error: "Forbidden" });
    return false;
  }
  return true;
}

router.get("/feedback/is-admin", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.json({ isAdmin: false });
      return;
    }
    const [user] = await db.select({ isAdmin: usersTable.isAdmin }).from(usersTable).where(eq(usersTable.id, userId));
    res.json({ isAdmin: user?.isAdmin ?? false });
  } catch {
    res.json({ isAdmin: false });
  }
});

router.post("/feedback", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { type, message } = req.body;
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      res.status(400).json({ error: "Message is required" });
      return;
    }
    const [entry] = await db.insert(feedbackTable).values({
      userId,
      type: type || "general",
      message: message.trim(),
      status: "unread",
    }).returning();
    res.status(201).json(entry);
  } catch (err) {
    req.log.error({ err }, "Error submitting feedback");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/feedback", async (req: Request, res: Response): Promise<void> => {
  try {
    const isAdmin = await requireAdmin(req, res);
    if (!isAdmin) return;

    const entries = await db
      .select({
        id: feedbackTable.id,
        userId: feedbackTable.userId,
        email: usersTable.email,
        role: usersTable.role,
        type: feedbackTable.type,
        message: feedbackTable.message,
        status: feedbackTable.status,
        createdAt: feedbackTable.createdAt,
      })
      .from(feedbackTable)
      .leftJoin(usersTable, eq(feedbackTable.userId, usersTable.id))
      .orderBy(desc(feedbackTable.createdAt));

    res.json(entries);
  } catch (err) {
    req.log.error({ err }, "Error fetching feedback");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/feedback/:id/status", async (req: Request, res: Response): Promise<void> => {
  try {
    const isAdmin = await requireAdmin(req, res);
    if (!isAdmin) return;

    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    if (!["unread", "read", "resolved"].includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }
    const [updated] = await db
      .update(feedbackTable)
      .set({ status })
      .where(eq(feedbackTable.id, id))
      .returning();
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Error updating feedback status");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
