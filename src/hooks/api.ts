import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '../shared/api/api'
import type { Merchant, Product, MerchantListParams, OrderRequest, OrderResponse } from '@/types'

// 가맹점 목록
export const useMerchants = (params: MerchantListParams = {}) => {
  const searchParams = new URLSearchParams()
  if (params.query) searchParams.set('query', params.query)
  if (params.sort) searchParams.set('sort', params.sort)
  
  const queryString = searchParams.toString()
  const endpoint = `/api/merchants${queryString ? `?${queryString}` : ''}`
  
  return useQuery({
    queryKey: ['merchants', params],
    queryFn: () => api.get<Merchant[]>(endpoint),
  })
}

// 가맹점 상세
export const useMerchant = (id: string) => {
  return useQuery({
    queryKey: ['merchant', id],
    queryFn: () => api.get<Merchant>(`/api/merchants/${id}`),
    enabled: !!id,
  })
}

// 가맹점 상품 목록
export const useProducts = (merchantId: string) => {
  return useQuery({
    queryKey: ['products', merchantId],
    queryFn: () => api.get<Product[]>(`/api/merchants/${merchantId}/items`),
    enabled: !!merchantId,
  })
}

// 주문 생성
export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (orderData: OrderRequest) => 
      api.post<OrderResponse>('/api/orders', orderData),
  })
}