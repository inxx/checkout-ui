// 간단한 토큰 생성 함수 (데모용)
export const generateToken = (): string => {
  // 실제로는 서버에서 받아온 JWT 토큰을 사용
  // 데모용으로 간단한 토큰 생성
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  return `demo-token-${timestamp}-${random}`
}

// 토큰을 localStorage에 저장하고 가져오는 함수들
export const saveToken = (token: string): void => {
  localStorage.setItem('auth_token', token)
}

export const getToken = (): string | null => {
  return localStorage.getItem('auth_token')
}

export const removeToken = (): void => {
  localStorage.removeItem('auth_token')
}

// 토큰 재발급 함수
export const refreshToken = async (): Promise<string> => {
  try {
    // 실제로는 서버 API를 호출하여 토큰을 재발급 받음
    // 데모에서는 새로운 토큰을 생성
    const newToken = generateToken()
    saveToken(newToken)
    return newToken
  } catch (error) {
    console.error('[Token] Failed to refresh token:', error)
    throw error
  }
}

// 앱 시작시 토큰이 없으면 생성
export const initializeToken = (): void => {
  if (!getToken()) {
    const token = generateToken()
    saveToken(token)
  }
}