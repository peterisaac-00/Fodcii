import { useState, useEffect, type ReactNode } from "react"
import { Navigation } from "@/components/navigation"
import { PageContainer } from "@/components/page-container"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@clerk/react"
import { Trophy, Target, Code, Calendar, CheckCircle, XCircle, Clock, Award, Star, Zap, Loader2 } from "lucide-react"

interface UserStats {
  totalProblems: number
  solvedProblems: number
  easyProblems: number
  mediumProblems: number
  hardProblems: number
  currentStreak: number
  longestStreak: number
  rank: number
  totalUsers: number
  points: number
}

interface Achievement {
  id: number
  title: string
  description: string
  earned: boolean
  earnedDate: string | null
}

interface RecentAttempt {
  id: number
  problemTitle: string
  difficulty: string
  status: string
  language: string
  submittedAt: string
  timeSpent: string
}

interface ProfileData {
  id: number
  name: string
  email: string
  avatar: string
  stats: UserStats
  achievements: Achievement[]
  recentAttempts: RecentAttempt[]
}

const ACHIEVEMENT_ICONS: Record<number, ReactNode> = {
  1: <Target className="h-6 w-6" />,
  2: <Code className="h-6 w-6" />,
  3: <Zap className="h-6 w-6" />,
  4: <Trophy className="h-6 w-6" />,
  5: <Clock className="h-6 w-6" />,
  6: <Star className="h-6 w-6" />,
}

const ACHIEVEMENT_COLORS: Record<number, string> = {
  1: "text-green-500",
  2: "text-blue-500",
  3: "text-yellow-500",
  4: "text-purple-500",
  5: "text-red-500",
  6: "text-orange-500",
}

export default function ProfilePage() {
  const { user } = useUser()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/user/profile", {
          credentials: "include",
        })
        if (!res.ok) {
          if (res.status === 401) {
            setLoading(false)
            return
          }
          throw new Error("Failed to load profile")
        }
        const data = await res.json()
        setProfile(data)
      } catch (e: unknown) {
        const err = e as { message?: string }
        setError(err.message ?? "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [user])

  const stats = profile?.stats
  const achievements = profile?.achievements ?? []
  const recentAttempts = profile?.recentAttempts ?? []

  const displayName = profile?.name || user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress?.split("@")[0] || "User"
  const displayEmail = profile?.email || user?.primaryEmailAddress?.emailAddress || ""
  const displayAvatar = profile?.avatar || user?.imageUrl || "/placeholder.svg"

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />

        <PageContainer className="py-8">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-destructive">{error}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={displayAvatar} alt={displayName} />
                      <AvatarFallback className="text-2xl">{displayName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-center md:text-left flex-1">
                      <h1 className="text-3xl font-bold text-foreground">{displayName}</h1>
                      <p className="text-muted-foreground">{displayEmail}</p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                        {stats && (
                          <>
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                              <Trophy className="h-3 w-3 mr-1" />
                              Rank #{stats.rank}
                            </Badge>
                            <Badge variant="secondary">
                              <Calendar className="h-3 w-3 mr-1" />
                              {stats.currentStreak} day streak
                            </Badge>
                            <Badge variant="outline">
                              {stats.solvedProblems} solved
                            </Badge>
                            <Badge variant="outline">
                              {stats.points} pts
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {stats && (
                <>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-3xl font-bold text-foreground mb-1">{stats.solvedProblems}</div>
                        <div className="text-sm text-muted-foreground">Problems Solved</div>
                        <Progress value={stats.totalProblems > 0 ? (stats.solvedProblems / stats.totalProblems) * 100 : 0} className="mt-3" />
                        <div className="text-xs text-muted-foreground mt-1">{stats.solvedProblems}/{stats.totalProblems}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-3xl font-bold text-primary mb-1">#{stats.rank}</div>
                        <div className="text-sm text-muted-foreground">Global Rank</div>
                        <div className="text-xs text-muted-foreground mt-3">of {stats.totalUsers.toLocaleString()} users</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-3xl font-bold text-yellow-500 mb-1">{stats.currentStreak}</div>
                        <div className="text-sm text-muted-foreground">Current Streak</div>
                        <div className="text-xs text-muted-foreground mt-3">Best: {stats.longestStreak} days</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-3xl font-bold text-foreground mb-1">{achievements.filter((a) => a.earned).length}</div>
                        <div className="text-sm text-muted-foreground">Achievements</div>
                        <div className="text-xs text-muted-foreground mt-3">of {achievements.length} total</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Problem Breakdown</CardTitle>
                      <CardDescription>Problems solved by difficulty</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-green-500 font-medium">Easy</span>
                            <span>{stats.easyProblems}</span>
                          </div>
                          <Progress value={(stats.easyProblems / 50) * 100} className="[&>div]:bg-green-500" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-yellow-500 font-medium">Medium</span>
                            <span>{stats.mediumProblems}</span>
                          </div>
                          <Progress value={(stats.mediumProblems / 40) * 100} className="[&>div]:bg-yellow-500" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-red-500 font-medium">Hard</span>
                            <span>{stats.hardProblems}</span>
                          </div>
                          <Progress value={(stats.hardProblems / 20) * 100} className="[&>div]:bg-red-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              <Tabs defaultValue="achievements" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="achievements">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {achievements.map((achievement) => (
                      <Card key={achievement.id} className={`transition-all duration-300 ${achievement.earned ? "border-primary/20 bg-primary/5" : "opacity-60"}`}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${achievement.earned ? "bg-primary/10" : "bg-muted"} ${ACHIEVEMENT_COLORS[achievement.id] ?? "text-muted-foreground"}`}>
                              {ACHIEVEMENT_ICONS[achievement.id] ?? <Award className="h-6 w-6" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                                {achievement.earned && <CheckCircle className="h-4 w-4 text-primary" />}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                              {achievement.earnedDate && (
                                <p className="text-xs text-muted-foreground mt-2">Earned {achievement.earnedDate}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="activity">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {recentAttempts.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No activity yet. Start solving problems!</p>
                      ) : (
                        <div className="space-y-4">
                          {recentAttempts.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${activity.status === "accepted" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                                  {activity.status === "accepted" ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium text-foreground">{activity.problemTitle}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {activity.difficulty}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">{new Date(activity.submittedAt).toLocaleDateString()}</span>
                                    <span className="text-xs text-muted-foreground capitalize">{activity.language}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{activity.timeSpent}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </PageContainer>
      </div>
    </ProtectedRoute>
  )
}
