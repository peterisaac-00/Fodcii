import { Router } from "express";
import { me } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { resolveDbUser } from "../middleware/clerk-db-user.js";

const router = Router();

router.get("/auth/me", requireAuth, resolveDbUser, me);

export default router;
