import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Simulate user registration - in a real app, this would save to a database
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Mock successful registration
    const user = {
      id: Date.now().toString(),
      name,
      email,
      avatar: "/diverse-user-avatars.png",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ user, token: "mock-jwt-token" })
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
