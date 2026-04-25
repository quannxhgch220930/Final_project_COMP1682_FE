import { API_ENDPOINTS } from '../../../shared/constants/api'
import { httpClient } from '../../../shared/lib/axios'
import { normalizeNotificationResponse } from '../utils/normalizeNotificationResponse'

export const notificationApi = {
  getList: async ({ page = 0, size = 20 } = {}) => {
    const query = new URLSearchParams({
      page: String(page),
      size: String(size),
    })

    const response = await httpClient.get(
      `${API_ENDPOINTS.notifications.list}?${query}`,
    )
    const pageData = response?.data
    const items = Array.isArray(pageData?.content) ? pageData.content : []

    return {
      items: items.map(normalizeNotificationResponse),
      page: pageData?.page ?? page,
      size: pageData?.size ?? size,
      totalElements: pageData?.totalElements ?? items.length,
      totalPages: pageData?.totalPages ?? 1,
    }
  },
  getUnreadCount: async () => {
    const response = await httpClient.get(API_ENDPOINTS.notifications.unreadCount)
    return Number(response?.data?.unread ?? 0)
  },
  markAllRead: async () => {
    const response = await httpClient.patch(API_ENDPOINTS.notifications.readAll, {})

    return {
      message: response?.message || 'Marked all notifications as read',
    }
  },
}
