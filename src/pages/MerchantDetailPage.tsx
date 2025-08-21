import { useParams } from 'react-router-dom'

export default function MerchantDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">
          가맹점 상세 - {id}
        </h1>
        <p className="text-gray-600 mt-4">
          가맹점 상세 페이지 구현 예정
        </p>
      </div>
    </div>
  )
}