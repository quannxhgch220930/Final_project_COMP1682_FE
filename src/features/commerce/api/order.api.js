import { API_ENDPOINTS } from '../../../shared/constants/api'
import { httpClient } from '../../../shared/lib/axios'
import { normalizeOrderResponse } from '../utils/normalizeOrderResponse'

export const orderApi = {
  cancel: async (id) => {
    await httpClient.patch(API_ENDPOINTS.orders.cancel(id), {})
  },
  checkout: async (payload) => {
    const response = await httpClient.post(API_ENDPOINTS.orders.list, payload)
    return normalizeOrderResponse(response?.data)
  },
  getById: async (id) => {
    const response = await httpClient.get(API_ENDPOINTS.orders.detail(id))
    return normalizeOrderResponse(response?.data)
  },
  getList: async ({ page = 0, size = 20 } = {}) => {
    const query = new URLSearchParams()
    query.set('page', String(page))
    query.set('size', String(size))

    const response = await httpClient.get(`${API_ENDPOINTS.orders.list}?${query}`)
    const pageData = response?.data
    const items = Array.isArray(pageData?.content) ? pageData.content : []

    return {
      items: items.map(normalizeOrderResponse),
      page: pageData?.page ?? page,
      size: pageData?.size ?? size,
      totalElements: pageData?.totalElements ?? items.length,
      totalPages: pageData?.totalPages ?? 1,
    }
  },
}
