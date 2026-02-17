"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminHeader } from "@/components/AdminHeader"
import { AdminSidebar } from "@/components/AdminSidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    if (!token) {
      router.replace("/auth/login")
    }
  }, [router])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-hidden">
      <AdminHeader onMenuClick={() => setMobileOpen(true)} />
      <div className="flex min-h-0 flex-1 overflow-hidden min-w-0">
        {/* Backdrop when sidebar is open (mobile only) */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Close menu"
          className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${
            mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
        />
        <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
