"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { adminAPI } from "@/lib/api"
import {
  ArrowLeft,
  Building2,
  Loader2,
  Save,
  Power,
  PowerOff,
  Trash2,
  Car,
  MousePointerClick,
  UserCheck,
  Edit3,
} from "lucide-react"

interface AgencyDetail {
  id: string
  name: string
  phone: string | null
  email: string | null
  businessType: string | null
  gstNumber: string | null
  panNumber: string | null
  registrationNumber: string | null
  yearOfEstablishment: number | null
  role: string
  contactPersonName: string | null
  contactPhone: string | null
  contactEmail: string | null
  whatsappNumber: string | null
  websiteUrl: string | null
  addressLine1: string | null
  addressLine2: string | null
  city: string | null
  state: string | null
  pincode: string | null
  country: string | null
  bankName: string | null
  accountNumber: string | null
  ifscCode: string | null
  accountHolderName: string | null
  apiUrl: string | null
  apiKey: string | null
  integrationType: string | null
  apifyActorId: string | null
  cpc: number
  cpl: number
  isActive: boolean
  onboardingStatus: string
  approvalStatus: string
  rejectionReason: string | null
  _count: { listings: number; clicks: number }
  leadsCount: number
  createdAt: string
  updatedAt: string
}

export default function AgencyDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [agency, setAgency] = useState<AgencyDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Partial<AgencyDetail>>({})

  useEffect(() => {
    if (id) loadAgency()
  }, [id])

  const loadAgency = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminAPI.getAgencyById(id)
      setAgency(data)
      setForm({
        name: data.name,
        phone: data.phone ?? "",
        email: data.email ?? "",
        businessType: data.businessType ?? "",
        gstNumber: data.gstNumber ?? "",
        panNumber: data.panNumber ?? "",
        registrationNumber: data.registrationNumber ?? "",
        yearOfEstablishment: data.yearOfEstablishment ?? undefined,
        role: data.role ?? "DEALER_ADMIN",
        contactPersonName: data.contactPersonName ?? "",
        contactPhone: data.contactPhone ?? "",
        contactEmail: data.contactEmail ?? "",
        whatsappNumber: data.whatsappNumber ?? "",
        websiteUrl: data.websiteUrl ?? "",
        addressLine1: data.addressLine1 ?? "",
        addressLine2: data.addressLine2 ?? "",
        city: data.city ?? "",
        state: data.state ?? "",
        pincode: data.pincode ?? "",
        country: data.country ?? "",
        bankName: data.bankName ?? "",
        accountNumber: data.accountNumber ?? "",
        ifscCode: data.ifscCode ?? "",
        accountHolderName: data.accountHolderName ?? "",
        apiUrl: data.apiUrl ?? "",
        apiKey: data.apiKey ?? "",
        integrationType: data.integrationType ?? "API",
        apifyActorId: data.apifyActorId ?? "",
        cpc: data.cpc,
        cpl: data.cpl,
        isActive: data.isActive,
        onboardingStatus: data.onboardingStatus ?? "PENDING",
        approvalStatus: data.approvalStatus ?? "PENDING",
        rejectionReason: data.rejectionReason ?? "",
      })
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } }
      setError(ax?.response?.data?.message || "Failed to load dealer")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    if (!id) return
    setSaving(true)
    try {
      await adminAPI.updateAgency(id, {
        name: form.name,
        phone: form.phone || undefined,
        email: form.email || undefined,
        businessType: form.businessType || undefined,
        gstNumber: form.gstNumber || undefined,
        panNumber: form.panNumber || undefined,
        registrationNumber: form.registrationNumber || undefined,
        yearOfEstablishment: form.yearOfEstablishment,
        role: form.role,
        contactPersonName: form.contactPersonName || undefined,
        contactPhone: form.contactPhone || undefined,
        contactEmail: form.contactEmail || undefined,
        whatsappNumber: form.whatsappNumber || undefined,
        websiteUrl: form.websiteUrl || undefined,
        addressLine1: form.addressLine1 || undefined,
        addressLine2: form.addressLine2 || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
        pincode: form.pincode || undefined,
        country: form.country || undefined,
        bankName: form.bankName || undefined,
        accountNumber: form.accountNumber || undefined,
        ifscCode: form.ifscCode || undefined,
        accountHolderName: form.accountHolderName || undefined,
        apiUrl: form.apiUrl || undefined,
        apiKey: form.apiKey || undefined,
        integrationType: form.integrationType,
        apifyActorId: form.apifyActorId || undefined,
        cpc: form.cpc !== undefined ? Number(form.cpc) : undefined,
        cpl: form.cpl !== undefined ? Number(form.cpl) : undefined,
        isActive: form.isActive,
        onboardingStatus: form.onboardingStatus,
        approvalStatus: form.approvalStatus,
        rejectionReason: form.rejectionReason || undefined,
      })
      setEditing(false)
      await loadAgency()
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } }
      alert(ax?.response?.data?.message || "Failed to update")
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async () => {
    if (!agency) return
    if (!confirm(agency.isActive ? "Deactivate this dealer?" : "Activate this dealer?")) return
    try {
      if (agency.isActive) await adminAPI.deactivateAgency(agency.id)
      else await adminAPI.activateAgency(agency.id)
      await loadAgency()
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } }
      alert(ax?.response?.data?.message || "Failed to update")
    }
  }

  const handleDelete = async () => {
    if (!agency || !confirm("Permanently delete this dealer and all their listings/clicks? This cannot be undone.")) return
    try {
      await adminAPI.deleteAgency(agency.id)
      router.push("/dealers")
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } }
      alert(ax?.response?.data?.message || "Failed to delete")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-[#0066cc]" />
      </div>
    )
  }

  if (error || !agency) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error || "Dealer not found"}</p>
        <Link href="/dealers" className="mt-4 inline-flex items-center gap-2 text-[#0066cc] hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Dealers
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dealers"
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#0b2848] flex items-center gap-2">
              <Building2 className="w-8 h-8 text-[#0066cc]" />
              {agency.name}
            </h1>
            <p className="text-sm text-gray-500">
              {agency.approvalStatus} · {agency.isActive ? "Active" : "Inactive"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleToggleActive}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
              agency.isActive
                ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
          >
            {agency.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
            {agency.isActive ? "Deactivate" : "Activate"}
          </button>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0066cc] text-white rounded-lg hover:bg-[#0052a3]"
            >
              <Edit3 className="w-4 h-4" /> Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => { setEditing(false); loadAgency(); }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>
            </>
          )}
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-bold text-[#0b2848] mb-4">Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <Car className="w-6 h-6 text-[#0066cc] mb-1" />
                <p className="text-2xl font-bold text-[#0b2848]">{agency._count.listings}</p>
                <p className="text-xs text-gray-500">Listings</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <MousePointerClick className="w-6 h-6 text-orange-500 mb-1" />
                <p className="text-2xl font-bold text-[#0b2848]">{agency._count.clicks}</p>
                <p className="text-xs text-gray-500">Clicks</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-500 mb-1" />
                <p className="text-2xl font-bold text-[#0b2848]">{agency.leadsCount}</p>
                <p className="text-xs text-gray-500">Leads</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-[#0b2848]">₹{agency.cpc}</p>
                <p className="text-xs text-gray-500">CPC</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-[#0b2848]">₹{agency.cpl}</p>
                <p className="text-xs text-gray-500">CPL</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-bold text-[#0b2848] mb-4">Profile {editing && "(editing)"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={form.name ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={form.phone ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business type</label>
                  <input
                    type="text"
                    value={form.businessType ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, businessType: e.target.value }))}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST number</label>
                  <input
                    type="text"
                    value={form.gstNumber ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, gstNumber: e.target.value }))}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PAN number</label>
                  <input
                    type="text"
                    value={form.panNumber ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, panNumber: e.target.value }))}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration number</label>
                  <input
                    type="text"
                    value={form.registrationNumber ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, registrationNumber: e.target.value }))}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year of establishment</label>
                  <input
                    type="number"
                    value={form.yearOfEstablishment ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, yearOfEstablishment: e.target.value ? parseInt(e.target.value, 10) : undefined }))}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact person</label>
                  <input
                    type="text"
                    value={form.contactPersonName ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, contactPersonName: e.target.value }))}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact phone</label>
                  <input
                    type="text"
                    value={form.contactPhone ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact email</label>
                  <input
                    type="email"
                    value={form.contactEmail ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={form.whatsappNumber ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, whatsappNumber: e.target.value }))}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={form.websiteUrl ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address line 1</label>
                  <input
                    type="text"
                    value={form.addressLine1 ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, addressLine1: e.target.value }))}
                    disabled={!editing}
                    placeholder="Address line 1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={form.city ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={form.state ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={form.pincode ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={form.country ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address line 2</label>
                  <input
                    type="text"
                    value={form.addressLine2 ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, addressLine2: e.target.value }))}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-bold text-[#0b2848] mb-4">Status & role (admin only)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Onboarding status</label>
                <select
                  value={form.onboardingStatus ?? "PENDING"}
                  onChange={(e) => setForm((f) => ({ ...f, onboardingStatus: e.target.value }))}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Approval status</label>
                <select
                  value={form.approvalStatus ?? "PENDING"}
                  onChange={(e) => setForm((f) => ({ ...f, approvalStatus: e.target.value }))}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dealer role</label>
                <select
                  value={form.role ?? "DEALER_ADMIN"}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                >
                  <option value="DEALER_ADMIN">DEALER_ADMIN</option>
                  <option value="DEALER_USER">DEALER_USER</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rejection reason (if rejected)</label>
                <input
                  type="text"
                  value={form.rejectionReason ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, rejectionReason: e.target.value }))}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-bold text-[#0b2848] mb-4">Integration (admin only)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Integration type</label>
                <select
                  value={form.integrationType ?? "API"}
                  onChange={(e) => setForm((f) => ({ ...f, integrationType: e.target.value }))}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                >
                  <option value="API">API</option>
                  <option value="APIFY">APIFY</option>
                  <option value="DIRECT">DIRECT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API URL</label>
                <input
                  type="url"
                  value={form.apiUrl ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, apiUrl: e.target.value }))}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API key</label>
                <input
                  type="text"
                  value={form.apiKey ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, apiKey: e.target.value }))}
                  disabled={!editing}
                  placeholder="Optional"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apify actor ID</label>
                <input
                  type="text"
                  value={form.apifyActorId ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, apifyActorId: e.target.value }))}
                  disabled={!editing}
                  placeholder="For APIFY integration"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-bold text-[#0b2848] mb-4">Bank (admin only)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank name</label>
                <input
                  type="text"
                  value={form.bankName ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, bankName: e.target.value }))}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account number</label>
                <input
                  type="text"
                  value={form.accountNumber ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, accountNumber: e.target.value }))}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IFSC code</label>
                <input
                  type="text"
                  value={form.ifscCode ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, ifscCode: e.target.value }))}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account holder name</label>
                <input
                  type="text"
                  value={form.accountHolderName ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, accountHolderName: e.target.value }))}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-bold text-[#0b2848] mb-4">CPC & CPL</h2>
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPC (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.cpc ?? 0}
                    onChange={(e) => setForm((f) => ({ ...f, cpc: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPL (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.cpl ?? 0}
                    onChange={(e) => setForm((f) => ({ ...f, cpl: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-semibold text-[#0b2848]">₹{agency.cpc} <span className="text-sm font-normal text-gray-500">CPC</span></p>
                <p className="text-lg font-semibold text-[#0b2848]">₹{agency.cpl} <span className="text-sm font-normal text-gray-500">CPL</span></p>
              </div>
            )}
          </div>

          <Link
            href={`/listings?agencyId=${agency.id}`}
            className="block p-4 border border-[#0066cc] rounded-xl text-[#0066cc] font-semibold hover:bg-[#0066cc]/5 text-center"
          >
            View this dealer&apos;s listings →
          </Link>
        </div>
      </div>
    </div>
  )
}
