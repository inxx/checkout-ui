interface EmptyStateProps {
  title?: string
  action?: React.ReactNode
}

export const EmptyState = ({ 
  title = "가맹점이 없습니다", 
  action 
}: EmptyStateProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
      <h3 className="text-lg font-medium text-gray-500 mb-4">{title}</h3>
      
      {action && (
        <div>{action}</div>
      )}
    </div>
  )
}