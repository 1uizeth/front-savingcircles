"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import ContextBar from "@/components/context-bar"

// Mock result data (would come from API/blockchain)
const getResultData = (id: string, outcome: "winner" | "loser") => {
  const results = {
    winner: {
      circleId: id,
      circleName: "ALPHA CIRCLE",
      round: 3,
      outcome: "winner" as const,
      payoutAmount: 800,
      yourWeight: 18.2,
      drawHash: "7af2b8c9",
      transactionHash: "0x3e9c7fa2d4b8f6e1a9c5d7f2b8e4a6c9d3f7b2e8",
      status: "EXITED",
      statusMessage: "You're no longer in future rounds",
    },
    loser: {
      circleId: id,
      circleName: "ALPHA CIRCLE",
      round: 3,
      outcome: "loser" as const,
      winnerAddress: "0x7a2f...b8c9",
      yourWeight: 12.5,
      drawHash: "3e9c7fa2",
      status: "ACTIVE",
      statusMessage: "You remain in the consortium for the next round",
      nextRoundStarts: "2d 6h",
      nextRound: 4,
    },
  }
  return results[outcome]
}

export default function ResultPage() {
  const params = useParams()
  const router = useRouter()
  const circleId = params.id as string

  // Demo toggle - in production this would be determined by actual draw results
  const [demoOutcome, setDemoOutcome] = useState<"winner" | "loser">("winner")
  const result = getResultData(circleId, demoOutcome)

  const isWinner = result.outcome === "winner"

  return (
    <div className="min-h-screen flex bg-white">
      <DesktopSidebar />

      <main className="flex-1 md:ml-[240px] pb-20 md:pb-0">
        <ContextBar location={`ROUND ${result.round} — RESULT`} phase="result" />

        {/* Demo Controls - Fixed bottom on mobile, top-right on desktop */}
        <div className="fixed bottom-20 left-0 right-0 md:bottom-auto md:top-20 md:right-4 md:left-auto z-30 flex gap-2 p-4 md:p-0 bg-white md:bg-transparent border-t-2 md:border-0 border-black">
          <button
            onClick={() => setDemoOutcome("winner")}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold border-2 border-black ${
              demoOutcome === "winner" ? "bg-[#00FF00]" : "bg-white"
            }`}
          >
            WINNER
          </button>
          <button
            onClick={() => setDemoOutcome("loser")}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold border-2 border-black ${
              demoOutcome === "loser" ? "bg-gray-200" : "bg-white"
            }`}
          >
            NOT SELECTED
          </button>
        </div>

        {isWinner && (
          <div className="flex flex-col">
            {/* Hero Area - Exactly 240px with success green tint */}
            <div
              className="flex flex-col items-center justify-center border-b-2 border-black bg-[#00FF00] bg-opacity-20"
              style={{ height: "240px" }}
            >
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 px-4">YOU WERE SELECTED</div>
              <div className="text-lg md:text-xl font-mono">ROUND {result.round}</div>
            </div>

            {/* Details Block */}
            <div className="border-b-2 border-black">
              <div className="p-4 md:p-6 border-b-2 border-black">
                <div className="text-sm font-bold">PAYOUT DETAILS</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
                <div className="p-4 md:p-6">
                  <div className="text-xs mb-2 text-gray-600">Amount:</div>
                  <div className="text-xl md:text-2xl font-bold">{result.payoutAmount} USDC</div>
                </div>
                <div className="p-4 md:p-6">
                  <div className="text-xs mb-2 text-gray-600">Your Weight:</div>
                  <div className="text-xl md:text-2xl font-bold">{result.yourWeight}%</div>
                </div>
                <div className="p-4 md:p-6">
                  <div className="text-xs mb-2 text-gray-600">Draw ID:</div>
                  <div className="text-base md:text-lg font-mono break-all">0x{result.drawHash}</div>
                </div>
              </div>
            </div>

            {/* Exit Status Block */}
            <div className="border-b-2 border-black p-4 md:p-6 min-h-[80px]">
              <div className="text-sm font-bold mb-1">STATUS: {result.status}</div>
              <div className="text-sm text-gray-600">You will not participate in upcoming rounds</div>
            </div>

            {/* Action Zone */}
            <div className="flex flex-col gap-4 p-4 md:p-6 mb-24 md:mb-0" style={{ minHeight: "120px" }}>
              <button
                onClick={() => window.open(`https://etherscan.io/tx/${result.transactionHash}`, "_blank")}
                className="w-full border-2 border-black bg-white hover:bg-gray-100 transition-colors font-bold text-sm"
                style={{ height: "48px" }}
              >
                VIEW TRANSACTION
              </button>
              <button
                onClick={() => router.push("/circles")}
                className="w-full border-2 border-black bg-white hover:bg-gray-100 transition-colors font-bold text-sm"
                style={{ height: "48px" }}
              >
                BACK TO CIRCLES
              </button>
            </div>
          </div>
        )}

        {!isWinner && (
          <div className="flex flex-col">
            {/* Hero Area - 200px with neutral gray tint */}
            <div
              className="flex flex-col items-center justify-center border-b-2 border-black bg-gray-200 bg-opacity-30"
              style={{ height: "200px" }}
            >
              <div className="w-12 h-12 md:w-16 md:h-16 border-2 border-black rounded-full mb-6"></div>
              <div className="text-xl md:text-2xl lg:text-3xl font-bold text-center px-4">NOT SELECTED THIS ROUND</div>
            </div>

            {/* Draw Details */}
            <div className="border-b-2 border-black">
              <div className="p-4 md:p-6 border-b-2 border-black">
                <div className="text-sm font-bold">DRAW DETAILS</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
                <div className="p-4 md:p-6">
                  <div className="text-xs mb-2 text-gray-600">Winner:</div>
                  <div className="text-base md:text-lg font-mono break-all">{result.winnerAddress}</div>
                </div>
                <div className="p-4 md:p-6">
                  <div className="text-xs mb-2 text-gray-600">Your Weight:</div>
                  <div className="text-xl md:text-2xl font-bold">{result.yourWeight}%</div>
                </div>
                <div className="p-4 md:p-6">
                  <div className="text-xs mb-2 text-gray-600">Draw ID:</div>
                  <div className="text-base md:text-lg font-mono break-all">0x{result.drawHash}</div>
                </div>
              </div>
            </div>

            {/* Continuity Info */}
            <div className="border-b-2 border-black p-4 md:p-6 min-h-[80px]">
              <div className="text-sm mb-2">You remain in the consortium</div>
              <div className="text-sm text-gray-600">Next Round Starts: {result.nextRoundStarts}</div>
            </div>

            {/* Action Zone */}
            <div className="p-4 md:p-6 mb-24 md:mb-0">
              <button
                onClick={() => router.push(`/circles/${circleId}`)}
                className="w-full border-2 border-black bg-white hover:bg-gray-100 transition-colors font-bold text-sm"
                style={{ height: "48px" }}
              >
                GO TO ROUND {result.nextRound}
              </button>
            </div>
          </div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  )
}
