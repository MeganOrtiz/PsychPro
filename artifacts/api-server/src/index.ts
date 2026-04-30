import app from "./app";
import { logger } from "./lib/logger";
import { logResolvedClientErrorsRateLimit } from "./startup";
import { startClientErrorsRateLimitCleanup } from "./middlewares/clientErrorsRateLimit";

logResolvedClientErrorsRateLimit(logger);

// Schedule the recurring sweep that deletes hit/warning rows older than the
// sliding window. The interval is `unref()`ed inside, so it does not keep the
// process alive on its own.
startClientErrorsRateLimitCleanup(logger);

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
