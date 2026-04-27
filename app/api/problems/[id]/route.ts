import { type NextRequest, NextResponse } from "next/server"

// Mock problem data - in a real app, this would come from a database
const problemsData = {
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
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
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
    starterCode: {
      python: `def two_sum(nums, target):
    # Write your solution here
    pass

# Test your solution
nums = [2, 7, 11, 15]
target = 9
result = two_sum(nums, target)
print(result)`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your solution here
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> result = twoSum(nums, target);
    
    for (int i : result) {
        cout << i << " ";
    }
    return 0;
}`,
      javascript: `function twoSum(nums, target) {
    // Write your solution here
    
}

// Test your solution
const nums = [2, 7, 11, 15];
const target = 9;
const result = twoSum(nums, target);
console.log(result);`,
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
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
        explanation: "The string is reversed in-place.",
      },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁵", "s[i] is a printable ascii character."],
    solved: true,
    submissions: 892,
    acceptanceRate: 92.1,
    starterCode: {
      python: `def reverse_string(s):
    # Write your solution here
    pass`,
      cpp: `void reverseString(vector<char>& s) {
    // Write your solution here
}`,
      javascript: `function reverseString(s) {
    // Write your solution here
}`,
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
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        explanation: "9 exists in nums and its index is 4",
      },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 10⁴",
      "-10⁴ < nums[i], target < 10⁴",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order.",
    ],
    solved: false,
    submissions: 567,
    acceptanceRate: 78.3,
    starterCode: {
      python: `def binary_search(nums, target):
    # Write your solution here
    pass`,
      cpp: `int search(vector<int>& nums, int target) {
    // Write your solution here
    return -1;
}`,
      javascript: `function search(nums, target) {
    // Write your solution here
}`,
    },
  },
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const problemId = Number.parseInt(params.id)
  const problem = problemsData[problemId as keyof typeof problemsData]

  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 })
  }

  return NextResponse.json({ problem })
}
