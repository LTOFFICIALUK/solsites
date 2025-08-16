"use client"

import { 
  Type, 
  Image, 
  BarChart3, 
  Users, 
  Map, 
  MessageSquare,
  Star,
  TrendingUp,
  Zap,
  Shield,
  Globe,
  Heart
} from 'lucide-react'

interface ComponentLibraryProps {
  onComponentSelect: (component: string) => void
}

const components = [
  {
    id: 'hero',
    name: 'Hero Section',
    description: 'Main landing section with title and call-to-action',
    icon: Type,
    category: 'Essential',
    preview: 'Large title with subtitle and buttons'
  },
  {
    id: 'about',
    name: 'About Section',
    description: 'Information about your project and features',
    icon: MessageSquare,
    category: 'Essential',
    preview: 'Project description with feature cards'
  },
  {
    id: 'tokenomics',
    name: 'Tokenomics',
    description: 'Token distribution and economics',
    icon: BarChart3,
    category: 'Essential',
    preview: 'Pie chart with token distribution'
  },
  {
    id: 'team',
    name: 'Team Section',
    description: 'Introduce your team members',
    icon: Users,
    category: 'Optional',
    preview: 'Team member cards with roles'
  },
  {
    id: 'roadmap',
    name: 'Roadmap',
    description: 'Project timeline and milestones',
    icon: Map,
    category: 'Optional',
    preview: 'Timeline with milestones'
  },
  {
    id: 'features',
    name: 'Features',
    description: 'Highlight key features of your project',
    icon: Star,
    category: 'Optional',
    preview: 'Feature cards with icons'
  },
  {
    id: 'stats',
    name: 'Statistics',
    description: 'Display key metrics and numbers',
    icon: TrendingUp,
    category: 'Optional',
    preview: 'Number cards with labels'
  },
  {
    id: 'gallery',
    name: 'Image Gallery',
    description: 'Showcase images and media',
    icon: Image,
    category: 'Optional',
    preview: 'Grid of images'
  },
  {
    id: 'testimonials',
    name: 'Testimonials',
    description: 'Customer reviews and feedback',
    icon: Heart,
    category: 'Optional',
    preview: 'Quote cards with avatars'
  },
  {
    id: 'faq',
    name: 'FAQ Section',
    description: 'Frequently asked questions',
    icon: MessageSquare,
    category: 'Optional',
    preview: 'Expandable question cards'
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Security features and audits',
    icon: Shield,
    category: 'Optional',
    preview: 'Security badges and info'
  },
  {
    id: 'partners',
    name: 'Partners',
    description: 'Partnerships and integrations',
    icon: Globe,
    category: 'Optional',
    preview: 'Partner logos grid'
  }
]

export function ComponentLibrary({ onComponentSelect }: ComponentLibraryProps) {
  const categories = ['Essential', 'Optional']

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Components</h3>
        <p className="text-sm text-gray-600">
          Drag and drop components to build your website. Essential components are recommended for all meme coin websites.
        </p>
      </div>

      {categories.map((category) => (
        <div key={category} className="space-y-3">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-semibold text-gray-700 capitalize">
              {category} Components
            </h4>
            {category === 'Essential' && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                Recommended
              </span>
            )}
          </div>
          
          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {components
              .filter(component => component.category === category)
              .map((component) => {
                const IconComponent = component.icon
                return (
                  <div
                    key={component.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('component-type', component.id)
                      e.dataTransfer.effectAllowed = 'copy'
                    }}
                    className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                    onClick={() => onComponentSelect(component.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-purple-100 transition-colors">
                        <IconComponent className="w-5 h-5 text-gray-600 group-hover:text-purple-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-gray-900 group-hover:text-purple-700 transition-colors">
                          {component.name}
                        </h5>
                        <p className="text-sm text-gray-600 mt-1">
                          {component.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {component.preview}
                          </span>
                          {category === 'Essential' && (
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              Auto-added
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {category === 'Essential' ? (
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                            ✓ Added
                          </span>
                        ) : (
                          <button className="text-xs text-purple-600 hover:text-purple-700 font-medium">
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      ))}

      {/* Component Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Essential components are automatically included</li>
          <li>• Drag components to reorder them</li>
          <li>• Click on any component to edit its content</li>
          <li>• Use the preview mode to see your changes</li>
        </ul>
      </div>
    </div>
  )
}
