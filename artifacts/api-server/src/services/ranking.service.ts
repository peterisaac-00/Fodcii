import { eq, desc, asc, sql, count, countDistinct } from "drizzle-orm";
import {
  db,
  usersTable,
  userStatsTable,
  userFirstSolvesTable,
  submissionsTable,
  problemsTable,
} from "@workspace/db";
import { cache, TTL, TAGS } from "../lib/cache.js";
import { logger } from "../lib/logger.js";

export const POINTS_PER_SOLVE = 100;

const RANKED_CACHE_KEY = "leaderboard:ranked";
const STATS_CACHE_KEY = "leaderboard:stats";

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  totalScore: number;
  solvedCount: number;
  totalSubmissions: number;
  streak: number;
  level: string;
  updatedAt: Date | null;
}

export interface DailyStats {
  totalUsers: number;
  activeToday: number;
  problemsSolvedToday: number;
  averageProblems: number;
}

function getLevel(score: number): string {
  if (score >= 2000) return "Expert";
  if (score >= 1500) return "Advanced";
  if (score >= 500) return "Intermediate";
  return "Beginner";
}

function computeNewStreak(lastActivityDate: string | null, currentStreak: number): number {
  if (!lastActivityDate) return 1;
  const today = new Date().toISOString().split("T")[0]!;
  const diffDays = Math.floor(
    (new Date(today).getTime() - new Date(lastActivityDate).getTime()) / 86_400_000
  );
  if (diffDays === 0) return currentStreak;
  if (diffDays === 1) return currentStreak + 1;
  return 1;
}

/** Fetches and caches the full ranked list. Used by all leaderboard functions. */
async function getAllRanked(): Promise<LeaderboardEntry[]> {
  const cached = cache.get<LeaderboardEntry[]>(RANKED_CACHE_KEY);
  if (cached) return cached;

  const rows = await db
    .select({
      userId: usersTable.id,
      username: usersTable.username,
      totalScore: sql<number>`COALESCE(${userStatsTable.points}, 0)`,
      solvedCount: sql<number>`COALESCE(${userStatsTable.solvedCount}, 0)`,
      totalSubmissions: sql<number>`COALESCE(${userStatsTable.totalSubmissions}, 0)`,
      streak: sql<number>`COALESCE(${userStatsTable.currentStreak}, 0)`,
      updatedAt: userStatsTable.updatedAt,
    })
    .from(usersTable)
    .leftJoin(userStatsTable, eq(userStatsTable.userId, usersTable.id))
    .where(sql`${usersTable.role} = 'user'`)
    .orderBy(
      desc(sql`COALESCE(${userStatsTable.points}, 0)`),
      desc(sql`COALESCE(${userStatsTable.solvedCount}, 0)`),
      asc(sql`COALESCE(${userStatsTable.updatedAt}, NOW() + interval '1 year')`)
    );

  const ranked: LeaderboardEntry[] = rows.map((row, index) => ({
    rank: index + 1,
    userId: row.userId,
    username: row.username,
    totalScore: Number(row.totalScore),
    solvedCount: Number(row.solvedCount),
    totalSubmissions: Number(row.totalSubmissions),
    streak: Number(row.streak),
    level: getLevel(Number(row.totalScore)),
    updatedAt: row.updatedAt,
  }));

  cache.set(RANKED_CACHE_KEY, ranked, TTL.LEADERBOARD, [TAGS.LEADERBOARD]);
  return ranked;
}

/**
 * Paginated leaderboard from cache.
 */
export async function getLeaderboard(params: {
  limit: number;
  offset: number;
}): Promise<{ entries: LeaderboardEntry[]; total: number }> {
  const all = await getAllRanked();
  return {
    entries: all.slice(params.offset, params.offset + params.limit),
    total: all.length,
  };
}

/**
 * Returns a specific user's standing from the cached leaderboard.
 * Returns null if the user has no submissions yet.
 */
export async function findUserStanding(userId: number): Promise<LeaderboardEntry | null> {
  const all = await getAllRanked();
  return all.find((e) => e.userId === userId) ?? null;
}

/**
 * Platform-wide daily stats (cached separately).
 */
export async function getDailyStats(): Promise<DailyStats> {
  const cached = cache.get<DailyStats>(STATS_CACHE_KEY);
  if (cached) return cached;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [[totalUsersRow], [activeTodayRow], [solvedTodayRow], all] = await Promise.all([
    db.select({ count: count() }).from(usersTable).where(sql`${usersTable.role} = 'user'`),
    db
      .select({ count: countDistinct(submissionsTable.userId) })
      .from(submissionsTable)
      .where(sql`${submissionsTable.createdAt} >= ${todayStart}`),
    db
      .select({ count: countDistinct(submissionsTable.problemId) })
      .from(submissionsTable)
      .where(
        sql`${submissionsTable.createdAt} >= ${todayStart}
          AND ${submissionsTable.status} = 'accepted'`
      ),
    getAllRanked(),
  ]);

  const totalUsers = Number(totalUsersRow?.count ?? 0);
  const activeToday = Number(activeTodayRow?.count ?? 0);
  const problemsSolvedToday = Number(solvedTodayRow?.count ?? 0);
  const totalSolved = all.reduce((sum, e) => sum + e.solvedCount, 0);
  const averageProblems = totalUsers > 0 ? Math.round(totalSolved / totalUsers) : 0;

  const stats: DailyStats = { totalUsers, activeToday, problemsSolvedToday, averageProblems };
  cache.set(STATS_CACHE_KEY, stats, TTL.LEADERBOARD_STATS, [TAGS.LEADERBOARD]);
  return stats;
}

/**
 * Atomically records a completed submission and updates rankings.
 *
 * For authenticated users:
 *  - Tries to claim first-solve via UNIQUE(user_id, problem_id) — DB-level race safety
 *  - Awards POINTS_PER_SOLVE (100) on first solve only
 *  - Upserts user_stats (points, solvedCount, totalSubmissions, streak)
 *  - Updates problem submissionsCount + acceptanceRate
 *
 * For guest submissions (userId = null):
 *  - Only updates problem stats
 */
export async function recordCompletedSubmission(params: {
  userId: number | null;
  problemId: number;
  status: string;
  executionTime?: number | null;
}): Promise<{ isFirstSolve: boolean; pointsAwarded: number }> {
  const { userId, problemId, status, executionTime } = params;
  const isAccepted = status === "accepted";
  const today = new Date().toISOString().split("T")[0]!;

  let isFirstSolve = false;
  let pointsAwarded = 0;

  await db.transaction(async (tx) => {
    if (userId != null) {
      // ── Step 1: Claim first-solve slot (atomic, idempotent) ──────────────
      if (isAccepted) {
        const claimed = await tx
          .insert(userFirstSolvesTable)
          .values({ userId, problemId, executionTime: executionTime ?? null })
          .onConflictDoNothing()
          .returning({ id: userFirstSolvesTable.id });

        isFirstSolve = claimed.length > 0;
        pointsAwarded = isFirstSolve ? POINTS_PER_SOLVE : 0;
      }

      // ── Step 2: Read current streak for computation ──────────────────────
      const [existing] = await tx
        .select({
          currentStreak: userStatsTable.currentStreak,
          longestStreak: userStatsTable.longestStreak,
          lastActivityDate: userStatsTable.lastActivityDate,
        })
        .from(userStatsTable)
        .where(eq(userStatsTable.userId, userId))
        .limit(1);

      const newStreak = isAccepted
        ? computeNewStreak(existing?.lastActivityDate ?? null, existing?.currentStreak ?? 0)
        : (existing?.currentStreak ?? 0);
      const newLongest = Math.max(existing?.longestStreak ?? 0, newStreak);

      // ── Step 3: Upsert user_stats atomically ─────────────────────────────
      await tx
        .insert(userStatsTable)
        .values({
          userId,
          points: pointsAwarded,
          solvedCount: isFirstSolve ? 1 : 0,
          totalSubmissions: 1,
          currentStreak: isAccepted ? 1 : 0,
          longestStreak: isAccepted ? 1 : 0,
          lastActivityDate: isAccepted ? today : null,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: userStatsTable.userId,
          set: {
            totalSubmissions: sql`${userStatsTable.totalSubmissions} + 1`,
            ...(pointsAwarded > 0 && {
              points: sql`${userStatsTable.points} + ${pointsAwarded}`,
            }),
            ...(isFirstSolve && {
              solvedCount: sql`${userStatsTable.solvedCount} + 1`,
            }),
            ...(isAccepted && {
              currentStreak: newStreak,
              longestStreak: newLongest,
              lastActivityDate: today,
              updatedAt: isFirstSolve ? new Date() : userStatsTable.updatedAt,
            }),
          },
        });
    }

    // ── Step 4: Update problem stats (all submissions, including guests) ───
    await tx
      .update(problemsTable)
      .set({
        submissionsCount: sql`${problemsTable.submissionsCount} + 1`,
        acceptanceRate: sql`COALESCE((
          SELECT ROUND(
            COUNT(CASE WHEN status = 'accepted' THEN 1 END) * 100.0
              / NULLIF(COUNT(*), 0),
            2
          )
          FROM submissions
          WHERE problem_id = ${problemId}
            AND status NOT IN ('pending', 'processing')
        ), 0)`,
      })
      .where(eq(problemsTable.id, problemId));
  });

  logger.info(
    { userId, problemId, isFirstSolve, pointsAwarded, status },
    "Ranking updated"
  );

  return { isFirstSolve, pointsAwarded };
}
