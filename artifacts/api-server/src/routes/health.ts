import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { healthCheck } from "../controllers/health.controller.js";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

router.get("/health", healthCheck);

export default router;
