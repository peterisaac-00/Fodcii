import { Router } from "express";
import { getSecurityReport } from "../controllers/security.controller.js";

const router = Router();

router.get("/security/report", getSecurityReport);

export default router;
