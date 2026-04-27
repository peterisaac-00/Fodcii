"use client"

import { forwardRef, useImperativeHandle, useState, useEffect } from "react"

export type TimerRef = {
  pause: () => void
  resume: () => void
  stopFinal: () => void
}

const Timer = forwardRef<TimerRef>((props, ref) => {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  const [isStoppedFinal, setIsStoppedFinal] = useState(false)

  useEffect(() => {
    if (!isRunning || isStoppedFinal) return

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, isStoppedFinal])

  useImperativeHandle(ref, () => ({
    pause: () => setIsRunning(false),
    resume: () => setIsRunning(true),
    stopFinal: () => {
      setIsRunning(false)
      setIsStoppedFinal(true)
    },
  }))

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return (
    <span className="px-3 py-1 rounded-lg bg-black text-green-400 font-mono shadow-lg border border-blue-500">
      {minutes}:{remainingSeconds.toString().padStart(2, "0")}
    </span>
  )
})

Timer.displayName = "Timer"
export default Timer
