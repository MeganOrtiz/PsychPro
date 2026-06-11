import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import type { Logger } from "pino";
import type Stripe from "stripe";
import { getUncachableStripeClient } from "./stripeClient";
import {
  isEpppTierMetadata,
  subscriptionStatusFromTierMetadata,
} from "./lib/tierMapping";

function isEpppProduct(product: Stripe.Product | undefined | null): boolean {
  return isEpppTierMetadata(product?.metadata?.neuronotes_tier);
}

// Months of access granted by a one-time EPPP price (price.metadata.eppp_months
// — "6" for $499, "12" for $799). Returns 0 if absent/invalid.
function epppMonthsFromPrice(price: Stripe.Price | undefined | null): number {
  const raw = price?.metadata?.eppp_months;
  const m = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(m) && m > 0 ? m : 0;
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date.getTime());
  d.setMonth(d.getMonth() + months);
  return d;
}

// Stripe moved current_period_end onto subscription items in newer API
// versions while older ones keep it at the top level. Read whichever exists.
function getSubscriptionPeriodEnd(sub: Stripe.Subscription): Date | null {
  const s = sub as unknown as {
    current_period_end?: number;
    items?: { data?: Array<{ current_period_end?: number }> };
  };
  const ts = s.current_period_end ?? s.items?.data?.[0]?.current_period_end ?? null;
  return typeof ts === "number" ? new Date(ts * 1000) : null;
}

// Returns the PsychPro tier string for an approved Master/Scholar subscription,
// or null if the underlying Stripe product is not an approved Master/Scholar
// plan (this includes the EPPP product, which is handled separately). Callers
// must treat null as "free" — this prevents arbitrary Stripe subscriptions from
// the same account from granting paid entitlements.
async function getSubscriptionTier(stripe: Stripe, sub: Stripe.Subscription): Promise<string | null> {
  try {
    const priceId = sub.items.data[0]?.price?.id;
    if (!priceId) return null;
    const price = await stripe.prices.retrieve(priceId, { expand: ["product"] });
    const product = price.product as Stripe.Product;
    return subscriptionStatusFromTierMetadata(product?.metadata?.neuronotes_tier);
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
      if (!user) break;

      const stripe = await getUncachableStripeClient();
      const active = sub.status === "active" || sub.status === "trialing";

      // Resolve the product so we can route EPPP subscriptions away from the
      // Master/Scholar status column.
      let product: Stripe.Product | undefined;
      const priceId = sub.items.data[0]?.price?.id;
      if (priceId) {
        try {
          const price = await stripe.prices.retrieve(priceId, { expand: ["product"] });
          product = price.product as Stripe.Product;
        } catch {
          product = undefined;
        }
      }

      if (isEpppProduct(product)) {
        // EPPP $99/mo subscription — drives EPPP access only, never the
        // Master/Scholar subscriptionStatus.
        if (active) {
          await db.update(usersTable).set({
            epppSubscriptionId: sub.id,
            epppAccessUntil: getSubscriptionPeriodEnd(sub) ?? user.epppAccessUntil,
          }).where(eq(usersTable.id, user.id));
        } else {
          // Past-due / canceled / unpaid: drop the sub id but leave
          // epppAccessUntil to lapse naturally at the paid-through date.
          await db.update(usersTable).set({
            epppSubscriptionId: null,
          }).where(eq(usersTable.id, user.id));
        }
        log.info({ userId: user.id, status: sub.status, eppp: true }, "Updated EPPP subscription");
      } else {
        // Master/Scholar path (unchanged).
        const newStatus = active ? ((await getSubscriptionTier(stripe, sub)) ?? "free") : "free";
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
      if (!user) break;

      if (user.epppSubscriptionId && user.epppSubscriptionId === sub.id) {
        // EPPP subscription canceled — clear the sub id but leave
        // epppAccessUntil so access lasts through the already-paid period.
        await db.update(usersTable).set({
          epppSubscriptionId: null,
        }).where(eq(usersTable.id, user.id));
        log.info({ userId: user.id, eppp: true }, "Cancelled EPPP subscription");
      } else {
        // Master/Scholar path (unchanged).
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
      if (!session.customer) break;
      const customerId = typeof session.customer === "string" ? session.customer : session.customer.id;
      const [user] = await db.select().from(usersTable).where(eq(usersTable.stripeCustomerId, customerId));
      if (!user) break;

      const stripe = await getUncachableStripeClient();

      if (session.mode === "payment") {
        // One-time EPPP purchase ($499 → 6 months, $799 → 12 months). Resolve
        // the granted months from the line item's price metadata.
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          expand: ["data.price.product"],
          limit: 10,
        });
        let months = 0;
        for (const li of lineItems.data) {
          const price = li.price as Stripe.Price | null;
          const product = price?.product as Stripe.Product | undefined;
          if (price && !price.recurring && isEpppProduct(product)) {
            months = Math.max(months, epppMonthsFromPrice(price));
          }
        }
        if (months > 0) {
          // Stack on top of any remaining access rather than truncating it.
          const now = new Date();
          const base = user.epppAccessUntil && user.epppAccessUntil > now ? user.epppAccessUntil : now;
          const until = addMonths(base, months);
          await db.update(usersTable).set({ epppAccessUntil: until }).where(eq(usersTable.id, user.id));
          log.info({ userId: user.id, months, until }, "Granted one-time EPPP access");
        }
      } else if (session.mode === "subscription" && session.subscription) {
        const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
        const sub = await stripe.subscriptions.retrieve(subscriptionId, { expand: ["items.data.price.product"] });
        const product = sub.items.data[0]?.price?.product as Stripe.Product | undefined;
        if (isEpppProduct(product)) {
          const active = sub.status === "active" || sub.status === "trialing";
          await db.update(usersTable).set({
            epppSubscriptionId: subscriptionId,
            epppAccessUntil: active ? (getSubscriptionPeriodEnd(sub) ?? user.epppAccessUntil) : user.epppAccessUntil,
          }).where(eq(usersTable.id, user.id));
          log.info({ userId: user.id, eppp: true }, "Activated EPPP subscription at checkout");
        } else {
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
