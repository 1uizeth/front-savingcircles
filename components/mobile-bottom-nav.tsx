"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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

export function MobileBottomNav() {
  const pathname = usePathname()
  const { joinedCircles } = useUser()

  const navItems: NavItem[] = [
    {
      id: "circles",
      label: "CIRCLES", // Changed back from "SAVING CIRCLES" to "CIRCLES"
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
      id: "tokens",
      label: "TOKENS",
      href: "/tokens",
      icon: "◆",
      value: joinedCircles.length > 0 ? 1250 : 0,
      hasActivity: joinedCircles.length > 0,
    },
  ]

  const getTabBackground = (item: NavItem, isActive: boolean) => {
    if (isActive) return "bg-black text-white"
    return "bg-white text-black"
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t-2 border-black z-[100] md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="h-full flex">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center border-r-2 last:border-r-0 border-black transition-colors ${getTabBackground(
                item,
                isActive,
              )}`}
            >
              {/* Value/Status - Large */}
              {item.value !== undefined && <div className="text-xl font-bold leading-none mb-1">{item.value}</div>}

              {/* Icon */}
              <div className="text-base leading-none mb-1">{item.icon}</div>

              {/* Label */}
              <div className="text-[10px] font-bold leading-none">{item.label}</div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileBottomNav
