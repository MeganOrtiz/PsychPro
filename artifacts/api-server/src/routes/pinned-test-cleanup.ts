import { Router, type Request, type Response } from "express";
import {
  ExecuteTargetedTestCleanupBody,
  ExecuteTargetedTestCleanupResponse,
  PreviewTargetedTestCleanupResponse,
} from "@workspace/api-zod";
import { requireInsightsOwner } from "../lib/isAdmin";
import {
  executePinnedTestCleanup,
  previewPinnedTestCleanup,
} from "../lib/targetedTestCleanup";
import { PinnedCleanupSafetyError } from "../lib/targetedTestCleanupPolicy";

function fail(req: Request, res: Response, error: unknown): void {
  if (error instanceof PinnedCleanupSafetyError) {
    res.status(error.status).json({ error: error.message });
    return;
  }
  // The underlying Clerk/DB error can contain pinned IDs or email addresses.
  // Log only a generic event; the response also avoids identity details.
  req.log.error({ safeFailure: true }, "Pinned test-account cleanup failed safely");
  res.status(503).json({
    error: "Cleanup could not be safely completed. Refresh the preview and retry.",
  });
}

export function createPinnedTestCleanupRouter(operations: {
  authorize?: typeof requireInsightsOwner;
  preview?: typeof previewPinnedTestCleanup;
  execute?: typeof executePinnedTestCleanup;
} = {}) {
const router = Router();
const authorize = operations.authorize ?? requireInsightsOwner;
const preview = operations.preview ?? previewPinnedTestCleanup;
const execute = operations.execute ?? executePinnedTestCleanup;

router.get("/users/targeted-test-cleanup/preview", async (req: Request, res: Response): Promise<void> => {
  const callerId = await authorize(req, res);
  if (!callerId) return;
  try {
    res.set("Cache-Control", "no-store");
    res.json(PreviewTargetedTestCleanupResponse.parse(await preview(callerId)));
  } catch (error) {
    fail(req, res, error);
  }
});

router.post("/users/targeted-test-cleanup", async (req: Request, res: Response): Promise<void> => {
  const callerId = await authorize(req, res);
  if (!callerId) return;
  const body = ExecuteTargetedTestCleanupBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "A fresh preview and exact confirmation are required." });
    return;
  }
  try {
    res.set("Cache-Control", "no-store");
    const result = await execute(
      callerId,
      body.data.confirmation,
      body.data.fingerprint,
    );
    req.log.info({
      deletedCount: result.deletedCount,
      identityOnlyCount: result.identityOnlyCount,
      blockedCount: result.blockedCount,
      failedCount: result.failedCount,
    }, "Pinned test-account cleanup completed with verified aggregate results");
    res.json(ExecuteTargetedTestCleanupResponse.parse(result));
  } catch (error) {
    fail(req, res, error);
  }
});

return router;
}

export default createPinnedTestCleanupRouter();
