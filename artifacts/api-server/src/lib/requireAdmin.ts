import type { Request, Response } from "express";
import { timingSafeEqual } from "node:crypto";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

/**
 * Owner authentication for admin-token CRUD routes.
 *
 * Identity comes from a server-side shared secret `MCP_ADMIN_SECRET` rather
 * than the client-supplied `X-User-Id` header (which is unverified and
 * forgeable). The owner pastes this secret into the `/admin/tokens` page,
 * which stores it in the browser tab's sessionStorage (not localStorage,
 * not cookies) and sends it as `Authorization: Bearer <MCP_ADMIN_SECRET>`
 * over HTTPS when minting / listing / revoking MCP tokens. The secret is
 * never written to server logs.
 *
 * The MCP bearer tokens that Claude Desktop uses are minted *through* this
 * route — they are unrelated to MCP_ADMIN_SECRET and have their own
 * 32-byte random material verified in `adminTokens.verifyBearerToken`.
 *
 * Configuration must come from Replit Secrets (or equivalent), NEVER from
 * `.replit`/source control. We hard-reject a small set of known placeholder
 * values to fail-fast on accidental dev/test secrets reaching production.
 */

export const OWNER_SENTINEL_USER_ID = "owner";

const WEAK_SECRET_FRAGMENTS = [
  "smoke-test",
  "please-rotate",
  "changeme",
  "change-me",
  "placeholder",
  "test-secret",
  "dev-secret",
];

function getAdminSecret(): string | null {
  const raw = process.env.MCP_ADMIN_SECRET;
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (trimmed.length < 16) return null;
  const lower = trimmed.toLowerCase();
  for (const frag of WEAK_SECRET_FRAGMENTS) {
    if (lower.includes(frag)) {
      // Eslint-friendly diagnostic without leaking the value.
      // eslint-disable-next-line no-console
      console.warn(
        "[security] MCP_ADMIN_SECRET appears to contain a known placeholder fragment; refusing to use it. Rotate the secret to a strong random value.",
      );
      return null;
    }
  }
  return trimmed;
}

function constantTimeStringEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Returns the sentinel owner id on success; null on failure (response written).
 * Failure modes:
 *   - 503 if MCP_ADMIN_SECRET is not configured on the server
 *   - 401 if the bearer header is missing or doesn't match
 */
export async function requireOwner(req: Request, res: Response): Promise<string | null> {
  const secret = getAdminSecret();
  if (!secret) {
    res.status(503).json({
      error: "Server not configured. Set the MCP_ADMIN_SECRET env var (>=16 chars) and restart.",
    });
    return null;
  }
  const auth = req.header("authorization");
  if (!auth || !auth.toLowerCase().startsWith("bearer ")) {
    res.status(401).json({ error: "Missing Bearer credentials" });
    return null;
  }
  const provided = auth.slice(7).trim();
  if (!constantTimeStringEquals(provided, secret)) {
    res.status(401).json({ error: "Invalid admin credentials" });
    return null;
  }
  // Ensure the sentinel owner row exists so token rows can satisfy the FK.
  const [existing] = await db.select().from(usersTable).where(eq(usersTable.id, OWNER_SENTINEL_USER_ID));
  if (!existing) {
    await db.insert(usersTable).values({
      id: OWNER_SENTINEL_USER_ID,
      subscriptionStatus: "scholar",
      isAdmin: true,
      onboardingComplete: true,
      usageCount: 0,
    });
  }
  return OWNER_SENTINEL_USER_ID;
}

export function isAdminSecretConfigured(): boolean {
  return getAdminSecret() !== null;
}
