"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import ContextBar from "@/components/context-bar"
import { useTimer } from "@/contexts/timer-context"
import { useUser } from "@/contexts/user-context"
import { useCircleContractData } from "@/lib/hooks/use-circle-contract-data"
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
      <div className="border-b-2 border-black p-6 bg-white">
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
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
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
    <div className="border-b-2 border-black bg-white hover:bg-gray-50 transition-colors">
      {/* Payment Status - Primary Focus */}
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">INSTALLMENT DUE</div>
            <div className="text-5xl font-bold">${installmentAmount}</div>
          </div>
          {urgency !== "paid" && (
            <button
              onClick={() => onPayClick(circleAddress, installmentAmount, displayRound, totalRounds)}
              className="px-6 py-3 bg-black text-white font-bold border-2 border-black hover:bg-gray-900"
            >
              PAY
            </button>
          )}
          {urgency === "paid" && (
            <div className="px-6 py-3 bg-white text-black font-bold border-2 border-black">PAID ✓</div>
          )}
        </div>
      </div>

      {/* Circle Info - Secondary */}
      <div className="px-6 pb-4 flex items-center justify-between border-b border-gray-200">
        <div>
          <div className="text-xs text-gray-600 mb-1">
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
            <div className="text-xs text-gray-600 mb-1">DUE ON</div>
            <div className="text-sm font-bold">{getDeadlineDate()}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">PROGRESS</div>
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

  const handlePayClick = (circleAddress: string, amount: number, round: number, totalRounds: number) => {
    setSelectedPayment({ circleId: circleAddress, amount, round, totalRounds })
    setPaymentModalOpen(true)
  }

  const handlePayAll = () => {
    console.log("[v0] Pay all circles:", joinedCircles)
    // In production, this would trigger payment for all joined circles
    alert("Pay All feature coming soon!")
  }

  if (joinedCircles.length === 0) {
    return (
      <div className="min-h-screen flex bg-white">
        <DesktopSidebar />
        <main className="flex-1 md:ml-[240px] pb-20 md:pb-0 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-3xl font-bold mb-4">NO PAYMENTS DUE</div>
            <p className="text-lg mb-8">Join a circle to start making payments</p>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-4 bg-black text-white font-bold border-2 border-black hover:bg-gray-900"
            >
              BROWSE CIRCLES
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
        <ContextBar location="PAYMENTS" />

        <div className="bg-[#3949AB] text-white px-6 py-4 border-b-2 border-black">
          <div className="text-xl font-bold">
            {joinedCircles.length} ACTIVE CIRCLE{joinedCircles.length !== 1 ? "S" : ""}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {joinedCircles.map((circleAddress) => (
            <CirclePaymentCard key={circleAddress} circleAddress={circleAddress} onPayClick={handlePayClick} />
          ))}
        </div>

        <div className="border-t-2 border-black bg-gray-50 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-bold">TOTAL DUE</div>
            <div className="text-3xl font-bold">
              ${joinedCircles.length * 100} {/* Placeholder - should sum actual amounts */}
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-4">Pay all installments at once to stay active in all circles</p>
          {joinedCircles.length > 1 && (
            <button
              onClick={handlePayAll}
              className="w-full h-14 text-lg font-bold bg-[#FFEB3B] hover:bg-[#FDD835] transition-colors border-2 border-black"
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
        />
      )}
    </div>
  )
}
