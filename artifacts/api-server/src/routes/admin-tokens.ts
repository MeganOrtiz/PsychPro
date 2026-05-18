import { Router, type Request, type Response } from "express";
import { requireOwner, isAdminSecretConfigured } from "../lib/requireAdmin";
import { createToken, listTokens, revokeToken } from "../lib/adminTokens";

const router = Router();

// Public, no-auth status endpoint so the UI can render a "server not
// configured" banner when MCP_ADMIN_SECRET is missing. Reveals only a boolean.
router.get("/admin/status", (_req: Request, res: Response) => {
  res.json({ secretConfigured: isAdminSecretConfigured() });
});

router.get("/admin/tokens", async (req: Request, res: Response): Promise<void> => {
  try {
    const owner = await requireOwner(req, res);
    if (!owner) return;
    const tokens = await listTokens();
    res.json(tokens);
  } catch (err) {
    req.log.error({ err }, "Error listing admin tokens");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/tokens", async (req: Request, res: Response): Promise<void> => {
  try {
    const owner = await requireOwner(req, res);
    if (!owner) return;
    const rawLabel = typeof req.body?.label === "string" ? req.body.label.trim() : "";
    const label = rawLabel.length > 0 ? rawLabel.slice(0, 80) : "Claude Desktop";
    const created = await createToken(label);
    res.status(201).json(created);
  } catch (err) {
    req.log.error({ err }, "Error creating admin token");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/tokens/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const owner = await requireOwner(req, res);
    if (!owner) return;
    const id = parseInt(String(req.params.id), 10);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid token id" });
      return;
    }
    const ok = await revokeToken(id);
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
