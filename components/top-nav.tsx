"use client"

import Link from "next/link"

export function TopNav() {
  return (
    <div className="h-10 bg-mandinga-white border-b-2 border-mandinga-black flex items-center px-4 md:hidden">
      <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
        <span className="text-sm font-bold">Saving Circle</span>
      </Link>
    </div>
  )
}

export default TopNav
