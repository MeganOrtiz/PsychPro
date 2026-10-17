import assert from "node:assert/strict";
import {
  OLD_TEST_ACCOUNT_IDS, cleanupBlockReason, cleanupFingerprint,
  assertCleanupConfirmation, CLEANUP_CONFIRMATION, isProtectedCleanupEmail,
  type CleanupAccount,
} from "../src/lib/oldTestCleanupPolicy";

const account: CleanupAccount = {
  id: OLD_TEST_ACCOUNT_IDS[0], email: "old-test@example.invalid",
  stripeSubscriptionId: null, epppSubscriptionId: null,
};
const owner = "protected-owner";
assert.equal(OLD_TEST_ACCOUNT_IDS.length, 28);
assert.equal(new Set(OLD_TEST_ACCOUNT_IDS).size, 28);
assert.equal(cleanupBlockReason(account, owner, false, false), null);
assert.ok(cleanupBlockReason({ ...account, id: "new-user-created-after-reset" }, owner, false, false));
assert.ok(cleanupBlockReason(account, account.id, false, false));
assert.ok(cleanupBlockReason({ ...account, email: " ADMIN@PSYCHPROSUITE.COM " }, owner, false, false));
assert.equal(isProtectedCleanupEmail(null), false);
assert.ok(cleanupBlockReason({ ...account, stripeSubscriptionId: "sub_test" }, owner, false, false));
assert.ok(cleanupBlockReason({ ...account, epppSubscriptionId: "sub_test" }, owner, false, false));
assert.ok(cleanupBlockReason(account, owner, true, false));
assert.ok(cleanupBlockReason(account, owner, false, true));
const other = { ...account, id: OLD_TEST_ACCOUNT_IDS[1] };
const fingerprint = cleanupFingerprint([account, other], owner);
assert.equal(fingerprint, cleanupFingerprint([other, account], owner));
assert.notEqual(fingerprint, cleanupFingerprint([account], owner));
assert.notEqual(fingerprint, cleanupFingerprint([account, other], "different-caller"));
assert.notEqual(fingerprint, cleanupFingerprint([{ ...account, email: "changed@example.invalid" }, other], owner));
assert.doesNotThrow(() => assertCleanupConfirmation(CLEANUP_CONFIRMATION, fingerprint, fingerprint));
assert.throws(() => assertCleanupConfirmation("DELETE", fingerprint, fingerprint), /Type DELETE OLD TEST DATA/);
assert.throws(() => assertCleanupConfirmation(CLEANUP_CONFIRMATION, fingerprint, "stale"), /preview changed/);
console.log("✓ Historical cleanup: fixed inventory, admin/new-account protection, billing/upload/identity guards, preview binding and confirmation");
