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

app.use(clerkMiddleware());

app.use("/api", (req: Request, res: Response, next: NextFunction): void => {
  // Public routes: health check, topic list, individual topic info, stripe webhook
  const isPublic =
    req.path === "/healthz" ||
    req.path === "/topics" ||
    req.path.startsWith("/stripe/") ||
    // Client-side error reports may originate before sign-in or after auth fails
    (req.path === "/client-errors" && req.method === "POST") ||
    // Allow unauthenticated access to topic list and individual topic detail only
    (/^\/topics\/\d+$/.test(req.path) && req.method === "GET");
  if (isPublic) {
    next();
    return;
  }
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
});

app.use("/api", router);

export default app;
