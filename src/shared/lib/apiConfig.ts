import { authApi } from './fetchWrapper'
import { useAuthStore } from '@/features/auth/store'

// 인증된 API 인스턴스에 토큰 제공자 설정
export const setupApiAuth = () => {
  authApi.setTokenProvider(() => {
    const { token } = useAuthStore.getState()
    return token
  })
}

// 앱 시작 시 호출할 초기화 함수
export const initializeApi = () => {
  setupApiAuth()
}