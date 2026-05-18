import { Router, type Request, type Response } from "express";
import { requireAdminUserId, getOwnerUserId } from "../lib/requireAdmin";
import { createToken, listTokens, revokeToken } from "../lib/adminTokens";
import { getUserId } from "../lib/userId";

const router = Router();

// Unauthenticated helper so the owner can see *their* current user id from
// the UI (the value they need to put in OWNER_USER_ID) and whether ownership
// is already configured. Does NOT reveal whose id is configured.
router.get("/admin/owner-status", (req: Request, res: Response) => {
  const ownerId = getOwnerUserId();
  const callerId = getUserId(req);
  res.json({
    callerUserId: callerId,
    ownerConfigured: Boolean(ownerId),
    callerIsOwner: Boolean(ownerId && callerId && ownerId === callerId),
  });
});

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
