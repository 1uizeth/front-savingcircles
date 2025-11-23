export interface Circle {
  id: string
  name: string
  address: string
  members: number
  maxMembers: number
  round: number
  totalRounds: number
  phase: "contribution" | "auction" | "drawing" | "result"
  prize: number
  timeLeft: number
  installment: number
  ticketPrice: number
  totalContributions: number
}

export interface UserCircleData {
  circleId: string
  yourContribution: number
  quotas: number
  status: "active" | "inactive" | "exited"
}

// All available circles in the platform
const DEFAULT_CONTRACT_ADDRESS = "0xfDF73F61146B9050FFe4b755364B9CAC670ea5b2"

export const allCircles: Circle[] = [
  {
    id: "1",
    name: "ALPHA CIRCLE",
    address: DEFAULT_CONTRACT_ADDRESS,
    members: 1,
    maxMembers: 10,
    round: 1,
    totalRounds: 10,
    phase: "contribution",
    prize: 5000,
    timeLeft: 6 * 24 * 60 * 60 + 23 * 60 * 60,
    installment: 500,
    ticketPrice: 10,
    totalContributions: 0,
  },
]

// Mock user data for joined circles (would come from backend/blockchain)
export const mockUserCircleData: Record<string, UserCircleData> = {
  "1": {
    circleId: "1",
    yourContribution: 0,
    quotas: 0,
    status: "active",
  },
}

export function getCircleById(id: string): Circle | undefined {
  return allCircles.find((c) => c.id === id)
}

export function getUserCircleData(circleId: string): UserCircleData | undefined {
  return mockUserCircleData[circleId]
}
