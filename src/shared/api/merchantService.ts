import { authApi } from '../lib/fetchWrapper'
import type { MerchantListParams, Merchant, Product } from '@/features/merchants/types'

export const merchantService = {
  /**
   * 가맹점 목록 조회
   */
  getMerchantList: async (params: MerchantListParams = {}): Promise<Merchant[]> => {
    const searchParams = new URLSearchParams()
    
    if (params.query) {
      searchParams.append('query', params.query)
    }
    
    if (params.sort) {
      searchParams.append('sort', params.sort)
    }
    
    const url = `/api/merchants${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    
    return authApi.get<Merchant[]>(url)
  },

  /**
   * 가맹점 상세 정보 조회
   */
  getMerchantDetail: async (id: string): Promise<Merchant> => {
    return authApi.get<Merchant>(`/api/merchants/${id}`)
  },

  /**
   * 가맹점 상품 목록 조회
   */
  getMerchantItems: async (id: string): Promise<Product[]> => {
    return authApi.get<Product[]>(`/api/merchants/${id}/items`)
  },
}