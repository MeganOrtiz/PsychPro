import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import type { Logger } from "pino";

export async function handleStripeWebhookEvent(event: any, log: Logger) {
  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object;
      const customerId = sub.customer;
      const [user] = await db.select().from(usersTable).where(eq(usersTable.stripeCustomerId, customerId));
      if (user) {
        await db.update(usersTable).set({
          stripeSubscriptionId: sub.id,
          subscriptionStatus: sub.status === "active" ? "active" : "free",
        }).where(eq(usersTable.id, user.id));
        log.info({ userId: user.id, status: sub.status }, "Updated user subscription");
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const customerId = sub.customer;
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
      const session = event.data.object;
      if (session.mode === "subscription" && session.customer) {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.stripeCustomerId, String(session.customer)));
        if (user && session.subscription) {
          await db.update(usersTable).set({
            stripeSubscriptionId: String(session.subscription),
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
