import { Router, type Request, type Response } from "express";
import { GetEpppPromoResponse, RedeemEpppPromoBody, RedeemEpppPromoResponse } from "@workspace/api-zod";
import { getEpppPromoState, redeemEpppPromo } from "../lib/epppPromo";
import { requireUserId } from "../lib/userId";

const router = Router();

router.get("/eppp/promo", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const state = await getEpppPromoState(userId);
    res.json(GetEpppPromoResponse.parse(state));
  } catch (err) {
    req.log.error({ err }, "Error getting EPPP promo state");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/eppp/promo/redeem", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const body = RedeemEpppPromoBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "A promotion code is required" });
      return;
    }

    const result = await redeemEpppPromo(userId, body.data.code);
    if (result.kind === "invalid") {
      res.status(400).json({ error: "Invalid EPPP promotion code" });
      return;
    }
    if (result.kind === "already-redeemed") {
      res.status(409).json({
        error: "EPPP7 has already been redeemed on this account and can only be used once.",
      });
      return;
    }
    res.json(RedeemEpppPromoResponse.parse(result.state));
  } catch (err) {
    req.log.error({ err }, "Error redeeming EPPP promo");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;