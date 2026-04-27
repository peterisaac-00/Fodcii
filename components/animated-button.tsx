"use client"

import { type ReactNode, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps {
  children: ReactNode
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export function AnimatedButton({
  children,
  className,
  variant = "default",
  size = "default",
  onClick,
  disabled,
  type = "button",
}: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative overflow-hidden transition-all duration-300 ease-out",
        "hover:scale-105 hover:shadow-lg hover:shadow-primary/25",
        "active:scale-95",
        isHovered && "animate-pulse",
        className,
      )}
    >
      <span className="relative z-10">{children}</span>
      {isHovered && <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 animate-shimmer" />}
    </Button>
  )
}
