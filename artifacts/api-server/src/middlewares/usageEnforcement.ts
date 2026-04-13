import { type Request, type Response, type NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const FREE_LIMIT = 10;

export async function enforceUsageLimit(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));

    if (!user) {
      next();
      return;
    }

    const isSubscribed = user.subscriptionStatus === "active" || user.subscriptionStatus === "pro" || user.subscriptionStatus === "trialing" || user.subscriptionStatus === "scholar";
    if (!isSubscribed && (user.usageCount ?? 0) >= FREE_LIMIT) {
      res.status(402).json({
        error: "Free limit reached",
        message: `You have used all ${FREE_LIMIT} free interactions. Upgrade to continue learning.`,
        usageCount: user.usageCount,
        freeLimit: FREE_LIMIT,
        isOverLimit: true,
      });
      return;
    }

    next();
  } catch (err) {
    next(err);
  }
}
