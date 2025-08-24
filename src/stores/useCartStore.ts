import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SelectedProduct, Product } from '@/types'

interface CartState {
  // 가맹점별 장바구니 Map
  carts: Record<string, SelectedProduct[]>
  
  // 특정 가맹점 장바구니 조회
  getCurrentCart: (merchantId: string) => SelectedProduct[]
  
  // 가맹점별 상품 추가
  addProduct: (merchantId: string, product: Product) => void
  
  // 가맹점별 상품 제거
  removeProduct: (merchantId: string, productId: string) => void
  
  // 특정 가맹점 장바구니 초기화
  clearMerchantCart: (merchantId: string) => void
  
  // 특정 가맹점 총 금액
  getTotalAmount: (merchantId: string) => number
  
  // 특정 가맹점 총 수량
  getTotalItems: (merchantId: string) => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      carts: {},
      
      getCurrentCart: (merchantId: string) => {
        return get().carts[merchantId] || []
      },
      
      addProduct: (merchantId: string, product: Product) => {
        const { carts } = get()
        const currentCart = carts[merchantId] || []
        const existingItem = currentCart.find(item => item.product.id === product.id)
        
        let newCart: SelectedProduct[]
        if (existingItem) {
          // 이미 있으면 수량 증가
          newCart = currentCart.map(item =>
            item.product.id === product.id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        } else {
          // 새로운 상품 추가
          newCart = [...currentCart, { product, quantity: 1 }]
        }
        
        set({
          carts: { ...carts, [merchantId]: newCart }
        })
      },
      
      removeProduct: (merchantId: string, productId: string) => {
        const { carts } = get()
        const currentCart = carts[merchantId] || []
        
        set({
          carts: {
            ...carts,
            [merchantId]: currentCart.filter(item => item.product.id !== productId)
          }
        })
      },
      
      clearMerchantCart: (merchantId: string) => {
        const { carts } = get()
        set({
          carts: { ...carts, [merchantId]: [] }
        })
      },
      
      getTotalAmount: (merchantId: string) => {
        const currentCart = get().getCurrentCart(merchantId)
        return currentCart.reduce(
          (sum, item) => sum + (item.product.price * item.quantity), 
          0
        )
      },
      
      getTotalItems: (merchantId: string) => {
        const currentCart = get().getCurrentCart(merchantId)
        return currentCart.reduce(
          (sum, item) => sum + item.quantity, 
          0
        )
      }
    }),
    {
      name: 'cart-storage'
    }
  )
)