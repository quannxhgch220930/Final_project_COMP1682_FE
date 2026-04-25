import { getAccessToken } from '../../features/auth/lib/tokenStorage'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

async function request(path, options = {}) {
  const token = getAccessToken()
  const headers = new Headers(options.headers || {})
  const isFormDataBody =
    typeof FormData !== 'undefined' && options.body instanceof FormData

  if (!headers.has('Content-Type') && options.body && !isFormDataBody) {
    headers.set('Content-Type', 'application/json')
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const contentType = response.headers.get('content-type') || ''
  const isJsonResponse = contentType.includes('application/json')
  const payload = isJsonResponse ? await response.json() : await response.text()

  if (!response.ok) {
    const error = new Error(
      payload?.message || payload?.error || 'Request failed',
    )

    error.status = response.status
    error.payload = payload
    throw error
  }

  return payload
}

export const httpClient = {
  delete: (path, options = {}) =>
    request(path, {
      ...options,
      method: 'DELETE',
    }),
  get: (path, options = {}) =>
    request(path, {
      ...options,
      method: 'GET',
    }),
  patch: (path, payload, options = {}) =>
    request(path, {
      ...options,
      body: JSON.stringify(payload),
      method: 'PATCH',
    }),
  postForm: (path, formData, options = {}) =>
    request(path, {
      ...options,
      body: formData,
      method: 'POST',
    }),
  post: (path, payload, options = {}) =>
    request(path, {
      ...options,
      body: JSON.stringify(payload),
      method: 'POST',
    }),
  put: (path, payload, options = {}) =>
    request(path, {
      ...options,
      body: JSON.stringify(payload),
      method: 'PUT',
    }),
}
