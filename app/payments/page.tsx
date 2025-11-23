"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import ContextBar from "@/components/context-bar"
import { useTimer } from "@/contexts/timer-context"
import { useUser } from "@/contexts/user-context"
import { useCircleContractData } from "@/lib/hooks/use-circle-contract-data"

type UrgencyState = "paid" | "due" | "overdue"

const CIRCLE_CONTRACT_ADDRESS = "0xfDF73F61146B9050FFe4b755364B9CAC670ea5b2"

export default function PaymentsPage() {
  const { nextRoundSeconds } = useTimer()
  const router = useRouter()
  const { joinedCircles } = useUser()

  const { data: contractData, loading } = useCircleContractData(CIRCLE_CONTRACT_ADDRESS)

  const [urgency, setUrgency] = useState<UrgencyState>("due")

  const hasJoinedCircle = joinedCircles.includes(CIRCLE_CONTRACT_ADDRESS)

  useEffect(() => {
    if (nextRoundSeconds === 0) {
      router.push(`/circles/${CIRCLE_CONTRACT_ADDRESS}/result`)
    }
  }, [nextRoundSeconds, router])

  const getDeadlineDate = () => {
    const now = new Date()
    const deadline = new Date(now.getTime() + nextRoundSeconds * 1000)
    return deadline.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const currentPot = contractData ? contractData.installmentSize * contractData.numUsers : 0
  const installmentAmount = contractData?.installmentSize ?? 0
  const displayRound = contractData ? contractData.currRound : 1
  const totalRounds = contractData?.numRounds ?? 0
  const paidMembers = contractData ? Math.floor(contractData.numUsers * 0.8) : 0
  const totalMembers = contractData?.numUsers ?? 0

  if (!hasJoinedCircle) {
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

  if (loading || !contractData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">LOADING PAYMENT INFO…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <DesktopSidebar />

      <main className="flex-1 md:ml-[240px] pb-32 md:pb-24">
        <ContextBar location="PAYMENTS" />

        <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
          <span className="text-xl font-bold">
            ROUND {displayRound} OF {totalRounds}
          </span>

          {/* Demo controls for testing UI states */}
          <div className="flex gap-1 border-2 border-white p-1">
            <button
              onClick={() => setUrgency("paid")}
              className={`px-2 py-1 text-xs font-bold border transition-colors ${
                urgency === "paid" ? "bg-white text-black border-white" : "border-white text-white"
              }`}
            >
              PAID
            </button>
            <button
              onClick={() => setUrgency("due")}
              className={`px-2 py-1 text-xs font-bold border transition-colors ${
                urgency === "due" ? "bg-[#FFEB3B] text-black border-[#FFEB3B]" : "border-white text-white"
              }`}
            >
              DUE
            </button>
            <button
              onClick={() => setUrgency("overdue")}
              className={`px-2 py-1 text-xs font-bold border transition-colors ${
                urgency === "overdue" ? "bg-white text-black border-white" : "border-white text-white"
              }`}
            >
              OVERDUE
            </button>
          </div>
        </div>

        <div
          className={`flex flex-col items-center justify-center py-16 ${
            urgency === "paid" ? "bg-white" : urgency === "due" ? "bg-[#FFEB3B]" : "bg-white"
          }`}
        >
          <div className="text-center px-4">
            <div className="text-2xl font-bold mb-8">INSTALLMENT</div>
            <div className="text-6xl md:text-8xl font-bold leading-none mb-4">
              {urgency === "paid" ? "PAID ✓" : urgency === "due" ? "DUE NOW" : "OVERDUE"}
            </div>
            {urgency !== "paid" && <div className="text-4xl md:text-6xl font-bold">${installmentAmount}</div>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-0 border-t-2 border-black">
          <div className="p-6 border-r-2 border-b-2 border-black">
            <div className="text-sm text-gray-600 mb-2">DEADLINE</div>
            <div className="text-xl font-bold">{getDeadlineDate()}</div>
          </div>
          <div className="p-6 border-b-2 border-black">
            <div className="text-sm text-gray-600 mb-2">PROGRESS</div>
            <div className="text-xl font-bold">
              {paidMembers}/{totalMembers} PAID
            </div>
          </div>
          <div className="p-6 border-r-2 border-b-2 border-black">
            <div className="text-sm text-gray-600 mb-2">CURRENT POT</div>
            <div className="text-xl font-bold">${currentPot}</div>
          </div>
          <div className="p-6 border-b-2 border-black">
            <div className="text-sm text-gray-600 mb-2">YOUR AMOUNT</div>
            <div className="text-xl font-bold">${installmentAmount}</div>
          </div>
          <div className="col-span-2 p-6">
            <div className="text-sm text-gray-600 mb-2">PAYMENT STATUS</div>
            <div className="font-bold">
              {urgency === "paid"
                ? `✓ Paid for Round ${displayRound}`
                : urgency === "due"
                  ? "Payment due - Please pay to stay in the round"
                  : "⚠ Payment overdue - Risk of removal"}
            </div>
            {urgency === "paid" && (
              <div className="text-sm mt-1 text-gray-600">
                Total paid so far: ${installmentAmount * Math.max(1, displayRound - 1)}
              </div>
            )}
          </div>
        </div>
      </main>

      {urgency !== "paid" && (
        <button
          onClick={() => alert(`Payment of ${installmentAmount} USDC triggered`)}
          className="fixed bottom-16 md:bottom-0 left-0 right-0 md:left-[240px] z-50 h-20 text-2xl font-bold bg-[#FFEB3B] hover:bg-[#FDD835] transition-colors border-t-2 border-black"
        >
          PAY ${installmentAmount}
        </button>
      )}

      <MobileBottomNav />
    </div>
  )
}
