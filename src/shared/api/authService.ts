import { api, ApiResponse } from '@/shared/lib/fetchWrapper'

// API 응답 타입 정의
export interface TokenData {
  token: string
  expiresIn: number
  type: string
}

export type TokenResponse = ApiResponse<TokenData>

// 토큰 발급 API
export const requestToken = async (): Promise<string> => {
  try {
    const response = await api.post<TokenResponse>('/api/auth/token', null, {
      skipAuth: true // 토큰 발급 시에는 인증 헤더 불필요
    })
    
    if (response.success && response.data) {
      return response.data.token
    }
    
    throw new Error(response.error || '토큰 발급에 실패했습니다.')
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    
    throw new Error('토큰 발급 중 오류가 발생했습니다.')
  }
}