import type { Request, Response } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getOptionalUserId, requireUserId } from "./userId";

/**
 * Admin gate. A caller is admin when EITHER:
 *   (a) Their `users` row (looked up by verified user id) has
 *       `isAdmin = true`, OR
 *   (b) Their verified session email matches an entry in the
 *       `ADMIN_EMAILS` allowlist (comma-separated env var). The
 *       built-in allowlist always includes `admin@psychprosuite.com`
 *       so the project owner is never locked out by a user-id mismatch
 *       between dev/prod or account re-creation.
 *
 * On a successful email-match the row is self-healed (lazy-upserted with
 * `isAdmin = true` and the current user id) so subsequent id lookups
 * succeed too.
 */

const BUILTIN_ADMIN_EMAILS = ["admin@psychprosuite.com"];

function adminEmailAllowlist(): Set<string> {
  const fromEnv = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0);
  return new Set([...BUILTIN_ADMIN_EMAILS, ...fromEnv]);
}

function sessionEmail(req: Request): string | null {
  // The email comes from the verified OIDC claims captured into the
  // server-side session at login (see `routes/auth.ts` upsertUser). It is
  // never client-supplied, so it is safe to trust for the allowlist match.
  const email = req.user?.email?.trim().toLowerCase();
  return email && email.length > 0 ? email : null;
}

async function selfHealAdminRow(userId: string, email: string): Promise<void> {
  const [existing] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  if (!existing) {
    await db
      .insert(usersTable)
      .values({
        id: userId,
        email,
        isAdmin: true,
        subscriptionStatus: "free",
        onboardingComplete: false,
        usageCount: 0,
      })
      .onConflictDoNothing();
    return;
  }
  if (!existing.isAdmin || existing.email !== email) {
    await db
      .update(usersTable)
      .set({ isAdmin: true, email })
      .where(eq(usersTable.id, userId));
  }
}

/**
 * Returns true when the current request carries a verified login session
 * for an admin user. Safe to call on anonymous-tolerant routes — returns
 * false (without writing to the response) when the caller is signed out.
 */
export async function isCallerAdmin(req: Request): Promise<boolean> {
  const userId = getOptionalUserId(req);
  if (!userId) return false;

  const [row] = await db
    .select({ isAdmin: usersTable.isAdmin })
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  if (row?.isAdmin) return true;

  const allowlist = adminEmailAllowlist();
  if (allowlist.size === 0) return false;

  const email = sessionEmail(req);
  if (!email || !allowlist.has(email)) return false;

  await selfHealAdminRow(userId, email);
  return true;
}

/**
 * Strict admin gate for protected routes. Returns the verified
 * user id on success; writes 401 (no session) or 403 (signed in but
 * not admin) and returns null on failure.
 */
export async function requireAdminCaller(
  req: Request,
  res: Response,
): Promise<string | null> {
  const userId = requireUserId(req, res);
  if (!userId) return null;
  const ok = await isCallerAdmin(req);
  if (!ok) {
    res.status(403).json({ error: "Admin access required" });
    return null;
  }
  return userId;
}
