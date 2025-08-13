"use client"

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { NeonTemplate } from '@/components/templates/neon/NeonTemplate'
import { ClassicTemplate } from '@/components/templates/classic/ClassicTemplate'
import { MinimalTemplate } from '@/components/templates/minimal/MinimalTemplate'
import { ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTemplateById } from '@/data/templates'

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

export default function ProjectPreviewPage() {
  const params = useParams()
  const projectId = params.id as string
  
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log('🔍 Loading project for preview with ID:', projectId)

        // Get project from database
        const { data: project, error: projectError } = await supabase
          .from('user_projects')
          .select('*')
          .eq('id', projectId)
          .single()

        if (projectError) {
          console.error('❌ Error loading project:', projectError)
          throw new Error('Project not found')
        }

        if (!project) {
          throw new Error('Project not found')
        }

        console.log('✅ Project loaded for preview:', project)

        // Parse the project data
        const parsedData = project.data as ProjectData
        setProjectData(parsedData)
        
      } catch (err) {
        console.error('❌ Error loading project for preview:', err)
        setError(err instanceof Error ? err.message : 'Failed to load project')
      } finally {
        setIsLoading(false)
      }
    }

    if (projectId) {
      loadProject()
    }
  }, [projectId])

  // Transform project data to template format
  const transformProjectData = (data: ProjectData) => {
    // Normalize team and roadmap shapes to what templates expect
    const normalizedTeam = (data.content?.team?.members || [
      { name: 'Alex Johnson', role: 'Founder & CEO', avatar: '👨‍💼', social: '@alexjohnson' },
      { name: 'Sarah Chen', role: 'Lead Developer', avatar: '👩‍💻', social: '@sarahchen' },
      { name: 'Mike Rodriguez', role: 'Marketing Director', avatar: '👨‍💼', social: '@mikerodriguez' }
    ]).map((member: any) => ({
      name: member.name,
      role: member.role,
      avatar: member.avatar,
      social: typeof member.social === 'string' ? member.social : member.social?.twitter || ''
    }))

    const normalizedRoadmap = ((data as any).content?.roadmap?.phases || [
      { title: 'Phase 1: Launch', description: 'Initial token launch and community building', date: 'Q1 2024', completed: true },
      { title: 'Phase 2: Development', description: 'Core features and platform development', date: 'Q2 2024', completed: false },
      { title: 'Phase 3: Expansion', description: 'Partnerships and ecosystem growth', date: 'Q3 2024', completed: false }
    ])

    return {
      tokenInfo: {
        name: data.name || 'MEME Token',
        symbol: (data as any).tokenInfo?.symbol || 'MEME',
        contractAddress: (data as any).tokenInfo?.contractAddress || '0x1234567890abcdef1234567890abcdef12345678',
        description: data.content?.hero?.description || 'Join the revolution with our innovative meme coin that combines humor, community, and cutting-edge blockchain technology.'
      },
      branding: {
        primaryColor: data.colors?.primary || (getTemplateById(data.template as any) as any)?.colors?.primary || '#FF6B6B',
        secondaryColor: data.colors?.secondary || (getTemplateById(data.template as any) as any)?.colors?.secondary || '#4ECDC4',
        accentColor: data.colors?.accent || (getTemplateById(data.template as any) as any)?.colors?.accent || '#45B7D1',
        logo: (data as any).branding?.logo || '',
        banner: (data as any).branding?.banner || ''
      },
      social: {
        twitter: data.content?.social?.twitter || 'https://twitter.com/memecoin',
        telegram: data.content?.social?.telegram || 'https://t.me/memecoin',
        discord: (data.content as any)?.social?.discord || 'https://discord.gg/memetoken',
        website: data.content?.social?.website || 'https://memetoken.com'
      },
      content: {
        hero: {
          title: data.content?.hero?.title || 'Welcome to the Future',
          subtitle: data.content?.hero?.subtitle || 'The Next Big Thing in Crypto',
          description: data.content?.hero?.description || 'Join the revolution with our innovative meme coin that combines humor, community, and cutting-edge blockchain technology.'
        },
        about: {
          title: data.content?.about?.title || 'About Our Project',
          content: data.content?.about?.description || 'We are building something special that will change the crypto landscape forever.'
        },
        features: data.content?.about?.features || [
          { title: 'Community Driven', description: 'Built by the community, for the community', icon: '👥' },
          { title: 'Transparent', description: 'All transactions and decisions are public', icon: '🔍' },
          { title: 'Innovative', description: 'Pushing the boundaries of what is possible', icon: '💡' }
        ],
        tokenomics: {
          title: data.content?.tokenomics?.title || 'Tokenomics',
          description: data.content?.tokenomics?.description || 'Fair and transparent token distribution',
          totalSupply: data.content?.tokenomics?.totalSupply || '1,000,000,000',
          distribution: data.content?.tokenomics?.distribution || [
            { name: 'Liquidity', percentage: 40, color: '#FF6B6B' },
            { name: 'Community', percentage: 30, color: '#4ECDC4' },
            { name: 'Team', percentage: 15, color: '#45B7D1' },
            { name: 'Marketing', percentage: 10, color: '#96CEB4' },
            { name: 'Development', percentage: 5, color: '#FFEAA7' }
          ]
        },
        team: normalizedTeam,
        roadmap: normalizedRoadmap
      }
    }
  }

  const renderTemplate = () => {
    if (!projectData) return null

    const templateData = transformProjectData(projectData)

    switch (projectData.template) {
      case 'neon':
        return <NeonTemplate projectData={templateData} />
      case 'classic':
        return <ClassicTemplate projectData={templateData} />
      case 'minimal':
        return <MinimalTemplate projectData={templateData} />
      default:
        return <div className="p-8 text-center text-gray-500">Template not found</div>
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading preview...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Preview</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link 
            href={`/edit/${projectId}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Editor
          </Link>
        </div>
      </div>
    )
  }

  if (!projectData) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h1>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
          <Link 
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Preview Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href={`/edit/${projectId}`}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Editor</span>
            </Link>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: projectData.colors?.primary || '#3B82F6' }}
              ></div>
              <span className="font-medium">{projectData.name} - Live Preview</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              Live Preview Mode
            </div>
            <Link 
              href={`/edit/${projectId}`}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Template Content */}
      <div className="pt-16 h-full overflow-auto">
        {renderTemplate()}
      </div>
    </div>
  )
}
