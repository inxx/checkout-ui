import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './queryClient'
import { AuthInit } from '@/features/auth/AuthInit'
import { initializeApi } from './apiConfig'

interface ProvidersProps {
  children: React.ReactNode
}

// API 설정 초기화 (한 번만 실행)
initializeApi()

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInit>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthInit>
    </QueryClientProvider>
  )
}