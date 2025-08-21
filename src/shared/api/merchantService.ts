import { api } from '../lib/fetchWrapper'
import type { MerchantListParams, Merchant } from '@/features/merchants/types'

export const merchantService = {
  /**
   * 가맹점 목록 조회
   */
  getMerchants: async (params: MerchantListParams = {}): Promise<Merchant[]> => {
    const searchParams = new URLSearchParams()
    
    if (params.query) {
      searchParams.append('query', params.query)
    }
    
    if (params.sort) {
      searchParams.append('sort', params.sort)
    }
    
    const url = `/api/merchants${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    
    return api.get<Merchant[]>(url)
  },

  /**
   * 가맹점 상세 조회
   */
  getMerchant: async (id: string): Promise<Merchant> => {
    return api.get<Merchant>(`/api/merchants/${id}`)
  },
}