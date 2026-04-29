import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getUncachableStripeClient } from "../stripeClient";
import { getAuth } from "@clerk/express";

const router = Router();

function getUserId(req: Request): string | null {
  return getAuth(req).userId ?? null;
}

router.get("/subscription/plans", async (req: Request, res: Response): Promise<void> => {
  try {
    const stripe = await getUncachableStripeClient();
    const products = await stripe.products.list({ active: true, limit: 100 });
    const plans = [];
    for (const product of products.data) {
      // Only surface products tagged as PsychPro tiers — this prevents any
      // unrelated products living in the same Stripe account (test artifacts,
      // future SKUs, etc.) from appearing on the pricing page.
      const tier = product.metadata?.neuronotes_tier;
      if (tier !== "pro" && tier !== "scholar") continue;

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
        });
      }
    }
    res.json(plans);
  } catch (err) {
    req.log.error({ err }, "Error getting subscription plans");
    res.json([]);
  }
});

router.post("/subscription/checkout", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { priceId } = req.body as { priceId: string };
    let [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    const stripe = await getUncachableStripeClient();

    let customerId = user?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user?.email ?? undefined,
        metadata: { userId },
      });
      customerId = customer.id;
      if (!user) {
        [user] = await db
          .insert(usersTable)
          .values({ id: userId, subscriptionStatus: "free", onboardingComplete: false, stripeCustomerId: customerId })
          .returning();
      } else {
        await db.update(usersTable).set({ stripeCustomerId: customerId }).where(eq(usersTable.id, userId));
      }
    }

    const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(",")[0]}`;
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${baseUrl}/subscription?success=true`,
      cancel_url: `${baseUrl}/subscription?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (err) {
    req.log.error({ err }, "Error creating checkout session");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/subscription/portal", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
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

router.get("/subscription/invoices", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user?.stripeCustomerId) {
      res.json([]);
      return;
    }

    const stripe = await getUncachableStripeClient();
    const invoices = await stripe.invoices.list({ customer: user.stripeCustomerId, limit: 10 });

    const items = invoices.data.map((inv) => ({
      id: inv.id ?? "",
      number: inv.number ?? null,
      created: new Date(inv.created * 1000).toISOString(),
      amountPaid: inv.amount_paid ?? 0,
      amountDue: inv.amount_due ?? 0,
      currency: inv.currency,
      status: inv.status ?? "draft",
      hostedInvoiceUrl: inv.hosted_invoice_url ?? null,
      invoicePdf: inv.invoice_pdf ?? null,
    }));

    res.json(items);
  } catch (err) {
    req.log.error({ err }, "Error listing invoices");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/subscription/status", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user) {
      res.json({ status: "free", subscriptionId: null, currentPeriodEnd: null });
      return;
    }

    if (user.stripeSubscriptionId) {
      try {
        const stripe = await getUncachableStripeClient();
        const sub = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        const periodEnd = (sub as unknown as { current_period_end: number }).current_period_end;
        res.json({
          status: sub.status,
          tier: user.subscriptionStatus,
          subscriptionId: sub.id,
          currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        });
        return;
      } catch {
        // fall through to user record
      }
    }
    res.json({ status: user.subscriptionStatus, tier: user.subscriptionStatus, subscriptionId: user.stripeSubscriptionId, currentPeriodEnd: null });
  } catch (err) {
    req.log.error({ err }, "Error getting subscription status");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
