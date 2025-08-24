import { useTranslation } from 'react-i18next'
import { Select } from './Select'

export const LanguageSelector = () => {
  const { i18n } = useTranslation()

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
  }

  return (
    <Select value={i18n.language} onChange={handleLanguageChange}>
      <option value="ko">한국어</option>
      <option value="en">English</option>
    </Select>
  )
}