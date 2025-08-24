import { useTranslation } from 'react-i18next'
import { useFormatting } from '../../../../hooks/useFormatting'
import type { SelectedProduct } from '../types'

interface PurchaseButtonProps {
  selectedProducts: SelectedProduct[]
  onPurchase: () => void
  disabled?: boolean
}

export const PurchaseButton = ({ 
  selectedProducts, 
  onPurchase,
  disabled = false 
}: PurchaseButtonProps) => {
  const { t } = useTranslation('common')
  const { formatCurrency } = useFormatting()
  // 총 가격 계산
  const totalPrice = selectedProducts.reduce(
    (sum, item) => sum + (item.product.price * item.quantity), 
    0
  )

  // 선택된 상품 개수
  const totalItems = selectedProducts.reduce(
    (sum, item) => sum + item.quantity, 
    0
  )

  const hasSelectedProducts = selectedProducts.length > 0
  const isDisabled = disabled || !hasSelectedProducts

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
      <button
        onClick={onPurchase}
        disabled={isDisabled}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
          isDisabled
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-lg hover:shadow-xl'
        }`}
      >
        {disabled && hasSelectedProducts ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
{t('payment.processing')}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span>
{t('payment.purchase')}
              {hasSelectedProducts && (
                <span className="ml-2 text-sm">
                  ({t('products.count', { count: totalItems })})
                </span>
              )}
            </span>
            <span className="font-bold">
{hasSelectedProducts ? formatCurrency(totalPrice, 'KRW') : formatCurrency(0, 'KRW')}
            </span>
          </div>
        )}
      </button>
    </div>
  )
}