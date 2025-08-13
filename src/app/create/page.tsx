"use client"

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Save } from 'lucide-react'
import { getTemplateById } from '@/data/templates'
import { TemplateEditor } from '@/components/editor/TemplateEditor'

interface ProjectData {
  id: string
  name: string
  template: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  content: {
    hero: {
      title: string
      subtitle: string
      description: string
    }
    about: {
      title: string
      description: string
      features: Array<{
        title: string
        description: string
        icon: string
      }>
    }
    tokenomics: {
      title: string
      description: string
      totalSupply: string
      distribution: Array<{
        name: string
        percentage: number
        color: string
      }>
    }
    team: {
      title: string
      description: string
      members: Array<{
        name: string
        role: string
        avatar: string
        social: {
          twitter?: string
          telegram?: string
        }
      }>
    }
    social: {
      twitter?: string
      telegram?: string
      website?: string
    }
  }
}

const defaultProjectData: ProjectData = {
  id: 'new-project', // This will be replaced with a proper UUID
  name: 'My Meme Coin',
  template: 'neon',
  colors: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#45B7D1'
  },
  content: {
    hero: {
      title: '🚀 Welcome to the Future',
      subtitle: 'The Next Big Thing in Crypto',
      description: 'Join the revolution with our innovative meme coin that combines humor, community, and cutting-edge blockchain technology.'
    },
    about: {
      title: 'About Our Project',
      description: 'We\'re building something special that will change the crypto landscape forever.',
      features: [
        {
          title: 'Community Driven',
          description: 'Built by the community, for the community',
          icon: '👥'
        },
        {
          title: 'Transparent',
          description: 'All transactions and decisions are public',
          icon: '🔍'
        },
        {
          title: 'Innovative',
          description: 'Pushing the boundaries of what\'s possible',
          icon: '💡'
        }
      ]
    },
    tokenomics: {
      title: 'Tokenomics',
      description: 'Fair and transparent token distribution',
      totalSupply: '1,000,000,000',
      distribution: [
        { name: 'Liquidity', percentage: 40, color: '#FF6B6B' },
        { name: 'Community', percentage: 30, color: '#4ECDC4' },
        { name: 'Team', percentage: 15, color: '#45B7D1' },
        { name: 'Marketing', percentage: 10, color: '#96CEB4' },
        { name: 'Development', percentage: 5, color: '#FFEAA7' }
      ]
    },
    team: {
      title: 'Our Team',
      description: 'Meet the brilliant minds behind the project',
      members: [
        {
          name: 'Alex Johnson',
          role: 'Founder & CEO',
          avatar: '👨‍💼',
          social: { twitter: '@alexjohnson' }
        },
        {
          name: 'Sarah Chen',
          role: 'Lead Developer',
          avatar: '👩‍💻',
          social: { twitter: '@sarahchen' }
        },
        {
          name: 'Mike Rodriguez',
          role: 'Marketing Director',
          avatar: '👨‍💼',
          social: { twitter: '@mikerodriguez' }
        }
      ]
    },
    social: {
      twitter: 'https://twitter.com/memecoin',
      telegram: 'https://t.me/memecoin',
      website: 'https://memecoin.com'
    }
  }
}

function CreatePageContent() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get('template') || 'neon'
  const template = getTemplateById(templateId)
  
  const [projectData, setProjectData] = useState<ProjectData>({
    ...defaultProjectData,
    id: crypto.randomUUID(), // Generate a proper UUID
    template: templateId
  })
  
  // Simplified create UI – delegate UI to TemplateEditor

  const handleColorChange = (colorType: 'primary' | 'secondary' | 'accent', color: string) => {
    setProjectData(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: color
      }
    }))
  }

  const handleContentChange = (data: any) => {
    setProjectData(prev => ({
      ...prev,
      ...data
    }))
  }

  const handleSave = () => {
    // Save project data to localStorage or backend
    localStorage.setItem('sol-sites-project', JSON.stringify(projectData))
  }

  const handlePublish = () => {
    // Handle publishing logic
    console.log('Publishing project:', projectData)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <TemplateEditor
        template={template}
        projectData={projectData}
        onContentChange={handleContentChange}
        onSave={handleSave}
      />
    </div>
  )
}

export default function CreatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CreatePageContent />
    </Suspense>
  )
}
