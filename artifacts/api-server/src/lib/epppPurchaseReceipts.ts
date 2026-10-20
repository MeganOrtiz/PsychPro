import { db, usersTable, stripePurchaseReceiptsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

interface EpppPurchase {
  userId: string;
  checkoutSessionId: string;
  stripeEventId: string;
  months: number;
}

export async function grantEpppPurchaseOnce(
  purchase: EpppPurchase,
  database: Pick<typeof db, "transaction"> = db,
) {
  if (!Number.isInteger(purchase.months) || purchase.months <= 0) {
    throw new Error("Invalid EPPP purchase duration");
  }

  return database.transaction(async (tx) => {
    // Serialize distinct purchases too, so neither overwrites the other's
    // extension using an expiry read before the other purchase committed.
    const [user] = await tx.select({ until: usersTable.epppAccessUntil })
      .from(usersTable).where(eq(usersTable.id, purchase.userId)).for("update");
    if (!user) throw new Error("EPPP purchase account not found");

    const [receipt] = await tx.insert(stripePurchaseReceiptsTable).values(purchase)
      .onConflictDoNothing({ target: stripePurchaseReceiptsTable.checkoutSessionId })
      .returning({ sessionId: stripePurchaseReceiptsTable.checkoutSessionId });
    if (!receipt) return { granted: false as const };

    const now = new Date();
    const base = user.until && user.until > now ? user.until : now;
    const until = new Date(base.getTime());
    until.setMonth(until.getMonth() + purchase.months);
    await tx.update(usersTable).set({ epppAccessUntil: until })
      .where(eq(usersTable.id, purchase.userId));
    // Any failure rolls back BOTH the receipt and the access change, allowing
    // Stripe's next delivery to retry the purchase safely.
    return { granted: true as const, until };
  });
}
