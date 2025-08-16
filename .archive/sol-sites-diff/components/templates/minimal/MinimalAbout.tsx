"use client"

interface MinimalAboutProps {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  content: {
    about: {
      title: string
      subtitle: string
      description: string
      features: string[]
    }
  }
}

export function MinimalAbout({ primaryColor, secondaryColor, accentColor, content }: MinimalAboutProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 
            className="text-4xl font-bold mb-4"
            style={{ color: primaryColor }}
          >
            {content.about.title}
          </h2>
          <p 
            className="text-xl mb-6"
            style={{ color: secondaryColor }}
          >
            {content.about.subtitle}
          </p>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {content.about.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(content.about.features || []).map((feature, index) => (
            <div 
              key={index}
              className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div 
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: accentColor }}
              >
                <span className="text-white font-bold text-lg">
                  {index + 1}
                </span>
              </div>
              <p className="text-gray-700 font-medium">
                {feature}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
