import { useState } from 'react'
import { 
  SearchBar, 
  SortDropdown, 
  MerchantCard, 
  EmptyState, 
  MerchantListSkeleton,
  SortOption 
} from './components'
import { Merchant } from './types'

export const MerchantListPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('name')
  
  // 임시 상태들 (나중에 API 연동 시 제거)
  const [isLoading] = useState(false)
  const [merchants] = useState<Merchant[]>([])

  const handleMerchantClick = (merchant: Merchant) => {
    console.log('가맹점 상세로 이동:', merchant.id)
    //TODO: 가맹점 상세 페이지로 라우팅
  }

  const handleSearchReset = () => {
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">가맹점 목록</h1>
        </div>

        {/* 검색 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="가맹점명 검색"
          />
        </div>

        {/* 검색 결과 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-900">
              {searchQuery ? `'${searchQuery}' 검색 결과` : '전체 가맹점'}
            </h2>
            {!isLoading && (
              <span className="text-gray-500 text-sm">
                ({merchants.length}개)
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-32">
              <SortDropdown 
                value={sortBy}
                onChange={setSortBy}
              />
            </div>
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="min-h-96">
          {isLoading ? (
            <MerchantListSkeleton count={6} />
          ) : merchants.length === 0 ? (
            <EmptyState 
              title={searchQuery ? "검색 결과가 없습니다" : "등록된 가맹점이 없습니다"}
              description={
                searchQuery 
                  ? "다른 검색어를 시도하거나 필터를 조정해보세요."
                  : "곧 다양한 가맹점이 추가될 예정입니다."
              }
              action={
                searchQuery ? (
                  <button
                    onClick={handleSearchReset}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    모든 가맹점 보기
                  </button>
                ) : undefined
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {merchants.map((merchant) => (
                <MerchantCard
                  key={merchant.id}
                  merchant={merchant}
                  onClick={handleMerchantClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* 페이지네이션 영역 (추후 구현) */}
        {merchants.length > 0 && (
          <div className="mt-12 flex justify-center">
            <div className="text-gray-500 text-sm">
              페이지네이션은 추후 구현 예정
            </div>
          </div>
        )}
      </div>
    </div>
  )
}