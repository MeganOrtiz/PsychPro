import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { feedbackTable, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { getUserId, requireUserId } from "../lib/userId";
import { parseIntParam } from "../lib/params";

const router = Router();

// Dev-mode full-access: every authenticated request is treated as admin.
// Auto-upserts the user with isAdmin=true so subsequent DB-backed admin
// checks (and the feedback inbox queries) all see the admin flag.
async function requireAdmin(req: Request, res: Response): Promise<boolean> {
  const userId = requireUserId(req, res);
  if (!userId) return false;
  const [existing] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!existing) {
    await db.insert(usersTable).values({
      id: userId,
      subscriptionStatus: "scholar",
      isAdmin: true,
      onboardingComplete: true,
      usageCount: 0,
    });
  } else if (!existing.isAdmin) {
    await db.update(usersTable)
      .set({ isAdmin: true, subscriptionStatus: "scholar" })
      .where(eq(usersTable.id, userId));
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
    // Dev-mode: auto-upsert the caller as admin so the frontend admin UI
    // (Feedback Inbox link, admin-only panels) appears for every user
    // without requiring them to load /users/profile first.
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!existing) {
      await db.insert(usersTable).values({
        id: userId,
        subscriptionStatus: "scholar",
        isAdmin: true,
        onboardingComplete: true,
        usageCount: 0,
      });
    } else if (!existing.isAdmin) {
      await db.update(usersTable)
        .set({ isAdmin: true, subscriptionStatus: "scholar" })
        .where(eq(usersTable.id, userId));
    }
    res.json({ isAdmin: true });
  } catch {
    res.json({ isAdmin: true });
  }
});

router.post("/feedback", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
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

    const id = parseIntParam(req, res, "id");
    if (id === null) return;
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
