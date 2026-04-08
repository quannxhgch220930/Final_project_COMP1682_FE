import { API_ENDPOINTS } from '../../../shared/constants/api'
import { httpClient } from '../../../shared/lib/axios'
import { setAccessToken } from '../lib/tokenStorage'
import { normalizeUserResponse } from '../../user/utils/normalizeUserResponse'

function extractAccessToken(response) {
  return response?.data?.accessToken || null
}

export const authClientApi = {
  changePassword: async (payload) => {
    const response = await httpClient.post(API_ENDPOINTS.auth.changePassword, payload)

    return {
      code: response?.code ?? 200,
      data: response?.data ?? null,
      message: response?.message || 'Password changed successfully',
      timestamp: response?.timestamp ?? null,
    }
  },
  getCurrentUser: async () => {
    const response = await httpClient.get(API_ENDPOINTS.users.me)
    return normalizeUserResponse(response?.data)
  },
  login: async (payload) => {
    const response = await httpClient.post(API_ENDPOINTS.auth.login, payload)
    const accessToken = extractAccessToken(response)

    if (accessToken) {
      setAccessToken(accessToken)
    }

    return {
      accessToken,
      code: response?.code ?? 200,
      data: normalizeUserResponse(response?.data),
      message: response?.message || 'Login successful',
      timestamp: response?.timestamp ?? null,
    }
  },
  register: async (payload) => {
    const response = await httpClient.post(API_ENDPOINTS.auth.register, payload)

    return {
      code: response?.code ?? 200,
      data: response?.data ?? null,
      message: response?.message || 'Register successful. Please verify email.',
      timestamp: response?.timestamp ?? null,
    }
  },
}
