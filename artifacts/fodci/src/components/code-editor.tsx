import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Play, Send } from "lucide-react"

interface SubmitResult {
  success: boolean
  message?: string
  passedTests?: number
  totalTests?: number
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

export function CodeEditor({ language, initialCode, problemId, onRun, onSubmit }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode || languageTemplates[language] || "")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRun = async () => {
    setIsRunning(true)
    try {
      const response = await fetch("/api/code/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, problemId }),
      })
      const result = await response.json()
      setOutput(result.output || result.error || "Code executed successfully")
      onRun?.(code)
    } catch {
      setOutput("Error running code")
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/code/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, problemId }),
      })
      const result: SubmitResult & { message?: string } = await response.json()
      setOutput(result.message || "Solution submitted successfully")
      onSubmit?.(code, result)
    } catch {
      setOutput("Error submitting solution")
      onSubmit?.(code, { success: false })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="code" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
          <TabsTrigger value="code" className="data-[state=active]:bg-blue-600">
            Code
          </TabsTrigger>
          <TabsTrigger value="output" className="data-[state=active]:bg-blue-600">
            Output
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
          <Card className="h-full bg-gray-900 border-gray-700">
            <pre className="w-full h-full p-4 text-gray-100 font-mono text-sm whitespace-pre-wrap overflow-auto">
              {output || "No output yet. Run your code to see results."}
            </pre>
          </Card>
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
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  )
}

export default CodeEditor
