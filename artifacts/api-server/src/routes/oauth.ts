import { Router, type Request, type Response } from "express";
import {
  registerClient,
  getClient,
  clientAllowsRedirectUri,
  issueAuthCode,
  consumeAuthCode,
  issueTokens,
  rotateRefreshToken,
} from "../lib/oauthStore";
import { oauthRegisterRateLimit } from "../middlewares/oauthRegisterRateLimit";

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
 * Single-user auto-approve flow (per task spec): `GET /api/oauth/authorize`
 * validates the request and 302s the caller back to its registered
 * `redirect_uri` with `code` + `state`. No login or consent screen — there
 * is exactly one principal (the site owner / Claude.ai connector). PKCE
 * S256 + redirect_uri exact-match + 60s single-use auth code keep the flow
 * safe against passive observers; an attacker who replays the redirect
 * cannot exchange the code because they don't hold the PKCE verifier.
 */

const router = Router();

export function issuerForRequest(req: Request): string {
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

/**
 * OAuth 2.0 Protected Resource Metadata (RFC 9728).
 *
 * The MCP authorization spec requires the resource server (this `/api/mcp`
 * endpoint) to publish a protected-resource document pointing at the
 * authorization server(s) that issue tokens for it. Claude.ai's web custom
 * connector fetches `/.well-known/oauth-protected-resource` (and the
 * resource-specific `/.well-known/oauth-protected-resource/api/mcp` variant)
 * and follows `resource_metadata` from a 401 `WWW-Authenticate` here. If this
 * path isn't served by the api-server it falls through to the SPA, which
 * returns `text/html` and breaks the client's discovery (the connector then
 * reports it can't connect).
 */
function protectedResourceDocument(req: Request): Record<string, unknown> {
  const issuer = issuerForRequest(req);
  return {
    resource: `${issuer}/api/mcp`,
    authorization_servers: [issuer],
    scopes_supported: ["mcp"],
    bearer_methods_supported: ["header"],
  };
}

export function handleProtectedResource(req: Request, res: Response): void {
  res.set("Cache-Control", "no-store");
  res.json(protectedResourceDocument(req));
}

router.get("/.well-known/oauth-authorization-server", handleDiscovery);
router.get("/.well-known/oauth-protected-resource", handleProtectedResource);
router.get("/.well-known/oauth-protected-resource/api/mcp", handleProtectedResource);

/**
 * Dynamic client registration (RFC 7591). We accept any client and persist it
 * in memory — the trust boundary is the PKCE-bound auth code + the
 * registered redirect_uri, not the client_id itself.
 */
router.post("/oauth/register", oauthRegisterRateLimit, async (req: Request, res: Response): Promise<void> => {
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
      const isHttps = parsed.protocol === "https:";
      const isLoopback = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
      const isHttpLoopback = parsed.protocol === "http:" && isLoopback;
      // Spec: HTTPS anywhere, OR plain HTTP only on loopback. Anything else
      // (ftp://, custom schemes, http on a public host, …) is rejected.
      if (!isHttps && !isHttpLoopback) {
        res.status(400).json({
          error: "invalid_redirect_uri",
          error_description: "redirect_uri must use https (or http on localhost/127.0.0.1)",
        });
        return;
      }
    } catch {
      res.status(400).json({ error: "invalid_redirect_uri", error_description: `Not a valid URL: ${u}` });
      return;
    }
    redirectUris.push(u);
  }
  const client = await registerClient({
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

interface AuthorizeParams {
  clientId: string;
  redirectUri: string;
  responseType: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  state: string | null;
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

/**
 * Validate authorize params and either complete the flow (302) or return a
 * validation error. The structural errors (missing client_id, unknown
 * client, bad redirect_uri) return JSON because we can't safely redirect to
 * an unverified URI. Once redirect_uri is verified, parameter errors are
 * reported via the standard OAuth error redirect.
 */
async function completeAuthorize(res: Response, p: AuthorizeParams): Promise<void> {
  if (!p.clientId) {
    res.status(400).json({ error: "invalid_request", error_description: "Missing client_id" });
    return;
  }
  const client = await getClient(p.clientId);
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
  const code = await issueAuthCode({ clientId: p.clientId, redirectUri: p.redirectUri, codeChallenge: p.codeChallenge });
  const target = new URL(p.redirectUri);
  target.searchParams.set("code", code);
  if (state) target.searchParams.set("state", state);
  res.redirect(302, target.toString());
}

router.get("/oauth/authorize", async (req: Request, res: Response): Promise<void> => {
  await completeAuthorize(res, paramsFromQuery(req.query as Record<string, string | undefined>));
});

router.post("/oauth/token", async (req: Request, res: Response): Promise<void> => {
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
  if (!(await getClient(clientId))) {
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
    const result = await consumeAuthCode({ code, clientId, redirectUri, codeVerifier });
    if (!result.ok) {
      res.status(400).json({ error: result.error, error_description: result.description });
      return;
    }
    const tokens = await issueTokens(clientId);
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
    const result = await rotateRefreshToken({ refreshToken, clientId });
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
