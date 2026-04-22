import { API_ENDPOINTS } from '../../../shared/constants/api'
import { httpClient } from '../../../shared/lib/axios'
import { setAccessToken } from '../lib/tokenStorage'
import { normalizeUserResponse } from '../../user/utils/normalizeUserResponse'

function extractAccessToken(response) {
  return response?.data?.accessToken || null
}

export const authClientApi = {
  adminLogin: async (payload) => {
    const response = await httpClient.post(API_ENDPOINTS.auth.adminLogin, payload)
    const accessToken = extractAccessToken(response)

    if (accessToken) {
      setAccessToken(accessToken)
    }

    return {
      accessToken,
      code: response?.code ?? 200,
      data: normalizeUserResponse(response?.data),
      message: response?.message || 'Admin login successful',
      timestamp: response?.timestamp ?? null,
    }
  },
  changePassword: async (payload) => {
    const response = await httpClient.post(API_ENDPOINTS.auth.changePassword, payload)

    return {
      code: response?.code ?? 200,
      data: response?.data ?? null,
      message: response?.message || 'Password changed successfully',
      timestamp: response?.timestamp ?? null,
    }
  },
  forgotPassword: async (payload) => {
    const response = await httpClient.post(API_ENDPOINTS.auth.forgotPassword, payload)

    return {
      code: response?.code ?? 200,
      data: response?.data ?? null,
      message: response?.message || 'Please check your email to reset password.',
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
  resendVerify: async (email) => {
    const query = new URLSearchParams()
    query.set('email', email)

    const response = await httpClient.post(
      `${API_ENDPOINTS.auth.resendVerify}?${query}`,
      undefined,
    )

    return {
      code: response?.code ?? 200,
      data: response?.data ?? null,
      message: response?.message || 'Verification email resent successfully.',
      timestamp: response?.timestamp ?? null,
    }
  },
  resetPassword: async (payload) => {
    const response = await httpClient.post(API_ENDPOINTS.auth.resetPassword, payload)

    return {
      code: response?.code ?? 200,
      data: response?.data ?? null,
      message: response?.message || 'Password reset successfully.',
      timestamp: response?.timestamp ?? null,
    }
  },
}
