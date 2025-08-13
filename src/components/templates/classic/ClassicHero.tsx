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
  logo
}: ClassicHeroProps) => {
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
            {/* Badge */}
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

            {/* Main Content */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {title}
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
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm classic-shadow">
                <div className="text-2xl font-bold mb-1" style={{ color: primaryColor }}>10K+</div>
                <div className="text-sm text-gray-600">Holders</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm classic-shadow">
                <div className="text-2xl font-bold mb-1" style={{ color: secondaryColor }}>$2.5M</div>
                <div className="text-sm text-gray-600">Market Cap</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm classic-shadow">
                <div className="text-2xl font-bold mb-1" style={{ color: accentColor }}>$500K</div>
                <div className="text-sm text-gray-600">24h Volume</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 classic-hover flex items-center justify-center"
                style={{
                  backgroundColor: primaryColor,
                  color: 'white',
                  boxShadow: `0 10px 30px ${primaryColor}30`
                }}
              >
                Buy Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              
              <button className="px-8 py-4 rounded-xl font-semibold text-lg border-2 transition-all duration-300 hover:bg-gray-50 flex items-center justify-center">
                <Play className="mr-2 w-5 h-5" />
                Watch Video
              </button>
            </div>
          </div>

          {/* Right Content - Token Visual */}
          <div className="relative">
            <div className="bg-white rounded-3xl p-8 classic-shadow">
              {/* Token Logo */}
              <div className="text-center mb-8">
                {logo ? (
                  <img src={logo} alt={`${tokenSymbol} Logo`} className="w-24 h-24 mx-auto mb-4 rounded-2xl" />
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
                  <span className="text-lg font-bold" style={{ color: primaryColor }}>$0.0025</span>
                </div>
                <div className="h-32 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">+15.2%</span>
                  <span className="text-gray-600">24h Change</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <div className="text-sm text-gray-600">Circulating</div>
                  <div className="font-semibold">800M</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Supply</div>
                  <div className="font-semibold">1B</div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full classic-shadow" style={{ backgroundColor: primaryColor }}></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full classic-shadow" style={{ backgroundColor: secondaryColor }}></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500 mb-2">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 flex justify-center" style={{ borderColor: primaryColor }}>
            <div 
              className="w-1 h-3 rounded-full mt-2 animate-bounce"
              style={{ backgroundColor: primaryColor }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  )
}
