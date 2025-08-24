import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  setToken: (token: string) => void
  clearAuth: () => void
  refreshToken: () => Promise<void>
}

// UUID 기반 가짜 토큰 생성
const generateToken = (): string => {
  return `demo-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      isAuthenticated: false,
      
      setToken: (token: string) => {
        console.log('[Auth Store] Setting token:', token.substring(0, 20) + '...')
        set({ 
          token, 
          isAuthenticated: true 
        })
      },
      
      clearAuth: () => {
        console.log('[Auth Store] Clearing auth state')
        set({ 
          token: null, 
          isAuthenticated: false 
        })
      },
      
      refreshToken: async () => {
        console.log('[Auth Store] Refreshing token...')
        try {
          // 가짜 토큰 재발급 (실제로는 API 호출)
          const newToken = generateToken()
          get().setToken(newToken)
          console.log('[Auth Store] Token refreshed successfully')
        } catch (error) {
          console.error('[Auth Store] Token refresh failed:', error)
          get().clearAuth()
          throw error
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, isAuthenticated: state.isAuthenticated })
    }
  )
)

// 앱 시작 시 토큰 초기화
export const initializeAuth = () => {
  const { token, setToken } = useAuthStore.getState()
  
  if (!token) {
    const newToken = generateToken()
    setToken(newToken)
    console.log('[Auth Store] Generated initial token')
  } else {
    console.log('[Auth Store] Using existing token')
  }
}