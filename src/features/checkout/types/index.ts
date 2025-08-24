export type PaymentStatus = 'PAID' | 'DECLINED' | 'PENDING'

export interface OrderRequest {
  merchantId: string
  currency: string
  amount: number
}

export interface OrderResponse {
  status: PaymentStatus
}