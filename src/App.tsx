import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Checkout UI
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">
              초기세팅 완료
            </p>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  )
}

export default App
