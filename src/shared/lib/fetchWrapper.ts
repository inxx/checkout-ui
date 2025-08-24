export interface ApiResponse<T = unknown> {
  data: T
  success: boolean
  message?: string
}

export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number>
}

export type TokenProvider = () => string | null | undefined

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

class FetchWrapper {
  private baseURL: string
  private tokenProvider?: TokenProvider
  private isRefreshing = false
  private refreshPromise: Promise<string> | null = null

  constructor(baseURL = '') {
    this.baseURL = baseURL
  }

  setTokenProvider(provider: TokenProvider) {
    this.tokenProvider = provider
  }

  private async request<T>(
    endpoint: string,
    options: FetchOptions = {},
    isRetry = false
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const { params, ...fetchOptions } = options

    console.log(`[API] ${fetchOptions.method || 'GET'} ${endpoint}`, isRetry ? '(retry)' : '')

    // URL에 쿼리 파라미터 추가
    let finalUrl = url
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value))
      })
      finalUrl = `${url}?${searchParams.toString()}`
    }

    // 헤더 설정
    const headers = new Headers(fetchOptions.headers)
    
    // 토큰이 있으면 Authorization 헤더에 추가
    if (this.tokenProvider) {
      const token = this.tokenProvider()
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
        console.log('[API] Using token:', token.substring(0, 20) + '...')
      }
    }

    // Content-Type 기본값 설정
    if (!headers.has('Content-Type') && fetchOptions.body) {
      headers.set('Content-Type', 'application/json')
    }

    const config: RequestInit = {
      ...fetchOptions,
      headers,
    }

    try {
      const response = await fetch(finalUrl, config)

      if (!response.ok) {
        console.log(`[API] Response error: ${response.status} ${response.statusText}`)
        
        // 401 Unauthorized 처리
        if (response.status === 401 && !isRetry && this.tokenProvider) {
          console.log('[API] 401 detected, attempting token refresh...')
          
          try {
            // 토큰 재발급 중이 아니라면 새로 시작
            if (!this.isRefreshing) {
              this.isRefreshing = true
              console.log('[API] Starting token refresh process')
              
              const { refreshToken } = await import('./generateToken')
              this.refreshPromise = refreshToken()
            }
            
            // 토큰 재발급 완료 대기
            await this.refreshPromise!
            console.log('[API] Token refresh completed, retrying request...')
            
            this.isRefreshing = false
            this.refreshPromise = null
            
            // 새로운 토큰으로 재시도
            return this.request<T>(endpoint, options, true)
          } catch (refreshError) {
            console.error('[API] Token refresh failed:', refreshError)
            this.isRefreshing = false
            this.refreshPromise = null
            
            // 토큰 재발급 실패 시 원래 에러 throw
            throw new ApiError(
              `HTTP error! status: ${response.status}`,
              response.status,
              response
            )
          }
        }
        
        throw new ApiError(
          `HTTP error! status: ${response.status}`,
          response.status,
          response
        )
      }

      // JSON 응답 파싱
      const data = await response.json()
      console.log(`[API] Success: ${fetchOptions.method || 'GET'} ${endpoint}`)
      return data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      console.error(`[API] Network error: ${endpoint}`, error)
      throw new ApiError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0
      )
    }
  }

  async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: unknown, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  async patch<T>(endpoint: string, data?: unknown, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }
}

// 기본 API 인스턴스 (토큰 없음)
export const api = new FetchWrapper()

// 인증이 필요한 API 인스턴스 (토큰 포함)
export const authApi = new FetchWrapper()

// API 인스턴스 생성 헬퍼
export const createApi = (baseURL?: string) => new FetchWrapper(baseURL)