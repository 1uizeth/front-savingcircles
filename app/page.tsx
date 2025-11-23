"use client"
import Link from "next/link"
import { useEffect, Suspense } from "react"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { DesktopSidebar } from "@/components/desktop-sidebar"
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

export default function HomePage() {
  const { nextRoundSeconds } = useTimer()
  const { isJoined } = useUser()
  const router = useRouter()
  const { data: contractData, loading, error } = useCircleContractData(CIRCLE_CONTRACT_ADDRESS)

  useEffect(() => {
    if (nextRoundSeconds === 0) {
      router.push(`/circles/${CIRCLE_CONTRACT_ADDRESS}/result`)
    }
  }, [nextRoundSeconds, router])

  if (loading) {
    return (
      <div className="min-h-screen flex bg-background">
        <Suspense fallback={<div className="w-[240px] hidden md:block" />}>
          <DesktopSidebar />
        </Suspense>
        <main className="flex-1 md:ml-[240px] pb-20 md:pb-0">
          <div className="divide-y-4 divide-border">
            <div className="block border-b-4 border-border bg-background p-4 sm:p-8 animate-pulse">
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
        </main>
        <MobileBottomNav />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex bg-background">
        <Suspense fallback={<div className="w-[240px] hidden md:block" />}>
          <DesktopSidebar />
        </Suspense>
        <main className="flex-1 md:ml-[240px] pb-20 md:pb-0">
          <div className="p-8 text-center text-destructive">Error loading circles: {error}</div>
        </main>
        <MobileBottomNav />
      </div>
    )
  }

  if (!contractData) {
    return (
      <div className="min-h-screen flex bg-white">
        <Suspense fallback={<div className="w-[240px] hidden md:block" />}>
          <DesktopSidebar />
        </Suspense>
        <main className="flex-1 md:ml-[240px] pb-20 md:pb-0">
          <div className="p-8 text-center">No circles available</div>
        </main>
        <MobileBottomNav />
      </div>
    )
  }

  const userIsJoined = isJoined(CIRCLE_CONTRACT_ADDRESS)
  const goalAmount = contractData.installmentSize * contractData.currRound

  return (
    <div className="min-h-screen flex bg-background">
      <Suspense fallback={<div className="w-[240px] hidden md:block" />}>
        <DesktopSidebar />
      </Suspense>

      <main className="flex-1 md:ml-[240px] pb-20 md:pb-0">
        <div className="divide-y-4 divide-border">
          <Link
            href={userIsJoined ? `/circles/${CIRCLE_CONTRACT_ADDRESS}` : `/circles/${CIRCLE_CONTRACT_ADDRESS}/preview`}
            className="block bg-background hover:bg-secondary transition-colors border-b-4 border-border"
          >
            <div className="p-4 sm:p-8">
              {/* Header Row - Round and Goal */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="text-sm mb-2">
                    ROUND {contractData.numRounds} OF {contractData.currRound}
                    {userIsJoined && <span className="ml-2 text-green-600">● JOINED</span>}
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold">${goalAmount}</div>
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
                  <div className="text-lg sm:text-xl font-bold">${contractData.installmentSize} / ROUND</div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xs mb-1">MEMBERS</div>
                  <div className="text-lg sm:text-xl font-bold">
                    {contractData.numUsers}/{contractData.currRound}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  )
}
