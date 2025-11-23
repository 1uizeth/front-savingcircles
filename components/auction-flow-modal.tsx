"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { useUser } from "@/contexts/user-context"

interface AuctionFlowModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  preselectedCircleId?: string
}

export function AuctionFlowModal({ open, onOpenChange, preselectedCircleId }: AuctionFlowModalProps) {
  const { joinedCircles, tokens, subtractTokens, placeBid } = useUser()
  const router = useRouter()
  const [step, setStep] = useState<"select" | "bid" | "success">(preselectedCircleId ? "bid" : "select")
  const [selectedCircle, setSelectedCircle] = useState(preselectedCircleId || "")
  const [bidAmount, setBidAmount] = useState("")

  const mockCircleData = {
    name: "$300 Circle",
    round: 6,
    otherBids: [
      { address: "0x3e9c", amount: 300 },
      { address: "0x7a2f", amount: 200 },
    ],
  }

  const totalOtherBids = mockCircleData.otherBids.reduce((sum, b) => sum + b.amount, 0)
  const newBid = bidAmount ? Number.parseFloat(bidAmount) : 0
  const newTotalBids = newBid + totalOtherBids
  const newWeight = newTotalBids > 0 ? (newBid / newTotalBids) * 100 : 0
  const remainingBalance = Math.max(0, tokens - newBid)

  const handleCircleSelect = (circleAddress: string) => {
    setSelectedCircle(circleAddress)
    setStep("bid")
  }

  const handleQuickBid = (percentage: number) => {
    const amount = Math.floor(tokens * percentage).toString()
    setBidAmount(amount)
  }

  const handleSubmitBid = () => {
    if (newBid > 0 && newBid <= tokens) {
      placeBid(selectedCircle, newBid)
      subtractTokens(newBid)
      setStep("success")
    }
  }

  const handleClose = () => {
    router.push(`/circles/${selectedCircle}/preview`)
    onOpenChange(false)
    setStep(preselectedCircleId ? "bid" : "select")
    setBidAmount("")
    if (!preselectedCircleId) {
      setSelectedCircle("")
    }
  }

  const isValidBid = bidAmount && newBid > 0 && newBid <= tokens

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/95 z-[89]" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl max-h-[85vh] bg-white border-2 border-black z-[90]">
          {step === "select" && (
            <>
              <div className="bg-white border-b-2 border-black p-4">
                <h2 className="text-2xl font-bold">SELECT CIRCLE TO BID ON</h2>
              </div>

              <div className="p-4">
                <p className="mb-4">Choose which circle you want to place your bid on for the current round</p>

                <div className="space-y-4">
                  {joinedCircles.map((circleAddress) => (
                    <button
                      key={circleAddress}
                      onClick={() => handleCircleSelect(circleAddress)}
                      className="w-full p-6 border-2 border-black flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex-1">
                        <div className="font-bold text-xl mb-2">{mockCircleData.name}</div>
                        <div className="text-base mb-1">Round {mockCircleData.round} auction active</div>
                      </div>
                      <div className="text-sm font-bold ml-4">SELECT →</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === "bid" && (
            <>
              <div className="bg-white border-b-2 border-black p-4">
                <h2 className="text-2xl font-bold">PLACE YOUR BID</h2>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <p className="text-sm mb-1">{mockCircleData.name}</p>
                  <p className="text-lg font-bold">Round {mockCircleData.round} Auction</p>
                </div>

                <div className="border-t-2 border-black pt-4">
                  <label className="text-sm font-bold mb-2 block">BID AMOUNT</label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full h-14 px-4 text-2xl font-bold text-right border-2 border-black"
                    max={tokens}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-600">Available: {tokens} SCT</span>
                    <span className="text-sm">SCT</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => handleQuickBid(0.25)}
                    className="h-9 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors font-bold"
                  >
                    25%
                  </button>
                  <button
                    onClick={() => handleQuickBid(0.5)}
                    className="h-9 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors font-bold"
                  >
                    50%
                  </button>
                  <button
                    onClick={() => handleQuickBid(0.75)}
                    className="h-9 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors font-bold"
                  >
                    75%
                  </button>
                  <button
                    onClick={() => handleQuickBid(1)}
                    className="h-9 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors font-bold"
                  >
                    MAX
                  </button>
                </div>

                {bidAmount && (
                  <div className="border-2 border-black p-3 bg-gray-50">
                    <div className="text-sm font-bold mb-2">SIMULATION</div>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span>Your weight:</span>
                        <span className="font-bold">{newWeight.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remaining balance:</span>
                        <span className="font-bold">{remainingBalance} SCT</span>
                      </div>
                      <div className="flex justify-between pt-1.5 border-t border-black">
                        <span>Total tokens bid:</span>
                        <span className="font-bold">{newBid} SCT</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-3">
                  {!preselectedCircleId && (
                    <button
                      onClick={() => {
                        setStep("select")
                        setBidAmount("")
                      }}
                      className="flex-1 h-12 bg-white text-black font-bold border-2 border-black hover:bg-gray-100"
                    >
                      BACK
                    </button>
                  )}
                  <button
                    onClick={handleSubmitBid}
                    disabled={!isValidBid}
                    className={`flex-1 h-12 font-bold border-2 border-black ${
                      isValidBid
                        ? "bg-accent text-accent-foreground hover:bg-accent-hover"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    PLACE BID
                  </button>
                </div>
              </div>
            </>
          )}

          {step === "success" && (
            <>
              <div className="bg-white border-b-2 border-black p-4">
                <h2 className="text-2xl font-bold">BID PLACED SUCCESSFULLY</h2>
              </div>

              <div className="p-6 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-500 flex items-center justify-center text-4xl text-white font-bold border-2 border-black">
                    ✓
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Your bid is active</h3>
                  <p className="text-base">
                    You've bid {newBid} SCT on {mockCircleData.name}
                  </p>
                </div>

                <div className="border-2 border-black p-3 bg-gray-50">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Your weight:</span>
                      <span className="font-bold">{newWeight.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tokens bid:</span>
                      <span className="font-bold">{newBid} SCT</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining balance:</span>
                      <span className="font-bold">{remainingBalance} SCT</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full h-12 bg-black text-white font-bold border-2 border-black hover:bg-gray-900"
                >
                  GO TO CIRCLE
                </button>
              </div>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
