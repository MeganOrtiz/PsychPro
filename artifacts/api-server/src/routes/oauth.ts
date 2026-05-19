import { Router, type Request, type Response } from "express";
import { timingSafeEqual } from "node:crypto";
import {
  registerClient,
  getClient,
  clientAllowsRedirectUri,
  issueAuthCode,
  consumeAuthCode,
  issueTokens,
  rotateRefreshToken,
  mintOwnerSessionCookie,
  verifyOwnerSessionCookie,
  mintApproveNonce,
  verifyApproveNonce,
  OWNER_COOKIE_NAME,
} from "../lib/oauthStore";

// Tiny IP-keyed sliding-window rate limiter for /owner-login to slow online
// brute-force guessing against MCP_ADMIN_SECRET. 10 attempts / 5 min / IP.
const LOGIN_RATE_MAX = 10;
const LOGIN_RATE_WINDOW_MS = 5 * 60 * 1000;
const loginHits = new Map<string, number[]>();
let loginLastSweep = 0;
function loginRateLimited(ip: string): boolean {
  const now = Date.now();
  if (now - loginLastSweep > LOGIN_RATE_WINDOW_MS) {
    loginLastSweep = now;
    for (const [k, arr] of loginHits) {
      const fresh = arr.filter((t) => now - t < LOGIN_RATE_WINDOW_MS);
      if (fresh.length === 0) loginHits.delete(k);
      else if (fresh.length !== arr.length) loginHits.set(k, fresh);
    }
  }
  const arr = (loginHits.get(ip) ?? []).filter((t) => now - t < LOGIN_RATE_WINDOW_MS);
  arr.push(now);
  loginHits.set(ip, arr);
  return arr.length > LOGIN_RATE_MAX;
}

/**
 * Owner gate. PKCE protects the channel between client and authorization
 * server — it does NOT authenticate the human resource owner. Without this
 * gate, any internet caller could complete register→authorize→token and mint
 * a write-capable MCP token. The owner enters `MCP_ADMIN_SECRET` once per
 * browser; we set a short-lived HMAC-signed cookie so subsequent Claude
 * connector pairings are seamless ("auto-approve") until the cookie expires.
 */

function getCookie(req: Request, name: string): string | null {
  const raw = req.headers.cookie;
  if (!raw) return null;
  for (const part of raw.split(/;\s*/)) {
    const eq = part.indexOf("=");
    if (eq <= 0) continue;
    if (part.slice(0, eq) === name) return decodeURIComponent(part.slice(eq + 1));
  }
  return null;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;",
  );
}

function constantTimeStringEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function getAdminSecret(): string | null {
  const raw = process.env.MCP_ADMIN_SECRET;
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (trimmed.length < 16) return null;
  return trimmed;
}

function renderOwnerLoginPage(
  params: Record<string, string | undefined>,
  opts: { error?: string },
): string {
  // Forward every authorize query param through hidden inputs so the form
  // POST can replay the original request after owner-secret check succeeds.
  const inputs = Object.entries(params)
    .filter(([, v]) => typeof v === "string")
    .map(
      ([k, v]) =>
        `<input type="hidden" name="oauth_${escapeHtml(k)}" value="${escapeHtml(v as string)}"/>`,
    )
    .join("\n      ");
  const errBanner = opts.error
    ? `<p style="color:#c00;margin:0 0 12px 0">${escapeHtml(opts.error)}</p>`
    : "";
  return `<!doctype html>
<html><head><meta charset="utf-8"/><title>PsychPro MCP — Owner authorization</title>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#0f172a;color:#e2e8f0;margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
  .card{background:#1e293b;padding:32px;border-radius:12px;max-width:420px;width:100%;box-shadow:0 10px 30px rgba(0,0,0,0.4)}
  h1{margin:0 0 8px 0;font-size:20px}
  p{margin:0 0 16px 0;color:#94a3b8;font-size:14px;line-height:1.5}
  label{display:block;font-size:13px;margin-bottom:6px;color:#cbd5e1}
  input[type=password]{width:100%;padding:10px 12px;border:1px solid #334155;background:#0f172a;color:#e2e8f0;border-radius:6px;font-size:14px;box-sizing:border-box}
  button{margin-top:16px;width:100%;padding:10px 12px;background:#0d9488;color:#fff;border:0;border-radius:6px;font-size:14px;font-weight:600;cursor:pointer}
  button:hover{background:#14b8a6}
</style></head>
<body><div class="card">
  <h1>Authorize Claude to access PsychPro MCP</h1>
  <p>Paste the <code>MCP_ADMIN_SECRET</code> to approve this connector. Your browser will be remembered for one hour.</p>
  ${errBanner}
  <form method="POST" action="/api/oauth/owner-login" autocomplete="off">
    <label for="secret">Admin secret</label>
    <input id="secret" type="password" name="secret" required autofocus/>
    ${inputs}
    <button type="submit">Authorize</button>
  </form>
</div></body></html>`;
}

/**
 * Per-request approval page rendered when the owner cookie is valid. The
 * owner clicks "Approve" to submit a same-origin POST with a signed CSRF
 * nonce — preventing a malicious third-party page from triggering token
 * issuance via top-level cross-site navigation (the SameSite=Lax cookie
 * would otherwise ride along on such a GET).
 */
function renderApprovePage(p: AuthorizeParams, nonce: string): string {
  return `<!doctype html>
<html><head><meta charset="utf-8"/><title>PsychPro MCP — Approve connector</title>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#0f172a;color:#e2e8f0;margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
  .card{background:#1e293b;padding:32px;border-radius:12px;max-width:480px;width:100%;box-shadow:0 10px 30px rgba(0,0,0,0.4)}
  h1{margin:0 0 12px 0;font-size:20px}
  p{margin:0 0 8px 0;color:#94a3b8;font-size:14px;line-height:1.5}
  .target{background:#0f172a;border:1px solid #334155;border-radius:6px;padding:10px 12px;margin:14px 0 18px 0;font-family:ui-monospace,monospace;font-size:12px;color:#e2e8f0;word-break:break-all}
  .row{display:flex;gap:8px}
  button{flex:1;padding:10px 12px;border:0;border-radius:6px;font-size:14px;font-weight:600;cursor:pointer}
  .approve{background:#0d9488;color:#fff}
  .approve:hover{background:#14b8a6}
  .cancel{background:#334155;color:#e2e8f0;text-decoration:none;text-align:center;display:inline-block;line-height:22px}
</style></head>
<body><div class="card">
  <h1>Approve this MCP connector</h1>
  <p>A client is requesting access to your PsychPro MCP server. After approval it will be able to add topics, flashcards, quizzes, study guides, and practice exams.</p>
  <p>Redirect target:</p>
  <div class="target">${escapeHtml(p.redirectUri)}</div>
  <form method="POST" action="/api/oauth/approve">
    <input type="hidden" name="csrf" value="${escapeHtml(nonce)}"/>
    <input type="hidden" name="oauth_response_type" value="${escapeHtml(p.responseType)}"/>
    <input type="hidden" name="oauth_client_id" value="${escapeHtml(p.clientId)}"/>
    <input type="hidden" name="oauth_redirect_uri" value="${escapeHtml(p.redirectUri)}"/>
    <input type="hidden" name="oauth_code_challenge" value="${escapeHtml(p.codeChallenge)}"/>
    <input type="hidden" name="oauth_code_challenge_method" value="${escapeHtml(p.codeChallengeMethod)}"/>
    ${p.state ? `<input type="hidden" name="oauth_state" value="${escapeHtml(p.state)}"/>` : ""}
    <div class="row">
      <button type="submit" class="approve">Approve</button>
      <a href="about:blank" class="cancel">Cancel</a>
    </div>
  </form>
</div></body></html>`;
}

function setOwnerCookie(res: Response, value: string, maxAgeSeconds: number): void {
  // Secure in prod (set by the deployment env), lax-only in dev so the local
  // smoke test over http works. SameSite=Lax is fine: this cookie is only
  // consulted on /oauth/authorize navigations, never on cross-site POSTs from
  // Claude (those go straight to /oauth/token without the cookie).
  const isProd = process.env.NODE_ENV === "production";
  const parts = [
    `${OWNER_COOKIE_NAME}=${encodeURIComponent(value)}`,
    "Path=/api/oauth",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (isProd) parts.push("Secure");
  res.append("Set-Cookie", parts.join("; "));
}

/**
 * OAuth 2.1 + PKCE endpoints for the MCP route.
 *
 * Layout: discovery is served at BOTH
 *   - `/.well-known/oauth-authorization-server` (root path, registered as an
 *     extra `paths` entry in `artifact.toml` so the platform router forwards
 *     it to this server even though everything else lives under `/api`); and
 *   - `/api/.well-known/oauth-authorization-server` (api-prefixed alias for
 *     clients that probe the api base).
 *
 * The other endpoints (`/authorize`, `/token`, `/register`) all live under
 * `/api/oauth/*` because path-based routing prevents us from serving them
 * directly at the root (the SPA owns `/`).
 *
 * Owner-gated approval (single-owner):
 *   1. `GET /api/oauth/authorize` checks for a valid `pp_oauth_owner` cookie.
 *      No cookie → render an HTML form that prompts for `MCP_ADMIN_SECRET`
 *      and POSTs to `/api/oauth/owner-login` (IP-rate-limited).
 *   2. With cookie → render a one-click approval page showing the
 *      `redirect_uri`. The form POSTs same-origin to `/api/oauth/approve`
 *      with a signed CSRF nonce; only that path actually issues the auth
 *      code. This blocks the CSRF/confused-deputy attack where a malicious
 *      third-party page would trigger top-level navigation to `/authorize`
 *      and harvest tokens via the owner's SameSite=Lax cookie.
 *   3. `POST /api/oauth/approve` verifies cookie + nonce, then 302s the
 *      caller back to `redirect_uri` with `code` + `state`. PKCE S256 +
 *      redirect_uri exact-match + 60s single-use auth code keep the channel
 *      safe against passive observers.
 */

const router = Router();

function issuerForRequest(req: Request): string {
  const override = process.env.OAUTH_ISSUER;
  if (override) return override.replace(/\/$/, "");
  // `trust proxy = 1` (set in app.ts) makes req.protocol / req.hostname honor
  // X-Forwarded-Proto / X-Forwarded-Host from the Replit edge.
  const proto = req.protocol;
  const host = req.get("host");
  return `${proto}://${host}`;
}

function discoveryDocument(req: Request): Record<string, unknown> {
  const issuer = issuerForRequest(req);
  return {
    issuer,
    authorization_endpoint: `${issuer}/api/oauth/authorize`,
    token_endpoint: `${issuer}/api/oauth/token`,
    registration_endpoint: `${issuer}/api/oauth/register`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: ["none"],
    scopes_supported: ["mcp"],
  };
}

export function handleDiscovery(req: Request, res: Response): void {
  res.set("Cache-Control", "no-store");
  res.json(discoveryDocument(req));
}

router.get("/.well-known/oauth-authorization-server", handleDiscovery);

/**
 * Dynamic client registration (RFC 7591). We accept any client and persist it
 * in memory — the trust boundary is the PKCE-bound auth code + the
 * registered redirect_uri, not the client_id itself.
 */
router.post("/oauth/register", (req: Request, res: Response): void => {
  const body = req.body;
  if (!body || typeof body !== "object") {
    res.status(400).json({ error: "invalid_client_metadata", error_description: "Expected JSON object body" });
    return;
  }
  const rawRedirectUris = (body as { redirect_uris?: unknown }).redirect_uris;
  if (!Array.isArray(rawRedirectUris) || rawRedirectUris.length === 0) {
    res.status(400).json({
      error: "invalid_redirect_uri",
      error_description: "redirect_uris must be a non-empty array of strings",
    });
    return;
  }
  const redirectUris: string[] = [];
  for (const u of rawRedirectUris) {
    if (typeof u !== "string" || u.length === 0 || u.length > 2000) {
      res.status(400).json({
        error: "invalid_redirect_uri",
        error_description: "Each redirect_uri must be a non-empty string under 2000 chars",
      });
      return;
    }
    try {
      const parsed = new URL(u);
      if (parsed.protocol !== "https:" && parsed.hostname !== "localhost" && parsed.hostname !== "127.0.0.1") {
        res.status(400).json({
          error: "invalid_redirect_uri",
          error_description: "redirect_uri must use https (or http on localhost)",
        });
        return;
      }
    } catch {
      res.status(400).json({ error: "invalid_redirect_uri", error_description: `Not a valid URL: ${u}` });
      return;
    }
    redirectUris.push(u);
  }
  const client = registerClient({
    redirectUris,
    metadata: body as Record<string, unknown>,
  });
  res.status(201).json({
    client_id: client.clientId,
    client_id_issued_at: client.clientIdIssuedAt,
    redirect_uris: client.redirectUris,
    token_endpoint_auth_method: "none",
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
  });
});

function redirectWithError(res: Response, redirectUri: string, state: string | null, error: string, description: string): void {
  const url = new URL(redirectUri);
  url.searchParams.set("error", error);
  url.searchParams.set("error_description", description);
  if (state) url.searchParams.set("state", state);
  res.redirect(302, url.toString());
}

/**
 * Auto-approving authorize endpoint. Validates the request, then 302s the
 * caller back to its redirect_uri with `code` + `state`. We never render a
 * login or consent page — there's exactly one principal (the site owner) and
 * any attacker who triggers this gets nothing without the PKCE verifier.
 */
interface AuthorizeParams {
  clientId: string;
  redirectUri: string;
  responseType: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  state: string | null;
}

/**
 * Validate authorize params and either complete the flow (302) or return a
 * validation error. Used for both the GET handler and the POST owner-login
 * replay path so they share identical semantics.
 */
function completeAuthorize(req: Request, res: Response, p: AuthorizeParams): void {
  if (!p.clientId) {
    res.status(400).json({ error: "invalid_request", error_description: "Missing client_id" });
    return;
  }
  const client = getClient(p.clientId);
  if (!client) {
    res.status(400).json({ error: "invalid_client", error_description: "Unknown client_id" });
    return;
  }
  if (!p.redirectUri) {
    res.status(400).json({ error: "invalid_request", error_description: "Missing redirect_uri" });
    return;
  }
  if (!clientAllowsRedirectUri(client, p.redirectUri)) {
    res.status(400).json({ error: "invalid_request", error_description: "redirect_uri not registered for this client" });
    return;
  }
  const state = p.state;
  if (p.responseType !== "code") {
    redirectWithError(res, p.redirectUri, state, "unsupported_response_type", "Only response_type=code is supported");
    return;
  }
  if (p.codeChallengeMethod !== "S256") {
    redirectWithError(res, p.redirectUri, state, "invalid_request", "code_challenge_method must be S256");
    return;
  }
  if (!p.codeChallenge || p.codeChallenge.length < 43 || p.codeChallenge.length > 128) {
    redirectWithError(res, p.redirectUri, state, "invalid_request", "code_challenge missing or wrong length");
    return;
  }
  const code = issueAuthCode({ clientId: p.clientId, redirectUri: p.redirectUri, codeChallenge: p.codeChallenge });
  const target = new URL(p.redirectUri);
  target.searchParams.set("code", code);
  if (state) target.searchParams.set("state", state);
  res.redirect(302, target.toString());
}

function paramsFromQuery(q: Record<string, string | undefined>): AuthorizeParams {
  return {
    clientId: typeof q.client_id === "string" ? q.client_id : "",
    redirectUri: typeof q.redirect_uri === "string" ? q.redirect_uri : "",
    responseType: typeof q.response_type === "string" ? q.response_type : "",
    codeChallenge: typeof q.code_challenge === "string" ? q.code_challenge : "",
    codeChallengeMethod: typeof q.code_challenge_method === "string" ? q.code_challenge_method : "",
    state: typeof q.state === "string" ? q.state : null,
  };
}

router.get("/oauth/authorize", (req: Request, res: Response): void => {
  // Owner gate (see top-of-file rationale). If MCP_ADMIN_SECRET is unset the
  // whole MCP system is in "not configured" mode — refuse rather than
  // silently auto-approve.
  if (!getAdminSecret()) {
    res.status(503).type("text/plain").send(
      "Server not configured: MCP_ADMIN_SECRET is missing. Set it in Replit Secrets and restart.",
    );
    return;
  }
  const cookie = getCookie(req, OWNER_COOKIE_NAME);
  const q = req.query as Record<string, string | undefined>;
  if (!verifyOwnerSessionCookie(cookie)) {
    res.status(200).type("text/html").send(renderOwnerLoginPage(q, {}));
    return;
  }
  renderApproveOrRespondWithError(res, paramsFromQuery(q));
});

/**
 * Render the approve page if the params pass basic structural validation.
 * If they don't, surface the same errors `completeAuthorize` would so the
 * caller (Claude) sees a normal OAuth error rather than a blank page.
 */
function renderApproveOrRespondWithError(res: Response, p: AuthorizeParams): void {
  if (!p.clientId) {
    res.status(400).json({ error: "invalid_request", error_description: "Missing client_id" });
    return;
  }
  const client = getClient(p.clientId);
  if (!client) {
    res.status(400).json({ error: "invalid_client", error_description: "Unknown client_id" });
    return;
  }
  if (!p.redirectUri) {
    res.status(400).json({ error: "invalid_request", error_description: "Missing redirect_uri" });
    return;
  }
  if (!clientAllowsRedirectUri(client, p.redirectUri)) {
    res.status(400).json({ error: "invalid_request", error_description: "redirect_uri not registered for this client" });
    return;
  }
  if (p.responseType !== "code") {
    redirectWithError(res, p.redirectUri, p.state, "unsupported_response_type", "Only response_type=code is supported");
    return;
  }
  if (p.codeChallengeMethod !== "S256") {
    redirectWithError(res, p.redirectUri, p.state, "invalid_request", "code_challenge_method must be S256");
    return;
  }
  if (!p.codeChallenge || p.codeChallenge.length < 43 || p.codeChallenge.length > 128) {
    redirectWithError(res, p.redirectUri, p.state, "invalid_request", "code_challenge missing or wrong length");
    return;
  }
  res.status(200).type("text/html").send(renderApprovePage(p, mintApproveNonce()));
}

/**
 * Owner-login form target. IP-rate-limited (10 attempts / 5 min) to slow
 * online brute-force guessing of MCP_ADMIN_SECRET. On success: sets the
 * owner cookie and renders the per-request approval page (a separate POST
 * is required to actually issue the auth code, blocking CSRF).
 */
router.post("/oauth/owner-login", (req: Request, res: Response): void => {
  const secret = getAdminSecret();
  if (!secret) {
    res.status(503).type("text/plain").send("Server not configured: MCP_ADMIN_SECRET is missing.");
    return;
  }
  if (loginRateLimited(req.ip ?? "unknown")) {
    res.status(429).type("text/plain").send("Too many login attempts. Wait 5 minutes and try again.");
    return;
  }
  const body = (req.body ?? {}) as Record<string, unknown>;
  const provided = typeof body.secret === "string" ? body.secret : "";
  const replayQuery: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(body)) {
    if (k.startsWith("oauth_") && typeof v === "string") replayQuery[k.slice("oauth_".length)] = v;
  }
  if (!provided || !constantTimeStringEquals(provided, secret)) {
    res
      .status(401)
      .type("text/html")
      .send(renderOwnerLoginPage(replayQuery, { error: "Invalid admin secret. Try again." }));
    return;
  }
  const cookie = mintOwnerSessionCookie();
  setOwnerCookie(res, cookie.value, cookie.maxAgeSeconds);
  renderApproveOrRespondWithError(res, paramsFromQuery(replayQuery));
});

/**
 * Final approval step. Requires both the owner cookie (proves prior owner
 * login) AND a valid CSRF nonce (proves same-origin form submission). Only
 * this endpoint actually issues an auth code.
 */
router.post("/oauth/approve", (req: Request, res: Response): void => {
  if (!getAdminSecret()) {
    res.status(503).type("text/plain").send("Server not configured: MCP_ADMIN_SECRET is missing.");
    return;
  }
  const cookie = getCookie(req, OWNER_COOKIE_NAME);
  if (!verifyOwnerSessionCookie(cookie)) {
    res.status(401).type("text/plain").send("Owner session expired. Go back and start authorization again.");
    return;
  }
  const body = (req.body ?? {}) as Record<string, unknown>;
  const nonce = typeof body.csrf === "string" ? body.csrf : "";
  if (!verifyApproveNonce(nonce)) {
    res.status(400).type("text/plain").send("Invalid or expired approval token.");
    return;
  }
  const replayQuery: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(body)) {
    if (k.startsWith("oauth_") && typeof v === "string") replayQuery[k.slice("oauth_".length)] = v;
  }
  completeAuthorize(req, res, paramsFromQuery(replayQuery));
});

router.post("/oauth/token", (req: Request, res: Response): void => {
  res.set("Cache-Control", "no-store");
  // Token endpoint accepts both form-encoded (per RFC 6749) and JSON bodies —
  // the global `express.urlencoded({ extended: true })` and `express.json()`
  // middlewares populate `req.body` for both.
  const body = (req.body ?? {}) as Record<string, unknown>;
  const grantType = body.grant_type;
  const clientId = typeof body.client_id === "string" ? body.client_id : null;

  if (!clientId) {
    res.status(400).json({ error: "invalid_request", error_description: "Missing client_id" });
    return;
  }
  if (!getClient(clientId)) {
    res.status(400).json({ error: "invalid_client", error_description: "Unknown client_id" });
    return;
  }

  if (grantType === "authorization_code") {
    const code = typeof body.code === "string" ? body.code : null;
    const redirectUri = typeof body.redirect_uri === "string" ? body.redirect_uri : null;
    const codeVerifier = typeof body.code_verifier === "string" ? body.code_verifier : null;
    if (!code || !redirectUri || !codeVerifier) {
      res.status(400).json({ error: "invalid_request", error_description: "Missing code, redirect_uri, or code_verifier" });
      return;
    }
    const result = consumeAuthCode({ code, clientId, redirectUri, codeVerifier });
    if (!result.ok) {
      res.status(400).json({ error: result.error, error_description: result.description });
      return;
    }
    const tokens = issueTokens(clientId);
    res.json({
      access_token: tokens.accessToken,
      token_type: "Bearer",
      expires_in: tokens.expiresIn,
      refresh_token: tokens.refreshToken,
      scope: "mcp",
    });
    return;
  }

  if (grantType === "refresh_token") {
    const refreshToken = typeof body.refresh_token === "string" ? body.refresh_token : null;
    if (!refreshToken) {
      res.status(400).json({ error: "invalid_request", error_description: "Missing refresh_token" });
      return;
    }
    const result = rotateRefreshToken({ refreshToken, clientId });
    if (!result.ok) {
      res.status(400).json({ error: result.error, error_description: result.description });
      return;
    }
    res.json({
      access_token: result.tokens.accessToken,
      token_type: "Bearer",
      expires_in: result.tokens.expiresIn,
      refresh_token: result.tokens.refreshToken,
      scope: "mcp",
    });
    return;
  }

  res.status(400).json({
    error: "unsupported_grant_type",
    error_description: `grant_type must be 'authorization_code' or 'refresh_token'`,
  });
});

export default router;
