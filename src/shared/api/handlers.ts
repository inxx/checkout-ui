import { http, HttpResponse } from 'msw'
import { generateToken } from '../lib/generateToken'
import type { Merchant } from '@/features/merchants/types'

// 목 데이터 (logoUrl 제거하여 이미지 로드 문제 해결)
const mockMerchants: Merchant[] = [
  {
    id: '1',
    name: '스타벅스 강남점',
    category: '카페',
    distanceKm: 0.3,
    rating: 4.5,
  },
  {
    id: '2', 
    name: '맥도날드 홍대점',
    category: '패스트푸드',
    distanceKm: 1.2,
    rating: 4.2,
  },
  {
    id: '3',
    name: '롯데리아 신촌점', 
    category: '패스트푸드',
    distanceKm: 0.8,
    rating: 3.9,
  },
  {
    id: '4',
    name: '투썸플레이스 압구정점',
    category: '카페',
    distanceKm: 2.1,
    rating: 4.3,
  },
  {
    id: '5',
    name: '파리바게뜨 종로점',
    category: '베이커리',
    distanceKm: 1.5,
    rating: 4.1,
  },
  {
    id: '6',
    name: '버거킹 이태원점',
    category: '패스트푸드',
    distanceKm: 1.8,
    rating: 4.0,
  },
  {
    id: '7',
    name: '이디야커피 신림점',
    category: '카페',
    distanceKm: 0.9,
    rating: 3.8,
  },
  {
    id: '8',
    name: 'KFC 건대점',
    category: '패스트푸드',
    distanceKm: 2.3,
    rating: 4.1,
  },
  {
    id: '9',
    name: '던킨도너츠 명동점',
    category: '베이커리',
    distanceKm: 1.1,
    rating: 3.7,
  },
  {
    id: '10',
    name: '할리스커피 여의도점',
    category: '카페',
    distanceKm: 3.2,
    rating: 4.0,
  },
  {
    id: '11',
    name: '피자헛 잠실점',
    category: '피자',
    distanceKm: 2.8,
    rating: 4.2,
  },
  {
    id: '12',
    name: '도미노피자 송파점',
    category: '피자',
    distanceKm: 3.1,
    rating: 4.4,
  },
  {
    id: '13',
    name: '뚜레쥬르 서초점',
    category: '베이커리',
    distanceKm: 1.7,
    rating: 3.9,
  },
  {
    id: '14',
    name: '컴포즈커피 노원점',
    category: '카페',
    distanceKm: 4.1,
    rating: 3.6,
  },
  {
    id: '15',
    name: '맘스터치 수유점',
    category: '패스트푸드',
    distanceKm: 3.8,
    rating: 4.3,
  },
  {
    id: '16',
    name: '베스킨라빈스 마포점',
    category: '디저트',
    distanceKm: 1.9,
    rating: 4.1,
  },
  {
    id: '17',
    name: '파스쿠치 광화문점',
    category: '카페',
    distanceKm: 2.4,
    rating: 4.2,
  },
  {
    id: '18',
    name: '서브웨이 용산점',
    category: '패스트푸드',
    distanceKm: 1.6,
    rating: 3.8,
  },
  {
    id: '19',
    name: '크리스피크림도넛 코엑스점',
    category: '디저트',
    distanceKm: 2.7,
    rating: 4.0,
  },
  {
    id: '20',
    name: '카페베네 을지로점',
    category: '카페',
    distanceKm: 1.3,
    rating: 3.5,
  }
]

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
  http.get('/api/merchants/:id', async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    
    const { id } = params
    const merchant = mockMerchants.find(m => m.id === id)
    
    if (!merchant) {
      return HttpResponse.json(
        { error: '가맹점을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json(merchant)
  })
]