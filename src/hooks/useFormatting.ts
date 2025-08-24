import { useTranslation } from 'react-i18next'

// 상수 분리
import { EXCHANGE_RATES } from '../shared/constants'

export const useFormatting = () => {
  const { i18n } = useTranslation()
  
  // 공통 로케일 로직 분리
  const getLocale = () => i18n.language === 'ko' ? 'ko-KR' : 'en-US'
  const isEnglish = () => i18n.language === 'en'

  const formatCurrency = (amount: number, currency = 'KRW'): string => {
    const locale = getLocale()
    
    // 영어 모드에서 KRW를 USD로 환산
    if (isEnglish() && currency === 'KRW') {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount / EXCHANGE_RATES.USD_TO_KRW)
    }
    
    const fractionDigits = currency === 'KRW' ? 0 : undefined
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: fractionDigits
    }).format(amount)
  }

  const formatNumber = (number: number): string => {
    return new Intl.NumberFormat(getLocale()).format(number)
  }

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat(getLocale(), {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return {
    formatCurrency,
    formatNumber,
    formatDate
  }
}