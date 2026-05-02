import { JobQueue } from "./job-queue.js";
import { judgeSubmission } from "./judge.js";
import {
  updateSubmissionResult,
  updateSubmissionStatus,
} from "../services/submission.service.js";
import { recordCompletedSubmission } from "../services/ranking.service.js";
import { metricsStore } from "./metrics-store.js";
import { cache, TAGS } from "./cache.js";
import { logger } from "./logger.js";
import type { Job } from "./job-queue.js";

export interface SubmissionJobData {
  submissionId: number;
  problemId: number;
  code: string;
  language: string;
  userId: number | null;
}

async function processSubmission(job: Job<SubmissionJobData>): Promise<void> {
  const { submissionId, problemId, code, language, userId } = job.data;

  logger.info({ submissionId, problemId, language, jobId: job.id }, "Processing submission");

  await updateSubmissionStatus(submissionId, "processing");

  const judgment = await judgeSubmission(problemId, language, code);

  const { passedTests, totalTests, success } = judgment;
  const status = success ? "accepted" : "wrong_answer";

  const testCasesJson = judgment.results.map((r) => ({
    description: r.description,
    input: r.input,
    expected: r.expected,
    actual: r.actual,
    passed: r.passed,
    stderr: r.stderr,
  }));

  // 1. Persist result to DB
  await updateSubmissionResult(submissionId, {
    status,
    passedTests,
    totalTests,
    testCasesJson,
  });

  // 2. Update ranking + problem stats atomically
  try {
    const { isFirstSolve, pointsAwarded } = await recordCompletedSubmission({
      userId,         // null for guests — only problem stats updated
      problemId,
      status,
      executionTime: null,
    });

    if (isFirstSolve) {
      logger.info(
        { submissionId, userId, problemId, pointsAwarded },
        "First solve — leaderboard updated"
      );
    }
  } catch (err) {
    logger.error({ err, submissionId, userId }, "Ranking update failed (non-fatal)");
  }

  // 3. Record API metric
  metricsStore.recordSubmission();

  // 4. Invalidate caches
  cache.invalidateByTag(TAGS.PROBLEMS);
  if (success) {
    cache.invalidateByTag(TAGS.LEADERBOARD);
  }

  logger.info(
    { submissionId, status, passedTests, totalTests, jobId: job.id },
    "Submission processed"
  );
}

export const submissionQueue = new JobQueue<SubmissionJobData>(processSubmission, {
  concurrency: 4,
  maxRetries: 3,
  retryBaseDelayMs: 2000,
});
