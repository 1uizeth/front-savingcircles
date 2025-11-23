"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import ContextBar from "@/components/context-bar"
import { useTimer } from "@/contexts/timer-context"

export default function AuctionPage() {
  const params = useParams()
  const circleId = params.id as string
  const router = useRouter()

  const { nextRoundSeconds } = useTimer()

  // Mock data
  const [userBalance] = useState(150)
  const [currentBid, setCurrentBid] = useState(50)
  const [bidInput, setBidInput] = useState("")
  const [timeLeft, setTimeLeft] = useState(6 * 60 * 60 + 23 * 60) // 6h 23m in seconds

  // Calculate pool data
  const otherBids = [
    { address: "0x7a2f", amount: 80 },
    { address: "0x3e9c", amount: 95 },
    { address: "0x9fa2", amount: 70 },
    { address: "0x1b4c", amount: 45 },
    { address: "0x8d3a", amount: 80 },
  ]

  const totalBids = currentBid + otherBids.reduce((sum, b) => sum + b.amount, 0)
  const userWeight = (currentBid / totalBids) * 100
  const newBid = bidInput ? Number.parseFloat(bidInput) : currentBid
  const newTotal = newBid + otherBids.reduce((sum, b) => sum + b.amount, 0)
  const newWeight = (newBid / newTotal) * 100
  const weightChange = newWeight - userWeight

  // Urgency state
  const urgency = nextRoundSeconds < 600 ? "urgent" : nextRoundSeconds < 3600 ? "closing" : "early"

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (nextRoundSeconds === 0) {
      router.push(`/circles/${circleId}/result`)
    }
  }, [nextRoundSeconds, router, circleId])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const handleQuickBid = (percentage: number) => {
    const amount = (userBalance * percentage).toFixed(1)
    setBidInput(amount)
  }

  const handleSubmitBid = () => {
    if (bidInput && Number.parseFloat(bidInput) <= userBalance && Number.parseFloat(bidInput) !== currentBid) {
      setCurrentBid(Number.parseFloat(bidInput))
      setBidInput("")
    }
  }

  const isValidBid =
    bidInput &&
    Number.parseFloat(bidInput) > 0 &&
    Number.parseFloat(bidInput) <= userBalance &&
    Number.parseFloat(bidInput) !== currentBid

  // Background color based on urgency
  const bgColor = urgency === "urgent" ? "bg-[#FFFF00]" : urgency === "closing" ? "bg-[#FFFFE0]" : "bg-white"
  const primaryZoneHeight = urgency === "urgent" ? "h-[70vh]" : urgency === "closing" ? "h-[60vh]" : "h-[50vh]"
  const primaryFontSize =
    urgency === "urgent" ? "text-[144px]" : urgency === "closing" ? "text-[128px]" : "text-[144px]"

  // Demo controls
  const [showDemo, setShowDemo] = useState(true)

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-500`}>
      <DesktopSidebar />

      <div className="md:ml-[240px] pb-16 md:pb-0">
        <ContextBar location={`ROUND 3 - AUCTION (${circleId})`} phase="auction" nextRoundSeconds={nextRoundSeconds} />

        {/* Demo Controls */}
        {showDemo && (
          <div className="fixed top-20 right-4 z-30 bg-black text-white p-4 border-2 border-white">
            <button onClick={() => setShowDemo(false)} className="absolute top-1 right-1 text-xs">
              ✕
            </button>
            <div className="text-xs mb-2">DEMO CONTROLS</div>
            <div className="flex flex-col gap-2 text-xs">
              <button onClick={() => setTimeLeft(7 * 3600)} className="border border-white px-2 py-1">
                EARLY (7h)
              </button>
              <button onClick={() => setTimeLeft(30 * 60)} className="border border-white px-2 py-1">
                CLOSING (30m)
              </button>
              <button onClick={() => setTimeLeft(5 * 60)} className="border border-white px-2 py-1">
                URGENT (5m)
              </button>
            </div>
          </div>
        )}

        {/* PRIMARY INFO ZONE - Split Display */}
        <div className={`${primaryZoneHeight} flex flex-col md:flex-row transition-all duration-500`}>
          {/* Left Half - Your Position */}
          <div className="flex-1 flex flex-col items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-black p-8">
            <div className="text-2xl font-bold mb-4">YOUR WEIGHT</div>
            <div
              className={`${primaryFontSize} md:text-[144px] text-[96px] font-bold leading-none mb-8 transition-all duration-500`}
            >
              {userWeight.toFixed(1)}%
            </div>
            {/* Visual Bar */}
            <div className="w-full max-w-md h-10 border-2 border-black bg-white">
              <div className="h-full bg-black transition-all duration-300" style={{ width: `${userWeight}%` }} />
            </div>
          </div>

          {/* Right Half - Pool Status */}
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="text-2xl font-bold mb-4">TOTAL TOKENS</div>
            <div className="text-[96px] md:text-[120px] font-bold leading-none mb-4">{totalBids}</div>
            <div className="text-xl">
              Your bid: {currentBid} ({userWeight.toFixed(1)}%)
            </div>
          </div>
        </div>

        {/* SECONDARY INFO ZONE */}
        <div className="grid grid-cols-2 border-t-2 border-black">
          <div className="border-r-2 border-b-2 border-black p-6">
            <div className="text-sm mb-2">YOUR BALANCE</div>
            <div className="text-4xl font-bold">{userBalance} MNDG</div>
          </div>
          <div className="border-b-2 border-black p-6">
            <div className="text-sm mb-2">YOUR BID</div>
            <div className="text-4xl font-bold">{currentBid} MNDG</div>
          </div>
          <div className="border-r-2 border-black p-6">
            <div className="text-sm mb-2">QUOTA POOL</div>
            <div className="text-4xl font-bold">100 QUOTA</div>
          </div>
          <div className="p-6">
            <div className="text-sm mb-2">BIDDERS</div>
            <div className="text-4xl font-bold">6/8 ACTIVE</div>
          </div>
        </div>

        {/* QUOTA ALLOCATION VISUALIZATION */}
        <div className="border-t-2 border-black p-8">
          <div className="text-2xl font-bold mb-6">CURRENT DISTRIBUTION</div>
          <div className="space-y-1">
            <div className="flex items-center gap-4">
              <div className="w-20 text-sm font-bold">YOU</div>
              <div className="flex-1 h-8 border-2 border-black bg-white">
                <div className="h-full bg-black" style={{ width: `${userWeight}%` }} />
              </div>
              <div className="w-16 text-right font-bold">{userWeight.toFixed(0)}%</div>
            </div>
            {otherBids.map((bidder) => {
              const weight = (bidder.amount / totalBids) * 100
              return (
                <div key={bidder.address} className="flex items-center gap-4">
                  <div className="w-20 text-sm">{bidder.address}</div>
                  <div className="flex-1 h-8 border-2 border-black bg-white">
                    <div className="h-full bg-gray-400" style={{ width: `${weight}%` }} />
                  </div>
                  <div className="w-16 text-right">{weight.toFixed(0)}%</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* BID INPUT ZONE */}
        <div className="border-t-2 border-black p-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-4">
              <input
                type="number"
                value={bidInput}
                onChange={(e) => setBidInput(e.target.value)}
                placeholder="Enter bid amount"
                className="w-full h-14 px-4 text-4xl font-bold text-right border-2 border-black bg-white"
                style={{ borderRadius: 0 }}
              />
              <div className="text-right text-sm mt-1">MNDG</div>
            </div>

            {/* Quick Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <button
                onClick={() => handleQuickBid(0.25)}
                className="h-10 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors font-bold"
              >
                25%
              </button>
              <button
                onClick={() => handleQuickBid(0.5)}
                className="h-10 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors font-bold"
              >
                50%
              </button>
              <button
                onClick={() => handleQuickBid(0.75)}
                className="h-10 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors font-bold"
              >
                75%
              </button>
              <button
                onClick={() => handleQuickBid(1)}
                className="h-10 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors font-bold"
              >
                MAX
              </button>
            </div>

            {/* Preview */}
            {bidInput && (
              <div className="text-center text-lg mb-4">
                New weight: {newWeight.toFixed(1)}% ({weightChange > 0 ? "+" : ""}
                {weightChange.toFixed(1)}%)
              </div>
            )}
          </div>
        </div>

        {/* ACTION ZONE */}
        <div className="border-t-2 border-black">
          <button
            onClick={handleSubmitBid}
            disabled={!isValidBid}
            className={`w-full h-20 text-2xl font-bold border-2 border-black transition-colors ${
              !bidInput
                ? "bg-gray-200 text-gray-500"
                : Number.parseFloat(bidInput) > userBalance
                  ? "bg-[#FF0000] text-white"
                  : !isValidBid
                    ? "bg-gray-200 text-gray-500"
                    : "bg-[#00FF00] text-black hover:bg-[#00DD00]"
            } ${urgency === "urgent" && isValidBid ? "animate-pulse" : ""}`}
          >
            {!bidInput
              ? "ENTER BID AMOUNT"
              : Number.parseFloat(bidInput) > userBalance
                ? "INSUFFICIENT BALANCE"
                : Number.parseFloat(bidInput) === currentBid
                  ? "NO CHANGE"
                  : "SUBMIT BID"}
          </button>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}
