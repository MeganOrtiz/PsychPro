import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import router from "./routes";
import { handleDiscovery } from "./routes/oauth";
import { MCP_ENABLED } from "./lib/mcpEnabled";
import { logger } from "./lib/logger";
import { getUncachableStripeClient } from "./stripeClient";
import { handleStripeWebhookEvent } from "./webhookHandlers";
import type Stripe from "stripe";

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

app.use(cors());

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
      const message = err instanceof Error ? err.message : "Webhook verification failed";
      logger.error({ err }, "Stripe webhook error");
      res.status(400).json({ error: message });
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
app.use(
  clerkMiddleware({
    publishableKey: clerkPk,
    secretKey: clerkSk,
  }),
);

// Root-level OAuth discovery alias. The platform router forwards this exact
// path to the api-server (see `paths` in artifact.toml) so we have a stable
// `https://<host>/.well-known/oauth-authorization-server` URL even though
// everything else lives under `/api/*`. The same handler is also mounted at
// `/api/.well-known/...` via the oauth router for clients that probe the api
// base.
if (MCP_ENABLED) {
  app.get("/.well-known/oauth-authorization-server", handleDiscovery);
}

app.use("/api", router);

export default app;
