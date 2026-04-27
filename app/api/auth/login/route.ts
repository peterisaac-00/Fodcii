import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Simulate authentication - in a real app, this would verify against a database
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock user validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Mock successful login
    const user = {
      id: "1",
      email,
      name: email.split("@")[0],
      avatar: "/diverse-user-avatars.png",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ user, token: "mock-jwt-token" })
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
