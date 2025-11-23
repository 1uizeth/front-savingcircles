"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTimer } from "@/contexts/timer-context"
import { useUser } from "@/contexts/user-context"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import ContextBar from "@/components/context-bar"
import { useCircleContractData } from "@/lib/hooks/use-circle-contract-data"
import * as DialogPrimitive from "@radix-ui/react-dialog"

export default function JoinCirclePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { nextRoundSeconds } = useTimer()
  const { joinCircle, isJoined } = useUser()
  const [step, setStep] = useState<"confirm" | "success">("confirm")

  const contractAddress = params.id
  const { data: contractData, loading, error } = useCircleContractData(contractAddress)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">LOADING CIRCLE...</div>
      </div>
    )
  }

  if (error || !contractData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">CIRCLE NOT FOUND</div>
      </div>
    )
  }

  if (isJoined(params.id)) {
    router.push(`/circles/${params.id}`)
    return null
  }

  const goal = contractData.installmentSize * contractData.numRounds
  const installment = contractData.installmentSize
  const totalRounds = contractData.numRounds
  const ticketPrice = 10 // Fixed ticket price in USDC
  const circleName = contractData.name || "Savings Circle"

  const handleConfirm = () => {
    joinCircle(params.id)
    setStep("success")
  }

  const handlePayNow = () => {
    router.push(`/circles/${params.id}/preview`)
  }

  const handlePayLater = () => {
    router.push(`/circles/${params.id}/preview`)
  }

  return (
    <>
      <div className="flex min-h-screen bg-white">
        <DesktopSidebar />

        <div className="flex-1 md:ml-60">
          <ContextBar location={`JOIN ${circleName}`} nextRoundSeconds={nextRoundSeconds} />

          <main className="pb-16 md:pb-0">
            <DialogPrimitive.Root open={step === "confirm"} onOpenChange={(open) => !open && router.back()}>
              <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-[89] bg-black/95" />
                <DialogPrimitive.Content className="fixed top-[50%] left-[50%] z-[90] w-full max-w-md translate-x-[-50%] translate-y-[-50%] border-4 border-black bg-white shadow-2xl">
                  <div className="h-14 bg-white flex items-center px-6 border-b-2 border-black">
                    <h2 className="text-lg font-bold">JOIN CIRCLE</h2>
                  </div>

                  <div className="p-6 space-y-6 bg-white">
                    <div>
                      <p className="text-sm mb-2">You're buying a ticket to:</p>
                      <p className="text-2xl font-bold">{circleName}</p>
                    </div>

                    <div className="border-t-2 border-black pt-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="font-bold">Ticket Price:</span>
                        <span className="font-bold">{ticketPrice} USDC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Installment per round:</span>
                        <span>{installment} USDC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total rounds:</span>
                        <span>{totalRounds}</span>
                      </div>
                    </div>

                    <p className="text-sm pt-2 text-gray-600">
                      After purchase, you'll need to pay your first installment to enter the current round.
                    </p>
                  </div>

                  <div className="p-4 flex gap-2 border-t-2 border-black bg-white">
                    <button
                      onClick={() => router.back()}
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
                </DialogPrimitive.Content>
              </DialogPrimitive.Portal>
            </DialogPrimitive.Root>

            <DialogPrimitive.Root open={step === "success"} onOpenChange={(open) => !open && handlePayLater()}>
              <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-[89] bg-black/95" />
                <DialogPrimitive.Content className="fixed top-[50%] left-[50%] z-[90] w-full max-w-md translate-x-[-50%] translate-y-[-50%] border-4 border-black bg-white shadow-2xl">
                  <div className="bg-white p-8 text-center space-y-6">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 bg-green-500 flex items-center justify-center text-4xl text-white font-bold border-2 border-black">
                        ✓
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold">YOU'RE NOW A MEMBER</h1>
                      <p className="text-lg">Welcome to {circleName}</p>
                    </div>

                    <div className="pt-4">
                      <p className="text-sm">
                        Next: Pay your first installment to enter Round {Math.max(1, contractData.currRound + 1)}
                      </p>
                    </div>

                    <div className="space-y-2 pt-6">
                      <button
                        onClick={handlePayNow}
                        className="w-full h-12 bg-black text-white font-bold border-2 border-black hover:bg-gray-900"
                      >
                        PAY INSTALLMENT NOW
                      </button>
                      <button
                        onClick={handlePayLater}
                        className="w-full h-12 bg-white text-black font-bold border-2 border-black hover:bg-gray-100"
                      >
                        I'LL DO IT LATER
                      </button>
                    </div>
                  </div>
                </DialogPrimitive.Content>
              </DialogPrimitive.Portal>
            </DialogPrimitive.Root>
          </main>
        </div>
      </div>

      <MobileBottomNav />
    </>
  )
}
