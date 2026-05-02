import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const PKG_DIR = path.resolve(path.dirname(__filename), "..");
const PUSH_SCRIPT = path.join(PKG_DIR, "scripts", "push.ts");
const SEED_SCRIPT = path.join(PKG_DIR, "src", "seed.ts");

if (!process.env.DATABASE_URL) {
  console.error(
    "[push-then-seed-fresh-db] DATABASE_URL is not set. Provision a database first.",
  );
  process.exit(1);
}

const MAINTENANCE_URL = process.env.DATABASE_URL;
const TEST_DB_NAME = `psychpro_push_seed_test_${Date.now()}_${Math.random()
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
    await c.query(
      `SELECT pg_terminate_backend(pid)
         FROM pg_stat_activity
        WHERE datname = $1 AND pid <> pg_backend_pid()`,
      [TEST_DB_NAME],
    );
    await c.query(`DROP DATABASE IF EXISTS "${TEST_DB_NAME}"`);
  });
}

function runScriptAgainstTestDb(
  label: string,
  scriptPath: string,
  testDbUrl: string,
): void {
  console.log(
    `[push-then-seed-fresh-db] running ${label} against fresh DB ${TEST_DB_NAME}…`,
  );
  const result = spawnSync("npx", ["tsx", scriptPath], {
    cwd: PKG_DIR,
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8",
    env: { ...process.env, DATABASE_URL: testDbUrl },
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout ?? "");
    process.stderr.write(result.stderr ?? "");
    throw new Error(`${label} exited with status ${result.status}`);
  }
  if (result.stdout) process.stdout.write(result.stdout);
}

// Lower bounds per PUBLISHING.md §4 ("15 topics, 200+ flashcards,
// 150+ quiz questions, 15 study guides, 15 practice exams"). Using
// inclusive minimums rather than exact counts so adding new content to
// `src/seed.ts` doesn't break this test, while a regression that wipes
// or under-populates a content table will still trip the assertion.
const EXPECTED_MIN_COUNTS: Record<string, number> = {
  topics: 15,
  flashcards: 200,
  quiz_questions: 150,
  study_guides: 15,
  practice_exams: 15,
  // Not separately documented; the seed inserts many rows per practice
  // exam, so a non-empty table is the meaningful invariant.
  practice_exam_questions: 1,
};

async function verifyContentPopulated(testDbUrl: string): Promise<void> {
  await withClient(testDbUrl, async (c) => {
    for (const [table, min] of Object.entries(EXPECTED_MIN_COUNTS)) {
      const r = await c.query<{ n: string }>(
        `SELECT count(*)::text AS n FROM ${table}`,
      );
      const actual = Number(r.rows[0]?.n ?? 0);
      assert(
        actual >= min,
        `expected at least ${min} rows in ${table} after seed, got ${actual}`,
      );
      console.log(
        `[push-then-seed-fresh-db]   ${table}: ${actual} rows (>= ${min})`,
      );
    }

    // Cross-table sanity: every flashcard / quiz_question / study_guide /
    // practice_exam must point at a real topic. A push that omitted the
    // topics FK, or a seed that referenced a now-deleted topic id, would
    // leave orphan rows that this query catches.
    const orphanChecks: Array<{ child: string }> = [
      { child: "flashcards" },
      { child: "quiz_questions" },
      { child: "study_guides" },
      { child: "practice_exams" },
    ];
    for (const { child } of orphanChecks) {
      const r = await c.query<{ n: string }>(
        `SELECT count(*)::text AS n
           FROM ${child} c
           LEFT JOIN topics t ON t.id = c.topic_id
          WHERE t.id IS NULL`,
      );
      const orphans = Number(r.rows[0]?.n ?? 0);
      assert(
        orphans === 0,
        `expected 0 orphan ${child} rows (topic_id with no matching topic), got ${orphans}`,
      );
    }

    // Practice-exam questions hang off practice_exams, not topics.
    const examOrphans = await c.query<{ n: string }>(
      `SELECT count(*)::text AS n
         FROM practice_exam_questions q
         LEFT JOIN practice_exams e ON e.id = q.exam_id
        WHERE e.id IS NULL`,
    );
    const examOrphanCount = Number(examOrphans.rows[0]?.n ?? 0);
    assert(
      examOrphanCount === 0,
      `expected 0 orphan practice_exam_questions (exam_id with no matching exam), got ${examOrphanCount}`,
    );
  });
}

async function main() {
  let failed = false;
  try {
    // Defensive: clean up any stale DB from a previously aborted run.
    await dropTestDbIfExists();

    await withClient(MAINTENANCE_URL, async (c) => {
      console.log(
        `[push-then-seed-fresh-db] creating empty database ${TEST_DB_NAME}…`,
      );
      await c.query(`CREATE DATABASE "${TEST_DB_NAME}"`);
    });

    const testDbUrl = buildTestDbUrl(TEST_DB_NAME);

    // Sanity: the freshly-created DB must have no application tables.
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

    // The "first publish" sequence: push then seed, exactly as documented in
    // PUBLISHING.md §4.
    runScriptAgainstTestDb("push.ts", PUSH_SCRIPT, testDbUrl);
    runScriptAgainstTestDb("seed.ts", SEED_SCRIPT, testDbUrl);

    await verifyContentPopulated(testDbUrl);

    console.log(
      "\n✅ push-then-seed-fresh-db: push then seed populated every content table from a brand-new database.",
    );
  } catch (err) {
    failed = true;
    console.error("\n❌ push-then-seed-fresh-db FAILED:");
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
