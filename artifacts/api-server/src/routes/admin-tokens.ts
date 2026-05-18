import { Router, type Request, type Response } from "express";
import { requireAdminUserId } from "../lib/requireAdmin";
import { createToken, listTokens, revokeToken } from "../lib/adminTokens";

const router = Router();

router.get("/admin/tokens", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = await requireAdminUserId(req, res);
    if (!userId) return;
    const tokens = await listTokens(userId);
    res.json(tokens);
  } catch (err) {
    req.log.error({ err }, "Error listing admin tokens");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/tokens", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = await requireAdminUserId(req, res);
    if (!userId) return;
    const rawLabel = typeof req.body?.label === "string" ? req.body.label.trim() : "";
    const label = rawLabel.length > 0 ? rawLabel.slice(0, 80) : "Claude Desktop";
    const created = await createToken(userId, label);
    res.status(201).json(created);
  } catch (err) {
    req.log.error({ err }, "Error creating admin token");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/tokens/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = await requireAdminUserId(req, res);
    if (!userId) return;
    const id = parseInt(String(req.params.id), 10);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid token id" });
      return;
    }
    const ok = await revokeToken(userId, id);
    if (!ok) {
      res.status(404).json({ error: "Token not found" });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Error revoking admin token");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
