import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { and, eq, ne } from "drizzle-orm";
import { requireUserId } from "../lib/userId";
import { requireAdminCaller } from "../lib/isAdmin";
import { deleteUserAccount } from "../lib/accountDeletion";

const router = Router();
// Legacy free-interaction cap. The /users/usage routes are kept as no-ops
// for backward compatibility with older clients, but no new gating uses it.
const FREE_LIMIT = 10;

router.get("/users/profile", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    // Auto-create the user row on first access so the rest of the app has
    // something to read. New users start as "free" with no admin flag and
    // onboarding incomplete. Existing users are NEVER force-upgraded —
    // subscriptionStatus comes from Stripe webhooks, isAdmin from a manual
    // DB grant (see scripts/src/grant-admin.ts).
    let [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user) {
      [user] = await db.insert(usersTable).values({
        id: userId,
        subscriptionStatus: "free",
        isAdmin: false,
        onboardingComplete: false,
        usageCount: 0,
      }).returning();
    }
    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      goal: user.goal,
      degree: user.degree,
      referralSource: user.referralSource,
      subscriptionStatus: user.subscriptionStatus,
      onboardingComplete: user.onboardingComplete,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId,
      createdAt: user.createdAt?.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error getting user profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/users/profile", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const { email, role, goal, degree, referralSource, onboardingComplete } = req.body;
    const existing = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    let user;
    if (existing.length === 0) {
      [user] = await db.insert(usersTable).values({
        id: userId,
        email,
        role,
        goal,
        degree,
        referralSource,
        onboardingComplete: onboardingComplete ?? true,
        subscriptionStatus: "free",
        isAdmin: false,
        usageCount: 0,
      }).returning();
    } else {
      [user] = await db
        .update(usersTable)
        .set({ email, role, goal, degree, referralSource, onboardingComplete })
        .where(eq(usersTable.id, userId))
        .returning();
    }
    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      goal: user.goal,
      degree: user.degree,
      referralSource: user.referralSource,
      subscriptionStatus: user.subscriptionStatus,
      onboardingComplete: user.onboardingComplete,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId,
      createdAt: user.createdAt?.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error upserting user profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

// LEGACY: returns the legacy per-interaction counter for older clients.
// New free-tier gating lives in `/users/entitlements` (per-content caps).
router.get("/users/usage", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    const usageCount = user?.usageCount ?? 0;
    res.json({
      usageCount,
      freeLimit: FREE_LIMIT,
      isOverLimit: false,
    });
  } catch (err) {
    req.log.error({ err }, "Error getting user usage");
    res.status(500).json({ error: "Internal server error" });
  }
});

// LEGACY: now a no-op success. The free tier no longer meters per-interaction.
// Older clients still call this on flashcard flips / quiz answers; respond OK
// so they don't break, but do not increment any counter.
router.post("/users/usage", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    res.json({
      usageCount: user?.usageCount ?? 0,
      freeLimit: FREE_LIMIT,
      isOverLimit: false,
    });
  } catch (err) {
    req.log.error({ err }, "Error in legacy usage endpoint");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Self-service account deletion. Clerk's built-in self-serve delete (in the
// UserProfile modal) talks to the Clerk frontend API directly and was failing
// for this instance, so the app owns deletion server-side: cancel Stripe,
// wipe app data, then delete the Clerk identity. The frontend signs the user
// out afterwards.
router.delete("/users/me", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const result = await deleteUserAccount(userId);
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Error deleting own account");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: list OTHER accounts that share the caller's email. Surfaces the
// duplicate-identity case (same email, two Clerk users) so an admin can clean
// it up without signing into the duplicate.
router.get("/users/duplicates", async (req: Request, res: Response): Promise<void> => {
  try {
    const callerId = await requireAdminCaller(req, res);
    if (!callerId) return;
    const [me] = await db.select().from(usersTable).where(eq(usersTable.id, callerId));
    if (!me?.email) {
      res.json({ email: null, duplicates: [] });
      return;
    }
    const rows = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.email, me.email), ne(usersTable.id, callerId)));
    res.json({
      email: me.email,
      duplicates: rows.map((u) => ({
        id: u.id,
        email: u.email,
        subscriptionStatus: u.subscriptionStatus,
        isAdmin: u.isAdmin,
        createdAt: u.createdAt?.toISOString(),
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Error listing duplicate accounts");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: delete any account by id. Used to remove a duplicate identity. An
// admin cannot delete their own account through this route (use /users/me).
router.delete("/users/:userId", async (req: Request, res: Response): Promise<void> => {
  try {
    const callerId = await requireAdminCaller(req, res);
    if (!callerId) return;
    const targetId = String(req.params.userId);
    if (targetId === callerId) {
      res.status(400).json({ error: "Use the self-service delete to remove your own account." });
      return;
    }
    const result = await deleteUserAccount(targetId);
    if (!result.deleted) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Error deleting account by id");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
