import React from 'react'
import { useTranslation } from 'react-i18next'
import { useFormatting } from '../../../../hooks/useFormatting'
import { Button } from '../../../../components/Button'
import type { Product, SelectedProduct } from '@/types'

interface ProductListProps {
  products: Product[]
  selectedProducts: SelectedProduct[]
  onProductSelect: (product: Product, selected: boolean) => void
  isLoading?: boolean
  error?: string | null
}

export const ProductList = ({ 
  products, 
  selectedProducts, 
  onProductSelect, 
  isLoading = false,
  error = null 
}: ProductListProps) => {
  const { t } = useTranslation('common')
  const { formatCurrency } = useFormatting()
  // 상품이 선택되었는지 확인하는 함수
  const isProductSelected = (productId: string) => {
    return selectedProducts.some(item => item.product.id === productId)
  }

  // 에러 상태
  if (error) {
    return (
      <div className="bg-white p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('products.notFound')}</h3>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            variant="danger"
            size="sm"
          >
{t('common.retry')}
          </Button>
        </div>
      </div>
    )
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="bg-white">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('products.title')}</h3>
        </div>
        <div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="py-4 px-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* 상품 목록 헤더 */}
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('products.title')} ({t('products.count', { count: products.length })})
        </h3>
      </div>

      {/* 상품 목록 */}
      <div className="pb-24"> {/* 하단 버튼 여백 */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8v2m0 0V5a2 2 0 012-2h2m-2 2a2 2 0 012 2v2M9 7h6" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-1">{t('products.empty')}</p>
          </div>
        ) : (
          <div>
            {products.map((product) => (
              <div 
                key={product.id} 
                className={`py-4 px-6 border-b border-gray-100 transition-colors ${
                  !product.isAvailable ? 'bg-gray-50' : 'hover:bg-gray-50'
                }`}
              >
                <label className="flex items-center space-x-3 cursor-pointer">
                  {/* 체크박스 */}
                  <input
                    type="checkbox"
                    checked={isProductSelected(product.id)}
                    onChange={(e) => onProductSelect(product, e.target.checked)}
                    disabled={!product.isAvailable}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50 flex-shrink-0"
                  />
                  
                  {/* 상품 이미지 */}
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center ${
                      !product.isAvailable ? 'opacity-50' : ''
                    }`}>
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* 상품 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-base font-medium ${
                        !product.isAvailable ? 'text-gray-400 line-through' : 'text-gray-900'
                      }`}>
                        {product.name}
                      </h4>
                      <span className={`text-lg font-semibold ml-4 ${
                        !product.isAvailable ? 'text-gray-400' : 'text-blue-600'
                      }`}>
                        {formatCurrency(product.price, product.currency)}
                      </span>
                    </div>
                    
                    {product.description && (
                      <p className={`text-sm mt-1 ${
                        !product.isAvailable ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {product.description}
                      </p>
                    )}
                    
                    {!product.isAvailable && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-200 text-gray-500 rounded">
{t('products.unavailable')}
                      </span>
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}