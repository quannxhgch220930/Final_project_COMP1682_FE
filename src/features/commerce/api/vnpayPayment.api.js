import { API_ENDPOINTS } from '../../../shared/constants/api'
import { httpClient } from '../../../shared/lib/axios'

export const vnpayPaymentApi = {
  createPaymentUrl: async (orderId) => {
    const response = await httpClient.post(API_ENDPOINTS.vnpay.createPayment(orderId))
    return response?.data
  },
}