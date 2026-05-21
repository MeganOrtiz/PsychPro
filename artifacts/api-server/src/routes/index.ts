import { Router, type IRouter } from "express";
import healthRouter from "./health";
import topicsRouter from "./topics";
import usersRouter from "./users";
import progressRouter from "./progress";
import subscriptionRouter from "./subscription";
import feedbackRouter from "./feedback";
import customDecksRouter from "./custom-decks";
import leaderboardRouter from "./leaderboard";
import clientErrorsRouter from "./client-errors";
import adminTokensRouter from "./admin-tokens";
import mcpRouter from "./mcp";
import oauthRouter from "./oauth";
import storageRouter from "./storage";
import profileRouter from "./profile";
import featuredWorkRouter from "./featured-work";
import connectionsRouter from "./connections";
import { MCP_ENABLED } from "../lib/mcpEnabled";

const router: IRouter = Router();

router.use(healthRouter);
router.use(topicsRouter);
router.use(usersRouter);
router.use(progressRouter);
router.use(subscriptionRouter);
router.use(feedbackRouter);
router.use(customDecksRouter);
router.use(leaderboardRouter);
router.use(clientErrorsRouter);
// Gate the MCP HTTP route, its OAuth discovery endpoints, and the
// admin-token issuer (which exists solely to mint per-Claude bearer
// tokens) behind `MCP_ENABLED`. Deployments that don't ship the Claude
// integration can turn all three surfaces off without removing the code.
// Default is on — see `lib/mcpEnabled.ts`.
if (MCP_ENABLED) {
  router.use(adminTokensRouter);
  router.use(mcpRouter);
  router.use(oauthRouter);
}
router.use(storageRouter);
router.use(profileRouter);
router.use(featuredWorkRouter);
router.use(connectionsRouter);

export default router;
