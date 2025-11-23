"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import ContextBar from "@/components/context-bar"
import { useTimer } from "@/contexts/timer-context"
import { useUser } from "@/contexts/user-context"

const mockCircles = [
  { id: "0xfDF73F61146B9050FFe4b755364B9CAC670ea5b2", name: "$300 Circle", value: 300 },
  { id: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", name: "$500 Circle", value: 500 },
  { id: "0x123ABC456DEF789GHI012JKL345MNO678PQR901", name: "$1000 Circle", value: 1000 },
]

export default function TokensPage() {
  const { nextRoundSeconds } = useTimer()
  const router = useRouter()
  const { tokens, placeBid } = useUser()

  const [showModal, setShowModal] = useState(false)
  const [modalStep, setModalStep] = useState<"selectCircle" | "bidAmount" | "success">("selectCircle")
  const [selectedCircle, setSelectedCircle] = useState<(typeof mockCircles)[0] | null>(null)
  const [bidAmount, setBidAmount] = useState("")

  const mockTotalBids = 800
  const newBid = Number(bidAmount) || 0
  const totalWithUserBid = mockTotalBids + newBid
  const userWeight = totalWithUserBid > 0 ? (newBid / totalWithUserBid) * 100 : 0
  const remainingBalance = Math.max(0, tokens - newBid)

  const handleCircleSelect = (circle: (typeof mockCircles)[0]) => {
    setSelectedCircle(circle)
    setModalStep("bidAmount")
  }

  const handlePlaceBid = () => {
    if (selectedCircle && newBid > 0) {
      placeBid(selectedCircle.id, newBid, userWeight)
      setModalStep("success")
    }
  }

  const handleGoToCircle = () => {
    if (selectedCircle) {
      router.push(`/circles/${selectedCircle.id}/preview`)
      setShowModal(false)
      setModalStep("selectCircle")
      setBidAmount("")
      setSelectedCircle(null)
    }
  }

  return (
    <div className="min-h-screen flex">
      <DesktopSidebar />

      <main className="flex-1 md:ml-[240px] pb-[72px] md:pb-0">
        <ContextBar location="TOKEN BALANCE" phase="result" nextRoundSeconds={nextRoundSeconds} />

        <div className="px-4 py-8">
          <div className="mb-8">
            <h1 className="text-sm uppercase text-gray-500 mb-2">YOUR TOKENS</h1>
            <div className="text-6xl font-bold">{tokens} SCT</div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full md:w-auto px-8 py-4 bg-[#FFE500] text-black font-bold border-2 border-black hover:bg-yellow-400 transition-colors"
          >
            JOIN AUCTION
          </button>
        </div>
      </main>

      <MobileBottomNav />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowModal(false)} />

          <div className="relative w-full max-w-md bg-white border-4 border-black">
            {modalStep === "selectCircle" && (
              <>
                <div className="h-14 bg-gray-100 flex items-center px-6 border-b-2 border-black">
                  <h2 className="text-lg font-bold">SELECT CIRCLE</h2>
                </div>
                <div className="p-6 space-y-3">
                  {mockCircles.map((circle) => (
                    <button
                      key={circle.id}
                      onClick={() => handleCircleSelect(circle)}
                      className="w-full p-4 text-left border-2 border-black hover:bg-gray-100 transition-colors"
                    >
                      <div className="font-bold text-lg">{circle.name}</div>
                      <div className="text-sm text-gray-600 font-mono truncate">{circle.id}</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {modalStep === "bidAmount" && selectedCircle && (
              <>
                <div className="h-14 bg-gray-100 flex items-center px-6 border-b-2 border-black">
                  <h2 className="text-lg font-bold">PLACE YOUR BID</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Bidding on:</p>
                    <p className="text-xl font-bold">{selectedCircle.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">BID AMOUNT (SCT)</label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      max={tokens}
                      className="w-full p-4 text-2xl font-bold border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="0"
                    />
                  </div>

                  {newBid > 0 && (
                    <div className="border-2 border-black p-4 space-y-2 bg-gray-50">
                      <div className="flex justify-between text-sm">
                        <span>Your weight:</span>
                        <span className="font-bold">{userWeight.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tokens bid:</span>
                        <span className="font-bold">{newBid} SCT</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Remaining balance:</span>
                        <span className="font-bold">{remainingBalance} SCT</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 flex gap-2 border-t-2 border-black">
                  <button
                    onClick={() => {
                      setModalStep("selectCircle")
                      setBidAmount("")
                    }}
                    className="flex-1 h-12 bg-white text-black font-bold border-2 border-black hover:bg-gray-100"
                  >
                    BACK
                  </button>
                  <button
                    onClick={handlePlaceBid}
                    disabled={newBid <= 0 || newBid > tokens}
                    className="flex-1 h-12 bg-black text-white font-bold border-2 border-black hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    PLACE BID
                  </button>
                </div>
              </>
            )}

            {modalStep === "success" && selectedCircle && (
              <>
                <div className="h-14 bg-gray-100 flex items-center px-6 border-b-2 border-black">
                  <h2 className="text-lg font-bold">BID PLACED SUCCESSFULLY</h2>
                </div>
                <div className="p-8 space-y-6">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-green-500 flex items-center justify-center text-5xl text-white font-bold border-2 border-black">
                      ✓
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold">Your bid is active</h3>
                    <p className="text-gray-600">
                      You've bid {newBid} SCT on {selectedCircle.name}
                    </p>
                  </div>

                  <div className="border-2 border-black p-4 space-y-2 bg-gray-50">
                    <div className="flex justify-between text-sm">
                      <span>Your weight:</span>
                      <span className="font-bold">{userWeight.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tokens bid:</span>
                      <span className="font-bold">{newBid} SCT</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Remaining balance:</span>
                      <span className="font-bold">{remainingBalance} SCT</span>
                    </div>
                  </div>

                  <button
                    onClick={handleGoToCircle}
                    className="w-full h-12 bg-black text-white font-bold border-2 border-black hover:bg-gray-900"
                  >
                    GO TO CIRCLE
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
