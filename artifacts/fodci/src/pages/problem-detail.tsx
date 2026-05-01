import { useState, useRef, useEffect } from "react"
import { useParams, useLocation } from "wouter"
import { Navigation } from "@/components/navigation"
import { PageContainer } from "@/components/page-container"
import { CodeEditor } from "@/components/code-editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Users, CheckCircle } from "lucide-react"
import Timer, { type TimerRef } from "@/components/ui/timer"

const problemsData: Record<number, {
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
}> = {
  1: {
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
    constraints: ["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹", "-10⁹ ≤ target ≤ 10⁹", "Only one valid answer exists."],
    solved: false,
    submissions: 1234,
    acceptanceRate: 85.2,
    starterCode: {
      python: `def two_sum(nums, target):\n    # Write your solution here\n    pass\n\nnums = [2, 7, 11, 15]\ntarget = 9\nresult = two_sum(nums, target)\nprint(result)`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your solution here\n    return {};\n}\n\nint main() {\n    vector<int> nums = {2, 7, 11, 15};\n    int target = 9;\n    auto result = twoSum(nums, target);\n    for (int i : result) cout << i << " ";\n    return 0;\n}`,
      javascript: `function twoSum(nums, target) {\n    // Write your solution here\n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9));`,
    },
  },
  2: {
    id: 2,
    title: "Reverse String",
    category: "Strings",
    difficulty: "Easy",
    level: 1,
    description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.`,
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explanation: "The string is reversed in-place." },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁵", "s[i] is a printable ascii character."],
    solved: true,
    submissions: 892,
    acceptanceRate: 92.1,
    starterCode: {
      python: `def reverse_string(s):\n    # Write your solution here\n    pass\n\ns = ["h","e","l","l","o"]\nreverse_string(s)\nprint(s)`,
      cpp: `void reverseString(vector<char>& s) {\n    // Write your solution here\n}`,
      javascript: `function reverseString(s) {\n    // Write your solution here\n}`,
    },
  },
  3: {
    id: 3,
    title: "Binary Search",
    category: "Algorithms",
    difficulty: "Medium",
    level: 2,
    description: `Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.

You must write an algorithm with O(log n) runtime complexity.`,
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 exists in nums and its index is 4" },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1", explanation: "2 does not exist in nums so return -1" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁴", "-10⁴ < nums[i], target < 10⁴", "All the integers in nums are unique.", "nums is sorted in ascending order."],
    solved: false,
    submissions: 567,
    acceptanceRate: 78.3,
    starterCode: {
      python: `def binary_search(nums, target):\n    # Write your solution here\n    pass\n\nprint(binary_search([-1, 0, 3, 5, 9, 12], 9))`,
      cpp: `int search(vector<int>& nums, int target) {\n    // Write your solution here\n    return -1;\n}`,
      javascript: `function search(nums, target) {\n    // Write your solution here\n}\n\nconsole.log(search([-1,0,3,5,9,12], 9));`,
    },
  },
  4: {
    id: 4,
    title: "Valid Parentheses",
    category: "Stacks",
    difficulty: "Easy",
    level: 1,
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
- Open brackets must be closed by the same type of brackets.
- Open brackets must be closed in the correct order.`,
    examples: [
      { input: 's = "()"', output: "true", explanation: "The string contains a valid pair." },
      { input: 's = "()[]{}"', output: "true", explanation: "All bracket types are valid." },
      { input: 's = "(]"', output: "false", explanation: "Brackets are not closed in the correct order." },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁴", "s consists of parentheses only '()[]{}'."],
    solved: false,
    submissions: 745,
    acceptanceRate: 88.4,
    starterCode: {
      python: `def is_valid(s):\n    # Write your solution here\n    pass\n\nprint(is_valid("()[]{}"))`,
      cpp: `bool isValid(string s) {\n    // Write your solution here\n    return false;\n}`,
      javascript: `function isValid(s) {\n    // Write your solution here\n}\n\nconsole.log(isValid("()[]{}"));`,
    },
  },
  5: {
    id: 5,
    title: "Maximum Subarray",
    category: "Dynamic Programming",
    difficulty: "Medium",
    level: 2,
    description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.`,
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
    solved: false,
    submissions: 432,
    acceptanceRate: 72.1,
    starterCode: {
      python: `def max_subarray(nums):\n    # Write your solution here\n    pass\n\nprint(max_subarray([-2,1,-3,4,-1,2,1,-5,4]))`,
      cpp: `int maxSubArray(vector<int>& nums) {\n    // Write your solution here\n    return 0;\n}`,
      javascript: `function maxSubArray(nums) {\n    // Write your solution here\n}\n\nconsole.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]));`,
    },
  },
  6: {
    id: 6,
    title: "Graph Traversal (BFS/DFS)",
    category: "Graphs",
    difficulty: "Hard",
    level: 3,
    description: `Given a directed graph with n nodes labeled from 0 to n-1, find all reachable nodes from the given source node.

Return the nodes in BFS order.`,
    examples: [
      { input: "graph = [[1,2],[3],[3],[]], source = 0", output: "[0,1,2,3]", explanation: "All nodes are reachable from 0." },
    ],
    constraints: ["1 ≤ n ≤ 10⁴", "0 ≤ graph[i].length ≤ n"],
    solved: false,
    submissions: 201,
    acceptanceRate: 61.3,
    starterCode: {
      python: `from collections import deque\n\ndef bfs(graph, source):\n    # Write your solution here\n    pass\n\nprint(bfs([[1,2],[3],[3],[]], 0))`,
      cpp: `vector<int> bfs(vector<vector<int>>& graph, int source) {\n    // Write your solution here\n    return {};\n}`,
      javascript: `function bfs(graph, source) {\n    // Write your solution here\n}\n\nconsole.log(bfs([[1,2],[3],[3],[]], 0));`,
    },
  },
}

export default function ProblemDetailPage() {
  const params = useParams<{ id: string }>()
  const [, navigate] = useLocation()
  const [selectedLanguage, setSelectedLanguage] = useState("python")
  const timerRef = useRef<TimerRef>(null)

  const problemId = parseInt(params.id || "1")
  const problem = problemsData[problemId]

  useEffect(() => {
    setSelectedLanguage("python")
  }, [problemId])

  if (!problem) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96 flex-col gap-4">
          <h1 className="text-2xl font-bold">Problem not found</h1>
          <Button onClick={() => navigate("/problems")}>Back to Problems</Button>
        </div>
      </div>
    )
  }

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
                  initialCode={problem.starterCode[selectedLanguage]}
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
