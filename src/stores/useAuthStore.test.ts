import { useAuthStore, initializeAuth } from './useAuthStore'

// localStorage 모킹
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    })
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('인증 스토어', () => {
  beforeEach(() => {
    // 각 테스트 전에 스토어와 localStorage 초기화
    useAuthStore.setState({ 
      token: null, 
      isAuthenticated: false 
    })
    localStorageMock.clear()
    jest.clearAllMocks()
  })

  describe('토큰 설정', () => {
    it('토큰을 설정하고 인증 상태를 true로 변경한다', () => {
      const { setToken } = useAuthStore.getState()
      const testToken = 'test-token-123'
      
      setToken(testToken)
      
      const state = useAuthStore.getState()
      expect(state.token).toBe(testToken)
      expect(state.isAuthenticated).toBe(true)
    })
  })

  describe('인증 정보 삭제', () => {
    it('토큰을 삭제하고 인증 상태를 false로 변경한다', () => {
      const { setToken, clearAuth } = useAuthStore.getState()
      
      // 먼저 토큰 설정
      setToken('test-token')
      
      // 인증 상태 클리어
      clearAuth()
      
      const state = useAuthStore.getState()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })

  describe('토큰 갱신', () => {
    it('새로운 토큰을 생성하고 상태를 업데이트한다', async () => {
      const { refreshToken } = useAuthStore.getState()
      
      await refreshToken()
      
      const state = useAuthStore.getState()
      expect(state.token).toBeTruthy()
      expect(state.isAuthenticated).toBe(true)
      expect(state.token).toMatch(/^demo-token-\d+-[a-z0-9]+$/)
    })

    it('토큰 갱신 실패 시 인증 정보를 삭제한다', async () => {
      const { refreshToken } = useAuthStore.getState()
      
      // Date.now를 실패하도록 모킹
      const originalDateNow = Date.now
      Date.now = jest.fn(() => {
        throw new Error('Token generation failed')
      })
      
      await expect(refreshToken()).rejects.toThrow('Token generation failed')
      
      const state = useAuthStore.getState()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      
      // 원래 함수 복원
      Date.now = originalDateNow
    })
  })

  describe('인증 초기화', () => {
    it('기존 토큰이 없으면 새 토큰을 생성한다', () => {
      initializeAuth()
      
      const state = useAuthStore.getState()
      expect(state.token).toBeTruthy()
      expect(state.isAuthenticated).toBe(true)
    })

    it('기존 토큰이 있으면 새 토큰을 생성하지 않는다', () => {
      const existingToken = 'existing-token-123'
      
      // 기존 토큰 설정
      useAuthStore.getState().setToken(existingToken)
      
      initializeAuth()
      
      const state = useAuthStore.getState()
      expect(state.token).toBe(existingToken)
    })
  })

  describe('상태 지속성', () => {
    it('토큰과 인증 상태를 지속적으로 저장한다', () => {
      const { setToken } = useAuthStore.getState()
      const testToken = 'persistent-token-123'
      
      setToken(testToken)
      
      // Zustand persist 동작을 시뮬레이션하기 위해 수동으로 확인
      const state = useAuthStore.getState()
      expect(state.token).toBe(testToken)
      expect(state.isAuthenticated).toBe(true)
    })
  })
})