"use client"
import Link from "next/link"
import { useEffect } from "react"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import ContextBar from "@/components/context-bar"
import { useTimer } from "@/contexts/timer-context"
import { useUser } from "@/contexts/user-context"
import { useRouter } from "next/navigation"
import { useCircleContractData } from "@/lib/hooks/use-circle-contract-data"

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours}h ${minutes}m ${secs}s`
}

const CIRCLE_CONTRACT_ADDRESS = "0xfDF73F61146B9050FFe4b755364B9CAC670ea5b2"

export default function CirclesPage() {
  const { nextRoundSeconds } = useTimer()
  const { joinedCircles } = useUser()
  const router = useRouter()
  const { data: contractData, loading } = useCircleContractData(CIRCLE_CONTRACT_ADDRESS)

  useEffect(() => {
    if (nextRoundSeconds === 0) {
      router.push(`/circles/${CIRCLE_CONTRACT_ADDRESS}/result`)
    }
  }, [nextRoundSeconds, router])

  const hasJoinedCircle = joinedCircles.includes(CIRCLE_CONTRACT_ADDRESS)

  return (
    <div className="min-h-screen flex bg-white">
      <DesktopSidebar />

      <main className="flex-1 md:ml-[240px] pb-20 md:pb-0">
        <ContextBar location="CIRCLES" />

        {loading ? (
          <div className="divide-y-2 divide-black">
            <div className="block border-b-2 border-black bg-white p-4 sm:p-8 animate-pulse">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                  <div className="h-10 bg-gray-300 rounded w-48"></div>
                </div>
                <div className="text-left sm:text-right space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                  <div className="h-8 bg-gray-300 rounded w-40"></div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded w-24"></div>
                  <div className="h-6 bg-gray-300 rounded w-36"></div>
                </div>
                <div className="text-left sm:text-right space-y-2">
                  <div className="h-3 bg-gray-300 rounded w-20"></div>
                  <div className="h-6 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
        ) : !hasJoinedCircle || !contractData ? (
          <div className="p-8 max-w-2xl mx-auto">
            <div className="text-center mb-12 pt-8">
              <div className="text-4xl font-bold mb-4">NO CIRCLES YET</div>
              <div className="text-lg mb-8">Join your first circle to get started</div>
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
                    <div className="font-bold mb-1">Join a circle</div>
                    <div className="text-sm">Become a member and start saving together with others</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl font-bold">2.</span>
                  <div>
                    <div className="font-bold mb-1">Pay installment each round</div>
                    <div className="text-sm">Contribute your share to the pot every round</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl font-bold">3.</span>
                  <div>
                    <div className="font-bold mb-1">Win the pot when selected</div>
                    <div className="text-sm">Random selection determines who receives the pot each round</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl font-bold">4.</span>
                  <div>
                    <div className="font-bold mb-1">Everyone wins once, then circle completes</div>
                    <div className="text-sm">Fair distribution ensures everyone gets their turn</div>
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
          <div className="divide-y-2 divide-black">
            <Link
              href={`/circles/${CIRCLE_CONTRACT_ADDRESS}/preview`}
              className="block bg-white hover:bg-gray-100 transition-colors border-b-2 border-black"
            >
              <div className="p-4 sm:p-8">
                {/* Header Row - Round and Goal */}
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <div className="text-sm mb-2">
                      ROUND {contractData.currRound} OF {contractData.numRounds}
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold">
                      ${contractData.installmentSize * contractData.numRounds}
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-sm mb-1">NEXT ROUND IN</div>
                    <div className="text-xl sm:text-2xl font-bold">{formatTime(nextRoundSeconds)}</div>
                  </div>
                </div>

                {/* Bottom Row - Installment and Members aligned at the top */}
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div>
                    <div className="text-xs mb-1">INSTALLMENT</div>
                    <div className="text-lg sm:text-xl font-bold">${contractData.installmentSize}</div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-xs mb-1">MEMBERS</div>
                    <div className="text-lg sm:text-xl font-bold">{contractData.numUsers}</div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  )
}
