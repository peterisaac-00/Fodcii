import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get("period") || "all-time"

  // Mock leaderboard data - in a real app, this would come from a database
  const mockLeaderboard = [
    {
      rank: 1,
      name: "Alex Chen",
      avatar: "/abstract-geometric-shapes.png",
      email: "alex.chen@example.com",
      solvedProblems: 98,
      totalProblems: 110,
      points: 2450,
      streak: 15,
      level: "Expert",
    },
    {
      rank: 2,
      name: "Sarah Johnson",
      avatar: "/abstract-geometric-shapes.png",
      email: "sarah.j@example.com",
      solvedProblems: 89,
      totalProblems: 110,
      points: 2180,
      streak: 8,
      level: "Advanced",
    },
    {
      rank: 3,
      name: "Michael Rodriguez",
      avatar: "/diverse-group-collaborating.png",
      email: "m.rodriguez@example.com",
      solvedProblems: 82,
      totalProblems: 110,
      points: 1950,
      streak: 12,
      level: "Advanced",
    },
  ]

  const stats = {
    totalUsers: 2847,
    activeToday: 342,
    problemsSolvedToday: 1256,
    averageProblems: 34,
  }

  return NextResponse.json({ leaderboard: mockLeaderboard, stats })
}
