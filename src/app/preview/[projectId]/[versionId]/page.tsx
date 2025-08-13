"use client"

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { NeonTemplate } from '@/components/templates/neon/NeonTemplate'
import { ClassicTemplate } from '@/components/templates/classic/ClassicTemplate'
import { MinimalTemplate } from '@/components/templates/minimal/MinimalTemplate'
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

interface SectionData {
  id: string
  name: string
  type: string
  order_index: number
  is_enabled: boolean
  settings: any
  blocks: Array<{
    id: string
    name: string
    type: string
    order_index: number
    is_enabled: boolean
    settings: any
    content: any
  }>
}

export default function ProductionPreviewPage() {
  const params = useParams()
  const projectId = params.projectId as string
  const versionId = params.versionId as string
  
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [sections, setSections] = useState<SectionData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load project data and sections
  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log('🔍 Loading production preview for project:', projectId, 'version:', versionId)

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

        console.log('✅ Project loaded for production preview:', project)

        // Parse the project data
        const parsedData = project.data as ProjectData
        setProjectData(parsedData)

        // Load user-specific sections and blocks
        const { data: userSectionsData, error: sectionsError } = await supabase
          .from('user_project_sections')
          .select(`
            id,
            name,
            type,
            order_index,
            is_enabled,
            settings,
            user_project_blocks (
              id,
              name,
              type,
              order_index,
              is_enabled,
              settings,
              content
            )
          `)
          .eq('project_id', projectId)
          .order('order_index')

        if (sectionsError) {
          console.error('❌ Error loading user sections:', sectionsError)
          throw new Error('Failed to load project sections')
        }

        // Transform sections data and filter enabled sections/blocks
        const transformedSections = userSectionsData
          ?.filter(section => section.is_enabled)
          .map(section => ({
            ...section,
            blocks: section.user_project_blocks
              ?.filter(block => block.is_enabled)
              .sort((a: any, b: any) => a.order_index - b.order_index) || []
          }))
          .sort((a: any, b: any) => a.order_index - b.order_index) || []

        console.log('✅ Loaded production sections:', transformedSections)
        setSections(transformedSections)
        
      } catch (err) {
        console.error('❌ Error loading project for production preview:', err)
        setError(err instanceof Error ? err.message : 'Failed to load project')
      } finally {
        setIsLoading(false)
      }
    }

    if (projectId && versionId) {
      loadProject()
    }
  }, [projectId, versionId])

  // Transform project data to template format with sections
  const transformProjectData = (data: ProjectData) => {
    const normalizedTeam = ((data.content?.team?.members || [
      { name: 'Alex Johnson', role: 'Founder & CEO', avatar: '👨‍💼', social: '@alexjohnson' },
      { name: 'Sarah Chen', role: 'Lead Developer', avatar: '👩‍💻', social: '@sarahchen' },
      { name: 'Mike Rodriguez', role: 'Marketing Director', avatar: '👨‍💼', social: '@mikerodriguez' }
    ]) as any[]).map((member: any) => ({
      name: member.name,
      role: member.role,
      avatar: member.avatar,
      social: typeof member.social === 'string' ? member.social : member.social?.twitter || ''
    }))

    const normalizedRoadmap = (((data as any).content?.roadmap?.phases) || [
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
      },
      sections: sections
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your website...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Website</h1>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    )
  }

  if (!projectData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Website Not Found</h1>
          <p className="text-gray-600 mb-4">The website you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  // Production-like preview - no editor UI, just the website
  return (
    <div className="min-h-screen bg-white relative">
      {renderTemplate()}
      
      {/* Preview Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-6 shadow-lg z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-lg font-bold">PREVIEW MODE</span>
              </div>
              <span className="text-base opacity-90">
                This is a preview version. Purchase required for live website.
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-sm opacity-75">Version: {versionId}</span>
            </div>
          </div>
          <div className="text-sm opacity-80">
            This website is currently in preview mode and requires payment to be published live. 
            All content and design are subject to change until the website is purchased and activated.
          </div>
        </div>
      </div>
    </div>
  )
}
