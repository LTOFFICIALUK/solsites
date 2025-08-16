import { ArrowRight, Play, TrendingUp } from 'lucide-react'

interface HeroProps {
  title: string
  subtitle: string
  description: string
  tokenSymbol: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundImage?: string
  showVideo?: boolean
  showStats?: boolean
  showTokenPill?: boolean
  showPrimaryButton?: boolean
  primaryButton?: { text: string; href: string }
  showSecondaryButton?: boolean
  secondaryButton?: { text: string; href: string }

  stats?: Array<{ value: string; label: string; color: string }> | {
    holders: string
    marketCap: string
    volume24h: string
  }
  ctaText?: string
  onCtaClick?: () => void
  className?: string

}

export const Hero = ({
  title,
  subtitle,
  description,
  tokenSymbol,
  primaryColor,
  secondaryColor,
  accentColor,
  backgroundImage,
  showVideo = false,
  showStats = false,
  showTokenPill = true,
  showPrimaryButton = true,
  primaryButton = { text: 'Buy Now', href: '' },
  showSecondaryButton = true,
  secondaryButton = { text: 'Watch Video', href: '' },

  stats,
  ctaText = "Buy Now",
  onCtaClick,
  className = "",

}: HeroProps) => {
  return (
    <section 
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}
      style={{
        background: backgroundImage 
          ? `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20), url(${backgroundImage})`
          : `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)`
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: primaryColor }}
        ></div>
        <div 
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: secondaryColor }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          {showTokenPill && (
            <div 
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-8"
              style={{ 
                backgroundColor: `${accentColor}20`,
                color: accentColor,
                border: `1px solid ${accentColor}40`
              }}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {tokenSymbol}
            </div>
          )}

          {/* Main Content */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="block">
              {title}
            </span>
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, var(--brand-primary, ${primaryColor}), var(--brand-secondary, ${secondaryColor}))`
              }}
            >
              {subtitle}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {showPrimaryButton && (
              <button
                onClick={() => primaryButton.href && window.open(primaryButton.href, '_blank')}
                className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                style={{
                  backgroundColor: primaryColor,
                  color: 'white',
                  boxShadow: `0 10px 30px ${primaryColor}40`
                }}
              >
                {primaryButton.text}
                <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </button>
            )}
            
            {showSecondaryButton && (
              <button 
                onClick={() => secondaryButton.href && window.open(secondaryButton.href, '_blank')}
                className="px-8 py-4 rounded-full font-semibold text-lg border-2 transition-all duration-300 hover:bg-gray-50"
              >
                <Play className="inline-block mr-2 w-5 h-5" />
                {secondaryButton.text}
              </button>
            )}
          </div>

          {/* Stats */}
          {showStats && stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              {Array.isArray(stats) ? (
                // Dynamic stats array with labels
                stats.map((stat, index) => {
                  const getColorByType = (colorType: string) => {
                    switch (colorType) {
                      case 'primary': return primaryColor
                      case 'secondary': return secondaryColor
                      case 'accent': return accentColor
                      default: return primaryColor
                    }
                  }
                  return (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold mb-2" style={{ color: getColorByType(stat.color) }}>
                        {stat.value}
                      </div>
                      <div className="text-gray-600">{stat.label}</div>
                    </div>
                  )
                })
              ) : (
                // Legacy stats object format
                <>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
                      {stats.holders}
                    </div>
                    <div className="text-gray-600">Holders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2" style={{ color: secondaryColor }}>
                      {stats.marketCap}
                    </div>
                    <div className="text-gray-600">Market Cap</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2" style={{ color: accentColor }}>
                      {stats.volume24h}
                    </div>
                    <div className="text-gray-600">24h Volume</div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>


    </section>
  )
}
