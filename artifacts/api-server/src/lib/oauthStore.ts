import { randomBytes, randomUUID, createHash, timingSafeEqual } from "node:crypto";
import {
  db,
  oauthClientsTable,
  oauthAuthCodesTable,
  oauthAccessTokensTable,
  oauthRefreshTokensTable,
} from "@workspace/db";
import { and, eq, lt } from "drizzle-orm";

/**
 * OAuth 2.1 + PKCE store for the MCP route — Postgres-backed.
 *
 * Why DB-backed: Claude.ai's "Add custom connector" dialog does OAuth dynamic
 * client registration (RFC 7591) against this server. The auto-approve
 * authorization flow auto-issues PKCE-bound auth codes without a consent
 * screen (single-owner deployment). When state was held in-memory, prod
 * (Autoscale + occasional restarts) returned "invalid_client / Unknown
 * client_id" whenever `/authorize` landed on a different instance than the
 * `/register` call. Persisting to Postgres fixes that.
 *
 * Tokens issued here are bearer tokens prefixed `ppmcp_oauth_` so the MCP
 * route can tell them apart from the existing `ppmcp_` admin tokens minted
 * via `/admin/tokens`. Both kinds are accepted on `POST /api/mcp`; only the
 * admin-token CRUD routes (`/api/admin/tokens`) require the static
 * `MCP_ADMIN_SECRET`.
 */

const ACCESS_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const AUTH_CODE_TTL_MS = 60 * 1000; // 60 seconds
const OAUTH_TOKEN_PREFIX = "ppmcp_oauth_";
const REFRESH_TOKEN_PREFIX = "ppmcp_refresh_";

export interface RegisteredClient {
  clientId: string;
  clientIdIssuedAt: number;
  redirectUris: string[];
  metadata: Record<string, unknown>;
}

let lastSweep = 0;
const SWEEP_INTERVAL_MS = 60_000;

async function sweepExpired(now: number): Promise<void> {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  const cutoff = new Date(now);
  // Fire-and-forget — sweeps should never block a hot request.
  void Promise.all([
    db.delete(oauthAuthCodesTable).where(lt(oauthAuthCodesTable.expiresAt, cutoff)),
    db.delete(oauthAccessTokensTable).where(lt(oauthAccessTokensTable.expiresAt, cutoff)),
    db.delete(oauthRefreshTokensTable).where(lt(oauthRefreshTokensTable.expiresAt, cutoff)),
  ]).catch(() => undefined);
}

function constantTimeStringEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function base64UrlSha256(input: string): string {
  return createHash("sha256").update(input, "ascii").digest("base64url");
}

export function verifyPkceS256(verifier: string, expectedChallenge: string): boolean {
  if (typeof verifier !== "string" || verifier.length < 43 || verifier.length > 128) return false;
  const computed = base64UrlSha256(verifier);
  return constantTimeStringEquals(computed, expectedChallenge);
}

export async function registerClient(input: {
  redirectUris: string[];
  metadata: Record<string, unknown>;
}): Promise<RegisteredClient> {
  const clientId = randomUUID();
  const issuedAt = Math.floor(Date.now() / 1000);
  await db.insert(oauthClientsTable).values({
    clientId,
    clientIdIssuedAt: issuedAt,
    redirectUrisJson: JSON.stringify(input.redirectUris),
    metadataJson: JSON.stringify(input.metadata ?? {}),
  });
  return {
    clientId,
    clientIdIssuedAt: issuedAt,
    redirectUris: input.redirectUris,
    metadata: input.metadata,
  };
}

function rowToClient(row: typeof oauthClientsTable.$inferSelect): RegisteredClient {
  let redirectUris: string[] = [];
  let metadata: Record<string, unknown> = {};
  try {
    const parsed = JSON.parse(row.redirectUrisJson);
    if (Array.isArray(parsed)) redirectUris = parsed.filter((u): u is string => typeof u === "string");
  } catch {
    /* tolerate corrupt rows by treating as no redirect uris */
  }
  try {
    const parsed = JSON.parse(row.metadataJson);
    if (parsed && typeof parsed === "object") metadata = parsed as Record<string, unknown>;
  } catch {
    /* ignore */
  }
  return {
    clientId: row.clientId,
    clientIdIssuedAt: row.clientIdIssuedAt,
    redirectUris,
    metadata,
  };
}

export async function getClient(clientId: string): Promise<RegisteredClient | null> {
  if (!clientId) return null;
  const [row] = await db
    .select()
    .from(oauthClientsTable)
    .where(eq(oauthClientsTable.clientId, clientId))
    .limit(1);
  return row ? rowToClient(row) : null;
}

export function clientAllowsRedirectUri(client: RegisteredClient, redirectUri: string): boolean {
  // Exact-match per RFC 8252 §7.5 / OAuth 2.1 §4.1.2.1. No prefix or wildcard.
  return client.redirectUris.some((u) => u === redirectUri);
}

export async function issueAuthCode(input: {
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
}): Promise<string> {
  await sweepExpired(Date.now());
  const code = randomBytes(32).toString("base64url");
  await db.insert(oauthAuthCodesTable).values({
    code,
    clientId: input.clientId,
    redirectUri: input.redirectUri,
    codeChallenge: input.codeChallenge,
    expiresAt: new Date(Date.now() + AUTH_CODE_TTL_MS),
  });
  return code;
}

export type ConsumeAuthCodeResult =
  | { ok: true }
  | { ok: false; error: "invalid_grant"; description: string };

/** Single-use: deletes the code regardless of validity outcome. */
export async function consumeAuthCode(input: {
  code: string;
  clientId: string;
  redirectUri: string;
  codeVerifier: string;
}): Promise<ConsumeAuthCodeResult> {
  const now = Date.now();
  await sweepExpired(now);
  // Atomic single-use: DELETE … RETURNING ensures only one caller wins.
  const deleted = await db
    .delete(oauthAuthCodesTable)
    .where(eq(oauthAuthCodesTable.code, input.code))
    .returning();
  const entry = deleted[0];
  if (!entry) return { ok: false, error: "invalid_grant", description: "Unknown or already-used authorization code" };
  if (entry.expiresAt.getTime() <= now) return { ok: false, error: "invalid_grant", description: "Authorization code has expired" };
  if (entry.clientId !== input.clientId) return { ok: false, error: "invalid_grant", description: "client_id mismatch" };
  if (entry.redirectUri !== input.redirectUri) return { ok: false, error: "invalid_grant", description: "redirect_uri mismatch" };
  if (!verifyPkceS256(input.codeVerifier, entry.codeChallenge)) {
    return { ok: false, error: "invalid_grant", description: "PKCE verification failed" };
  }
  return { ok: true };
}

export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export async function issueTokens(clientId: string): Promise<IssuedTokens> {
  const now = Date.now();
  const accessToken = `${OAUTH_TOKEN_PREFIX}${randomBytes(32).toString("base64url")}`;
  const refreshToken = `${REFRESH_TOKEN_PREFIX}${randomBytes(32).toString("base64url")}`;
  await db.insert(oauthAccessTokensTable).values({
    token: accessToken,
    clientId,
    expiresAt: new Date(now + ACCESS_TOKEN_TTL_MS),
  });
  await db.insert(oauthRefreshTokensTable).values({
    token: refreshToken,
    clientId,
    expiresAt: new Date(now + REFRESH_TOKEN_TTL_MS),
    currentAccessToken: accessToken,
  });
  return {
    accessToken,
    refreshToken,
    expiresIn: Math.floor(ACCESS_TOKEN_TTL_MS / 1000),
  };
}

export type RotateRefreshResult =
  | { ok: true; tokens: IssuedTokens }
  | { ok: false; error: "invalid_grant"; description: string };

/**
 * Rotates a refresh token: revokes both the old refresh token and the access
 * token it most recently issued, then issues a fresh pair. OAuth 2.1 §6.1
 * mandates this rotation pattern for public clients.
 */
export async function rotateRefreshToken(input: { refreshToken: string; clientId: string }): Promise<RotateRefreshResult> {
  const now = Date.now();
  await sweepExpired(now);
  // Atomic single-use rotation via DELETE … RETURNING.
  const deleted = await db
    .delete(oauthRefreshTokensTable)
    .where(eq(oauthRefreshTokensTable.token, input.refreshToken))
    .returning();
  const entry = deleted[0];
  if (!entry) return { ok: false, error: "invalid_grant", description: "Unknown refresh token" };
  if (entry.expiresAt.getTime() <= now) return { ok: false, error: "invalid_grant", description: "Refresh token has expired" };
  if (entry.clientId !== input.clientId) return { ok: false, error: "invalid_grant", description: "client_id mismatch" };
  if (entry.currentAccessToken) {
    await db
      .delete(oauthAccessTokensTable)
      .where(eq(oauthAccessTokensTable.token, entry.currentAccessToken));
  }
  const tokens = await issueTokens(input.clientId);
  return { ok: true, tokens };
}

export interface VerifiedAccessToken {
  clientId: string;
  /** Stable identifier used for rate-limit bucketing alongside admin tokens. */
  rateLimitKey: number;
}

/**
 * Hash the token text to a stable 31-bit integer so the same OAuth token
 * lands in the same rate-limit bucket across calls without colliding with
 * admin-token row ids (which are sequential small integers). We deliberately
 * keep OAuth keys in negative-int space.
 */
function rateLimitKeyForOauthToken(token: string): number {
  let h = 0;
  for (let i = 0; i < token.length; i++) {
    h = ((h << 5) - h + token.charCodeAt(i)) | 0;
  }
  return h >= 0 ? -h - 1 : h;
}

export async function verifyOauthAccessToken(token: string): Promise<VerifiedAccessToken | null> {
  if (!token.startsWith(OAUTH_TOKEN_PREFIX)) return null;
  const now = Date.now();
  await sweepExpired(now);
  const [row] = await db
    .select()
    .from(oauthAccessTokensTable)
    .where(eq(oauthAccessTokensTable.token, token))
    .limit(1);
  if (!row) return null;
  if (row.expiresAt.getTime() <= now) {
    await db.delete(oauthAccessTokensTable).where(eq(oauthAccessTokensTable.token, token));
    return null;
  }
  return { clientId: row.clientId, rateLimitKey: rateLimitKeyForOauthToken(token) };
}

/** Test-only utility — never invoked in production code paths. */
export async function __resetOauthStoreForTests(): Promise<void> {
  await db.delete(oauthClientsTable);
  await db.delete(oauthAuthCodesTable);
  await db.delete(oauthAccessTokensTable);
  await db.delete(oauthRefreshTokensTable);
  lastSweep = 0;
}

// Silence unused-import warnings when only some operators are used.
void and;
