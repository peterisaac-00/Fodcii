import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { code, language, problemId } = await request.json()

    // Simulate code execution - in a real app, this would use a code execution service
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    // Mock execution results
    const mockResults = {
      success: Math.random() > 0.3, // 70% success rate
      output: generateMockOutput(language, code),
      executionTime: Math.floor(Math.random() * 500) + 50,
      memoryUsed: Math.floor(Math.random() * 50) + 10,
    }

    return NextResponse.json(mockResults)
  } catch (error) {
    return NextResponse.json({ error: "Failed to execute code" }, { status: 500 })
  }
}

function generateMockOutput(language: string, code: string) {
  const outputs = {
    python: ["[0, 1]", "Hello, World!", "['o', 'l', 'l', 'e', 'h']", "4", "True", "42"],
    cpp: ["0 1", "Hello, World!", "o l l e h", "4", "1", "42"],
    javascript: ["[0, 1]", "Hello, World!", "['o', 'l', 'l', 'e', 'h']", "4", "true", "42"],
  }

  const languageOutputs = outputs[language as keyof typeof outputs] || outputs.python
  const randomOutput = languageOutputs[Math.floor(Math.random() * languageOutputs.length)]

  return `Code executed successfully!
Output: ${randomOutput}
Execution completed in ${Math.floor(Math.random() * 500) + 50}ms`
}
