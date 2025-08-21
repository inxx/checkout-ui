import { Merchant } from '../types'

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
        {merchant.imageUrl ? (
          <img 
            src={merchant.imageUrl} 
            alt={merchant.name}
            className="w-full h-full object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-t-lg flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}
        
        {/* 영업상태 배지 */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            merchant.isOpen 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {merchant.isOpen ? '영업중' : '영업종료'}
          </span>
        </div>
      </div>

      {/* 정보 영역 */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{merchant.name}</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {merchant.category}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{merchant.description}</p>
        
        <div className="flex items-center mb-2">
          <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-gray-600 text-sm truncate">{merchant.address}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(merchant.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-sm text-gray-600">
                {merchant.rating.toFixed(1)} ({merchant.reviewCount})
              </span>
            </div>
          </div>
          
          {merchant.distance && (
            <span className="text-sm text-gray-500">
              {merchant.distance > 1000 
                ? `${(merchant.distance / 1000).toFixed(1)}km`
                : `${merchant.distance}m`
              }
            </span>
          )}
        </div>

        {merchant.openingHours && (
          <div className="mt-2 text-xs text-gray-500">
            {merchant.openingHours}
          </div>
        )}
      </div>
    </div>
  )
}