import { test } from "node:test";
import assert from "node:assert/strict";
import { retryQuery } from "./query-reliability.ts";
import { retryImport, isChunkLoadError } from "./lazy-retry.ts";

test("auth, access, validation and not-found errors are not retried", () => {
  for (const status of [400, 401, 402, 403, 404, 409, 422]) {
    assert.equal(retryQuery(0, { status }), false);
  }
});
test("transient reads get at most two retries", () => {
  for (const error of [{ status: 500 }, { status: 503 }, { status: 408 }, { status: 429 }, new TypeError("Failed to fetch"), { name: "TimeoutError" }]) {
    assert.equal(retryQuery(0, error), true);
    assert.equal(retryQuery(1, error), true);
    assert.equal(retryQuery(2, error), false);
  }
});
test("intentional cancellation never retries", () => {
  assert.equal(retryQuery(0, { name: "AbortError" }), false);
});
test("a transient route chunk failure gets one retry", async () => {
  let calls = 0;
  const result = await retryImport(async () => {
    if (++calls === 1) throw new Error("Failed to fetch dynamically imported module: /assets/page.js");
    return "loaded";
  }, async () => {});
  assert.equal(result, "loaded");
  assert.equal(calls, 2);
});
test("persistent chunk failures surface rather than looping or reloading", async () => {
  let calls = 0;
  await assert.rejects(retryImport(async () => {
    calls++;
    throw new Error("Loading chunk 4 failed");
  }, async () => {}));
  assert.equal(calls, 2);
});
test("application errors aren't disguised as chunk errors", async () => {
  const error = new Error("Cannot read properties of undefined");
  let calls = 0;
  await assert.rejects(retryImport(async () => { calls++; throw error; }), error);
  assert.equal(calls, 1);
  assert.equal(isChunkLoadError(error), false);
});
