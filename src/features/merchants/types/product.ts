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