// Initialize Sentry BEFORE any other module so its error/rejection handlers
// are installed as early as possible. No-ops when SENTRY_DSN_BACKEND is unset.
import "./instrument";
import app from "./app";
import {
  db,
  backfillCoursesFromTopics,
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
  void backfillCoursesFromTopics(db)
    .then((result) =>
      logger.info(
        result,
        result.skipped
          ? "Course backfill: already up to date"
          : "Course backfill complete",
      ),
    )
    .catch((err) => logger.error({ err }, "Course backfill failed"));

  // Correct the EPPP full-length exam time budgets (255 min stored as 255 sec).
  // Idempotent and race-safe; the ONLY path that fixes the production data.
  void backfillFullLengthExamTime(db)
    .then((result) =>
      logger.info(
        result,
        result.skipped
          ? "Full-length exam time backfill: already up to date"
          : "Full-length exam time backfill complete",
      ),
    )
    .catch((err) =>
      logger.error({ err }, "Full-length exam time backfill failed"),
    );
});
