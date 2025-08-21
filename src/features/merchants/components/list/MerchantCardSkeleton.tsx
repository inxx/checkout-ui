export const MerchantCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md animate-pulse">
      {/* 이미지 스켈레톤 */}
      <div className="h-48 w-full bg-gray-200 rounded-t-lg"></div>
      
      {/* 내용 스켈레톤 */}
      <div className="p-4">
        {/* 제목과 카테고리 */}
        <div className="flex justify-between items-start mb-2">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
        
        {/* 평점과 거리 */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center">
            <div className="flex space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="ml-1 h-4 bg-gray-200 rounded w-8"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    </div>
  )
}

interface MerchantListSkeletonProps {
  count?: number
}

export const MerchantListSkeleton = ({ count = 6 }: MerchantListSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <MerchantCardSkeleton key={index} />
      ))}
    </div>
  )
}