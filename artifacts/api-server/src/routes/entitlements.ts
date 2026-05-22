import { Router, type Request, type Response } from "express";
import { requireUserId } from "../lib/userId";
import { getEntitlements } from "../lib/entitlements";

const router = Router();

router.get("/users/entitlements", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const ent = await getEntitlements(userId);
    res.json(ent);
  } catch (err) {
    req.log.error({ err }, "Error getting entitlements");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
