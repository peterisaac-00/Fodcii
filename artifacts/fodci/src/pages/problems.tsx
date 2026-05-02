import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AnimatedButton } from "@/components/animated-button"
import { Search, Filter, Code, Loader2 } from "lucide-react"
import { useLocation } from "wouter"

interface Problem {
  id: number
  title: string
  category: string
  difficulty: string
  level: number
  description: string
  solved: boolean
}

const categories = ["All", "Arrays", "Strings", "Algorithms", "Stacks", "Dynamic Programming", "Graphs"]
const levels = ["All", "1", "2", "3"]

export default function ProblemsPage() {
  const [, navigate] = useLocation()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (searchTerm) params.set("search", searchTerm)
        if (selectedCategory !== "All") params.set("category", selectedCategory)
        if (selectedDifficulty !== "All") params.set("difficulty", selectedDifficulty)
        if (selectedLevel !== "All") params.set("level", selectedLevel)

        const res = await fetch(`/api/problems?${params.toString()}`, { credentials: "include" })
        if (!res.ok) throw new Error("Failed to load problems")
        const data = await res.json()
        setProblems(data.problems ?? [])
      } catch (e: unknown) {
        const err = e as { message?: string }
        setError(err.message ?? "Failed to load problems")
      } finally {
        setLoading(false)
      }
    }

    fetchProblems()
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedLevel])

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

  const handleSolveProblem = (problemId: number) => {
    navigate(`/problems/${problemId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="flex">
        <aside className="w-80 border-r border-border bg-card/50 backdrop-blur min-h-screen sticky top-16">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="search">Search Problems</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Level</Label>
                <div className="grid grid-cols-2 gap-2">
                  {levels.map((level) => (
                    <Button
                      key={level}
                      variant={selectedLevel === level ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedLevel(level)}
                      className="justify-start"
                    >
                      {level === "All" ? "All Levels" : `Level ${level}`}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Category</Label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="w-full justify-start"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Difficulty</Label>
                <div className="space-y-2">
                  {["All", "Easy", "Medium", "Hard"].map((diff) => (
                    <Button
                      key={diff}
                      variant={selectedDifficulty === diff ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedDifficulty(diff)}
                      className="w-full justify-start"
                    >
                      {diff}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <PageContainer>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Programming Problems</h1>
              <p className="text-muted-foreground">
                {loading ? "Loading problems..." : `Choose a problem to start coding. Found ${problems.length} problems.`}
              </p>
            </div>

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
              <div className="grid gap-6">
                {problems.map((problem) => (
                  <Card key={problem.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                              {problem.title}
                            </CardTitle>
                            {problem.solved && (
                              <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                                Solved
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{problem.category}</Badge>
                            <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                            <Badge variant="secondary">Level {problem.level}</Badge>
                          </div>
                        </div>
                        <AnimatedButton
                          onClick={() => handleSolveProblem(problem.id)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Code className="mr-2 h-4 w-4 inline" />
                          Solve Now
                        </AnimatedButton>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">{problem.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}

                {problems.length === 0 && (
                  <Card className="text-center py-12">
                    <CardContent>
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                          <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">No problems found</h3>
                          <p className="text-muted-foreground">
                            Try adjusting your filters or search terms to find problems.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </PageContainer>
        </main>
      </div>
    </div>
  )
}
