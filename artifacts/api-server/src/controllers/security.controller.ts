import type { Request, Response } from "express";
import { runSecurityTests } from "../services/security.service.js";
import { logger } from "../lib/logger.js";

let cachedReport: Awaited<ReturnType<typeof runSecurityTests>> | null = null;
let cacheExpiresAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function getSecurityReport(req: Request, res: Response) {
  const forceRefresh = req.query.refresh === "true";

  if (!forceRefresh && cachedReport && Date.now() < cacheExpiresAt) {
    res.json({ cached: true, ...cachedReport });
    return;
  }

  logger.info({ requestId: req.requestId }, "Running security test suite...");

  try {
    const report = await runSecurityTests();
    cachedReport = report;
    cacheExpiresAt = Date.now() + CACHE_TTL_MS;

    logger.info(
      { requestId: req.requestId, overallRisk: report.overallRisk, vulnerable: report.vulnerable },
      "Security report generated"
    );

    res.json({ cached: false, ...report });
  } catch (err) {
    logger.error({ err, requestId: req.requestId }, "Security report generation failed");
    res.status(500).json({ error: "Failed to run security tests" });
  }
}
