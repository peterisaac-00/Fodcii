import { type ReactNode } from "react"
import { useLocation } from "wouter"
import { useUser } from "@clerk/react"

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ children, redirectTo = "/sign-in" }: ProtectedRouteProps) {
  const { user, isLoaded } = useUser()
  const [, navigate] = useLocation()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    navigate(redirectTo)
    return null
  }

  return <>{children}</>
}
