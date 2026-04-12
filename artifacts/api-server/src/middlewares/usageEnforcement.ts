import { type Request, type Response, type NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const FREE_LIMIT = 10;

export async function enforceUsageLimit(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    let [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));

    if (!user) {
      [user] = await db
        .insert(usersTable)
        .values({ id: userId, subscriptionStatus: "free", onboardingComplete: false, usageCount: 0 })
        .returning();
    }

    const isSubscribed = user.subscriptionStatus === "active" || user.subscriptionStatus === "pro";

    if (!isSubscribed && (user.usageCount ?? 0) >= FREE_LIMIT) {
      res.status(402).json({
        error: "Free limit reached",
        message: `You have used all ${FREE_LIMIT} free interactions. Upgrade to continue learning.`,
        usageCount: user.usageCount,
        freeLimit: FREE_LIMIT,
      });
      return;
    }

    if (!isSubscribed) {
      await db
        .update(usersTable)
        .set({ usageCount: sql`${usersTable.usageCount} + 1` })
        .where(eq(usersTable.id, userId));
    }

    next();
  } catch (err) {
    next(err);
  }
}
