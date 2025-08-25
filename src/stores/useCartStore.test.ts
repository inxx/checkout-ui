import { useCartStore } from './useCartStore'
import type { Product } from '@/types'

// 테스트용 상품 데이터
const mockProduct1: Product = {
  id: 'prod1',
  name: 'Test Product 1',
  price: 10000,
  description: 'Test description 1'
}

const mockProduct2: Product = {
  id: 'prod2', 
  name: 'Test Product 2',
  price: 20000,
  description: 'Test description 2'
}

const merchantId = 'merchant1'

describe('장바구니 스토어', () => {
  beforeEach(() => {
    // 각 테스트 전에 스토어 초기화
    useCartStore.setState({ carts: {} })
  })

  describe('상품 추가', () => {
    it('새 상품을 장바구니에 추가할 수 있다', () => {
      const { addProduct, getCurrentCart } = useCartStore.getState()
      
      addProduct(merchantId, mockProduct1)
      
      const cart = getCurrentCart(merchantId)
      expect(cart).toHaveLength(1)
      expect(cart[0].product).toEqual(mockProduct1)
      expect(cart[0].quantity).toBe(1)
    })

    it('기존 상품을 다시 추가하면 수량이 증가한다', () => {
      const { addProduct, getCurrentCart } = useCartStore.getState()
      
      addProduct(merchantId, mockProduct1)
      addProduct(merchantId, mockProduct1)
      
      const cart = getCurrentCart(merchantId)
      expect(cart).toHaveLength(1)
      expect(cart[0].quantity).toBe(2)
    })

    it('다양한 상품을 추가할 수 있다', () => {
      const { addProduct, getCurrentCart } = useCartStore.getState()
      
      addProduct(merchantId, mockProduct1)
      addProduct(merchantId, mockProduct2)
      
      const cart = getCurrentCart(merchantId)
      expect(cart).toHaveLength(2)
    })
  })

  describe('상품 제거', () => {
    it('장바구니에서 상품을 제거할 수 있다', () => {
      const { addProduct, removeProduct, getCurrentCart } = useCartStore.getState()
      
      addProduct(merchantId, mockProduct1)
      addProduct(merchantId, mockProduct2)
      
      removeProduct(merchantId, mockProduct1.id)
      
      const cart = getCurrentCart(merchantId)
      expect(cart).toHaveLength(1)
      expect(cart[0].product.id).toBe(mockProduct2.id)
    })

    it('존재하지 않는 상품 제거 요청을 안전하게 처리한다', () => {
      const { addProduct, removeProduct, getCurrentCart } = useCartStore.getState()
      
      addProduct(merchantId, mockProduct1)
      removeProduct(merchantId, 'non-existent')
      
      const cart = getCurrentCart(merchantId)
      expect(cart).toHaveLength(1)
    })
  })

  describe('총 금액 계산', () => {
    it('총 금액을 정확하게 계산한다', () => {
      const { addProduct, getTotalAmount } = useCartStore.getState()
      
      addProduct(merchantId, mockProduct1) // 10000 x 1
      addProduct(merchantId, mockProduct1) // 10000 x 2 
      addProduct(merchantId, mockProduct2) // 20000 x 1
      
      const total = getTotalAmount(merchantId)
      expect(total).toBe(40000) // 10000*2 + 20000*1
    })

    it('빈 장바구니의 총 금액은 0이다', () => {
      const { getTotalAmount } = useCartStore.getState()
      
      const total = getTotalAmount(merchantId)
      expect(total).toBe(0)
    })
  })

  describe('총 상품 수량 계산', () => {
    it('총 상품 수량을 정확하게 계산한다', () => {
      const { addProduct, getTotalItems } = useCartStore.getState()
      
      addProduct(merchantId, mockProduct1) // quantity 1
      addProduct(merchantId, mockProduct1) // quantity 2
      addProduct(merchantId, mockProduct2) // quantity 1
      
      const total = getTotalItems(merchantId)
      expect(total).toBe(3) // 2 + 1
    })
  })

  describe('가맹점별 장바구니 초기화', () => {
    it('특정 가맹점의 장바구니만 초기화한다', () => {
      const { addProduct, clearMerchantCart, getCurrentCart } = useCartStore.getState()
      const merchant2 = 'merchant2'
      
      addProduct(merchantId, mockProduct1)
      addProduct(merchant2, mockProduct2)
      
      clearMerchantCart(merchantId)
      
      expect(getCurrentCart(merchantId)).toHaveLength(0)
      expect(getCurrentCart(merchant2)).toHaveLength(1)
    })
  })

  describe('현재 장바구니 조회', () => {
    it('존재하지 않는 가맹점의 장바구니는 빈 배열을 반환한다', () => {
      const { getCurrentCart } = useCartStore.getState()
      
      const cart = getCurrentCart('non-existent-merchant')
      expect(cart).toEqual([])
    })
  })
})