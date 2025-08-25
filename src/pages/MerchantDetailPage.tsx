import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCartStore } from '../stores/useCartStore'
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
  const { getCurrentCart, addProduct, removeProduct, getTotalAmount, clearMerchantCart } = useCartStore()
  
  // 현재 가맹점의 장바구니
  const selectedProducts = getCurrentCart(id || '')
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)

  // API 호출
  const { data: merchant, isLoading: merchantLoading, error: merchantError } = useMerchant(id || '')
  const { data: products = [], isLoading: productsLoading, error: productsError } = useProducts(id || '')
  const createOrder = useCreateOrder()

  // 상품 선택/해제 핸들러
  const handleProductSelect = (product: Product, selected: boolean) => {
    if (!id) return
    
    if (selected) {
      addProduct(id, product)
    } else {
      removeProduct(id, product.id)
    }
  }


  // 결제 결과 객체 생성
  const createPaymentResult = (status: string, totalAmount: number, error?: string) => {
    return {
      paymentId: `PAY_${Date.now()}`,
      status,
      totalAmount,
      merchantName: merchant?.name || '',
      ...(error && { error })
    }
  }

  // 결제 성공 후 페이지 이동
  const navigateToResult = (status: string, paymentResult: any) => {
    const statusRoute = status.toLowerCase()
    
    navigate(`/payment/result/${statusRoute}`, {
      state: paymentResult
    })
  }

  // 결제 API 호출
  const processPayment = async (totalAmount: number) => {
    const orderResponse = await createOrder.mutateAsync({
      merchantId: merchant!.id,
      currency: 'KRW',
      amount: totalAmount
    })
    
    return orderResponse
  }

  // 구매하기 핸들러 (메인 함수)
  const handlePurchase = async () => {
    if (selectedProducts.length === 0 || !merchant) return
    
    setIsPaymentProcessing(true)
    
    const totalAmount = getTotalAmount(id!)
    
    try {
      const orderResponse = await processPayment(totalAmount)
      const paymentResult = createPaymentResult(orderResponse.status, totalAmount)
      
      setIsPaymentProcessing(false)
      
      // 결제 성공 시 해당 가맹점 장바구니만 초기화
      if (orderResponse.status === 'PAID') {
        clearMerchantCart(id!)
      }
      
      navigateToResult(orderResponse.status, paymentResult)
    } catch (error) {
      console.error('[Payment] Order API failed:', error)
      setIsPaymentProcessing(false)
      
      const paymentResult = createPaymentResult('DECLINED', totalAmount, 'Payment processing failed')
      navigateToResult('DECLINED', paymentResult)
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
        merchantId={id!}
        onPurchase={handlePurchase}
        disabled={isPaymentProcessing}
      />
    </div>
  )
}