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

// --- onboarding field sanitizers -------------------------------------------
// The in-depth onboarding flow (Task #145) sends free-form-ish answers chosen
// from fixed client option sets. We don't hard-validate against an allow-list
// (that would couple the server to the client copy and break when options are
// reworded), but we DO clamp shape + length so nothing unbounded lands in the
// DB.
const MAX_FIELD_LEN = 120;
const MAX_GOALS = 24;

function cleanStr(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const trimmed = v.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, MAX_FIELD_LEN);
}

// learningGoals is stored as a JSON-encoded string[] in a single text column.
function encodeGoals(v: unknown): string | undefined {
  if (!Array.isArray(v)) return undefined;
  const goals = Array.from(
    new Set(
      v
        .map((g) => (typeof g === "string" ? g.trim().slice(0, MAX_FIELD_LEN) : ""))
        .filter((g) => g.length > 0),
    ),
  ).slice(0, MAX_GOALS);
  return JSON.stringify(goals);
}

function decodeGoals(v: unknown): string[] {
  if (typeof v !== "string" || !v) return [];
  try {
    const parsed = JSON.parse(v);
    if (Array.isArray(parsed)) {
      return parsed.filter((g): g is string => typeof g === "string");
    }
  } catch {
    // legacy / malformed value — treat as empty rather than throwing
  }
  return [];
}

function serializeProfile(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    goal: user.goal,
    degree: user.degree,
    referralSource: user.referralSource,
    learnerRole: user.learnerRole,
    learningGoals: decodeGoals(user.learningGoals),
    studyFocus: user.studyFocus,
    epppInterest: user.epppInterest,
    selectedTier: user.selectedTier,
    selectedProduct: user.selectedProduct,
    subscriptionStatus: user.subscriptionStatus,
    onboardingComplete: user.onboardingComplete,
    onboardingCompletedAt: user.onboardingCompletedAt?.toISOString() ?? null,
    stripeCustomerId: user.stripeCustomerId,
    stripeSubscriptionId: user.stripeSubscriptionId,
    createdAt: user.createdAt?.toISOString(),
  };
}

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
    res.json(serializeProfile(user));
  } catch (err) {
    req.log.error({ err }, "Error getting user profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/users/profile", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const {
      email,
      role,
      goal,
      degree,
      referralSource,
      learnerRole,
      learningGoals,
      studyFocus,
      epppInterest,
      selectedTier,
      selectedProduct,
      onboardingComplete,
    } = req.body;

    // Build a partial column set: only fields explicitly present in the body
    // are written, so progressive saves during the multi-step flow never clear
    // answers captured by an earlier step.
    const fields: Partial<typeof usersTable.$inferInsert> = {};
    const assign = (key: keyof typeof usersTable.$inferInsert, value: string | undefined) => {
      if (value !== undefined) fields[key] = value as never;
    };
    assign("email", cleanStr(email));
    assign("role", cleanStr(role));
    assign("goal", cleanStr(goal));
    assign("degree", cleanStr(degree));
    assign("referralSource", cleanStr(referralSource));
    assign("learnerRole", cleanStr(learnerRole));
    assign("learningGoals", encodeGoals(learningGoals));
    assign("studyFocus", cleanStr(studyFocus));
    assign("epppInterest", cleanStr(epppInterest));
    assign("selectedTier", cleanStr(selectedTier));
    assign("selectedProduct", cleanStr(selectedProduct));
    if (typeof onboardingComplete === "boolean") {
      fields.onboardingComplete = onboardingComplete;
      // Stamp the completion time only when the flag flips to true. Re-running
      // onboarding to edit answers (which posts onboardingComplete=true again)
      // preserves the original timestamp via the row's existing value.
      if (onboardingComplete) fields.onboardingCompletedAt = new Date();
    }

    const existing = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    let user;
    if (existing.length === 0) {
      [user] = await db.insert(usersTable).values({
        id: userId,
        ...fields,
        onboardingComplete: fields.onboardingComplete ?? false,
        subscriptionStatus: "free",
        isAdmin: false,
        usageCount: 0,
      }).returning();
    } else if (Object.keys(fields).length > 0) {
      [user] = await db
        .update(usersTable)
        .set(fields)
        .where(eq(usersTable.id, userId))
        .returning();
    } else {
      user = existing[0];
    }
    res.json(serializeProfile(user));
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
