import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { readRateLimit } from "../middleware/rate-limit.js";
import {
  getLeaderboard,
  findUserStanding,
  getDailyStats,
} from "../services/ranking.service.js";

const router = Router();

function parsePositiveInt(val: unknown, defaultVal: number, max: number): number {
  const n = parseInt(String(val), 10);
  if (isNaN(n) || n < 0) return defaultVal;
  return Math.min(n, max);
}

router.get("/leaderboard", readRateLimit, async (req, res) => {
  try {
    const limit = parsePositiveInt(req.query.limit, 50, 200);
    const offset = parsePositiveInt(req.query.offset, 0, 100_000);

    const [{ entries, total }, stats] = await Promise.all([
      getLeaderboard({ limit, offset }),
      getDailyStats(),
    ]);

    const leaderboard = entries.map((e) => ({
      id: e.userId,
      rank: e.rank,
      name: e.username,
      avatar: "/diverse-user-avatars.png",
      solvedProblems: e.solvedCount,
      totalProblems: stats.totalUsers > 0 ? undefined : 0,
      points: e.totalScore,
      totalScore: e.totalScore,
      solvedCount: e.solvedCount,
      totalSubmissions: e.totalSubmissions,
      streak: e.streak,
      level: e.level,
    }));

    res.json({
      leaderboard,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      stats,
    });
  } catch (err: unknown) {
    const e = err as { message?: string };
    res.status(500).json({ error: e.message ?? "Failed to fetch leaderboard" });
  }
});

router.get("/leaderboard/me", requireAuth, readRateLimit, async (req, res) => {
  const userId = req.user!.sub;

  try {
    const standing = await findUserStanding(userId);

    if (!standing) {
      res.json({
        rank: null,
        message: "No submissions yet — make your first accepted submission to appear on the leaderboard!",
        userId,
      });
      return;
    }

    res.json({
      rank: standing.rank,
      userId: standing.userId,
      username: standing.username,
      totalScore: standing.totalScore,
      solvedCount: standing.solvedCount,
      totalSubmissions: standing.totalSubmissions,
      streak: standing.streak,
      level: standing.level,
    });
  } catch (err: unknown) {
    const e = err as { message?: string };
    res.status(500).json({ error: e.message ?? "Failed to fetch ranking" });
  }
});

router.get("/leaderboard/user/:id", readRateLimit, async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  try {
    const standing = await findUserStanding(userId);
    if (!standing) {
      res.status(404).json({ error: "User not found or has no submissions" });
      return;
    }

    res.json({
      user: {
        id: standing.userId,
        rank: standing.rank,
        name: standing.username,
        avatar: "/diverse-user-avatars.png",
        solvedProblems: standing.solvedCount,
        points: standing.totalScore,
        totalScore: standing.totalScore,
        totalSubmissions: standing.totalSubmissions,
        streak: standing.streak,
        level: standing.level,
      },
    });
  } catch (err: unknown) {
    const e = err as { message?: string };
    res.status(500).json({ error: e.message ?? "Failed to fetch user" });
  }
});

export default router;
