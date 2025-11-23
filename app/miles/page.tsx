"use client"
import Link from "next/link"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { useTimer } from "@/contexts/timer-context"
import { useUser } from "@/contexts/user-context"

export default function MilesPage() {
  const { nextRoundSeconds } = useTimer()
  const { joinedCircles, tokens } = useUser()

  const hasMiles = joinedCircles.length > 0

  return (
    <div className="min-h-screen flex bg-white">
      <DesktopSidebar />

      <main className="flex-1 md:ml-[240px] pb-20 md:pb-0">
        {!hasMiles ? (
          <div className="p-8 max-w-2xl mx-auto">
            <div className="text-center mb-12 pt-8">
              <div className="text-4xl font-bold mb-4">NO TOKENS YET</div>
              <div className="text-lg mb-8">Join your first circle to start earning tokens</div>
            </div>

            {/* How it works section */}
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
          <div className="p-8 max-w-4xl mx-auto">
            {/* Total Balance Card */}
            <div className="border-2 border-black mb-8 p-8 bg-yellow-100">
              <div className="text-sm mb-2">TOTAL BALANCE</div>
              <div className="text-6xl font-bold mb-2">{tokens}</div>
              <div className="text-sm">Tokens</div>
            </div>

            {/* How Tokens Work */}
            <div className="border-2 border-black mb-8">
              <div className="h-12 bg-gray-100 flex items-center px-4 sm:px-6 border-b-2 border-black">
                <h2 className="text-sm font-bold">HOW TOKENS WORK</h2>
              </div>
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex gap-4">
                  <span className="text-2xl font-bold flex-shrink-0">1.</span>
                  <div>
                    <div className="font-bold mb-1">Earn tokens with every payment</div>
                    <div className="text-sm text-gray-600">
                      Get 10 tokens for every $1 you contribute to your circles
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl font-bold flex-shrink-0">2.</span>
                  <div>
                    <div className="font-bold mb-1">Add tokens to auctions</div>
                    <div className="text-sm text-gray-600">
                      Use your tokens to bid in circle auctions and increase your winning odds
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl font-bold flex-shrink-0">3.</span>
                  <div>
                    <div className="font-bold mb-1">Tokens accumulate across circles</div>
                    <div className="text-sm text-gray-600">
                      Your total balance grows as you participate in multiple circles
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl font-bold flex-shrink-0">4.</span>
                  <div>
                    <div className="font-bold mb-1">Strategic bidding increases chances</div>
                    <div className="text-sm text-gray-600">
                      The more tokens you add to a circle, the better your odds of winning
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Allocations */}
            <div className="border-2 border-black mb-8">
              <div className="h-12 bg-gray-100 flex items-center px-4 sm:px-6 border-b-2 border-black">
                <h2 className="text-sm font-bold">CURRENT ALLOCATIONS</h2>
              </div>
              <div className="divide-y-2 divide-black">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-bold">Vacation Fund</div>
                    <div className="text-xl font-bold">100</div>
                  </div>
                  <div className="text-sm text-gray-600">Bid in current auction</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-bold">Emergency Savings</div>
                    <div className="text-xl font-bold">50</div>
                  </div>
                  <div className="text-sm text-gray-600">Bid in current auction</div>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="border-2 border-black">
              <div className="h-12 bg-gray-100 flex items-center px-4 sm:px-6 border-b-2 border-black">
                <h2 className="text-sm font-bold">TRANSACTION HISTORY</h2>
              </div>
              <div className="divide-y-2 divide-black">
                <div className="p-6 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-green-600">+ 50</div>
                    <div className="text-sm text-gray-600">Earned from Vacation Fund - Round 7</div>
                  </div>
                  <div className="text-sm text-gray-500">2h ago</div>
                </div>
                <div className="p-6 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-red-600">- 100</div>
                    <div className="text-sm text-gray-600">Bid in Vacation Fund auction</div>
                  </div>
                  <div className="text-sm text-gray-500">1d ago</div>
                </div>
                <div className="p-6 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-green-600">+ 50</div>
                    <div className="text-sm text-gray-600">Earned from Emergency Savings - Round 3</div>
                  </div>
                  <div className="text-sm text-gray-500">3d ago</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  )
}
