import { Router, type IRouter } from "express";
import healthRouter from "./health";
import topicsRouter from "./topics";
import usersRouter from "./users";
import progressRouter from "./progress";
import subscriptionRouter from "./subscription";
import feedbackRouter from "./feedback";

const router: IRouter = Router();

router.use(healthRouter);
router.use(topicsRouter);
router.use(usersRouter);
router.use(progressRouter);
router.use(subscriptionRouter);
router.use(feedbackRouter);

export default router;
