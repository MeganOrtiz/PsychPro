import type { Request, Response } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireUserId } from "./userId";

/**
 * Owner-only authorization for privileged routes (MCP token mint, etc.).
 *
 * The owner is the single user whose id equals the `OWNER_USER_ID` env var.
 * No promotion-through-API path exists: a request is admitted iff the caller's
 * id (currently the X-User-Id header — replace with verified auth before
 * trusting on the open internet) matches OWNER_USER_ID. The owner's `users`
 * row is upserted with `isAdmin=true` so downstream admin checks elsewhere
 * still work, but isAdmin alone is no longer sufficient for token routes.
 *
 * Returns the userId on success, null on failure (response already written).
 */
export function getOwnerUserId(): string | null {
  const raw = process.env.OWNER_USER_ID;
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function requireAdminUserId(req: Request, res: Response): Promise<string | null> {
  const userId = requireUserId(req, res);
  if (!userId) return null;

  const ownerId = getOwnerUserId();
  if (!ownerId) {
    res.status(503).json({
      error: "Owner not configured. Set the OWNER_USER_ID env var to your user id (visible on /admin/tokens).",
    });
    return null;
  }
  if (userId !== ownerId) {
    res.status(403).json({ error: "Owner access required" });
    return null;
  }

  // Ensure the owner has a users row with isAdmin=true (best-effort upsert).
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
  return userId;
}
