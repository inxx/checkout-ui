import { StarRating } from '../shared/StarRating'
import type { Merchant } from '@/types'

interface MerchantCardProps {
  merchant: Merchant
  onClick: (merchant: Merchant) => void
}

export const MerchantCard = ({ merchant, onClick }: MerchantCardProps) => {
  return (
    <div 
      onClick={() => onClick(merchant)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* 이미지 영역 */}
      <div className="relative h-48 w-full">
        {merchant.logoUrl ? (
          <img 
            src={merchant.logoUrl} 
            alt={merchant.name}
            className="w-full h-full object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-t-lg flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">
                {merchant.name.charAt(0)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 정보 영역 */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{merchant.name}</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {merchant.category}
          </span>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <StarRating rating={merchant.rating} />
          
          <span className="text-sm text-gray-500">
            {merchant.distanceKm.toFixed(1)}km
          </span>
        </div>
      </div>
    </div>
  )
}