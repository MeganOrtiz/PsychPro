import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { db, pool, usersTable, stripePurchaseReceiptsTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";
import { grantEpppPurchaseOnce } from "../src/lib/epppPurchaseReceipts";

if (process.env.NODE_ENV === "production" || process.env.REPLIT_DEPLOYMENT === "1") {
  throw new Error("Purchase receipt integration tests must not run in a deployment");
}
const run = randomUUID();
const ids = ["six", "twelve", "stack", "rollback"].map(name => `receipt_test_${run}_${name}`);
const purchase = (index: number, months: number, suffix = "") => ({
  userId: ids[index], months,
  checkoutSessionId: `cs_test_${run}_${index}${suffix}`,
  stripeEventId: `evt_test_${run}_${index}${suffix}`,
});
async function expiry(index: number) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, ids[index]));
  return user;
}
function plusMonths(base: Date, months: number) {
  const date = new Date(base); date.setMonth(date.getMonth() + months); return date;
}

try {
  await db.insert(usersTable).values(ids.map(id => ({
    id, subscriptionStatus: "free", isAdmin: false,
  })));
  const six = await grantEpppPurchaseOnce(purchase(0, 6));
  assert.ok(six.granted);
  assert.equal((await grantEpppPurchaseOnce({
    ...purchase(0, 6), stripeEventId: `evt_other_delivery_${run}`,
  })).granted, false);
  assert.equal((await expiry(0)).epppAccessUntil?.getTime(), six.until.getTime());

  const twelve = await Promise.all(Array.from({ length: 8 }, () =>
    grantEpppPurchaseOnce(purchase(1, 12))));
  assert.equal(twelve.filter(r => r.granted).length, 1);
  const twelveDate = (await expiry(1)).epppAccessUntil!;
  assert.ok(Math.abs(twelveDate.getTime() - plusMonths(new Date(), 12).getTime()) < 30_000);

  const existing = new Date("2030-01-15T12:00:00.000Z");
  await db.update(usersTable).set({ epppAccessUntil: existing }).where(eq(usersTable.id, ids[2]));
  await Promise.all([
    grantEpppPurchaseOnce(purchase(2, 6, "_a")),
    grantEpppPurchaseOnce(purchase(2, 12, "_b")),
  ]);
  assert.equal((await expiry(2)).epppAccessUntil?.getTime(), plusMonths(existing, 18).getTime());

  // A failed outer transaction rolls back both the receipt and its access.
  await assert.rejects(db.transaction(async tx => {
    await grantEpppPurchaseOnce(purchase(3, 6), tx);
    throw new Error("Simulated transaction failure");
  }), /Simulated transaction failure/);
  assert.equal((await expiry(3)).epppAccessUntil, null);
  const receipts = await db.select().from(stripePurchaseReceiptsTable)
    .where(eq(stripePurchaseReceiptsTable.checkoutSessionId, purchase(3, 6).checkoutSessionId));
  assert.equal(receipts.length, 0);
  assert.equal((await grantEpppPurchaseOnce(purchase(3, 6))).granted, true);

  for (let index = 0; index < ids.length; index++) {
    const user = await expiry(index);
    assert.equal(user.subscriptionStatus, "free", "EPPP must not unlock PsychPro");
    assert.equal(user.stripeSubscriptionId, null);
    assert.equal(user.psychproTrialStartedAt, null);
  }
  console.log("EPPP receipts: sequential/concurrent replay, distinct stacking, rollback/retry, suite isolation passed");
} finally {
  await db.delete(usersTable).where(inArray(usersTable.id, ids));
  await pool.end();
}
