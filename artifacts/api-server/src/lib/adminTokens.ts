import { randomBytes, createHash, timingSafeEqual } from "node:crypto";
import { db, adminTokensTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";
import { OWNER_SENTINEL_USER_ID } from "./requireAdmin";

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

export type VerifiedAdmin = { tokenId: number };

/**
 * Verify a Bearer token sent by Claude Desktop on `/api/mcp`. A token is
 * valid iff:
 *   - it carries the `ppmcp_` prefix,
 *   - its SHA-256 hash exists in `admin_tokens`,
 *   - its owner is the sentinel owner row (i.e. it was minted through the
 *     secret-gated mint route — defense in depth in case rows are ever
 *     inserted through some other path).
 */
export async function verifyBearerToken(authHeader: string | undefined): Promise<VerifiedAdmin | null> {
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) return null;
  const token = authHeader.slice(7).trim();
  if (!token.startsWith(TOKEN_PREFIX)) return null;
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
    if (row.userId !== OWNER_SENTINEL_USER_ID) continue;
    if (!constantTimeEquals(row.tokenHash, incomingHash)) continue;
    void db
      .update(adminTokensTable)
      .set({ lastUsedAt: new Date() })
      .where(eq(adminTokensTable.id, row.id))
      .catch(() => undefined);
    return { tokenId: row.id };
  }
  return null;
}

export async function listTokens() {
  return db
    .select({
      id: adminTokensTable.id,
      label: adminTokensTable.label,
      createdAt: adminTokensTable.createdAt,
      lastUsedAt: adminTokensTable.lastUsedAt,
    })
    .from(adminTokensTable)
    .where(eq(adminTokensTable.userId, OWNER_SENTINEL_USER_ID));
}

export async function createToken(label: string) {
  const { plaintext, hash } = generateToken();
  const [row] = await db
    .insert(adminTokensTable)
    .values({ userId: OWNER_SENTINEL_USER_ID, tokenHash: hash, label })
    .returning({
      id: adminTokensTable.id,
      label: adminTokensTable.label,
      createdAt: adminTokensTable.createdAt,
    });
  return { ...row, token: plaintext };
}

export async function revokeToken(tokenId: number): Promise<boolean> {
  const result = await db
    .delete(adminTokensTable)
    .where(and(eq(adminTokensTable.userId, OWNER_SENTINEL_USER_ID), eq(adminTokensTable.id, tokenId)))
    .returning({ id: adminTokensTable.id });
  return result.length > 0;
}
