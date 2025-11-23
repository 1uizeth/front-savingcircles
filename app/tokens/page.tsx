"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { useUser } from "@/contexts/user-context"
import { AuctionFlowModal } from "@/components/auction-flow-modal"

export default function TokensPage() {
  const { joinedCircles, tokens } = useUser()
  const router = useRouter()
  const [showAuctionFlow, setShowAuctionFlow] = useState(false)

  const hasTokens = joinedCircles.length > 0

  return (
    <div className="min-h-screen flex bg-white">
      <Suspense fallback={<div className="w-[240px] hidden md:block" />}>
        <DesktopSidebar />
      </Suspense>

      <main className="flex-1 md:ml-[240px] pb-20 md:pb-0">
        {!hasTokens ? (
          <div className="p-8 max-w-2xl mx-auto">
            <div className="text-center mb-12 pt-8">
              <div className="text-4xl font-bold mb-4">NO TOKENS YET</div>
              <div className="text-lg mb-8">Join your first circle to start earning tokens</div>
            </div>

            <div className="border-2 border-black mb-8">
              <div className="h-12 bg-gray-100 flex items-center px-4 border-b-2 border-black">
                <h2 className="text-sm font-bold">HOW IT WORKS</h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex gap-4">
                  <span className="text-2xl font-bold">1.</span>
                  <div>
                    <div className="font-bold mb-1">Join a circle and participate</div>
                    <div className="text-sm">Make your USDC payments on time each round</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl font-bold">2.</span>
                  <div>
                    <div className="font-bold mb-1">Earn tokens automatically</div>
                    <div className="text-sm">Get 10 tokens for every $1 you contribute to your circles</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl font-bold">3.</span>
                  <div>
                    <div className="font-bold mb-1">Use tokens to bid in auctions</div>
                    <div className="text-sm">Add tokens to increase your odds of winning each round</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl font-bold">4.</span>
                  <div>
                    <div className="font-bold mb-1">Track your tokens across all circles</div>
                    <div className="text-sm">Your balance accumulates as you participate in multiple circles</div>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/"
              className="block w-full h-16 bg-black text-white text-lg font-bold border-2 border-black hover:bg-gray-900 flex items-center justify-center"
            >
              BROWSE CIRCLES
            </Link>
          </div>
        ) : (
          <div className="p-8 max-w-4xl mx-auto pb-24 md:pb-8">
            <div className="border-2 border-black mb-8 p-12 bg-yellow-100">
              <div className="text-sm mb-2">TOTAL BALANCE</div>
              <div className="text-7xl font-bold mb-2">{tokens}</div>
              <div className="text-lg">SCT</div>
            </div>

            <div className="border-2 border-black mb-8">
              <div className="h-12 bg-gray-100 flex items-center px-6 border-b-2 border-black">
                <h2 className="text-sm font-bold">STEPS TO USE YOUR TOKENS</h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex gap-4">
                  <span className="text-2xl font-bold flex-shrink-0">1.</span>
                  <div>
                    <div className="font-bold mb-1">Click "Join Auction" to get started</div>
                    <div className="text-sm">
                      The button below will open the auction flow where you can select your circle
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl font-bold flex-shrink-0">2.</span>
                  <div>
                    <div className="font-bold mb-1">Select which circle to bid on</div>
                    <div className="text-sm">Choose from your active circles to participate in the current round</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl font-bold flex-shrink-0">3.</span>
                  <div>
                    <div className="font-bold mb-1">Enter your bid amount</div>
                    <div className="text-sm">Decide how many tokens to add. More tokens = higher chance of winning</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl font-bold flex-shrink-0">4.</span>
                  <div>
                    <div className="font-bold mb-1">Monitor and adjust your bid</div>
                    <div className="text-sm">Track your odds and modify your bid anytime before the round closes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {hasTokens && joinedCircles.length > 0 && (
        <>
          <div className="fixed bottom-0 left-0 right-0 md:left-[240px] border-t-2 border-black bg-white p-4 z-30 mb-[72px] md:mb-0">
            <button
              onClick={() => setShowAuctionFlow(true)}
              className="w-full h-16 text-2xl font-bold border-2 border-black bg-accent text-accent-foreground hover:bg-accent-hover transition-colors flex items-center justify-center"
            >
              JOIN AUCTION
            </button>
          </div>

          <AuctionFlowModal open={showAuctionFlow} onOpenChange={setShowAuctionFlow} />
        </>
      )}

      <MobileBottomNav />
    </div>
  )
}
