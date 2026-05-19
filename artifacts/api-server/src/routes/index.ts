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
router.use(adminTokensRouter);
router.use(mcpRouter);
router.use(oauthRouter);

export default router;
