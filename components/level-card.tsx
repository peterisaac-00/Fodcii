"use client"

import { type ReactNode, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedButton } from "./animated-button"
import { cn } from "@/lib/utils"

interface LevelCardProps {
  title: string
  description: string
  problemCount: number
  icon: ReactNode
  level: 1 | 2 | 3
  onStartClick: () => void
}

const levelColors = {
  1: "from-green-500/20 to-green-600/20 border-green-500/30",
  2: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30",
  3: "from-red-500/20 to-pink-500/20 border-red-500/30",
}

const levelLabels = {
  1: "Beginner",
  2: "Intermediate",
  3: "Advanced",
}

export function LevelCard({ title, description, problemCount, icon, level, onStartClick }: LevelCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 cursor-pointer group",
        "hover:scale-105 hover:shadow-xl hover:shadow-primary/10",
        "bg-gradient-to-br",
        levelColors[level],
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background/50 backdrop-blur">
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <Badge variant="secondary" className="mt-1">
                {levelLabels[level]}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <CardDescription className="text-sm text-muted-foreground mb-4">{description}</CardDescription>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground text-yellow-500">{problemCount} problems</span>
          <br />
          <br />
        </div>
      </CardContent>

      {/* Animated background effect */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300",
          "group-hover:opacity-10",
          level === 1 && "from-green-400 to-green-600",
          level === 2 && "from-yellow-400 to-orange-600",
          level === 3 && "from-red-400 to-pink-600",
        )}
      />
    </Card>
  )
}
