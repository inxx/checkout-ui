import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useFormatting } from '../hooks/useFormatting'

interface PaymentResultState {
  paymentId: string
  status: string
  totalAmount: number
  merchantName: string
}

export default function PaymentSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('common')
  const { formatCurrency, formatDate } = useFormatting()
  const state = location.state as PaymentResultState | null

  useEffect(() => {
    if (!state) {
      navigate('/')
    }
  }, [state, navigate])

  if (!state) return null

  const { paymentId, totalAmount, merchantName } = state

  const handleGoHome = () => {
    navigate('/')
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <h1 className="text-lg font-semibold text-gray-900">{t('payment.success.title')}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* 성공 아이콘 및 메시지 */}
        <div className="bg-white rounded-lg p-8 shadow-sm text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t('payment.success.message')}</h2>
          <p className="text-gray-600 mb-4">{t('payment.success.description')}</p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">{t('payment.success.orderNumber')}</span>
              <span className="text-sm font-mono text-gray-900">{paymentId}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">{t('payment.success.orderDate')}</span>
              <span className="text-sm text-gray-900">{formatDate(new Date())}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">{t('payment.success.merchant')}</span>
              <span className="text-sm text-gray-900">{merchantName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t('payment.success.amount')}</span>
              <span className="text-lg font-bold text-green-600">{formatCurrency(totalAmount, 'KRW')}</span>
            </div>
            
          </div>
        </div>

        {/* 버튼들 */}
        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
{t('common.home')}
          </button>
          
        </div>

      </div>
    </div>
  )
}