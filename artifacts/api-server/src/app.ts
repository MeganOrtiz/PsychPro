import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import router from "./routes";
import { handleDiscovery, handleProtectedResource } from "./routes/oauth";
import { MCP_ENABLED } from "./lib/mcpEnabled";
import { logger } from "./lib/logger";
import { getUncachableStripeClient } from "./stripeClient";
import { handleStripeWebhookEvent } from "./webhookHandlers";
import type Stripe from "stripe";
import * as Sentry from "@sentry/node";

const app: Express = express();

// Deployment assumption: this server runs behind exactly ONE trusted reverse
// proxy (the Replit front-end proxy in development and in `replit deploy`).
// With `trust proxy = 1`, Express derives `req.ip` from the X-Forwarded-For
// chain by trusting only the rightmost (proxy-appended) entry, so client-
// supplied X-Forwarded-For values cannot spoof the source IP. This is
// required for per-IP rate limiting on /api/client-errors to be
// tamper-resistant. If this service is ever placed behind additional proxies
// (e.g. a CDN in front of Replit), bump this number to match the new hop
// count, otherwise the rate limiter and any other req.ip-based logic will
// see the wrong client address.
app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Expose pino-http's generated request id as `X-Request-Id` on every
// response. Clients (the ErrorBoundary fallback, support tooling) can copy
// this ID when reporting an issue so we can correlate the report with the
// server-side log line without the user having to describe what they were
// doing. Must come AFTER pinoHttp — that's the middleware that assigns
// req.id.
app.use((req, res, next) => {
  const id = (req as unknown as { id?: string | number }).id;
  if (id !== undefined) res.setHeader("X-Request-Id", String(id));
  next();
});

// CORS lockdown. Production: only the canonical site origin and the Clerk
// auth subdomain may send credentialed requests. Dev: allow the Replit dev
// origin (REPLIT_DEV_DOMAIN) plus localhost so workspace previews still
// work. Additional origins can be supplied via CORS_ALLOWED_ORIGINS
// (comma-separated) for staging or custom domains without a code change.
// Server-to-server callers (curl, Stripe webhooks, MCP token exchanges)
// send no Origin header and are unaffected by CORS — this only locks down
// browser-initiated cross-origin requests.
const isProd = process.env.NODE_ENV === "production";
const explicitOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);
const allowedOrigins = new Set<string>([
  "https://psychprosuite.com",
  "https://auth.psychprosuite.com",
  ...explicitOrigins,
]);
if (!isProd) {
  if (process.env.REPLIT_DEV_DOMAIN) {
    allowedOrigins.add(`https://${process.env.REPLIT_DEV_DOMAIN}`);
  }
  allowedOrigins.add("http://localhost:5173");
  allowedOrigins.add("http://localhost:5000");
  allowedOrigins.add("http://127.0.0.1:5173");
}

// Claude's web client performs MCP/OAuth requests from the browser, so its
// origins must be allowed or the browser blocks the response (no ACAO header)
// and the "Add custom connector" flow fails before our server can act. We
// trust these origins ONLY on the MCP + OAuth discovery/flow endpoints — not
// the rest of the API — to avoid widening the credentialed CORS trust boundary.
const mcpClientOrigins = new Set<string>(["https://claude.ai", "https://claude.com"]);
function isMcpScopedPath(path: string): boolean {
  return (
    path === "/api/mcp" ||
    path.startsWith("/api/oauth/") ||
    path.startsWith("/.well-known/oauth") ||
    path.startsWith("/api/.well-known/oauth")
  );
}

app.use(
  cors((req, cb) => {
    const mcpScoped = isMcpScopedPath(req.path);
    cb(null, {
      origin(origin, originCb) {
        // No Origin header → not a browser cross-origin request; allow.
        if (!origin) return originCb(null, true);
        if (allowedOrigins.has(origin)) return originCb(null, true);
        if (mcpScoped && mcpClientOrigins.has(origin)) return originCb(null, true);
        return originCb(null, false);
      },
      credentials: true,
      // MCP clients (and OAuth-aware browsers) must be able to read these on the
      // response: WWW-Authenticate kicks off the OAuth flow on a 401, and
      // Mcp-Session-Id / Mcp-Protocol-Version are part of the MCP HTTP transport.
      exposedHeaders: ["WWW-Authenticate", "Mcp-Session-Id", "Mcp-Protocol-Version"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Mcp-Session-Id",
        "Mcp-Protocol-Version",
        "Accept",
      ],
    });
  }),
);

app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      logger.warn("STRIPE_WEBHOOK_SECRET not set; rejecting unsigned webhook");
      res.status(400).json({ error: "Webhook secret not configured" });
      return;
    }

    if (!sig) {
      res.status(400).json({ error: "Missing stripe-signature header" });
      return;
    }

    try {
      const stripe = await getUncachableStripeClient();
      const event: Stripe.Event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      await handleStripeWebhookEvent(event, logger);
      res.json({ received: true });
    } catch (err) {
      // Do not echo err.message back to the caller — Stripe's
      // constructEvent throws SignatureVerificationError messages that can
      // leak internal config detail (header layout, tolerance window,
      // expected secret prefix). Log the full error server-side, return a
      // generic 400 to the caller. Stripe only inspects the status code
      // for retry purposes; the body is informational.
      logger.error({ err }, "Stripe webhook error");
      res.status(400).json({ error: "Webhook verification failed" });
    }
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Clerk auth middleware — verifies session cookie OR `Authorization: Bearer
// <token>` on every request. Populates `getAuth(req)` so the route-level
// `requireUserId(req,res)` / `getOptionalUserId(req)` helpers in
// `src/lib/userId.ts` can read the verified Clerk user id. Every protected
// `/api/**` route derives identity from this middleware — there is no
// fallback to any client-supplied identity header (see `src/lib/userId.ts`,
// `replit.md` § Auth Pattern, and `threat_model.md` § Spoofing). If Clerk
// credentials are missing the middleware no-ops and protected routes will
// respond `401 Unauthorized`.
// In dev, prefer the CLERK_*_OVERRIDE pair (a dev Clerk instance) so the
// Replit dev origin can authenticate. In production we always use the
// non-override prod keys (they're domain-locked to auth.psychprosuite.com).
const isDev = process.env.NODE_ENV !== "production";
const clerkPk = (isDev && process.env.CLERK_PK_OVERRIDE) || process.env.CLERK_PUBLISHABLE_KEY;
const clerkSk = (isDev && process.env.CLERK_SK_OVERRIDE) || process.env.CLERK_SECRET_KEY;
const clerk = clerkMiddleware({
  publishableKey: clerkPk,
  secretKey: clerkSk,
});
app.use((req, res, next) => {
  // OAuth + MCP endpoints have their own auth model (PKCE for the OAuth flow,
  // bearer tokens for /api/mcp) and must NOT pass through Clerk's session
  // handshake. The authorize step happens in the user's logged-in browser, so
  // it carries Clerk cookies — letting Clerk run would trigger a session
  // handshake 307 that breaks the authorization-code flow and Claude never
  // receives a token ("Connection has expired").
  if (isMcpScopedPath(req.path)) return next();
  return clerk(req, res, next);
});

// Root-level OAuth discovery alias. The platform router forwards this exact
// path to the api-server (see `paths` in artifact.toml) so we have a stable
// `https://<host>/.well-known/oauth-authorization-server` URL even though
// everything else lives under `/api/*`. The same handler is also mounted at
// `/api/.well-known/...` via the oauth router for clients that probe the api
// base.
if (MCP_ENABLED) {
  app.get("/.well-known/oauth-authorization-server", handleDiscovery);
  // RFC 9728 Protected Resource Metadata, served at the root (not just under
  // `/api`) and registered in artifact.toml `paths` so the platform router
  // forwards it here instead of letting it fall through to the SPA (which
  // would return HTML and break Claude.ai's connector discovery). Both the
  // base path and the resource-specific `/api/mcp` suffix are published.
  app.get("/.well-known/oauth-protected-resource", handleProtectedResource);
  app.get("/.well-known/oauth-protected-resource/api/mcp", handleProtectedResource);
}

app.use("/api", router);

// Dev-only Sentry verification route. Registered ONLY when NODE_ENV is exactly
// "development", so it never exists in production and is absent from the
// route-auth matrix test (which boots the app with NODE_ENV=test). Throws
// synchronously; Express 5 forwards the error to the Sentry error handler
// below, confirming the backend → Sentry pipeline end-to-end.
if (process.env.NODE_ENV === "development") {
  app.get("/api/debug/sentry-test", () => {
    throw new Error("Sentry backend test error (dev-only)");
  });
}

// Sentry's Express error handler must be registered AFTER all routes and
// before any other error-handling middleware. It captures 5xx errors then
// forwards them to Express's default handler. No-ops when Sentry was not
// initialized (no DSN), so it is safe in tests.
Sentry.setupExpressErrorHandler(app);

export default app;
