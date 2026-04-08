import { API_ENDPOINTS } from '../../../shared/constants/api'
import { httpClient } from '../../../shared/lib/axios'
import { setAccessToken } from '../lib/tokenStorage'

function extractAccessToken(response) {
  return response?.data?.accessToken || null
}

export const authApi = {
  login: async (payload) => {
    const response = await httpClient.post(API_ENDPOINTS.auth.login, payload)
    const accessToken = extractAccessToken(response)

    if (accessToken) {
      setAccessToken(accessToken)
    }

    return {
      accessToken,
      code: response?.code ?? 200,
      data: response?.data ?? null,
      message: response?.message || 'Đăng nhập thành công',
      timestamp: response?.timestamp ?? null,
    }
  },
  register: async (payload) => {
    const response = await httpClient.post(API_ENDPOINTS.auth.register, payload)

    return {
      code: response?.code ?? 200,
      data: response?.data ?? null,
      message:
        response?.message ||
        'Đăng ký thành công! Vui lòng kiểm tra email để xác thực.',
      timestamp: response?.timestamp ?? null,
    }
  },
}
