import { Router, type IRouter } from "express";
import healthRouter from "./health";
import topicsRouter from "./topics";
import courseMasteryRouter from "./course-mastery";
import usersRouter from "./users";
import entitlementsRouter from "./entitlements";
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

// NOTE: every child router below is mounted with NO path prefix
// (`router.use(childRouter)`), so the routes they declare are reachable
// at exactly `/api/<their-literal-path>`. The route-auth matrix test in
// `test/routeAuthMatrix.test.ts` relies on this — if you ever mount a
// child router with a path (e.g. `router.use("/v2", v2Router)`) you must
// also add `{ v2Router: "/v2" }` to that test's `buildKnownPrefixes()`.
router.use(healthRouter);
router.use(topicsRouter);
router.use(courseMasteryRouter);
router.use(usersRouter);
router.use(entitlementsRouter);
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
