import { http, HttpResponse } from 'msw'
import { generateToken } from '../lib/generateToken'
import { mockMerchants, mockProducts } from './mockData'
import { EXCHANGE_RATES, PAYMENT_LIMITS } from '../constants'

export const handlers = [
  // 토큰 발급 API
  http.post('/api/auth/token', async () => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    const token = generateToken()
    
    return HttpResponse.json({
      success: true,
      data: {
        token,
        expiresIn: 3600,
        type: 'Bearer'
      }
    }, {
      status: 200
    })
  }),

  // 가맹점 목록 조회 API
  http.get('/api/merchants', async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    // 인증 토큰 확인
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }
    
    const url = new URL(request.url)
    const query = url.searchParams.get('query')?.toLowerCase()
    const sort = url.searchParams.get('sort') || 'name'
    
    let filteredMerchants = [...mockMerchants]
    
    // 검색 필터링 (가맹점명만)
    if (query) {
      filteredMerchants = filteredMerchants.filter(merchant => 
        merchant.name.toLowerCase().includes(query)
      )
    }
    
    // 정렬
    filteredMerchants.sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'rating':
          return b.rating - a.rating
        case 'distance':
          return a.distanceKm - b.distanceKm
        default:
          return 0
      }
    })
    
    return HttpResponse.json(filteredMerchants)
  }),

  // 가맹점 상세 조회 API
  http.get('/api/merchants/:id', async ({ request, params }) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    
    // 인증 토큰 확인
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }
    
    const { id } = params
    const merchant = mockMerchants.find(m => m.id === id)
    
    if (!merchant) {
      return HttpResponse.json(
        { error: '가맹점을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json(merchant)
  }),

  // 가맹점 상품 목록 조회 API
  http.get('/api/merchants/:id/items', async ({ request, params }) => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    
    // 인증 토큰 확인
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }
    
    const { id } = params
    const products = mockProducts[id as string] || []
    
    return HttpResponse.json(products)
  }),

  // 결제 요청 API
  http.post('/api/orders', async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    console.log('[API Mock] Processing payment request...')
    
    // 인증 토큰 확인
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[API Mock] Payment request failed: No auth token')
      return HttpResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }
    
    try {
      const body = await request.json()
      console.log('[API Mock] Payment request body:', body)
      
      const { merchantId, currency, amount } = body
      
      // 필수 필드 검증
      if (!merchantId || !currency || !amount) {
        console.log('[API Mock] Payment request failed: Missing required fields')
        return HttpResponse.json(
          { error: '필수 필드가 누락되었습니다.' },
          { status: 400 }
        )
      }
      
      // 가맹점별 결제 방식 및 금액 기반 결제 처리 로직
      let paymentStatus: string
      
      if (amount <= 0) {
        return HttpResponse.json(
          { error: '잘못된 결제 금액입니다.' },
          { status: 422 }
        )
      }
      
      // 가맹점 정보 조회
      const merchant = mockMerchants.find(m => m.id === merchantId)
      
      if (!merchant) {
        return HttpResponse.json(
          { error: '존재하지 않는 가맹점입니다.' },
          { status: 404 }
        )
      }
      
      // 통화별 한도 계산 (KRW 기준으로 변환)
      let amountInKRW = amount
      if (currency === 'USD') {
        amountInKRW = amount * EXCHANGE_RATES.USD_TO_KRW
      }
      
      // 가상계좌 전용 가맹점인 경우 무조건 PENDING
      if (merchant.paymentMethod === 'virtual_account') {
        paymentStatus = 'PENDING'
        console.log(`[API Mock] Payment PENDING - Virtual account merchant: ${merchant.name}`)
      } else if (amountInKRW >= PAYMENT_LIMITS.MAX_AMOUNT_KRW) {
        paymentStatus = 'DECLINED' // 한도 초과
        console.log(`[API Mock] Payment DECLINED - Amount over limit: ${amountInKRW} KRW (${amount} ${currency})`)
      } else {
        paymentStatus = 'PAID' // 일반 카드 결제 성공
        console.log(`[API Mock] Payment PAID - Card payment: ${amountInKRW} KRW (${amount} ${currency}) at ${merchant.name}`)
      }
      
      return HttpResponse.json({
        status: paymentStatus
      })
    } catch (error) {
      console.error('[API Mock] Payment request error:', error)
      return HttpResponse.json(
        { error: '요청 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }
  })
]