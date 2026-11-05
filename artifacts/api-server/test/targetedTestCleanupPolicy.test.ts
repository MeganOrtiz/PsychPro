import assert from "node:assert/strict";
import {
  assertPinnedCleanupConfirmation,
  PINNED_TEST_ACCOUNT_INVENTORY,
  pinnedCleanupBlockReason,
  pinnedCleanupFingerprint,
  PINNED_TEST_CLEANUP_CONFIRMATION,
  type PinnedCleanupObservedState,
  type PinnedTestAccount,
} from "../src/lib/targetedTestCleanupPolicy";

const target: PinnedTestAccount = PINNED_TEST_ACCOUNT_INVENTORY.production[0];
const ownerId = "owner-user";
const cleanState: PinnedCleanupObservedState = {
  profilePresent: true,
  profileEmail: target.email,
  isAdmin: false,
  subscriptionStatus: "free",
  stripeCustomerId: null,
  stripeSubscriptionId: null,
  epppSubscriptionId: null,
  epppAccessUntil: null,
  hasPaidReceipt: false,
  hasUploadedSource: false,
  signInPresent: true,
  signInEmail: target.email,
  signInHasProtectedEmail: false,
};

assert.equal(PINNED_TEST_ACCOUNT_INVENTORY.development.length, 0);
assert.equal(PINNED_TEST_ACCOUNT_INVENTORY.production.length, 3);
assert.equal(new Set(PINNED_TEST_ACCOUNT_INVENTORY.production.map((item) => item.id)).size, 3);
assert.equal(
  PINNED_TEST_ACCOUNT_INVENTORY.production.some((item) => item.email === "admin@psychprosuite.com"),
  false,
);
assert.equal(pinnedCleanupBlockReason(target, cleanState, ownerId), null);
assert.equal(
  pinnedCleanupBlockReason(target, { ...cleanState, stripeCustomerId: "cus_test" }, ownerId),
  "billing_reference",
);
assert.equal(
  pinnedCleanupBlockReason(target, { ...cleanState, stripeSubscriptionId: "sub_test" }, ownerId),
  "billing_reference",
);
assert.equal(
  pinnedCleanupBlockReason(target, { ...cleanState, epppAccessUntil: new Date() }, ownerId),
  "billing_reference",
);
assert.equal(
  pinnedCleanupBlockReason(target, { ...cleanState, hasPaidReceipt: true }, ownerId),
  "billing_reference",
);
assert.equal(
  pinnedCleanupBlockReason(target, { ...cleanState, hasUploadedSource: true }, ownerId),
  "uploaded_source",
);
assert.equal(
  pinnedCleanupBlockReason(target, { ...cleanState, isAdmin: true }, ownerId),
  "protected",
);
assert.equal(
  pinnedCleanupBlockReason(target, { ...cleanState, signInHasProtectedEmail: true }, ownerId),
  "protected",
);
assert.equal(
  pinnedCleanupBlockReason(target, { ...cleanState, signInEmail: "other@example.test" }, ownerId),
  "identity_mismatch",
);
assert.equal(
  pinnedCleanupBlockReason(target, { ...cleanState, profileEmail: "other@example.test" }, ownerId),
  "identity_mismatch",
);

const secondTarget = PINNED_TEST_ACCOUNT_INVENTORY.production[1];
const first = { target, state: cleanState, reason: null };
const second = { target: secondTarget, state: { ...cleanState, profileEmail: secondTarget.email, signInEmail: secondTarget.email }, reason: null };
const fingerprint = pinnedCleanupFingerprint("production", ownerId, [first, second]);
assert.equal(fingerprint, pinnedCleanupFingerprint("production", ownerId, [second, first]));
assert.notEqual(fingerprint, pinnedCleanupFingerprint("development", ownerId, [first, second]));
assert.notEqual(
  fingerprint,
  pinnedCleanupFingerprint("production", ownerId, [
    { ...first, state: { ...cleanState, stripeCustomerId: "cus_test" } },
    second,
  ]),
);
assert.doesNotThrow(() =>
  assertPinnedCleanupConfirmation(PINNED_TEST_CLEANUP_CONFIRMATION, fingerprint, fingerprint),
);
assert.throws(
  () => assertPinnedCleanupConfirmation("DELETE", fingerprint, fingerprint),
  /Type DELETE PINNED TEST ACCOUNTS/,
);
assert.throws(
  () => assertPinnedCleanupConfirmation(PINNED_TEST_CLEANUP_CONFIRMATION, fingerprint, "stale"),
  /preview changed/,
);

console.log("✓ Pinned cleanup: static inventory, owner/billing/upload/identity guards, preview binding, and exact confirmation");
