import { Lock, TrendingUp, Gift } from 'lucide-react'

interface MinimalTokenomicsProps {
  tokenSymbol: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

export const MinimalTokenomics = ({
  tokenSymbol,
  primaryColor,
  secondaryColor,
  accentColor
}: MinimalTokenomicsProps) => {
  return (
    <section className="py-20 bg-gray-50" id="tokenomics">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: primaryColor }}
          >
            {tokenSymbol} Tokenomics
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transparent token distribution designed for long-term growth.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Chart */}
          <div className="relative">
            <div className="w-64 h-64 mx-auto relative">
              <div className="w-full h-full rounded-full relative overflow-hidden bg-gray-200">
                <div className="absolute inset-0 bg-blue-500" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)' }}></div>
                <div className="absolute inset-0 bg-green-500" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 0% 0%, 0% 50%)' }}></div>
                <div className="absolute inset-0 bg-yellow-500" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 0% 100%, 0% 50%)' }}></div>
              </div>
              
              {/* Center Info */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold mb-1">1B</div>
                  <div className="text-sm text-gray-600">Total Supply</div>
                </div>
              </div>
            </div>
          </div>

          {/* Distribution Details */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold">Liquidity Pool</h3>
                  <span className="text-sm font-medium">40%</span>
                </div>
                <p className="text-sm text-gray-500">Locked liquidity for trading stability</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold">Community</h3>
                  <span className="text-sm font-medium">30%</span>
                </div>
                <p className="text-sm text-gray-500">Distributed to community members</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold">Marketing</h3>
                  <span className="text-sm font-medium">15%</span>
                </div>
                <p className="text-sm text-gray-500">Marketing and development funds</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-xl bg-white minimal-shadow">
            <Lock className="w-8 h-8 mx-auto mb-4" style={{ color: primaryColor }} />
            <h3 className="text-lg font-semibold mb-2">Liquidity Locked</h3>
            <p className="text-gray-600 text-sm">Liquidity locked for maximum security</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-white minimal-shadow">
            <TrendingUp className="w-8 h-8 mx-auto mb-4" style={{ color: secondaryColor }} />
            <h3 className="text-lg font-semibold mb-2">Zero Tax</h3>
            <p className="text-gray-600 text-sm">No buy or sell taxes</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-white minimal-shadow">
            <Gift className="w-8 h-8 mx-auto mb-4" style={{ color: accentColor }} />
            <h3 className="text-lg font-semibold mb-2">Community Rewards</h3>
            <p className="text-gray-600 text-sm">Regular rewards for holders</p>
          </div>
        </div>
      </div>
    </section>
  )
}


