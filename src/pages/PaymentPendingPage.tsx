import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface PaymentResultState {
  paymentId: string
  status: string
  totalAmount: number
  merchantName: string
}

export default function PaymentPendingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [timeLeft, setTimeLeft] = useState(300) // 5분 = 300초
  const state = location.state as PaymentResultState | null

  useEffect(() => {
    if (!state) {
      navigate('/')
      return
    }

    // 5분 카운트다운 타이머
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // 시간 초과 시 실패 페이지로 이동
          navigate('/payment/result/declined', {
            state: {
              ...state,
              message: '결제 승인 시간이 초과되었습니다.'
            }
          })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // 임시로 30초 후 성공으로 처리 (실제로는 폴링으로 결제 상태 확인)
    const mockTimer = setTimeout(() => {
      clearInterval(timer)
      navigate('/payment/result/paid', { state })
    }, 30000)

    return () => {
      clearInterval(timer)
      clearTimeout(mockTimer)
    }
  }, [state, navigate])

  if (!state) return null

  const { paymentId, totalAmount, merchantName } = state

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleCancel = () => {
    navigate(-1) // 이전 페이지로 돌아가기
  }

  const handleCheckStatus = () => {
    // 실제로는 결제 상태 확인 API 호출
    // 임시로 랜덤 결과 생성
    const statuses = ['paid', 'declined']
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
    
    navigate(`/payment/result/${randomStatus}`, { state })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <h1 className="text-lg font-semibold text-gray-900">결제 처리 중</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* 대기 아이콘 및 메시지 */}
        <div className="bg-white rounded-lg p-8 shadow-sm text-center mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">결제 승인을 기다리고 있습니다</h2>
          <p className="text-gray-600 mb-4">잠시만 기다려 주세요. 결제가 처리 중입니다.</p>
          


          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">결제 번호</span>
              <span className="text-sm font-mono text-gray-900">{paymentId}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">가맹점</span>
              <span className="text-sm text-gray-900">{merchantName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">결제 금액</span>
              <span className="text-lg font-bold text-gray-900">{totalAmount.toLocaleString()}원</span>
            </div>
          </div>
        </div>
    
      </div>
    </div>
  )
}