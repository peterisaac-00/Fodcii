import type { Request, Response } from "express";
import { metricsStore } from "../lib/metrics-store.js";

export function getMetrics(_req: Request, res: Response) {
  const snapshot = metricsStore.getSnapshot();
  res.json({
    timestamp: new Date().toISOString(),
    metrics: snapshot,
  });
}
