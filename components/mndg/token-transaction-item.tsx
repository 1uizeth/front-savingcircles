interface TokenTransactionItemProps {
  amount: number
  type: "earned" | "spent"
  description: string
  timestamp: Date
  className?: string
}

export function TokenTransactionItem({
  amount,
  type,
  description,
  timestamp,
  className = "",
}: TokenTransactionItemProps) {
  const isPositive = type === "earned"

  // Format timestamp
  const now = new Date()
  const diffMs = now.getTime() - timestamp.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  let timeString = ""
  if (diffDays > 0) {
    timeString = `${diffDays}d ago`
  } else if (diffHours > 0) {
    timeString = `${diffHours}h ago`
  } else {
    timeString = "Just now"
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex-1">
        <div className="font-bold text-sm mb-1">{description}</div>
        <div className="text-xs text-gray-500">{timeString}</div>
      </div>
      <div className={`text-lg font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {isPositive ? "+" : "-"}
        {amount} MNDG
      </div>
    </div>
  )
}

export default TokenTransactionItem
