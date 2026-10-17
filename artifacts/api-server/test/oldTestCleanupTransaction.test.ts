import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { db, pool, usersTable, courseMasteryAttemptsTable, topicsTable } from "@workspace/db";
import { eq, inArray, sql } from "drizzle-orm";
import {
  buildOldTestCleanupPreview, cleanupOldTestAccountsInTransaction,
} from "../src/lib/oldTestCleanup";
import { CLEANUP_CONFIRMATION, OLD_TEST_ACCOUNT_IDS } from "../src/lib/oldTestCleanupPolicy";

// Real FK/rollback verification in development only. Fixtures and deletion
// occur entirely inside a transaction that is deliberately rolled back.
if (process.env.NODE_ENV === "production") throw new Error("Never run cleanup fixtures in production");
const rolledBack = new Error("Intentional fixture rollback");
const ownerId = `cleanup-check-owner-${randomUUID()}`;
const newId = `cleanup-check-new-${randomUUID()}`;
const targets = [...OLD_TEST_ACCOUNT_IDS.slice(0, 2)];
try {
  try {
    await db.transaction(async tx => {
      const existing = await tx.select({ id: usersTable.id }).from(usersTable)
        .where(inArray(usersTable.id, [...OLD_TEST_ACCOUNT_IDS]));
      assert.equal(existing.length, 0, "Only run rollback fixtures after development cleanup is empty");
      await tx.insert(usersTable).values([
        { id: ownerId, email: "admin@psychprosuite.com", isAdmin: true },
        { id: newId, email: "fresh-cleanup-test@example.invalid", isAdmin: false },
        ...targets.map((id, i) => ({ id, email: `old-cleanup-${i}@example.invalid`, isAdmin: false })),
      ]);
      await tx.insert(courseMasteryAttemptsTable).values({
        userId: targets[0], category: "cleanup-rollback-fixture", score: 90,
        correct: 9, total: 10, passed: true,
      });
      const [beforeContent] = await tx.select({ count: sql<number>`count(*)::int` }).from(topicsTable);
      const preview = await buildOldTestCleanupPreview(tx, ownerId);
      assert.equal(preview.public.eligibleCount, 2);
      assert.equal(preview.public.protectedAccountPreserved, true);
      await assert.rejects(
        cleanupOldTestAccountsInTransaction(tx, ownerId, "DELETE", preview.public.fingerprint),
        /Type DELETE OLD TEST DATA/,
      );
      await assert.rejects(buildOldTestCleanupPreview(tx, newId), /protected owner/);
      await tx.update(usersTable).set({ epppSubscriptionId: "sub_blocked_fixture" }).where(eq(usersTable.id, targets[0]));
      await assert.rejects(
        cleanupOldTestAccountsInTransaction(tx, ownerId, CLEANUP_CONFIRMATION, preview.public.fingerprint),
        /preview changed/,
      );
      assert.equal((await tx.select().from(usersTable).where(inArray(usersTable.id, targets))).length, 2);
      await tx.update(usersTable).set({ epppSubscriptionId: null }).where(eq(usersTable.id, targets[0]));
      const fresh = await buildOldTestCleanupPreview(tx, ownerId);
      const result = await cleanupOldTestAccountsInTransaction(tx, ownerId, CLEANUP_CONFIRMATION, fresh.public.fingerprint);
      assert.deepEqual(result, { deletedCount: 2, remainingCount: 0, blockedCount: 0, protectedAccountPreserved: true });
      assert.equal((await tx.select().from(usersTable).where(inArray(usersTable.id, targets))).length, 0);
      assert.equal((await tx.select().from(courseMasteryAttemptsTable).where(eq(courseMasteryAttemptsTable.userId, targets[0]))).length, 0);
      assert.equal((await tx.select().from(usersTable).where(inArray(usersTable.id, [ownerId, newId]))).length, 2);
      const [afterContent] = await tx.select({ count: sql<number>`count(*)::int` }).from(topicsTable);
      assert.equal(afterContent.count, beforeContent.count);
      const empty = await buildOldTestCleanupPreview(tx, ownerId);
      const repeated = await cleanupOldTestAccountsInTransaction(tx, ownerId, CLEANUP_CONFIRMATION, empty.public.fingerprint);
      assert.equal(repeated.deletedCount, 0, "Repeat execution is harmless");
      throw rolledBack;
    });
  } catch (error) {
    if (error !== rolledBack) throw error;
  }
  assert.equal((await db.select().from(usersTable).where(inArray(usersTable.id, [...targets, ownerId, newId]))).length, 0);
  console.log("✓ Cleanup transaction: stale/invalid/unauthorized requests rejected; old data deleted FK-safely; owner, new account and content preserved; retries harmless; all fixtures rolled back");
} finally {
  await pool.end();
}
