"use client"

interface AuctionSectionProps {
  userWeight: number
  userBid: number
  totalBids: number
  activeBidders: number
  distribution: Array<{
    rank: number
    isUser: boolean
    percentage: number
    amount: number
  }>
}

export function AuctionSection({ userWeight, userBid, totalBids, activeBidders, distribution }: AuctionSectionProps) {
  return (
    <div className="border-t-2 border-black">
      <div className="bg-white p-6 border-b-2 border-black">
        <h2 className="text-xl font-bold">AUCTION STATUS</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black border-b-2 border-black">
        <div className="p-8">
          <div className="text-sm mb-2">YOUR WEIGHT</div>
          <div className="text-6xl font-bold mb-2">{userWeight.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">
            Your bid: {userBid} SCT ({userWeight.toFixed(1)}%)
          </div>
        </div>
        <div className="p-8">
          <div className="text-sm mb-2">TOTAL BIDS</div>
          <div className="text-6xl font-bold mb-2">{totalBids}</div>
          <div className="text-sm text-gray-600">
            Bidders: {activeBidders}/{activeBidders} active
          </div>
        </div>
      </div>

      <div className="p-8">
        <h3 className="text-lg font-bold mb-6">CURRENT DISTRIBUTION</h3>
        <div className="space-y-4">
          {distribution.map((item) => (
            <div key={item.rank} className="flex items-center gap-4">
              <div className="w-12 text-sm font-bold">{item.isUser ? "YOU" : `#${item.rank}`}</div>
              <div className="flex-1 h-12 border-2 border-black bg-white overflow-hidden">
                <div
                  className={`h-full ${item.isUser ? "bg-black" : "bg-gray-400"}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <div className="w-24 text-right">
                <div className="text-lg font-bold">{item.percentage}%</div>
                <div className="text-xs text-gray-600">{item.amount} SCT</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
