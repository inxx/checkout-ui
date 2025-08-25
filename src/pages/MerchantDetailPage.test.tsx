import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MerchantDetailPage from './MerchantDetailPage'
import { useCartStore } from '../stores/useCartStore'
import * as apiHooks from '../hooks/api'
import type { Merchant, Product } from '@/types'

// React Router 모킹
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: 'merchant-1' })
}))

// i18n 모킹
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  }),
  useI18n: () => ({
    language: 'ko',
    changeLanguage: jest.fn()
  })
}))

// LanguageSelector와 다른 컴포넌트들 모킹
jest.mock('../components/LanguageSelector', () => ({
  LanguageSelector: () => <div>Language Selector</div>
}))

jest.mock('../features/merchants/components/detail/MerchantDetailHeader', () => ({
  MerchantDetailHeader: ({ title }: { title: string }) => <div>Header: {title}</div>
}))

jest.mock('../features/merchants/components/detail/MerchantInfo', () => ({
  MerchantInfo: ({ merchant }: { merchant: any }) => <div>Merchant Info: {merchant.name}</div>
}))

jest.mock('../features/merchants/components/detail/ProductList', () => ({
  ProductList: ({ products, onProductSelect }: { products: any[], onProductSelect: (product: any, selected: boolean) => void }) => (
    <div>
      {products.length === 0 ? (
        <div>상품이 없습니다</div>
      ) : (
        products.map((product) => (
          <label key={product.id}>
            <input 
              type="checkbox" 
              onChange={(e) => onProductSelect(product, e.target.checked)}
            />
            {product.name}
          </label>
        ))
      )}
    </div>
  )
}))

jest.mock('../features/merchants/components/detail/PurchaseButton', () => ({
  PurchaseButton: ({ onPurchase, disabled }: { onPurchase: () => void, disabled: boolean }) => (
    <button onClick={onPurchase} disabled={disabled}>
      구매하기
    </button>
  )
}))

// API 훅 모킹
jest.mock('../hooks/api')

const mockMerchant: Merchant = {
  id: 'merchant-1',
  name: 'Test Cafe',
  category: 'cafe',
  rating: 4.5,
  distanceKm: 1.2,
  logoUrl: 'https://example.com/logo.jpg',
  paymentMethod: 'card'
}

const mockProducts: Product[] = [
  {
    id: 'product-1',
    name: 'Americano',
    price: 4500,
    description: 'Fresh coffee'
  },
  {
    id: 'product-2', 
    name: 'Latte',
    price: 5500,
    description: 'Coffee with milk'
  }
]

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('가맹점 상세페이지 - 결제 플로우 통합 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // 스토어 초기화
    useCartStore.setState({ carts: {} })
    
    // 기본 API 모킹
    ;(apiHooks.useMerchant as jest.Mock).mockReturnValue({
      data: mockMerchant,
      isLoading: false,
      error: null
    })
    
    ;(apiHooks.useProducts as jest.Mock).mockReturnValue({
      data: mockProducts,
      isLoading: false,
      error: null
    })
    
    ;(apiHooks.useCreateOrder as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn().mockResolvedValue({ status: 'PAID' })
    })
  })

  it('결제 플로우의 성공 케이스를 테스트한다', async () => {
    const mockCreateOrder = jest.fn().mockResolvedValue({ status: 'PAID' })
    ;(apiHooks.useCreateOrder as jest.Mock).mockReturnValue({
      mutateAsync: mockCreateOrder
    })

    render(
      <TestWrapper>
        <MerchantDetailPage />
      </TestWrapper>
    )

    // 1. 상품 선택
    const productCheckbox = screen.getByLabelText(/Americano/i)
    fireEvent.click(productCheckbox)

    // 2. 구매하기 버튼 클릭
    const purchaseButton = screen.getByText(/구매하기/i)
    fireEvent.click(purchaseButton)

    // 3. 결제 API 호출 확인
    await waitFor(() => {
      expect(mockCreateOrder).toHaveBeenCalledWith({
        merchantId: 'merchant-1',
        currency: 'KRW', 
        amount: 4500
      })
    })

    // 4. 성공 페이지로 이동 확인
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/payment/result/paid', {
        state: expect.objectContaining({
          status: 'PAID',
          totalAmount: 4500,
          merchantName: 'Test Cafe'
        })
      })
    })
  })

  it('결제 플로우의 실패 케이스를 테스트한다', async () => {
    const mockCreateOrder = jest.fn().mockRejectedValue(new Error('Payment failed'))
    ;(apiHooks.useCreateOrder as jest.Mock).mockReturnValue({
      mutateAsync: mockCreateOrder
    })

    render(
      <TestWrapper>
        <MerchantDetailPage />
      </TestWrapper>
    )

    // 상품 선택 후 구매
    const productCheckbox = screen.getByLabelText(/Americano/i)
    fireEvent.click(productCheckbox)
    
    const purchaseButton = screen.getByText(/구매하기/i)
    fireEvent.click(purchaseButton)

    // 실패 페이지로 이동 확인
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/payment/result/declined', {
        state: expect.objectContaining({
          status: 'DECLINED',
          error: 'Payment processing failed'
        })
      })
    })
  })

  it('결제 성공 후 장바구니를 비운다', async () => {
    const mockCreateOrder = jest.fn().mockResolvedValue({ status: 'PAID' })
    ;(apiHooks.useCreateOrder as jest.Mock).mockReturnValue({
      mutateAsync: mockCreateOrder
    })

    render(
      <TestWrapper>
        <MerchantDetailPage />
      </TestWrapper>
    )

    // 상품을 장바구니에 추가
    const productCheckbox = screen.getByLabelText(/Americano/i)
    fireEvent.click(productCheckbox)

    // 장바구니에 상품이 있는지 확인
    expect(useCartStore.getState().getCurrentCart('merchant-1')).toHaveLength(1)

    // 구매 완료
    const purchaseButton = screen.getByText(/구매하기/i)
    fireEvent.click(purchaseButton)

    // 결제 성공 후 장바구니가 비워졌는지 확인
    await waitFor(() => {
      expect(useCartStore.getState().getCurrentCart('merchant-1')).toHaveLength(0)
    })
  })

  it('결제 플로우의 PENDING 상태를 테스트한다', async () => {
    const virtualAccountMerchant = { ...mockMerchant, paymentMethod: 'virtual_account' as const }
    ;(apiHooks.useMerchant as jest.Mock).mockReturnValue({
      data: virtualAccountMerchant,
      isLoading: false,
      error: null
    })

    const mockCreateOrder = jest.fn().mockResolvedValue({ status: 'PENDING' })
    ;(apiHooks.useCreateOrder as jest.Mock).mockReturnValue({
      mutateAsync: mockCreateOrder
    })

    render(
      <TestWrapper>
        <MerchantDetailPage />
      </TestWrapper>
    )

    const productCheckbox = screen.getByLabelText(/Americano/i)
    fireEvent.click(productCheckbox)
    
    const purchaseButton = screen.getByText(/구매하기/i)
    fireEvent.click(purchaseButton)

    // PENDING 결과 페이지로 이동 확인
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/payment/result/pending', {
        state: expect.objectContaining({
          status: 'PENDING'
        })
      })
    })
  })

  it('결제 플로우의 총 금액을 올바르게 계산한다', async () => {
    const mockCreateOrder = jest.fn().mockResolvedValue({ status: 'PAID' })
    ;(apiHooks.useCreateOrder as jest.Mock).mockReturnValue({
      mutateAsync: mockCreateOrder
    })

    render(
      <TestWrapper>
        <MerchantDetailPage />
      </TestWrapper>
    )

    // 두 개 상품 선택
    const americanoCheckbox = screen.getByLabelText(/Americano/i)
    const latteCheckbox = screen.getByLabelText(/Latte/i)
    
    fireEvent.click(americanoCheckbox)
    fireEvent.click(latteCheckbox)

    const purchaseButton = screen.getByText(/구매하기/i)
    fireEvent.click(purchaseButton)

    // 총액이 올바르게 계산되어 API 호출되었는지 확인
    await waitFor(() => {
      expect(mockCreateOrder).toHaveBeenCalledWith({
        merchantId: 'merchant-1',
        currency: 'KRW',
        amount: 10000 // 4500 + 5500
      })
    })
  })

  it('결제 처리 중 구매 버튼을 비활성화한다', async () => {
    let resolvePayment: (value: any) => void
    const paymentPromise = new Promise((resolve) => {
      resolvePayment = resolve
    })
    
    const mockCreateOrder = jest.fn().mockReturnValue(paymentPromise)
    ;(apiHooks.useCreateOrder as jest.Mock).mockReturnValue({
      mutateAsync: mockCreateOrder
    })

    render(
      <TestWrapper>
        <MerchantDetailPage />
      </TestWrapper>
    )

    const productCheckbox = screen.getByLabelText(/Americano/i)
    fireEvent.click(productCheckbox)

    const purchaseButton = screen.getByText(/구매하기/i)
    fireEvent.click(purchaseButton)

    // 버튼이 비활성화되었는지 확인
    expect(purchaseButton).toBeDisabled()

    // 결제 완료
    resolvePayment!({ status: 'PAID' })
    
    await waitFor(() => {
      expect(purchaseButton).not.toBeDisabled()
    })
  })

  it('상품이 없을 때 빈 상태 화면을 표시한다', () => {
    // 상품 목록이 비어있도록 모킹
    ;(apiHooks.useProducts as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null
    })

    render(
      <TestWrapper>
        <MerchantDetailPage />
      </TestWrapper>
    )

    // 빈 상태 메시지 확인 (실제 구현에서 사용되는 텍스트에 따라 조정)
    expect(screen.getByText(/상품이 없습니다/i) || screen.getByText(/가맹점이 없습니다/i)).toBeInTheDocument()
  })

  it('결제 금액이 10만원을 초과하면 DECLINED 상태로 처리한다', async () => {
    // 10만원 초과 상품 생성
    const expensiveProduct: Product = {
      id: 'expensive-product',
      name: '비싼 상품',
      price: 150000, // 15만원
      description: '10만원을 초과하는 상품'
    }

    ;(apiHooks.useProducts as jest.Mock).mockReturnValue({
      data: [expensiveProduct],
      isLoading: false,
      error: null
    })

    const mockCreateOrder = jest.fn().mockResolvedValue({ status: 'DECLINED' })
    ;(apiHooks.useCreateOrder as jest.Mock).mockReturnValue({
      mutateAsync: mockCreateOrder
    })

    render(
      <TestWrapper>
        <MerchantDetailPage />
      </TestWrapper>
    )

    // 비싼 상품 선택
    const productCheckbox = screen.getByLabelText(/비싼 상품/i)
    fireEvent.click(productCheckbox)

    const purchaseButton = screen.getByText(/구매하기/i)
    fireEvent.click(purchaseButton)

    // API 호출에 15만원이 전달되었는지 확인
    await waitFor(() => {
      expect(mockCreateOrder).toHaveBeenCalledWith({
        merchantId: 'merchant-1',
        currency: 'KRW',
        amount: 150000
      })
    })

    // DECLINED 페이지로 이동 확인
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/payment/result/declined', {
        state: expect.objectContaining({
          status: 'DECLINED'
        })
      })
    })
  })
})