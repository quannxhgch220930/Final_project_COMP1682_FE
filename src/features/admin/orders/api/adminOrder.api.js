import { API_ENDPOINTS } from '../../../../shared/constants/api'
import { httpClient } from '../../../../shared/lib/axios'
import { normalizeOrderResponse } from '../../../commerce/utils/normalizeOrderResponse'

export const adminOrderApi = {
  getList: async ({ page = 0, size = 10, status = '' } = {}) => {
    const query = new URLSearchParams({
      page: String(page),
      size: String(size),
    })

    if (status) {
      query.set('status', status)
    }

    const response = await httpClient.get(`${API_ENDPOINTS.admin.orders}?${query}`)
    const pageData = response?.data
    const orders = pageData?.content || pageData?.items || pageData?.data || []

    return {
      items: orders.map((order) => normalizeOrderResponse(order)),
      page: pageData?.page ?? page,
      size: pageData?.size ?? size,
      totalElements: pageData?.totalElements ?? orders.length,
      totalPages: pageData?.totalPages ?? 1,
    }
  },
  updateStatus: async (id, payload) => {
    const response = await httpClient.patch(
      API_ENDPOINTS.admin.updateOrderStatus(id),
      payload,
    )

    return {
      data: normalizeOrderResponse(response?.data),
      message: response?.message || 'Order status updated successfully',
    }
  },
}
