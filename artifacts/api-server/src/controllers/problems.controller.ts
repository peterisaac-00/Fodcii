import type { Request, Response } from "express";
import { z } from "zod";
import { listProblems, getProblemById, createProblem } from "../services/problems.service.js";
import { cache, TTL, TAGS } from "../lib/cache.js";

const createProblemSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  category: z.string().optional(),
  level: z.number().int().min(1).max(3).optional(),
  examples: z.array(z.unknown()).optional(),
  constraints: z.array(z.string()).optional(),
  starterCode: z.record(z.string()).optional(),
  testCases: z
    .array(
      z.object({
        input: z.string(),
        expectedOutput: z.string(),
        isSample: z.boolean().optional(),
      })
    )
    .min(1),
});

export async function getProblems(req: Request, res: Response) {
  const { level, category, difficulty, search } = req.query as Record<string, string | undefined>;
  const userId = req.dbUserId;

  const cacheKey = `problems:list:${userId ?? "anon"}:${level ?? ""}:${category ?? ""}:${difficulty ?? ""}:${search ?? ""}`;
  const cached = cache.get<unknown>(cacheKey);
  if (cached) {
    res.set("X-Cache", "HIT");
    res.json({ problems: cached });
    return;
  }

  try {
    const problems = await listProblems({ level, category, difficulty, search, userId });
    cache.set(cacheKey, problems, TTL.PROBLEMS_LIST, [TAGS.PROBLEMS]);
    res.set("X-Cache", "MISS");
    res.json({ problems });
  } catch (err: unknown) {
    const e = err as { message?: string };
    res.status(500).json({ error: e.message ?? "Failed to fetch problems" });
  }
}

export async function getProblem(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid problem ID" });
    return;
  }

  const userId = req.dbUserId;
  const cacheKey = `problems:detail:${userId ?? "anon"}:${id}`;
  const cached = cache.get<unknown>(cacheKey);
  if (cached) {
    res.set("X-Cache", "HIT");
    res.json({ problem: cached });
    return;
  }

  try {
    const problem = await getProblemById(id, userId);
    if (!problem) {
      res.status(404).json({ error: "Problem not found" });
      return;
    }
    cache.set(cacheKey, problem, TTL.PROBLEM_DETAIL, [TAGS.PROBLEMS]);
    res.set("X-Cache", "MISS");
    res.json({ problem });
  } catch (err: unknown) {
    const e = err as { message?: string };
    res.status(500).json({ error: e.message ?? "Failed to fetch problem" });
  }
}

export async function createProblemHandler(req: Request, res: Response) {
  const parsed = createProblemSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }

  try {
    const problem = await createProblem(parsed.data);
    cache.invalidateByTag(TAGS.PROBLEMS);
    res.status(201).json({ problem });
  } catch (err: unknown) {
    const e = err as { message?: string };
    res.status(500).json({ error: e.message ?? "Failed to create problem" });
  }
}
