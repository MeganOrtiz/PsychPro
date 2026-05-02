import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import {
  db,
  pool,
  clientErrorRateHitsTable,
  clientErrorRateWarningsTable,
} from "@workspace/db";
import {
  clientErrorsRateLimit,
  pruneExpiredClientErrorRateRows,
} from "../src/middlewares/clientErrorsRateLimit";

const WINDOW_MS = 60_000;
const LIMIT = 30;

class AssertionError extends Error {}

function assert(cond: unknown, message: string): asserts cond {
  if (!cond) throw new AssertionError(message);
}

interface CapturedLog {
  obj: Record<string, unknown>;
  msg: string;
}

interface MockRes {
  statusCode: number | null;
  body: unknown;
  headers: Record<string, string>;
  ended: boolean;
  setHeader(name: string, value: string): MockRes;
  status(code: number): MockRes;
  json(payload: unknown): MockRes;
}

function makeRes(): MockRes {
  const res: MockRes = {
    statusCode: null,
    body: undefined,
    headers: {},
    ended: false,
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
      this.ended = true;
      return this;
    },
  };
  return res;
}

interface RunOptions {
  ip: string;
  userAgent?: string;
  userId?: string | null;
}

interface RunResult {
  res: MockRes;
  nextCalled: boolean;
  warnLogs: CapturedLog[];
  errorLogs: CapturedLog[];
}

async function runOnce({ ip, userAgent, userId }: RunOptions): Promise<RunResult> {
  const warnLogs: CapturedLog[] = [];
  const errorLogs: CapturedLog[] = [];

  // Mock the bare minimum of express's Request that the middleware touches.
  // - `req.ip` is read for the per-IP key.
  // - `req.headers["user-agent"]` is included in the warn payload.
  // - `req.auth` (when present) is what `@clerk/express`'s `getAuth` reads to
  //   produce the `userId` field. When absent, `getAuth` throws and the
  //   middleware's `getAuthUserIdSafe` swallows the error → userId = null.
  // - `req.log.warn` is the pino-http per-request logger we capture.
  const req = {
    ip,
    socket: { remoteAddress: ip },
    headers: { "user-agent": userAgent ?? "test-agent/1.0" },
    log: {
      warn: (obj: Record<string, unknown>, msg: string) => {
        warnLogs.push({ obj, msg });
      },
      error: (obj: Record<string, unknown>, msg: string) => {
        errorLogs.push({ obj, msg });
      },
    },
    ...(userId !== undefined
      ? {
          // `getAuth` calls `req.auth(options)` and then passes the result
          // through `getAuthObjectForAcceptedToken`, which defaults to the
          // `session_token` token type. Set `tokenType` so it matches and the
          // userId survives the type check (otherwise it'd be replaced with a
          // signed-out object whose userId is null).
          auth: () => ({ userId, tokenType: "session_token" }),
        }
      : {}),
  } as unknown as Parameters<typeof clientErrorsRateLimit>[0];

  const res = makeRes();
  let nextCalled = false;
  await clientErrorsRateLimit(
    req,
    res as unknown as Parameters<typeof clientErrorsRateLimit>[1],
    () => {
      nextCalled = true;
    },
  );
  return { res, nextCalled, warnLogs, errorLogs };
}

async function cleanupForKey(ip: string): Promise<void> {
  await db
    .delete(clientErrorRateHitsTable)
    .where(eq(clientErrorRateHitsTable.clientKey, ip));
  await db
    .delete(clientErrorRateWarningsTable)
    .where(eq(clientErrorRateWarningsTable.clientKey, ip));
}

interface TestCase {
  name: string;
  fn: () => Promise<void>;
}

const tests: TestCase[] = [];
function test(name: string, fn: () => Promise<void>): void {
  tests.push({ name, fn });
}

test("requests under the limit pass through (next called, no 429)", async () => {
  const ip = `test-under-${randomUUID()}`;
  try {
    for (let i = 1; i <= LIMIT; i++) {
      const r = await runOnce({ ip });
      assert(
        r.nextCalled,
        `request #${i} of ${LIMIT} should have called next(), got status=${r.res.statusCode}`,
      );
      assert(
        r.res.statusCode === null,
        `request #${i} should not have set a status, got ${r.res.statusCode}`,
      );
      assert(
        r.warnLogs.length === 0,
        `request #${i} should not have logged a warn, got ${r.warnLogs.length}`,
      );
    }
  } finally {
    await cleanupForKey(ip);
  }
});

test("(limit+1)th request returns 429 with Retry-After header", async () => {
  const ip = `test-overflow-${randomUUID()}`;
  try {
    // Fill the window up to the limit.
    for (let i = 1; i <= LIMIT; i++) {
      const r = await runOnce({ ip });
      assert(r.nextCalled, `setup: request #${i} should pass`);
    }

    const overflow = await runOnce({ ip });
    assert(
      !overflow.nextCalled,
      `(limit+1)th request must NOT call next(), got nextCalled=true`,
    );
    assert(
      overflow.res.statusCode === 429,
      `(limit+1)th request must return 429, got ${overflow.res.statusCode}`,
    );
    const retryAfter = overflow.res.headers["Retry-After"];
    assert(
      typeof retryAfter === "string" && retryAfter.length > 0,
      `(limit+1)th response must set Retry-After header, got ${JSON.stringify(retryAfter)}`,
    );
    const retryAfterNum = Number(retryAfter);
    assert(
      Number.isFinite(retryAfterNum) && retryAfterNum >= 1,
      `Retry-After must be a positive integer string, got ${JSON.stringify(retryAfter)}`,
    );
    assert(
      retryAfterNum <= Math.ceil(WINDOW_MS / 1000),
      `Retry-After (${retryAfterNum}s) must not exceed window (${WINDOW_MS / 1000}s)`,
    );
  } finally {
    await cleanupForKey(ip);
  }
});

test("first 429 logs one warn line with ip, user-agent and userId", async () => {
  const ip = `test-warnonce-${randomUUID()}`;
  const userAgent = "WarnTest/2.3 (test-suite)";
  const userId = `user_${randomUUID()}`;
  try {
    for (let i = 1; i <= LIMIT; i++) {
      await runOnce({ ip, userAgent, userId });
    }
    const overflow = await runOnce({ ip, userAgent, userId });
    assert(overflow.res.statusCode === 429, "expected first overflow to be 429");
    assert(
      overflow.warnLogs.length === 1,
      `expected exactly 1 warn log on first overflow, got ${overflow.warnLogs.length}`,
    );
    const [warning] = overflow.warnLogs;
    const payload = warning.obj.clientErrorsRateLimit as
      | Record<string, unknown>
      | undefined;
    assert(
      payload !== undefined && typeof payload === "object",
      "warn log must carry a `clientErrorsRateLimit` object",
    );
    assert(
      payload.ip === ip,
      `warn log ip must be ${ip}, got ${JSON.stringify(payload.ip)}`,
    );
    assert(
      payload.userAgent === userAgent,
      `warn log userAgent must be ${userAgent}, got ${JSON.stringify(payload.userAgent)}`,
    );
    assert(
      payload.userId === userId,
      `warn log userId must be ${userId}, got ${JSON.stringify(payload.userId)}`,
    );
    assert(
      typeof warning.msg === "string" && warning.msg.length > 0,
      "warn log must include a non-empty message string",
    );
  } finally {
    await cleanupForKey(ip);
  }
});

test("subsequent 429s in the same window do NOT log warn", async () => {
  const ip = `test-warnsuppress-${randomUUID()}`;
  try {
    for (let i = 1; i <= LIMIT; i++) {
      await runOnce({ ip });
    }
    // First overflow → expected to warn.
    const first = await runOnce({ ip });
    assert(first.res.statusCode === 429, "expected first overflow to be 429");
    assert(
      first.warnLogs.length === 1,
      `expected first overflow to warn once, got ${first.warnLogs.length}`,
    );

    // Three more overflows in the same window → must not warn again.
    for (let i = 0; i < 3; i++) {
      const subsequent = await runOnce({ ip });
      assert(
        subsequent.res.statusCode === 429,
        `expected subsequent overflow #${i + 1} to be 429`,
      );
      assert(
        subsequent.warnLogs.length === 0,
        `subsequent overflow #${i + 1} must NOT warn, got ${subsequent.warnLogs.length}`,
      );
    }

    // Confirm only one warning row exists for this client.
    const warnings = await db
      .select()
      .from(clientErrorRateWarningsTable)
      .where(eq(clientErrorRateWarningsTable.clientKey, ip));
    assert(
      warnings.length === 1,
      `expected exactly 1 warning row for ${ip}, got ${warnings.length}`,
    );
  } finally {
    await cleanupForKey(ip);
  }
});

test("once the window elapses, the next overflow logs again", async () => {
  const ip = `test-windowreset-${randomUUID()}`;
  try {
    // Phase 1: fill + overflow once → warns.
    for (let i = 1; i <= LIMIT; i++) {
      await runOnce({ ip });
    }
    const firstOverflow = await runOnce({ ip });
    assert(
      firstOverflow.warnLogs.length === 1,
      "expected first overflow in initial window to warn once",
    );

    // Simulate the window having elapsed by ageing all hits AND the warning
    // row well past WINDOW_MS into the past. The middleware's logic deletes
    // any hit older than `now - WINDOW_MS` and treats a warning whose
    // `warnedAt` is not strictly newer than `windowStart` as a new window.
    const aged = new Date(Date.now() - (WINDOW_MS + 5_000));
    await db
      .update(clientErrorRateHitsTable)
      .set({ hitAt: aged })
      .where(eq(clientErrorRateHitsTable.clientKey, ip));
    await db
      .update(clientErrorRateWarningsTable)
      .set({ warnedAt: aged })
      .where(eq(clientErrorRateWarningsTable.clientKey, ip));

    // Phase 2: the next LIMIT requests count as a fresh window — they should
    // pass through, since the aged hits will be pruned at evaluation time.
    for (let i = 1; i <= LIMIT; i++) {
      const r = await runOnce({ ip });
      assert(
        r.nextCalled,
        `phase2 request #${i} should pass after window elapsed, got status=${r.res.statusCode}`,
      );
    }

    // Phase 3: the (limit+1)th request in the new window → 429 AND warns.
    const secondOverflow = await runOnce({ ip });
    assert(
      secondOverflow.res.statusCode === 429,
      "expected overflow in fresh window to be 429",
    );
    assert(
      secondOverflow.warnLogs.length === 1,
      `expected fresh-window overflow to warn again, got ${secondOverflow.warnLogs.length}`,
    );
  } finally {
    await cleanupForKey(ip);
  }
});

test(
  "pruneExpiredClientErrorRateRows deletes hit/warning rows older than the window",
  async () => {
    const ip = `test-cleanup-expired-${randomUUID()}`;
    const freshIp = `test-cleanup-fresh-${randomUUID()}`;
    try {
      // Seed an expired hit + warning for `ip` and a fresh hit + warning
      // for `freshIp`. After the prune, only the expired rows should be
      // gone — the fresh ones must survive (otherwise the sweeper would
      // also wipe live rate-limit state for active clients).
      const aged = new Date(Date.now() - (WINDOW_MS + 5_000));
      const fresh = new Date();

      await db
        .insert(clientErrorRateHitsTable)
        .values({ clientKey: ip, hitAt: aged });
      await db
        .insert(clientErrorRateWarningsTable)
        .values({ clientKey: ip, warnedAt: aged });

      await db
        .insert(clientErrorRateHitsTable)
        .values({ clientKey: freshIp, hitAt: fresh });
      await db
        .insert(clientErrorRateWarningsTable)
        .values({ clientKey: freshIp, warnedAt: fresh });

      // The prune deletes ALL rows older than the window, not just the
      // seeded ones — a shared dev DB could legitimately carry leftover
      // expired rows from earlier runs. So assert that the counts cover at
      // least the rows we just seeded (and are real numbers, not undefined
      // from a missing rowCount). This still catches the "silent no-op"
      // regression that motivated the task: a 0 here means the sweeper
      // isn't actually deleting anything.
      const counts = await pruneExpiredClientErrorRateRows();
      assert(
        Number.isInteger(counts.hitsDeleted) && counts.hitsDeleted >= 1,
        `expected pruneExpiredClientErrorRateRows to report >=1 hit deleted, got ${counts.hitsDeleted}`,
      );
      assert(
        Number.isInteger(counts.warningsDeleted) && counts.warningsDeleted >= 1,
        `expected pruneExpiredClientErrorRateRows to report >=1 warning deleted, got ${counts.warningsDeleted}`,
      );

      const expiredHits = await db
        .select()
        .from(clientErrorRateHitsTable)
        .where(eq(clientErrorRateHitsTable.clientKey, ip));
      assert(
        expiredHits.length === 0,
        `expected expired hit row for ${ip} to be deleted, found ${expiredHits.length}`,
      );
      const expiredWarnings = await db
        .select()
        .from(clientErrorRateWarningsTable)
        .where(eq(clientErrorRateWarningsTable.clientKey, ip));
      assert(
        expiredWarnings.length === 0,
        `expected expired warning row for ${ip} to be deleted, found ${expiredWarnings.length}`,
      );

      const freshHits = await db
        .select()
        .from(clientErrorRateHitsTable)
        .where(eq(clientErrorRateHitsTable.clientKey, freshIp));
      assert(
        freshHits.length === 1,
        `expected fresh hit row for ${freshIp} to survive, found ${freshHits.length}`,
      );
      const freshWarnings = await db
        .select()
        .from(clientErrorRateWarningsTable)
        .where(eq(clientErrorRateWarningsTable.clientKey, freshIp));
      assert(
        freshWarnings.length === 1,
        `expected fresh warning row for ${freshIp} to survive, found ${freshWarnings.length}`,
      );
    } finally {
      await cleanupForKey(ip);
      await cleanupForKey(freshIp);
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
