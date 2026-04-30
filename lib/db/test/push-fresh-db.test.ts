import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const PKG_DIR = path.resolve(path.dirname(__filename), "..");
const PUSH_SCRIPT = path.join(PKG_DIR, "scripts", "push.ts");

if (!process.env.DATABASE_URL) {
  console.error(
    "[push-fresh-db] DATABASE_URL is not set. Provision a database first.",
  );
  process.exit(1);
}

const MAINTENANCE_URL = process.env.DATABASE_URL;
const TEST_DB_NAME = `psychpro_push_test_${Date.now()}_${Math.random()
  .toString(36)
  .slice(2, 8)}`;

class AssertionError extends Error {}

function assert(cond: unknown, message: string): asserts cond {
  if (!cond) throw new AssertionError(message);
}

function buildTestDbUrl(testDbName: string): string {
  const u = new URL(MAINTENANCE_URL);
  u.pathname = `/${testDbName}`;
  return u.toString();
}

async function withClient<T>(
  connectionString: string,
  fn: (c: pg.Client) => Promise<T>,
): Promise<T> {
  const c = new pg.Client({ connectionString });
  await c.connect();
  try {
    return await fn(c);
  } finally {
    await c.end();
  }
}

async function dropTestDbIfExists(): Promise<void> {
  await withClient(MAINTENANCE_URL, async (c) => {
    // Terminate any lingering connections from prior aborted runs.
    await c.query(
      `SELECT pg_terminate_backend(pid)
         FROM pg_stat_activity
        WHERE datname = $1 AND pid <> pg_backend_pid()`,
      [TEST_DB_NAME],
    );
    await c.query(`DROP DATABASE IF EXISTS "${TEST_DB_NAME}"`);
  });
}

function runPushAgainstTestDb(testDbUrl: string): void {
  console.log(`[push-fresh-db] running push against fresh DB ${TEST_DB_NAME}…`);
  const result = spawnSync("npx", ["tsx", PUSH_SCRIPT], {
    cwd: PKG_DIR,
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8",
    env: { ...process.env, DATABASE_URL: testDbUrl },
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout ?? "");
    process.stderr.write(result.stderr ?? "");
    throw new Error(`push.ts exited with status ${result.status}`);
  }
  // Drizzle-kit prints to stdout; surface it for visibility but only on
  // success — on failure we already dumped both streams above.
  if (result.stdout) process.stdout.write(result.stdout);
}

const EXPECTED_TABLES = [
  "client_error_rate_hits",
  "client_error_rate_warnings",
  "custom_cloze_items",
  "custom_decks",
  "custom_flashcards",
  "custom_quiz_questions",
  "exam_attempts",
  "feedback",
  "flashcards",
  "practice_exam_questions",
  "practice_exams",
  "progress",
  "quiz_attempts",
  "quiz_questions",
  "study_guides",
  "topics",
  "users",
] as const;

const EXPECTED_INDEXES = [
  "client_error_rate_hits_key_time_idx",
  "client_error_rate_hits_hit_at_idx",
  "client_error_rate_warnings_warned_at_idx",
] as const;

async function verifyFreshSchema(testDbUrl: string): Promise<void> {
  await withClient(testDbUrl, async (c) => {
    // 1. Every expected table exists in `public`.
    const tables = await c.query<{ table_name: string }>(
      `SELECT table_name
         FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        ORDER BY table_name`,
    );
    const tableNames = new Set(tables.rows.map((r) => r.table_name));
    for (const expected of EXPECTED_TABLES) {
      assert(
        tableNames.has(expected),
        `expected table "${expected}" to exist after push, only found: ${[
          ...tableNames,
        ]
          .sort()
          .join(", ")}`,
      );
    }

    // 2. The topics_name_unique constraint exists (the central fix from
    //    Task #33 that lets seed.ts upsert by name).
    const constraint = await c.query<{ exists: boolean }>(
      `SELECT EXISTS (
         SELECT 1
           FROM pg_constraint cn
           JOIN pg_class t ON t.oid = cn.conrelid
           JOIN pg_namespace n ON n.oid = t.relnamespace
          WHERE cn.conname = 'topics_name_unique'
            AND t.relname = 'topics'
            AND n.nspname = 'public'
            AND cn.contype = 'u'
       ) AS exists`,
    );
    assert(
      constraint.rows[0]?.exists === true,
      "expected unique constraint topics_name_unique on public.topics to exist after push",
    );

    // 3. Each rate-limit index exists. Push must create these so the API
    //    server's per-IP throttle can scan client_error_rate_hits cheaply.
    const indexes = await c.query<{ indexname: string }>(
      `SELECT indexname
         FROM pg_indexes
        WHERE schemaname = 'public'`,
    );
    const indexNames = new Set(indexes.rows.map((r) => r.indexname));
    for (const expected of EXPECTED_INDEXES) {
      assert(
        indexNames.has(expected),
        `expected index "${expected}" to exist after push, only found: ${[
          ...indexNames,
        ]
          .sort()
          .join(", ")}`,
      );
    }

    // 4. Spot-check a few key columns to catch silent schema drift, e.g.
    //    a rate-limit table created without the columns the API queries.
    const hitsCols = await c.query<{ column_name: string; data_type: string }>(
      `SELECT column_name, data_type
         FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'client_error_rate_hits'`,
    );
    const hitsColNames = new Set(hitsCols.rows.map((r) => r.column_name));
    for (const col of ["id", "client_key", "hit_at"]) {
      assert(
        hitsColNames.has(col),
        `expected client_error_rate_hits.${col} column after push, found: ${[
          ...hitsColNames,
        ].join(", ")}`,
      );
    }

    const warningsCols = await c.query<{ column_name: string }>(
      `SELECT column_name
         FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'client_error_rate_warnings'`,
    );
    const warningsColNames = new Set(
      warningsCols.rows.map((r) => r.column_name),
    );
    for (const col of ["client_key", "warned_at"]) {
      assert(
        warningsColNames.has(col),
        `expected client_error_rate_warnings.${col} column after push, found: ${[
          ...warningsColNames,
        ].join(", ")}`,
      );
    }
  });
}

async function main() {
  let failed = false;
  try {
    // Defensive: clean up any stale DB from a previously aborted run with
    // the same name (extremely unlikely thanks to the random suffix, but
    // keeps the test self-healing).
    await dropTestDbIfExists();

    await withClient(MAINTENANCE_URL, async (c) => {
      console.log(`[push-fresh-db] creating empty database ${TEST_DB_NAME}…`);
      await c.query(`CREATE DATABASE "${TEST_DB_NAME}"`);
    });

    const testDbUrl = buildTestDbUrl(TEST_DB_NAME);

    // Sanity: the freshly-created DB must have no application tables, so
    // the rest of the test really is exercising the "fresh provision" path.
    await withClient(testDbUrl, async (c) => {
      const r = await c.query<{ n: string }>(
        `SELECT count(*)::text AS n
           FROM information_schema.tables
          WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`,
      );
      assert(
        Number(r.rows[0].n) === 0,
        `freshly-created DB unexpectedly has ${r.rows[0].n} public tables; aborting`,
      );
    });

    runPushAgainstTestDb(testDbUrl);
    await verifyFreshSchema(testDbUrl);

    // Re-running push must be idempotent on a freshly-pushed DB too.
    runPushAgainstTestDb(testDbUrl);
    await verifyFreshSchema(testDbUrl);

    console.log(
      "\n✅ push-fresh-db: all expected tables, indexes, and topics_name_unique constraint created (and idempotent on re-run).",
    );
  } catch (err) {
    failed = true;
    console.error("\n❌ push-fresh-db FAILED:");
    console.error(err instanceof Error ? err.stack ?? err.message : err);
  } finally {
    try {
      await dropTestDbIfExists();
    } catch (cleanupErr) {
      console.error("warning: failed to drop test database:", cleanupErr);
    }
  }
  process.exit(failed ? 1 : 0);
}

main();
