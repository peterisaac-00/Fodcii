import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Mock user profile data - in a real app, this would come from a database
  const mockProfile = {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/diverse-user-avatars.png",
    stats: {
      totalProblems: 110,
      solvedProblems: 47,
      easyProblems: 28,
      mediumProblems: 15,
      hardProblems: 4,
      currentStreak: 7,
      longestStreak: 12,
      rank: 156,
      totalUsers: 2847,
    },
    achievements: [
      {
        id: 1,
        title: "First Steps",
        description: "Solve your first problem",
        earned: true,
        earnedDate: "2024-01-15",
      },
      {
        id: 2,
        title: "Problem Solver",
        description: "Solve 10 problems",
        earned: true,
        earnedDate: "2024-01-20",
      },
    ],
    recentAttempts: [
      {
        id: 1,
        problemTitle: "Two Sum",
        difficulty: "Easy",
        status: "solved",
        language: "Python",
        submittedAt: "2024-01-28T10:30:00Z",
        timeSpent: "12 minutes",
      },
    ],
  }

  return NextResponse.json(mockProfile)
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json()

    // Simulate profile update - in a real app, this would update the database
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({ message: "Profile updated successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
