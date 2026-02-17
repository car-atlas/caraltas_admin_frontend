"use client"

import Link from "next/link"
import { LayoutDashboard, LogOut, Menu } from "lucide-react"

interface AdminHeaderProps {
  onMenuClick?: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      window.location.href = "/auth/login"
    }
  }

  return (
    <header className="w-full flex-shrink-0 border-b border-white/10 bg-[#0b2848] shadow-sm z-[100]">
      <div className="flex w-full items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="flex shrink-0 items-center justify-center rounded-lg p-2 text-white hover:bg-white/10 active:bg-white/20 md:hidden"
          >
            <Menu size={24} />
          </button>
          <Link href="/" className="flex min-w-0 shrink items-center gap-2">
            <div className="w-9 h-9 bg-[#0066cc] rounded-lg flex items-center justify-center shrink-0">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-base sm:text-lg text-white truncate">CarAtlas Admin</span>
          </Link>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-white/90 hover:bg-white/10 active:bg-white/20 transition-colors"
        >
          <LogOut size={18} />
          <span className="hidden text-sm font-medium sm:inline">Log out</span>
        </button>
      </div>
    </header>
  )
}
