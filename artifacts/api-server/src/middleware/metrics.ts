import type { Request, Response, NextFunction } from "express";
import { metricsStore } from "../lib/metrics-store.js";

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const latencyMs = Date.now() - start;
    const path = req.route?.path ?? req.path ?? "unknown";

    metricsStore.recordRequest({
      method: req.method,
      path,
      statusCode: res.statusCode,
      latencyMs,
    });
  });

  next();
}
