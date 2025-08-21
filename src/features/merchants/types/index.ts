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