import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

interface PaymentResultState {
  paymentId: string
  status: string
  totalAmount: number
  merchantName: string
}

export default function PaymentSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
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

  const handleGoBack = () => {
    navigate(-2) // 결제 페이지를 건너뛰고 상세 페이지로
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <h1 className="text-lg font-semibold text-gray-900">결제 완료</h1>
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
          <h2 className="text-xl font-bold text-gray-900 mb-2">결제가 완료되었습니다!</h2>
          <p className="text-gray-600 mb-4">주문이 성공적으로 처리되었습니다.</p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">주문 번호</span>
              <span className="text-sm font-mono text-gray-900">{paymentId}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">주문 일시</span>
              <span className="text-sm text-gray-900">{new Date().toLocaleString('ko-KR')}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">가맹점</span>
              <span className="text-sm text-gray-900">{merchantName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">주문 금액</span>
              <span className="text-lg font-bold text-green-600">{totalAmount.toLocaleString()}원</span>
            </div>
            
          </div>
        </div>

        {/* 버튼들 */}
        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            홈으로 가기
          </button>
          
        </div>

      </div>
    </div>
  )
}