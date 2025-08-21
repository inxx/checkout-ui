import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { 
  MerchantDetailHeader,
  MerchantInfo,
  ProductList,
  PurchaseButton
} from '../features/merchants/components'
import { useMerchant, useMerchantItems } from '../features/merchants/hooks/useMerchants'
import type { SelectedProduct } from '../features/merchants/types'

export default function MerchantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([])

  // API 호출
  const { data: merchant, isLoading: merchantLoading, error: merchantError } = useMerchant(id || '')
  const { data: products = [], isLoading: productsLoading, error: productsError } = useMerchantItems(id || '')

  // 상품 선택/해제 핸들러
  const handleProductSelect = (product: any, selected: boolean) => {
    if (selected) {
      setSelectedProducts(prev => [
        ...prev,
        { product, quantity: 1 }
      ])
    } else {
      setSelectedProducts(prev => 
        prev.filter(item => item.product.id !== product.id)
      )
    }
  }

  // 구매하기 핸들러
  const handlePurchase = () => {
    if (selectedProducts.length === 0) return
    
    // 구매 로직 구현 예정
    alert(`${selectedProducts.length}개 상품 구매 진행`)
    console.log('선택된 상품들:', selectedProducts)
  }

  // 로딩 상태
  if (merchantLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // 에러 상태
  if (merchantError || !merchant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">가맹점을 찾을 수 없습니다</h3>
          <p className="text-gray-500">다시 시도해 주세요.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <MerchantDetailHeader title={merchant.name} />
      
      {/* 가맹점 정보 */}
      <div className="mb-2">
        <MerchantInfo merchant={merchant} />
      </div>

      {/* 상품 목록 */}
      <ProductList
        products={products}
        selectedProducts={selectedProducts}
        onProductSelect={handleProductSelect}
        isLoading={productsLoading}
        error={productsError?.message || null}
      />

      {/* 구매하기 버튼 */}
      <PurchaseButton
        selectedProducts={selectedProducts}
        onPurchase={handlePurchase}
      />
    </div>
  )
}