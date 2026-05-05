import app from "./app";
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
});
