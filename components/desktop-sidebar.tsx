"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useUser } from "@/contexts/user-context"
import { useCircleContractData } from "@/lib/hooks/use-circle-contract-data"
import { usePaymentHistory } from "@/lib/hooks/use-payment-history"

export function DesktopSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [walletOpen, setWalletOpen] = useState(false)
  const [highlightCircles, setHighlightCircles] = useState(false)
  const { joinedCircles, tokens } = useUser()

  const { data: contractData, isLoading } = useCircleContractData(joinedCircles[0])
  const { payments } = usePaymentHistory(joinedCircles)

  const formatDueDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const totalInstallments = payments.filter((p) => !p.pending).length

  useEffect(() => {
    const joined = searchParams.get("joined")
    if (joined === "true") {
      setHighlightCircles(true)
      setTimeout(() => {
        setHighlightCircles(false)
      }, 5000)
    }
  }, [searchParams])

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-[240px] bg-background border-r-2 border-border flex-col z-50">
      {/* Logo Top */}
      <Link
        href="/"
        className="h-16 flex items-center px-6 border-b-2 border-border hover:bg-secondary transition-colors"
      >
        <h1 className="text-xl font-bold">SavingCircle</h1>
      </Link>

      {/* Navigation Items */}
      <div className="flex-1 flex flex-col">
        {/* Circles navigation item */}
        <Link
          href="/circles"
          className={`flex items-center justify-between px-6 py-4 border-b-2 border-border transition-colors ${
            highlightCircles
              ? "bg-green-500 text-white"
              : pathname === "/circles"
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-secondary active:bg-secondary-active"
          }`}
        >
          <div className="flex flex-col">
            <span className="text-sm font-bold">CIRCLES</span>
            <div
              className={`text-xs ${
                highlightCircles
                  ? "text-white opacity-70"
                  : pathname === "/circles"
                    ? "text-primary-foreground opacity-70"
                    : "text-foreground opacity-70"
              }`}
            >
              {joinedCircles.length === 0
                ? "No circles yet"
                : joinedCircles.length === 1
                  ? "You are part of one circle"
                  : `You are part of ${joinedCircles.length} circles`}
            </div>
          </div>
          <div className="text-sm font-bold">{joinedCircles.length}</div>
        </Link>

        {/* Payments navigation item */}
        {joinedCircles.length > 0 && (
          <Link
            href="/payments"
            className={`flex items-center justify-between px-6 py-4 border-b-2 border-border transition-colors ${
              pathname === "/payments"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary-hover active:bg-secondary-active"
            }`}
          >
            <div className="flex flex-col">
              <span className="text-sm font-bold">PAYMENTS</span>
              <div
                className={`text-xs ${pathname === "/payments" ? "text-primary-foreground opacity-70" : "text-secondary-foreground opacity-70"}`}
              >
                {isLoading || !contractData?.roundDeadline ? (
                  <div className="h-4 w-28 bg-black/20 animate-pulse rounded" />
                ) : (
                  <>Next due on {formatDueDate(contractData.roundDeadline)}</>
                )}
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Tokens section */}
      <Link
        href="/tokens"
        className={`flex items-center px-6 py-4 border-t-2 border-border transition-colors gap-[] justify-between ${
          pathname === "/tokens"
            ? "bg-primary text-primary-foreground"
            : "bg-background hover:bg-secondary active:bg-secondary-active"
        }`}
      >
        <span className="text-sm font-bold">TOKENS</span>
        <div className="text-sm font-bold">{tokens}</div>
      </Link>

      {/* Wallet section */}
      <button
        onClick={() => setWalletOpen(!walletOpen)}
        className="h-16 flex items-center justify-between px-6 border-t-2 border-border hover:bg-secondary active:bg-secondary-active transition-colors"
      >
        <div className="flex flex-col text-left">
          <span className="text-sm font-bold">WALLET</span>
          <div className="text-xs text-foreground opacity-70 font-mono">0x7a...c9d</div>
        </div>
        <div className="text-sm font-bold text-green-500">●</div>
      </button>
    </aside>
  )
}

export default DesktopSidebar
