"use client"

import { ArrowRight } from "lucide-react"

interface NeonHeroProps {
  title: string
  subtitle: string
  description: string
  tokenSymbol?: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundImage?: string
  logo?: string
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

export const NeonHero = ({
  title,
  subtitle,
  description,
  tokenSymbol,
  primaryColor,
  secondaryColor,
  accentColor,
  backgroundImage,
  logo,
  showTokenPill,
  showStats,
  stats,
  showPrimaryButton,
  primaryButton,
  showSecondaryButton,
  secondaryButton,
  showTokenVisual,
  tokenLogo,
  tokenPrice,
  priceChange,
  circulatingSupply,
  totalSupply
}: NeonHeroProps) => {
  return (
    <section className="relative overflow-hidden" style={{ 
      background: backgroundImage || `linear-gradient(180deg, ${primaryColor}, ${secondaryColor})`
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {showTokenVisual && (tokenLogo || logo) && (
            <img src={tokenLogo || logo} alt="token" className="w-28 h-28 rounded-2xl mx-auto mb-6 object-cover" />
          )}
          
          {showTokenPill && tokenSymbol && (
            <div className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <span className="text-white font-semibold">{tokenSymbol}</span>
            </div>
          )}
          
          <h1 className="text-white text-5xl md:text-6xl font-extrabold mb-2 drop-shadow neon-text">
            {title}
          </h1>
          <p className="text-white/90 text-2xl mb-6 drop-shadow">{subtitle}</p>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">{description}</p>

          {/* Token Price Display */}
          {tokenPrice && (
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="text-3xl font-bold text-white">${tokenPrice}</div>
              {priceChange && (
                <div className={`text-lg font-semibold ${priceChange.startsWith('-') ? 'text-red-400' : 'text-green-400'}`}>
                  {priceChange}
                </div>
              )}
            </div>
          )}

          {/* Token Stats */}
          {(circulatingSupply || totalSupply) && (
            <div className="flex justify-center gap-8 mb-8 text-white/80">
              {circulatingSupply && (
                <div>
                  <div className="text-sm">Circulating Supply</div>
                  <div className="font-semibold">{circulatingSupply}</div>
                </div>
              )}
              {totalSupply && (
                <div>
                  <div className="text-sm">Total Supply</div>
                  <div className="font-semibold">{totalSupply}</div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            {showPrimaryButton && primaryButton && (
              <a
                href={primaryButton.href}
                className="px-6 py-3 rounded-xl font-semibold text-white neon-glow"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}
              >
                {primaryButton.text}
                <ArrowRight className="w-4 h-4 inline ml-2" />
              </a>
            )}
            {showSecondaryButton && secondaryButton && (
              <a
                href={secondaryButton.href}
                className="px-6 py-3 rounded-xl font-semibold border-2 text-white/90 neon-border"
                style={{ borderColor: "white" }}
              >
                {secondaryButton.text}
              </a>
            )}
          </div>

          {showStats && stats && stats.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {stats.map((s, i) => (
                <div key={i} className="text-center rounded-xl py-4 px-6 neon-border" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-white/80 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          )}


        </div>
      </div>
    </section>
  )
}


