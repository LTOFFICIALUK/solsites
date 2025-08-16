"use client"

import { ArrowRight, BarChart2, Twitter, Users } from "lucide-react"

interface CommunityProps {
  title?: string
  description?: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor?: string
  socials?: {
    twitter?: string
    telegram?: string
    discord?: string
    website?: string
  }
  // Optional cards to fully customize from editor blocks in the future
  cards?: Array<{
    icon?: React.ReactNode
    title: string
    description: string
    cta?: { text: string; href?: string }
  }>
}

export const Community = ({
  title = "Join the Community",
  description = "Be part of the viral movement behind PEPE. Connect with the community, track the trend, and join the conversation.",
  primaryColor,
  secondaryColor,
  accentColor,
  backgroundColor,
  socials,
  cards
}: CommunityProps) => {
  const defaultCards = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "X Community",
      description: "Join thousands of PEPE enthusiasts sharing memes, updates, and viral content.",
      cta: { text: "Join Community", href: socials?.twitter }
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "Live Trading",
      description: "Track price action and trading volume in real time on Dexscreener.",
      cta: { text: "View Chart", href: socials?.website }
    },
    {
      icon: <Twitter className="w-6 h-6" />,
      title: "Twitter Trend",
      description: "Follow the viral hashtag and see what everyone is saying about PEPE.",
      cta: { text: "See the Trend", href: socials?.twitter }
    }
  ]

  const renderCards = (cards && cards.length > 0 ? cards : defaultCards)

  return (
    <section className="py-20" id="community" style={{ backgroundColor: backgroundColor || '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: primaryColor }}>{title}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderCards.map((card, idx) => (
            <div key={idx} className="rounded-2xl bg-white border border-gray-200 p-6 classic-shadow">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{card.title}</h3>
              <p className="text-gray-600 mb-4">{card.description}</p>
              {card.cta?.text && (
                <a
                  href={card.cta.href}
                  target={card.cta.href ? "_blank" : undefined}
                  className="inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    color: "white"
                  }}
                >
                  {card.cta.text}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


