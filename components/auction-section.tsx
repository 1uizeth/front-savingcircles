"use client"

interface AuctionSectionProps {
  userBid: number
  userWeight: number
  totalBids: number
  bidders: number
  maxBidders: number
  distribution: Array<{ address: string; amount: number; weight: number }>
}

export function AuctionSection({
  userBid,
  userWeight,
  totalBids,
  bidders,
  maxBidders,
  distribution,
}: AuctionSectionProps) {
  return (
    <div className="border-t-2 border-black">
      <div className="bg-gray-100 p-4 border-b-2 border-black">
        <h2 className="text-lg font-bold">AUCTION STATUS</h2>
      </div>

      {/* Primary metrics */}
      <div className="grid grid-cols-2 divide-x-2 divide-black border-b-2 border-black">
        <div className="p-6">
          <div className="text-sm mb-2">YOUR WEIGHT</div>
          <div className="text-5xl font-bold mb-2">{userWeight.toFixed(1)}%</div>
          <div className="text-sm">
            Your bid: {userBid} SCT ({userWeight.toFixed(1)}%)
          </div>
        </div>
        <div className="p-6">
          <div className="text-sm mb-2">TOTAL TOKENS</div>
          <div className="text-5xl font-bold mb-2">{totalBids}</div>
          <div className="text-sm">
            Bidders: {bidders}/{maxBidders} active
          </div>
        </div>
      </div>

      {/* Current distribution ranking */}
      <div className="p-6 pb-4 border-b-2 border-black">
        <div className="text-sm font-bold mb-4">CURRENT DISTRIBUTION</div>
        <div className="space-y-2">
          {distribution.map((entry, index) => (
            <div key={entry.address} className="flex items-center gap-4">
              <div className="w-20 text-sm font-bold">{entry.address === "YOU" ? "YOU" : `#${index + 1}`}</div>
              <div className="flex-1 h-8 border-2 border-black bg-white">
                <div
                  className={`h-full ${entry.address === "YOU" ? "bg-black" : "bg-gray-400"}`}
                  style={{ width: `${entry.weight}%` }}
                />
              </div>
              <div className="w-24 text-right">
                <div className="font-bold">{entry.weight.toFixed(0)}%</div>
                <div className="text-xs">{entry.amount} SCT</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
