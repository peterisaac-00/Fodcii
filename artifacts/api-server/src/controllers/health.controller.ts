import type { Request, Response } from "express";
import { pool } from "@workspace/db";
import { metricsStore } from "../lib/metrics-store.js";

export async function healthCheck(_req: Request, res: Response) {
  const checks: Record<string, unknown> = {};
  let overallStatus: "healthy" | "degraded" | "unhealthy" = "healthy";

  const dbStart = Date.now();
  try {
    await pool.query("SELECT 1");
    checks.database = {
      status: "healthy",
      latencyMs: Date.now() - dbStart,
    };
  } catch (err) {
    overallStatus = "unhealthy";
    checks.database = {
      status: "unhealthy",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }

  const snap = metricsStore.getSnapshot();
  checks.api = {
    status: "healthy",
    uptimeSeconds: snap.uptimeSeconds,
    totalRequests: snap.totalRequests,
    averageResponseTimeMs: snap.averageResponseTimeMs,
  };

  checks.judgeEngine = {
    status: "simulated",
    note: "Judge engine is in mock mode — real execution engine not yet connected",
  };

  const statusCode = overallStatus === "unhealthy" ? 503 : 200;

  res.status(statusCode).json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? "0.0.0",
    environment: process.env.NODE_ENV ?? "development",
    checks,
  });
}
