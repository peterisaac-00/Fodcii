import { Router } from "express";
import { optionalAuth } from "../middleware/auth.js";
import { resolveDbUser } from "../middleware/clerk-db-user.js";
import { submitRateLimit } from "../middleware/rate-limit.js";
import { executeCode } from "../lib/executor.js";
import { createPendingSubmission } from "../services/submission.service.js";
import { submissionQueue } from "../lib/submission-worker.js";
import { logger } from "../lib/logger.js";

const router = Router();

router.post("/code/run", async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    res.status(400).json({ error: "code and language are required" });
    return;
  }

  const supportedLanguages = ["python", "javascript", "cpp"];
  if (!supportedLanguages.includes(language)) {
    res.status(400).json({ error: `Unsupported language: ${language}` });
    return;
  }

  const result = await executeCode(language, code);

  let output: string;
  if (result.timedOut) {
    output = "⏱ Time Limit Exceeded (10s)\n";
    if (result.stdout) output += result.stdout;
  } else if (result.exitCode !== 0) {
    output = "";
    if (result.stdout) output += result.stdout + "\n";
    if (result.stderr) output += result.stderr;
    if (!output) output = `Process exited with code ${result.exitCode}`;
  } else {
    output = result.stdout;
    if (result.stderr) output += (output ? "\n" : "") + result.stderr;
    if (!output) output = "(no output)";
  }

  res.json({
    success: result.exitCode === 0 && !result.timedOut,
    output,
    executionTime: result.executionTimeMs,
    memoryUsed: null,
  });
});

router.post("/code/submit", optionalAuth, resolveDbUser, submitRateLimit, async (req, res) => {
  const { code, language, problemId } = req.body;

  if (!code || !language || !problemId) {
    res.status(400).json({ error: "code, language, and problemId are required" });
    return;
  }

  const supportedLanguages = ["python", "javascript", "cpp"];
  if (!supportedLanguages.includes(language)) {
    res.status(400).json({ error: `Unsupported language: ${language}` });
    return;
  }

  const parsedProblemId = parseInt(String(problemId), 10);
  if (isNaN(parsedProblemId)) {
    res.status(400).json({ error: "Invalid problemId" });
    return;
  }

  const userId = req.dbUserId ?? null;

  const submissionId = await createPendingSubmission({
    userId,
    problemId: parsedProblemId,
    code,
    language,
  });

  submissionQueue.enqueue({
    submissionId,
    problemId: parsedProblemId,
    code,
    language,
    userId,
  });

  logger.info(
    { submissionId, problemId: parsedProblemId, language, userId, requestId: req.requestId },
    "Submission enqueued"
  );

  res.status(202).json({
    submissionId,
    status: "pending",
    message: "Submission queued for evaluation",
    pollUrl: `/api/submissions/${submissionId}/status`,
  });
});

export default router;
