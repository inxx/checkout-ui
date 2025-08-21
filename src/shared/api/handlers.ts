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
  })
]