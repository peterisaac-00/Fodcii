import { Router } from "express";
import {
  getProblems,
  getProblem,
  createProblemHandler,
} from "../controllers/problems.controller.js";
import { requireAuth, requireAdmin, optionalAuth } from "../middleware/auth.js";
import { resolveDbUser } from "../middleware/clerk-db-user.js";
import { readRateLimit } from "../middleware/rate-limit.js";

const router = Router();

router.get("/problems", readRateLimit, optionalAuth, resolveDbUser, getProblems);
router.get("/problems/:id", readRateLimit, optionalAuth, resolveDbUser, getProblem);
router.post("/problems", requireAuth, requireAdmin, createProblemHandler);

export default router;
