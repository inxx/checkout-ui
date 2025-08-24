// 가맹점 관련 타입
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

// 상품 관련 타입
export interface Product {
  id: string
  name: string
  price: number
  currency: string
  imageUrl?: string
  description?: string
  category?: string
  isAvailable: boolean
}

export interface SelectedProduct {
  product: Product
  quantity: number
}

// 결제 관련 타입
export type PaymentStatus = 'PAID' | 'DECLINED' | 'PENDING'

export interface OrderRequest {
  merchantId: string
  currency: string
  amount: number
}

export interface OrderResponse {
  status: PaymentStatus
}