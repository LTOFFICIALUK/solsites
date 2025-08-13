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
  stats?: {
    holders: string
    marketCap: string
    volume24h: string
  }
  ctaText?: string
  onCtaClick?: () => void
  className?: string
  onEdit?: {
    title?: (value: string) => void
    subtitle?: (value: string) => void
    description?: (value: string) => void
  }
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
  stats,
  ctaText = "Buy Now",
  onCtaClick,
  className = "",
  onEdit
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
          <div 
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-8"
            style={{ 
              backgroundColor: `${accentColor}20`,
              color: accentColor,
              border: `1px solid ${accentColor}40`
            }}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            {tokenSymbol} Token
          </div>

          {/* Main Content */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span
              className="block"
              contentEditable={!!onEdit?.title}
              suppressContentEditableWarning
              onBlur={(e) => onEdit?.title?.(e.currentTarget.textContent || '')}
            >
              {title}
            </span>
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, var(--brand-primary, ${primaryColor}), var(--brand-secondary, ${secondaryColor}))`
              }}
            >
              <span
                contentEditable={!!onEdit?.subtitle}
                suppressContentEditableWarning
                onBlur={(e) => onEdit?.subtitle?.(e.currentTarget.textContent || '')}
              >
                {subtitle}
              </span>
            </span>
          </h1>

          <p
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
            contentEditable={!!onEdit?.description}
            suppressContentEditableWarning
            onBlur={(e) => onEdit?.description?.(e.currentTarget.textContent || '')}
          >
            {description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={onCtaClick}
              className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
              style={{
                backgroundColor: primaryColor,
                color: 'white',
                boxShadow: `0 10px 30px ${primaryColor}40`
              }}
            >
              {ctaText}
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </button>
            
            {showVideo && (
              <button className="px-8 py-4 rounded-full font-semibold text-lg border-2 transition-all duration-300 hover:bg-gray-50">
                <Play className="inline-block mr-2 w-5 h-5" />
                Watch Video
              </button>
            )}
          </div>

          {/* Stats */}
          {showStats && stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
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
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div 
          className="w-6 h-10 rounded-full border-2 flex justify-center"
          style={{ borderColor: primaryColor }}
        >
          <div 
            className="w-1 h-3 rounded-full mt-2 animate-pulse"
            style={{ backgroundColor: primaryColor }}
          ></div>
        </div>
      </div>
    </section>
  )
}
