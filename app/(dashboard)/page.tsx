"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { adminAPI } from "@/lib/api"
import {
  Building2,
  Car,
  MousePointerClick,
  Eye,
  BarChart3,
  TrendingUp,
  Loader2,
  ArrowRight,
} from "lucide-react"

interface Analytics {
  agencies: { total: number; approved: number; pending: number; rejected: number }
  listings: { total: number; available: number }
  clicks: { total: number; lastWeek: number }
  users: { total: number }
  topAgencies: Array<{ agencyId: string; agencyName: string; clicks: number }>
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminAPI.getAnalytics()
      setAnalytics(data)
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } }
      setError(ax?.response?.data?.message || "Failed to load analytics")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#0066cc] mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0b2848] flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-[#0066cc]" />
          Dashboard
        </h1>
        <p className="text-gray-600 mt-1">Platform overview</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {analytics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Building2 className="w-8 h-8 text-[#0066cc]" />
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                  {analytics.agencies.approved} Active
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Dealers</p>
              <p className="text-3xl font-bold text-[#0b2848]">{analytics.agencies.total}</p>
              <p className="text-xs text-gray-500 mt-2">
                {analytics.agencies.pending} pending · {analytics.agencies.rejected} rejected
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Car className="w-8 h-8 text-purple-500" />
                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">
                  {analytics.listings.available} Available
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Listings</p>
              <p className="text-3xl font-bold text-[#0b2848]">{analytics.listings.total}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <MousePointerClick className="w-8 h-8 text-orange-500" />
                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                  {analytics.clicks.lastWeek} This Week
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Clicks</p>
              <p className="text-3xl font-bold text-[#0b2848]">{analytics.clicks.total}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <Eye className="w-8 h-8 text-green-500 mb-2" />
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-[#0b2848]">{analytics.users.total}</p>
            </div>
          </div>

          {analytics.topAgencies.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[#0b2848] flex items-center gap-2">
                  <TrendingUp size={20} />
                  Top Performing Dealers
                </h2>
                <Link
                  href="/dealers"
                  className="text-sm font-semibold text-[#0066cc] hover:underline flex items-center gap-1"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {analytics.topAgencies.map((agency, index) => (
                  <div
                    key={agency.agencyId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#0066cc] rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-[#0b2848]">{agency.agencyName}</p>
                        <p className="text-xs text-gray-600">{agency.clicks} clicks</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
