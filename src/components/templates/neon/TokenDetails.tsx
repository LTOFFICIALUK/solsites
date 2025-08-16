"use client"

import { Copy, TrendingUp, BarChart3 } from "lucide-react"

interface TokenDetailsProps {
  title?: string
  description?: string
  contractAddress?: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor?: string
  features?: Array<{ icon?: React.ReactNode; title: string; description: string }>
  totalSupply?: string
  distribution?: Array<{ name: string; percentage: number; amount: string; color: string; description: string }>
  ctaTitle?: string
  ctaDescription?: string
  ctaPrimary?: { text?: string; href?: string }
  ctaSecondary?: { text?: string; href?: string }
}

export const TokenDetails = ({
  title = "Token Details",
  description = "Join the viral sensation that's taking crypto by storm.",
  contractAddress = "0xPEPECONTRACT00000000000000000000000",
  primaryColor,
  secondaryColor,
  accentColor,
  backgroundColor,
  features,
  totalSupply,
  distribution,
  ctaTitle,
  ctaDescription,
  ctaPrimary,
  ctaSecondary
}: TokenDetailsProps) => {
  const defaultFeatures = [
    { title: "Fair Launch", description: "Community-driven launch with no team allocation. Everyone has an equal opportunity to participate.", icon: "💎" },
    { title: "Viral Momentum", description: "Riding the wave of the biggest meme waves across social media, with millions of views and growing community.", icon: "🔥" },
    { title: "Solana Network", description: "Built on Solana for fast, low-cost transactions. Perfect for the viral nature of this meme coin.", icon: "⚡" },
    { title: "Meme Power", description: "Capturing the zeitgeist of internet culture with authentic viral content and community engagement.", icon: "😄" }
  ]

  const items = features && features.length ? features : defaultFeatures

  const handleCopy = async () => {
    try { 
      await navigator.clipboard.writeText(contractAddress)
      // You could add a toast notification here
    } catch {}
  }

  return (
    <section className="py-20" id="token-details" style={{ backgroundColor: backgroundColor || '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: primaryColor }}>{title}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{description}</p>
        </div>

        {/* Contract Address Box - Enhanced */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="rounded-2xl p-8 text-white shadow-xl" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Contract Address</h3>
              <p className="text-white/80 text-sm">Copy the contract address to trade</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 mb-4">
              <code className="text-sm md:text-base break-all text-white font-mono">{contractAddress}</code>
            </div>
            <div className="text-center">
              <button 
                onClick={handleCopy} 
                className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200 flex items-center justify-center mx-auto space-x-2 hover:scale-105"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Address</span>
              </button>
            </div>
          </div>
        </div>

        {/* Token Distribution Chart */}
        {distribution && distribution.length > 0 && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
                Token Distribution
              </h3>
              {totalSupply && (
                <p className="text-lg text-gray-600">Total Supply: {totalSupply}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Distribution Chart */}
              <div className="space-y-4">
                {distribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <div>
                        <div className="font-semibold text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{item.percentage}%</div>
                      <div className="text-sm text-gray-600">{item.amount}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pie Chart Visualization */}
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {distribution.map((item, index) => {
                      const total = distribution.reduce((sum, d) => sum + d.percentage, 0)
                      const startAngle = distribution
                        .slice(0, index)
                        .reduce((sum, d) => sum + (d.percentage / total) * 360, 0)
                      const angle = (item.percentage / total) * 360
                      
                      const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180)
                      const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180)
                      const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180)
                      const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180)
                      
                      const largeArcFlag = angle > 180 ? 1 : 0
                      
                      return (
                        <path
                          key={index}
                          d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                          fill={item.color}
                          stroke="white"
                          strokeWidth="2"
                        />
                      )
                    })}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feature Cards - Enhanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {items.map((f, idx) => (
            <div key={idx} className="rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl" style={{ backgroundColor: `${primaryColor}15` }}>
                {f.icon || <span>🔥</span>}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Call-to-Action Section */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl p-8 text-white shadow-xl" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold mb-2">{ctaTitle || 'Ready to join the movement?'}</h3>
              <p className="text-white/80">{ctaDescription || 'Take action and be part of the viral phenomenon'}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={ctaPrimary?.href || '#'} className="px-8 py-4 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105">
                <BarChart3 className="w-5 h-5" />
                <span>{ctaPrimary?.text || 'View Chart'}</span>
              </a>
              <a href={ctaSecondary?.href || '#'} className="px-8 py-4 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105">
                <TrendingUp className="w-5 h-5" />
                <span>{ctaSecondary?.text || 'See the Trend'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


