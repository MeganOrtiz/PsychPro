// IMPORTANT: env-var overrides must be set BEFORE the rate-limit middleware
// module is loaded, because it freezes `clientErrorsRateLimitConfig` at
// module-evaluation time. Static `import` statements are hoisted in ESM, so
// we set the env vars at the top of the file and use dynamic `await import`
// for any module that transitively reads CLIENT_ERRORS_RATE_LIMIT_*. Static
// imports below MUST not transitively load
// `src/middlewares/clientErrorsRateLimit`.
const OVERRIDE_WINDOW_MS = 12_345;
const OVERRIDE_LIMIT = 7;
const OVERRIDE_CLEANUP_INTERVAL_MS = 23_456;

process.env["CLIENT_ERRORS_RATE_LIMIT_WINDOW_MS"] = String(OVERRIDE_WINDOW_MS);
process.env["CLIENT_ERRORS_RATE_LIMIT_MAX"] = String(OVERRIDE_LIMIT);
process.env["CLIENT_ERRORS_RATE_LIMIT_CLEANUP_INTERVAL_MS"] = String(
  OVERRIDE_CLEANUP_INTERVAL_MS,
);

import pino, { type DestinationStream, type Logger } from "pino";
import type { IRouter, RequestHandler } from "express";

class AssertionError extends Error {}

function assert(cond: unknown, message: string): asserts cond {
  if (!cond) throw new AssertionError(message);
}

interface MockRes {
  statusCode: number | null;
  body: unknown;
  ended: boolean;
  status(code: number): MockRes;
  json(payload: unknown): MockRes;
}

function makeRes(): MockRes {
  const res: MockRes = {
    statusCode: null,
    body: undefined,
    ended: false,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      this.ended = true;
      return this;
    },
  };
  return res;
}

// Pull the `GET /healthz` handler off the router's stack. Mirrors the
// extraction style used in `clientErrorsHandler.test.ts` so we can exercise
// the route in isolation without spinning up an HTTP server.
async function getHealthHandler(): Promise<RequestHandler> {
  const mod = await import("../src/routes/health");
  const router = mod.default as unknown as IRouter;
  interface Layer {
    handle: RequestHandler;
  }
  interface RouteLayer {
    route?: {
      path: string;
      stack: Layer[];
      methods?: Record<string, boolean>;
    };
  }
  const stack = (router as unknown as { stack: RouteLayer[] }).stack;
  const layer = stack.find(
    (l) => l.route?.path === "/healthz" && l.route.methods?.["get"] === true,
  );
  assert(
    layer?.route !== undefined,
    "could not find GET /healthz layer on the health router",
  );
  const handlers = layer.route.stack;
  assert(
    handlers.length >= 1,
    `expected at least 1 handler on GET /healthz, got ${handlers.length}`,
  );
  return handlers[handlers.length - 1].handle;
}

interface TestCase {
  name: string;
  fn: () => Promise<void>;
}
const tests: TestCase[] = [];
function test(name: string, fn: () => Promise<void>): void {
  tests.push({ name, fn });
}

test(
  "GET /api/healthz returns config.clientErrorsRateLimit matching env overrides",
  async () => {
    const handler = await getHealthHandler();
    const res = makeRes();
    // The handler is synchronous: it calls res.json() inline.
    handler(
      {} as Parameters<RequestHandler>[0],
      res as unknown as Parameters<RequestHandler>[1],
      () => {
        /* next is unused */
      },
    );

    assert(
      res.body !== undefined,
      "expected GET /healthz handler to call res.json() with a body",
    );
    const body = res.body as {
      status?: unknown;
      config?: {
        clientErrorsRateLimit?: { windowMs?: unknown; limit?: unknown };
        clientErrorsRateLimitCleanup?: { intervalMs?: unknown };
      };
    };
    assert(
      body.status === "ok",
      `expected body.status === "ok", got ${JSON.stringify(body.status)}`,
    );
    const cfg = body.config?.clientErrorsRateLimit;
    assert(
      cfg !== undefined,
      `expected body.config.clientErrorsRateLimit to be present, got ${JSON.stringify(
        body,
      )}`,
    );
    assert(
      cfg.windowMs === OVERRIDE_WINDOW_MS,
      `expected windowMs=${OVERRIDE_WINDOW_MS}, got ${JSON.stringify(
        cfg.windowMs,
      )}`,
    );
    assert(
      cfg.limit === OVERRIDE_LIMIT,
      `expected limit=${OVERRIDE_LIMIT}, got ${JSON.stringify(cfg.limit)}`,
    );
    const cleanupCfg = body.config?.clientErrorsRateLimitCleanup;
    assert(
      cleanupCfg !== undefined,
      `expected body.config.clientErrorsRateLimitCleanup to be present, got ${JSON.stringify(
        body,
      )}`,
    );
    assert(
      cleanupCfg.intervalMs === OVERRIDE_CLEANUP_INTERVAL_MS,
      `expected intervalMs=${OVERRIDE_CLEANUP_INTERVAL_MS}, got ${JSON.stringify(
        cleanupCfg.intervalMs,
      )}`,
    );
  },
);

test(
  "logResolvedClientErrorsRateLimit emits one info line with the resolved config",
  async () => {
    const startup = await import("../src/startup");

    const captured: string[] = [];
    // Pino accepts any object exposing a `write(chunk)` method as a
    // destination. We capture serialized JSON lines so we can assert level,
    // msg and the structured payload exactly.
    const destination: DestinationStream = {
      write(chunk: string) {
        captured.push(chunk);
      },
    };
    const testLogger: Logger = pino({ level: "info" }, destination);

    startup.logResolvedClientErrorsRateLimit(testLogger);

    assert(
      captured.length === 1,
      `expected exactly 1 log line, got ${captured.length}: ${JSON.stringify(
        captured,
      )}`,
    );
    const raw = captured[0];
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw) as Record<string, unknown>;
    } catch (err) {
      throw new AssertionError(
        `log line was not valid JSON: ${JSON.stringify(raw)} (${
          err instanceof Error ? err.message : String(err)
        })`,
      );
    }

    // Pino encodes `info` as level 30 in its default JSON output.
    assert(
      parsed["level"] === 30,
      `expected level=30 (info), got ${JSON.stringify(parsed["level"])}`,
    );
    assert(
      parsed["msg"] === startup.RESOLVED_CLIENT_ERRORS_RATE_LIMIT_LOG_MSG,
      `expected msg=${JSON.stringify(
        startup.RESOLVED_CLIENT_ERRORS_RATE_LIMIT_LOG_MSG,
      )}, got ${JSON.stringify(parsed["msg"])}`,
    );
    // Belt-and-braces: also assert the literal string operators grep for, so
    // a future rename of the constant alone (without updating the message
    // payload) is caught.
    assert(
      parsed["msg"] === "Resolved client-error rate limit",
      `expected msg literal "Resolved client-error rate limit", got ${JSON.stringify(
        parsed["msg"],
      )}`,
    );

    const payload = parsed["clientErrorsRateLimit"] as
      | { windowMs?: unknown; limit?: unknown }
      | undefined;
    assert(
      payload !== undefined && typeof payload === "object",
      `expected log line to carry a clientErrorsRateLimit object, got ${JSON.stringify(
        parsed,
      )}`,
    );
    assert(
      payload.windowMs === OVERRIDE_WINDOW_MS,
      `expected logged windowMs=${OVERRIDE_WINDOW_MS}, got ${JSON.stringify(
        payload.windowMs,
      )}`,
    );
    assert(
      payload.limit === OVERRIDE_LIMIT,
      `expected logged limit=${OVERRIDE_LIMIT}, got ${JSON.stringify(
        payload.limit,
      )}`,
    );
  },
);

test(
  "exported clientErrorsRateLimitConfig reflects env overrides",
  async () => {
    // Locks in the `clientErrorsRateLimitConfig` symbol that both the boot
    // log and the health route depend on. If a future refactor renames or
    // drops this export, this test fails before the operator-facing
    // verification path silently breaks.
    const mod = await import("../src/middlewares/clientErrorsRateLimit");
    const cfg = mod.clientErrorsRateLimitConfig;
    assert(
      cfg !== undefined && typeof cfg === "object",
      "expected clientErrorsRateLimitConfig to be exported as an object",
    );
    assert(
      cfg.windowMs === OVERRIDE_WINDOW_MS,
      `expected clientErrorsRateLimitConfig.windowMs=${OVERRIDE_WINDOW_MS}, got ${cfg.windowMs}`,
    );
    assert(
      cfg.limit === OVERRIDE_LIMIT,
      `expected clientErrorsRateLimitConfig.limit=${OVERRIDE_LIMIT}, got ${cfg.limit}`,
    );

    // Same belt-and-braces guard for the cleanup config: the health route
    // and the startup sweeper both import this exported symbol, so a rename
    // or drop would silently regress the operator-facing verification path.
    const cleanupCfg = mod.clientErrorsRateLimitCleanupConfig;
    assert(
      cleanupCfg !== undefined && typeof cleanupCfg === "object",
      "expected clientErrorsRateLimitCleanupConfig to be exported as an object",
    );
    assert(
      cleanupCfg.intervalMs === OVERRIDE_CLEANUP_INTERVAL_MS,
      `expected clientErrorsRateLimitCleanupConfig.intervalMs=${OVERRIDE_CLEANUP_INTERVAL_MS}, got ${cleanupCfg.intervalMs}`,
    );
  },
);

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
      console.error(err instanceof Error ? (err.stack ?? err.message) : err);
    }
  }
  // The middleware module transitively imports `@workspace/db`, which opens
  // a pg pool at module-evaluation time. Close it so the test process can
  // exit cleanly.
  try {
    const { pool } = await import("@workspace/db");
    await pool.end();
  } catch {
    // ignore — pool may not have been opened if the middleware module never
    // loaded (e.g. early failure), in which case there's nothing to close.
  }
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
    const { pool } = await import("@workspace/db");
    await pool.end();
  } catch {
    // ignore
  }
  process.exit(1);
});
