// Initialize Sentry BEFORE any other module so its error/rejection handlers
// are installed as early as possible. No-ops when SENTRY_DSN_BACKEND is unset.
import "./instrument";
import app from "./app";
import {
  db,
  backfillCoursesFromTopics,
  backfillFoundationsPlaceholders,
  backfillFullLengthExamTime,
} from "@workspace/db";
import { logger } from "./lib/logger";
import { logResolvedClientErrorsRateLimit } from "./startup";
import { startClientErrorsRateLimitCleanup } from "./middlewares/clientErrorsRateLimit";

logResolvedClientErrorsRateLimit(logger);

// Schedule the recurring sweep that deletes hit/warning rows older than the
// sliding window. The interval is `unref()`ed inside, so it does not keep the
// process alive on its own.
startClientErrorsRateLimitCleanup(logger);

const port = Number(process.env.PORT) || 8080;

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${process.env.PORT}"`);
}

// Run an idempotent startup task with exponential backoff. On a cold start the
// database (or its connection proxy) may not accept connections within the
// pool's connectionTimeoutMillis window, which previously caused the one-shot
// backfills to fail permanently for that instance. Because every backfill is
// idempotent and race-safe, retrying any failure is safe and lets transient
// boot-time connection timeouts heal on their own.
async function runStartupTaskWithRetry<T>(
  label: string,
  task: () => Promise<T>,
  attempts = 5,
): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await task();
    } catch (err) {
      lastErr = err;
      if (attempt < attempts) {
        // Exponential backoff with full jitter. The jitter desynchronizes
        // retries across the many autoscale instances that all cold-start
        // against the same database, so a brownout does not trigger a
        // synchronized thundering-herd of reconnects.
        const cappedBackoffMs = Math.min(1_000 * 2 ** (attempt - 1), 15_000);
        const nextDelayMs = Math.round(Math.random() * cappedBackoffMs);
        logger.warn(
          { err, attempt, attempts, nextDelayMs },
          `${label} attempt failed; retrying`,
        );
        await new Promise((resolve) => setTimeout(resolve, nextDelayMs));
      }
    }
  }
  throw lastErr;
}

app.listen(port, "0.0.0.0", (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  // After the server is accepting connections, ensure the `courses` lookup
  // table is populated from existing topic categories. This is DATA seeding —
  // the `courses` table and `topics.course_id` column themselves are created by
  // Replit's publish-time schema flow, never here. It is idempotent and
  // race-safe across autoscale instances. Running it here is the ONLY way
  // production gets its courses, because the production database is read-only to
  // tooling and seed.ts never runs in production. Run in the background so it
  // never delays readiness or the startup health check; failures are logged but
  // do not take the server down.
  // Seed the main-site "Foundations" course placeholder lessons, THEN run the
  // course backfill (chained) so the new "Foundations" course row is created and
  // its topics linked in the same boot. Both are idempotent and race-safe, and
  // this startup hook is the ONLY path that seeds production (the prod DB is
  // read-only to tooling and seed.ts never runs in production).
  void runStartupTaskWithRetry("Foundations placeholders backfill", () =>
    backfillFoundationsPlaceholders(db),
  )
    .then((result) =>
      logger.info(
        result,
        result.skipped
          ? "Foundations placeholders: already up to date"
          : "Foundations placeholders complete",
      ),
    )
    .catch((err) =>
      logger.error(
        { err },
        "Foundations placeholders backfill failed after retries",
      ),
    )
    .finally(() => {
      void runStartupTaskWithRetry("Course backfill", () =>
        backfillCoursesFromTopics(db),
      )
        .then((result) =>
          logger.info(
            result,
            result.skipped
              ? "Course backfill: already up to date"
              : "Course backfill complete",
          ),
        )
        .catch((err) =>
          logger.error({ err }, "Course backfill failed after retries"),
        );
    });

  // Correct the EPPP full-length exam time budgets (255 min stored as 255 sec).
  // Idempotent and race-safe; the ONLY path that fixes the production data.
  void runStartupTaskWithRetry("Full-length exam time backfill", () =>
    backfillFullLengthExamTime(db),
  )
    .then((result) =>
      logger.info(
        result,
        result.skipped
          ? "Full-length exam time backfill: already up to date"
          : "Full-length exam time backfill complete",
      ),
    )
    .catch((err) =>
      logger.error(
        { err },
        "Full-length exam time backfill failed after retries",
      ),
    );
});
