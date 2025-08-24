import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useFormatting } from '../hooks/useFormatting'

interface PaymentResultState {
  paymentId: string
  status: string
  totalAmount: number
  merchantName: string
  message?: string
}

export default function PaymentFailedPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('common')
  const { formatCurrency } = useFormatting()
  const state = location.state as PaymentResultState | null

  useEffect(() => {
    if (!state) {
      navigate('/')
    }
  }, [state, navigate])

  if (!state) return null

  const { paymentId, totalAmount, merchantName, message } = state

  const handleRetry = () => {
    navigate(-1) // 결제 페이지로 돌아가기
  }

  const handleGoHome = () => {
    navigate('/')
  }

  const getFailureReason = () => {
    const reasons = [
      '카드 한도 초과',
      '잔액 부족',
      '카드 정보 오류',
      '네트워크 오류',
      '승인 거부'
    ]
    return message || reasons[Math.floor(Math.random() * reasons.length)]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <h1 className="text-lg font-semibold text-gray-900">{t('payment.failed.title')}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* 실패 아이콘 및 메시지 */}
        <div className="bg-white rounded-lg p-8 shadow-sm text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t('payment.failed.message')}</h2>
          <p className="text-gray-600 mb-4">{t('payment.failed.description')}</p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">{t('payment.failed.orderNumber')}</span>
              <span className="text-sm font-mono text-gray-900">{paymentId}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">{t('payment.failed.merchant')}</span>
              <span className="text-sm text-gray-900">{merchantName}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">{t('payment.failed.amount')}</span>
              <span className="text-sm text-gray-900">{formatCurrency(totalAmount, 'KRW')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t('payment.failed.reason')}</span>
              <span className="text-sm text-red-600 font-medium">{getFailureReason()}</span>
            </div>
          </div>
        </div>

        {/* 버튼들 */}
        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
{t('common.retry')}
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full py-3 px-4 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
{t('common.home')}
          </button>
        </div>

      </div>
    </div>
  )
}