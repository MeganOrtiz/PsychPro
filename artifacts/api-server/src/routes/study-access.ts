import { Router } from "express";
import { requireUserId } from "../lib/userId";
import { getStudyAccess, startStudyTrial, StudyAccessError } from "../lib/studyAccess";
const router = Router();

router.get("/subscription/access", async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;
  try { res.json(await getStudyAccess(userId)); }
  catch (err) { req.log.error({ err }, "Unable to load study access"); res.status(500).json({ error: "Unable to load study access." }); }
});

router.post("/subscription/trials/:suite", async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;
  const suite = req.params.suite;
  if (suite !== "psychpro" && suite !== "eppp") { res.status(400).json({ error: "Invalid suite." }); return; }
  try { res.json(await startStudyTrial(userId, suite)); }
  catch (err) {
    if (err instanceof StudyAccessError) { res.status(err.status).json({ error: err.message, code: err.code }); return; }
    req.log.error({ err }, "Unable to start trial"); res.status(500).json({ error: "Unable to start your trial. Please retry." });
  }
});
export default router;
