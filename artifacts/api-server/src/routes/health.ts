import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import {
  clientErrorsRateLimitConfig,
  clientErrorsRateLimitCleanupConfig,
} from "../middlewares/clientErrorsRateLimit";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  // The `config` block lets operators curl a deployed instance to confirm
  // their CLIENT_ERRORS_RATE_LIMIT_{WINDOW_MS,MAX,CLEANUP_INTERVAL_MS}
  // overrides took effect, without having to exhaust the limit and watch
  // for 429s or grep the boot log.
  const data = HealthCheckResponse.parse({
    status: "ok",
    config: {
      clientErrorsRateLimit: clientErrorsRateLimitConfig,
      clientErrorsRateLimitCleanup: clientErrorsRateLimitCleanupConfig,
    },
  });
  res.json(data);
});

export default router;
