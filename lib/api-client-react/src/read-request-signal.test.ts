import { test } from "node:test";
import assert from "node:assert/strict";
import { readRequestSignal } from "./read-request-signal.ts";

test("a stalled read has a finite timeout", async () => {
  const read = readRequestSignal(undefined, 5);
  try {
    await new Promise<void>((resolve) => read.signal.addEventListener("abort", () => resolve(), { once: true }));
    assert.equal(read.signal.aborted, true);
    assert.equal(read.signal.reason.name, "TimeoutError");
  } finally {
    read.cleanup();
  }
});
test("caller cancellation propagates with its reason", () => {
  const caller = new AbortController();
  const read = readRequestSignal(caller.signal);
  try {
    caller.abort(new DOMException("Canceled", "AbortError"));
    assert.equal(read.signal.aborted, true);
    assert.equal(read.signal.reason.name, "AbortError");
  } finally {
    read.cleanup();
  }
});
test("an already-aborted request stays canceled", () => {
  const caller = new AbortController();
  caller.abort();
  const read = readRequestSignal(caller.signal);
  assert.equal(read.signal.aborted, true);
  read.cleanup();
});
test("successful reads remove the timer and listener", async () => {
  const caller = new AbortController();
  const read = readRequestSignal(caller.signal, 5);
  read.cleanup();
  caller.abort();
  await new Promise((resolve) => setTimeout(resolve, 10));
  assert.equal(read.signal.aborted, false);
});
