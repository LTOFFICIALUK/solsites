import { Zap, Users, Target, Award } from 'lucide-react'

interface AboutProps {
  title: string
  description: string
  features: Array<{
    title: string
    description: string
    icon: React.ReactNode | string
  }>
  primaryColor: string
  secondaryColor: string
  accentColor: string
  className?: string
}

export const About = ({
  title,
  description,
  features,
  primaryColor,
  secondaryColor,
  accentColor,
  className = ""
}: AboutProps) => {
  return (
    <section className={`py-20 ${className}`}>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center p-6 rounded-2xl transition-all duration-300 hover:transform hover:scale-105"
              style={{
                backgroundColor: `${primaryColor}05`,
                border: `1px solid ${primaryColor}20`
              }}
            >
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: `${primaryColor}20`,
                  color: primaryColor
                }}
              >
                {typeof feature.icon === 'string' ? feature.icon : feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Default features for meme coins
export const defaultFeatures = [
  {
    title: "Community Driven",
    description: "Built by the community, for the community. Every holder has a voice.",
    icon: <Users className="w-8 h-8" />
  },
  {
    title: "Zero Tax",
    description: "No buy or sell taxes. Keep more of your profits.",
    icon: <Zap className="w-8 h-8" />
  },
  {
    title: "Liquidity Locked",
    description: "Liquidity locked for maximum security and trust.",
    icon: <Target className="w-8 h-8" />
  },
  {
    title: "Transparent",
    description: "Open source contract with full transparency.",
    icon: <Award className="w-8 h-8" />
  }
]
