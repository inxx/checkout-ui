import { authApi } from '../lib/fetchWrapper'
import type { OrderRequest, OrderResponse } from '@/features/checkout/types'

export const orderService = {
  /**
   * 결제 요청 API
   */
  createOrder: async (orderData: OrderRequest): Promise<OrderResponse> => {
    console.log('[Order Service] Creating order:', orderData)
    
    const response = await authApi.post<OrderResponse>('/api/orders', orderData)
    
    console.log('[Order Service] Order created with status:', response.status)
    
    return response
  }
}