import type { Request, Response } from "express";
import { db, usersTable } from "@workspace/db";
import { eq, and, ne } from "drizzle-orm";
import { requireUserId } from "./userId";

/**
 * Ensure the caller is an admin user.
 *
 * Single-owner deployment model: the very first caller to a privileged route
 * (when no admin exists in the system yet) is claimed as the owner and
 * promoted to admin. After that, only callers whose users row already has
 * isAdmin=true are admitted; subsequent unknown callers get 403. This is
 * stricter than the older feedback admin pattern, which is important for
 * routes that mint long-lived MCP bearer tokens.
 *
 * Returns the userId on success, null on failure (response already written).
 */
export async function requireAdminUserId(req: Request, res: Response): Promise<string | null> {
  const userId = requireUserId(req, res);
  if (!userId) return null;

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (existing?.isAdmin) return userId;

  // Owner-claim path: only run if no admin exists at all.
  const [anyOtherAdmin] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(and(eq(usersTable.isAdmin, true), ne(usersTable.id, userId)))
    .limit(1);

  if (anyOtherAdmin) {
    res.status(403).json({ error: "Admin access required" });
    return null;
  }

  if (!existing) {
    await db.insert(usersTable).values({
      id: userId,
      subscriptionStatus: "scholar",
      isAdmin: true,
      onboardingComplete: true,
      usageCount: 0,
    });
  } else {
    await db.update(usersTable)
      .set({ isAdmin: true, subscriptionStatus: "scholar" })
      .where(eq(usersTable.id, userId));
  }
  return userId;
}
