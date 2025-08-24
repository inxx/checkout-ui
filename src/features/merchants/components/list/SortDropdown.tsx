import { useTranslation } from 'react-i18next'
import type { SortOption } from '@/types'

interface SortDropdownProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

export const SortDropdown = ({ value, onChange }: SortDropdownProps) => {
  const { t } = useTranslation('common')

  const sortOptions = [
    { value: 'name' as const, label: t('merchants.sort.name') },
    { value: 'distance' as const, label: t('merchants.sort.distance') },
    { value: 'rating' as const, label: t('merchants.sort.rating') },
  ]
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="appearance-none w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}