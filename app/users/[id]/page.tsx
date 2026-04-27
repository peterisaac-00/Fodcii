"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Trophy, Target, Code, CheckCircle, Clock, Award, Star, Zap, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock function to get user data by ID
const getUserById = (id: string) => {
  const mockUsers = [
    {
      id: "1",
      name: "Alex Chen",
      email: "alex.chen@example.com",
      avatar: "/abstract-geometric-shapes.png",
      joinedDate: "2023-08-15",
      rank: 1,
      level: "Expert",
      stats: {
        totalProblems: 110,
        solvedProblems: 98,
        easyProblems: 45,
        mediumProblems: 38,
        hardProblems: 15,
        currentStreak: 15,
        longestStreak: 23,
        points: 2450,
        totalUsers: 2847,
      },
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      avatar: "/abstract-geometric-shapes.png",
      joinedDate: "2023-09-02",
      rank: 2,
      level: "Advanced",
      stats: {
        totalProblems: 110,
        solvedProblems: 89,
        easyProblems: 42,
        mediumProblems: 32,
        hardProblems: 15,
        currentStreak: 8,
        longestStreak: 18,
        points: 2180,
        totalUsers: 2847,
      },
    },
    {
      id: "3",
      name: "Michael Rodriguez",
      email: "m.rodriguez@example.com",
      avatar: "/diverse-group-collaborating.png",
      joinedDate: "2023-07-20",
      rank: 3,
      level: "Advanced",
      stats: {
        totalProblems: 110,
        solvedProblems: 82,
        easyProblems: 38,
        mediumProblems: 30,
        hardProblems: 14,
        currentStreak: 12,
        longestStreak: 20,
        points: 1950,
        totalUsers: 2847,
      },
    },
  ]

  return mockUsers.find((user) => user.id === id) || mockUsers[0]
}

const mockAchievements = [
  {
    id: 1,
    title: "First Steps",
    description: "Solve your first problem",
    icon: <Target className="h-6 w-6" />,
    earned: true,
    earnedDate: "2023-08-16",
    color: "text-green-500",
  },
  {
    id: 2,
    title: "Problem Solver",
    description: "Solve 10 problems",
    icon: <Code className="h-6 w-6" />,
    earned: true,
    earnedDate: "2023-08-25",
    color: "text-blue-500",
  },
  {
    id: 3,
    title: "Streak Master",
    description: "Maintain a 7-day solving streak",
    icon: <Zap className="h-6 w-6" />,
    earned: true,
    earnedDate: "2023-09-10",
    color: "text-yellow-500",
  },
  {
    id: 4,
    title: "Algorithm Expert",
    description: "Solve 50 problems",
    icon: <Trophy className="h-6 w-6" />,
    earned: true,
    earnedDate: "2023-10-15",
    color: "text-purple-500",
  },
  {
    id: 5,
    title: "Speed Demon",
    description: "Solve a problem in under 5 minutes",
    icon: <Clock className="h-6 w-6" />,
    earned: true,
    earnedDate: "2023-11-02",
    color: "text-red-500",
  },
  {
    id: 6,
    title: "Master Coder",
    description: "Solve 100 problems",
    icon: <Star className="h-6 w-6" />,
    earned: false,
    earnedDate: null,
    color: "text-orange-500",
  },
]

const mockSolvedProblems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    language: "Python",
    solvedAt: "2024-01-28T10:30:00Z",
    timeSpent: "12 minutes",
    attempts: 1,
    points: 25,
  },
  {
    id: 2,
    title: "Binary Search",
    difficulty: "Medium",
    category: "Search",
    language: "JavaScript",
    solvedAt: "2024-01-27T15:45:00Z",
    timeSpent: "25 minutes",
    attempts: 2,
    points: 50,
  },
  {
    id: 3,
    title: "Merge Sort Implementation",
    difficulty: "Medium",
    category: "Sorting",
    language: "Python",
    solvedAt: "2024-01-25T14:20:00Z",
    timeSpent: "18 minutes",
    attempts: 1,
    points: 50,
  },
  {
    id: 4,
    title: "Graph Traversal BFS",
    difficulty: "Hard",
    category: "Graphs",
    language: "C++",
    solvedAt: "2024-01-24T16:10:00Z",
    timeSpent: "45 minutes",
    attempts: 3,
    points: 100,
  },
  {
    id: 5,
    title: "Dynamic Programming - Fibonacci",
    difficulty: "Medium",
    category: "Dynamic Programming",
    language: "Python",
    solvedAt: "2024-01-23T11:30:00Z",
    timeSpent: "22 minutes",
    attempts: 1,
    points: 50,
  },
]

export default function UserDetailPage() {
  const params = useParams()
  const userId = params.id as string
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = getUserById(userId)
    setUser(userData)
  }, [userId])

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <PageContainer className="py-8">
          <div className="text-center">
            <div className="text-lg">Loading user profile...</div>
          </div>
        </PageContainer>
      </div>
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "Medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "Hard":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Expert":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "Advanced":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "Intermediate":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "Beginner":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <PageContainer className="py-8">
        <div className="space-y-8">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/leaderboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Leaderboard
            </Link>
          </Button>

          {/* Profile Header */}
          <Card className="border-border/50 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="h-32 w-32 border-4 border-primary/20">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-3xl font-bold">{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left space-y-4">
                  <div>
                    <h1 className="text-4xl font-bold text-foreground">{user.name}</h1>
                    <p className="text-muted-foreground text-lg">{user.email}</p>
                    <p className="text-sm text-muted-foreground mt-1">Joined {formatDate(user.joinedDate)}</p>
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary border-primary/20 text-lg px-3 py-1"
                      >
                        Rank #{user.rank}
                      </Badge>
                      <Badge className={getLevelColor(user.level)} variant="outline">
                        {user.level}
                      </Badge>
                      <Badge variant="outline">{user.stats.currentStreak} day streak</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{user.stats.points}</div>
                      <div className="text-sm text-muted-foreground">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent">{user.stats.solvedProblems}</div>
                      <div className="text-sm text-muted-foreground">Solved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground">{user.stats.totalProblems}</div>
                      <div className="text-sm text-muted-foreground">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-secondary">{user.stats.longestStreak}</div>
                      <div className="text-sm text-muted-foreground">Best Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-500">
                        {Math.round((user.stats.solvedProblems / user.stats.totalProblems) * 100)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  Easy Problems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{user.stats.easyProblems} solved</span>
                    <span>50 total</span>
                  </div>
                  <Progress value={(user.stats.easyProblems / 50) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  Medium Problems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{user.stats.mediumProblems} solved</span>
                    <span>40 total</span>
                  </div>
                  <Progress value={(user.stats.mediumProblems / 40) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  Hard Problems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{user.stats.hardProblems} solved</span>
                    <span>20 total</span>
                  </div>
                  <Progress value={(user.stats.hardProblems / 20) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Achievements and Solved Problems */}
          <Tabs defaultValue="solved-problems" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="solved-problems">Solved Problems</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="solved-problems">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Solved Problems ({mockSolvedProblems.length})
                  </CardTitle>
                  <CardDescription>Complete history of all problems solved by {user.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockSolvedProblems.map((problem) => (
                      <div
                        key={problem.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div>
                            <h4 className="font-medium">{problem.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getDifficultyColor(problem.difficulty)} variant="outline">
                                {problem.difficulty}
                              </Badge>
                              <Badge variant="secondary">{problem.category}</Badge>
                              <Badge variant="outline">{problem.language}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {problem.attempts} attempt{problem.attempts > 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">+{problem.points} pts</div>
                          <div className="text-sm text-muted-foreground">{problem.timeSpent}</div>
                          <div className="text-xs text-muted-foreground">{formatDate(problem.solvedAt)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Achievements
                  </CardTitle>
                  <CardDescription>{user.name}'s earned badges and milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {mockAchievements.map((achievement) => (
                      <Card
                        key={achievement.id}
                        className={`transition-all duration-300 ${
                          achievement.earned
                            ? "border-primary/30 bg-primary/5 hover:shadow-lg hover:shadow-primary/10"
                            : "border-border/50 bg-muted/20 opacity-60"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                                achievement.earned ? "bg-primary/10" : "bg-muted/50"
                              }`}
                            >
                              <div className={achievement.earned ? achievement.color : "text-muted-foreground"}>
                                {achievement.icon}
                              </div>
                            </div>
                            <div className="flex-1 space-y-1">
                              <h4 className="font-semibold text-sm">{achievement.title}</h4>
                              <p className="text-xs text-muted-foreground">{achievement.description}</p>
                              {achievement.earned && achievement.earnedDate && (
                                <p className="text-xs text-primary">Earned {formatDate(achievement.earnedDate)}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </div>
  )
}
