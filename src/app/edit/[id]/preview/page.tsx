"use client"

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { trackPageView, getCurrentSessionId, endSession } from '@/lib/analytics'
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
  const [hasTrackedInitialView, setHasTrackedInitialView] = useState(false)

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

        // Load sections and blocks data
        const { data: sections, error: sectionsError } = await supabase
          .from('user_project_sections')
          .select(`
            *,
            blocks:user_project_blocks(*)
          `)
          .eq('project_id', projectId)
          .order('order_index')

        if (sectionsError) {
          console.error('❌ Error loading sections:', sectionsError)
        }

        console.log('✅ Sections loaded for preview:', sections)

        // Parse the project data and add sections
        const parsedData = {
          ...project.data,
          sections: sections || []
        } as ProjectData & { sections: any[] }
        
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

  // Track page view when project data is loaded (editor preview)
  useEffect(() => {
    if (!projectId || !projectData || hasTrackedInitialView) return
    const pageUrl = typeof window !== 'undefined' ? window.location.href : `/edit/${projectId}/preview`
    trackPageView(projectId, pageUrl)
    setHasTrackedInitialView(true)
  }, [projectId, projectData, hasTrackedInitialView])

  // End session on tab close/unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const sessionId = getCurrentSessionId()
      if (sessionId) {
        const end = async () => {
          try { await endSession(sessionId) } catch {}
        }
        end()
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', handleBeforeUnload)
      }
    }
  }, [])

  // Transform project data to template format
  const transformProjectData = (data: ProjectData & { sections?: any[] }) => {
    // Extract content from sections and blocks (same logic as editor)
    const extractBlockContent = (blockType: string) => {
      const block = (data.sections || [])
        .flatMap((s: any) => s?.blocks || [])
        .find((b: any) => {
          const t = (b?.type || b?.name || '').toString().toLowerCase()
          return t.includes(blockType.toLowerCase())
        })
      return (block && (block as any).content) || {}
    }

    // Extract navbar/header content
    const navbarBlock = (data.sections || [])
      .flatMap((s: any) => s?.blocks || [])
      .find((b: any) => {
        const t = (b?.type || b?.name || '').toString().toLowerCase()
        return t.includes('nav') || t.includes('header')
      })
    const navbarContent = (navbarBlock && (navbarBlock as any).content) || {}
    
    // Extract header section settings if available
    const headerSection = (data.sections || []).find((s: any) => {
      const t = (s?.type || s?.name || '').toString().toLowerCase()
      return t.includes('nav') || t.includes('header')
    })
    const headerSettings = (headerSection && (headerSection as any).settings) || {}

    // Extract hero content with comprehensive data
    const heroContent = extractBlockContent('hero')
    
    // Extract other section content
    const aboutContent = extractBlockContent('about')
    const tokenomicsContent = extractBlockContent('tokenomics')
    const teamContent = extractBlockContent('team')
    const roadmapContent = extractBlockContent('roadmap')
    const footerContent = extractBlockContent('footer')

    return {
      tokenInfo: {
        name: data.name || 'MEME Token',
        symbol: heroContent.tokenSymbol || (data as any).tokenInfo?.symbol || 'MEME',
        contractAddress: (data as any).tokenInfo?.contractAddress || '0x1234567890abcdef1234567890abcdef12345678',
        description: heroContent.description || data.content?.hero?.description || 'Join the revolution with our innovative meme coin that combines humor, community, and cutting-edge blockchain technology.'
      },
      branding: {
        primaryColor: heroContent.primaryColor || data.colors?.primary || (getTemplateById(data.template as any) as any)?.colors?.primary || '#FF6B6B',
        secondaryColor: heroContent.secondaryColor || data.colors?.secondary || (getTemplateById(data.template as any) as any)?.colors?.secondary || '#4ECDC4',
        accentColor: heroContent.accentColor || data.colors?.accent || (getTemplateById(data.template as any) as any)?.colors?.accent || '#45B7D1',
        logo: headerSettings.logoUrl || navbarContent.logoUrl || (data as any).branding?.logo || '',
        banner: (data as any).branding?.banner || ''
      },
      social: {
        twitter: (headerSettings.social || {}).twitter || (navbarContent.social || {}).twitter || data.content?.social?.twitter || 'https://twitter.com/memecoin',
        telegram: (headerSettings.social || {}).telegram || (navbarContent.social || {}).telegram || data.content?.social?.telegram || 'https://t.me/memecoin',
        discord: (headerSettings.social || {}).discord || (navbarContent.social || {}).discord || (data.content as any)?.social?.discord || 'https://discord.gg/memetoken',
        website: (headerSettings.social || {}).website || (navbarContent.social || {}).website || data.content?.social?.website || 'https://memetoken.com'
      },
      header: {
        navItems: headerSettings.navItems || navbarContent.navItems || data.content?.header?.navItems || [
          { label: 'About', href: '#about' },
          { label: 'Tokenomics', href: '#tokenomics' },
          { label: 'Roadmap', href: '#roadmap' },
          { label: 'Team', href: '#team' }
        ],
        cta: headerSettings.cta || navbarContent.cta || data.content?.header?.cta || { text: 'Buy Now', href: undefined },
        colors: {
          primary: navbarContent.primaryColor || data.colors?.primary || (getTemplateById(data.template as any) as any)?.colors?.primary,
          secondary: navbarContent.secondaryColor || data.colors?.secondary || (getTemplateById(data.template as any) as any)?.colors?.secondary
        },
        displayName: navbarContent.displayName || (data as any).tokenInfo?.symbol
      },
      content: {
        hero: {
          title: heroContent.title || 'Welcome to the Future',
          subtitle: heroContent.subtitle || 'The Next Big Thing in Crypto',
          description: heroContent.description || 'Join the revolution with our innovative meme coin that combines humor, community, and cutting-edge blockchain technology.',
          // Comprehensive hero content
          tokenSymbol: heroContent.tokenSymbol || 'MEME',
          showTokenPill: heroContent.showTokenPill !== false,
          showStats: heroContent.showStats !== false,
          stats: heroContent.stats || [
            { value: '10K+', label: 'Holders', color: 'primary' },
            { value: '$2.5M', label: 'Market Cap', color: 'secondary' },
            { value: '$500K', label: '24h Volume', color: 'accent' }
          ],
          showPrimaryButton: heroContent.showPrimaryButton !== false,
          primaryButton: heroContent.primaryButton || { text: 'Buy Now', href: '' },
          showSecondaryButton: heroContent.showSecondaryButton !== false,
          secondaryButton: heroContent.secondaryButton || { text: 'Watch Video', href: '' },
          showTokenVisual: heroContent.showTokenVisual !== false,
          tokenLogo: heroContent.tokenLogo || '',
          tokenPrice: heroContent.tokenPrice || '$0.0025',
          priceChange: heroContent.priceChange || '+15.2%',
          circulatingSupply: heroContent.circulatingSupply || '800M',
          totalSupply: heroContent.totalSupply || '1B',
          showScrollIndicator: heroContent.showScrollIndicator !== false,
          scrollText: heroContent.scrollText || 'Scroll to explore'
        },
        about: {
          title: aboutContent.title || data.content?.about?.title || 'About Our Project',
          content: aboutContent.description || data.content?.about?.description || 'We are building something special that will change the crypto landscape forever.'
        },
        features: aboutContent.features || data.content?.about?.features || [
          { title: 'Community Driven', description: 'Built by the community, for the community', icon: '👥' },
          { title: 'Transparent', description: 'All transactions and decisions are public', icon: '🔍' },
          { title: 'Innovative', description: 'Pushing the boundaries of what is possible', icon: '💡' }
        ],
        tokenomics: {
          title: tokenomicsContent.title || data.content?.tokenomics?.title || 'Tokenomics',
          description: tokenomicsContent.description || data.content?.tokenomics?.description || 'Fair and transparent token distribution',
          totalSupply: tokenomicsContent.totalSupply || data.content?.tokenomics?.totalSupply || '1,000,000,000',
          distribution: tokenomicsContent.distribution || data.content?.tokenomics?.distribution || [
            { name: 'Liquidity', percentage: 40, color: '#FF6B6B' },
            { name: 'Community', percentage: 30, color: '#4ECDC4' },
            { name: 'Team', percentage: 15, color: '#45B7D1' },
            { name: 'Marketing', percentage: 10, color: '#96CEB4' },
            { name: 'Development', percentage: 5, color: '#FFEAA7' }
          ]
        },
        team: teamContent.members || data.content?.team?.members || [
          { name: 'Alex Johnson', role: 'Founder & CEO', avatar: '👨‍💼', social: '@alexjohnson' },
          { name: 'Sarah Chen', role: 'Lead Developer', avatar: '👩‍💻', social: '@sarahchen' },
          { name: 'Mike Rodriguez', role: 'Marketing Director', avatar: '👨‍💼', social: '@mikerodriguez' }
        ],
        roadmap: roadmapContent.phases || (data as any).content?.roadmap?.phases || [
          { title: 'Phase 1: Launch', description: 'Initial token launch and community building', date: 'Q1 2024', completed: true },
          { title: 'Phase 2: Development', description: 'Core features and platform development', date: 'Q2 2024', completed: false },
          { title: 'Phase 3: Expansion', description: 'Partnerships and ecosystem growth', date: 'Q3 2024', completed: false }
        ]
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
