import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const PKG_DIR = path.resolve(path.dirname(__filename), "..");

if (!process.env.DATABASE_URL) {
  console.error(
    "DATABASE_URL is not set. Provision a database before running push.",
  );
  process.exit(1);
}

async function ensureTopicsNameUnique(): Promise<void> {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    const tableExists = await client.query<{ exists: boolean }>(
      `SELECT EXISTS (
         SELECT 1 FROM information_schema.tables
         WHERE table_schema = 'public' AND table_name = 'topics'
       ) AS exists`,
    );
    if (!tableExists.rows[0]?.exists) {
      return;
    }

    const constraintExists = await client.query<{ exists: boolean }>(
      `SELECT EXISTS (
         SELECT 1
           FROM pg_constraint c
           JOIN pg_class t ON t.oid = c.conrelid
           JOIN pg_namespace n ON n.oid = t.relnamespace
          WHERE c.conname = 'topics_name_unique'
            AND t.relname = 'topics'
            AND n.nspname = 'public'
       ) AS exists`,
    );
    if (constraintExists.rows[0]?.exists) {
      return;
    }

    const dupes = await client.query<{ name: string; n: string }>(
      `SELECT name, count(*)::text AS n
         FROM topics
         GROUP BY name
         HAVING count(*) > 1`,
    );
    if (dupes.rows.length > 0) {
      const list = dupes.rows.map((r) => `${r.name} (x${r.n})`).join(", ");
      throw new Error(
        `Cannot add topics_name_unique: duplicate topic names exist: ${list}. ` +
          `Resolve duplicates before running push.`,
      );
    }

    console.log(
      "[push] adding topics_name_unique constraint (one-time backfill)…",
    );
    await client.query(
      `ALTER TABLE topics ADD CONSTRAINT topics_name_unique UNIQUE (name)`,
    );
  } finally {
    await client.end();
  }
}

function runDrizzleKitPush(): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      "drizzle-kit",
      ["push", "--force", "--config", "./drizzle.config.ts"],
      {
        cwd: PKG_DIR,
        stdio: "inherit",
        env: process.env,
      },
    );
    child.on("error", reject);
    child.on("exit", (code) => resolve(code ?? 1));
  });
}

async function ensureConnectionRequestsPendingUnique(): Promise<void> {
  // Partial unique index on (requester_id, recipient_id) WHERE status='pending'
  // — drizzle-kit does not model partial indexes natively, so we add it here
  // after `drizzle-kit push` creates the connection_requests table. Without
  // this index two simultaneous POST /api/connections/requests calls could
  // race past the application-level duplicate check and create two pending
  // rows for the same pair. (task #67)
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    const tableExists = await client.query<{ exists: boolean }>(
      `SELECT EXISTS (
         SELECT 1 FROM information_schema.tables
         WHERE table_schema = 'public' AND table_name = 'connection_requests'
       ) AS exists`,
    );
    if (!tableExists.rows[0]?.exists) return;
    await client.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS connection_requests_pending_unique_idx
         ON connection_requests (requester_id, recipient_id)
         WHERE status = 'pending'`,
    );
  } finally {
    await client.end();
  }
}

async function main(): Promise<void> {
  await ensureTopicsNameUnique();
  const code = await runDrizzleKitPush();
  if (code === 0) {
    await ensureConnectionRequestsPendingUnique();
  }
  process.exit(code);
}

main().catch((err) => {
  console.error("[push] failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
