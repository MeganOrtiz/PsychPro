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
});
export const db = drizzle(pool, { schema });

export * from "./schema";
export * from "./backfill-courses-core";
export * from "./backfill-full-length-exam-time-core";
