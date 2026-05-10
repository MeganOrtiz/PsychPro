import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireUserId } from "../lib/userId";

const router = Router();
const FREE_LIMIT = 10;

router.get("/users/profile", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
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
        // Dev-mode default: every new anonymous user is provisioned with
        // full Scholar-tier access and admin flag so the un-authenticated
        // app is fully usable (no paywalls, no admin gating).
        subscriptionStatus: "scholar",
        isAdmin: true,
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

router.get("/users/usage", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    const usageCount = user?.usageCount ?? 0;
    res.json({
      usageCount,
      freeLimit: FREE_LIMIT,
      isOverLimit: usageCount >= FREE_LIMIT && (user?.subscriptionStatus !== "active" && user?.subscriptionStatus !== "pro" && user?.subscriptionStatus !== "trialing" && user?.subscriptionStatus !== "scholar"),
    });
  } catch (err) {
    req.log.error({ err }, "Error getting user usage");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/users/usage", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    let [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));

    if (!user) {
      [user] = await db.insert(usersTable).values({ id: userId, subscriptionStatus: "scholar", isAdmin: true, onboardingComplete: true, usageCount: 0 }).returning();
    }

    const isSubscribed = user.subscriptionStatus === "active" || user.subscriptionStatus === "pro" || user.subscriptionStatus === "trialing" || user.subscriptionStatus === "scholar";
    const currentCount = user.usageCount ?? 0;

    if (!isSubscribed && currentCount >= FREE_LIMIT) {
      res.status(402).json({
        error: "Free limit reached",
        message: `You have used all ${FREE_LIMIT} free interactions. Upgrade to continue learning.`,
        usageCount: currentCount,
        freeLimit: FREE_LIMIT,
        isOverLimit: true,
      });
      return;
    }

    if (!isSubscribed) {
      [user] = await db
        .update(usersTable)
        .set({ usageCount: currentCount + 1 })
        .where(eq(usersTable.id, userId))
        .returning();
    }

    res.json({
      usageCount: user.usageCount,
      freeLimit: FREE_LIMIT,
      isOverLimit: (user.usageCount ?? 0) >= FREE_LIMIT && (user.subscriptionStatus !== "active" && user.subscriptionStatus !== "pro" && user.subscriptionStatus !== "trialing" && user.subscriptionStatus !== "scholar"),
    });
  } catch (err) {
    req.log.error({ err }, "Error incrementing usage");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
