import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import problemsRouter from "./problems.js";
import leaderboardRouter from "./leaderboard.js";
import codeRouter from "./code.js";
import userRouter from "./user.js";
import metricsRouter from "./metrics.js";
import securityRouter from "./security.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(problemsRouter);
router.use(leaderboardRouter);
router.use(codeRouter);
router.use(userRouter);
router.use(metricsRouter);
router.use(securityRouter);

export default router;
