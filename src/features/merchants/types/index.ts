export interface Merchant {
  id: string
  name: string
  description: string
  address: string
  distance?: number
  rating: number
  reviewCount: number
  imageUrl?: string
  category: string
  isOpen: boolean
  openingHours?: string
}

export interface MerchantListResponse {
  merchants: Merchant[]
  totalCount: number
  hasNext: boolean
}