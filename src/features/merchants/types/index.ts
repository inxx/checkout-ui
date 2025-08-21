export interface Merchant {
  id: string
  name: string
  category: string
  distanceKm: number
  rating: number
  logoUrl?: string
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