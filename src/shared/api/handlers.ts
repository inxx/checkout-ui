import { http, HttpResponse } from 'msw'
import { generateToken } from '../lib/generateToken'
import { mockMerchants, mockProducts } from './mockData'

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
      
      // 랜덤하게 결제 결과 생성 (테스트용)
      const statuses = ['PAID', 'DECLINED', 'PENDING']
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      
      console.log(`[API Mock] Payment result: ${randomStatus}`)
      
      return HttpResponse.json({
        status: randomStatus
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