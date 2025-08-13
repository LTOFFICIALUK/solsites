import { ArrowRight, TrendingUp, Play } from 'lucide-react'

interface MinimalHeroProps {
  title: string
  subtitle: string
  description: string
  tokenSymbol: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundImage?: string
  logo?: string
  onEdit?: {
    title?: (value: string) => void
    subtitle?: (value: string) => void
    description?: (value: string) => void
  }
}

export const MinimalHero = ({
  title,
  subtitle,
  description,
  tokenSymbol,
  primaryColor,
  secondaryColor,
  accentColor,
  backgroundImage,
  logo,
  onEdit
}: MinimalHeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0">
        {backgroundImage ? (
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            <div className="absolute inset-0 bg-white/95"></div>
          </div>
        ) : (
          <div className="w-full h-full bg-white"></div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div 
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-8"
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
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            {title}
            <span 
              className="block minimal-text-gradient"
            >
              {subtitle}
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 minimal-hover flex items-center justify-center"
              style={{
                backgroundColor: primaryColor,
                color: 'white'
              }}
            >
              Buy Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            
            <button className="px-8 py-4 rounded-lg font-semibold text-lg border border-gray-300 transition-all duration-300 hover:bg-gray-50 flex items-center justify-center">
              <Play className="mr-2 w-5 h-5" />
              Watch Video
            </button>
          </div>

          {/* Token Info */}
          <div className="bg-gray-50 rounded-2xl p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
              {logo ? (
                <img src={logo} alt={`${tokenSymbol} Logo`} className="w-16 h-16 mx-auto mb-4 rounded-xl" />
              ) : (
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                  }}
                >
                  <span className="text-white font-bold text-xl">{tokenSymbol[0]}</span>
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900">{tokenSymbol}</h3>
              <p className="text-gray-600">Token</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold mb-1" style={{ color: primaryColor }}>10K+</div>
                <div className="text-sm text-gray-600">Holders</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1" style={{ color: secondaryColor }}>$2.5M</div>
                <div className="text-sm text-gray-600">Market Cap</div>
              </div>
            </div>
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


interface MinimalHeroProps {
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
