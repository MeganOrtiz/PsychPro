import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import type { Logger } from "pino";
import type Stripe from "stripe";

export async function handleStripeWebhookEvent(event: Stripe.Event, log: Logger) {
  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
      const [user] = await db.select().from(usersTable).where(eq(usersTable.stripeCustomerId, customerId));
      if (user) {
        await db.update(usersTable).set({
          stripeSubscriptionId: sub.id,
          subscriptionStatus: (sub.status === "active" || sub.status === "trialing") ? "active" : "free",
        }).where(eq(usersTable.id, user.id));
        log.info({ userId: user.id, status: sub.status }, "Updated user subscription");
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
          await db.update(usersTable).set({
            stripeSubscriptionId: subscriptionId,
            subscriptionStatus: "active",
          }).where(eq(usersTable.id, user.id));
        }
      }
      break;
    }
    default:
      log.info({ type: event.type }, "Unhandled Stripe event type");
  }
}
