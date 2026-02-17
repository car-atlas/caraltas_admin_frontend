import axios from 'axios'

const getBaseURL = () => {
  const envURL = process.env.NEXT_PUBLIC_API_BASE_URL
  const defaultURL = 'http://localhost:3377'
  return envURL || defaultURL
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

export const adminAPI = {
  superadminSignup: async (email: string, password: string, name?: string, secret?: string) => {
    const response = await api.post('/admin/auth/signup', { email, password, name, secret })
    return response.data
  },

  superadminLogin: async (email: string, password: string) => {
    const response = await api.post('/admin/auth/login', { email, password })
    return response.data
  },

  getAnalytics: async () => {
    const response = await api.get('/admin/analytics')
    return response.data
  },

  getPendingAgencies: async () => {
    const response = await api.get('/admin/agencies/pending')
    return response.data
  },

  getAllAgencies: async () => {
    const response = await api.get('/admin/agencies/all')
    return response.data
  },

  approveAgency: async (agencyId: string) => {
    const response = await api.post(`/admin/agencies/${agencyId}/approve`)
    return response.data
  },

  rejectAgency: async (agencyId: string, reason: string) => {
    const response = await api.post(`/admin/agencies/${agencyId}/reject`, { reason })
    return response.data
  },

  activateAgency: async (agencyId: string) => {
    const response = await api.post(`/admin/agencies/${agencyId}/activate`)
    return response.data
  },

  deactivateAgency: async (agencyId: string) => {
    const response = await api.post(`/admin/agencies/${agencyId}/deactivate`)
    return response.data
  },

  getAgencyById: async (agencyId: string) => {
    const response = await api.get(`/admin/agencies/${agencyId}`)
    return response.data
  },

  updateAgency: async (agencyId: string, data: Record<string, unknown>) => {
    const response = await api.patch(`/admin/agencies/${agencyId}`, data)
    return response.data
  },

  deleteAgency: async (agencyId: string) => {
    const response = await api.delete(`/admin/agencies/${agencyId}`)
    return response.data
  },

  getAnalyticsByAgency: async () => {
    const response = await api.get('/admin/analytics/by-agency')
    return response.data
  },

  getListings: async (params?: { page?: number; limit?: number; agencyId?: string; brand?: string; model?: string }) => {
    const response = await api.get('/admin/listings', { params })
    return response.data
  },

  getAdmins: async () => {
    const response = await api.get('/admin/admins')
    return response.data
  },

  createAdmin: async (data: { email: string; password: string; name?: string; role: string }) => {
    const response = await api.post('/admin/admins', data)
    return response.data
  },
}

export default api
