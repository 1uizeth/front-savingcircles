"use client"
import Link from "next/link"
import { useEffect } from "react"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import ContextBar from "@/components/context-bar"
import { useTimer } from "@/contexts/timer-context"
import { useUser } from "@/contexts/user-context"
import { useRouter } from "next/navigation"
import { allCircles } from "@/lib/mock-data"

const formatTime = (seconds: number) => {
  if (seconds >= 24 * 60 * 60) {
    const days = Math.floor(seconds / (24 * 60 * 60))
    return `${days}d`
  }
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}

export default function CirclesPage() {
  const { nextRoundSeconds } = useTimer()
  const { joinedCircles } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (nextRoundSeconds === 0) {
      router.push(`/circles/1/result`)
    }
  }, [nextRoundSeconds, router])

  const myCircles = allCircles.filter((circle) => joinedCircles.includes(circle.id))

  return (
    <div className="min-h-screen flex bg-white">
      <DesktopSidebar />

      <main className="flex-1 md:ml-[240px] pb-20 md:pb-0">
        <ContextBar location="CIRCLES" nextRoundSeconds={nextRoundSeconds} />

        {myCircles.length === 0 ? (
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
                    <div className="font-bold mb-1">Buy a ticket to join</div>
                    <div className="text-sm">Pay a one-time ticket price to become a member</div>
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
                    <div className="font-bold mb-1">Get selected randomly to receive the pot</div>
                    <div className="text-sm">Random drawing determines who wins each round</div>
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
            {myCircles.map((circle) => {
              const phaseColor =
                circle.phase === "contribution"
                  ? "bg-[#E8FFE8]"
                  : circle.phase === "auction"
                    ? "bg-[#E8F4FF]"
                    : circle.phase === "drawing"
                      ? "bg-[#FFF4E8]"
                      : "bg-white"

              return (
                <Link
                  key={circle.id}
                  href={`/circles/${circle.id}`}
                  className={`block ${phaseColor} hover:bg-gray-100 transition-colors border-b-2 border-black`}
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="text-4xl font-bold mb-2">{circle.name}</div>
                        <div className="text-sm">
                          ROUND {circle.round} • {circle.phase.toUpperCase()}
                        </div>
                        <div className="mt-1 text-[11px] uppercase tracking-wide text-gray-500">CONTRACT</div>
                        <div className="text-xs font-mono break-all">{circle.address}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm mb-1">TIME LEFT</div>
                        <div className="text-2xl font-bold">{formatTime(circle.timeLeft)}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs mb-1">PRIZE</div>
                        <div className="text-xl font-bold">{circle.prize} MNDG</div>
                      </div>
                      <div>
                        <div className="text-xs mb-1">MEMBERS</div>
                        <div className="text-xl font-bold">{circle.members}</div>
                      </div>
                      <div>
                        <div className="text-xs mb-1">INSTALLMENT</div>
                        <div className="text-xl font-bold">{circle.installment} MNDG</div>
                      </div>
                      <div>
                        <div className="text-xs mb-1">POOL</div>
                        <div className="text-xl font-bold">{circle.totalContributions} MNDG</div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  )
}
