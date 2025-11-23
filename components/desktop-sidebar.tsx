"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useUser } from "@/contexts/user-context"

interface NavItem {
  id: string
  label: string
  href: string
  icon: string
  value?: string | number
  needsAttention?: boolean
  hasActivity?: boolean
}

export function DesktopSidebar() {
  const pathname = usePathname()
  const [walletOpen, setWalletOpen] = useState(false)
  const { joinedCircles } = useUser()

  const navItems: NavItem[] = [
    {
      id: "circles",
      label: "CIRCLES",
      href: "/circles",
      icon: "●●○",
      value: joinedCircles.length,
      hasActivity: false,
    },
    // Only show PAYMENTS if user has joined at least one circle
    ...(joinedCircles.length > 0
      ? [
          {
            id: "payments",
            label: "PAYMENTS",
            href: "/payments",
            icon: "⚠",
            value: "!",
            needsAttention: true,
          },
        ]
      : []),
    {
      id: "position",
      label: "POSITION",
      href: "/profile",
      icon: "■",
    },
  ]

  const getTabBackground = (item: NavItem, isActive: boolean) => {
    if (isActive) return "bg-mandinga-black text-mandinga-white"
    if (item.needsAttention) return "bg-yellow-400"
    if (item.hasActivity) return "bg-yellow-100"
    return "bg-mandinga-white"
  }

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-[240px] bg-mandinga-white border-r-2 border-mandinga-black flex-col z-50">
      {/* Logo Top - 64px */}
      <Link
        href="/"
        className="h-16 flex items-center justify-center border-b-2 border-mandinga-black hover:bg-mandinga-gray-100 transition-colors gap-2"
      >
        <span className="text-xl">⚪️</span>
        <h1 className="text-xl font-bold">MANDINGA</h1>
      </Link>

      {/* Navigation Items */}
      <div className="flex-1 flex flex-col">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`h-[72px] flex flex-col items-start justify-center px-6 border-b-2 border-mandinga-black transition-colors ${getTabBackground(
                item,
                isActive,
              )}`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-bold">{item.label}</span>
                {item.value !== undefined && <span className="text-3xl font-bold">{item.value}</span>}
              </div>

              {/* Icon below */}
              <div className="text-lg leading-none mt-1">{item.icon}</div>
            </Link>
          )
        })}
      </div>

      <Link
        href="/miles"
        className={`h-[72px] flex flex-col items-start justify-center px-6 border-t-2 border-mandinga-black transition-colors ${
          pathname === "/miles"
            ? "bg-mandinga-black text-mandinga-white"
            : "bg-mandinga-white hover:bg-mandinga-gray-100"
        }`}
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-bold">MILES</span>
          <span className="text-3xl font-bold">{joinedCircles.length > 0 ? 1250 : 0}</span>
        </div>
        <div className="text-lg leading-none mt-1">◆</div>
      </Link>

      {/* Wallet Bottom - 64px */}
      <button
        onClick={() => setWalletOpen(!walletOpen)}
        className="h-16 flex items-center justify-between px-6 border-t-2 border-mandinga-black hover:bg-mandinga-gray-100 transition-colors"
      >
        <div>
          <div className="text-xs font-bold mb-1">WALLET</div>
          <div className="text-sm font-mono">0x7a...c9d</div>
        </div>
        <span className="text-lg">{walletOpen ? "▲" : "▼"}</span>
      </button>
    </aside>
  )
}

export default DesktopSidebar
