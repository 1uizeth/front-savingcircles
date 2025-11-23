"use client"

import MobileBottomNav from "@/components/mobile-bottom-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import ContextBar from "@/components/context-bar"
import { useTimer } from "@/contexts/timer-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const CIRCLE_CONTRACT_ADDRESS = "0xfDF73F61146B9050FFe4b755364B9CAC670ea5b2"

export default function ProfilePage() {
  const { nextRoundSeconds } = useTimer()
  const router = useRouter()

  useEffect(() => {
    if (nextRoundSeconds === 0) {
      router.push("/circles/1/result")
    }
  }, [nextRoundSeconds, router])

  return (
    <div className="min-h-screen flex">
      <DesktopSidebar />

      <main className="flex-1 md:ml-[240px] pb-[72px] md:pb-0">
        <ContextBar
          location="YOUR PROFILE"
          phase="contribution"
          nextRoundSeconds={nextRoundSeconds}
          circleId={CIRCLE_CONTRACT_ADDRESS}
        />

        <div className="px-4 py-8">
          <h1 className="text-2xl font-bold">PROFILE PAGE</h1>
          <p className="mt-4">Your profile settings and information will appear here.</p>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  )
}
