"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { adminAPI } from "@/lib/api"
import {
  Building2,
  CheckCircle,
  XCircle,
  Loader2,
  Clock,
  Search,
  Power,
  PowerOff,
  Eye,
} from "lucide-react"

interface Agency {
  id: string
  name: string
  phone: string | null
  email: string | null
  gstNumber: string | null
  businessType: string | null
  role?: string
  isActive?: boolean
  cpc?: number
  cpl?: number
  approvalStatus: string
  onboardingStatus: string
  createdAt: string
  contactPersonName?: string | null
  contactPhone?: string | null
  contactEmail?: string | null
  websiteUrl?: string | null
  addressLine1?: string | null
  city?: string | null
  state?: string | null
}

export default function DealersPage() {
  const [pendingAgencies, setPendingAgencies] = useState<Agency[]>([])
  const [allAgencies, setAllAgencies] = useState<Agency[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [pending, all] = await Promise.all([
        adminAPI.getPendingAgencies(),
        adminAPI.getAllAgencies(),
      ])
      setPendingAgencies(pending)
      setAllAgencies(all)
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } }
      setError(ax?.response?.data?.message || "Failed to load dealers")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (agencyId: string) => {
    if (!confirm("Approve this dealer?")) return
    try {
      await adminAPI.approveAgency(agencyId)
      await loadData()
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } }
      alert(ax?.response?.data?.message || "Failed to approve")
    }
  }

  const handleReject = async (agencyId: string) => {
    const reason = prompt("Rejection reason:")
    if (!reason) return
    try {
      await adminAPI.rejectAgency(agencyId, reason)
      await loadData()
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } }
      alert(ax?.response?.data?.message || "Failed to reject")
    }
  }

  const handleToggleActive = async (agencyId: string, isActive: boolean) => {
    try {
      if (isActive) await adminAPI.deactivateAgency(agencyId)
      else await adminAPI.activateAgency(agencyId)
      await loadData()
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } }
      alert(ax?.response?.data?.message || "Failed to update")
    }
  }

  const filteredAgencies = allAgencies.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.phone && a.phone.includes(searchTerm)) ||
      (a.email && a.email.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchStatus = filterStatus === "all" || a.approvalStatus === filterStatus
    return matchSearch && matchStatus
  })

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
            <Building2 className="w-8 h-8 text-[#0066cc]" />
            Dealers
          </h1>
          <p className="text-gray-600 mt-1">Edit, activate/deactivate, and delete dealer organisations (dealers sign up themselves)</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === "pending"
              ? "text-[#0066cc] border-b-2 border-[#0066cc]"
              : "text-gray-600 hover:text-[#0b2848]"
          }`}
        >
          Pending Approvals
          {pendingAgencies.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
              {pendingAgencies.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === "all"
              ? "text-[#0066cc] border-b-2 border-[#0066cc]"
              : "text-gray-600 hover:text-[#0b2848]"
          }`}
        >
          All Dealers
        </button>
      </div>

      {activeTab === "pending" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#0b2848] flex items-center gap-2">
              <Clock size={20} />
              Pending Approvals
            </h2>
          </div>
          <div className="p-6">
            {pendingAgencies.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No pending approvals</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingAgencies.map((agency) => (
                  <div
                    key={agency.id}
                    className="border border-gray-200 rounded-lg p-5 hover:border-[#0066cc]/50 transition-colors"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#0b2848] text-lg mb-2">{agency.name}</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                          <div>
                            {agency.phone && <p><span className="font-semibold">Phone:</span> {agency.phone}</p>}
                            {agency.email && <p><span className="font-semibold">Email:</span> {agency.email}</p>}
                          </div>
                          <div>
                            {agency.gstNumber && <p><span className="font-semibold">GST:</span> {agency.gstNumber}</p>}
                            {agency.businessType && <p><span className="font-semibold">Type:</span> {agency.businessType}</p>}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Applied {new Date(agency.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(agency.id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 font-semibold"
                        >
                          <CheckCircle size={18} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(agency.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2 font-semibold"
                        >
                          <XCircle size={18} />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "all" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-bold text-[#0b2848] flex items-center gap-2">
                  <Building2 size={20} />
                  All Dealers
                </h2>
              <div className="flex gap-3 flex-1 max-w-xl">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search name, phone, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc] focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc]"
                >
                  <option value="all">All Status</option>
                  <option value="APPROVED">Approved</option>
                  <option value="PENDING">Pending</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Dealer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">CPC / CPL</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Active</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAgencies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No dealers found
                    </td>
                  </tr>
                ) : (
                  filteredAgencies.map((agency) => (
                    <tr key={agency.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link href={`/dealers/${agency.id}`} className="font-semibold text-[#0066cc] hover:underline flex items-center gap-1">
                          {agency.name} <Eye className="w-4 h-4" />
                        </Link>
                        {agency.gstNumber && <p className="text-xs text-gray-500">GST: {agency.gstNumber}</p>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {agency.phone}
                        {agency.email && <><br /><span className="text-xs">{agency.email}</span></>}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="text-gray-700">₹{agency.cpc ?? 0}</span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className="text-gray-700">₹{agency.cpl ?? 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            agency.approvalStatus === "APPROVED"
                              ? "bg-green-100 text-green-700"
                              : agency.approvalStatus === "PENDING"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {agency.approvalStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {agency.isActive !== undefined && (
                          <button
                            onClick={() => handleToggleActive(agency.id, agency.isActive!)}
                            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${
                              agency.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {agency.isActive ? <Power size={12} /> : <PowerOff size={12} />}
                            {agency.isActive ? "Active" : "Inactive"}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/dealers/${agency.id}`} className="text-[#0066cc] hover:underline font-semibold text-sm mr-2">
                          View
                        </Link>
                        {agency.approvalStatus === "PENDING" && (
                          <>
                            <button onClick={() => handleApprove(agency.id)} className="text-green-600 hover:underline font-semibold text-sm mr-2">
                              Approve
                            </button>
                            <button onClick={() => handleReject(agency.id)} className="text-red-600 hover:underline font-semibold text-sm">
                              Reject
                            </button>
                          </>
                        )}
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
