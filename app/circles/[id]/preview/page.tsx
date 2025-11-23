"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
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
  const { isJoined, joinCircle, tokens, hasBidForCircle, getBidForCircle } = useUser()
  const [showModal, setShowModal] = useState(false)
  const [step, setStep] = useState<"confirm" | "loading" | "success">("confirm")
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [showSuccessStatus, setShowSuccessStatus] = useState(false)

  const contractAddress = circleId
  const {
    data: contractData,
    loading: isLoadingContract,
    error: contractError,
  } = useCircleContractData(contractAddress)

  const installmentAmount = contractData?.installmentSize ?? 0
  const totalRounds = contractData?.currRound ?? 10
  const displayRound = contractData ? Math.max(1, contractData.numRounds + 1) : 1
  const prizeAmount = contractData ? contractData.installmentSize * contractData.currRound : 0
  const membersCount = contractData?.numUsers ?? 0

  const userIsJoined = isJoined(circleId)
  const userHasBidForCircle = hasBidForCircle(circleId)
  const bidData = getBidForCircle(circleId)

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
    setStep("loading")
    joinCircle(circleId)
    setTimeout(() => {
      setStep("success")
    }, 2000)
  }

  const handleComplete = () => {
    setShowModal(false)
    setTimeout(() => {
      setShowSuccessStatus(true)
      setTimeout(() => {
        setShowSuccessStatus(false)
      }, 3000)
    }, 2000)
    router.push(`/circles/${circleId}/preview?justJoined=true`)
  }

  const totalBidsAmount = contractData?.totalBids ?? 1000
  const userBidAmount = bidData?.userBid ?? 0

  const otherBidders = [
    { address: "0x3e9c", amount: 300 },
    { address: "0x7a2f", amount: 200 },
  ]

  const actualTotalBids = userBidAmount + otherBidders.reduce((sum, b) => sum + b.amount, 0)
  const activeBidders = otherBidders.length

  const mockAuctionData = {
    userBid: userBidAmount,
    userWeight: userBidAmount > 0 ? (userBidAmount / actualTotalBids) * 100 : 0,
    totalBids: actualTotalBids,
    bidders: activeBidders,
    maxBidders: 3,
    distribution: [
      {
        address: "YOU",
        amount: userBidAmount,
        weight: userBidAmount > 0 ? (userBidAmount / actualTotalBids) * 100 : 0,
      },
      ...otherBidders.map((bidder) => ({
        address: bidder.address,
        amount: bidder.amount,
        weight: (bidder.amount / actualTotalBids) * 100,
      })),
    ]
      .filter((entry) => entry.amount > 0)
      .sort((a, b) => b.amount - a.amount),
  }

  const userHasTokens = tokens > 0

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
          <div className="bg-selection text-selection-foreground p-4 border-b-2 border-black">
            <div className="text-xs uppercase mb-1 opacity-80">CONTRACT</div>
            <a
              href={`https://sepolia.etherscan.io/address/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono break-all hover:underline"
            >
              {contractAddress}
            </a>
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
                <div className="text-xs uppercase text-gray-500 mb-2 flex items-center justify-start md:justify-end gap-2">
                  <span>NEXT ROUND IN</span>
                  <button
                    onClick={() => router.push(`/circles/${circleId}/result`)}
                    className="text-xs opacity-40 hover:opacity-100 underline transition-opacity"
                  >
                    NOW
                  </button>
                </div>
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
              <div
                className={`text-3xl font-bold transition-colors duration-500 ${showSuccessStatus ? "text-green-500" : ""}`}
              >
                {userIsJoined ? "MEMBER" : "NOT JOINED"}
              </div>
            </div>
          </div>

          {userIsJoined && userHasBidForCircle && bidData && (
            <AuctionSection
              userBid={userBidAmount}
              userWeight={mockAuctionData.userWeight}
              totalBids={mockAuctionData.totalBids}
              bidders={mockAuctionData.bidders}
              maxBidders={mockAuctionData.maxBidders}
              distribution={mockAuctionData.distribution}
            />
          )}

          <div className="fixed bottom-0 left-0 right-0 md:left-[240px] border-t-2 border-black bg-white p-4 z-40 mb-[72px] md:mb-0">
            {userIsJoined ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setPaymentModalOpen(true)}
                  className="flex-1 h-16 text-xl font-bold border-2 border-black bg-black text-white hover:bg-gray-900 transition-colors"
                >
                  PAY INSTALLMENT
                </button>
                {userHasTokens && (
                  <button
                    onClick={() => router.push("/tokens")}
                    className="flex-1 h-16 text-xl font-bold border-2 border-black bg-accent text-accent-foreground hover:bg-accent-hover transition-colors"
                  >
                    JOIN AUCTION
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={handleJoinClick}
                className="w-full h-16 text-2xl font-bold border-2 border-black bg-accent text-accent-foreground hover:bg-accent-hover transition-colors"
              >
                JOIN CIRCLE
              </button>
            )}
          </div>
        </main>

        <MobileBottomNav />
      </div>

      {showModal && (
        <>
          <div className="fixed inset-0 z-[89] bg-black/95" />
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            {step === "confirm" && (
              <div className="bg-white border-2 border-black shadow-2xl">
                <div className="h-14 bg-white flex items-center px-6 border-b-2 border-black">
                  <h2 className="text-lg font-bold">JOIN CIRCLE</h2>
                </div>

                <div className="p-6 space-y-6 bg-white">
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

                <div className="p-4 flex gap-2 border-t-2 border-black bg-white">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 h-12 bg-white text-black font-bold border-2 border-black hover:bg-gray-100"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 h-12 bg-accent text-accent-foreground font-bold border-2 border-black hover:bg-accent-hover"
                  >
                    CONFIRM
                  </button>
                </div>
              </div>
            )}

            {step === "loading" && (
              <div className="bg-white border-2 border-black shadow-2xl p-12 text-center space-y-6 min-w-[400px]">
                <div className="flex justify-center">
                  <div className="w-16 h-16 border-2 border-black border-t-accent animate-spin rounded-full" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">JOINING CIRCLE</h2>
                  <p className="text-sm text-gray-600">Please wait while we process your request...</p>
                </div>
              </div>
            )}

            {step === "success" && (
              <div className="bg-white border-2 border-black shadow-2xl max-w-lg w-full">
                <div className="bg-accent text-accent-foreground p-6 border-b-2 border-black text-center">
                  <h1 className="text-3xl font-bold mb-2">You're In!</h1>
                  <p className="text-lg opacity-90">Part of a circle to save ${prizeAmount.toLocaleString()} </p>
                </div>

                <div className="p-6 space-y-6 bg-white">
                  <div className="grid gap-4">
                    <div className="border-2 border-black p-4 bg-gray-50">
                      <div className="text-xs uppercase text-gray-500 mb-1">Circle Details</div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Installment Amount</span>
                        <span className="text-lg font-bold">{installmentAmount} USDC</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-medium">Total Rounds</span>
                        <span className="text-lg font-bold">{totalRounds}</span>
                      </div>
                    </div>

                    <div className="border-2 border-accent bg-accent/10 p-4">
                      <div className="text-xs uppercase text-accent-foreground/70 mb-1">Next Step</div>
                      <p className="text-sm font-medium">
                        Pay your first {installmentAmount} USDC installment to enter Round {displayRound}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleComplete}
                    className="w-full h-14 bg-black text-white font-bold text-lg border-2 border-black hover:bg-gray-900 transition-colors"
                  >
                    CONTINUE
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
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
