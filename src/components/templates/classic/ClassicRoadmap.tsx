import { CheckCircle, Circle, ArrowRight } from 'lucide-react'

interface ClassicRoadmapProps {
  title: string
  description: string
  phases: Array<{
    title: string
    description: string
    date: string
    completed: boolean
  }>
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

export const ClassicRoadmap = ({ title, description, phases, primaryColor, secondaryColor, accentColor }: ClassicRoadmapProps) => {
  return (
    <section className="py-20 bg-white" id="roadmap">
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

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200"></div>
          <div className="space-y-12">
            {phases.map((item, index) => (
              <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.completed ? '' : ''
                    }`}
                    style={{
                      background: item.completed ? primaryColor : 'white',
                      border: `2px solid ${item.completed ? primaryColor : '#e5e7eb'}`
                    }}
                  >
                    {item.completed ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                  <div className="p-6 rounded-2xl classic-hover bg-white classic-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                      <span 
                        className="text-sm font-medium px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: item.completed 
                            ? `${primaryColor}20`
                            : '#f3f4f6',
                          color: item.completed ? primaryColor : '#6b7280'
                        }}
                      >
                        {item.date}
                      </span>
                    </div>
                    <p className="text-gray-600">{item.description}</p>
                    
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

        <div className="text-center mt-16">
          <button 
            className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 classic-hover"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              color: 'white'
            }}
          >
            Join Our Journey
            <ArrowRight className="inline-block ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
