import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import type { Request, RequestHandler } from "express";
import {
  apiRateLimitHitsTable,
  db,
  pool,
} from "@workspace/db";
import {
  API_ACTION_RATE_LIMIT_RULES,
  checkApiActionRateLimit,
  createApiActionRateLimitMiddleware,
  pruneExpiredApiActionRateLimitHits,
  type ApiActionRateLimitRule,
} from "../src/middlewares/apiActionRateLimit";
import type { Logger } from "pino";

class AssertionError extends Error {}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new AssertionError(message);
}

interface TestCase {
  name: string;
  fn: () => Promise<void>;
}

const tests: TestCase[] = [];
function test(name: string, fn: () => Promise<void>): void {
  tests.push({ name, fn });
}

async function cleanupAction(action: string): Promise<void> {
  await db
    .delete(apiRateLimitHitsTable)
    .where(eq(apiRateLimitHitsTable.action, action));
}

test("configured limits preserve the generous shared-network ceilings", async () => {
  assert(
    API_ACTION_RATE_LIMIT_RULES.customDeckGeneration.accountLimit === 10 &&
      API_ACTION_RATE_LIMIT_RULES.customDeckGeneration.ipLimit === 300,
    "AI generation caps should be 10 per account and 300 per IP",
  );
  assert(
    API_ACTION_RATE_LIMIT_RULES.uploadUrl.accountLimit === 20 &&
      API_ACTION_RATE_LIMIT_RULES.uploadUrl.ipLimit === 600,
    "upload URL caps should be 20 per account and 600 per IP",
  );
  assert(
    API_ACTION_RATE_LIMIT_RULES.checkoutSession.accountLimit === 5 &&
      API_ACTION_RATE_LIMIT_RULES.checkoutSession.ipLimit === 100,
    "checkout caps should be 5 per account and 100 per IP",
  );
  assert(
    API_ACTION_RATE_LIMIT_RULES.studyTrial.accountLimit === 5 &&
      API_ACTION_RATE_LIMIT_RULES.studyTrial.ipLimit === 100,
    "trial caps should be 5 per account and 100 per IP",
  );
});

test("the account cap blocks its next request with a retry delay", async () => {
  const action = `test-account-${randomUUID()}`;
  const rule: ApiActionRateLimitRule = {
    windowMs: 60_000,
    accountLimit: 2,
    ipLimit: 10,
  };
  try {
    const first = await checkApiActionRateLimit(action, "user-a", "192.0.2.1", rule);
    const second = await checkApiActionRateLimit(action, "user-a", "192.0.2.1", rule);
    const third = await checkApiActionRateLimit(action, "user-a", "192.0.2.1", rule);
    assert(first.allowed && second.allowed, "the first two requests should pass");
    assert(!third.allowed, "the request after the account cap should be blocked");
    if (!third.allowed) {
      assert(third.limitedBy === "account", "the account bucket should be identified");
      assert(
        Number.isInteger(third.retryAfterSec) && third.retryAfterSec >= 1,
        "blocked requests should receive a positive retry delay",
      );
    }
  } finally {
    await cleanupAction(action);
  }
});

test("stored limiter identifiers are keyed hashes, not account IDs or IP addresses", async () => {
  const action = `test-hash-${randomUUID()}`;
  const userId = "sensitive-test-user";
  const ip = "198.51.100.77";
  const rule: ApiActionRateLimitRule = {
    windowMs: 60_000,
    accountLimit: 5,
    ipLimit: 5,
  };
  try {
    const decision = await checkApiActionRateLimit(action, userId, ip, rule);
    assert(decision.allowed, "the request should pass");
    const stored = await db
      .select({ subjectHash: apiRateLimitHitsTable.subjectHash })
      .from(apiRateLimitHitsTable)
      .where(eq(apiRateLimitHitsTable.action, action));
    assert(stored.length === 2, "one account and one IP bucket should be recorded");
    assert(
      stored.every((row) => /^[a-f0-9]{64}$/.test(row.subjectHash)),
      "stored subjects should be opaque HMAC digests",
    );
    assert(
      stored.every((row) => !row.subjectHash.includes(userId) && !row.subjectHash.includes(ip)),
      "raw account IDs and IP addresses must not be stored",
    );
  } finally {
    await cleanupAction(action);
  }
});

test("the IP cap applies across different accounts", async () => {
  const action = `test-ip-${randomUUID()}`;
  const rule: ApiActionRateLimitRule = {
    windowMs: 60_000,
    accountLimit: 10,
    ipLimit: 2,
  };
  try {
    const first = await checkApiActionRateLimit(action, "user-a", "192.0.2.2", rule);
    const second = await checkApiActionRateLimit(action, "user-b", "192.0.2.2", rule);
    const third = await checkApiActionRateLimit(action, "user-c", "192.0.2.2", rule);
    assert(first.allowed && second.allowed, "requests under the shared IP cap should pass");
    assert(!third.allowed, "the next account should be blocked by the shared IP cap");
    if (!third.allowed) {
      assert(third.limitedBy === "ip", "the IP bucket should be identified");
    }
  } finally {
    await cleanupAction(action);
  }
});

test("concurrent requests cannot pass the same remaining account allowance", async () => {
  const action = `test-concurrent-${randomUUID()}`;
  const rule: ApiActionRateLimitRule = {
    windowMs: 60_000,
    accountLimit: 2,
    ipLimit: 10,
  };
  try {
    const results = await Promise.all(
      Array.from({ length: 6 }, () =>
        checkApiActionRateLimit(action, "same-user", "192.0.2.3", rule),
      ),
    );
    assert(
      results.filter((result) => result.allowed).length === 2,
      "exactly the remaining two requests should pass",
    );
  } finally {
    await cleanupAction(action);
  }
});

test("rolling-window expiry allows requests after old hits age out", async () => {
  const action = `test-expiry-${randomUUID()}`;
  const rule: ApiActionRateLimitRule = {
    windowMs: 1_000,
    accountLimit: 1,
    ipLimit: 10,
  };
  const start = new Date("2026-10-30T12:00:00.000Z");
  try {
    const first = await checkApiActionRateLimit(
      action,
      "user-a",
      "192.0.2.4",
      rule,
      start,
    );
    const second = await checkApiActionRateLimit(
      action,
      "user-a",
      "192.0.2.4",
      rule,
      new Date(start.getTime() + 1_001),
    );
    assert(first.allowed && second.allowed, "a hit outside the rolling window should expire");
  } finally {
    await cleanupAction(action);
  }
});

interface MockResponse {
  statusCode: number | null;
  body: unknown;
  headers: Record<string, string>;
  setHeader(name: string, value: string): MockResponse;
  status(code: number): MockResponse;
  json(payload: unknown): MockResponse;
}

function makeResponse(): MockResponse {
  return {
    statusCode: null,
    body: undefined,
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

function makeRequest(): Request {
  const auth = { userId: "signed-in-user", tokenType: "session_token" as const };
  return {
    ip: "192.0.2.5",
    socket: { remoteAddress: "192.0.2.5" },
    auth: () => auth,
    log: {
      warn() {},
      error() {},
    },
  } as unknown as Request;
}

async function invokeMiddleware(
  middleware: RequestHandler,
): Promise<{ response: MockResponse; nextCalled: boolean }> {
  const response = makeResponse();
  let nextCalled = false;
  await middleware(
    makeRequest(),
    response as unknown as Parameters<RequestHandler>[1],
    () => {
      nextCalled = true;
    },
  );
  return { response, nextCalled };
}

test("the middleware returns 429 and Retry-After for a limited request", async () => {
  const middleware = createApiActionRateLimitMiddleware(async () => ({
    allowed: false,
    retryAfterSec: 12,
    limitedBy: "account",
  }))("customDeckGeneration");
  const result = await invokeMiddleware(middleware);
  assert(!result.nextCalled, "limited requests must not continue");
  assert(result.response.statusCode === 429, "limited requests must return 429");
  assert(
    result.response.headers["Retry-After"] === "12",
    "the response should contain the retry delay",
  );
});

test("the middleware fails closed with 503 when its store is unavailable", async () => {
  const middleware = createApiActionRateLimitMiddleware(async () => {
    throw new Error("test database failure");
  })("uploadUrl");
  const result = await invokeMiddleware(middleware);
  assert(!result.nextCalled, "store failures must block the protected action");
  assert(result.response.statusCode === 503, "store failures should return 503");
});

test("cleanup removes records older than the 24-hour retention period", async () => {
  const action = `test-cleanup-${randomUUID()}`;
  const now = new Date("2026-10-30T12:00:00.000Z");
  const expired = new Date(now.getTime() - 24 * 60 * 60 * 1000 - 1);
  const recent = new Date(now.getTime() - 60 * 60 * 1000);
  try {
    await db.insert(apiRateLimitHitsTable).values([
      { action, subjectHash: "expired-hash", hitAt: expired },
      { action, subjectHash: "recent-hash", hitAt: recent },
    ]);
    await pruneExpiredApiActionRateLimitHits(now);
    const remaining = await db
      .select({ subjectHash: apiRateLimitHitsTable.subjectHash })
      .from(apiRateLimitHitsTable)
      .where(eq(apiRateLimitHitsTable.action, action));
    assert(
      remaining.length === 1 && remaining[0]?.subjectHash === "recent-hash",
      "only the recent record should remain",
    );
  } finally {
    await cleanupAction(action);
  }
});

async function main(): Promise<void> {
  let failures = 0;
  for (const current of tests) {
    process.stdout.write(`• ${current.name} ... `);
    try {
      await current.fn();
      process.stdout.write("OK\n");
    } catch (err) {
      failures += 1;
      process.stdout.write("FAIL\n");
      console.error(err instanceof Error ? err.stack ?? err.message : err);
    }
  }
  await pool.end();
  if (failures > 0) {
    console.error(`\n❌ ${failures} of ${tests.length} test(s) failed`);
    process.exit(1);
  }
  console.log(`\n✅ All ${tests.length} test(s) passed`);
  process.exit(0);
}

main().catch(async (err) => {
  console.error(err);
  try {
    await pool.end();
  } catch {
    // ignore
  }
  process.exit(1);
});
