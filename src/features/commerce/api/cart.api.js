import { API_ENDPOINTS } from '../../../shared/constants/api'
import { httpClient } from '../../../shared/lib/axios'
import { normalizeCartResponse } from '../utils/normalizeCartResponse'

export const cartApi = {
  addItem: async ({ productId, quantity = 1 }) => {
    const response = await httpClient.post(API_ENDPOINTS.cart.addItem, {
      productId: Number(productId),
      quantity: Number(quantity),
    })

    return normalizeCartResponse(response?.data)
  },
  clear: async () => {
    await httpClient.delete(API_ENDPOINTS.cart.clear)
  },
  getCart: async () => {
    const response = await httpClient.get(API_ENDPOINTS.cart.detail)
    return normalizeCartResponse(response?.data)
  },
  removeItem: async (itemId) => {
    const response = await httpClient.delete(API_ENDPOINTS.cart.removeItem(itemId))
    return normalizeCartResponse(response?.data)
  },
  updateItem: async (itemId, quantity) => {
    const response = await httpClient.patch(API_ENDPOINTS.cart.updateItem(itemId), {
      quantity: Number(quantity),
    })

    return normalizeCartResponse(response?.data)
  },
}
