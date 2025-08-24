export interface Merchant {
  id: string
  name: string
  category: string
  distanceKm: number
  rating: number
  logoUrl?: string
  description?: string
  phone?: string
  address?: string
  paymentMethod?: 'card' | 'virtual_account' // 결제 방식 플래그
}

export type SortOption = 'name' | 'rating' | 'distance'

export interface MerchantListParams {
  query?: string
  sort?: SortOption
}

export interface MerchantListResponse {
  merchants: Merchant[]
  total: number
}

// 상품 관련 타입 재export
export * from './product'