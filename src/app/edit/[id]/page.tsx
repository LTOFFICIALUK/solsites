"use client"

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { TemplateEditor } from '@/components/editor/TemplateEditor'
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
  social?: {
    twitter?: string
    telegram?: string
    discord?: string
    website?: string
  }
  branding?: {
    logo?: string
    banner?: string
  }
  header?: {
    navItems?: Array<{
      label: string
      href: string
    }>
    cta?: {
      text: string
      href?: string
    }
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
    social?: {
      twitter?: string
      telegram?: string
      website?: string
    }
  }
}

export default function EditPage() {
  const params = useParams()
  const projectId = params.id as string
  
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [template, setTemplate] = useState<any>(null)

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log('🔍 Loading project with ID:', projectId)

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

        console.log('✅ Project loaded:', project)
        console.log('✅ Project data field:', project.data)

        // Parse the project data
        const parsedData = project.data as ProjectData
        console.log('✅ Parsed project data:', parsedData)
        
        // Set the template
        const projectTemplate = getTemplateById(parsedData.template)
        if (!projectTemplate) {
          throw new Error('Template not found')
        }

        setTemplate(projectTemplate)
        setProjectData(parsedData)
        
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

  const handleContentChange = async (newData: ProjectData) => {
    console.log('🔄 handleContentChange called with:', newData)
    setProjectData(newData)
    
    // Save to database
    try {
      console.log('💾 Saving to database:', { name: newData.name, data: newData })
      const { error } = await supabase
        .from('user_projects')
        .update({ 
          name: newData.name,
          data: newData 
        })
        .eq('id', projectId)
      
      if (error) {
        console.error('❌ Error saving project data:', error)
      } else {
        console.log('✅ Project data saved to database')
      }
    } catch (error) {
      console.error('❌ Error saving project data:', error)
    }
  }

  const handleSave = async () => {
    if (!projectData) return
    
    try {
      const { error } = await supabase
        .from('user_projects')
        .update({ 
          name: projectData.name,
          data: projectData 
        })
        .eq('id', projectId)
      
      if (error) {
        console.error('❌ Error saving project:', error)
      } else {
        console.log('✅ Project saved successfully!')
        // You could add a toast notification here
      }
    } catch (error) {
      console.error('❌ Error saving project:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Project</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <a 
            href="/dashboard" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    )
  }

  if (!projectData || !template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h1>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
          <a 
            href="/dashboard" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    )
  }

  return (
    <TemplateEditor
      projectData={projectData}
      template={template}
      onContentChange={handleContentChange}
      onSave={handleSave}
    />
  )
}
