"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, Crown, TrendingUp, Users, Target } from "lucide-react"
import Link from "next/link"

// Mock leaderboard data
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
  {
    rank: 4,
    name: "Emily Davis",
    avatar: "/abstract-geometric-shapes.png",
    email: "emily.davis@example.com",
    solvedProblems: 76,
    totalProblems: 110,
    points: 1820,
    streak: 5,
    level: "Intermediate",
  },
  {
    rank: 5,
    name: "David Kim",
    avatar: "/abstract-geometric-shapes.png",
    email: "david.kim@example.com",
    solvedProblems: 71,
    totalProblems: 110,
    points: 1690,
    streak: 9,
    level: "Intermediate",
  },
  {
    rank: 6,
    name: "Lisa Wang",
    avatar: "/abstract-geometric-shapes.png",
    email: "lisa.wang@example.com",
    solvedProblems: 68,
    totalProblems: 110,
    points: 1580,
    streak: 3,
    level: "Intermediate",
  },
  {
    rank: 7,
    name: "James Wilson",
    avatar: "/abstract-geometric-shapes.png",
    email: "james.w@example.com",
    solvedProblems: 63,
    totalProblems: 110,
    points: 1450,
    streak: 7,
    level: "Intermediate",
  },
  {
    rank: 8,
    name: "Maria Garcia",
    avatar: "/abstract-geometric-shapes.png",
    email: "maria.g@example.com",
    solvedProblems: 58,
    totalProblems: 110,
    points: 1320,
    streak: 4,
    level: "Beginner",
  },
]

const mockStats = {
  totalUsers: 2847,
  activeToday: 342,
  problemsSolvedToday: 1256,
  averageProblems: 34,
}

export default function LeaderboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("all-time")

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
    }
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
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Leaderboard</h1>
              <p className="text-muted-foreground mt-2">See how you rank against other problem solvers</p>
            </div>
          </div>

          {/* Stats Cards */}
          {/*
                      <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{mockStats.totalUsers.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Users</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                      <TrendingUp className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{mockStats.activeToday}</div>
                      <div className="text-sm text-muted-foreground">Active Today</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                      <Target className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {mockStats.problemsSolvedToday.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Problems Solved Today</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted/50">
                      <Trophy className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{mockStats.averageProblems}</div>
                      <div className="text-sm text-muted-foreground">Average Problems</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

          */}

          {/* Leaderboard */}
          <Tabs defaultValue="all-time" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all-time">All Time</TabsTrigger>
                <TabsTrigger value="monthly">This Month</TabsTrigger>
                <TabsTrigger value="weekly">This Week</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all-time">
              <Card>
                <CardHeader>
                  <CardTitle>Top Problem Solvers</CardTitle>
                  <CardDescription>Rankings based on total problems solved and points earned</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockLeaderboard.map((user, index) => (
                      <div
                        key={user.rank}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 hover:shadow-lg ${
                          user.rank <= 3
                            ? "border-primary/30 bg-primary/5 hover:shadow-primary/10"
                            : "border-border/50 hover:bg-muted/20"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8">{getRankIcon(user.rank)}</div>

                          <Link href={`/users/${user.rank}`} className="hover:opacity-80 transition-opacity">
                            <Avatar className="h-12 w-12 cursor-pointer">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </Link>

                          <div>
                            <h4 className="font-semibold text-foreground">{user.name}</h4>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getLevelColor(user.level)} variant="outline">
                                {user.level}
                              </Badge>
                              {user.streak > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  {user.streak} day streak
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right space-y-1">
                          <div className="text-lg font-bold text-primary">{user.points} pts</div>
                          <div className="text-sm text-muted-foreground">
                            {user.solvedProblems}/{user.totalProblems} solved
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round((user.solvedProblems / user.totalProblems) * 100)}% success rate
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monthly">
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                        <Trophy className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Monthly Rankings Coming Soon</h3>
                      <p className="text-muted-foreground">
                        We're working on monthly leaderboards to track your progress over time.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="weekly">
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                        <Trophy className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Weekly Rankings Coming Soon</h3>
                      <p className="text-muted-foreground">
                        Weekly competitions and rankings will be available soon to keep you motivated.
                      </p>
                    </div>
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
