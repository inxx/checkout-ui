import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MerchantListPage } from './MerchantListPage'
import * as apiHooks from '../../hooks/api'
import type { Merchant } from '@/types'

// React Router와 i18n 모킹
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useNavigate: () => mockNavigate
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key // 간단한 키 반환
  }),
  useI18n: () => ({
    language: 'ko',
    changeLanguage: jest.fn()
  })
}))

// LanguageSelector 컴포넌트 모킹
jest.mock('../../components/LanguageSelector', () => ({
  LanguageSelector: () => <div>Language Selector</div>
}))

// API 훅 모킹
jest.mock('../../hooks/api')

const mockMerchants: Merchant[] = [
  {
    id: 'merchant-1',
    name: 'Test Cafe',
    category: 'cafe',
    rating: 4.5,
    distanceKm: 1.2,
    logoUrl: 'https://example.com/logo1.jpg',
    paymentMethod: 'card'
  },
  {
    id: 'merchant-2',
    name: 'Pizza Place',
    category: 'restaurant',
    rating: 4.0,
    distanceKm: 2.1,
    logoUrl: 'https://example.com/logo2.jpg',
    paymentMethod: 'virtual_account'
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

describe('가맹점 목록 페이지', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // 기본 성공 응답 모킹
    ;(apiHooks.useMerchants as jest.Mock).mockReturnValue({
      data: mockMerchants,
      isLoading: false,
      error: null
    })
  })

  it('가맹점 목록을 올바르게 렌더링한다', () => {
    render(
      <TestWrapper>
        <MerchantListPage />
      </TestWrapper>
    )

    expect(screen.getByText('Test Cafe')).toBeInTheDocument()
    expect(screen.getByText('Pizza Place')).toBeInTheDocument()
  })

  it('로딩 상태를 표시한다', () => {
    ;(apiHooks.useMerchants as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
      error: null
    })

    render(
      <TestWrapper>
        <MerchantListPage />
      </TestWrapper>
    )

    // 스켈레톤 로더가 표시되는지 확인
    expect(screen.getAllByTestId('merchant-skeleton')).toHaveLength(6)
  })

  it('에러 상태를 표시한다', () => {
    ;(apiHooks.useMerchants as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error('Failed to fetch')
    })

    render(
      <TestWrapper>
        <MerchantListPage />
      </TestWrapper>
    )

    expect(screen.getByText('common.error.title')).toBeInTheDocument()
  })

  it('가맹점이 없을 때 빈 상태를 표시한다', () => {
    ;(apiHooks.useMerchants as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null
    })

    render(
      <TestWrapper>
        <MerchantListPage />
      </TestWrapper>
    )

    expect(screen.getByText('merchants.empty.noMerchants')).toBeInTheDocument()
  })

  it('검색 결과가 없을 때 빈 상태를 표시한다', async () => {
    const mockUseMerchants = apiHooks.useMerchants as jest.Mock
    
    // 검색 시 빈 결과 반환
    mockUseMerchants.mockReturnValue({
      data: [],
      isLoading: false,
      error: null
    })

    render(
      <TestWrapper>
        <MerchantListPage />
      </TestWrapper>
    )

    // 존재하지 않는 가맹점 검색
    const searchInput = screen.getByPlaceholderText('merchants.search')
    fireEvent.change(searchInput, { target: { value: '존재하지않는가맹점' } })

    // 빈 상태 확인
    await waitFor(() => {
      expect(screen.getByText('merchants.empty.noResults')).toBeInTheDocument()
    })
  })

  it('검색어로 가맹점을 필터링한다', async () => {
    const mockUseMerchants = apiHooks.useMerchants as jest.Mock

    render(
      <TestWrapper>
        <MerchantListPage />
      </TestWrapper>
    )

    const searchInput = screen.getByPlaceholderText('merchants.search')
    fireEvent.change(searchInput, { target: { value: 'Pizza' } })

    // API 호출이 검색어와 함께 되었는지 확인
    await waitFor(() => {
      const lastCall = mockUseMerchants.mock.calls[mockUseMerchants.mock.calls.length - 1]
      expect(lastCall[0]).toMatchObject({ query: 'Pizza' })
    })
  })

  it('다양한 기준으로 가맹점을 정렬한다', async () => {
    const mockUseMerchants = apiHooks.useMerchants as jest.Mock

    render(
      <TestWrapper>
        <MerchantListPage />
      </TestWrapper>
    )

    const sortSelect = screen.getByDisplayValue('merchants.sort.name')
    fireEvent.change(sortSelect, { target: { value: 'rating' } })

    // API 호출이 정렬 옵션과 함께 되었는지 확인
    await waitFor(() => {
      const lastCall = mockUseMerchants.mock.calls[mockUseMerchants.mock.calls.length - 1]
      expect(lastCall[0]).toMatchObject({ sort: 'rating' })
    })
  })

  it('가맹점 카드 클릭 시 상세 페이지로 이동한다', () => {
    render(
      <TestWrapper>
        <MerchantListPage />
      </TestWrapper>
    )

    const merchantCard = screen.getByText('Test Cafe').closest('[role="button"]')
    fireEvent.click(merchantCard!)

    expect(mockNavigate).toHaveBeenCalledWith('/merchants/merchant-1')
  })

  it('검색 결과가 없을 때 모든 가맹점 보기 버튼으로 검색을 초기화한다', () => {
    // 검색 결과가 없는 상태로 시작
    ;(apiHooks.useMerchants as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null
    })

    render(
      <TestWrapper>
        <MerchantListPage />
      </TestWrapper>
    )

    const searchInput = screen.getByPlaceholderText('merchants.search')
    fireEvent.change(searchInput, { target: { value: '존재하지않는가맹점' } })

    // 검색 결과가 없을 때 나타나는 버튼
    const showAllButton = screen.getByText('merchants.empty.showAll')
    fireEvent.click(showAllButton)

    expect(searchInput).toHaveValue('')
  })

  it('검색어 변경 시에만 새로운 API 호출을 한다', async () => {
    const mockUseMerchants = apiHooks.useMerchants as jest.Mock
    
    render(
      <TestWrapper>
        <MerchantListPage />
      </TestWrapper>
    )

    // 초기 호출 후 호출 횟수 확인
    const initialCallCount = mockUseMerchants.mock.calls.length
    
    // 검색어 변경 시 새로운 API 호출
    const searchInput = screen.getByPlaceholderText('merchants.search')
    fireEvent.change(searchInput, { target: { value: 'New Search' } })

    await waitFor(() => {
      // 검색어가 변경되었으므로 새로운 호출이 있어야 함
      expect(mockUseMerchants.mock.calls.length).toBeGreaterThan(initialCallCount)
    })
  })
})