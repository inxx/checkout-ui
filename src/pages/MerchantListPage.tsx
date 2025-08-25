import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SearchBar } from '../features/merchants/components/list/SearchBar'
import { SortDropdown } from '../features/merchants/components/list/SortDropdown'
import { MerchantCard } from '../features/merchants/components/list/MerchantCard'
import { MerchantListSkeleton } from '../features/merchants/components/list/MerchantCardSkeleton'
import { EmptyState } from '../features/merchants/components/shared/EmptyState'
import { LanguageSelector } from '../components/LanguageSelector'
import { Button } from '../components/Button'
import { useMerchants } from '../hooks/api'
import type { Merchant, SortOption } from '@/types'

export const MerchantListPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('common')
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
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {t('merchants.title')}
            </h1>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <div className="mx-auto px-6 py-8">

        {/* 검색 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t('merchants.search')}
          />
        </div>

        {/* 검색 결과 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-900">
              {searchQuery ? `'${searchQuery}' ${t('merchants.searchResult')}` : t('merchants.all')}
            </h2>
            {!isLoading && (
              <span className="text-gray-500 text-sm">
                ({t('merchants.count', { count: merchants.length })})
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
              title={t('common.error.title')}
              action={
                <Button onClick={() => window.location.reload()}>
                  {t('common.error.refresh')}
                </Button>
              }
            />
          ) : isLoading ? (
            <MerchantListSkeleton count={6} />
          ) : merchants.length === 0 ? (
            <EmptyState 
              title={searchQuery ? t('merchants.empty.noResults') : t('merchants.empty.noMerchants')}
              action={
                searchQuery ? (
                  <Button onClick={handleSearchReset}>
                    {t('merchants.empty.showAll')}
                  </Button>
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