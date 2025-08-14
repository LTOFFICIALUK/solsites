import { Lock, TrendingUp, Gift } from 'lucide-react'

interface ClassicTokenomicsProps {
  title: string
  description: string
  totalSupply: string
  distribution: Array<{
    name: string
    percentage: number
    color: string
  }>
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

export const ClassicTokenomics = ({
  title,
  description,
  totalSupply,
  distribution,
  primaryColor,
  secondaryColor,
  accentColor
}: ClassicTokenomicsProps) => {
  return (
    <section className="py-20 bg-gray-50" id="tokenomics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: primaryColor }}
          >
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Chart */}
          <div className="relative">
            <div className="w-80 h-80 mx-auto relative">
              <div className="w-full h-full rounded-full relative overflow-hidden bg-gray-200">
                <div className="absolute inset-0 bg-blue-500" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)' }}></div>
                <div className="absolute inset-0 bg-green-500" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 0% 0%, 0% 50%)' }}></div>
                <div className="absolute inset-0 bg-yellow-500" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 0% 100%, 0% 50%)' }}></div>
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
              <div key={index} className="flex items-center space-x-4">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <span className="text-sm font-medium">{item.percentage}%</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {Math.round((parseInt(totalSupply.replace(/[^\d]/g, '')) * item.percentage) / 100).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">{item.name} allocation</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-2xl bg-white classic-shadow">
            <Lock className="w-12 h-12 mx-auto mb-4" style={{ color: primaryColor }} />
            <h3 className="text-xl font-semibold mb-2">Liquidity Locked</h3>
            <p className="text-gray-600">Liquidity locked for maximum security</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white classic-shadow">
            <TrendingUp className="w-12 h-12 mx-auto mb-4" style={{ color: secondaryColor }} />
            <h3 className="text-xl font-semibold mb-2">Zero Tax</h3>
            <p className="text-gray-600">No buy or sell taxes</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white classic-shadow">
            <Gift className="w-12 h-12 mx-auto mb-4" style={{ color: accentColor }} />
            <h3 className="text-xl font-semibold mb-2">Community Rewards</h3>
            <p className="text-gray-600">Regular rewards for holders</p>
          </div>
        </div>
      </div>
    </section>
  )
}
