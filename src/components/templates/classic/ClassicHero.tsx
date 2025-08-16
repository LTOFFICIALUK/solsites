import { ArrowRight, TrendingUp, Play, BarChart3 } from 'lucide-react'

interface ClassicHeroProps {
  title: string
  subtitle: string
  description: string
  tokenSymbol: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundImage?: string
  logo?: string
  // Comprehensive hero content
  showTokenPill?: boolean
  showStats?: boolean
  stats?: Array<{ value: string; label: string; color: string }>
  showPrimaryButton?: boolean
  primaryButton?: { text: string; href: string }
  showSecondaryButton?: boolean
  secondaryButton?: { text: string; href: string }
  showTokenVisual?: boolean
  tokenLogo?: string
  tokenPrice?: string
  priceChange?: string
  circulatingSupply?: string
  totalSupply?: string


}

export const ClassicHero = ({
  title,
  subtitle,
  description,
  tokenSymbol,
  primaryColor,
  secondaryColor,
  accentColor,
  backgroundImage,
  logo,
  // Comprehensive hero content
  showTokenPill = true,
  showStats = true,
  stats = [
    { value: '10K+', label: 'Holders', color: 'primary' },
    { value: '$2.5M', label: 'Market Cap', color: 'secondary' },
    { value: '$500K', label: '24h Volume', color: 'accent' }
  ],
  showPrimaryButton = true,
  primaryButton = { text: 'Buy Now', href: '' },
  showSecondaryButton = true,
  secondaryButton = { text: 'Watch Video', href: '' },
  showTokenVisual = true,
  tokenLogo,
  tokenPrice = '$0.0025',
  priceChange = '+15.2%',
  circulatingSupply = '800M',
  totalSupply = '1B',


}: ClassicHeroProps) => {
  const getColorByType = (colorType: string) => {
    switch (colorType) {
      case 'primary': return primaryColor
      case 'secondary': return secondaryColor
      case 'accent': return accentColor
      default: return primaryColor
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0">
        {backgroundImage ? (
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            <div className="absolute inset-0 bg-white/90"></div>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100"></div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left">
            {/* Token Pill */}
            {showTokenPill && (
              <div 
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-8"
                style={{ 
                  backgroundColor: `${primaryColor}10`,
                  color: primaryColor,
                  border: `1px solid ${primaryColor}20`
                }}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                {tokenSymbol} Token
              </div>
            )}

            {/* Main Content */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span>{title}</span>
              <span 
                className="block"
                style={{ color: primaryColor }}
              >
                {subtitle}
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              {description}
            </p>

            {/* Stats */}
            {showStats && (
              <div className="grid grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm classic-shadow">
                    <div className="text-2xl font-bold mb-1" style={{ color: getColorByType(stat.color) }}>{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {showPrimaryButton && (
                <button
                  className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 classic-hover flex items-center justify-center"
                  style={{
                    backgroundColor: primaryColor,
                    color: 'white',
                    boxShadow: `0 10px 30px ${primaryColor}30`
                  }}
                  onClick={() => primaryButton.href && window.open(primaryButton.href, '_blank')}
                >
                  {primaryButton.text}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              )}
              
              {showSecondaryButton && (
                <button 
                  className="px-8 py-4 rounded-xl font-semibold text-lg border-2 transition-all duration-300 hover:bg-gray-50 flex items-center justify-center"
                  onClick={() => secondaryButton.href && window.open(secondaryButton.href, '_blank')}
                >
                  <Play className="mr-2 w-5 h-5" />
                  {secondaryButton.text}
                </button>
              )}
            </div>
          </div>

          {/* Right Content - Token Visual */}
          {showTokenVisual && (
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 classic-shadow">
                {/* Token Logo */}
                <div className="text-center mb-8">
                  {tokenLogo ? (
                    <img src={tokenLogo} alt={`${tokenSymbol} Logo`} className="w-24 h-24 mx-auto mb-4 rounded-2xl" />
                  ) : (
                    <div 
                      className="w-24 h-24 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                      }}
                    >
                      <span className="text-white font-bold text-3xl">{tokenSymbol[0]}</span>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-gray-900">{tokenSymbol}</h3>
                  <p className="text-gray-600">Token</p>
                </div>

                {/* Price Chart Mockup */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Price</span>
                    <span className="text-lg font-bold" style={{ color: primaryColor }}>{tokenPrice}</span>
                  </div>
                  <div className="h-32 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">{priceChange}</span>
                    <span className="text-gray-600">24h Change</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
                  <div>
                    <div className="text-sm text-gray-600">Circulating</div>
                    <div className="font-semibold">{circulatingSupply}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Supply</div>
                    <div className="font-semibold">{totalSupply}</div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full classic-shadow" style={{ backgroundColor: primaryColor }}></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full classic-shadow" style={{ backgroundColor: secondaryColor }}></div>
            </div>
          )}
        </div>
      </div>


    </section>
  )
}
