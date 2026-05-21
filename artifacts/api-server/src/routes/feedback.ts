import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { feedbackTable, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { getUserId, requireUserId } from "../lib/userId";
import { parseIntParam } from "../lib/params";

const router = Router();

// Strict admin gate. The caller must already have isAdmin=true in the DB.
// Grant admin only via scripts/src/grant-admin.ts — never through a route.
async function requireAdmin(req: Request, res: Response): Promise<boolean> {
  const userId = requireUserId(req, res);
  if (!userId) return false;
  const [existing] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!existing || !existing.isAdmin) {
    res.status(403).json({ error: "Admin access required" });
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
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    res.json({ isAdmin: !!user?.isAdmin });
  } catch (err) {
    req.log.error({ err }, "Error checking admin status");
    // SECURITY: on error, default to NOT admin. Better to lock out a
    // legitimate admin during an outage than to grant admin to an
    // attacker during one.
    res.json({ isAdmin: false });
  }
});

const MIN_MESSAGE_LENGTH = 20;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/feedback", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const { type, message, submitterEmail } = req.body ?? {};

    const fieldErrors: Record<string, string> = {};
    const trimmedMessage = typeof message === "string" ? message.trim() : "";
    if (!trimmedMessage) {
      fieldErrors.message = "Message is required.";
    } else if (trimmedMessage.length < MIN_MESSAGE_LENGTH) {
      fieldErrors.message = `Message must be at least ${MIN_MESSAGE_LENGTH} characters.`;
    }

    let cleanEmail: string | null = null;
    if (submitterEmail != null && submitterEmail !== "") {
      if (typeof submitterEmail !== "string" || !EMAIL_RE.test(submitterEmail.trim())) {
        fieldErrors.submitterEmail = "Please enter a valid email address.";
      } else {
        cleanEmail = submitterEmail.trim();
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      res.status(400).json({ error: "Validation failed", fieldErrors });
      return;
    }

    // Auto-upsert the caller's user row so anonymous and signed-in callers
    // can both write feedback without tripping the FK constraint.
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!existing) {
      await db.insert(usersTable).values({
        id: userId,
        email: cleanEmail,
        subscriptionStatus: "free",
        onboardingComplete: false,
        usageCount: 0,
      }).onConflictDoNothing();
    } else if (cleanEmail && !existing.email) {
      // Backfill email if the user row has none yet.
      await db.update(usersTable).set({ email: cleanEmail }).where(eq(usersTable.id, userId));
    }

    const [entry] = await db.insert(feedbackTable).values({
      userId,
      submitterEmail: cleanEmail,
      type: typeof type === "string" && type ? type : "general",
      message: trimmedMessage,
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
        submitterEmail: feedbackTable.submitterEmail,
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
