import { Users, Zap, Lock, Eye } from 'lucide-react'
import { getIconComponent } from '@/lib/icons'

interface ClassicAboutProps {
  title: string
  description: string
  features: Array<{
    title: string
    description: string
    icon: string
  }>
  primaryColor: string
  secondaryColor: string
  accentColor: string

}

export const ClassicAbout = ({
  title,
  description,
  features,
  primaryColor,
  secondaryColor,
  accentColor
}: ClassicAboutProps) => {
  const getIcon = (iconName: string) => {
    try {
      const Icon = getIconComponent(iconName || 'users')
      return <Icon className="w-8 h-8" />
    } catch {
      return <Users className="w-8 h-8" />
    }
  }

  return (
    <section className="py-20 bg-white" id="about">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(features || []).map((feature, index) => (
            <div 
              key={index}
              className="text-center p-8 rounded-2xl classic-hover"
              style={{
                backgroundColor: `${primaryColor}05`,
                border: `1px solid ${primaryColor}20`
              }}
            >
              <div 
                className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                style={{
                  backgroundColor: `${primaryColor}20`,
                  color: primaryColor
                }}
              >
                {getIcon(feature.icon)}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
