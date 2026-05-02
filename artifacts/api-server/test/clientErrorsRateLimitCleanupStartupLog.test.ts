// Locks down the boot log line emitted by `startClientErrorsRateLimitCleanup`.
//
// Operators rely on the API server's startup logs (alongside `/healthz`) to
// confirm the resolved client-error rate-limit cleanup interval. A future
// refactor that drops the structured payload, renames the message string, or
// forgets to log it at startup would silently regress that verification path
// without any test going red — this suite exists to catch that.
//
// IMPORTANT: env-var overrides must be set BEFORE the rate-limit middleware
// module is loaded, because it freezes the resolved cleanup interval at
// module-evaluation time. Static `import` statements are hoisted in ESM, so
// we set the env var at the top of the file and use dynamic `await import`
// for any module that transitively reads
// `CLIENT_ERRORS_RATE_LIMIT_CLEANUP_INTERVAL_MS`. Static imports below MUST
// not transitively load `src/middlewares/clientErrorsRateLimit`.
//
// We deliberately pick an interval far larger than the test's wall-clock
// duration so the recurring sweeper never fires during the test. The only
// log line produced should be the synchronous startup line.
const OVERRIDE_CLEANUP_INTERVAL_MS = 3_600_000;

process.env["CLIENT_ERRORS_RATE_LIMIT_CLEANUP_INTERVAL_MS"] = String(
  OVERRIDE_CLEANUP_INTERVAL_MS,
);

import pino, { type DestinationStream, type Logger } from "pino";

class AssertionError extends Error {}

function assert(cond: unknown, message: string): asserts cond {
  if (!cond) throw new AssertionError(message);
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
  "startClientErrorsRateLimitCleanup emits one info line with the resolved cleanup interval",
  async () => {
    const mod = await import("../src/middlewares/clientErrorsRateLimit");

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

    const handle = mod.startClientErrorsRateLimitCleanup(testLogger);
    try {
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
        parsed["msg"] ===
          mod.CLIENT_ERRORS_RATE_LIMIT_CLEANUP_STARTED_LOG_MSG,
        `expected msg=${JSON.stringify(
          mod.CLIENT_ERRORS_RATE_LIMIT_CLEANUP_STARTED_LOG_MSG,
        )}, got ${JSON.stringify(parsed["msg"])}`,
      );
      // Belt-and-braces: also assert the literal string operators grep for, so
      // a future rename of the constant alone (without updating the message
      // payload) is caught.
      assert(
        parsed["msg"] === "Started client-error rate-limit cleanup sweeper",
        `expected msg literal "Started client-error rate-limit cleanup sweeper", got ${JSON.stringify(
          parsed["msg"],
        )}`,
      );

      const payload = parsed["clientErrorsRateLimitCleanup"] as
        | { intervalMs?: unknown }
        | undefined;
      assert(
        payload !== undefined && typeof payload === "object",
        `expected log line to carry a clientErrorsRateLimitCleanup object, got ${JSON.stringify(
          parsed,
        )}`,
      );
      assert(
        payload.intervalMs === OVERRIDE_CLEANUP_INTERVAL_MS,
        `expected logged intervalMs=${OVERRIDE_CLEANUP_INTERVAL_MS}, got ${JSON.stringify(
          payload.intervalMs,
        )}`,
      );
    } finally {
      // Always stop the recurring sweeper so the interval doesn't keep the
      // test process alive (the handle is `unref()`ed in production, but we
      // still want a deterministic teardown here).
      handle.stop();
    }
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
