import { Router } from "express"
import { requireAuth, optionalAuth } from "../middleware/auth.js"
import { resolveDbUser } from "../middleware/clerk-db-user.js"
import { db, usersTable, submissionsTable, userStatsTable, problemsTable } from "@workspace/db"
import { eq, sql, count, desc } from "drizzle-orm"

const router = Router()

const ACHIEVEMENTS = [
  { id: 1, title: "First Steps", description: "Solve your first problem" },
  { id: 2, title: "Problem Solver", description: "Solve 10 problems" },
  { id: 3, title: "Streak Master", description: "Maintain a 7-day solving streak" },
  { id: 4, title: "Algorithm Expert", description: "Solve 50 problems" },
  { id: 5, title: "Speed Demon", description: "Solve a problem in under 5 minutes" },
  { id: 6, title: "Master Coder", description: "Solve 100 problems" },
]

function computeAchievements(solvedCount: number, streak: number) {
  return ACHIEVEMENTS.map((a) => {
    let earned = false
    if (a.id === 1 && solvedCount >= 1) earned = true
    if (a.id === 2 && solvedCount >= 10) earned = true
    if (a.id === 3 && streak >= 7) earned = true
    if (a.id === 4 && solvedCount >= 50) earned = true
    if (a.id === 6 && solvedCount >= 100) earned = true
    return { ...a, earned, earnedDate: earned ? new Date().toISOString().split("T")[0] : null }
  })
}

router.get("/user/profile", requireAuth, resolveDbUser, async (req, res) => {
  try {
    const userId = req.dbUserId
    if (!userId) {
      return res.status(401).json({ error: "User not found in database" })
    }

    const [userRow] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1)

    if (!userRow) {
      return res.status(404).json({ error: "User not found" })
    }

    const [statsRow] = await db
      .select()
      .from(userStatsTable)
      .where(eq(userStatsTable.userId, userId))
      .limit(1)

    const totalProblems = await db.select({ count: count() }).from(problemsTable)
    const totalCount = Number(totalProblems[0]?.count ?? 0)

    const acceptedSubs = await db
      .select({
        problemId: submissionsTable.problemId,
        difficulty: problemsTable.difficulty,
      })
      .from(submissionsTable)
      .innerJoin(problemsTable, eq(problemsTable.id, submissionsTable.problemId))
      .where(sql`${submissionsTable.userId} = ${userId} AND ${submissionsTable.status} = 'accepted'`)

    const uniqueSolvedByDifficulty = new Map<string, string>()
    for (const s of acceptedSubs) {
      uniqueSolvedByDifficulty.set(`${s.problemId}`, s.difficulty)
    }
    const solvedProblems = uniqueSolvedByDifficulty.size
    const easyProblems = [...uniqueSolvedByDifficulty.values()].filter((d) => d === "Easy").length
    const mediumProblems = [...uniqueSolvedByDifficulty.values()].filter((d) => d === "Medium").length
    const hardProblems = [...uniqueSolvedByDifficulty.values()].filter((d) => d === "Hard").length

    const recentAttempts = await db
      .select({
        id: submissionsTable.id,
        problemId: submissionsTable.problemId,
        status: submissionsTable.status,
        language: submissionsTable.language,
        submittedAt: submissionsTable.createdAt,
        executionTime: submissionsTable.executionTime,
        problemTitle: problemsTable.title,
        difficulty: problemsTable.difficulty,
      })
      .from(submissionsTable)
      .innerJoin(problemsTable, eq(problemsTable.id, submissionsTable.problemId))
      .where(eq(submissionsTable.userId, userId))
      .orderBy(desc(submissionsTable.createdAt))
      .limit(10)

    const allUsersRanked = await db
      .select({ userId: userStatsTable.userId, points: userStatsTable.points })
      .from(userStatsTable)
      .orderBy(desc(userStatsTable.points))

    const rankIndex = allUsersRanked.findIndex((r) => r.userId === userId)
    const rank = rankIndex >= 0 ? rankIndex + 1 : allUsersRanked.length + 1

    const totalUsersResult = await db.select({ count: count() }).from(usersTable)
    const totalUsers = Number(totalUsersResult[0]?.count ?? 0)

    const currentStreak = statsRow?.currentStreak ?? 0
    const longestStreak = statsRow?.longestStreak ?? 0
    const points = statsRow?.points ?? 0
    const achievements = computeAchievements(solvedProblems, currentStreak)

    return res.json({
      id: userRow.id,
      name: userRow.username,
      email: userRow.email,
      avatar: "/diverse-user-avatars.png",
      stats: {
        totalProblems: totalCount,
        solvedProblems,
        easyProblems,
        mediumProblems,
        hardProblems,
        currentStreak,
        longestStreak,
        rank,
        totalUsers,
        points,
      },
      achievements,
      recentAttempts: recentAttempts.map((a) => ({
        id: a.id,
        problemTitle: a.problemTitle,
        difficulty: a.difficulty,
        status: a.status,
        language: a.language,
        submittedAt: a.submittedAt,
        timeSpent: a.executionTime ? `${a.executionTime}ms` : "—",
      })),
    })
  } catch (err: unknown) {
    const e = err as { message?: string }
    return res.status(500).json({ error: e.message ?? "Failed to fetch profile" })
  }
})

router.put("/user/profile", requireAuth, async (req, res) => {
  return res.json({ message: "Profile updated successfully" })
})

router.get("/user/:id", optionalAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10)
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const [userRow] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1)

    if (!userRow) {
      return res.status(404).json({ error: "User not found" })
    }

    const [statsRow] = await db
      .select()
      .from(userStatsTable)
      .where(eq(userStatsTable.userId, userId))
      .limit(1)

    const totalProblems = await db.select({ count: count() }).from(problemsTable)
    const totalCount = Number(totalProblems[0]?.count ?? 0)

    const acceptedSubs = await db
      .select({
        problemId: submissionsTable.problemId,
        difficulty: problemsTable.difficulty,
      })
      .from(submissionsTable)
      .innerJoin(problemsTable, eq(problemsTable.id, submissionsTable.problemId))
      .where(sql`${submissionsTable.userId} = ${userId} AND ${submissionsTable.status} = 'accepted'`)

    const uniqueSolved = new Map<string, string>()
    for (const s of acceptedSubs) {
      uniqueSolved.set(`${s.problemId}`, s.difficulty)
    }
    const solvedProblems = uniqueSolved.size
    const easyProblems = [...uniqueSolved.values()].filter((d) => d === "Easy").length
    const mediumProblems = [...uniqueSolved.values()].filter((d) => d === "Medium").length
    const hardProblems = [...uniqueSolved.values()].filter((d) => d === "Hard").length

    const recentActivity = await db
      .select({
        id: submissionsTable.id,
        status: submissionsTable.status,
        submittedAt: submissionsTable.createdAt,
        executionTime: submissionsTable.executionTime,
        problemTitle: problemsTable.title,
        difficulty: problemsTable.difficulty,
      })
      .from(submissionsTable)
      .innerJoin(problemsTable, eq(problemsTable.id, submissionsTable.problemId))
      .where(eq(submissionsTable.userId, userId))
      .orderBy(desc(submissionsTable.createdAt))
      .limit(5)

    const allUsersRanked = await db
      .select({ userId: userStatsTable.userId, points: userStatsTable.points })
      .from(userStatsTable)
      .orderBy(desc(userStatsTable.points))

    const rankIndex = allUsersRanked.findIndex((r) => r.userId === userId)
    const rank = rankIndex >= 0 ? rankIndex + 1 : allUsersRanked.length + 1

    const currentStreak = statsRow?.currentStreak ?? 0
    const longestStreak = statsRow?.longestStreak ?? 0
    const points = statsRow?.points ?? 0
    const achievements = computeAchievements(solvedProblems, currentStreak)

    const totalUsersResult = await db
      .select({ count: count() })
      .from(usersTable)
      .where(sql`${usersTable.role} = 'user'`)
    const totalUsers = Number(totalUsersResult[0]?.count ?? 0)

    const user = {
      id: userRow.id,
      name: userRow.username,
      avatar: "/diverse-user-avatars.png",
      joinedDate: userRow.createdAt.toISOString().split("T")[0],
      rank,
      level: points >= 2000 ? "Expert" : points >= 1500 ? "Advanced" : points >= 500 ? "Intermediate" : "Beginner",
      stats: {
        totalProblems: totalCount,
        solvedProblems,
        easyProblems,
        mediumProblems,
        hardProblems,
        currentStreak,
        longestStreak,
        points,
        totalUsers,
      },
      achievements,
      recentActivity: recentActivity.map((a) => ({
        id: a.id,
        problem: a.problemTitle,
        difficulty: a.difficulty,
        status: a.status === "accepted" ? "solved" : "attempted",
        date: new Date(a.submittedAt).toISOString().split("T")[0],
        time: a.executionTime ? `${a.executionTime}ms` : "—",
      })),
    }

    return res.json({ user })
  } catch (err: unknown) {
    const e = err as { message?: string }
    return res.status(500).json({ error: e.message ?? "Failed to fetch user" })
  }
})

export default router
