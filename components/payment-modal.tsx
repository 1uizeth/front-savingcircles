"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { useUser } from "@/contexts/user-context"

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  circleId: string
  installment: number
  currentRound: number
  totalRounds: number
}

export function PaymentModal({
  open,
  onOpenChange,
  circleId,
  installment,
  currentRound,
  totalRounds,
}: PaymentModalProps) {
  const router = useRouter()
  const { addTokens } = useUser()
  const [step, setStep] = useState<"confirm" | "success">("confirm")
  const tokensEarned = installment * 10

  const handleConfirm = () => {
    // Trigger payment transaction here
    console.log("[v0] Payment confirmed for circle:", circleId)
    addTokens(tokensEarned)
    setStep("success")
  }

  const handleClose = () => {
    setStep("confirm")
    onOpenChange(false)
  }

  const handleGoToAuction = () => {
    handleClose()
    router.push(`/circles/${circleId}/auction`)
  }

  const handleGoToMiles = () => {
    handleClose()
    router.push("/miles")
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <DialogPrimitive.Content className="fixed top-[50%] left-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] border-4 border-black bg-white shadow-lg">
          {step === "confirm" && (
            <>
              {/* Header */}
              <div className="h-14 bg-gray-100 flex items-center px-6 border-b-2 border-black">
                <h2 className="text-lg font-bold">CONFIRM PAYMENT</h2>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div>
                  <p className="text-sm mb-2 text-gray-600">
                    Round {currentRound} of {totalRounds} installment:
                  </p>
                  <p className="text-4xl font-bold">${installment}</p>
                </div>

                <div className="border-t-2 border-black pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="font-bold">Amount to pay:</span>
                    <span className="font-bold">${installment}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Round:</span>
                    <span>
                      {currentRound} of {totalRounds}
                    </span>
                  </div>
                </div>

                <p className="text-xs pt-2 text-gray-600">
                  By confirming, you agree to pay ${installment} for Round {currentRound}. This payment keeps you active
                  in the circle.
                </p>
              </div>

              {/* Footer */}
              <div className="p-4 flex gap-2 border-t-2 border-black">
                <button
                  onClick={handleClose}
                  className="flex-1 h-12 bg-white text-black font-bold border-2 border-black hover:bg-gray-100"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 h-12 bg-black text-white font-bold border-2 border-black hover:bg-gray-900"
                >
                  PAY ${installment}
                </button>
              </div>
            </>
          )}

          {step === "success" && (
            <>
              {/* Success Content */}
              <div className="p-8 text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-500 flex items-center justify-center text-4xl text-white font-bold border-2 border-black">
                    ✓
                  </div>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">PAYMENT SUCCESSFUL</h1>
                  <p className="text-lg">You've paid for Round {currentRound}</p>
                </div>

                <div className="bg-[#FFEB3B] border-2 border-black p-6">
                  <div className="text-sm mb-1">YOU EARNED</div>
                  <div className="text-4xl font-bold mb-2">+{tokensEarned} TOKENS</div>
                  <p className="text-xs">Tokens earned for this installment payment</p>
                </div>

                <div className="space-y-2 pt-4">
                  <button
                    onClick={handleClose}
                    className="w-full h-12 bg-black text-white font-bold border-2 border-black hover:bg-gray-900"
                  >
                    DONE
                  </button>
                  <button
                    onClick={handleGoToAuction}
                    className="w-full h-12 bg-white text-black font-bold border-2 border-black hover:bg-gray-100"
                  >
                    ADD TOKENS TO AUCTION
                  </button>
                  <p className="text-xs text-gray-600">
                    Add your tokens to the auction to improve your chances of winning this round
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
