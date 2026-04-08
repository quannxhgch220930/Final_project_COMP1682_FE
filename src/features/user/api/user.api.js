import { API_ENDPOINTS } from '../../../shared/constants/api'
import { httpClient } from '../../../shared/lib/axios'
import { normalizeUserResponse } from '../utils/normalizeUserResponse'

export const userApi = {
  getProfile: async () => {
    const response = await httpClient.get(API_ENDPOINTS.users.me)

    return {
      data: normalizeUserResponse(response?.data),
      message: response?.message || 'Success',
    }
  },
  updateProfile: async (payload) => {
    const response = await httpClient.put(API_ENDPOINTS.users.me, payload)

    return {
      data: normalizeUserResponse(response?.data),
      message: response?.message || 'Profile updated successfully',
    }
  },
}
