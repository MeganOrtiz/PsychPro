import { randomUUID } from "node:crypto";
import { pool } from "@workspace/db";
import type { Request, RequestHandler, Response } from "express";
import clientErrorsRouter, {
  MAX_FIELD_LENGTH,
  MAX_RELEASE_ID_LENGTH,
  MAX_URL_LENGTH,
  MAX_USER_AGENT_LENGTH,
} from "../src/routes/client-errors";

class AssertionError extends Error {}

function assert(cond: unknown, message: string): asserts cond {
  if (!cond) throw new AssertionError(message);
}

// Pull the *terminal* handler off the router's stack. The route is registered
// as `router.post("/client-errors", clientErrorsRateLimit, handler)`, so the
// last layer in the route's stack is the handler we want to exercise.
// Doing it this way lets us test the handler in isolation without spinning up
// a real HTTP server or modifying the route file.
function extractHandler(): RequestHandler {
  interface Layer {
    handle: RequestHandler;
  }
  interface RouteLayer {
    route?: {
      path: string;
      stack: Layer[];
    };
  }
  const stack = (clientErrorsRouter as unknown as { stack: RouteLayer[] }).stack;
  const routeLayer = stack.find((l) => l.route?.path === "/client-errors");
  assert(
    routeLayer?.route !== undefined,
    "could not find POST /client-errors layer on the router",
  );
  const handlers = routeLayer.route.stack;
  assert(
    handlers.length >= 2,
    `expected at least 2 handlers (rate-limit + route), got ${handlers.length}`,
  );
  return handlers[handlers.length - 1].handle;
}

const handleClientError = extractHandler();

interface CapturedLog {
  obj: Record<string, unknown>;
  msg: string;
}

interface MockRes {
  statusCode: number | null;
  ended: boolean;
  status(code: number): MockRes;
  end(): MockRes;
}

function makeRes(): MockRes {
  const res: MockRes = {
    statusCode: null,
    ended: false,
    status(code) {
      this.statusCode = code;
      return this;
    },
    end() {
      this.ended = true;
      return this;
    },
  };
  return res;
}

interface InvokeOptions {
  body: unknown;
  // `userId` simulates the verified Clerk user id that `clerkMiddleware()`
  // would attach to the request as `req.auth().userId`. The handler reads
  // it via `getOptionalUserId(req)` → `getAuth(req)`. Cases:
  //   - omitted (undefined) → no Clerk session, handler logs userId=null.
  //   - string → simulate a signed-in caller with that Clerk id.
  //   - explicit null → identical to omitting.
  userId?: string | null;
}

interface InvokeResult {
  res: MockRes;
  errorLogs: CapturedLog[];
}

function invokeHandler({ body, userId }: InvokeOptions): InvokeResult {
  const errorLogs: CapturedLog[] = [];

  // Mock just the bits of express's Request that the handler reads:
  // - `req.body` is what the handler trims/normalizes.
  // - `req.auth()` is what `getAuth()` from `@clerk/express` reads. In
  //   production this is populated by `clerkMiddleware()`; here we stub it
  //   so `getOptionalUserId(req)` returns the simulated Clerk user id.
  // - `req.log.error` is the pino-http per-request logger we capture.
  const headers: Record<string, string> = {};
  // `tokenType: "session_token"` is required: `getAuth(req)` from
  // `@clerk/express` defaults `acceptsToken` to `SessionToken` and
  // returns a signed-out auth object (userId=null) when the stub omits it.
  const auth = {
    userId: typeof userId === "string" && userId.length > 0 ? userId : null,
    tokenType: "session_token" as const,
  };
  const req = {
    body,
    headers,
    header(name: string): string | undefined {
      return headers[name.toLowerCase()];
    },
    auth: () => auth,
    log: {
      error: (obj: Record<string, unknown>, msg: string) => {
        errorLogs.push({ obj, msg });
      },
    },
  } as unknown as Request;

  const res = makeRes();
  handleClientError(req, res as unknown as Response, () => {
    /* not expected to be called; handler terminates the response */
  });

  return { res, errorLogs };
}

function getClientErrorPayload(log: CapturedLog): Record<string, unknown> {
  const payload = log.obj.clientError as Record<string, unknown> | undefined;
  assert(
    payload !== undefined && typeof payload === "object",
    "error log must carry a `clientError` object",
  );
  return payload;
}

interface TestCase {
  name: string;
  fn: () => Promise<void> | void;
}

const tests: TestCase[] = [];
function test(name: string, fn: () => Promise<void> | void): void {
  tests.push({ name, fn });
}

test("valid body produces 204 and logs trimmed/normalized fields verbatim", () => {
  const body = {
    message: "  Boom: something exploded  ",
    stack: "Error: Boom\n    at foo (file.js:1:1)",
    componentStack: "in Foo\n  in Bar",
    url: "https://example.com/page?x=1",
    userAgent: "Mozilla/5.0 TestAgent/1.0",
    releaseId: "abc123def456",
  };
  const { res, errorLogs } = invokeHandler({ body });

  assert(res.statusCode === 204, `expected 204, got ${res.statusCode}`);
  assert(res.ended === true, "expected response to be ended");
  assert(errorLogs.length === 1, `expected 1 error log, got ${errorLogs.length}`);

  const log = errorLogs[0];
  assert(
    log.msg === "Client-side error reported",
    `expected log msg "Client-side error reported", got ${JSON.stringify(log.msg)}`,
  );

  const payload = getClientErrorPayload(log);
  assert(
    payload.message === "Boom: something exploded",
    `expected trimmed message, got ${JSON.stringify(payload.message)}`,
  );
  assert(
    payload.stack === body.stack,
    `expected stack to round-trip, got ${JSON.stringify(payload.stack)}`,
  );
  assert(
    payload.componentStack === body.componentStack,
    `expected componentStack to round-trip, got ${JSON.stringify(payload.componentStack)}`,
  );
  assert(
    payload.url === body.url,
    `expected url to round-trip, got ${JSON.stringify(payload.url)}`,
  );
  assert(
    payload.userAgent === body.userAgent,
    `expected userAgent to round-trip, got ${JSON.stringify(payload.userAgent)}`,
  );
  assert(
    payload.releaseId === body.releaseId,
    `expected releaseId to round-trip, got ${JSON.stringify(payload.releaseId)}`,
  );
  assert(
    payload.userId === null,
    `expected userId null for unauthenticated request, got ${JSON.stringify(payload.userId)}`,
  );
});

test("oversized fields are truncated to documented caps (4000/1000/500/200)", () => {
  // Build strings comfortably larger than each cap so we can verify the cap
  // exactly. Use distinct fill chars per field so a mix-up would be obvious.
  const body = {
    message: "m".repeat(MAX_FIELD_LENGTH + 500),
    stack: "s".repeat(MAX_FIELD_LENGTH + 1234),
    componentStack: "c".repeat(MAX_FIELD_LENGTH + 1),
    url: "u".repeat(MAX_URL_LENGTH + 50),
    userAgent: "a".repeat(MAX_USER_AGENT_LENGTH + 50),
    releaseId: "r".repeat(MAX_RELEASE_ID_LENGTH + 50),
  };
  const { res, errorLogs } = invokeHandler({ body });

  assert(res.statusCode === 204, `expected 204, got ${res.statusCode}`);
  assert(errorLogs.length === 1, `expected 1 error log, got ${errorLogs.length}`);
  const payload = getClientErrorPayload(errorLogs[0]);

  function expectCapped(
    field: keyof typeof body,
    cap: number,
    fillChar: string,
  ): void {
    const value = payload[field];
    assert(
      typeof value === "string",
      `expected ${field} to be a string, got ${typeof value}`,
    );
    assert(
      value.length === cap,
      `expected ${field} to be capped at ${cap} chars, got ${value.length}`,
    );
    assert(
      value === fillChar.repeat(cap),
      `expected ${field} to be ${cap} of "${fillChar}" with no other chars`,
    );
  }

  expectCapped("message", MAX_FIELD_LENGTH, "m");
  expectCapped("stack", MAX_FIELD_LENGTH, "s");
  expectCapped("componentStack", MAX_FIELD_LENGTH, "c");
  expectCapped("url", MAX_URL_LENGTH, "u");
  expectCapped("userAgent", MAX_USER_AGENT_LENGTH, "a");
  expectCapped("releaseId", MAX_RELEASE_ID_LENGTH, "r");
});

test("fields at exactly the cap pass through unchanged (boundary check)", () => {
  const body = {
    message: "m".repeat(MAX_FIELD_LENGTH),
    url: "u".repeat(MAX_URL_LENGTH),
    userAgent: "a".repeat(MAX_USER_AGENT_LENGTH),
    releaseId: "r".repeat(MAX_RELEASE_ID_LENGTH),
  };
  const { res, errorLogs } = invokeHandler({ body });
  assert(res.statusCode === 204, `expected 204, got ${res.statusCode}`);
  const payload = getClientErrorPayload(errorLogs[0]);
  assert(
    payload.message === body.message,
    `message at exactly cap should pass through unchanged, length=${(payload.message as string).length}`,
  );
  assert(
    payload.url === body.url,
    `url at exactly cap should pass through unchanged, length=${(payload.url as string).length}`,
  );
  assert(
    payload.userAgent === body.userAgent,
    `userAgent at exactly cap should pass through unchanged, length=${(payload.userAgent as string).length}`,
  );
  assert(
    payload.releaseId === body.releaseId,
    `releaseId at exactly cap should pass through unchanged, length=${(payload.releaseId as string).length}`,
  );
});

test("missing message falls back to \"Unknown client error\"", () => {
  const { res, errorLogs } = invokeHandler({ body: {} });
  assert(res.statusCode === 204, `expected 204, got ${res.statusCode}`);
  const payload = getClientErrorPayload(errorLogs[0]);
  assert(
    payload.message === "Unknown client error",
    `expected fallback message, got ${JSON.stringify(payload.message)}`,
  );
});

test("non-string message falls back to \"Unknown client error\"", () => {
  // Anything that isn't a `string` should be treated as missing, including
  // numbers, booleans, arrays, objects, and null.
  const cases: unknown[] = [
    { message: 42 },
    { message: true },
    { message: ["array"] },
    { message: { nested: "object" } },
    { message: null },
  ];
  for (const body of cases) {
    const { res, errorLogs } = invokeHandler({ body });
    assert(res.statusCode === 204, `expected 204 for body=${JSON.stringify(body)}`);
    const payload = getClientErrorPayload(errorLogs[0]);
    assert(
      payload.message === "Unknown client error",
      `expected fallback for body=${JSON.stringify(body)}, got ${JSON.stringify(payload.message)}`,
    );
  }
});

test("whitespace-only message falls back to \"Unknown client error\"", () => {
  const { res, errorLogs } = invokeHandler({ body: { message: "   \t\n  " } });
  assert(res.statusCode === 204, `expected 204, got ${res.statusCode}`);
  const payload = getClientErrorPayload(errorLogs[0]);
  assert(
    payload.message === "Unknown client error",
    `expected fallback for whitespace-only message, got ${JSON.stringify(payload.message)}`,
  );
});

test("whitespace-only optional fields are dropped (undefined in payload)", () => {
  const body = {
    message: "real message",
    stack: "   ",
    componentStack: "\t\n",
    url: "     ",
    userAgent: "  \r\n  ",
    releaseId: "\t",
  };
  const { res, errorLogs } = invokeHandler({ body });
  assert(res.statusCode === 204, `expected 204, got ${res.statusCode}`);
  const payload = getClientErrorPayload(errorLogs[0]);
  assert(
    payload.message === "real message",
    `expected message preserved, got ${JSON.stringify(payload.message)}`,
  );
  for (const field of ["stack", "componentStack", "url", "userAgent", "releaseId"]) {
    assert(
      payload[field] === undefined,
      `expected ${field} to be dropped (undefined), got ${JSON.stringify(payload[field])}`,
    );
  }
});

test("missing optional fields are undefined in payload", () => {
  const { res, errorLogs } = invokeHandler({ body: { message: "only message" } });
  assert(res.statusCode === 204, `expected 204, got ${res.statusCode}`);
  const payload = getClientErrorPayload(errorLogs[0]);
  assert(
    payload.message === "only message",
    `expected message preserved, got ${JSON.stringify(payload.message)}`,
  );
  for (const field of ["stack", "componentStack", "url", "userAgent", "releaseId"]) {
    assert(
      payload[field] === undefined,
      `expected ${field} to be undefined when missing, got ${JSON.stringify(payload[field])}`,
    );
  }
});

test("non-string optional fields are dropped (undefined in payload)", () => {
  const body = {
    message: "real message",
    stack: 42,
    componentStack: { not: "a string" },
    url: ["not", "a", "string"],
    userAgent: true,
    releaseId: null,
  };
  const { res, errorLogs } = invokeHandler({ body });
  assert(res.statusCode === 204, `expected 204, got ${res.statusCode}`);
  const payload = getClientErrorPayload(errorLogs[0]);
  for (const field of ["stack", "componentStack", "url", "userAgent", "releaseId"]) {
    assert(
      payload[field] === undefined,
      `expected non-string ${field} to be dropped, got ${JSON.stringify(payload[field])}`,
    );
  }
});

test("missing/null body is tolerated and yields a fallback-message log", () => {
  for (const body of [undefined, null]) {
    const { res, errorLogs } = invokeHandler({ body });
    assert(
      res.statusCode === 204,
      `expected 204 for body=${JSON.stringify(body)}, got ${res.statusCode}`,
    );
    const payload = getClientErrorPayload(errorLogs[0]);
    assert(
      payload.message === "Unknown client error",
      `expected fallback message for body=${JSON.stringify(body)}, got ${JSON.stringify(payload.message)}`,
    );
    assert(
      payload.userId === null,
      `expected userId null for body=${JSON.stringify(body)}, got ${JSON.stringify(payload.userId)}`,
    );
  }
});

test("request with verified Clerk user id includes that userId in payload", () => {
  const userId = `user_${randomUUID()}`;
  const { res, errorLogs } = invokeHandler({
    body: { message: "client-supplied id error" },
    userId,
  });
  assert(res.statusCode === 204, `expected 204, got ${res.statusCode}`);
  const payload = getClientErrorPayload(errorLogs[0]);
  assert(
    payload.userId === userId,
    `expected userId=${userId}, got ${JSON.stringify(payload.userId)}`,
  );
  assert(
    payload.message === "client-supplied id error",
    `expected message preserved, got ${JSON.stringify(payload.message)}`,
  );
});

test("request without a Clerk session yields userId=null", () => {
  // No `userId` provided → invokeHandler stubs `req.auth()` to return
  // `{ userId: null }`. The handler's `getOptionalUserId` returns null and
  // the log carries null.
  const { res, errorLogs } = invokeHandler({ body: { message: "anon error" } });
  assert(res.statusCode === 204, `expected 204, got ${res.statusCode}`);
  const payload = getClientErrorPayload(errorLogs[0]);
  assert(
    payload.userId === null,
    `expected userId null without auth, got ${JSON.stringify(payload.userId)}`,
  );
});

test("payload always contains all six documented keys (even when undefined)", () => {
  // The handler builds the object with all keys present so log consumers
  // can rely on a stable shape. Verify that even when every optional field
  // is missing, the keys are still present (with `undefined` values).
  const { errorLogs } = invokeHandler({ body: { message: "shape check" } });
  const payload = getClientErrorPayload(errorLogs[0]);
  const expectedKeys = [
    "message",
    "stack",
    "componentStack",
    "url",
    "userAgent",
    "releaseId",
    "userId",
  ];
  for (const key of expectedKeys) {
    assert(
      key in payload,
      `expected payload to contain key "${key}", got keys=${JSON.stringify(Object.keys(payload))}`,
    );
  }
});

async function main(): Promise<void> {
  let failures = 0;
  for (const t of tests) {
    process.stdout.write(`• ${t.name} ... `);
    try {
      await t.fn();
      process.stdout.write("OK\n");
    } catch (err) {
      failures += 1;
      process.stdout.write("FAIL\n");
      console.error(err instanceof Error ? err.stack ?? err.message : err);
    }
  }
  // The handler doesn't touch the DB, but importing the router pulls in
  // `clientErrorsRateLimit` which imports `@workspace/db` and creates a pool.
  // Close it so the process exits cleanly.
  await pool.end();
  if (failures > 0) {
    console.error(`\n${failures} of ${tests.length} test(s) failed`);
    process.exit(1);
  }
  console.log(`\nAll ${tests.length} test(s) passed`);
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
