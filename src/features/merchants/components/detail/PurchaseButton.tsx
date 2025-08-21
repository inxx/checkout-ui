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
        <div className="flex items-center justify-between">
          <span>
            구매하기
            {hasSelectedProducts && (
              <span className="ml-2 text-sm">
                ({totalItems}개)
              </span>
            )}
          </span>
          <span className="font-bold">
            {hasSelectedProducts ? `${totalPrice.toLocaleString()}원` : '0원'}
          </span>
        </div>
      </button>
    </div>
  )
}