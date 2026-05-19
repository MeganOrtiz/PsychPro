import { randomBytes, randomUUID, createHash, timingSafeEqual } from "node:crypto";

/**
 * Single-user OAuth 2.1 + PKCE store for the MCP route.
 *
 * Why this exists: Claude.ai's web "Add custom connector" dialog only supports
 * OAuth (no plain bearer-token field), so we expose an OAuth-compliant flow on
 * top of our existing MCP server. Because the only legitimate operator is the
 * site owner, the authorization endpoint auto-approves without a consent
 * screen — PKCE S256 + a short-lived auth code + a registered redirect_uri
 * still keep an attacker who only sees the redirect from completing the
 * exchange.
 *
 * Storage is in-memory `Map`s. That's intentional: this server runs as a
 * single instance, the only client is Claude (which re-registers and re-auths
 * if its tokens vanish), and persisting OAuth state to Postgres would add
 * surface area for a feature one human uses. If we ever scale horizontally or
 * add multi-user OAuth, swap the maps for a DB-backed store.
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

interface AuthCode {
  code: string;
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  codeChallengeMethod: "S256";
  expiresAt: number;
}

interface AccessToken {
  token: string;
  clientId: string;
  expiresAt: number;
}

interface RefreshToken {
  token: string;
  clientId: string;
  expiresAt: number;
  // The currently-active access token issued from this refresh chain. When the
  // refresh token is rotated, the previously-issued access token is revoked.
  currentAccessToken: string | null;
}

const clients = new Map<string, RegisteredClient>();
const authCodes = new Map<string, AuthCode>();
const accessTokens = new Map<string, AccessToken>();
const refreshTokens = new Map<string, RefreshToken>();

let lastSweep = 0;
const SWEEP_INTERVAL_MS = 60_000;

function sweepIfStale(now: number): void {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [k, v] of authCodes) if (v.expiresAt <= now) authCodes.delete(k);
  for (const [k, v] of accessTokens) if (v.expiresAt <= now) accessTokens.delete(k);
  for (const [k, v] of refreshTokens) if (v.expiresAt <= now) refreshTokens.delete(k);
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

export function registerClient(input: {
  redirectUris: string[];
  metadata: Record<string, unknown>;
}): RegisteredClient {
  const clientId = randomUUID();
  const record: RegisteredClient = {
    clientId,
    clientIdIssuedAt: Math.floor(Date.now() / 1000),
    redirectUris: input.redirectUris,
    metadata: input.metadata,
  };
  clients.set(clientId, record);
  return record;
}

export function getClient(clientId: string): RegisteredClient | null {
  return clients.get(clientId) ?? null;
}

export function clientAllowsRedirectUri(client: RegisteredClient, redirectUri: string): boolean {
  // Exact-match per RFC 8252 §7.5 / OAuth 2.1 §4.1.2.1. No prefix or wildcard.
  return client.redirectUris.some((u) => u === redirectUri);
}

export function issueAuthCode(input: {
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
}): string {
  sweepIfStale(Date.now());
  const code = randomBytes(32).toString("base64url");
  authCodes.set(code, {
    code,
    clientId: input.clientId,
    redirectUri: input.redirectUri,
    codeChallenge: input.codeChallenge,
    codeChallengeMethod: "S256",
    expiresAt: Date.now() + AUTH_CODE_TTL_MS,
  });
  return code;
}

export type ConsumeAuthCodeResult =
  | { ok: true; code: AuthCode }
  | { ok: false; error: "invalid_grant"; description: string };

/** Single-use: deletes the code regardless of validity outcome. */
export function consumeAuthCode(input: {
  code: string;
  clientId: string;
  redirectUri: string;
  codeVerifier: string;
}): ConsumeAuthCodeResult {
  const now = Date.now();
  sweepIfStale(now);
  const entry = authCodes.get(input.code);
  if (!entry) return { ok: false, error: "invalid_grant", description: "Unknown or already-used authorization code" };
  // Always remove on lookup — auth codes are single-use even when validation fails.
  authCodes.delete(input.code);
  if (entry.expiresAt <= now) return { ok: false, error: "invalid_grant", description: "Authorization code has expired" };
  if (entry.clientId !== input.clientId) return { ok: false, error: "invalid_grant", description: "client_id mismatch" };
  if (entry.redirectUri !== input.redirectUri) return { ok: false, error: "invalid_grant", description: "redirect_uri mismatch" };
  if (!verifyPkceS256(input.codeVerifier, entry.codeChallenge)) {
    return { ok: false, error: "invalid_grant", description: "PKCE verification failed" };
  }
  return { ok: true, code: entry };
}

export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export function issueTokens(clientId: string): IssuedTokens {
  const now = Date.now();
  const accessToken = `${OAUTH_TOKEN_PREFIX}${randomBytes(32).toString("base64url")}`;
  const refreshToken = `${REFRESH_TOKEN_PREFIX}${randomBytes(32).toString("base64url")}`;
  accessTokens.set(accessToken, {
    token: accessToken,
    clientId,
    expiresAt: now + ACCESS_TOKEN_TTL_MS,
  });
  refreshTokens.set(refreshToken, {
    token: refreshToken,
    clientId,
    expiresAt: now + REFRESH_TOKEN_TTL_MS,
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
export function rotateRefreshToken(input: { refreshToken: string; clientId: string }): RotateRefreshResult {
  const now = Date.now();
  sweepIfStale(now);
  const entry = refreshTokens.get(input.refreshToken);
  if (!entry) return { ok: false, error: "invalid_grant", description: "Unknown refresh token" };
  refreshTokens.delete(input.refreshToken);
  if (entry.expiresAt <= now) return { ok: false, error: "invalid_grant", description: "Refresh token has expired" };
  if (entry.clientId !== input.clientId) return { ok: false, error: "invalid_grant", description: "client_id mismatch" };
  if (entry.currentAccessToken) accessTokens.delete(entry.currentAccessToken);
  return { ok: true, tokens: issueTokens(input.clientId) };
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
 * use the high bit / negate to keep OAuth keys in negative-int space.
 */
function rateLimitKeyForOauthToken(token: string): number {
  let h = 0;
  for (let i = 0; i < token.length; i++) {
    h = ((h << 5) - h + token.charCodeAt(i)) | 0;
  }
  // Force negative so we never collide with positive admin-token row ids.
  return h >= 0 ? -h - 1 : h;
}

export function verifyOauthAccessToken(token: string): VerifiedAccessToken | null {
  if (!token.startsWith(OAUTH_TOKEN_PREFIX)) return null;
  const now = Date.now();
  sweepIfStale(now);
  const entry = accessTokens.get(token);
  if (!entry) return null;
  if (entry.expiresAt <= now) {
    accessTokens.delete(token);
    return null;
  }
  return { clientId: entry.clientId, rateLimitKey: rateLimitKeyForOauthToken(token) };
}

/** Test-only utility — never invoked in production code paths. */
export function __resetOauthStoreForTests(): void {
  clients.clear();
  authCodes.clear();
  accessTokens.clear();
  refreshTokens.clear();
  lastSweep = 0;
}
