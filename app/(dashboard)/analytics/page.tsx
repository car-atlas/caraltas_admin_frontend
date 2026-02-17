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
  Eye as EyeIcon,
} from "lucide-react"

interface PlatformAnalytics {
  agencies: { total: number; approved: number; pending: number; rejected: number }
  listings: { total: number; available: number }
  clicks: { total: number; lastWeek: number }
  users: { total: number }
  topAgencies: Array<{ agencyId: string; agencyName: string; clicks: number }>
}

interface AgencyStat {
  agencyId: string
  agencyName: string
  cpc: number
  cpl: number
  isActive: boolean
  approvalStatus: string
  listingsCount: number
  availableListingsCount: number
  clicksCount: number
  leadsCount: number
}

export default function AnalyticsPage() {
  const [platform, setPlatform] = useState<PlatformAnalytics | null>(null)
  const [byAgency, setByAgency] = useState<AgencyStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<"platform" | "by-agency">("platform")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [platformData, byAgencyData] = await Promise.all([
        adminAPI.getAnalytics(),
        adminAPI.getAnalyticsByAgency(),
      ])
      setPlatform(platformData)
      setByAgency(byAgencyData?.agencies ?? [])
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
        <Loader2 className="w-12 h-12 animate-spin text-[#0066cc]" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0b2848] flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-[#0066cc]" />
            Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            Platform overview and per-dealer metrics
          </p>
        </div>
        <div className="flex gap-2 border border-gray-200 rounded-lg p-1">
          <button
            onClick={() => setView("platform")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              view === "platform" ? "bg-[#0066cc] text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Platform
          </button>
          <button
            onClick={() => setView("by-agency")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              view === "by-agency" ? "bg-[#0066cc] text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            By dealer
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {view === "platform" && platform && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <Building2 className="w-8 h-8 text-[#0066cc] mb-2" />
              <p className="text-sm text-gray-600 mb-1">Total Dealers</p>
              <p className="text-3xl font-bold text-[#0b2848]">{platform.agencies.total}</p>
              <p className="text-xs text-gray-500 mt-2">
                {platform.agencies.approved} approved · {platform.agencies.pending} pending
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <Car className="w-8 h-8 text-purple-500 mb-2" />
              <p className="text-sm text-gray-600 mb-1">Total Listings</p>
              <p className="text-3xl font-bold text-[#0b2848]">{platform.listings.total}</p>
              <p className="text-xs text-gray-500 mt-2">{platform.listings.available} available</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <MousePointerClick className="w-8 h-8 text-orange-500 mb-2" />
              <p className="text-sm text-gray-600 mb-1">Total Clicks</p>
              <p className="text-3xl font-bold text-[#0b2848]">{platform.clicks.total}</p>
              <p className="text-xs text-gray-500 mt-2">{platform.clicks.lastWeek} in last 7 days</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <Eye className="w-8 h-8 text-green-500 mb-2" />
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-[#0b2848]">{platform.users.total}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-bold text-[#0b2848] mb-4 flex items-center gap-2">
              <TrendingUp size={20} />
              Top Performing Dealers by Clicks
            </h2>
            {platform.topAgencies.length === 0 ? (
              <p className="text-gray-500">No click data yet.</p>
            ) : (
              <div className="space-y-3">
                {platform.topAgencies.map((agency, index) => (
                  <Link
                    key={agency.agencyId}
                    href={`/dealers/${agency.agencyId}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
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
                    <EyeIcon className="w-5 h-5 text-gray-400" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {view === "by-agency" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-bold text-[#0b2848]">Analytics by dealer organisation</h2>
            <p className="text-sm text-gray-500 mt-1">Listings, clicks, leads, CPC and CPL per agency</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Dealer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Listings</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Available</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Clicks</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Leads</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">CPC</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">CPL</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {byAgency.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      No dealers yet.
                    </td>
                  </tr>
                ) : (
                  byAgency.map((a) => (
                    <tr key={a.agencyId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link href={`/dealers/${a.agencyId}`} className="font-semibold text-[#0066cc] hover:underline">
                          {a.agencyName}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            a.approvalStatus === "APPROVED"
                              ? "bg-green-100 text-green-700"
                              : a.approvalStatus === "PENDING"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {a.approvalStatus}
                        </span>
                        {!a.isActive && (
                          <span className="ml-1 px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-medium">{a.listingsCount}</td>
                      <td className="px-6 py-4 text-right">{a.availableListingsCount}</td>
                      <td className="px-6 py-4 text-right">{a.clicksCount}</td>
                      <td className="px-6 py-4 text-right">{a.leadsCount}</td>
                      <td className="px-6 py-4 text-right">₹{a.cpc}</td>
                      <td className="px-6 py-4 text-right">₹{a.cpl}</td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/listings?agencyId=${a.agencyId}`}
                          className="text-sm text-[#0066cc] hover:underline"
                        >
                          View listings
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
