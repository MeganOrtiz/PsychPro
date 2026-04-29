import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { clientErrorsRateLimitConfig } from "../middlewares/clientErrorsRateLimit";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  // The `config` block lets operators curl a deployed instance to confirm
  // their CLIENT_ERRORS_RATE_LIMIT_{WINDOW_MS,MAX} overrides took effect,
  // without having to exhaust the limit and watch for 429s.
  const data = HealthCheckResponse.parse({
    status: "ok",
    config: {
      clientErrorsRateLimit: clientErrorsRateLimitConfig,
    },
  });
  res.json(data);
});

export default router;
