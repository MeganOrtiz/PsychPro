import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Autoscale runs multiple server instances, each with its own pool. Cap the
  // per-instance connection count so N instances stay comfortably under
  // Postgres' max_connections ceiling under heavy traffic. Override via env if
  // the deployment is scaled differently.
  max: Number(process.env.PG_POOL_MAX ?? 8),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  // Keep idle TCP connections alive. Serverless Postgres and connection
  // proxies silently drop idle sockets, which surfaces as "Connection
  // terminated unexpectedly" on the next query. TCP keepalive probes keep the
  // socket warm so pooled clients stay usable between bursts of traffic.
  keepAlive: true,
});

// A pooled client can emit 'error' while it is idle — e.g. the database or a
// connection proxy drops an idle connection. pg surfaces this as an 'error'
// event on the Pool; with no listener attached, Node treats it as an unhandled
// error event and crashes the whole process. Log it and let the pool discard
// the dead client: the next acquire transparently opens a fresh connection.
pool.on("error", (err) => {
  console.error(
    "[db] idle pooled client error (connection will be recycled):",
    err instanceof Error ? err.message : err,
  );
});

export const db = drizzle(pool, { schema });

export * from "./schema";
export * from "./backfill-courses-core";
export * from "./backfill-foundations-topics-core";
export * from "./backfill-full-length-exam-time-core";
