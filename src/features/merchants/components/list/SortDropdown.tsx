import { useTranslation } from 'react-i18next'
import { Select } from '../../../../components/Select'
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
    <Select 
      value={value} 
      onChange={(val) => onChange(val as SortOption)}
      className="w-32"
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  )
}