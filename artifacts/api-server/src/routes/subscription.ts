import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getUncachableStripeClient } from "../stripeClient";
import { requireUserId } from "../lib/userId";
import {
  ACTIVE_SUBSCRIPTION_STATUSES,
  isApprovedSubscriptionTier,
  isUnclassifiedPlanMetadata,
  subscriptionStatusApiShape,
  tierFromTierMetadata,
} from "../lib/tierMapping";

const router = Router();

router.get("/subscription/plans", async (req: Request, res: Response): Promise<void> => {
  try {
    const stripe = await getUncachableStripeClient();
    const products = await stripe.products.list({ active: true, limit: 100 });
    const plans = [];
    for (const product of products.data) {
      // Only surface products tagged as PsychPro tiers — this prevents any
      // unrelated products living in the same Stripe account (test artifacts,
      // future SKUs, etc.) from appearing on the pricing page.
      // "master" is accepted as an alias for "pro" — the display name in
      // Stripe / the dashboard is "Master", but the internal tier string
      // stays "pro" everywhere else in the codebase. Case-insensitive so
      // metadata values like "Scholar" or "Pro" entered via the Stripe
      // dashboard still match.
      const meta = product.metadata?.neuronotes_tier;
      if (!isApprovedSubscriptionTier(meta)) {
        // Surface likely Stripe misconfiguration: a product whose neuronotes_tier
        // is MISSING/blank or an UNRECOGNIZED value will silently never appear on
        // the pricing page. (EPPP-tagged products are intentionally excluded here
        // — they're sold via /eppp/plans, not as a Master/Scholar subscription.)
        if (isUnclassifiedPlanMetadata(meta)) {
          req.log.warn(
            { productId: product.id, neuronotes_tier: meta ?? null },
            "Active Stripe product is not tagged as an approved Master/Scholar plan (missing or unrecognized neuronotes_tier); not shown as a subscription plan",
          );
        }
        continue;
      }

      // Categorize by the canonical metadata mapping, NOT the display name.
      const tier = tierFromTierMetadata(meta);

      const prices = await stripe.prices.list({ product: product.id, active: true, limit: 10 });
      for (const price of prices.data) {
        // Only surface recurring monthly/yearly prices — skip one-off prices
        // and any non-standard recurring intervals so atypical SKUs don't
        // leak into the pricing page.
        const interval = price.recurring?.interval;
        if (interval !== "month" && interval !== "year") continue;

        plans.push({
          id: product.id,
          name: product.name,
          description: product.description ?? null,
          priceId: price.id,
          unitAmount: price.unit_amount ?? 0,
          currency: price.currency,
          interval,
          tier,
        });
      }
    }
    res.json(plans);
  } catch (err) {
    // B-11: surface real upstream Stripe errors as 500 so the client can
    // distinguish "Stripe is broken" from "no plans match the filter". The
    // empty-array path above is reserved for the legitimate case where the
    // Stripe account simply has zero products tagged `neuronotes_tier`.
    req.log.error({ err }, "Error getting subscription plans");
    res.status(500).json({ error: "Unable to load plans" });
  }
});

router.post("/subscription/checkout", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const { priceId, successPath } = req.body as { priceId: string; successPath?: string };
    if (!priceId || typeof priceId !== "string") {
      res.status(400).json({ error: "Missing priceId" });
      return;
    }
    // Only accept a same-origin relative path (single leading slash, no
    // protocol-relative "//"), then prefix it with our own domain below. This
    // lets onboarding land paid users on the dashboard without opening an
    // open-redirect: an attacker-supplied absolute/off-domain URL is rejected.
    const safeReturnPath =
      typeof successPath === "string" && /^\/(?!\/)[\w/?=&%.#-]*$/.test(successPath)
        ? successPath
        : "/subscription?success=true";
    let [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));

    // Pre-launch guard: block a second Checkout Session when the user is
    // already on an active paid tier. Without this, a user who hits Subscribe
    // twice (or a stale frontend that doesn't reflect a recent purchase) can
    // generate overlapping subscriptions and double-charge themselves. Active
    // tiers mirror the mapping in GET /subscription/status — keep in sync.
    if (user?.subscriptionStatus && ACTIVE_SUBSCRIPTION_STATUSES.has(user.subscriptionStatus)) {
      res.status(409).json({
        error: "You already have an active subscription. Manage it from the billing portal.",
        code: "already_subscribed",
      });
      return;
    }

    const stripe = await getUncachableStripeClient();

    // Validate that the submitted priceId belongs to an approved PsychPro plan.
    // This prevents a user from supplying an arbitrary Stripe price from the
    // same account (hidden SKUs, legacy prices, test artifacts, etc.) and
    // receiving paid entitlements at the wrong price.
    try {
      const price = await stripe.prices.retrieve(priceId, { expand: ["product"] });
      const product = price.product as import("stripe").default.Product;
      const interval = price.recurring?.interval;
      const isApprovedTier = isApprovedSubscriptionTier(product?.metadata?.neuronotes_tier);
      const isApprovedInterval = interval === "month" || interval === "year";
      if (!isApprovedTier || !isApprovedInterval || !price.active || product.deleted) {
        res.status(400).json({ error: "Invalid plan selected" });
        return;
      }
    } catch {
      res.status(400).json({ error: "Invalid plan selected" });
      return;
    }

    // Idempotency keys protect against network retries. A double-tap on
    // Subscribe (or a transient timeout that triggers the SDK's auto-retry)
    // would otherwise create duplicate Stripe Customers for the same user.
    // Keying customer creation by userId is safe — at most one Customer per
    // user exists in our model.
    let customerId = user?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create(
        { email: user?.email ?? undefined, metadata: { userId } },
        { idempotencyKey: `customer-create:${userId}` },
      );
      customerId = customer.id;
      if (!user) {
        [user] = await db
          .insert(usersTable)
          .values({ id: userId, subscriptionStatus: "free", isAdmin: false, onboardingComplete: false, stripeCustomerId: customerId })
          .returning();
      } else {
        await db.update(usersTable).set({ stripeCustomerId: customerId }).where(eq(usersTable.id, userId));
      }
    }

    const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(",")[0]}`;
    // Idempotency key for the Checkout Session is scoped by user + price so
    // a retry within Stripe's idempotency window (24h) returns the same
    // session, but switching plans cleanly creates a new one.
    const session = await stripe.checkout.sessions.create(
      {
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        success_url: `${baseUrl}${safeReturnPath}`,
        cancel_url: `${baseUrl}/subscription?canceled=true`,
      },
      { idempotencyKey: `checkout:${userId}:${priceId}` },
    );

    res.json({ url: session.url });
  } catch (err) {
    req.log.error({ err }, "Error creating checkout session");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/subscription/portal", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user?.stripeCustomerId) {
      res.status(400).json({ error: "No Stripe customer on file" });
      return;
    }

    const stripe = await getUncachableStripeClient();
    const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(",")[0]}`;
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${baseUrl}/subscription`,
    });

    res.json({ url: session.url });
  } catch (err) {
    req.log.error({ err }, "Error creating customer portal session");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/subscription/status", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));

    // No row yet → free tier. Do not auto-create the user here; that
    // happens via /users/profile or other write paths.
    if (!user) {
      res.json({
        status: "free",
        tier: "free",
        subscriptionId: null,
        currentPeriodEnd: null,
      });
      return;
    }

    // Map DB subscriptionStatus to the {status, tier} shape the frontend
    // expects via the canonical mapping (see lib/tierMapping.ts).
    const { status, tier } = subscriptionStatusApiShape(user.subscriptionStatus);

    res.json({
      status,
      tier,
      subscriptionId: user.stripeSubscriptionId ?? null,
      currentPeriodEnd: null,
    });
  } catch (err) {
    req.log.error({ err }, "Error getting subscription status");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
