import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import type { Logger } from "pino";
import type Stripe from "stripe";
import { getUncachableStripeClient } from "./stripeClient";

const APPROVED_TIERS = new Set(["pro", "scholar"]);

// Returns the PsychPro tier string for an approved subscription, or null if
// the underlying Stripe product is not an approved PsychPro plan. Callers
// must treat null as "free" — this prevents arbitrary Stripe subscriptions
// from the same account from granting paid entitlements.
async function getSubscriptionTier(stripe: Stripe, sub: Stripe.Subscription): Promise<string | null> {
  try {
    const priceId = sub.items.data[0]?.price?.id;
    if (!priceId) return null;
    const price = await stripe.prices.retrieve(priceId, { expand: ["product"] });
    const product = price.product as Stripe.Product;
    const tier = product?.metadata?.neuronotes_tier;
    if (!APPROVED_TIERS.has(tier)) return null;
    if (tier === "scholar") return "scholar";
    return "active";
  } catch {
    return null;
  }
}

export async function handleStripeWebhookEvent(event: Stripe.Event, log: Logger) {
  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
      const [user] = await db.select().from(usersTable).where(eq(usersTable.stripeCustomerId, customerId));
      if (user) {
        let newStatus: string;
        if (sub.status === "active" || sub.status === "trialing") {
          const stripe = await getUncachableStripeClient();
          newStatus = (await getSubscriptionTier(stripe, sub)) ?? "free";
        } else {
          newStatus = "free";
        }
        await db.update(usersTable).set({
          stripeSubscriptionId: sub.id,
          subscriptionStatus: newStatus,
        }).where(eq(usersTable.id, user.id));
        log.info({ userId: user.id, status: sub.status, newStatus }, "Updated user subscription");
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
      const [user] = await db.select().from(usersTable).where(eq(usersTable.stripeCustomerId, customerId));
      if (user) {
        await db.update(usersTable).set({
          subscriptionStatus: "free",
          stripeSubscriptionId: null,
        }).where(eq(usersTable.id, user.id));
        log.info({ userId: user.id }, "Cancelled user subscription");
      }
      break;
    }
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === "subscription" && session.customer) {
        const customerId = typeof session.customer === "string" ? session.customer : session.customer.id;
        const [user] = await db.select().from(usersTable).where(eq(usersTable.stripeCustomerId, customerId));
        if (user && session.subscription) {
          const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
          const stripe = await getUncachableStripeClient();
          const sub = await stripe.subscriptions.retrieve(subscriptionId, { expand: ["items.data.price.product"] });
          const tier = (await getSubscriptionTier(stripe, sub)) ?? "free";
          await db.update(usersTable).set({
            stripeSubscriptionId: subscriptionId,
            subscriptionStatus: tier,
          }).where(eq(usersTable.id, user.id));
        }
      }
      break;
    }
    default:
      log.info({ type: event.type }, "Unhandled Stripe event type");
  }
}
