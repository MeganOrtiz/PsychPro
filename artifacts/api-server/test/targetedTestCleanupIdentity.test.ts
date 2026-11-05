import assert from "node:assert/strict";
import { pool } from "@workspace/db";
import {
  clerkIdentity, deleteClerkIdentity, privatePreviewItem, publicPreviewItem,
} from "../src/lib/targetedTestCleanup";
import {
  PinnedCleanupSafetyError, type PinnedCleanupObservedState,
} from "../src/lib/targetedTestCleanupPolicy";

const target = { id: "synthetic-pinned-id", email: "target@example.invalid" };
const key = "sk_test_synthetic_fixture";
const verified = {
  primary_email_address_id: "primary",
  email_addresses: [{
    id: "primary", email_address: target.email, verification: { status: "verified" },
  }],
};
function respond(body: unknown, status = 200): typeof fetch {
  return (async () => new Response(JSON.stringify(body), { status })) as typeof fetch;
}
try {
  assert.deepEqual(await clerkIdentity(target.id, respond({}, 404), key), {
    present: false, email: null, hasProtectedEmail: false,
  });
  await assert.rejects(() => clerkIdentity(target.id, respond({}, 500), key), PinnedCleanupSafetyError);
  await assert.rejects(() => clerkIdentity(target.id, respond({}), key), PinnedCleanupSafetyError);
  await assert.rejects(() => clerkIdentity(target.id, respond({
    ...verified,
    email_addresses: [{ ...verified.email_addresses[0], verification: { status: "unverified" } }],
  }), key), PinnedCleanupSafetyError);
  assert.deepEqual(await clerkIdentity(target.id, respond(verified), key), {
    present: true, email: target.email, hasProtectedEmail: false,
  });
  assert.equal((await clerkIdentity(target.id, respond({
    ...verified,
    email_addresses: [...verified.email_addresses, {
      id: "secondary", email_address: "admin@psychprosuite.com", verification: { status: "verified" },
    }],
  }), key)).hasProtectedEmail, true);

  const methods: string[] = [];
  const deleteThenAbsent = (async (_input, init) => {
    const method = init?.method ?? "GET";
    methods.push(method);
    return new Response("{}", { status: method === "DELETE" ? 200 : 404 });
  }) as typeof fetch;
  await deleteClerkIdentity(target, deleteThenAbsent, key);
  assert.deepEqual(methods, ["DELETE", "GET"]);
  await assert.rejects(() => deleteClerkIdentity(target, respond({}, 503), key), PinnedCleanupSafetyError);
  await assert.rejects(() => deleteClerkIdentity(target, respond(verified), key), PinnedCleanupSafetyError);

  const state: PinnedCleanupObservedState = {
    profilePresent: false, profileEmail: null, isAdmin: false, subscriptionStatus: null,
    stripeCustomerId: null, stripeSubscriptionId: null, epppSubscriptionId: null,
    epppAccessUntil: null, hasPaidReceipt: false, hasUploadedSource: false,
    signInPresent: true, signInEmail: target.email, signInHasProtectedEmail: false,
  };
  const item = publicPreviewItem(privatePreviewItem(target, state, "synthetic-owner"));
  assert.equal(item.status, "eligible");
  assert.equal(item.email, target.email);
  assert.equal(JSON.stringify(item).includes(target.id), false);
  assert.equal(privatePreviewItem(target, { ...state, signInPresent: false }, "synthetic-owner").status, "already_absent");
  assert.equal(privatePreviewItem(target, { ...state, signInHasProtectedEmail: true }, "synthetic-owner").status, "blocked");
  console.log("✓ Identity verification fails closed, confirms deletion, protects admin-linked identities, and hides IDs");
} finally {
  await pool.end();
}
