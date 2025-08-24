import type { Merchant, Product } from '@/features/merchants/types'

// 가맹점 목 데이터
export const mockMerchants: Merchant[] = [
  {
    id: '1',
    name: '스타벅스 강남점',
    category: '카페',
    distanceKm: 0.3,
    rating: 4.5,
    description: '프리미엄 커피와 다양한 음료를 제공하는 글로벌 커피 전문점입니다. 편안한 분위기에서 최고 품질의 커피를 즐기실 수 있습니다.',
    phone: '02-1234-5678',
    address: '서울특별시 강남구 테헤란로 123'
  },
  {
    id: '2', 
    name: '맥도날드 홍대점',
    category: '패스트푸드',
    distanceKm: 1.2,
    rating: 4.2,
    description: '세계적인 패스트푸드 브랜드로 다양한 햄버거와 치킨을 제공합니다.',
    phone: '02-2345-6789',
    address: '서울특별시 마포구 홍익로 234'
  },
  {
    id: '3',
    name: '롯데리아 신촌점', 
    category: '패스트푸드',
    distanceKm: 0.8,
    rating: 3.9,
    description: '한국 대표 패스트푸드 브랜드, 불고기버거로 유명합니다.',
    phone: '02-3456-7890',
    address: '서울특별시 서대문구 신촌로 345',
    paymentMethod: 'virtual_account'
  },
  {
    id: '4',
    name: '투썸플레이스 압구정점',
    category: '카페',
    distanceKm: 2.1,
    rating: 4.3,
    description: '프리미엄 디저트 카페, 케이크와 커피의 완벽한 조화를 제공합니다.',
    phone: '02-4567-8901',
    address: '서울특별시 강남구 압구정로 456'
  },
  {
    id: '5',
    name: '파리바게뜨 종로점',
    category: '베이커리',
    distanceKm: 1.5,
    rating: 4.1,
    description: '신선한 빵과 케이크를 매일 구워내는 프랑스 스타일 베이커리입니다.',
    phone: '02-5678-9012',
    address: '서울특별시 종로구 종로 567'
  },
  {
    id: '6',
    name: '버거킹 이태원점',
    category: '패스트푸드',
    distanceKm: 1.8,
    rating: 4.0,
    description: '와퍼로 유명한 글로벌 햄버거 전문점, 직화구이의 맛을 경험하세요.',
    phone: '02-6789-0123',
    address: '서울특별시 용산구 이태원로 678'
  },
  {
    id: '7',
    name: '이디야커피 신림점',
    category: '카페',
    distanceKm: 0.9,
    rating: 3.8,
    description: '합리적인 가격으로 즐기는 품질 좋은 커피와 음료를 제공합니다.',
    phone: '02-7890-1234',
    address: '서울특별시 관악구 신림로 789'
  },
  {
    id: '8',
    name: 'KFC 건대점',
    category: '패스트푸드',
    distanceKm: 2.3,
    rating: 4.1,
    description: '치킨 전문점의 원조, 비밀 레시피로 만든 오리지널 치킨을 맛보세요.',
    phone: '02-8901-2345',
    address: '서울특별시 광진구 능동로 890'
  },
  {
    id: '9',
    name: '던킨도너츠 명동점',
    category: '베이커리',
    distanceKm: 1.1,
    rating: 3.7,
    description: '50여 가지 도넛과 다양한 음료를 즐길 수 있는 글로벌 도넛 전문점입니다.',
    phone: '02-9012-3456',
    address: '서울특별시 중구 명동길 901'
  },
  {
    id: '10',
    name: '할리스커피 여의도점',
    category: '카페',
    distanceKm: 3.2,
    rating: 4.0,
    description: '한국 프리미엄 커피 브랜드, 엄선된 원두로 만든 특별한 커피를 제공합니다.',
    phone: '02-0123-4567',
    address: '서울특별시 영등포구 여의도동 123'
  },
  {
    id: '11',
    name: '피자헛 잠실점',
    category: '피자',
    distanceKm: 2.8,
    rating: 4.2,
    description: '다양한 토핑과 두꺼운 도우로 유명한 세계적인 피자 브랜드입니다.',
    phone: '02-1234-5678',
    address: '서울특별시 송파구 잠실로 234'
  },
  {
    id: '12',
    name: '도미노피자 송파점',
    category: '피자',
    distanceKm: 3.1,
    rating: 4.4,
    description: '30분 배달 약속으로 유명한 피자 전문점, 신선하고 빠른 배달 서비스를 제공합니다.',
    phone: '02-2345-6789',
    address: '서울특별시 송파구 송파대로 345'
  },
  {
    id: '13',
    name: '뚜레쥬르 서초점',
    category: '베이커리',
    distanceKm: 1.7,
    rating: 3.9,
    description: '프랑스 정통 제법으로 만든 빵과 케이크, 건강한 재료로 구워냅니다.',
    phone: '02-3456-7890',
    address: '서울특별시 서초구 서초대로 456'
  },
  {
    id: '14',
    name: '컴포즈커피 노원점',
    category: '카페',
    distanceKm: 4.1,
    rating: 3.6,
    description: '합리적인 가격의 테이크아웃 전문 커피점, 빠르고 간편하게 즐기는 커피.',
    phone: '02-4567-8901',
    address: '서울특별시 노원구 노원로 567'
  },
  {
    id: '15',
    name: '맘스터치 수유점',
    category: '패스트푸드',
    distanceKm: 3.8,
    rating: 4.3,
    description: '국산 재료를 사용한 프리미엄 수제버거 전문점, 건강하고 맛있는 버거를 제공합니다.',
    phone: '02-5678-9012',
    address: '서울특별시 강북구 수유로 678'
  },
  {
    id: '16',
    name: '베스킨라빈스 마포점',
    category: '디저트',
    distanceKm: 1.9,
    rating: 4.1,
    description: '31가지 맛 아이스크림으로 유명한 글로벌 아이스크림 전문점입니다.',
    phone: '02-6789-0123',
    address: '서울특별시 마포구 마포대로 789'
  },
  {
    id: '17',
    name: '파스쿠치 광화문점',
    category: '카페',
    distanceKm: 2.4,
    rating: 4.2,
    description: '이탈리아 정통 에스프레소와 다양한 커피 메뉴를 제공하는 프리미엄 카페입니다.',
    phone: '02-7890-1234',
    address: '서울특별시 종로구 세종대로 890'
  },
  {
    id: '18',
    name: '서브웨이 용산점',
    category: '패스트푸드',
    distanceKm: 1.6,
    rating: 3.8,
    description: '신선한 재료로 만드는 건강한 샌드위치 전문점, 개인 취향에 맞게 주문 가능합니다.',
    phone: '02-8901-2345',
    address: '서울특별시 용산구 한강대로 901'
  },
  {
    id: '19',
    name: '크리스피크림도넛 코엑스점',
    category: '디저트',
    distanceKm: 2.7,
    rating: 4.0,
    description: '글레이즈드 도넛으로 유명한 프리미엄 도넛 전문점, 갓 구운 따뜻한 도넛을 맛보세요.',
    phone: '02-9012-3456',
    address: '서울특별시 강남구 영동대로 123'
  },
  {
    id: '20',
    name: '카페베네 을지로점',
    category: '카페',
    distanceKm: 1.3,
    rating: 3.5,
    description: '편안한 분위기의 동네 카페, 다양한 음료와 디저트를 합리적인 가격에 제공합니다.',
    phone: '02-0123-4567',
    address: '서울특별시 중구 을지로 234'
  }
]

// 상품 목 데이터
export const mockProducts: Record<string, Product[]> = {
  '1': [
    { id: '1', name: '아메리카노', price: 4500, currency: 'KRW', description: '깔끔하고 진한 에스프레소의 맛', isAvailable: true, category: '커피' },
    { id: '2', name: '카페라떼', price: 5000, currency: 'KRW', description: '부드러운 우유와 에스프레소의 조화', isAvailable: true, category: '커피' },
    { id: '3', name: '바닐라 라떼', price: 5500, currency: 'KRW', description: '달콤한 바닐라 시럽이 들어간 라떼', isAvailable: false, category: '커피' },
    { id: '4', name: '프리미엄 원두 세트', price: 95000, currency: 'KRW', description: '엄선된 프리미엄 원두 1kg 세트', isAvailable: true, category: '원두' }
  ],
  '2': [],
  '3': [
    { id: '7', name: '불고기버거', price: 6200, currency: 'KRW', description: '한국식 불고기 패티가 들어간 대표 버거', isAvailable: true, category: '햄버거' },
    { id: '8', name: '새우버거', price: 6800, currency: 'KRW', description: '바삭한 새우 패티가 들어간 버거', isAvailable: true, category: '햄버거' },
    { id: '9', name: '치킨너겟', price: 3500, currency: 'KRW', description: '바삭한 치킨너겟 6조각', isAvailable: true, category: '치킨' }
  ],
  '4': [
    { id: '10', name: '아메리카노', price: 5200, currency: 'KRW', description: '진한 에스프레소의 깊은 맛', isAvailable: true, category: '커피' },
    { id: '11', name: '티라미수', price: 8500, currency: 'KRW', description: '이탈리아 정통 티라미수', isAvailable: true, category: '케이크' },
    { id: '12', name: '딸기 생크림 케이크', price: 9200, currency: 'KRW', description: '신선한 딸기와 부드러운 생크림', isAvailable: false, category: '케이크' }
  ],
  '5': [
    { id: '13', name: '크루아상', price: 2800, currency: 'KRW', description: '버터향 가득한 프랑스식 크루아상', isAvailable: true, category: '빵' },
    { id: '14', name: '단팥빵', price: 2200, currency: 'KRW', description: '달콤한 팥이 가득한 전통 빵', isAvailable: true, category: '빵' },
    { id: '15', name: '초콜릿 머핀', price: 3200, currency: 'KRW', description: '진한 초콜릿이 들어간 머핀', isAvailable: true, category: '머핀' }
  ],
  '6': [
    { id: '16', name: '와퍼', price: 7800, currency: 'KRW', description: '직화구이로 만든 대표 햄버거', isAvailable: true, category: '햄버거' },
    { id: '17', name: '치킨킹', price: 7200, currency: 'KRW', description: '바삭한 치킨 패티가 들어간 버거', isAvailable: true, category: '햄버거' },
    { id: '18', name: '어니언링', price: 3200, currency: 'KRW', description: '바삭한 양파링', isAvailable: true, category: '사이드' }
  ],
  '7': [
    { id: '19', name: '아메리카노', price: 2900, currency: 'KRW', description: '합리적 가격의 진한 커피', isAvailable: true, category: '커피' },
    { id: '20', name: '카페모카', price: 4200, currency: 'KRW', description: '달콤한 초콜릿이 들어간 모카', isAvailable: true, category: '커피' },
    { id: '21', name: '블루베리 머핀', price: 3800, currency: 'KRW', description: '신선한 블루베리가 들어간 머핀', isAvailable: true, category: '디저트' }
  ],
  '8': [
    { id: '22', name: '오리지널 치킨', price: 18900, currency: 'KRW', description: '11가지 허브와 향신료로 만든 오리지널 치킨', isAvailable: true, category: '치킨' },
    { id: '23', name: '징거버거', price: 6800, currency: 'KRW', description: '매콤한 징거 치킨이 들어간 버거', isAvailable: true, category: '햄버거' },
    { id: '24', name: '콜슬로', price: 2500, currency: 'KRW', description: '상큼한 양배추 샐러드', isAvailable: true, category: '사이드' }
  ],
  '9': [
    { id: '25', name: '오리지널 글레이즈드', price: 2200, currency: 'KRW', description: '부드러운 글레이즈가 입혀진 클래식 도넛', isAvailable: true, category: '도넛' },
    { id: '26', name: '초콜릿 프로스티드', price: 2800, currency: 'KRW', description: '진한 초콜릿 토핑이 올라간 도넛', isAvailable: true, category: '도넛' },
    { id: '27', name: '아이스 아메리카노', price: 3500, currency: 'KRW', description: '시원한 아이스 아메리카노', isAvailable: true, category: '음료' }
  ],
  '10': [
    { id: '28', name: '아메리카노', price: 4800, currency: 'KRW', description: '할리스만의 깊은 로스팅 아메리카노', isAvailable: true, category: '커피' },
    { id: '29', name: '바닐라 딜라이트', price: 6200, currency: 'KRW', description: '부드러운 바닐라 라떼', isAvailable: true, category: '커피' },
    { id: '30', name: '치즈케이크', price: 7800, currency: 'KRW', description: '진한 크림치즈로 만든 뉴욕 치즈케이크', isAvailable: false, category: '케이크' }
  ],
  '11': [
    { id: '31', name: '슈퍼 슈프림', price: 24900, currency: 'KRW', description: '다양한 토핑이 올라간 대표 피자', isAvailable: true, category: '피자' },
    { id: '32', name: '페퍼로니', price: 19900, currency: 'KRW', description: '매콤한 페퍼로니가 올라간 클래식 피자', isAvailable: true, category: '피자' },
    { id: '33', name: '치킨윙', price: 8900, currency: 'KRW', description: '바삭한 허니 갈릭 치킨윙', isAvailable: true, category: '사이드' }
  ],
  '12': [
    { id: '34', name: '더블크러스트 이베리코', price: 28900, currency: 'KRW', description: '프리미엄 이베리코 햄이 올라간 피자', isAvailable: true, category: '피자' },
    { id: '35', name: '불고기 피자', price: 22900, currency: 'KRW', description: '한국식 불고기가 올라간 피자', isAvailable: true, category: '피자' },
    { id: '36', name: '갈릭브레드', price: 5900, currency: 'KRW', description: '마늘 향이 가득한 브레드', isAvailable: true, category: '사이드' }
  ],
  '13': [
    { id: '37', name: '식빵', price: 3800, currency: 'KRW', description: '부드럽고 촉촉한 프리미엄 식빵', isAvailable: true, category: '빵' },
    { id: '38', name: '앙버터', price: 2800, currency: 'KRW', description: '달콤한 팥과 버터가 들어간 빵', isAvailable: true, category: '빵' },
    { id: '39', name: '마카롱', price: 3200, currency: 'KRW', description: '프랑스 정통 마카롱', isAvailable: true, category: '디저트' }
  ],
  '14': [
    { id: '40', name: '아메리카노', price: 1500, currency: 'KRW', description: '합리적 가격의 테이크아웃 커피', isAvailable: true, category: '커피' },
    { id: '41', name: '카페라떼', price: 2500, currency: 'KRW', description: '부드러운 우유가 들어간 라떼', isAvailable: true, category: '커피' },
    { id: '42', name: '아이스티', price: 2000, currency: 'KRW', description: '시원한 레몬 아이스티', isAvailable: true, category: '음료' }
  ],
  '15': [
    { id: '43', name: '싸이버거', price: 6900, currency: 'KRW', description: '국산 닭가슴살로 만든 수제 치킨버거', isAvailable: true, category: '햄버거' },
    { id: '44', name: '휠렛버거', price: 7200, currency: 'KRW', description: '촉촉한 치킨 필렛이 들어간 버거', isAvailable: true, category: '햄버거' },
    { id: '45', name: '치킨텐더', price: 4500, currency: 'KRW', description: '바삭한 치킨 텐더 3조각', isAvailable: true, category: '치킨' }
  ],
  '16': [
    { id: '46', name: '바닐라', price: 3800, currency: 'KRW', description: '클래식 바닐라 아이스크림', isAvailable: true, category: '아이스크림' },
    { id: '47', name: '초콜릿', price: 3800, currency: 'KRW', description: '진한 초콜릿 아이스크림', isAvailable: true, category: '아이스크림' },
    { id: '48', name: '민트 초콜릿 칩', price: 4200, currency: 'KRW', description: '상큼한 민트와 초콜릿 칩', isAvailable: false, category: '아이스크림' }
  ],
  '17': [
    { id: '49', name: '에스프레소', price: 3800, currency: 'KRW', description: '이탈리아 정통 에스프레소', isAvailable: true, category: '커피' },
    { id: '50', name: '카푸치노', price: 5200, currency: 'KRW', description: '진한 에스프레소와 부드러운 밀크폼', isAvailable: true, category: '커피' },
    { id: '51', name: '파니니', price: 7800, currency: 'KRW', description: '이탈리아식 따뜻한 샌드위치', isAvailable: true, category: '브런치' }
  ],
  '18': [
    { id: '52', name: 'BLT', price: 5900, currency: 'KRW', description: '베이컨, 양상추, 토마토가 들어간 샌드위치', isAvailable: true, category: '샌드위치' },
    { id: '53', name: '이탈리안 BMT', price: 6800, currency: 'KRW', description: '페퍼로니, 살라미, 햄이 들어간 샌드위치', isAvailable: true, category: '샌드위치' },
    { id: '54', name: '쿠키', price: 1500, currency: 'KRW', description: '바삭한 초콜릿칩 쿠키', isAvailable: true, category: '디저트' }
  ],
  '19': [
    { id: '55', name: '오리지널 글레이즈드', price: 2500, currency: 'KRW', description: '부드러운 글레이즈가 녹아내리는 시그니처 도넛', isAvailable: true, category: '도넛' },
    { id: '56', name: '초콜릿 글레이즈드', price: 2800, currency: 'KRW', description: '진한 초콜릿 글레이즈가 올라간 도넛', isAvailable: true, category: '도넛' },
    { id: '57', name: '커피', price: 3500, currency: 'KRW', description: '도넛과 잘 어울리는 블렌드 커피', isAvailable: true, category: '음료' }
  ],
  '20': [
    { id: '58', name: '아메리카노', price: 3200, currency: 'KRW', description: '편안한 분위기에서 즐기는 커피', isAvailable: true, category: '커피' },
    { id: '59', name: '와플', price: 5800, currency: 'KRW', description: '바삭한 벨기에 와플', isAvailable: true, category: '디저트' },
    { id: '60', name: '밀크티', price: 4500, currency: 'KRW', description: '부드러운 밀크가 들어간 홍차', isAvailable: true, category: '음료' }
  ]
}