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
    const products = await stripe.products.list({ active: true, limit: 10 });
    const plans = [];
    for (const product of products.data) {
      const prices = await stripe.prices.list({ product: product.id, active: true, limit: 10 });
      for (const price of prices.data) {
        plans.push({
          id: product.id,
          name: product.name,
          description: product.description ?? null,
          priceId: price.id,
          unitAmount: price.unit_amount ?? 0,
          currency: price.currency,
          interval: (price.recurring?.interval ?? "month"),
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
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    const stripe = await getUncachableStripeClient();

    let customerId = user?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user?.email ?? undefined,
        metadata: { userId },
      });
      customerId = customer.id;
      await db.update(usersTable).set({ stripeCustomerId: customerId }).where(eq(usersTable.id, userId));
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
          subscriptionId: sub.id,
          currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        });
        return;
      } catch {
        // fall through to user record
      }
    }
    res.json({ status: user.subscriptionStatus, subscriptionId: user.stripeSubscriptionId, currentPeriodEnd: null });
  } catch (err) {
    req.log.error({ err }, "Error getting subscription status");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
