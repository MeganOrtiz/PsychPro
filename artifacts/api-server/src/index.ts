import app from "./app";
import { logger } from "./lib/logger";
import { clientErrorsRateLimitConfig } from "./middlewares/clientErrorsRateLimit";

// Log resolved tunables once at startup so an operator who set
// CLIENT_ERRORS_RATE_LIMIT_{WINDOW_MS,MAX} can confirm the override took
// effect without exhausting the limit and watching for 429s. The same values
// are also returned from `GET /api/healthz` for remote verification.
logger.info(
  { clientErrorsRateLimit: clientErrorsRateLimitConfig },
  "Resolved client-error rate limit",
);

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
