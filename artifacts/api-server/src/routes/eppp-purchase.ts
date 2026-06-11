import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getUncachableStripeClient } from "../stripeClient";
import { requireUserId } from "../lib/userId";
import { isEpppTierMetadata } from "../lib/tierMapping";

const router = Router();

// EPPP Mastery Suite is a SEPARATE access level from Master/Scholar. Its Stripe
// product is tagged neuronotes_tier="eppp" and carries three prices:
//   - $99/mo recurring subscription
//   - $499 one-time  → 6 months  (price.metadata.eppp_months="6")
//   - $799 one-time  → 12 months (price.metadata.eppp_months="12")

// -----------------------------------------------------------------------------
// GET /eppp/plans  (anonymous catalog)
// Surfaces the EPPP product's purchase options: the monthly subscription plus
// the one-time access packs (with their granted months).
// -----------------------------------------------------------------------------
router.get("/eppp/plans", async (req: Request, res: Response): Promise<void> => {
  try {
    const stripe = await getUncachableStripeClient();
    const products = await stripe.products.list({ active: true, limit: 100 });
    const product = products.data.find((p) => isEpppTierMetadata(p.metadata?.neuronotes_tier));
    if (!product) {
      res.json({ productId: null, name: null, description: null, monthly: null, oneTime: [] });
      return;
    }

    const prices = await stripe.prices.list({ product: product.id, active: true, limit: 20 });
    let monthly: { priceId: string; unitAmount: number; currency: string; interval: string } | null = null;
    const oneTime: { priceId: string; unitAmount: number; currency: string; months: number }[] = [];

    for (const price of prices.data) {
      if (price.recurring) {
        // Only surface a standard monthly recurring price.
        if (price.recurring.interval === "month") {
          monthly = {
            priceId: price.id,
            unitAmount: price.unit_amount ?? 0,
            currency: price.currency,
            interval: price.recurring.interval,
          };
        }
        continue;
      }
      // One-time price: require a positive eppp_months so we never surface a
      // pack that grants no access.
      const months = parseInt(price.metadata?.eppp_months ?? "", 10);
      if (Number.isFinite(months) && months > 0) {
        oneTime.push({
          priceId: price.id,
          unitAmount: price.unit_amount ?? 0,
          currency: price.currency,
          months,
        });
      } else {
        // Misconfiguration: an EPPP one-time price with no valid eppp_months
        // would grant zero access, so it is intentionally not surfaced. Warn so
        // the missing metadata is fixable instead of silently dropping a SKU.
        req.log.warn(
          { productId: product.id, priceId: price.id, eppp_months: price.metadata?.eppp_months ?? null },
          "EPPP one-time price has no valid eppp_months metadata; not surfaced as a purchase option",
        );
      }
    }

    oneTime.sort((a, b) => a.months - b.months);

    res.json({
      productId: product.id,
      name: product.name,
      description: product.description ?? null,
      monthly,
      oneTime,
    });
  } catch (err) {
    req.log.error({ err }, "Error getting EPPP plans");
    res.status(500).json({ error: "Unable to load EPPP plans" });
  }
});

// -----------------------------------------------------------------------------
// POST /eppp/checkout  (protected)
// Creates a Stripe Checkout Session for an EPPP price. Recurring → subscription
// mode; one-time → payment mode. The webhook (webhookHandlers.ts) grants EPPP
// access on completion.
// -----------------------------------------------------------------------------
router.post("/eppp/checkout", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const { priceId } = req.body as { priceId?: string };
    if (!priceId || typeof priceId !== "string") {
      res.status(400).json({ error: "Missing priceId" });
      return;
    }

    let [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    const stripe = await getUncachableStripeClient();

    // Validate that the submitted priceId belongs to the EPPP product. This
    // prevents a user from supplying an arbitrary Stripe price and receiving
    // EPPP access at the wrong price.
    let isRecurring = false;
    try {
      const price = await stripe.prices.retrieve(priceId, { expand: ["product"] });
      const product = price.product as import("stripe").default.Product;
      const isEppp = isEpppTierMetadata(product?.metadata?.neuronotes_tier);
      isRecurring = !!price.recurring;
      const isOneTimeWithMonths =
        !price.recurring && (parseInt(price.metadata?.eppp_months ?? "", 10) || 0) > 0;
      const isMonthly = price.recurring?.interval === "month";
      if (!isEppp || !price.active || product.deleted || !(isMonthly || isOneTimeWithMonths)) {
        res.status(400).json({ error: "Invalid EPPP plan selected" });
        return;
      }
    } catch {
      res.status(400).json({ error: "Invalid EPPP plan selected" });
      return;
    }

    // Guard against duplicate EPPP subscriptions. One-time packs can always be
    // purchased (they stack onto remaining access), but a second $99/mo
    // subscription would double-charge.
    if (isRecurring && user?.epppSubscriptionId) {
      res.status(409).json({
        error: "You already have an active EPPP subscription. Manage it from the billing portal.",
        code: "already_subscribed",
      });
      return;
    }

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
    const session = await stripe.checkout.sessions.create(
      {
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: isRecurring ? "subscription" : "payment",
        success_url: `${baseUrl}/eppp/suite?eppp_success=true`,
        cancel_url: `${baseUrl}/eppp/suite?eppp_canceled=true`,
      },
      { idempotencyKey: `eppp-checkout:${userId}:${priceId}` },
    );

    res.json({ url: session.url });
  } catch (err) {
    req.log.error({ err }, "Error creating EPPP checkout session");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
