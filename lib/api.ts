// API utility functions for making requests to our backend

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `/api${endpoint}`
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "An error occurred" }))
    throw new ApiError(response.status, error.error || "An error occurred")
  }

  return response.json()
}

// Problems API
export const problemsApi = {
  getAll: (filters?: { level?: string; category?: string; difficulty?: string; search?: string }) => {
    const params = new URLSearchParams()
    if (filters?.level) params.append("level", filters.level)
    if (filters?.category) params.append("category", filters.category)
    if (filters?.difficulty) params.append("difficulty", filters.difficulty)
    if (filters?.search) params.append("search", filters.search)

    const query = params.toString()
    return apiRequest<{ problems: any[] }>(`/problems${query ? `?${query}` : ""}`)
  },

  getById: (id: number) => apiRequest<{ problem: any }>(`/problems/${id}`),
}

// Code execution API
export const codeApi = {
  run: (code: string, language: string, problemId: number) =>
    apiRequest<{
      success: boolean
      output: string
      executionTime: number
      memoryUsed: number
    }>("/code/run", {
      method: "POST",
      body: JSON.stringify({ code, language, problemId }),
    }),

  submit: (code: string, language: string, problemId: number, userId?: string) =>
    apiRequest<{
      success: boolean
      passedTests: number
      totalTests: number
      testCases: any[]
      executionTime: number
      memoryUsed: number
      message: string
    }>("/code/submit", {
      method: "POST",
      body: JSON.stringify({ code, language, problemId, userId }),
    }),
}

// Authentication API
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<{ user: any; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    apiRequest<{ user: any; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
}

// User API
export const userApi = {
  getProfile: () => apiRequest<any>("/user/profile"),

  updateProfile: (updates: any) =>
    apiRequest<{ message: string }>("/user/profile", {
      method: "PUT",
      body: JSON.stringify(updates),
    }),
}

// Leaderboard API
export const leaderboardApi = {
  get: (period = "all-time") => apiRequest<{ leaderboard: any[]; stats: any }>(`/leaderboard?period=${period}`),
}
