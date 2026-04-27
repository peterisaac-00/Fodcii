"use client"

import { useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { PageContainer } from "@/components/page-container"
import { CodeEditor } from "@/components/code-editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Users, CheckCircle } from "lucide-react"
import Timer, { TimerRef } from "@/components/ui/timer"

const mockProblem = {
  id: 1,
  title: "Two Sum",
  category: "Arrays",
  difficulty: "Easy",
  level: 1,
  description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
  examples: [
    { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
    { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]." },
  ],
  constraints: [
    "2 ≤ nums.length ≤ 10⁴",
    "-10⁹ ≤ nums[i] ≤ 10⁹",
    "-10⁹ ≤ target ≤ 10⁹",
    "Only one valid answer exists.",
  ],
  solved: false,
  submissions: 1234,
  acceptanceRate: 85.2,
}

export default function ProblemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState("python")
  const timerRef = useRef<TimerRef>(null)

  const handleRunCode = (code: string) => {
    console.log("Running code:", code)
  }

  const handleSubmitCode = async (code: string) => {
    timerRef.current?.pause()

    try {
      const response = await fetch("/api/checkAnswer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, problemId: mockProblem.id, language: selectedLanguage }),
      })

      if (!response.ok) throw new Error(`Server error: ${response.status}`)
      const result = await response.json()

      if (result.correct) {
        timerRef.current?.stopFinal()
        console.log("Solution is correct. Timer stopped permanently.")
      } else {
        timerRef.current?.resume()
        console.log("Solution is incorrect. Timer resumed.")
      }
    } catch (err) {
      console.error("Server/network error:", err)
      // keep timer paused on network/server error
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="flex">
        {/* Problem Description */}
        <div className="w-1/2 border-r border-border">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <PageContainer className="py-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h1 className="text-2xl font-bold text-foreground">{mockProblem.title}</h1>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{mockProblem.category}</Badge>
                        <Badge className={getDifficultyColor(mockProblem.difficulty)}>{mockProblem.difficulty}</Badge>
                        <Badge variant="secondary">Level {mockProblem.level}</Badge>
                      </div>
                    </div>
                    {mockProblem.solved && (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Solved
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {mockProblem.submissions} submissions
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      {mockProblem.acceptanceRate}% acceptance
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
                      <p className="whitespace-pre-line leading-relaxed">{mockProblem.description}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Examples</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockProblem.examples.map((example, index) => (
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

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Constraints</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 font-mono text-sm">
                      {mockProblem.constraints.map((constraint, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-muted-foreground">•</span>
                          <span>{constraint}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </PageContainer>
          </div>
        </div>

        {/* Code Editor */}
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
                  onRun={handleRunCode}
                  onSubmit={handleSubmitCode}
                  problemId={mockProblem.id}
                />
              </div>
            </PageContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
