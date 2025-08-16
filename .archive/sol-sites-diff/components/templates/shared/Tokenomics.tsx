import { PieChart, TrendingUp, Lock, Users, Gift } from 'lucide-react'

interface TokenomicsProps {
  tokenSymbol: string
  totalSupply: string
  distribution: Array<{
    name: string
    percentage: number
    amount: string
    color: string
    description: string
  }>
  primaryColor: string
  secondaryColor: string
  accentColor: string
  className?: string
}

export const Tokenomics = ({
  tokenSymbol,
  totalSupply,
  distribution,
  primaryColor,
  secondaryColor,
  accentColor,
  className = ""
}: TokenomicsProps) => {
  return (
    <section className={`py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: primaryColor }}
          >
            {tokenSymbol} Tokenomics
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transparent token distribution designed for long-term growth and community rewards.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Chart */}
          <div className="relative">
            <div className="w-80 h-80 mx-auto relative">
              {/* Pie Chart Visualization */}
              <div className="w-full h-full rounded-full relative overflow-hidden">
                {distribution.map((item, index) => {
                  const startAngle = distribution
                    .slice(0, index)
                    .reduce((acc, curr) => acc + (curr.percentage * 3.6), 0)
                  const endAngle = startAngle + (item.percentage * 3.6)
                  
                  return (
                    <div
                      key={item.name}
                      className="absolute inset-0"
                      style={{
                        background: `conic-gradient(from ${startAngle}deg, ${item.color} 0deg, ${item.color} ${item.percentage * 3.6}deg, transparent ${item.percentage * 3.6}deg)`
                      }}
                    />
                  )
                })}
              </div>
              
              {/* Center Info */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">{totalSupply}</div>
                  <div className="text-sm text-gray-600">Total Supply</div>
                </div>
              </div>
            </div>
          </div>

          {/* Distribution Details */}
          <div className="space-y-6">
            {distribution.map((item, index) => (
              <div key={item.name} className="flex items-center space-x-4">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <span className="text-sm font-medium">{item.percentage}%</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{item.amount}</div>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-2xl" style={{ backgroundColor: `${primaryColor}05` }}>
            <Lock className="w-12 h-12 mx-auto mb-4" style={{ color: primaryColor }} />
            <h3 className="text-xl font-semibold mb-2">Liquidity Locked</h3>
            <p className="text-gray-600">Liquidity locked for maximum security</p>
          </div>
          <div className="text-center p-6 rounded-2xl" style={{ backgroundColor: `${secondaryColor}05` }}>
            <TrendingUp className="w-12 h-12 mx-auto mb-4" style={{ color: secondaryColor }} />
            <h3 className="text-xl font-semibold mb-2">Zero Tax</h3>
            <p className="text-gray-600">No buy or sell taxes</p>
          </div>
          <div className="text-center p-6 rounded-2xl" style={{ backgroundColor: `${accentColor}05` }}>
            <Gift className="w-12 h-12 mx-auto mb-4" style={{ color: accentColor }} />
            <h3 className="text-xl font-semibold mb-2">Community Rewards</h3>
            <p className="text-gray-600">Regular rewards for holders</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Default tokenomics for meme coins
export const defaultTokenomics = [
  {
    name: "Liquidity Pool",
    percentage: 40,
    amount: "400,000,000",
    color: "#3B82F6",
    description: "Locked liquidity for trading stability"
  },
  {
    name: "Community",
    percentage: 30,
    amount: "300,000,000",
    color: "#10B981",
    description: "Distributed to community members"
  },
  {
    name: "Marketing",
    percentage: 15,
    amount: "150,000,000",
    color: "#F59E0B",
    description: "Marketing and development funds"
  },
  {
    name: "Team",
    percentage: 10,
    amount: "100,000,000",
    color: "#EF4444",
    description: "Team allocation (vested)"
  },
  {
    name: "Reserve",
    percentage: 5,
    amount: "50,000,000",
    color: "#8B5CF6",
    description: "Emergency reserve fund"
  }
]
