import { randomBytes, createHash, timingSafeEqual } from "node:crypto";
import { db, adminTokensTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";
import { getOwnerUserId } from "./requireAdmin";

const TOKEN_PREFIX = "ppmcp_";
const TOKEN_BYTES = 32;

export function generateToken(): { plaintext: string; hash: string } {
  const raw = randomBytes(TOKEN_BYTES).toString("base64url");
  const plaintext = `${TOKEN_PREFIX}${raw}`;
  const hash = hashToken(plaintext);
  return { plaintext, hash };
}

export function hashToken(plaintext: string): string {
  return createHash("sha256").update(plaintext).digest("hex");
}

function constantTimeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "hex");
  const bufB = Buffer.from(b, "hex");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export type VerifiedAdmin = { userId: string; tokenId: number };

export async function verifyBearerToken(authHeader: string | undefined): Promise<VerifiedAdmin | null> {
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) return null;
  const token = authHeader.slice(7).trim();
  if (!token.startsWith(TOKEN_PREFIX)) return null;
  const ownerId = getOwnerUserId();
  if (!ownerId) return null;
  const incomingHash = hashToken(token);

  const rows = await db
    .select({
      id: adminTokensTable.id,
      userId: adminTokensTable.userId,
      tokenHash: adminTokensTable.tokenHash,
    })
    .from(adminTokensTable)
    .where(eq(adminTokensTable.tokenHash, incomingHash));

  for (const row of rows) {
    // Defense in depth: token must belong to the configured owner, not just
    // any user with isAdmin=true. This blocks privilege-escalation paths
    // elsewhere in the codebase that may flip isAdmin without a real check.
    if (row.userId !== ownerId) continue;
    if (!constantTimeEquals(row.tokenHash, incomingHash)) continue;
    void db
      .update(adminTokensTable)
      .set({ lastUsedAt: new Date() })
      .where(eq(adminTokensTable.id, row.id))
      .catch(() => undefined);
    return { userId: row.userId, tokenId: row.id };
  }
  return null;
}

export async function listTokens(userId: string) {
  return db
    .select({
      id: adminTokensTable.id,
      label: adminTokensTable.label,
      createdAt: adminTokensTable.createdAt,
      lastUsedAt: adminTokensTable.lastUsedAt,
    })
    .from(adminTokensTable)
    .where(eq(adminTokensTable.userId, userId));
}

export async function createToken(userId: string, label: string) {
  const { plaintext, hash } = generateToken();
  const [row] = await db
    .insert(adminTokensTable)
    .values({ userId, tokenHash: hash, label })
    .returning({
      id: adminTokensTable.id,
      label: adminTokensTable.label,
      createdAt: adminTokensTable.createdAt,
    });
  return { ...row, token: plaintext };
}

export async function revokeToken(userId: string, tokenId: number): Promise<boolean> {
  const result = await db
    .delete(adminTokensTable)
    .where(and(eq(adminTokensTable.userId, userId), eq(adminTokensTable.id, tokenId)))
    .returning({ id: adminTokensTable.id });
  return result.length > 0;
}
