"use client"

import { CheckCircle, Circle } from 'lucide-react'

interface MinimalRoadmapProps {
  primaryColor: string
  secondaryColor: string
  accentColor: string
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
}

export function MinimalRoadmap({ primaryColor, secondaryColor, accentColor, content = {} }: MinimalRoadmapProps) {
  const roadmap = content.roadmap || [
    { title: 'Phase 1: Launch', description: 'Initial token launch and community building', date: 'Q1 2024', completed: true },
    { title: 'Phase 2: Development', description: 'Core features and platform development', date: 'Q2 2024', completed: false },
    { title: 'Phase 3: Expansion', description: 'Partnerships and ecosystem growth', date: 'Q3 2024', completed: false }
  ]

  return (
    <section className="py-20 bg-gray-50" id="roadmap">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: primaryColor }}
          >
            {content.title || 'Roadmap'}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {content.description || 'Our journey to building the future of decentralized finance.'}
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-300"></div>

          <div className="space-y-12">
            {roadmap.map((item, index) => (
              <div key={index} className="relative">
                {/* Timeline Item */}
                <div className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 
                          className="text-xl font-semibold"
                          style={{ color: primaryColor }}
                        >
                          {item.title}
                        </h3>
                        <span className="text-sm text-gray-500 font-medium">
                          {item.date}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="w-2/12 flex justify-center">
                    <div className="relative">
                      <div 
                        className="w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center"
                        style={{ backgroundColor: item.completed ? primaryColor : secondaryColor }}
                      >
                        {item.completed ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <Circle className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Empty space for alignment */}
                  <div className="w-5/12"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 bg-white px-6 py-3 rounded-full shadow-md">
            <span className="text-sm font-medium text-gray-600">Progress:</span>
            <div className="flex items-center space-x-2">
              <span 
                className="text-lg font-bold"
                style={{ color: primaryColor }}
              >
                {roadmap.filter(item => item.completed).length}
              </span>
              <span className="text-gray-500">/</span>
              <span className="text-lg font-bold text-gray-700">
                {roadmap.length}
              </span>
            </div>
            <span className="text-sm text-gray-500">milestones completed</span>
          </div>
        </div>

        {/* CTA Button */}
        {content.showCtaButton && (
          <div className="text-center mt-8">
            <button 
              className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                color: 'white'
              }}
              onClick={() => {
                if (content.ctaButton?.href) {
                  window.open(content.ctaButton.href, '_blank')
                }
              }}
            >
              {content.ctaButton?.text || 'Join Our Journey'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
