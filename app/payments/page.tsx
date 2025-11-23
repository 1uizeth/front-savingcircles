"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { useTimer } from "@/contexts/timer-context"
import { useUser } from "@/contexts/user-context"
import { useCircleContractData } from "@/lib/hooks/use-circle-contract-data"
import { usePaymentHistory } from "@/lib/hooks/use-payment-history"
import { PaymentModal } from "@/components/payment-modal"

type UrgencyState = "paid" | "due" | "overdue"

function CirclePaymentCard({
  circleAddress,
  onPayClick,
}: {
  circleAddress: string
  onPayClick: (circleAddress: string, amount: number, round: number, totalRounds: number) => void
}) {
  const { nextRoundSeconds } = useTimer()
  const { data: contractData, loading } = useCircleContractData(circleAddress)
  const [urgency] = useState<UrgencyState>("due") // In production, this would come from contract

  const getDeadlineDate = () => {
    const now = new Date()
    const deadline = new Date(now.getTime() + nextRoundSeconds * 1000)
    return deadline.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  if (loading || !contractData) {
    return (
      <div className="border-b-4 border-border p-6 bg-background">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-8 bg-gray-300 rounded w-32"></div>
            </div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-32"></div>
              <div className="h-10 bg-gray-300 rounded w-24"></div>
            </div>
            <div className="h-12 bg-gray-300 rounded w-20"></div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/20">
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 rounded w-16"></div>
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 rounded w-16"></div>
              <div className="h-4 bg-gray-300 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const installmentAmount = contractData.installmentSize
  const displayRound = contractData.currRound
  const totalRounds = contractData.numRounds
  const goalAmount = contractData.installmentSize * contractData.numRounds
  const paidMembers = Math.floor(contractData.numUsers * 0.8)
  const totalMembers = contractData.numUsers

  return (
    <div className="border-b-4 border-border bg-background hover:bg-secondary/50 transition-colors">
      {/* Payment Status - Primary Focus */}
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-sm text-muted-foreground mb-1">INSTALLMENT DUE</div>
            <div className="text-5xl font-bold">${installmentAmount}</div>
          </div>
          {urgency !== "paid" && (
            <button
              onClick={() => onPayClick(circleAddress, installmentAmount, displayRound, totalRounds)}
              className="px-6 py-3 bg-primary text-primary-foreground font-bold border-4 border-border hover:bg-primary/90"
            >
              PAY
            </button>
          )}
          {urgency === "paid" && (
            <div className="px-6 py-3 bg-success text-success-foreground font-bold border-4 border-border">PAID ✓</div>
          )}
        </div>
      </div>

      {/* Circle Info - Secondary */}
      <div className="px-6 pb-4 flex items-center justify-between border-b-4 border-border/20">
        <div>
          <div className="text-xs text-muted-foreground mb-1">
            ROUND {displayRound} OF {totalRounds}
          </div>
          <div className="text-lg font-bold">${goalAmount}</div>
        </div>
        <Link href={`/circles/${circleAddress}/preview`} className="text-xs underline hover:no-underline">
          VIEW CIRCLE
        </Link>
      </div>

      {/* Details Grid */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">DUE ON</div>
            <div className="text-sm font-bold">{getDeadlineDate()}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">PROGRESS</div>
            <div className="text-sm font-bold">
              {paidMembers}/{totalMembers} PAID
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentsPage() {
  const router = useRouter()
  const { joinedCircles } = useUser()
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<{
    circleId: string
    amount: number
    round: number
    totalRounds: number
  } | null>(null)

  const { payments, loading: historyLoading, addPendingPayment } = usePaymentHistory(joinedCircles)

  const handlePayClick = (circleAddress: string, amount: number, round: number, totalRounds: number) => {
    setSelectedPayment({ circleId: circleAddress, amount, round, totalRounds })
    setPaymentModalOpen(true)
  }

  const handlePaymentSuccess = (circleAddress: string, amount: number, round: number, circleName: string) => {
    const circle = joinedCircles.find((c) => c === circleAddress)
    if (circle && selectedPayment) {
      const circlePrize = amount * selectedPayment.totalRounds
      addPendingPayment({
        circleAddress,
        circlePrize,
        amount,
        round,
        totalRounds: selectedPayment.totalRounds,
      })
    }
  }

  if (joinedCircles.length === 0) {
    return (
      <div className="min-h-screen flex bg-background">
        <DesktopSidebar />
        <main className="flex-1 md:ml-[240px] pb-20 md:pb-0 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-3xl font-bold mb-4">NO PAYMENTS DUE</div>
            <p className="text-lg mb-8">Join a circle to start making payments</p>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-4 bg-primary text-primary-foreground font-bold border-4 border-border hover:bg-primary/90"
            >
              FIND CIRCLES
            </button>
          </div>
        </main>
        <MobileBottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <DesktopSidebar />

      <main className="flex-1 md:ml-[240px] flex flex-col pb-20 md:pb-0">
        <div className="flex-1 overflow-y-auto">
          {joinedCircles.map((circleAddress) => (
            <CirclePaymentCard key={circleAddress} circleAddress={circleAddress} onPayClick={handlePayClick} />
          ))}

          {joinedCircles.length > 0 && (
            <div className="border-t-4 border-border bg-muted/10">
              <div className="px-4 md:px-6 py-6 md:py-8">
                <h2 className="text-xs md:text-sm font-bold mb-4 md:mb-6 text-muted-foreground tracking-wider">
                  PAYMENT HISTORY
                </h2>

                {historyLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-gray-200 animate-pulse rounded"></div>
                    ))}
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-center py-8 md:py-12 text-xs md:text-sm text-muted-foreground">
                    <p>No payment history yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 md:space-y-3">
                    {payments.map((payment, index) => (
                      <div
                        key={`${payment.txHash}-${index}`}
                        className="border-2 border-border bg-background p-3 md:p-4"
                      >
                        {/* Header: Circle name and status */}
                        <div className="flex items-start justify-between mb-2 md:mb-3 pb-2 md:pb-3 border-b border-border/30">
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-xs md:text-sm mb-1 truncate">
                              ${payment.circlePrize} Circle
                            </div>
                            <div className="text-[10px] md:text-xs text-muted-foreground">
                              Installment {payment.round} of {payment.totalRounds}
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0">
                            {payment.pending ? (
                              <span className="text-[10px] md:text-xs bg-yellow-200 text-yellow-900 px-1.5 md:px-2 py-0.5 md:py-1 font-bold border border-yellow-900 whitespace-nowrap">
                                PENDING
                              </span>
                            ) : (
                              <span className="text-[10px] md:text-xs bg-green-200 text-green-900 px-1.5 md:px-2 py-0.5 md:py-1 font-bold border border-green-900 whitespace-nowrap">
                                CONFIRMED
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Amount and Date */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-[10px] md:text-xs text-muted-foreground mb-1">AMOUNT PAID</div>
                            <div className="text-xl md:text-2xl font-bold">${payment.amount}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] md:text-xs text-muted-foreground mb-1">DATE</div>
                            <div className="text-xs md:text-sm font-bold">{payment.date}</div>
                          </div>
                        </div>

                        {/* Transaction link for confirmed payments */}
                        {!payment.pending && (
                          <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-border/30">
                            <a
                              href={`https://sepolia.etherscan.io/tx/${payment.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] md:text-xs text-muted-foreground hover:text-foreground transition-colors underline break-all"
                            >
                              View transaction →
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t-4 border-border bg-secondary p-4 md:p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs md:text-sm font-bold">TOTAL DUE</div>
            <div className="text-2xl md:text-3xl font-bold">${joinedCircles.length * 100}</div>
          </div>
          <p className="text-[10px] md:text-xs text-muted-foreground mb-3 md:mb-4">
            Pay all installments at once to stay active in all circles
          </p>
          {joinedCircles.length > 1 && (
            <button
              onClick={() => console.log("[v0] Pay all circles:", joinedCircles)}
              className="w-full h-12 md:h-14 text-base md:text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors border-4 border-border"
            >
              PAY ALL CIRCLES
            </button>
          )}
        </div>
      </main>

      <MobileBottomNav />

      {selectedPayment && (
        <PaymentModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
          circleId={selectedPayment.circleId}
          installment={selectedPayment.amount}
          currentRound={selectedPayment.round}
          totalRounds={selectedPayment.totalRounds}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}
