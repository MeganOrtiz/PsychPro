import assert from "node:assert/strict";
import { removeVerifiedPinnedTarget } from "../src/lib/targetedTestCleanupExecution";

const present = { signInPresent: true, profilePresent: true };
const order: string[] = [];
assert.deepEqual(await removeVerifiedPinnedTarget(present, {
  deleteIdentity: async () => { order.push("identity"); },
  deleteAppData: async () => { order.push("data"); return true; },
  profileExists: async () => { throw new Error("unexpected verification"); },
}), { identity: "deleted", appData: "deleted" });
assert.deepEqual(order, ["identity", "data"]);

let appDeletionCalled = false;
assert.deepEqual(await removeVerifiedPinnedTarget(present, {
  deleteIdentity: async () => { throw new Error("identity provider unavailable"); },
  deleteAppData: async () => { appDeletionCalled = true; return true; },
  profileExists: async () => true,
}), { identity: "failed", appData: "retained" });
assert.equal(appDeletionCalled, false);

assert.deepEqual(await removeVerifiedPinnedTarget(present, {
  deleteIdentity: async () => {},
  deleteAppData: async () => { throw new Error("rolled back"); },
  profileExists: async () => true,
}), { identity: "deleted", appData: "failed" });

assert.deepEqual(await removeVerifiedPinnedTarget(
  { signInPresent: false, profilePresent: true },
  {
    deleteIdentity: async () => { throw new Error("must not delete an absent identity"); },
    deleteAppData: async () => true,
    profileExists: async () => true,
  },
), { identity: "already_absent", appData: "deleted" });

assert.deepEqual(await removeVerifiedPinnedTarget(
  { signInPresent: true, profilePresent: false },
  {
    deleteIdentity: async () => {},
    deleteAppData: async () => false,
    profileExists: async () => false,
  },
), { identity: "deleted", appData: "already_absent" });

assert.deepEqual(await removeVerifiedPinnedTarget(
  { signInPresent: false, profilePresent: false },
  {
    deleteIdentity: async () => { throw new Error("must not run"); },
    deleteAppData: async () => false,
    profileExists: async () => false,
  },
), { identity: "already_absent", appData: "already_absent" });
console.log("✓ Cleanup ordering, identity failure, partial completion, absent stores, and retry safety");
