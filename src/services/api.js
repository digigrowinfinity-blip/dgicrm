// Central API service — connects to Supabase backend
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// ── Token helpers ─────────────────────────────────────────────────────────
const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem('mlcrm_user'))
    return user?.token || null
  } catch {
    return null
  }
}

// ── Core fetch wrapper ────────────────────────────────────────────────────
async function request(method, path, body = null) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const options = { method, headers }
  if (body) options.body = JSON.stringify(body)

  const res = await fetch(`${BASE_URL}${path}`, options)
  const data = await res.json()

  if (!res.ok) {
    const err = new Error(data.message || 'Request failed')
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

const api = {
  get:    (path)         => request('GET',    path),
  post:   (path, body)   => request('POST',   path, body),
  put:    (path, body)   => request('PUT',    path, body),
  patch:  (path, body)   => request('PATCH',  path, body),
  delete: (path)         => request('DELETE', path),
}

// ── Auth ──────────────────────────────────────────────────────────────────
export const authAPI = {
  login:   (email, password) => api.post('/auth/login', { email, password }),
  logout:  ()                => api.post('/auth/logout'),
  profile: ()                => api.get('/auth/profile'),
  submitBusinessProfile: (data) => api.post('/auth/business-profile', data),   // 👈 YE NAYI LINE ADD KARNI HAI 

}

// ── Leads ─────────────────────────────────────────────────────────────────
export const leadsAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString()
    return api.get(`/leads${qs ? `?${qs}` : ''}`)
  },
  getById:      (id)        => api.get(`/leads/${id}`),
  create:       (data)      => api.post('/leads', data),
  update:       (id, data)  => api.put(`/leads/${id}`, data),
  delete:       (id)        => api.delete(`/leads/${id}`),
  updateStatus: (id, status)   => api.patch(`/leads/${id}/status`, { status }),
  assign:       (id, user_id)  => api.patch(`/leads/${id}/assign`, { user_id }),
  stats:        ()             => api.get('/leads/dashboard/stats'),
}

// ── Team ──────────────────────────────────────────────────────────────────
export const teamAPI = {
  getAll:  (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString()
    return api.get(`/team${qs ? `?${qs}` : ''}`)
  },
  getById: (id)       => api.get(`/team/${id}`),
  create:  (data)     => api.post('/team', data),
  update:  (id, data) => api.put(`/team/${id}`, data),
  delete:  (id)       => api.delete(`/team/${id}`),
}



// ── Settings ──────────────────────────────────────────────────────────────
export const settingsAPI = {
  get:    ()     => api.get('/settings'),
  update: (data) => api.put('/settings', data),
  uploadLogo: (file_base64, file_name, content_type) =>
    api.post('/settings/logo', { file_base64, file_name, content_type }),
}

export default api
