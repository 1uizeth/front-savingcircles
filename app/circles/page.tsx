"use client"
import Link from "next/link"
import { useEffect, Suspense } from "react"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
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

  const hasJoinedCircle = joinedCircles.includes(CIRCLE_CONTRACT_ADDRESS)
  const { data: contractData, loading } = useCircleContractData(hasJoinedCircle ? CIRCLE_CONTRACT_ADDRESS : undefined)

  useEffect(() => {
    if (nextRoundSeconds === 0) {
      router.push(`/circles/${CIRCLE_CONTRACT_ADDRESS}/result`)
    }
  }, [nextRoundSeconds, router])

  return (
    <div className="min-h-screen flex bg-white">
      <Suspense fallback={<div className="hidden md:block w-[240px]" />}>
        <DesktopSidebar />
      </Suspense>

      <main className="flex-1 md:ml-[240px] pb-20 md:pb-0">
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
              GET STARTED
            </Link>
          </div>
        ) : (
          <div className="divide-y-2 divide-black">
            <div className="block bg-white border-b-2 border-black">
              <div className="p-4 sm:p-8">
                {/* Header Row - Round and Goal */}
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
                  <Link
                    href={`/circles/${CIRCLE_CONTRACT_ADDRESS}/preview`}
                    className="flex-1 hover:opacity-70 transition-opacity"
                  >
                    <div className="text-sm mb-2">
                      ROUND {contractData.numRounds} OF {contractData.currRound}
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold">
                      ${contractData.installmentSize * contractData.currRound}
                    </div>
                  </Link>
                  <div
                    onClick={() => router.push(`/circles/${CIRCLE_CONTRACT_ADDRESS}/result`)}
                    className="text-left sm:text-right cursor-pointer hover:opacity-70 transition-opacity"
                  >
                    <div className="text-sm mb-1 flex items-center justify-start sm:justify-end gap-2">
                      <span>NEXT ROUND IN</span>
                      <Link
                        href={`/circles/${CIRCLE_CONTRACT_ADDRESS}/result`}
                        className="text-xs opacity-40 hover:opacity-100 underline transition-opacity"
                      >
                        NOW
                      </Link>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold">{formatTime(nextRoundSeconds)}</div>
                  </div>
                </div>

                {/* Bottom Row - Installment and Members aligned at the top */}
                <Link
                  href={`/circles/${CIRCLE_CONTRACT_ADDRESS}/preview`}
                  className="flex flex-col sm:flex-row items-start justify-between gap-4 hover:opacity-70 transition-opacity"
                >
                  <div>
                    <div className="text-xs mb-1">INSTALLMENT</div>
                    <div className="text-lg sm:text-xl font-bold">${contractData.installmentSize}</div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-xs mb-1">MEMBERS</div>
                    <div className="text-lg sm:text-xl font-bold">{contractData.numUsers}</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  )
}
