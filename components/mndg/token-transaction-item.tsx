interface TokenTransactionItemProps {
  amount: number
  type: "earned" | "spent"
  description: string
  timestamp: string
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

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex-1">
        <div className="font-bold text-sm mb-1">{description}</div>
        <div className="text-xs text-gray-500">{timestamp}</div>
      </div>
      <div className={`text-lg font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {isPositive ? "+" : "-"}
        {amount} MNDG
      </div>
    </div>
  )
}

export default TokenTransactionItem
