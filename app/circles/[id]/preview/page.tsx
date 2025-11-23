"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import ContextBar from "@/components/context-bar"
import { useTimer } from "@/contexts/timer-context"
import { useUser } from "@/contexts/user-context"
import { useCircleContractData } from "@/lib/hooks/use-circle-contract-data"
import { PaymentModal } from "@/components/payment-modal"
import { AuctionSection } from "@/components/auction-section"

export default function CirclePreviewPage() {
  const router = useRouter()
  const params = useParams()
  const rawCircleId = params?.id
  const circleId = Array.isArray(rawCircleId) ? rawCircleId[0] : rawCircleId
  const { nextRoundSeconds } = useTimer()
  const { isJoined, joinCircle, tokens, getBidForCircle } = useUser()
  const [showModal, setShowModal] = useState(false)
  const [step, setStep] = useState<"confirm" | "success">("confirm")
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

  const contractAddress = circleId
  const {
    data: contractData,
    loading: isLoadingContract,
    error: contractError,
  } = useCircleContractData(contractAddress)

  const installmentAmount = contractData?.installmentSize ?? 0
  const totalRounds = contractData?.numRounds ?? 10
  const displayRound = contractData ? Math.max(1, contractData.currRound + 1) : 1
  const prizeAmount = contractData ? contractData.installmentSize * contractData.numRounds : 0
  const membersCount = contractData?.numUsers ?? 2

  const userIsJoined = isJoined(circleId)

  const bidData = getBidForCircle(circleId)
  const userHasBid = bidData !== null && bidData.userBid > 0

  const mockTotalBids = 800
  const userBidAmount = bidData?.userBid ?? 0
  const totalBidsWithUser = mockTotalBids + userBidAmount
  const userWeight = totalBidsWithUser > 0 ? (userBidAmount / totalBidsWithUser) * 100 : 0

  const mockDistribution = [
    { rank: 1, isUser: false, percentage: 50, amount: 500 },
    { rank: 2, isUser: false, percentage: 30, amount: 300 },
  ]

  const distributionWithUser = userHasBid
    ? [
        ...mockDistribution.map((d) => ({
          ...d,
          percentage: (d.amount / totalBidsWithUser) * 100,
        })),
        {
          rank: 0,
          isUser: true,
          percentage: userWeight,
          amount: userBidAmount,
        },
      ].sort((a, b) => b.amount - a.amount)
    : mockDistribution

  const formatTime = (seconds: number) => {
    if (seconds >= 24 * 60 * 60) {
      const days = Math.floor(seconds / (24 * 60 * 60))
      const hours = Math.floor((seconds % (24 * 60 * 60)) / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      return `${days}d ${hours}h ${minutes}m`
    }
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}h ${minutes}m ${secs}s`
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
    setShowModal(false)
    router.refresh()
  }

  const handleJoinAuction = () => {
    router.push("/tokens")
  }

  if (!circleId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl p-8 space-y-8 animate-pulse">
          <div className="h-32 bg-gray-300 rounded"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-gray-300 rounded"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoadingContract) {
    return (
      <div className="min-h-screen flex bg-white">
        <DesktopSidebar />
        <main className="flex-1 md:ml-[240px] pb-20 md:pb-0">
          <ContextBar location="CIRCLE DETAILS" />
          <div className="animate-pulse">
            <div className="bg-gray-300 p-4 border-b-2 border-black h-20"></div>
            <div className="border-b-2 border-black p-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
                <div className="flex-1 space-y-4">
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                  <div className="h-16 bg-gray-300 rounded w-48"></div>
                </div>
                <div className="md:text-right space-y-4">
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                  <div className="h-12 bg-gray-300 rounded w-40"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black border-b-2 border-black">
              <div className="p-8 space-y-4">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-16 bg-gray-300 rounded w-32"></div>
                <div className="h-6 bg-gray-300 rounded w-40"></div>
              </div>
              <div className="p-8 space-y-4">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-16 bg-gray-300 rounded w-32"></div>
                <div className="h-6 bg-gray-300 rounded w-40"></div>
              </div>
            </div>
          </div>
        </main>
        <MobileBottomNav />
      </div>
    )
  }

  if (contractError || !contractData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold">CIRCLE NOT FOUND</div>
          {contractError && <div className="text-sm text-red-600">{contractError}</div>}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen flex bg-white">
        <DesktopSidebar />

        <main className="flex-1 md:ml-[240px] pb-32 md:pb-24">
          <ContextBar location="CIRCLE DETAILS" />

          <div className="bg-[#2D4B8E] text-white p-4 border-b-2 border-black">
            <div className="text-xs uppercase mb-1">CONTRACT</div>
            <div className="text-sm font-mono break-all">{contractAddress}</div>
          </div>

          <div className="border-b-2 border-black p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
              <div className="flex-1">
                <div className="text-sm uppercase text-gray-500 mb-2">
                  ROUND {displayRound} OF {totalRounds}
                </div>
                <div className="text-6xl font-bold">${prizeAmount.toLocaleString()}</div>
              </div>

              <div className="md:text-right">
                <div className="text-xs uppercase text-gray-500 mb-2">NEXT ROUND IN</div>
                <div className="text-4xl font-bold">{formatTime(nextRoundSeconds)}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black border-b-2 border-black">
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

          <div className="grid grid-cols-2 divide-x-2 divide-black border-b-2 border-black">
            <div className="p-6">
              <div className="text-xs mb-1">ACTIVE MEMBERS</div>
              <div className="text-3xl font-bold">
                {membersCount}/{totalRounds}
              </div>
            </div>
            <div className="p-6">
              <div className="text-xs mb-1">YOUR STATUS</div>
              <div className="text-3xl font-bold">{userIsJoined ? "MEMBER" : "NOT JOINED"}</div>
            </div>
          </div>

          {userIsJoined && userHasBid && (
            <AuctionSection
              userWeight={userWeight}
              userBid={userBidAmount}
              totalBids={totalBidsWithUser}
              activeBidders={distributionWithUser.length}
              distribution={distributionWithUser}
            />
          )}

          <div className="fixed bottom-0 left-0 right-0 md:left-[240px] border-t-2 border-black bg-white p-4 z-40">
            {userIsJoined ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setPaymentModalOpen(true)}
                  className="flex-1 h-16 text-xl font-bold border-2 border-black bg-black text-white hover:bg-gray-900 transition-colors"
                >
                  PAY INSTALLMENT
                </button>
                {tokens > 0 && !userHasBid && (
                  <button
                    onClick={handleJoinAuction}
                    className="flex-1 h-16 text-xl font-bold border-2 border-black bg-[#FFE500] text-black hover:bg-yellow-400 transition-colors"
                  >
                    JOIN AUCTION
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={handleJoinClick}
                className="w-full h-16 text-2xl font-bold border-2 border-black bg-white hover:bg-gray-100 transition-colors"
              >
                JOIN CIRCLE
              </button>
            )}
          </div>
        </main>

        <MobileBottomNav />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowModal(false)} />

          <div className="relative w-full max-w-md">
            {step === "confirm" && (
              <div className="bg-white border-4 border-black">
                <div className="h-14 bg-gray-100 flex items-center px-6 border-b-2 border-black">
                  <h2 className="text-lg font-bold">CONFIRM PURCHASE</h2>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <p className="text-sm mb-2">You're joining:</p>
                    <p className="text-2xl font-bold">${prizeAmount.toLocaleString()} Circle</p>
                  </div>

                  <div className="border-t-2 border-black pt-4 space-y-3">
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
                    After joining, you'll need to pay your first {installmentAmount} USDC installment to enter the
                    current round.
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
                  <p className="text-lg">Welcome to the ${prizeAmount.toLocaleString()} Circle</p>
                </div>

                <div className="pt-4">
                  <p className="text-sm">Next: Pay your first installment to enter Round {displayRound}</p>
                </div>

                <div className="space-y-2 pt-6">
                  <button
                    onClick={handleComplete}
                    className="w-full h-12 bg-black text-white font-bold border-2 border-black hover:bg-gray-900"
                  >
                    CONTINUE
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {userIsJoined && contractData && (
        <PaymentModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
          circleId={circleId}
          installment={installmentAmount}
          currentRound={displayRound}
          totalRounds={totalRounds}
        />
      )}
    </>
  )
}
