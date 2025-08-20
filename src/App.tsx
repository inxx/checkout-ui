import { Providers } from '@/shared/lib/Providers'
import { useAuthStore } from '@/features/auth/store'

const AppContent = () => {
  const { token, isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">

        
        {/* 토큰 상태 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API 통신 토큰 상태</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="font-medium w-20">상태:</span>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  isAuthenticated 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {isAuthenticated ? '토큰 보유' : '토큰 없음'}
              </span>
            </div>
            
            <div className="flex items-start">
              <span className="font-medium w-20">토큰:</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all flex-1">
                {token || '없음'}
              </code>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function App() {
  return (
    <Providers>
      <AppContent />
    </Providers>
  )
}

export default App