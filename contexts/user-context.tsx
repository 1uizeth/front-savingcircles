"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface UserContextType {
  joinedCircles: string[]
  tokens: number
  addTokens: (amount: number) => void
  subtractTokens: (amount: number) => void
  joinCircle: (circleId: string) => void
  leaveCircle: (circleId: string) => void
  isJoined: (circleId: string) => boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [joinedCircles, setJoinedCircles] = useState<string[]>([])
  const [tokens, setTokens] = useState<number>(0)

  const addTokens = (amount: number) => {
    setTokens((prev) => prev + amount)
  }

  const subtractTokens = (amount: number) => {
    setTokens((prev) => Math.max(0, prev - amount))
  }

  const joinCircle = (circleId: string) => {
    setJoinedCircles((prev) => {
      if (prev.includes(circleId)) return prev
      return [...prev, circleId]
    })
  }

  const leaveCircle = (circleId: string) => {
    setJoinedCircles((prev) => prev.filter((id) => id !== circleId))
  }

  const isJoined = (circleId: string) => {
    return joinedCircles.includes(circleId)
  }

  return (
    <UserContext.Provider
      value={{ joinedCircles, tokens, addTokens, subtractTokens, joinCircle, leaveCircle, isJoined }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
