"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface CircleAuctionData {
  circleId: string
  userBid: number
  userWeight: number
}

interface UserContextType {
  joinedCircles: string[]
  tokens: number
  circleBids: CircleAuctionData[]
  addTokens: (amount: number) => void
  subtractTokens: (amount: number) => void
  joinCircle: (circleId: string) => void
  leaveCircle: (circleId: string) => void
  isJoined: (circleId: string) => boolean
  placeBid: (circleId: string, amount: number) => void
  getBidForCircle: (circleId: string) => CircleAuctionData | undefined
  hasBidForCircle: (circleId: string) => boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [joinedCircles, setJoinedCircles] = useState<string[]>([])
  const [tokens, setTokens] = useState<number>(0)
  const [circleBids, setCircleBids] = useState<CircleAuctionData[]>([])

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

  const placeBid = (circleId: string, amount: number) => {
    setCircleBids((prev) => {
      const existing = prev.find((bid) => bid.circleId === circleId)
      if (existing) {
        // Update existing bid
        return prev.map((bid) =>
          bid.circleId === circleId ? { ...bid, userBid: amount, userWeight: calculateWeight(amount) } : bid,
        )
      } else {
        // Add new bid
        return [...prev, { circleId, userBid: amount, userWeight: calculateWeight(amount) }]
      }
    })
  }

  const getBidForCircle = (circleId: string) => {
    return circleBids.find((bid) => bid.circleId === circleId)
  }

  const hasBidForCircle = (circleId: string) => {
    return circleBids.some((bid) => bid.circleId === circleId)
  }

  // Simple weight calculation for demo purposes
  const calculateWeight = (amount: number) => {
    const totalBids = 420 // Mock total
    return (amount / totalBids) * 100
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
        hasBidForCircle,
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
