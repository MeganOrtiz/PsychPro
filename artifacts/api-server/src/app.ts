import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { getUncachableStripeClient } from "./stripeClient";
import { handleStripeWebhookEvent } from "./webhookHandlers";
import type Stripe from "stripe";

const app: Express = express();

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
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      logger.warn("STRIPE_WEBHOOK_SECRET not set; rejecting unsigned webhook");
      return res.status(400).json({ error: "Webhook secret not configured" });
    }

    if (!sig) {
      return res.status(400).json({ error: "Missing stripe-signature header" });
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

const publicPaths = ["/healthz", "/topics", "/topics/"];
app.use("/api", (req, res, next) => {
  const isPublic = publicPaths.some(p => req.path === p || req.path.startsWith("/topics/")) ||
    req.path.startsWith("/stripe/");
  if (isPublic) return next();
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return next();
});

app.use("/api", router);

export default app;
