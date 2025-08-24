import { useAuthStore } from '../../stores/useAuthStore'

// API 헬퍼
const API_BASE = ''

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  
  // Zustand에서 토큰 가져오기
  const token = useAuthStore.getState().token
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, config)
  
  // 401 에러 시 토큰 재발급 시도
  if (response.status === 401) {
    console.log('[API] 401 detected, attempting token refresh...')
    try {
      await useAuthStore.getState().refreshToken()
      
      // 새 토큰으로 재시도
      const newToken = useAuthStore.getState().token
      const retryConfig: RequestInit = {
        ...config,
        headers: {
          ...config.headers,
          ...(newToken && { 'Authorization': `Bearer ${newToken}` }),
        },
      }
      
      const retryResponse = await fetch(url, retryConfig)
      if (!retryResponse.ok) {
        throw new Error(`API Error: ${retryResponse.status} ${retryResponse.statusText}`)
      }
      return retryResponse.json()
    } catch (refreshError) {
      console.error('[API] Token refresh failed, clearing auth:', refreshError)
      useAuthStore.getState().clearAuth()
      throw new Error('Authentication failed')
    }
  }
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

export const api = {
  get: <T>(endpoint: string) => fetchApi<T>(endpoint),
  post: <T>(endpoint: string, data?: any) => 
    fetchApi<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
}