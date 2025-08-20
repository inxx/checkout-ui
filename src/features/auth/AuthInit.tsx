import { useEffect, useState } from 'react'
import { useAuthStore } from './store'
import { requestToken } from '@/shared/api/authService'

interface AuthInitProps {
  children: React.ReactNode
}

export const AuthInit = ({ children }: AuthInitProps) => {
  const { token, setToken, _hasHydrated } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeAuth = async () => {
      // Zustand persistence가 완료될 때까지 대기
      if (!_hasHydrated) {
        console.log('Waiting for hydration...')
        return
      }

      console.log('Hydration completed. Current token:', token ? token.substring(0, 8) + '...' : 'none')

      try {
        setError(null)
        
        // localStorage에서 불러온 토큰이 있으면 바로 사용
        if (token) {
          console.log('Using existing token from localStorage:', token.substring(0, 8) + '...')
          setIsLoading(false)
          return
        }

        console.log('No token found. Requesting new token...')
        
        // 토큰이 없으면 새로 발급
        const newToken = await requestToken()
        console.log('New token generated:', newToken.substring(0, 8) + '...')
        
        setToken(newToken)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '토큰 발급에 실패했습니다.'
        console.error('Token generation failed:', err)
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [token, setToken, _hasHydrated])

  // hydration이 완료되지 않았으면 로딩 상태
  if (!_hasHydrated || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">
            {!_hasHydrated ? '저장소 로딩 중...' : '인증 초기화 중...'}
          </span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => {
              setError(null)
              setIsLoading(true)
              // 강제로 토큰 재발급 시도
              requestToken()
                .then(setToken)
                .catch(err => {
                  setError(err instanceof Error ? err.message : '토큰 발급 실패')
                })
                .finally(() => setIsLoading(false))
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}