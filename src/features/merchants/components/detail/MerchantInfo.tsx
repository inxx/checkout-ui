import { StarRating } from '../shared/StarRating'
import type { Merchant } from '@/types'

interface MerchantInfoProps {
  merchant: Merchant
}

export const MerchantInfo = ({ merchant }: MerchantInfoProps) => {
  return (
    <div className="bg-white p-6">
      {/* 로고 및 기본 정보 */}
      <div className="flex items-start space-x-4 mb-4">
        {/* 로고 영역 */}
        <div className="flex-shrink-0">
          {merchant.logoUrl ? (
            <img 
              src={merchant.logoUrl} 
              alt={merchant.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">
                {merchant.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* 가맹점 정보 */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {merchant.name}
          </h2>
          <div className="flex items-center mb-2">
            <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {merchant.category}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              {merchant.distanceKm.toFixed(1)}km
            </span>
          </div>
          <StarRating rating={merchant.rating} />
        </div>
      </div>

      {/* 가맹점 설명 */}
      {merchant.description && (
        <div className="mb-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            {merchant.description}
          </p>
        </div>
      )}

      {/* 전화번호 */}
      {merchant.phone && (
        <div className="flex items-center">
          <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <a 
            href={`tel:${merchant.phone}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {merchant.phone}
          </a>
        </div>
      )}
    </div>
  )
}