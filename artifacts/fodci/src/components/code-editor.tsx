import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Send, CheckCircle, XCircle, Loader2 } from "lucide-react"

interface TestCaseResult {
  description: string
  input: string
  expected: string
  actual: string
  passed: boolean
  stderr?: string
}

interface SubmitResult {
  success: boolean
  message?: string
  passedTests?: number
  totalTests?: number
  testCases?: TestCaseResult[]
}

interface CodeEditorProps {
  language: string
  initialCode?: string
  problemId: number
  onRun?: (code: string) => void
  onSubmit?: (code: string, result: SubmitResult) => void
}

const languageTemplates: Record<string, string> = {
  python: `def solution():
    # Write your solution here
    pass

# Test your solution
result = solution()
print(result)`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Write your solution here
    
    return 0;
}`,
  javascript: `function solution() {
    // Write your solution here
    return null;
}

// Test your solution
console.log(solution());`,
}

const POLL_INTERVAL_MS = 600
const MAX_POLL_ATTEMPTS = 60

export function CodeEditor({ language, initialCode, problemId, onRun, onSubmit }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode || languageTemplates[language] || "")
  const [runOutput, setRunOutput] = useState("")
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<string>("")
  const [activeTab, setActiveTab] = useState("code")
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pollCountRef = useRef(0)

  useEffect(() => {
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current)
    }
  }, [])

  const handleRun = async () => {
    setIsRunning(true)
    setActiveTab("output")
    setRunOutput("Running...")
    try {
      const response = await fetch("/api/code/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code, language, problemId }),
      })
      const result = await response.json()
      setRunOutput(
        (result.output || result.error || "Code executed successfully") +
        (result.executionTime ? `\n\n⏱ Completed in ${result.executionTime}ms` : "")
      )
      onRun?.(code)
    } catch {
      setRunOutput("Error: could not connect to the execution server.")
    } finally {
      setIsRunning(false)
    }
  }

  const pollSubmissionStatus = (submissionId: number) => {
    pollCountRef.current = 0

    const poll = async () => {
      if (pollCountRef.current >= MAX_POLL_ATTEMPTS) {
        setIsSubmitting(false)
        setSubmitStatus("")
        setSubmitResult({ success: false, message: "Judging timed out. Please try again." })
        return
      }

      pollCountRef.current++

      try {
        const res = await fetch(`/api/submissions/${submissionId}/status`)
        const data = await res.json()

        if (data.status === "processing") {
          setSubmitStatus("Evaluating your code…")
        } else if (data.status === "pending") {
          setSubmitStatus("Queued for evaluation…")
        }

        if (data.isDone) {
          const result: SubmitResult = {
            success: data.success,
            message: data.message,
            passedTests: data.passedTests,
            totalTests: data.totalTests,
            testCases: data.testCases ?? undefined,
          }
          setSubmitResult(result)
          setIsSubmitting(false)
          setSubmitStatus("")
          onSubmit?.(code, result)
          return
        }
      } catch {
        // network hiccup — keep polling
      }

      pollRef.current = setTimeout(poll, POLL_INTERVAL_MS)
    }

    poll()
  }

  const handleSubmit = async () => {
    if (pollRef.current) clearTimeout(pollRef.current)
    setIsSubmitting(true)
    setActiveTab("results")
    setSubmitResult(null)
    setSubmitStatus("Submitting…")

    try {
      const response = await fetch("/api/code/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code, language, problemId }),
      })
      const data = await response.json()

      if (data.submissionId) {
        setSubmitStatus("Queued for evaluation…")
        pollSubmissionStatus(data.submissionId)
      } else {
        const result: SubmitResult = {
          success: data.success ?? false,
          message: data.message ?? data.error,
          passedTests: data.passedTests,
          totalTests: data.totalTests,
          testCases: data.testCases,
        }
        setSubmitResult(result)
        setIsSubmitting(false)
        setSubmitStatus("")
        onSubmit?.(code, result)
      }
    } catch {
      const errResult = { success: false, message: "Error: could not connect to the execution server." }
      setSubmitResult(errResult)
      setIsSubmitting(false)
      setSubmitStatus("")
      onSubmit?.(code, errResult)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
          <TabsTrigger value="code" className="data-[state=active]:bg-blue-600">
            Code
          </TabsTrigger>
          <TabsTrigger value="output" className="data-[state=active]:bg-blue-600">
            Output
          </TabsTrigger>
          <TabsTrigger value="results" className="data-[state=active]:bg-blue-600">
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="flex-1 mt-4">
          <Card className="h-full bg-gray-900 border-gray-700">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full min-h-[300px] p-4 bg-transparent text-gray-100 font-mono text-sm resize-none border-none outline-none"
              placeholder="Write your code here..."
              spellCheck={false}
            />
          </Card>
        </TabsContent>

        <TabsContent value="output" className="flex-1 mt-4">
          <Card className="h-full bg-gray-900 border-gray-700 overflow-auto">
            <pre className="w-full h-full p-4 text-gray-100 font-mono text-sm whitespace-pre-wrap">
              {runOutput || "No output yet. Click Run to execute your code."}
            </pre>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="flex-1 mt-4 overflow-auto">
          {isSubmitting && !submitResult ? (
            <Card className="h-full bg-gray-900 border-gray-700">
              <div className="p-6 flex flex-col items-center justify-center gap-3 text-gray-300">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                <p className="font-mono text-sm">{submitStatus || "Submitting…"}</p>
              </div>
            </Card>
          ) : !submitResult ? (
            <Card className="h-full bg-gray-900 border-gray-700">
              <div className="p-4 text-gray-400 font-mono text-sm">
                No submission yet. Click Submit to test your solution.
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              <Card className={`border ${submitResult.success ? "border-green-500/40 bg-green-950/20" : "border-red-500/40 bg-red-950/20"}`}>
                <div className="p-4 flex items-center gap-3">
                  {submitResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                  )}
                  <div>
                    <p className={`font-semibold ${submitResult.success ? "text-green-400" : "text-red-400"}`}>
                      {submitResult.message}
                    </p>
                    {submitResult.totalTests != null && (
                      <p className="text-sm text-gray-400 mt-0.5">
                        {submitResult.passedTests}/{submitResult.totalTests} test cases passed
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {submitResult.testCases && submitResult.testCases.length > 0 && (
                <div className="space-y-2">
                  {submitResult.testCases.map((tc, i) => (
                    <Card key={i} className={`border ${tc.passed ? "border-green-500/20 bg-gray-900" : "border-red-500/30 bg-gray-900"}`}>
                      <div className="p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-200">
                            Case {i + 1}: {tc.description}
                          </span>
                          <Badge className={tc.passed ? "bg-green-500/15 text-green-400 border-green-500/30" : "bg-red-500/15 text-red-400 border-red-500/30"}>
                            {tc.passed ? "Passed" : "Failed"}
                          </Badge>
                        </div>
                        {!tc.passed && (
                          <div className="font-mono text-xs space-y-1">
                            <div className="text-gray-400">
                              <span className="text-gray-500">Input: </span>{tc.input}
                            </div>
                            <div className="text-green-400">
                              <span className="text-gray-500">Expected: </span>{tc.expected}
                            </div>
                            <div className="text-red-400">
                              <span className="text-gray-500">Got: </span>{tc.actual}
                            </div>
                            {tc.stderr && (
                              <div className="text-yellow-400 mt-1 whitespace-pre-wrap">
                                <span className="text-gray-500">Error: </span>{tc.stderr}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex gap-3 mt-4">
        <Button onClick={handleRun} disabled={isRunning} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
          <Play className="w-4 h-4 mr-2" />
          {isRunning ? "Running..." : "Run"}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
          {isSubmitting ? submitStatus || "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  )
}

export default CodeEditor
