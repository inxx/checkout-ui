import { render, screen, fireEvent } from '@testing-library/react'
import { MerchantCard } from './MerchantCard'
import type { Merchant } from '@/types'

const mockMerchant: Merchant = {
  id: 'merchant-1',
  name: 'Test Cafe',
  category: 'cafe',
  rating: 4.5,
  distanceKm: 1.2,
  logoUrl: 'https://example.com/logo.jpg',
  paymentMethod: 'card'
}

const mockOnClick = jest.fn()

describe('가맹점 카드 컴포넌트', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('가맹점 정보를 올바르게 렌더링한다', () => {
    render(<MerchantCard merchant={mockMerchant} onClick={mockOnClick} />)
    
    expect(screen.getByText('Test Cafe')).toBeInTheDocument()
    expect(screen.getByText('cafe')).toBeInTheDocument()
    expect(screen.getByText('1.2km')).toBeInTheDocument()
  })

  it('로고 URL이 있으면 가맹점 로고를 표시한다', () => {
    render(<MerchantCard merchant={mockMerchant} onClick={mockOnClick} />)
    
    const logo = screen.getByAltText('Test Cafe')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', 'https://example.com/logo.jpg')
  })

  it('로고 URL이 없으면 대체 이미지를 표시한다', () => {
    const merchantWithoutLogo = { ...mockMerchant, logoUrl: undefined }
    render(<MerchantCard merchant={merchantWithoutLogo} onClick={mockOnClick} />)
    
    expect(screen.getByText('T')).toBeInTheDocument() // 첫 글자 대체 표시
  })

  it('카드 클릭 시 onClick 콜백을 호출한다', () => {
    render(<MerchantCard merchant={mockMerchant} onClick={mockOnClick} />)
    
    const card = screen.getByRole('button')
    fireEvent.click(card)
    
    expect(mockOnClick).toHaveBeenCalledWith(mockMerchant)
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('Enter 키 입력 시 onClick 콜백을 호출한다', () => {
    render(<MerchantCard merchant={mockMerchant} onClick={mockOnClick} />)
    
    const card = screen.getByRole('button')
    fireEvent.keyDown(card, { key: 'Enter' })
    
    expect(mockOnClick).toHaveBeenCalledWith(mockMerchant)
  })

  it('스페이스 키 입력 시 onClick 콜백을 호출한다', () => {
    render(<MerchantCard merchant={mockMerchant} onClick={mockOnClick} />)
    
    const card = screen.getByRole('button')
    fireEvent.keyDown(card, { key: ' ' })
    
    expect(mockOnClick).toHaveBeenCalledWith(mockMerchant)
  })

  it('다른 키 입력 시에는 onClick을 호출하지 않는다', () => {
    render(<MerchantCard merchant={mockMerchant} onClick={mockOnClick} />)
    
    const card = screen.getByRole('button')
    fireEvent.keyDown(card, { key: 'Tab' })
    
    expect(mockOnClick).not.toHaveBeenCalled()
  })

  it('적절한 접근성 속성을 가진다', () => {
    render(<MerchantCard merchant={mockMerchant} onClick={mockOnClick} />)
    
    const card = screen.getByRole('button')
    expect(card).toHaveAttribute('tabIndex', '0')
    expect(card).toHaveAttribute('aria-label', 'Test Cafe 가맹점 상세보기')
  })

  it('평점을 올바르게 표시한다', () => {
    render(<MerchantCard merchant={mockMerchant} onClick={mockOnClick} />)
    
    // StarRating 컴포넌트가 렌더링되는지 확인
    const ratingContainer = screen.getByText('Test Cafe').closest('.p-4')
    expect(ratingContainer).toBeInTheDocument()
  })
})