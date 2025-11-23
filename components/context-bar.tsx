"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useTimer } from "@/contexts/timer-context"

interface ContextBarProps {
  location: string
  phase?: "contribution" | "auction" | "drawing" | "result"
  nextRoundSeconds?: number
}

export function ContextBar({ location, phase = "auction", nextRoundSeconds }: ContextBarProps) {
  const [timeLeft, setTimeLeft] = useState(nextRoundSeconds || 0)
  const { skipToNextRound } = useTimer()

  useEffect(() => {
    if (!nextRoundSeconds) return

    // Update timeLeft when nextRoundSeconds prop changes
    setTimeLeft(nextRoundSeconds)

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [nextRoundSeconds])

  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}H ${minutes}M ${secs}S`
  }

  const phaseStyles = {
    contribution: "bg-success text-success-foreground border-success-foreground",
    auction: "bg-accent text-accent-foreground border-accent-foreground",
    drawing: "bg-warning text-warning-foreground border-warning-foreground",
    result: "bg-muted text-muted-foreground border-muted-foreground",
  }

  return (
    <div className={`h-16 ${phaseStyles[phase]} flex items-center justify-between px-4 md:px-6 border-b-2`}>
      {/* Left: Location */}
      <h2 className="text-base font-bold leading-tight">{location}</h2>

      {/* Right: Countdown timer with skip button */}
      {nextRoundSeconds !== undefined && (
        <div className="flex items-center gap-2 md:gap-3">
          <div className="text-right">
            <div className="text-[10px] md:text-xs mb-0.5">NEXT ROUND IN:</div>
            <div className="text-xs md:text-sm font-mono font-bold">{formatCountdown(timeLeft)}</div>
          </div>

          <button
            onClick={skipToNextRound}
            className="w-8 h-8 flex items-center justify-center border-2 border-current hover:bg-current hover:text-[var(--bg-color)] transition-colors flex-shrink-0"
            style={
              {
                "--bg-color":
                  phase === "contribution"
                    ? "hsl(var(--success))"
                    : phase === "auction"
                      ? "hsl(var(--accent))"
                      : phase === "drawing"
                        ? "hsl(var(--warning))"
                        : "hsl(var(--muted))",
              } as React.CSSProperties
            }
            title="Skip to next round"
          >
            <span className="text-lg leading-none">▶</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default ContextBar
