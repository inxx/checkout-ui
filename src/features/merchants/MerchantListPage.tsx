import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  SearchBar, 
  SortDropdown, 
  MerchantCard, 
  EmptyState, 
  MerchantListSkeleton,
} from './components'
import { useMerchants } from './hooks/useMerchants'
import type { Merchant, SortOption } from './types'

export const MerchantListPage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('name')
  
  // API 파라미터 메모이제이션
  const apiParams = useMemo(() => ({
    query: searchQuery.trim() || undefined,
    sort: sortBy,
  }), [searchQuery, sortBy])
  
  // React Query로 가맹점 목록 조회
  const { data: merchants = [], isLoading, error } = useMerchants(apiParams)

  const handleMerchantClick = (merchant: Merchant) => {
    navigate(`/merchants/${merchant.id}`)
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
          {error ? (
            <EmptyState 
              title="오류가 발생했습니다"
              description="가맹점 목록을 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
              action={
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  새로고침
                </button>
              }
            />
          ) : isLoading ? (
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

      
      </div>
    </div>
  )
}