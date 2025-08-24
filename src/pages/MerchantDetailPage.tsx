import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MerchantDetailHeader } from '../features/merchants/components/detail/MerchantDetailHeader'
import { MerchantInfo } from '../features/merchants/components/detail/MerchantInfo'
import { ProductList } from '../features/merchants/components/detail/ProductList'
import { PurchaseButton } from '../features/merchants/components/detail/PurchaseButton'
import { useMerchant, useProducts, useCreateOrder } from '../hooks/api'
import type { SelectedProduct, Product } from '@/types'

export default function MerchantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation('common')
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([])
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)

  // API 호출
  const { data: merchant, isLoading: merchantLoading, error: merchantError } = useMerchant(id || '')
  const { data: products = [], isLoading: productsLoading, error: productsError } = useProducts(id || '')
  const createOrder = useCreateOrder()

  // 상품 선택/해제 핸들러
  const handleProductSelect = (product: Product, selected: boolean) => {
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
  const handlePurchase = async () => {
    if (selectedProducts.length === 0 || !merchant) return
    
    setIsPaymentProcessing(true)
    console.log('[Payment] Starting payment process for merchant:', merchant.id)
    
    // 총 금액 계산
    const totalAmount = selectedProducts.reduce(
      (sum, item) => sum + (item.product.price * item.quantity), 
      0
    )
    
    try {
      // 실제 결제 API 호출
      console.log('[Payment] Calling order API with amount:', totalAmount)
      
      const orderResponse = await createOrder.mutateAsync({
        merchantId: merchant.id,
        currency: 'KRW',
        amount: totalAmount
      })
      
      console.log('[Payment] Order API response:', orderResponse)
      
      const paymentResult = {
        paymentId: `PAY_${Date.now()}`,
        status: orderResponse.status,
        totalAmount,
        merchantName: merchant.name
      }
      
      setIsPaymentProcessing(false)
      
      // API 응답의 status에 따라 페이지 이동
      const statusRoute = orderResponse.status.toLowerCase()
      console.log(`[Payment] Navigating to: /payment/result/${statusRoute}`)
      
      navigate(`/payment/result/${statusRoute}`, {
        state: paymentResult
      })
    } catch (error) {
      console.error('[Payment] Order API failed:', error)
      setIsPaymentProcessing(false)
      
      // API 호출 실패 시 declined 페이지로 이동
      const paymentResult = {
        paymentId: `PAY_${Date.now()}`,
        status: 'DECLINED',
        totalAmount,
        merchantName: merchant.name,
        error: 'Payment processing failed'
      }
      
      navigate('/payment/result/declined', {
        state: paymentResult
      })
    }
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('merchants.notFound')}</h3>
          <p className="text-gray-500">{t('merchants.tryAgain')}</p>
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
        disabled={isPaymentProcessing}
      />
    </div>
  )
}