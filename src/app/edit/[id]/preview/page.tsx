"use client"

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { loadProjectData, ProjectData, ProjectBlock } from '@/lib/services'
import { ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'

export default function ProjectPreviewPage() {
  const params = useParams()
  const projectId = params.id as string
  
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load project data using the new unified system
  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log('🔍 Loading project for preview with ID:', projectId)

        const data = await loadProjectData(projectId)
        setProjectData(data)
        console.log('✅ Project loaded for preview:', data)
      } catch (err) {
        console.error('❌ Error loading project:', err)
        setError(err instanceof Error ? err.message : 'Failed to load project')
      } finally {
        setIsLoading(false)
      }
    }

    if (projectId) {
      loadProject()
    }
  }, [projectId])

  // Render individual blocks using the same logic as the editor
  const renderBlock = (block: ProjectBlock) => {
    if (!block.is_enabled) return null;

    switch (block.type) {
      case 'navbar':
        return (
          <nav key={block.id} className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <div className="text-xl font-bold text-gray-900">
                    {block.content.logo || 'Logo'}
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {(block.content.navItems || []).map((item: any, index: number) => (
                      <a
                        key={index}
                        href={item.href || '#'}
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        {item.text || item.label || 'Link'}
                      </a>
                    ))}
                  </div>
                </div>
                {block.content.cta && (
                  <div className="hidden md:block">
                    <a
                      href={block.content.cta.href || '#'}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                      {block.content.cta.text || 'Get Started'}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </nav>
        );

      case 'hero':
        return (
          <section key={block.id} className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  {block.content.title || 'Welcome'}
                </h1>
                <p className="text-xl md:text-2xl mb-4">
                  {block.content.subtitle || 'Subtitle'}
                </p>
                <p className="text-lg mb-8 max-w-3xl mx-auto">
                  {block.content.description || 'Description'}
                </p>
                {block.content.cta && (
                  <a
                    href={block.content.cta.href || '#'}
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    {block.content.cta.text || 'Get Started'}
                  </a>
                )}
              </div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section key={block.id} className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {block.content.title || 'About Us'}
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  {block.content.description || 'About description'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(block.content.features || []).map((feature: any, index: number) => (
                  <div key={index} className="text-center p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title || 'Feature'}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description || 'Feature description'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'footer':
        return (
          <footer key={block.id} className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <p className="text-gray-300">
                    {block.content.copyright || '© 2024 All rights reserved'}
                  </p>
                </div>
                <div className="flex space-x-6">
                  {block.content.social && Object.entries(block.content.social).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url as string}
                      className="text-gray-300 hover:text-white transition-colors capitalize"
                    >
                      {platform}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        );

      default:
        return (
          <div key={block.id} className="p-8 text-center text-gray-500">
            <p>Unknown block type: {block.type}</p>
          </div>
        );
    }
  };

  // Render the project using blocks
  const renderProject = () => {
    if (!projectData) return null;
    
    return (
      <div className="min-h-screen bg-white">
        {projectData.blocks
          .filter(block => block.is_enabled)
          .map(block => renderBlock(block))}
      </div>
    );
  };

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
                style={{ backgroundColor: '#3B82F6' }}
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

      {/* Project Content */}
      <div className="pt-16 h-full overflow-auto">
        {renderProject()}
      </div>
    </div>
  )
}
