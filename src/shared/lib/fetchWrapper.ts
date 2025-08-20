// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

// Fetch 옵션 확장
export interface FetchOptions extends Omit<RequestInit, 'body'> {
  timeout?: number
  body?: any
  skipAuth?: boolean // 인증 스킵 옵션
}

// 토큰 제공자 함수 타입
export type TokenProvider = () => string | null

// 커스텀 에러 클래스
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message?: string
  ) {
    super(message || `HTTP ${status}: ${statusText}`)
    this.name = 'ApiError'
  }
}

class FetchWrapper {
  private baseURL: string
  private defaultTimeout: number
  private tokenProvider?: TokenProvider

  constructor(baseURL = '', timeout = 10000) {
    this.baseURL = baseURL
    this.defaultTimeout = timeout
  }

  // 토큰 제공자 설정
  setTokenProvider(provider: TokenProvider) {
    this.tokenProvider = provider
  }

  private getAuthHeaders(skipAuth?: boolean): HeadersInit {
    if (skipAuth || !this.tokenProvider) {
      return {}
    }

    const token = this.tokenProvider()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private buildUrl(endpoint: string): string {
    // endpoint가 이미 완전한 URL인 경우
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint
    }

    // baseURL이 없거나 빈 문자열인 경우
    if (!this.baseURL || this.baseURL === '') {
      // endpoint가 '/'로 시작하지 않으면 추가
      return endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    }

    // baseURL이 있는 경우
    const base = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    
    return `${base}${path}`
  }

  private async request<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { timeout = this.defaultTimeout, body, skipAuth, ...fetchOptions } = options

    // AbortController로 타임아웃 처리
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const url = this.buildUrl(endpoint)

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(skipAuth), // 토큰 자동 주입
          ...fetchOptions.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      })

      clearTimeout(timeoutId)

      // HTTP 에러 상태 체크
      if (!response.ok) {
        throw new ApiError(response.status, response.statusText)
      }

      // JSON 파싱
      const data = await response.json()
      return data
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof ApiError) {
        throw error
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('요청 시간이 초과되었습니다.')
        }
        throw new Error(`네트워크 오류: ${error.message}`)
      }

      throw new Error('알 수 없는 오류가 발생했습니다.')
    }
  }

  async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(
    endpoint: string,
    body?: any,
    options?: FetchOptions
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body })
  }

  async put<T>(
    endpoint: string,
    body?: any,
    options?: FetchOptions
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body })
  }

  async delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

// 기본 API 인스턴스 (토큰 없음)
export const api = new FetchWrapper()

// 인증된 API 인스턴스 (토큰 자동 주입)
export const authApi = new FetchWrapper()

// 유틸리티 함수
export const createApi = (baseURL?: string, timeout?: number) =>
  new FetchWrapper(baseURL, timeout)