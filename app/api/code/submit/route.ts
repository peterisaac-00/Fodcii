import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { code, language, problemId, userId } = await request.json()

    // Simulate code submission and testing - in a real app, this would run test cases
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000))

    // Mock submission results
    const testCases = [
      { input: "Test case 1", expected: "Expected output 1", passed: true },
      { input: "Test case 2", expected: "Expected output 2", passed: true },
      { input: "Test case 3", expected: "Expected output 3", passed: Math.random() > 0.2 },
      { input: "Test case 4", expected: "Expected output 4", passed: Math.random() > 0.3 },
    ]

    const passedTests = testCases.filter((test) => test.passed).length
    const totalTests = testCases.length
    const success = passedTests === totalTests

    const result = {
      success,
      passedTests,
      totalTests,
      testCases,
      executionTime: Math.floor(Math.random() * 1000) + 100,
      memoryUsed: Math.floor(Math.random() * 100) + 20,
      message: success
        ? "Congratulations! All test cases passed."
        : `${passedTests}/${totalTests} test cases passed. Keep trying!`,
    }

    // In a real app, you would save the submission to the database here
    if (success) {
      // Mark problem as solved for the user
      console.log(`Problem ${problemId} solved by user ${userId}`)
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit code" }, { status: 500 })
  }
}
