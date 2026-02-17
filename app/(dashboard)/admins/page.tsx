"use client"

import { useEffect, useState, type FormEvent } from "react"
import { adminAPI } from "@/lib/api"
import { Users, Loader2, UserPlus, Shield } from "lucide-react"

interface AdminRow {
  id: string
  email: string
  role: string
  name: string | null
  createdAt: string
}

export default function ManageAdminsPage() {
  const [admins, setAdmins] = useState<AdminRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formError, setFormError] = useState("")
  const [success, setSuccess] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  useEffect(() => {
    loadAdmins()
  }, [])

  const loadAdmins = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await adminAPI.getAdmins()
      setAdmins(res?.admins ?? [])
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string }; status?: number } }
      if (ax?.response?.status === 403) {
        setError("Only SuperAdmin can manage admins.")
      } else {
        setError(ax?.response?.data?.message || "Failed to load admins")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError("")
    setSuccess("")
    if (!email.trim()) {
      setFormError("Email is required")
      return
    }
    if (!password || password.length < 6) {
      setFormError("Password must be at least 6 characters")
      return
    }
    try {
      setSubmitting(true)
      await adminAPI.createAdmin({
        email: email.trim().toLowerCase(),
        password,
        name: name.trim() || undefined,
        role: "ADMIN",
      })
      setSuccess("Admin created successfully.")
      setEmail("")
      setPassword("")
      setName("")
      setShowForm(false)
      await loadAdmins()
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } }
      setFormError(ax?.response?.data?.message || "Failed to create admin")
    } finally {
      setSubmitting(false)
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0b2848] flex items-center gap-2">
          <Users className="w-8 h-8 text-[#0066cc]" />
          Manage Admins
        </h1>
        <p className="text-gray-600 mt-1">Add and view platform admin users (SuperAdmin only)</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-semibold text-[#0b2848]">Admin users</h2>
          <button
            onClick={() => { setShowForm(!showForm); setFormError(""); setSuccess(""); }}
            className="px-4 py-2 bg-[#0066cc] text-white rounded-lg hover:bg-[#0052a3] flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add Admin
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="p-6 border-b border-gray-200 bg-gray-50/50">
            {formError && (
              <p className="text-sm text-red-600 mb-3">{formError}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password * (min 6)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc]"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Create Admin
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setFormError(""); }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No admins yet. Add one above.
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-[#0b2848]">{admin.email}</td>
                    <td className="px-6 py-4 text-gray-600">{admin.name || "—"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                          admin.role === "SUPERADMIN" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
