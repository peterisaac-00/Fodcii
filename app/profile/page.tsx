"use client"

import { Navigation } from "@/components/navigation"
import { PageContainer } from "@/components/page-container"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { Trophy, Target, Code, Calendar, CheckCircle, XCircle, Clock, Award, Star, Zap } from "lucide-react"

// Mock data for user stats and achievements
const mockUserStats = {
  totalProblems: 110,
  solvedProblems: 47,
  easyProblems: 28,
  mediumProblems: 15,
  hardProblems: 4,
  currentStreak: 7,
  longestStreak: 12,
  rank: 156,
  totalUsers: 2847,
}

const mockAchievements = [
  {
    id: 1,
    title: "First Steps",
    description: "Solve your first problem",
    icon: <Target className="h-6 w-6" />,
    earned: true,
    earnedDate: "2024-01-15",
    color: "text-green-500",
  },
  {
    id: 2,
    title: "Problem Solver",
    description: "Solve 10 problems",
    icon: <Code className="h-6 w-6" />,
    earned: true,
    earnedDate: "2024-01-20",
    color: "text-blue-500",
  },
  {
    id: 3,
    title: "Streak Master",
    description: "Maintain a 7-day solving streak",
    icon: <Zap className="h-6 w-6" />,
    earned: true,
    earnedDate: "2024-01-25",
    color: "text-yellow-500",
  },
  {
    id: 4,
    title: "Algorithm Expert",
    description: "Solve 50 problems",
    icon: <Trophy className="h-6 w-6" />,
    earned: false,
    earnedDate: null,
    color: "text-purple-500",
  },
  {
    id: 5,
    title: "Speed Demon",
    description: "Solve a problem in under 5 minutes",
    icon: <Clock className="h-6 w-6" />,
    earned: false,
    earnedDate: null,
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

const mockRecentAttempts = [
  {
    id: 1,
    problemTitle: "Two Sum",
    difficulty: "Easy",
    status: "solved",
    language: "Python",
    submittedAt: "2024-01-28T10:30:00Z",
    timeSpent: "12 minutes",
  },
  {
    id: 2,
    problemTitle: "Binary Search",
    difficulty: "Medium",
    status: "solved",
    language: "JavaScript",
    submittedAt: "2024-01-27T15:45:00Z",
    timeSpent: "25 minutes",
  },
  {
    id: 3,
    problemTitle: "Graph Traversal",
    difficulty: "Hard",
    status: "failed",
    language: "C++",
    submittedAt: "2024-01-26T20:15:00Z",
    timeSpent: "45 minutes",
  },
  {
    id: 4,
    problemTitle: "Merge Sort",
    difficulty: "Medium",
    status: "solved",
    language: "Python",
    submittedAt: "2024-01-25T14:20:00Z",
    timeSpent: "18 minutes",
  },
]

export default function ProfilePage() {
  const { user } = useAuth()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "solved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
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
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />

        <PageContainer className="py-8">
          <div className="space-y-8">
            {/* Profile Header */}
            <Card className="border-border/50 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <Avatar className="h-24 w-24 border-4 border-primary/20">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback className="text-2xl font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 text-center md:text-left space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground">{user?.name}</h1>
                      <p className="text-muted-foreground">{user?.email}</p>
                      <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          Rank #{mockUserStats.rank}
                        </Badge>
                        <Badge variant="outline">{mockUserStats.currentStreak} day streak</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{mockUserStats.solvedProblems}</div>
                        <div className="text-sm text-muted-foreground">Solved</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">{mockUserStats.totalProblems}</div>
                        <div className="text-sm text-muted-foreground">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent">{mockUserStats.longestStreak}</div>
                        <div className="text-sm text-muted-foreground">Best Streak</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-secondary">
                          {Math.round((mockUserStats.solvedProblems / mockUserStats.totalProblems) * 100)}%
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
                      <span>{mockUserStats.easyProblems} solved</span>
                      <span>50 total</span>
                    </div>
                    <Progress value={(mockUserStats.easyProblems / 50) * 100} className="h-2" />
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
                      <span>{mockUserStats.mediumProblems} solved</span>
                      <span>40 total</span>
                    </div>
                    <Progress value={(mockUserStats.mediumProblems / 40) * 100} className="h-2" />
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
                      <span>{mockUserStats.hardProblems} solved</span>
                      <span>20 total</span>
                    </div>
                    <Progress value={(mockUserStats.hardProblems / 20) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs for Achievements and Recent Activity */}
            <Tabs defaultValue="achievements" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="achievements">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Achievements
                    </CardTitle>
                    <CardDescription>Unlock badges by completing challenges and reaching milestones</CardDescription>
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

              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Your latest problem-solving attempts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockRecentAttempts.map((attempt) => (
                        <div
                          key={attempt.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            {getStatusIcon(attempt.status)}
                            <div>
                              <h4 className="font-medium">{attempt.problemTitle}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getDifficultyColor(attempt.difficulty)} variant="outline">
                                  {attempt.difficulty}
                                </Badge>
                                <Badge variant="secondary">{attempt.language}</Badge>
                                <span className="text-xs text-muted-foreground">{attempt.timeSpent}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">{formatDate(attempt.submittedAt)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </PageContainer>
      </div>
    </ProtectedRoute>
  )
}
