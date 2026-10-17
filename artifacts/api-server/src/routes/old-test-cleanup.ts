import { Router, type Request, type Response } from "express";
import { ExecuteOldTestCleanupBody, ExecuteOldTestCleanupResponse, PreviewOldTestCleanupResponse } from "@workspace/api-zod";
import { requireAdminCaller } from "../lib/isAdmin";
import { executeOldTestCleanup, previewOldTestCleanup } from "../lib/oldTestCleanup";
import { CleanupSafetyError } from "../lib/oldTestCleanupPolicy";

const router = Router();

function fail(req: Request, res: Response, error: unknown) {
  if (error instanceof CleanupSafetyError) {
    res.status(error.status).json({ error: error.message });
  } else {
    req.log.error({ err: error }, "Old test cleanup failed safely");
    res.status(503).json({ error: "Cleanup could not be safely completed. Refresh the preview and retry." });
  }
}

router.get("/users/test-cleanup/preview", async (req: Request, res: Response): Promise<void> => {
  const callerId = await requireAdminCaller(req, res);
  if (!callerId) return;
  try {
    res.set("Cache-Control", "no-store");
    res.json(PreviewOldTestCleanupResponse.parse(await previewOldTestCleanup(callerId)));
  } catch (error) { fail(req, res, error); }
});

router.post("/users/test-cleanup", async (req: Request, res: Response): Promise<void> => {
  const callerId = await requireAdminCaller(req, res);
  if (!callerId) return;
  const body = ExecuteOldTestCleanupBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "A fresh preview and confirmation are required." });
    return;
  }
  try {
    const result = await executeOldTestCleanup(callerId, body.data.confirmation, body.data.fingerprint);
    req.log.info({ deletedCount: result.deletedCount }, "Old test-account cleanup committed and verified");
    res.json(ExecuteOldTestCleanupResponse.parse(result));
  } catch (error) { fail(req, res, error); }
});

export default router;
