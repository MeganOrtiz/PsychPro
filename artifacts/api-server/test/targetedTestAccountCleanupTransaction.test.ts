import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { db, pool, usersTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";
import { deleteAccountRows } from "../src/lib/targetedTestCleanup";
import { PinnedCleanupSafetyError } from "../src/lib/targetedTestCleanupPolicy";

// Never runs by default or in Production. Every fixture lives inside an
// intentionally rolled-back transaction; no Clerk APIs are called.
if (process.env.RUN_PINNED_CLEANUP_DB_TEST !== "1") {
  console.log("↷ Cleanup rollback test requires RUN_PINNED_CLEANUP_DB_TEST=1 in Development");
} else {
  assert.notEqual(process.env.NODE_ENV, "production");
  const suffix = randomUUID();
  const ownerId = `cleanup-owner-${suffix}`;
  const target = { id: `cleanup-target-${suffix}`, email: `cleanup-${suffix}@example.invalid` };
  class RollbackFixture extends Error {}
  try {
    try {
      await db.transaction(async (tx) => {
        await tx.insert(usersTable).values([
          { id: ownerId, email: "admin@psychprosuite.com", isAdmin: true },
          { id: target.id, email: target.email, isAdmin: false, subscriptionStatus: "free" },
        ]);
        assert.equal(await deleteAccountRows(tx, ownerId, target), true);
        assert.equal((await tx.select({ id: usersTable.id }).from(usersTable)
          .where(eq(usersTable.id, target.id))).length, 0);
        assert.equal((await tx.select({ id: usersTable.id }).from(usersTable)
          .where(eq(usersTable.id, ownerId))).length, 1);
        // Repetition is harmless once the profile is absent.
        assert.equal(await deleteAccountRows(tx, ownerId, target), false);
        // A fresh signup using the same email but a different ID is not selected.
        await tx.insert(usersTable).values({
          id: `${target.id}-new`, email: target.email, isAdmin: false, subscriptionStatus: "free",
        });
        assert.equal(await deleteAccountRows(tx, ownerId, target), false);
        assert.equal((await tx.select({ id: usersTable.id }).from(usersTable)
          .where(eq(usersTable.id, `${target.id}-new`))).length, 1);
        // Billing blocks deletion inside the transaction as well as at preview.
        await tx.insert(usersTable).values({
          id: target.id, email: target.email, isAdmin: false,
          subscriptionStatus: "free", stripeCustomerId: "cus_synthetic_cleanup_fixture",
        });
        await assert.rejects(() => deleteAccountRows(tx, ownerId, target), PinnedCleanupSafetyError);
        assert.equal((await tx.select({ id: usersTable.id }).from(usersTable)
          .where(eq(usersTable.id, target.id))).length, 1);
        throw new RollbackFixture();
      });
    } catch (error) {
      if (!(error instanceof RollbackFixture)) throw error;
    }
    assert.equal((await db.select({ id: usersTable.id }).from(usersTable)
      .where(inArray(usersTable.id, [ownerId, target.id, `${target.id}-new`]))).length, 0);
    console.log("✓ Development-only rollback: owner/new signup retained, billing blocked, no fixture persisted");
  } finally {
    await pool.end();
  }
}
