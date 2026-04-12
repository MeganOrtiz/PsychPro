import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import type { Request } from "express";
import { getAuth } from "@clerk/express";

const router = Router();
const FREE_LIMIT = 10;

function getUserId(req: Request): string | null {
  return getAuth(req).userId ?? null;
}

router.get("/users/profile", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user) return res.status(404).json({ error: "User not found" });
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

router.post("/users/profile", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
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
        onboardingComplete: onboardingComplete ?? false,
        subscriptionStatus: "free",
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

router.get("/users/usage", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    const usageCount = user?.usageCount ?? 0;
    res.json({
      usageCount,
      freeLimit: FREE_LIMIT,
      isOverLimit: usageCount >= FREE_LIMIT && (user?.subscriptionStatus ?? "free") === "free",
    });
  } catch (err) {
    req.log.error({ err }, "Error getting user usage");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/users/usage", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    let [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user) {
      [user] = await db.insert(usersTable).values({ id: userId, subscriptionStatus: "free", onboardingComplete: false, usageCount: 1 }).returning();
    } else {
      [user] = await db
        .update(usersTable)
        .set({ usageCount: (user.usageCount ?? 0) + 1 })
        .where(eq(usersTable.id, userId))
        .returning();
    }
    res.json({
      usageCount: user.usageCount,
      freeLimit: FREE_LIMIT,
      isOverLimit: (user.usageCount ?? 0) >= FREE_LIMIT && user.subscriptionStatus === "free",
    });
  } catch (err) {
    req.log.error({ err }, "Error incrementing usage");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
