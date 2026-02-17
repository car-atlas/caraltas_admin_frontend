"use client"

import { Suspense, useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { adminAPI } from "@/lib/api"
import { Car, Loader2, Search, Building2 } from "lucide-react"

interface ListingRow {
  id: string
  agencyId: string
  agencyName: string
  brand: string
  model: string
  variant: string | null
  year: number
  mileage: number
  price: number
  currency: string
  city: string | null
  state: string | null
  isAvailable: boolean
  createdAt: string
}

function ListingsContent() {
  const searchParams = useSearchParams()
  const agencyIdFromUrl = searchParams.get("agencyId") ?? ""
  const [data, setData] = useState<{
    listings: ListingRow[]
    total: number
    page: number
    limit: number
    totalPages: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [agencyId, setAgencyId] = useState(agencyIdFromUrl)
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [agencies, setAgencies] = useState<{ id: string; name: string }[]>([])
  const [view, setView] = useState<"list" | "by-agency">("list")

  useEffect(() => {
    setAgencyId(agencyIdFromUrl)
    if (agencyIdFromUrl) setView("list")
  }, [agencyIdFromUrl])

  useEffect(() => {
    adminAPI.getAllAgencies().then((r: unknown) => {
      const list = Array.isArray(r) ? r : []
      setAgencies(list.map((a: { id: string; name: string }) => ({ id: a.id, name: a.name })))
    }).catch(() => {})
  }, [])

  const loadListings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params: { page: number; limit: number; agencyId?: string; brand?: string; model?: string } = {
        page,
        limit: 20,
      }
      if (agencyId.trim()) params.agencyId = agencyId.trim()
      if (brand.trim()) params.brand = brand.trim()
      if (model.trim()) params.model = model.trim()
      const res = await adminAPI.getListings(params)
      setData(res)
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } }
      setError(ax?.response?.data?.message || "Failed to load listings")
    } finally {
      setLoading(false)
    }
  }, [page, agencyId, brand, model])

  useEffect(() => {
    if (view === "list") loadListings()
  }, [view, loadListings])

  if (loading && !data && view === "list") {
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
            <Car className="w-8 h-8 text-[#0066cc]" />
            Manage Listings
          </h1>
          <p className="text-gray-600 mt-1">View listings by dealer or filter globally</p>
        </div>
        <div className="flex gap-2 border border-gray-200 rounded-lg p-1">
          <button
            onClick={() => setView("list")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              view === "list" ? "bg-[#0066cc] text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            List / filter
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

      {view === "by-agency" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="font-bold text-[#0b2848] mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Listings by dealer organisation
          </h2>
          <p className="text-sm text-gray-500 mb-4">Select a dealer to view their listings.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {agencies.map((a) => (
              <Link
                key={a.id}
                href={`/listings?agencyId=${a.id}`}
                className="p-4 border border-gray-200 rounded-lg hover:border-[#0066cc] hover:bg-[#0066cc]/5 transition-colors"
              >
                <p className="font-semibold text-[#0b2848]">{a.name}</p>
                <p className="text-sm text-[#0066cc] mt-1">View listings →</p>
              </Link>
            ))}
          </div>
          {agencies.length === 0 && (
            <p className="text-gray-500">No dealers yet.</p>
          )}
        </div>
      )}

      {view === "list" && (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-200 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">Dealer</label>
            <select
              value={agencyId}
              onChange={(e) => setAgencyId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc]"
            >
              <option value="">All dealers</option>
              {agencies.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className="min-w-[120px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">Brand</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Hyundai"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc]"
            />
          </div>
          <div className="min-w-[120px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">Model</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. Creta"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc]"
            />
          </div>
          <button
            onClick={() => loadListings()}
            className="px-4 py-2 bg-[#0066cc] text-white rounded-lg hover:bg-[#0052a3] flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Listing</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Dealer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {!data?.listings?.length ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No listings found
                  </td>
                </tr>
              ) : (
                data.listings.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#0b2848]">{row.brand} {row.model}</p>
                      <p className="text-xs text-gray-500">{row.year} · {row.mileage.toLocaleString()} km</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.agencyName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {[row.city, row.state].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium">{row.currency} {row.price.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          row.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {row.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page {data.page} of {data.totalPages} · {data.total} total
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  )
}

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-[#0066cc]" />
      </div>
    }>
      <ListingsContent />
    </Suspense>
  )
}
