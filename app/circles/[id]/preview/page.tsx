"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import ContextBar from "@/components/context-bar"
import { useTimer } from "@/contexts/timer-context"
import { useUser } from "@/contexts/user-context"
import { getCircleById } from "@/lib/mock-data"
import { useCircleContractData } from "@/lib/hooks/use-circle-contract-data"

export default function CirclePreviewPage() {
  const router = useRouter()
  const params = useParams()
  const rawCircleId = params?.id
  const circleId = Array.isArray(rawCircleId) ? rawCircleId[0] : rawCircleId
  const { nextRoundSeconds } = useTimer()
  const { isJoined, joinCircle } = useUser()
  const [showModal, setShowModal] = useState(false)
  const [step, setStep] = useState<"confirm" | "success">("confirm")

  if (!circleId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">LOADING CIRCLE…</div>
      </div>
    )
  }

  const circle = getCircleById(circleId)
  const { data: contractData, loading: isLoadingContract, error: contractError } = useCircleContractData(circle?.address)

  const installmentAmount = contractData?.installmentSize ?? circle?.installment ?? 0
  const totalRounds = contractData?.numRounds ?? circle?.totalRounds ?? 0
  const displayRound = contractData ? Math.max(1, contractData.currRound + 1) : circle?.round ?? 1
  const prizeAmount = contractData ? contractData.installmentSize * (contractData.numUsers ?? 0) : circle?.prize ?? 0
  const membersCount = contractData?.numUsers ?? circle?.members ?? 0
  const poolToDate = contractData
    ? contractData.installmentSize * (contractData.numUsers ?? 0) * Math.max(0, contractData.currRound)
    : circle?.totalContributions ?? 0
  const formatAmount = (value?: number, unit = "USDC") => {
    if (value === undefined || Number.isNaN(value)) return "—"
    return `${value.toLocaleString()} ${unit}`
  }

  if (!circle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">CIRCLE NOT FOUND</div>
      </div>
    )
  }

  // If already joined, redirect to dashboard
  if (isJoined(circleId)) {
    router.push(`/circles/${circleId}`)
    return null
  }

  const formatTime = (seconds: number) => {
    if (seconds >= 24 * 60 * 60) {
      const days = Math.floor(seconds / (24 * 60 * 60))
      const hours = Math.floor((seconds % (24 * 60 * 60)) / 3600)
      return `${days}d ${hours}h`
    }
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const handleJoinClick = () => {
    setShowModal(true)
    setStep("confirm")
  }

  const handleConfirm = () => {
    joinCircle(circleId)
    setStep("success")
  }

  const handleComplete = () => {
    router.push(`/circles/${circleId}`)
  }

  return (
    <>
      <div className="min-h-screen flex bg-white">
        <DesktopSidebar />

        <main className="flex-1 md:ml-[240px] pb-20 md:pb-0">
          <ContextBar
            location={`${contractData?.name ?? circle.name} PREVIEW`}
            nextRoundSeconds={nextRoundSeconds}
          />

          {contractError && (
            <div className="border-b-2 border-black bg-red-50 text-red-900 p-4 text-sm">
              Failed to load on-chain data: {contractError}
            </div>
          )}
          {isLoadingContract && !contractError && (
            <div className="border-b-2 border-black bg-blue-50 text-blue-900 p-4 text-sm">Syncing on-chain data…</div>
          )}

          {/* Circle Header Zone */}
          <div className="border-b-2 border-black p-8 relative">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
              <div>
                <div className="text-6xl font-bold mb-2">{contractData?.name ?? circle.name}</div>
                <div className="text-2xl">ROUND {displayRound}</div>
                <div className="text-xs uppercase text-gray-500 mt-3">CONTRACT</div>
                <div className="text-sm font-mono break-all">{circle.address}</div>
              </div>
              <div className="text-right">
                <div className="text-sm mb-1">TIME LEFT</div>
                <div className="text-4xl font-bold">{formatTime(circle.timeLeft)}</div>
              </div>
            </div>

            {/* Phase Status */}
            <div className="inline-block px-6 py-3 border-2 border-black bg-white">
              <div className="text-sm mb-1">CURRENT PHASE</div>
              <div className="text-3xl font-bold">{circle.phase.toUpperCase()}</div>
            </div>
          </div>

          {/* Primary Stats Zone */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black border-b-2 border-black">
            <div className="p-8">
              <div className="text-sm mb-2">PRIZE</div>
              <div className="text-6xl font-bold mb-2">{prizeAmount}</div>
              <div className="text-xl">USDC</div>
            </div>
            <div className="p-8">
              <div className="text-sm mb-2">INSTALLMENT</div>
              <div className="text-6xl font-bold mb-2">{installmentAmount}</div>
              <div className="text-xl">USDC / ROUND</div>
            </div>
            <div className="p-8">
              <div className="text-sm mb-2">TOTAL ROUNDS</div>
              <div className="text-6xl font-bold mb-2">{totalRounds}</div>
              <div className="text-xl">ROUNDS</div>
            </div>
          </div>

          {/* Secondary Stats Zone */}
          <div className="grid grid-cols-2 divide-x-2 divide-black border-b-2 border-black">
            <div className="p-6">
              <div className="text-xs mb-1">YOUR CONTRIBUTION</div>
              <div className="text-3xl font-bold">0 USDC</div>
            </div>
            <div className="p-6">
              <div className="text-xs mb-1">TOTAL POOL</div>
              <div className="text-3xl font-bold">{formatAmount(poolToDate)}</div>
            </div>
            <div className="p-6">
              <div className="text-xs mb-1">ACTIVE MEMBERS</div>
              <div className="text-3xl font-bold">
                {membersCount}/{membersCount}
              </div>
            </div>
            <div className="p-6">
              <div className="text-xs mb-1">YOUR STATUS</div>
              <div className="text-3xl font-bold">NOT JOINED</div>
            </div>
          </div>

          {/* MNDG Auction & Rewards Section */}
          <div className="border-b-2 border-black bg-gray-50 p-8">
            <div className="text-2xl font-bold mb-6">AUCTION & REWARDS (MNDG)</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-xs mb-2">MAX AUCTION PER ROUND</div>
                <div className="text-4xl font-bold">
                  {contractData?.maxProtocolTokenInAuction !== undefined
                    ? `${contractData.maxProtocolTokenInAuction.toLocaleString()} MNDG`
                    : "—"}
                </div>
              </div>
              <div>
                <div className="text-xs mb-2">REWARD PER INSTALLMENT</div>
                <div className="text-4xl font-bold">
                  {contractData?.protocolTokenRewardPerInstallment ?? 10} MNDG
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white border-2 border-black text-sm space-y-2">
              <p>
                <strong>Each round:</strong> Pay {installmentAmount} USDC installment + deposit MNDG (up to{" "}
                {contractData?.maxProtocolTokenInAuction ?? 100} MNDG) to increase your odds.
              </p>
              <p>
                <strong>Earn rewards:</strong> You earn {contractData?.protocolTokenRewardPerInstallment ?? 10} MNDG
                every time you pay an installment.
              </p>
            </div>
          </div>

          {/* Action Zone */}
          <div className="p-8 border-b-2 border-black">
            <button
              onClick={handleJoinClick}
              className="w-full h-20 text-2xl font-bold border-2 border-black bg-white hover:bg-gray-100 transition-colors"
            >
              JOIN CIRCLE
            </button>
          </div>
        </main>

        <MobileBottomNav />
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowModal(false)} />

          {/* Modal Content */}
          <div className="relative w-full max-w-md">
            {step === "confirm" && (
              <div className="bg-white border-4 border-black">
                <div className="h-14 bg-gray-100 flex items-center px-6 border-b-2 border-black">
                  <h2 className="text-lg font-bold">CONFIRM PURCHASE</h2>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <p className="text-sm mb-2">You're buying a ticket to:</p>
                    <p className="text-2xl font-bold">{circle.name}</p>
                  </div>

                  <div className="border-t-2 border-black pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="font-bold">Ticket Price:</span>
                      <span className="font-bold">{circle.ticketPrice} USDC</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Installment per round:</span>
                      <span>{installmentAmount} USDC</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total rounds:</span>
                      <span>{totalRounds}</span>
                    </div>
                  </div>

                  <p className="text-sm pt-2 text-gray-600">
                    After purchase, you'll need to pay your first {installmentAmount} USDC installment to enter the
                    current round. For each installment you'll also deposit MNDG into the auction (up to{" "}
                    {contractData?.maxProtocolTokenInAuction ?? 100} MNDG) and earn{" "}
                    {contractData?.protocolTokenRewardPerInstallment ?? 10} MNDG as a reward.
                  </p>
                </div>

                <div className="p-4 flex gap-2 border-t-2 border-black">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 h-12 bg-white text-black font-bold border-2 border-black hover:bg-gray-100"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 h-12 bg-black text-white font-bold border-2 border-black hover:bg-gray-900"
                  >
                    CONFIRM
                  </button>
                </div>
              </div>
            )}

            {step === "success" && (
              <div className="bg-white border-4 border-black p-8 text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-500 flex items-center justify-center text-4xl text-white font-bold border-2 border-black">
                    ✓
                  </div>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">YOU'RE NOW A MEMBER</h1>
                  <p className="text-lg">Welcome to {circle.name}</p>
                </div>

                <div className="pt-4">
                  <p className="text-sm">Next: Pay your first installment to enter Round {displayRound}</p>
                </div>

                <div className="space-y-2 pt-6">
                  <button
                    onClick={handleComplete}
                    className="w-full h-12 bg-black text-white font-bold border-2 border-black hover:bg-gray-900"
                  >
                    GO TO CIRCLE
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
