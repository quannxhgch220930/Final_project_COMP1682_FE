import { API_ENDPOINTS } from '../../../shared/constants/api'
import { httpClient } from '../../../shared/lib/axios'
import { normalizeAddressResponse } from '../utils/normalizeAddressResponse'

export const addressApi = {
  create: async (payload) => {
    const response = await httpClient.post(API_ENDPOINTS.addresses.create, payload)

    return {
      data: normalizeAddressResponse(response?.data),
      message: response?.message || 'Address created successfully',
    }
  },
  delete: async (id) => {
    const response = await httpClient.delete(API_ENDPOINTS.addresses.delete(id))

    return {
      message: response?.message || 'Address deleted successfully',
    }
  },
  getList: async () => {
    const response = await httpClient.get(API_ENDPOINTS.addresses.list)
    const items = Array.isArray(response?.data) ? response.data : []

    return {
      items: items.map(normalizeAddressResponse),
      message: response?.message || 'Success',
    }
  },
  update: async (id, payload) => {
    const response = await httpClient.put(API_ENDPOINTS.addresses.update(id), payload)

    return {
      data: normalizeAddressResponse(response?.data),
      message: response?.message || 'Address updated successfully',
    }
  },
}
