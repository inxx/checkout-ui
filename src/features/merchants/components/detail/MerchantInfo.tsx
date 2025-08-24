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
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(merchant.rating) 
                    ? 'text-yellow-400' 
                    : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {merchant.rating.toFixed(1)}
            </span>
          </div>
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