"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useUser } from "@/contexts/user-context"
import { useCircleContractData } from "@/lib/hooks/use-circle-contract-data"

export function DesktopSidebar() {
  const pathname = usePathname()
  const [walletOpen, setWalletOpen] = useState(false)
  const { joinedCircles, tokens } = useUser()

  const { data: contractData, isLoading } = useCircleContractData(joinedCircles[0])

  const formatDueDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

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
          className={`flex flex-col justify-center px-6 py-4 border-b-2 border-border transition-colors ${
            pathname === "/circles"
              ? "bg-primary text-primary-foreground"
              : "bg-background hover:bg-secondary active:bg-secondary-active"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-bold">CIRCLES</span>
            <span className="text-3xl font-bold">{joinedCircles.length}</span>
          </div>
        </Link>

        {/* Payments navigation item */}
        {joinedCircles.length > 0 && (
          <Link
            href="/payments"
            className={`flex flex-col justify-center px-6 py-4 border-b-2 border-border transition-colors ${
              pathname === "/payments"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary-hover active:bg-secondary-active"
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-sm font-bold">PAYMENTS</span>
            </div>
            <div
              className={`text-xs ${pathname === "/payments" ? "text-primary-foreground opacity-70" : "text-secondary-foreground opacity-70"}`}
            >
              {isLoading || !contractData?.roundDeadline ? (
                <div className="h-4 w-28 bg-black/20 animate-pulse rounded" />
              ) : (
                <>Next due on {formatDueDate(contractData.roundDeadline)}</>
              )}
            </div>
          </Link>
        )}
      </div>

      {/* Tokens section */}
      <Link
        href="/tokens"
        className={`flex flex-col justify-center px-6 py-4 border-t-2 border-border transition-colors ${
          pathname === "/tokens"
            ? "bg-primary text-primary-foreground"
            : "bg-background hover:bg-secondary active:bg-secondary-active"
        }`}
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-bold">TOKENS</span>
          <span className="text-3xl font-bold">{tokens}</span>
        </div>
      </Link>

      {/* Wallet section */}
      <button
        onClick={() => setWalletOpen(!walletOpen)}
        className="h-16 flex items-center justify-between px-6 border-t-2 border-border hover:bg-secondary active:bg-secondary-active transition-colors"
      >
        <div>
          <div className="text-xs font-bold mb-1">WALLET</div>
          <div className="text-sm font-mono">0x7a...c9d</div>
        </div>
      </button>
    </aside>
  )
}

export default DesktopSidebar
