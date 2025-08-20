import { http, HttpResponse } from 'msw'
import { generateToken } from '../lib/generateToken'

export const handlers = [
  // 토큰 발급 API
  http.post('/api/auth/token', async () => {
    // 실제 서버 응답 시뮬레이션 (지연 시간 포함)
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    const token = generateToken()
    
    return HttpResponse.json({
      success: true,
      data: {
        token,
        expiresIn: 3600, // 1시간
        type: 'Bearer'
      }
    }, {
      status: 200
    })
  })
]