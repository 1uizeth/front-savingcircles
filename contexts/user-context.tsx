"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface CircleAuctionData {
  userBid: number
  userWeight: number
}

interface UserContextType {
  joinedCircles: string[]
  tokens: number
  circleBids: Record<string, CircleAuctionData>
  addTokens: (amount: number) => void
  subtractTokens: (amount: number) => void
  joinCircle: (circleId: string) => void
  leaveCircle: (circleId: string) => void
  isJoined: (circleId: string) => boolean
  placeBid: (circleId: string, amount: number, weight: number) => void
  getBidForCircle: (circleId: string) => CircleAuctionData | null
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [joinedCircles, setJoinedCircles] = useState<string[]>([])
  const [tokens, setTokens] = useState<number>(0)
  const [circleBids, setCircleBids] = useState<Record<string, CircleAuctionData>>({})

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

  const placeBid = (circleId: string, amount: number, weight: number) => {
    setCircleBids((prev) => ({
      ...prev,
      [circleId]: { userBid: amount, userWeight: weight },
    }))
    subtractTokens(amount)
  }

  const getBidForCircle = (circleId: string): CircleAuctionData | null => {
    return circleBids[circleId] || null
  }

  return (
    <UserContext.Provider
      value={{
        joinedCircles,
        tokens,
        circleBids,
        addTokens,
        subtractTokens,
        joinCircle,
        leaveCircle,
        isJoined,
        placeBid,
        getBidForCircle,
      }}
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
