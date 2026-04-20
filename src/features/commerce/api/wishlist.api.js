import { API_ENDPOINTS } from '../../../shared/constants/api'
import { httpClient } from '../../../shared/lib/axios'
import { normalizeWishlistListResponse } from '../utils/normalizeWishlistResponse'

export const wishlistApi = {
  add: async (productId) => {
    await httpClient.post(API_ENDPOINTS.wishlist.add(productId), {})
  },
  check: async (productId) => {
    const response = await httpClient.get(API_ENDPOINTS.wishlist.check(productId))
    return Boolean(response?.data)
  },
  getList: async ({ page = 0, size = 50 } = {}) => {
    const query = new URLSearchParams()
    query.set('page', String(page))
    query.set('size', String(size))

    const response = await httpClient.get(`${API_ENDPOINTS.wishlist.list}?${query}`)
    return normalizeWishlistListResponse(response?.data)
  },
  remove: async (productId) => {
    await httpClient.delete(API_ENDPOINTS.wishlist.remove(productId))
  },
}
