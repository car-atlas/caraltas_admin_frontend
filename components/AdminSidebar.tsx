"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  Car,
  BarChart3,
  Users,
  X,
} from "lucide-react"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dealers", label: "Dealers", icon: Building2 },
  { href: "/listings", label: "Listings", icon: Car },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admins", label: "Manage Admins", icon: Users },
]

interface AdminSidebarProps {
  mobileOpen?: boolean
  onClose?: () => void
}

export function AdminSidebar({ mobileOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] flex flex-col bg-[#0b2848] text-white border-r border-white/10 shadow-xl
        transform transition-transform duration-200 ease-out
        md:static md:z-auto md:translate-x-0 md:w-64 md:flex-shrink-0 md:shadow-none
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      <div className="flex flex-shrink-0 items-center justify-between border-b border-white/10 p-4 md:hidden">
        <span className="text-sm font-medium text-white/80">Menu</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X size={22} />
        </button>
      </div>
   
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-[#0066cc] text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
