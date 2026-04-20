import { API_ENDPOINTS } from '../../../../shared/constants/api'
import { httpClient } from '../../../../shared/lib/axios'
import { normalizeUserResponse } from '../../../user/utils/normalizeUserResponse'

export const adminProductApi = {
  deleteUser: async (id) => {
    return httpClient.delete(API_ENDPOINTS.admin.deleteUser(id))
  },
  getList: async ({ page = 0, size = 10 } = {}) => {
    const query = new URLSearchParams({
      page: String(page),
      size: String(size),
    })
    const response = await httpClient.get(`${API_ENDPOINTS.admin.users}?${query}`)
    const pageData = response?.data
    const users = pageData?.content || pageData?.items || pageData?.data || []

    return {
      items: users.map((user) => normalizeUserResponse(user)),
      page: pageData?.page ?? page,
      size: pageData?.size ?? size,
      totalElements: pageData?.totalElements ?? users.length,
      totalPages: pageData?.totalPages ?? 1,
    }
  },
  updateLock: async (id, locked) => {
    const response = await httpClient.patch(API_ENDPOINTS.admin.updateLock(id), {
      locked,
    })

    return {
      data: normalizeUserResponse(response?.data),
      message: response?.message || 'User lock status updated successfully',
    }
  },
  updateRole: async (id, role) => {
    const response = await httpClient.patch(API_ENDPOINTS.admin.updateRole(id), {
      role,
    })

    return {
      data: normalizeUserResponse(response?.data),
      message: response?.message || 'User role updated successfully',
    }
  },
}
