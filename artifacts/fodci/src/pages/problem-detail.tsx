import { useState, useRef, useEffect } from "react"
import { useParams, useLocation } from "wouter"
import { Navigation } from "@/components/navigation"
import { PageContainer } from "@/components/page-container"
import { CodeEditor } from "@/components/code-editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Users, CheckCircle, Loader2 } from "lucide-react"
import Timer, { type TimerRef } from "@/components/ui/timer"

interface Problem {
  id: number
  title: string
  category: string
  difficulty: string
  level: number
  description: string
  examples: { input: string; output: string; explanation?: string }[]
  constraints: string[]
  solved: boolean
  submissions: number
  acceptanceRate: number
  starterCode: Record<string, string>
}

export default function ProblemDetailPage() {
  const params = useParams<{ id: string }>()
  const [, navigate] = useLocation()
  const [selectedLanguage, setSelectedLanguage] = useState("python")
  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<TimerRef>(null)

  const problemId = parseInt(params.id || "1")

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/problems/${problemId}`, { credentials: "include" })
        if (!res.ok) {
          if (res.status === 404) {
            setError("Problem not found")
          } else {
            throw new Error("Failed to load problem")
          }
          return
        }
        const data = await res.json()
        setProblem(data.problem)
        setSelectedLanguage("python")
      } catch (e: unknown) {
        const err = e as { message?: string }
        setError(err.message ?? "Failed to load problem")
      } finally {
        setLoading(false)
      }
    }

    fetchProblem()
  }, [problemId])

  const handleRunCode = (code: string) => {
    console.log("Running code for problem", problemId, ":", code.slice(0, 50))
  }

  const handleSubmitResult = (_code: string, result: { success: boolean }) => {
    if (result.success) {
      timerRef.current?.stopFinal()
    } else {
      timerRef.current?.resume()
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/10 text-green-500 border-green-500/20"
      case "Medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "Hard": return "bg-red-500/10 text-red-500 border-red-500/20"
      default: return "bg-muted text-muted-foreground"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96 flex-col gap-4">
          <h1 className="text-2xl font-bold">{error ?? "Problem not found"}</h1>
          <Button onClick={() => navigate("/problems")}>Back to Problems</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="flex">
        <div className="w-1/2 border-r border-border">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <PageContainer className="py-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" onClick={() => navigate("/problems")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h1 className="text-2xl font-bold text-foreground">{problem.title}</h1>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{problem.category}</Badge>
                        <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                        <Badge variant="secondary">Level {problem.level}</Badge>
                      </div>
                    </div>
                    {problem.solved && (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Solved
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {problem.submissions} submissions
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      {problem.acceptanceRate}% acceptance
                    </div>
                  </div>
                </div>

                <Separator />

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Problem Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none text-foreground">
                      <p className="whitespace-pre-line leading-relaxed">{problem.description}</p>
                    </div>
                  </CardContent>
                </Card>

                {problem.examples && problem.examples.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Examples</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {problem.examples.map((example, index) => (
                        <div key={index} className="space-y-2">
                          <h4 className="font-semibold">Example {index + 1}:</h4>
                          <div className="bg-muted/50 rounded-lg p-3 space-y-2 font-mono text-sm">
                            <div><span className="text-muted-foreground">Input: </span>{example.input}</div>
                            <div><span className="text-muted-foreground">Output: </span>{example.output}</div>
                            {example.explanation && (
                              <div><span className="text-muted-foreground">Explanation: </span>{example.explanation}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {problem.constraints && problem.constraints.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Constraints</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 font-mono text-sm">
                        {problem.constraints.map((constraint, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-muted-foreground">•</span>
                            <span>{constraint}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </PageContainer>
          </div>
        </div>

        <div className="w-1/2">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <PageContainer className="py-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-3">
                    Code Editor
                    <Timer ref={timerRef} />
                  </h2>
                </div>

                <CodeEditor
                  language={selectedLanguage}
                  initialCode={problem.starterCode?.[selectedLanguage] ?? ""}
                  onRun={handleRunCode}
                  onSubmit={handleSubmitResult}
                  problemId={problem.id}
                />
              </div>
            </PageContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
