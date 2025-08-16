import { CheckCircle, Circle, ArrowRight } from 'lucide-react'

interface RoadmapProps {
  content?: {
    title?: string
    description?: string
    showCtaButton?: boolean
    ctaButton?: {
      text?: string
      href?: string
    }
    roadmap?: Array<{
      title: string
      description: string
      date: string
      completed: boolean
    }>
  }
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

export const Roadmap = ({ content = {}, primaryColor, secondaryColor, accentColor }: RoadmapProps) => {
  const roadmap = content.roadmap || [
    { title: 'Phase 1: Launch', description: 'Initial token launch and community building', date: 'Q1 2024', completed: true },
    { title: 'Phase 2: Development', description: 'Core features and platform development', date: 'Q2 2024', completed: false },
    { title: 'Phase 3: Expansion', description: 'Partnerships and ecosystem growth', date: 'Q3 2024', completed: false }
  ]

  return (
    <section className="py-20 bg-black/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6 neon-text"
            style={{ color: primaryColor }}
          >
            {content.title || 'Roadmap'}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {content.description || 'Our journey to revolutionize the meme coin space'}
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full">
            <div 
              className="w-full h-full neon-glow"
              style={{ 
                background: `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor})`,
                boxShadow: `0 0 20px ${primaryColor}40`
              }}
            ></div>
          </div>

          <div className="space-y-12">
            {roadmap.map((item, index) => (
              <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Timeline Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center neon-glow ${
                      item.completed ? 'neon-pulse' : ''
                    }`}
                    style={{
                      background: item.completed 
                        ? `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                        : 'rgba(255, 255, 255, 0.2)',
                      boxShadow: item.completed 
                        ? `0 0 20px ${primaryColor}40`
                        : '0 0 10px rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    {item.completed ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Circle className="w-5 h-5 text-white" />
                    )}
                  </div>
                </div>

                {/* Content Card */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                  <div 
                    className="p-6 rounded-2xl neon-border transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      borderColor: item.completed ? primaryColor : 'rgba(255, 255, 255, 0.2)',
                      boxShadow: item.completed 
                        ? `0 0 20px ${primaryColor}20`
                        : '0 0 10px rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                      <span 
                        className="text-sm font-medium px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: item.completed 
                            ? `${primaryColor}20`
                            : 'rgba(255, 255, 255, 0.1)',
                          color: item.completed ? primaryColor : 'rgba(255, 255, 255, 0.7)'
                        }}
                      >
                        {item.date}
                      </span>
                    </div>
                    <p className="text-gray-300">{item.description}</p>
                    
                    {item.completed && (
                      <div className="flex items-center mt-4 text-sm">
                        <CheckCircle className="w-4 h-4 mr-2" style={{ color: primaryColor }} />
                        <span style={{ color: primaryColor }}>Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        {content.showCtaButton && (
          <div className="text-center mt-16">
            <button 
              className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 neon-glow hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                color: 'white',
                boxShadow: `0 0 20px ${primaryColor}40`
              }}
              onClick={() => {
                if (content.ctaButton?.href) {
                  window.open(content.ctaButton.href, '_blank')
                }
              }}
            >
              {content.ctaButton?.text || 'Join Our Journey'}
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
