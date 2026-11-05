import assert from "node:assert/strict";
import express, { type Request } from "express";
import { pool } from "@workspace/db";
import { createPinnedTestCleanupRouter } from "../src/routes/pinned-test-cleanup";
import { PinnedCleanupSafetyError } from "../src/lib/targetedTestCleanupPolicy";

const preview = {
  environment: "development" as const,
  eligibleCount: 1, blockedCount: 0, alreadyAbsentCount: 0,
  items: [{
    email: "cleanup-fixture@example.invalid",
    profilePresent: true, signInPresent: false,
    status: "eligible" as const, reason: null,
  }],
  fingerprint: "a".repeat(64),
  protectedAccountPreserved: true as const,
};
let authorization: "anonymous" | "nonowner" | "owner" = "anonymous";
let execution: "success" | "stale" | "failure" = "success";
let executionCalls = 0;
const app = express();
app.use(express.json());
app.use((req, _res, next) => {
  req.log = { info() {}, error() {} } as unknown as Request["log"];
  next();
});
app.use("/api", createPinnedTestCleanupRouter({
  authorize: async (_req, res) => {
    if (authorization !== "owner") {
      res.status(authorization === "anonymous" ? 401 : 403).json({ error: "Forbidden" });
      return null;
    }
    return "fixture-owner";
  },
  preview: async () => preview,
  execute: async () => {
    executionCalls += 1;
    if (execution === "stale") throw new PinnedCleanupSafetyError("The preview changed.", 409);
    if (execution === "failure") throw new Error("private identity details must not escape");
    return {
      deletedCount: 1, identityOnlyCount: 0, blockedCount: 0, failedCount: 0,
      protectedAccountPreserved: true as const,
      items: [{
        email: "cleanup-fixture@example.invalid",
        identity: "already_absent" as const, appData: "deleted" as const, reason: null,
      }],
    };
  },
}));
const server = app.listen(0, "127.0.0.1");
await new Promise<void>((resolve) => server.once("listening", resolve));
const address = server.address();
assert.ok(address && typeof address !== "string");
const base = `http://127.0.0.1:${address.port}/api/users/targeted-test-cleanup`;
const post = (body: unknown) => fetch(base, {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
});
try {
  assert.equal((await fetch(`${base}/preview`)).status, 401);
  authorization = "nonowner";
  assert.equal((await post({})).status, 403);
  authorization = "owner";
  const response = await fetch(`${base}/preview`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), preview);
  assert.equal((await post({ confirmation: "wrong" })).status, 400);
  assert.equal(executionCalls, 0);
  const confirmation = { confirmation: "DELETE PINNED TEST ACCOUNTS", fingerprint: preview.fingerprint };
  assert.equal((await post(confirmation)).status, 200);
  execution = "stale";
  assert.equal((await post(confirmation)).status, 409);
  execution = "failure";
  const failed = await post(confirmation);
  assert.equal(failed.status, 503);
  assert.equal((await failed.text()).includes("private identity details"), false);
  console.log("✓ Cleanup routes reject unauthorized/malformed/stale requests and sanitize failures");
} finally {
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  await pool.end();
}
