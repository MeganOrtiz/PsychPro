import type { Logger } from "pino";
import { clientErrorsRateLimitConfig } from "./middlewares/clientErrorsRateLimit";

// The exact `msg` field emitted by `logResolvedClientErrorsRateLimit` below.
// Exported so the test that locks in this contract can assert against it
// without re-spelling the string (a typo would otherwise silently let the
// test pass against the wrong message).
export const RESOLVED_CLIENT_ERRORS_RATE_LIMIT_LOG_MSG =
  "Resolved client-error rate limit";

// Log the resolved client-error rate limit once at startup so an operator who
// set CLIENT_ERRORS_RATE_LIMIT_{WINDOW_MS,MAX} can confirm the override took
// effect without having to exhaust the limit and watch for 429s. The same
// values are also returned from `GET /api/healthz` for remote verification.
//
// Extracted from `index.ts` so the boot-time emission can be exercised by an
// in-process test (see `test/healthz.test.ts`) without spawning a server.
export function logResolvedClientErrorsRateLimit(logger: Logger): void {
  logger.info(
    { clientErrorsRateLimit: clientErrorsRateLimitConfig },
    RESOLVED_CLIENT_ERRORS_RATE_LIMIT_LOG_MSG,
  );
}
