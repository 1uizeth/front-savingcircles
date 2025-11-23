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
      id: "miles",
      label: "MILES",
      href: "/miles",
      icon: "◆",
      value: joinedCircles.length > 0 ? 1250 : 0,
      hasActivity: joinedCircles.length > 0,
    },
  ]

  const getTabBackground = (item: NavItem, isActive: boolean) => {
    if (isActive) return "bg-mandinga-black text-mandinga-white"
    if (item.needsAttention) return "bg-yellow-400"
    if (item.hasActivity) return "bg-yellow-100"
    return "bg-mandinga-white"
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-mandinga-white border-t-2 border-mandinga-black z-50 md:hidden">
      <div className="h-full flex">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center border-r-2 last:border-r-0 border-mandinga-black transition-colors ${getTabBackground(
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
