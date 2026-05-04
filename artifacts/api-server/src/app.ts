import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { getUncachableStripeClient } from "./stripeClient";
import { handleStripeWebhookEvent } from "./webhookHandlers";
import { CLERK_PROXY_PATH, clerkProxyMiddleware } from "./middlewares/clerkProxyMiddleware";
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

app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

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

const EXPECTED_FAPI = "clerk.auth.psychprosuite.com";

function decodeFapi(k: string | undefined): string | null {
  if (!k) return null;
  const m = k.match(/^pk_(?:live|test)_(.+)$/);
  if (!m) return null;
  try {
    return Buffer.from(m[1], "base64").toString("utf8").replace(/\$+$/, "");
  } catch {
    return null;
  }
}

function pickPublishableKey(): { key: string | undefined; source: string } {
  const candidates = [
    { name: "CLERK_PK_OVERRIDE", val: process.env.CLERK_PK_OVERRIDE },
    { name: "CLERK_PUBLISHABLE_KEY", val: process.env.CLERK_PUBLISHABLE_KEY },
    { name: "VITE_CLERK_PUBLISHABLE_KEY", val: process.env.VITE_CLERK_PUBLISHABLE_KEY },
    { name: "clerk_frontend", val: process.env.clerk_frontend },
  ];
  for (const c of candidates) {
    if (c.val && decodeFapi(c.val) === EXPECTED_FAPI) {
      return { key: c.val, source: c.name };
    }
  }
  const first = candidates.find((c) => c.val);
  return first
    ? { key: first.val, source: first.name + " (fapi_mismatch)" }
    : { key: undefined, source: "none" };
}

function pickSecretKey(): { key: string | undefined; source: string } {
  const candidates = [
    { name: "CLERK_SK_OVERRIDE", val: process.env.CLERK_SK_OVERRIDE },
    { name: "CLERK_SECRET_KEY", val: process.env.CLERK_SECRET_KEY },
    { name: "clerk_backend", val: process.env.clerk_backend },
  ];
  const first = candidates.find((c) => c.val);
  return first
    ? { key: first.val, source: first.name }
    : { key: undefined, source: "none" };
}

const { key: clerkPublishableKey, source: pkSource } = pickPublishableKey();
const { key: clerkSecretKey, source: skSource } = pickSecretKey();

function describeKey(k: string | undefined): string {
  if (!k) return "MISSING";
  const m = k.match(/^(pk|sk)_(live|test)_/);
  return m ? `${m[0]}…(${k.length} chars)` : `present(${k.length} chars)`;
}

logger.info(
  {
    clerk: {
      secretKey: describeKey(clerkSecretKey),
      publishableKey: describeKey(clerkPublishableKey),
      publishableFapi: decodeFapi(clerkPublishableKey) ?? "n/a",
      sourceSecret: skSource,
      sourcePublishable: pkSource,
    },
  },
  "Clerk credentials resolved",
);

if (!clerkSecretKey) {
  logger.error(
    "CLERK_SECRET_KEY is missing — every authenticated request will return 401. " +
      "Set CLERK_SECRET_KEY (sk_live_…) in the deployment Secrets panel.",
  );
}

app.use(
  clerkMiddleware({
    secretKey: clerkSecretKey,
    publishableKey: clerkPublishableKey,
  }),
);

app.use("/api", (req: Request, res: Response, next: NextFunction): void => {
  const isPublic =
    req.path === "/healthz" ||
    req.path === "/topics" ||
    req.path.startsWith("/stripe/") ||
    (req.path === "/client-errors" && req.method === "POST") ||
    (/^\/topics\/\d+$/.test(req.path) && req.method === "GET");
  if (isPublic) {
    next();
    return;
  }
  const authHeader = req.headers.authorization;
  const auth = getAuth(req);
  const { userId } = auth;
  if (!userId) {
    logger.warn(
      {
        path: req.path,
        hasAuthHeader: !!authHeader,
        authHeaderPrefix: authHeader ? authHeader.substring(0, 15) + "…" : "none",
        sessionId: auth.sessionId ?? "none",
        reason: (auth as any).reason ?? "unknown",
      },
      "Auth rejected — no userId",
    );
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
});

app.use("/api", router);

export default app;
