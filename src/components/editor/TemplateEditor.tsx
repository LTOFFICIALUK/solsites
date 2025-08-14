"use client"

// Global creation lock to prevent multiple simultaneous project creations
let globalProjectCreationInProgress = false

import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { SectionSettings } from './SectionSettings'
import { BlockSettings } from './BlockSettings'

import { DatabaseStatus } from './DatabaseStatus'
import { NeonTemplate } from '@/components/templates/neon/NeonTemplate'
import { ClassicTemplate } from '@/components/templates/classic/ClassicTemplate'
import { MinimalTemplate } from '@/components/templates/minimal/MinimalTemplate'
import { ColorPicker } from '@/components/editor/ColorPicker'

interface TemplateEditorProps {
  projectData: any
  template: any
  onContentChange: (data: any) => void
  onSave: () => void
}

export function TemplateEditor({ projectData, template, onContentChange, onSave }: TemplateEditorProps) {
  const [instanceId] = useState(() => `editor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
  console.log(`🎯 TemplateEditor instance created: ${instanceId}`)
  const { user } = useAuth()
  const [sections, setSections] = useState<any[]>([])
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  // Simplified UI: single structure sidebar (collapsible)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [dbError, setDbError] = useState<string | null>(null)
  // Track the actual project id persisted in DB
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSavedData, setLastSavedData] = useState<any>(null)
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [creationAttemptId] = useState(() => `attempt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
  
  // Project selection modal state
  const [showProjectSelector, setShowProjectSelector] = useState(false)
  const [existingProjects, setExistingProjects] = useState<any[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  // Mobile-only: which pane is visible (stacked layout). Desktop shows all three.
  const [activePane, setActivePane] = useState<'structure' | 'preview' | 'settings'>('preview')

  // Check if required database tables exist
  const checkDatabaseSchema = async () => {
    try {
      console.log('🔍 Checking database schema...')
      
      // Check templates table
      const { error: templatesError } = await supabase
        .from('templates')
        .select('count')
        .limit(1)
      
      if (templatesError) {
        console.error('❌ Templates table check failed:', templatesError)
        if (templatesError.code === '42P01') {
          throw new Error('Templates table does not exist. Please run the database schema.')
        }
        throw templatesError
      }
      
      console.log('✅ Templates table exists')
      
      // Check user_project_sections table
      const { error: userSectionsError } = await supabase
        .from('user_project_sections')
        .select('count')
        .limit(1)
      
      if (userSectionsError) {
        console.error('❌ User project sections table check failed:', userSectionsError)
        if (userSectionsError.code === '42P01') {
          throw new Error('User project sections table does not exist. Please run the database schema.')
        }
        throw userSectionsError
      }
      
      console.log('✅ User project sections table exists')
      
      // Check user_project_blocks table
      const { error: userBlocksError } = await supabase
        .from('user_project_blocks')
        .select('count')
        .limit(1)
      
      if (userBlocksError) {
        console.error('❌ User project blocks table check failed:', userBlocksError)
        if (userBlocksError.code === '42P01') {
          throw new Error('User project blocks table does not exist. Please run the database schema.')
        }
        throw userBlocksError
      }
      
      console.log('✅ User project blocks table exists')
      
      return true
    } catch (error) {
      console.error('❌ Database schema check failed:', error)
      setDbError(error instanceof Error ? error.message : 'Database schema check failed')
      return false
    }
  }

  // Load template structure from database
  const loadTemplateStructure = useCallback(async () => {
    // Prevent multiple simultaneous loads
    if (isLoading) {
      console.log('🔄 Load already in progress, skipping...')
      return
    }

    try {
      setIsLoading(true)
      setDbError(null)
      
      console.log('🔍 Loading template structure for:', template?.slug)
      
      // Check database schema first
      const schemaOk = await checkDatabaseSchema()
      if (!schemaOk) {
        return
      }
      
      // Get template ID from slug. If auth policies block, skip DB writes and keep editor in local-only mode
      const { data: templateData, error: templateError } = await supabase
        .from('templates')
        .select('id')
        .eq('slug', template?.slug)
        .single()
      
      if (templateError) {
        console.error('❌ Error fetching template:', templateError)
        if (templateError.code === '42P01') {
          throw new Error('Templates table does not exist. Please run the database schema.')
        }
        
        if (templateError.code === 'PGRST116') {
          throw new Error('Template not found in database. Please run the database schema.')
        }
        
        throw templateError
      }
      
      if (!templateData) {
        console.error('❌ Template not found in database for slug:', template.slug)
        throw new Error(`Template not found in database for slug: ${template.slug}`)
      }

      console.log('✅ Found template ID:', templateData.id)
      
      // Resolve or create project id
      let projectId = currentProjectId || (projectData?.id !== 'new-project' ? projectData?.id : null)
      // Never attempt seeding without an authenticated user
      if (!user) {
        projectId = null
      }

      // If we have a project id, verify ownership; if not owned, treat as fork (create new)
      if (projectId && user) {
        const { data: ownedRow, error: ownedErr } = await supabase
          .from('user_projects')
          .select('id, user_id')
          .eq('id', projectId)
          .maybeSingle()
        if (!ownedRow || ownedErr || ownedRow.user_id !== user.id) {
          console.warn('⚠️ Existing project id is not owned by current user. Forking as new.')
          projectId = null
        } else {
          // Remember verified id
          setCurrentProjectId(projectId)
        }
      }
      
      // Check for existing projects first if we don't have a projectId and no currentProjectId
      if (!projectId && !currentProjectId && user && !isCreatingProject && !globalProjectCreationInProgress) {
        // Check if user already has projects for this template
        console.log('🔍 Checking for existing projects...')
        setIsLoadingProjects(true)
        const { data: existingProjectsData, error: checkError } = await supabase
          .from('user_projects')
          .select('id, name, created_at, updated_at')
          .eq('user_id', user.id)
          .eq('template_id', templateData.id)
          .order('updated_at', { ascending: false })
        
        if (checkError) {
          console.error('❌ Error checking existing projects:', checkError)
        } else if (existingProjectsData && existingProjectsData.length > 0 && !currentProjectId) {
          // Show project selector modal only if we don't already have a currentProjectId
          console.log('✅ Found existing projects:', existingProjectsData.length)
          setExistingProjects(existingProjectsData)
          setShowProjectSelector(true)
          setIsLoadingProjects(false)
          return // Wait for user selection
        }
        
        setIsLoadingProjects(false)
        // No existing project found, create new one
        console.log('🔄 No existing project found, creating new one...')
        console.log('🔄 Creating new project in TemplateEditor...', { 
          user: user.id, 
          template: templateData.id, 
          name: projectData.name,
          currentProjectId: currentProjectId,
          isCreatingProject: isCreatingProject,
          projectId: projectId,
          creationAttemptId: creationAttemptId,
          instanceId: instanceId,
          stack: new Error().stack // Add stack trace to see where this is called from
        })
        
        // Check if we already have a currentProjectId to prevent duplicates
        if (currentProjectId) {
          console.log('⚠️ Already have currentProjectId, skipping creation:', currentProjectId)
          projectId = currentProjectId
        } else {
          globalProjectCreationInProgress = true
          setIsCreatingProject(true)
          try {
            const baseSlug = projectData.slug || projectData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
            const uniqueSlug = `${baseSlug}-${Date.now()}`
            console.log('🔄 About to insert project with slug:', uniqueSlug)
            const { data: created, error: createProjectError } = await supabase
              .from('user_projects')
              .insert({
                user_id: user.id,
                template_id: templateData.id,
                name: projectData.name,
                slug: uniqueSlug,
                data: { ...projectData, id: undefined } // Remove the placeholder id
              })
              .select('id')
              .single()
            
            if (createProjectError) {
              console.error('❌ Error creating project:', createProjectError)
              // Continue in local-only mode if creation fails
            } else {
              projectId = created.id
              setCurrentProjectId(projectId)
              onContentChange({ ...projectData, id: projectId })
              console.log('✅ Project created with id:', projectId)
            }
          } finally {
            setIsCreatingProject(false)
            globalProjectCreationInProgress = false
          }
        }
      } else {
        console.log('🚫 Skipping project creation:', {
          hasProjectId: !!projectId,
          hasUser: !!user,
          isCreatingProject: isCreatingProject,
          globalCreationInProgress: globalProjectCreationInProgress,
          currentProjectId: currentProjectId
        })
      }
      
      // First, try to load user-specific project sections
        const { data: userSectionsData, error: userSectionsError } = projectId ? await supabase
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
        .order('order_index') : { data: null, error: null } as any
      
      if (userSectionsError && userSectionsError.code !== 'PGRST116') {
        console.error('❌ Error loading user project sections:', userSectionsError)
        throw userSectionsError
      }
      
      let sectionsData
      
      if (userSectionsData && userSectionsData.length > 0) {
        // Use user-specific sections
        console.log('✅ Loaded user-specific sections:', userSectionsData)
        sectionsData = userSectionsData.map((section: any) => ({
          ...section,
          blocks: section.user_project_blocks?.sort((a: any, b: any) => a.order_index - b.order_index).map((block: any) => ({
            ...block,
            // Ensure content is parsed as object if it's a string
            content: typeof block.content === 'string' ? (() => {
              try {
                return JSON.parse(block.content)
              } catch (e) {
                console.warn('Failed to parse block content as JSON:', block.content, e)
                return {}
              }
            })() : (block.content || {})
          })) || []
        }))
        console.log('🔍 Processed user-specific sections data:', sectionsData)
        if (sectionsData) {
          sectionsData.forEach((section: any) => {
            if (section.blocks) {
              section.blocks.forEach((block: any) => {
                console.log('🔍 User-specific block:', { 
                  blockId: block.id, 
                  blockName: block.name, 
                  blockType: block.type, 
                  content: block.content,
                  contentType: typeof block.content 
                })
              })
            }
          })
        }
      } else {
        // Fallback to template sections and create user-specific copies
        console.log('🔄 No user-specific sections found, loading template sections...')
        const { data: templateSectionsData, error: templateSectionsError } = await supabase
          .from('template_sections')
          .select(`
            id,
            name,
            type,
            order_index,
            is_enabled,
            settings,
            section_blocks (
              id,
              name,
              type,
              order_index,
              is_enabled,
              settings,
              content
            )
          `)
          .eq('template_id', templateData.id)
          .order('order_index')
        
        if (templateSectionsError) {
          console.error('❌ Error loading template sections:', templateSectionsError)
          // Local-only fallback: synthesize minimal sections so the UI keeps working
          const localSections = [
            { id: 'nav', name: 'Header', type: 'header', order_index: 0, is_enabled: true, settings: {}, blocks: [] },
            { id: 'hero', name: 'Template', type: 'hero', order_index: 1, is_enabled: true, settings: {}, blocks: [] },
            { id: 'footer', name: 'Footer', type: 'footer', order_index: 2, is_enabled: true, settings: {}, blocks: [] },
          ] as any
          setSections(localSections)
          setSelectedSection('project')
          
          // Initialize last saved data for fallback
          if (projectData && !lastSavedData) {
            setLastSavedData(projectData)
          }
          return
        }
        
        console.log('✅ Loaded template sections:', templateSectionsData)
        
        // Create user-specific copies via privileged RPC to avoid RLS conflicts, then fetch
        if (projectId) {
        const { error: seedError } = await supabase.rpc('seed_project_sections', {
            p_project_id: projectId,
            p_template_id: templateData.id
          })
          if (seedError) {
            console.error('❌ Error seeding project sections via RPC:', seedError)
          // If project not found (edge race), re-check existence and skip to local-only once
          if ((seedError as any).message && String((seedError as any).message).toLowerCase().includes('project not found')) {
            const { data: exists } = await supabase
              .from('user_projects')
              .select('id')
              .eq('id', projectId)
              .maybeSingle()
            if (!exists) {
              console.warn('⚠️ Project id not found right after create. Using local-only sections for this render.')
              sectionsData = (templateSectionsData as Array<any>)?.map((section: {
                id: string
                name: string
                type: string
                order_index: number
                is_enabled: boolean
                settings: any
                section_blocks?: Array<any>
              }): any => ({
                id: section.id,
                name: section.name,
                type: section.type,
                order_index: section.order_index,
                is_enabled: section.is_enabled,
                settings: section.settings,
                blocks: (section.section_blocks || []).map((b: any) => ({
                  id: b.id,
                  name: b.name,
                  type: b.type,
                  order_index: b.order_index,
                  is_enabled: b.is_enabled,
                  settings: b.settings,
                  content: typeof b.content === 'string' ? (() => {
                    try {
                      return JSON.parse(b.content)
                    } catch (e) {
                      console.warn('Failed to parse block content as JSON:', b.content, e)
                      return {}
                    }
                  })() : (b.content || {})
                }))
              })) || []
            }
          }
          }

          const { data: seededUserSections } = await supabase
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

          console.log('🔍 Loaded seeded user sections from database:', seededUserSections)
          if (seededUserSections) {
            seededUserSections.forEach((section: any) => {
              if (section.user_project_blocks) {
                section.user_project_blocks.forEach((block: any) => {
                  console.log('🔍 Block from database:', { 
                    blockId: block.id, 
                    blockName: block.name, 
                    blockType: block.type, 
                    content: block.content,
                    contentType: typeof block.content 
                  })
                })
              }
            })
          }

          sectionsData = (seededUserSections || []).map((section: {
            id: string
            name: string
            type: string
            order_index: number
            is_enabled: boolean
            settings: any
            user_project_blocks?: Array<any>
          }) => ({
            ...section,
            blocks: section.user_project_blocks?.sort((a: any, b: any) => a.order_index - b.order_index).map((block: any) => ({
              ...block,
              // Ensure content is parsed as object if it's a string
              content: typeof block.content === 'string' ? (() => {
                try {
                  return JSON.parse(block.content)
                } catch (e) {
                  console.warn('Failed to parse block content as JSON:', block.content, e)
                  return {}
                }
              })() : (block.content || {})
            })) || []
          }))
        } else {
          // Local-only fallback if no projectId (e.g., unauthenticated or RLS blocked)
          sectionsData = (templateSectionsData as Array<any>)?.map((section: {
            id: string
            name: string
            type: string
            order_index: number
            is_enabled: boolean
            settings: any
            section_blocks?: Array<any>
          }): any => ({
            id: section.id,
            name: section.name,
            type: section.type,
            order_index: section.order_index,
            is_enabled: section.is_enabled,
            settings: section.settings,
            blocks: (section.section_blocks || []).map((b: any) => ({
              id: b.id,
              name: b.name,
              type: b.type,
              order_index: b.order_index,
              is_enabled: b.is_enabled,
              settings: b.settings,
              content: typeof b.content === 'string' ? (() => {
                try {
                  return JSON.parse(b.content)
                } catch (e) {
                  console.warn('Failed to parse block content as JSON:', b.content, e)
                  return {}
                }
              })() : (b.content || {})
            }))
          })) || []
        }
      }
      
      // Transform sections data and normalize header/navigation blocks
      console.log('🔄 Transforming sections data:', sectionsData)
      const transformedSections = sectionsData?.map((section: any) => {
        const normalizedBlocks = (section.blocks || []).map((block: any) => {
          const rawType = ((block?.type || block?.name || '') as string).toLowerCase()
          const isHeader = rawType.includes('nav') || rawType.includes('header')
          const normalizedType = isHeader ? 'navbar' : (block?.type || rawType)
          const defaultNavbarContent = {
            logoUrl: '',
            displayName: '',
            navItems: [
              { label: 'About', href: '#about' },
              { label: 'Tokenomics', href: '#tokenomics' },
              { label: 'Roadmap', href: '#roadmap' },
              { label: 'Team', href: '#team' }
            ],
            cta: { text: 'Buy Now' },
            social: {
              twitter: 'https://twitter.com/memecoin',
              telegram: 'https://t.me/memecoin',
              discord: 'https://discord.gg/memetoken',
              website: 'https://memetoken.com'
            },
            primaryColor: template?.colors?.primary,
            secondaryColor: template?.colors?.secondary
          }
          
          const finalContent = isHeader ? { ...defaultNavbarContent, ...(block?.content || {}) } : (block?.content || {})
          console.log('🔍 Block content transformation:', { 
            blockId: block.id, 
            blockType: block.type, 
            isHeader, 
            originalContent: block?.content, 
            originalContentType: typeof block?.content,
            finalContent 
          })
          
          return {
            ...block,
            type: normalizedType,
            content: finalContent
          }
        })
        return { ...section, blocks: normalizedBlocks }
      }) || []
      
      console.log('✅ Final transformed sections to be set:', transformedSections)
      setSections(transformedSections)
      
      // Set project section as selected by default
      if (transformedSections.length > 0 && !selectedSection) {
        setSelectedSection('project')
      }
      
      // Initialize last saved data after sections are loaded
      if (projectData && !lastSavedData) {
        setLastSavedData(projectData)
      }
      
    } catch (error) {
      console.error('❌ Error loading template structure:', error)
      setDbError(error instanceof Error ? error.message : 'Error loading template structure')
      
      // Fallback to default sections
      const defaultSections = [
        {
          id: 'header',
          name: 'Header',
          type: 'header',
          order_index: 0,
          is_enabled: true,
          settings: {},
          blocks: [
            {
              id: 'navbar',
              name: 'Navigation',
              type: 'navbar',
              order_index: 0,
              is_enabled: true,
              settings: {},
              content: {
                logoUrl: '',
                navItems: [
                  { label: 'About', href: '#about' },
                  { label: 'Tokenomics', href: '#tokenomics' },
                  { label: 'Roadmap', href: '#roadmap' },
                  { label: 'Team', href: '#team' }
                ],
                cta: { text: 'Buy Now' },
                social: {
                  twitter: 'https://twitter.com/memecoin',
                  telegram: 'https://t.me/memecoin',
                  discord: 'https://discord.gg/memetoken',
                  website: 'https://memetoken.com'
                }
              }
            }
          ]
        },
        {
          id: 'template',
          name: 'Template',
          type: 'template',
          order_index: 1,
          is_enabled: true,
          settings: {},
          blocks: [
            {
              id: 'hero',
              name: 'Hero Section',
              type: 'hero',
              order_index: 0,
              is_enabled: true,
              settings: {},
              content: {
                title: 'Welcome to the Future',
                subtitle: 'The Next Big Thing in Crypto',
                description: 'Join the revolution with our innovative meme coin that combines humor, community, and cutting-edge blockchain technology.'
              }
            },
            {
              id: 'about',
              name: 'About Section',
              type: 'about',
              order_index: 1,
              is_enabled: true,
              settings: {},
              content: {
                title: 'About Our Project',
                description: 'We are building something special that will change the crypto landscape forever.',
                features: [
                  { title: 'Community Driven', description: 'Built by the community, for the community', icon: '👥' },
                  { title: 'Transparent', description: 'All transactions and decisions are public', icon: '🔍' },
                  { title: 'Innovative', description: 'Pushing the boundaries of what is possible', icon: '💡' }
                ]
              }
            },
            {
              id: 'tokenomics',
              name: 'Tokenomics',
              type: 'tokenomics',
              order_index: 2,
              is_enabled: true,
              settings: {},
              content: {
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
              }
            },
            {
              id: 'team',
              name: 'Team Section',
              type: 'team',
              order_index: 3,
              is_enabled: true,
              settings: {},
              content: {
                title: 'Our Team',
                description: 'Meet the brilliant minds behind the project',
                members: [
                  { name: 'Alex Johnson', role: 'Founder & CEO', avatar: '👨', social: { twitter: '@alexjohnson' } },
                  { name: 'Sarah Chen', role: 'Lead Developer', avatar: '👩', social: { twitter: '@sarahchen' } },
                  { name: 'Mike Rodriguez', role: 'Marketing Director', avatar: '👨', social: { twitter: '@mikerodriguez' } }
                ]
              }
            },
            {
              id: 'roadmap',
              name: 'Roadmap',
              type: 'roadmap',
              order_index: 4,
              is_enabled: true,
              settings: {},
              content: {
                title: 'Roadmap',
                description: 'Our journey to success',
                phases: [
                  { title: 'Phase 1: Launch', description: 'Initial token launch and community building', date: 'Q1 2024', completed: true },
                  { title: 'Phase 2: Development', description: 'Core features and platform development', date: 'Q2 2024', completed: false },
                  { title: 'Phase 3: Expansion', description: 'Partnerships and ecosystem growth', date: 'Q3 2024', completed: false }
                ]
              }
            }
          ]
        },
        {
          id: 'footer',
          name: 'Footer',
          type: 'footer',
          order_index: 2,
          is_enabled: true,
          settings: {},
          blocks: [
            {
              id: 'footer',
              name: 'Footer',
              type: 'footer',
              order_index: 0,
              is_enabled: true,
              settings: {},
              content: {
                socialLinks: {
                  twitter: 'https://twitter.com/memecoin',
                  telegram: 'https://t.me/memecoin',
                  website: 'https://memecoin.com'
                },
                copyright: '© 2024 Meme Coin. All rights reserved.'
              }
            }
          ]
        }
      ]
      
      setSections(defaultSections)
      // Default to 'project' section instead of first section
      setSelectedSection('project')
      
      // Initialize last saved data for default sections
      if (projectData && !lastSavedData) {
        setLastSavedData(projectData)
      }
    } finally {
      setIsLoading(false)
    }
  }, [template?.slug, selectedSection, user, projectData])

  // Save project data to database
  const saveProjectData = useCallback(async () => {
    if (!user || !projectData || !template?.slug) {
      console.log('❌ Save prerequisites not met:', { hasUser: !!user, hasProjectData: !!projectData, hasTemplateSlug: !!template?.slug })
      return
    }

    // Prevent multiple simultaneous saves
    if (isSaving) {
      console.log('🔄 Save already in progress, skipping...')
      return
    }

    try {
      setIsSaving(true)
      setDbError(null)
      
      console.log('💾 Starting save process...', { user: user.id, project: projectData.name, template: template.slug })
      
      // Get template ID from database
      const { data: templateData, error: templateError } = await supabase
        .from('templates')
        .select('id')
        .eq('slug', template.slug)
        .single()
      
      if (templateError) {
        console.error('❌ Error fetching template:', templateError)
        if (templateError.code === '42P01') {
          throw new Error('Templates table does not exist. Please run the database schema.')
        }
        
        if (templateError.code === 'PGRST116') {
          throw new Error('Template not found in database. Please run the database schema.')
        }
        
        throw templateError
      }
      
      if (!templateData) {
        console.error('❌ Template not found in database for slug:', template.slug)
        throw new Error(`Template not found in database for slug: ${template.slug}`)
      }

      console.log('✅ Found template ID:', templateData.id)
      
      // Check if user_projects table exists
      console.log('🔍 Checking if user_projects table exists...')
      const { error: tableCheckError } = await supabase
        .from('user_projects')
        .select('count')
        .limit(1)
      
      if (tableCheckError) {
        console.error('❌ user_projects table check failed:', tableCheckError)
        if (tableCheckError.code === '42P01') {
          throw new Error('user_projects table does not exist. Please run the database schema.')
        }
        throw tableCheckError
      }
      
      console.log('✅ user_projects table exists')
      
      // Use currentProjectId if available; otherwise use a concrete id on projectData, else treat as new
      let projectId: string | null = currentProjectId || (projectData.id && projectData.id !== 'new-project' ? projectData.id : null)

      // If provided id isn’t owned, treat as new (save-as)
      if (projectId && user) {
        const { data: ownedRow, error: ownedErr } = await supabase
          .from('user_projects')
          .select('id, user_id')
          .eq('id', projectId)
          .maybeSingle()
        if (!ownedRow || ownedErr || ownedRow.user_id !== user.id) {
          projectId = null
        }
      }

      if (projectId) {
        // Update existing project
        const { error } = await supabase
          .from('user_projects')
          .update({
            name: projectData.name,
            data: { ...projectData, id: projectId },
            updated_at: new Date().toISOString()
          })
          .eq('id', projectId)
        
        if (error) throw error
        console.log('✅ Existing project updated successfully!')
      } else {
        // This should never happen since we create projects in loadTemplateStructure
        console.warn('⚠️ No projectId found in saveProjectData - this should not happen')
      }

      console.log('✅ Project saved successfully!')
      setLastSavedData(projectData)
      setHasUnsavedChanges(false)
      onSave()
    } catch (error) {
      console.error('❌ Error saving project:', error)
      // Show error to user
      setDbError(error instanceof Error ? error.message : 'Error saving project')
    } finally {
      setIsSaving(false)
    }
  }, [user, projectData, template?.slug, onSave])

  // Track unsaved changes
  useEffect(() => {
    if (!projectData || !lastSavedData) return
    
    const hasChanges = JSON.stringify(projectData) !== JSON.stringify(lastSavedData)
    setHasUnsavedChanges(hasChanges)
  }, [projectData, lastSavedData])

  // Auto-save on content changes with debouncing (only for existing projects)
  useEffect(() => {
    if (!projectData || !currentProjectId) return
    
    const timeoutId = setTimeout(() => {
      saveProjectData()
    }, 3000) // Auto-save after 3 seconds of inactivity

    return () => clearTimeout(timeoutId)
  }, [projectData, saveProjectData, currentProjectId])

  // Load template structure on mount
  useEffect(() => {
    loadTemplateStructure()
  }, [loadTemplateStructure])

  // Handle section selection
  const handleSectionSelect = (sectionId: string) => {
    setSelectedSection(sectionId)
    // If the section is a header/nav, auto-focus its nav block if present
    const section = sections.find(s => s.id === sectionId)
    const key = (section?.type || section?.name || '').toString().toLowerCase()
    if (key.includes('nav') || key.includes('header')) {
      const navBlock = (section?.blocks || []).find((b: any) => {
        const bt = (b?.type || b?.name || '').toString().toLowerCase()
        return bt.includes('nav') || bt.includes('header')
      })
      setSelectedBlock(navBlock ? navBlock.id : null)
      return
    }
    setSelectedBlock(null)
  }

  // Handle block selection
  const handleBlockSelect = (blockId: string) => {
    setSelectedBlock(blockId)
  }

  // Handle section reorder
  const handleSectionReorder = async (sectionId: string, newIndex: number) => {
    const updatedSections = [...sections]
    const sectionIndex = updatedSections.findIndex(s => s.id === sectionId)
    if (sectionIndex !== -1) {
      const [section] = updatedSections.splice(sectionIndex, 1)
      updatedSections.splice(newIndex, 0, section)
      setSections(updatedSections)
      
      // Update in database
      try {
        await supabase
          .from('user_project_sections')
          .update({ order_index: newIndex })
          .eq('id', sectionId)
      } catch (error) {
        console.error('Error updating section order:', error)
      }
    }
  }

  // Handle block reorder
  const handleBlockReorder = async (sectionId: string, blockId: string, newIndex: number) => {
    const updatedSections = [...sections]
    const section = updatedSections.find(s => s.id === sectionId)
    if (section) {
      const blockIndex = section.blocks.findIndex((b: any) => b.id === blockId)
      if (blockIndex !== -1) {
        const [block] = section.blocks.splice(blockIndex, 1)
        section.blocks.splice(newIndex, 0, block)
        setSections(updatedSections)
        
        // Update in database
        try {
          await supabase
            .from('user_project_blocks')
            .update({ order_index: newIndex })
            .eq('id', blockId)
        } catch (error) {
          console.error('Error updating block order:', error)
        }
      }
    }
  }

  // Handle section toggle
  const normalizeSectionKey = (section: any): string => {
    const key = (section?.type || section?.name || '').toString().toLowerCase().replace(/\s+/g, '')
    if (key.includes('nav') || key.includes('header')) return 'navbar'
    if (key.includes('footer')) return 'footer'
    if (key.includes('roadmap')) return 'roadmap'
    if (key.includes('team')) return 'team'
    if (key.includes('about')) return 'about'
    if (key.includes('token')) return 'tokenomics'
    if (key.includes('hero')) return 'hero'
    return key
  }

  // Deduplicate sections and blocks for UI display only (keeps first by order)
  const getUniqueSectionsForUI = (list: any[]) => {
    const seenSectionKeys = new Set<string>()
    const unique: any[] = []
    const sorted = [...(list || [])].sort((a, b) => (a?.order_index ?? 0) - (b?.order_index ?? 0))
    for (const section of sorted) {
      const key = normalizeSectionKey(section)
      if (seenSectionKeys.has(key)) continue
      seenSectionKeys.add(key)
      // Dedupe blocks by type/name
      const seenBlocks = new Set<string>()
      const uniqueBlocks = (section.blocks || [])
        .sort((a: any, b: any) => (a?.order_index ?? 0) - (b?.order_index ?? 0))
        .filter((b: any) => {
          const bk = (b?.type || b?.name || '').toString().toLowerCase().trim()
          if (seenBlocks.has(bk)) return false
          seenBlocks.add(bk)
          return true
        })
      unique.push({ ...section, blocks: uniqueBlocks })
    }
    return unique
  }

  const handleSectionToggle = async (sectionId: string, isEnabled: boolean) => {
    // Cascade toggle to all sections of the same normalized type (e.g., multiple Headers)
    const baseSection = sections.find(s => s.id === sectionId)
    const baseKey = baseSection ? normalizeSectionKey(baseSection) : null

    const affectedIds: string[] = []
    const updatedSections = sections.map(section => {
      const sameGroup = baseKey && normalizeSectionKey(section) === baseKey
      if (sameGroup) {
        affectedIds.push(section.id)
        return { ...section, is_enabled: isEnabled }
      }
      return section
    })
    setSections(updatedSections)

    // Update in database for all affected sections
    try {
      await Promise.all(
        affectedIds.map(id =>
          supabase
            .from('user_project_sections')
            .update({ is_enabled: isEnabled })
            .eq('id', id)
        )
      )
    } catch (error) {
      console.error('Error updating section visibility:', error)
    }
  }

  // Handle block toggle
  const handleBlockToggle = async (blockId: string, isEnabled: boolean) => {
    const updatedSections = sections.map(section => ({
      ...section,
      blocks: section.blocks.map((block: any) =>
        block.id === blockId ? { ...block, is_enabled: isEnabled } : block
      )
    }))
    setSections(updatedSections)
    
    // Update in database
    try {
      await supabase
        .from('user_project_blocks')
        .update({ is_enabled: isEnabled })
        .eq('id', blockId)
    } catch (error) {
      console.error('Error updating block visibility:', error)
    }
  }

  // Handle section settings update
  const handleSectionSettingsUpdate = async (sectionId: string, settings: any) => {
    const updatedSections = sections.map(section =>
      section.id === sectionId ? { ...section, settings } : section
    )
    setSections(updatedSections)
    
    // Update in database
    try {
      await supabase
        .from('user_project_sections')
        .update({ settings })
        .eq('id', sectionId)
    } catch (error) {
      console.error('Error updating section settings:', error)
    }
  }

  // Handle block settings update
  const handleBlockSettingsUpdate = async (blockId: string, settings: any) => {
    const updatedSections = sections.map(section => ({
      ...section,
      blocks: section.blocks.map((block: any) => {
        if (block.id === blockId) {
          return { ...block, settings }
        }
        return block
      })
    }))
    setSections(updatedSections)
    
    // Update in database
    try {
      await supabase
        .from('user_project_blocks')
        .update({ settings })
        .eq('id', blockId)
    } catch (error) {
      console.error('Error updating block settings:', error)
    }
  }

  // Handle block content update
  const handleBlockContentUpdate = async (blockId: string, content: any) => {
    console.log('🔄 Updating block content:', { blockId, content })
    
    const updatedSections = sections.map(section => ({
      ...section,
      blocks: section.blocks.map((block: any) => {
        if (block.id === blockId) {
          return { ...block, content }
        }
        return block
      })
    }))
    setSections(updatedSections)
    
    // Update in database
    try {
      const { error } = await supabase
        .from('user_project_blocks')
        .update({ content })
        .eq('id', blockId)
      
      if (error) {
        console.error('❌ Error updating block content in database:', error)
      } else {
        console.log('✅ Successfully updated block content in database for block:', blockId, 'with content:', content)
      }
    } catch (error) {
      console.error('❌ Error updating block content:', error)
    }
  }

  // Handle brand color changes
  const handleColorChange = (
    colorType: 'primary' | 'secondary' | 'accent' | 'background',
    color: string
  ) => {
    const updated = {
      ...projectData,
      colors: {
        ...(projectData?.colors || {}),
        [colorType]: color,
      },
    }
    onContentChange(updated)
  }

  // Handle project selection
  const handleProjectSelect = async (selectedProject: any) => {
    console.log('✅ User selected project:', selectedProject.id)
    setCurrentProjectId(selectedProject.id)
    setShowProjectSelector(false)
    
    // Load the actual project data from database
    try {
      console.log('🔄 Loading project data from database...')
      const { data: projectDataFromDb, error } = await supabase
        .from('user_projects')
        .select('data')
        .eq('id', selectedProject.id)
        .single()
      
      if (error) {
        console.error('❌ Error loading project data:', error)
        // Fallback to default data
        onContentChange({ ...projectData, id: selectedProject.id })
      } else if (projectDataFromDb?.data) {
        console.log('✅ Loaded project data from database')
        // Use the actual project data from database
        onContentChange({ ...projectDataFromDb.data, id: selectedProject.id })
      } else {
        console.warn('⚠️ No project data found in database, using default')
        onContentChange({ ...projectData, id: selectedProject.id })
      }
    } catch (error) {
      console.error('❌ Error in handleProjectSelect:', error)
      // Fallback to default data
      onContentChange({ ...projectData, id: selectedProject.id })
    }
  }

  // Handle create new project
  const handleCreateNewProject = () => {
    console.log('🔄 User chose to create new project')
    setShowProjectSelector(false)
    // Continue with new project creation
    loadTemplateStructure()
  }

  // Render the template with current data
  const renderTemplate = () => {
    try {
      // Transform the data to match the expected template structure
      // Extract navbar block content if available
      const navbarBlock = (sections || [])
        .flatMap((s: any) => s?.blocks || [])
        .find((b: any) => {
          const t = (b?.type || b?.name || '').toString().toLowerCase()
          return t.includes('nav') || t.includes('header')
        })
      const navbarContent = (navbarBlock && (navbarBlock as any).content) || {}
      console.log('🔄 Navbar content:', navbarContent)
      // Extract header section settings if available
      const headerSection = (sections || []).find((s: any) => normalizeSectionKey(s) === 'navbar')
      const headerSettings = (headerSection && (headerSection as any).settings) || {}

      const templateData = {
      tokenInfo: {
          name: projectData?.name || 'MEME Token',
          symbol: projectData?.tokenInfo?.symbol || 'MEME',
          contractAddress: projectData?.tokenInfo?.contractAddress || '0x1234567890abcdef1234567890abcdef12345678',
          description: projectData?.content?.hero?.description || 'Join the revolution with our innovative meme coin that combines humor, community, and cutting-edge blockchain technology.'
        },
        branding: {
          primaryColor: projectData?.colors?.primary || template?.colors?.primary,
          secondaryColor: projectData?.colors?.secondary || template?.colors?.secondary,
          accentColor: projectData?.colors?.accent || template?.colors?.accent,
          backgroundColor: projectData?.colors?.background || (template?.colors as any)?.background || '#ffffff',
          logo: headerSettings.logoUrl || navbarContent.logoUrl || projectData?.branding?.logo || '',
          banner: projectData?.branding?.banner || ''
        },
        social: {
          twitter: (headerSettings.social || {}).twitter || (navbarContent.social || {}).twitter || projectData?.social?.twitter || 'https://twitter.com/memecoin',
          telegram: (headerSettings.social || {}).telegram || (navbarContent.social || {}).telegram || projectData?.social?.telegram || 'https://t.me/memecoin',
          discord: (headerSettings.social || {}).discord || (navbarContent.social || {}).discord || projectData?.social?.discord || 'https://discord.gg/memetoken',
          website: (headerSettings.social || {}).website || (navbarContent.social || {}).website || projectData?.social?.website || 'https://memetoken.com'
      },
      header: {
        navItems: headerSettings.navItems || navbarContent.navItems || projectData?.header?.navItems || [
          { label: 'About', href: '#about' },
          { label: 'Tokenomics', href: '#tokenomics' },
          { label: 'Roadmap', href: '#roadmap' },
          { label: 'Team', href: '#team' }
        ],
        cta: headerSettings.cta || navbarContent.cta || projectData?.header?.cta || { text: 'Buy Now', href: undefined },
        colors: {
          primary: navbarContent.primaryColor || projectData?.colors?.primary || template?.colors?.primary,
          secondary: navbarContent.secondaryColor || projectData?.colors?.secondary || template?.colors?.secondary,
          socialBgColor: navbarContent.socialBgColor,
          socialIconColor: navbarContent.socialIconColor,
          buttonBgColor: navbarContent.buttonBgColor,
          buttonTextColor: navbarContent.buttonTextColor,
          navTextColor: navbarContent.navTextColor,
          navBgColor: navbarContent.navBgColor,
          tokenNameColor: navbarContent.tokenNameColor
        },
        displayName: navbarContent.displayName || projectData?.tokenInfo?.symbol
      },
      content: {
        hero: {
            title: projectData?.content?.hero?.title || 'Welcome to the Future',
            subtitle: projectData?.content?.hero?.subtitle || 'The Next Big Thing in Crypto',
            description: projectData?.content?.hero?.description || 'Join the revolution with our innovative meme coin that combines humor, community, and cutting-edge blockchain technology.'
        },
        about: {
            title: projectData?.content?.about?.title || 'About Our Project',
            content: projectData?.content?.about?.description || 'We are building something special that will change the crypto landscape forever.',
            description: projectData?.content?.about?.description || 'We are building something special that will change the crypto landscape forever.',
            features: projectData?.content?.about?.features || [
              { title: 'Community Driven', description: 'Built by the community, for the community', icon: '👥' },
              { title: 'Transparent', description: 'All transactions and decisions are public', icon: '🔍' },
              { title: 'Innovative', description: 'Pushing the boundaries of what is possible', icon: '💡' }
            ]
          },
          features: projectData?.content?.about?.features || [
            { title: 'Community Driven', description: 'Built by the community, for the community', icon: '👥' },
            { title: 'Transparent', description: 'All transactions and decisions are public', icon: '🔍' },
            { title: 'Innovative', description: 'Pushing the boundaries of what is possible', icon: '💡' }
          ],
          tokenomics: {
            title: projectData?.content?.tokenomics?.title || 'Tokenomics',
            description: projectData?.content?.tokenomics?.description || 'Fair and transparent token distribution',
            totalSupply: projectData?.content?.tokenomics?.totalSupply || '1,000,000,000',
            distribution: projectData?.content?.tokenomics?.distribution || [
              { name: 'Liquidity', percentage: 40, color: '#FF6B6B' },
              { name: 'Community', percentage: 30, color: '#4ECDC4' },
              { name: 'Team', percentage: 15, color: '#45B7D1' },
              { name: 'Marketing', percentage: 10, color: '#96CEB4' },
              { name: 'Development', percentage: 5, color: '#FFEAA7' }
            ]
          },
          team: projectData?.content?.team?.members || [
            { name: 'Alex Johnson', role: 'Founder & CEO', avatar: '👨', social: '@alexjohnson' },
            { name: 'Sarah Chen', role: 'Lead Developer', avatar: '👩', social: '@sarahchen' },
            { name: 'Mike Rodriguez', role: 'Marketing Director', avatar: '👨', social: '@mikerodriguez' }
          ],
          roadmap: projectData?.content?.roadmap?.phases || [
            { title: 'Phase 1: Launch', description: 'Initial token launch and community building', date: 'Q1 2024', completed: true },
            { title: 'Phase 2: Development', description: 'Core features and platform development', date: 'Q2 2024', completed: false },
            { title: 'Phase 3: Expansion', description: 'Partnerships and ecosystem growth', date: 'Q3 2024', completed: false }
          ]
        }
      }

      // Build visibility from enabled sections/blocks
      const currentSections = sections
        .filter((s) => s.is_enabled !== false)
        .map((s) => ({
          ...s,
          blocks: (s.blocks || []).filter((b: any) => b.is_enabled !== false),
        }))

      const visibilityMap: Record<string, boolean> = {}
      for (const s of sections) {
        const normalized = normalizeSectionKey(s)
        visibilityMap[normalized] = s.is_enabled !== false
      }

      console.log('Rendering template with data and visibility:', visibilityMap)

      // Inline editing callbacks
      const handleEditHero = (field: 'title' | 'subtitle' | 'description', value: string) => {
        const updated = {
          ...projectData,
          content: {
            ...projectData?.content,
            hero: {
              ...projectData?.content?.hero,
              [field]: value
            }
          }
        }
        onContentChange(updated)
      }

      const handleEditAbout = (field: 'title' | 'content', value: string) => {
        const updated = {
          ...projectData,
          content: {
            ...projectData?.content,
            about: {
              ...projectData?.content?.about,
              [field]: value
            }
          }
        }
        onContentChange(updated)
      }

      switch (template?.id) {
        case 'neon':
          return (
            <NeonTemplate 
              projectData={templateData} 
              visibility={visibilityMap as any}
              onEdit={{
                hero: {
                  title: (v: string) => handleEditHero('title', v),
                  subtitle: (v: string) => handleEditHero('subtitle', v),
                  description: (v: string) => handleEditHero('description', v)
                },
                about: {
                  title: (v: string) => handleEditAbout('title', v),
                  content: (v: string) => handleEditAbout('content', v)
                }
              }}
            />
          )
        case 'classic':
          return (
            <ClassicTemplate 
              projectData={templateData} 
              visibility={visibilityMap as any}
              onEdit={{
                hero: {
                  title: (v: string) => handleEditHero('title', v),
                  subtitle: (v: string) => handleEditHero('subtitle', v),
                  description: (v: string) => handleEditHero('description', v)
                },
                about: {
                  title: (v: string) => handleEditAbout('title', v),
                  content: (v: string) => handleEditAbout('content', v)
                }
              }}
            />
          )
        case 'minimal':
          return (
            <MinimalTemplate 
              projectData={templateData} 
              visibility={visibilityMap as any}
              onEdit={{
                hero: {
                  title: (v: string) => handleEditHero('title', v),
                  subtitle: (v: string) => handleEditHero('subtitle', v),
                  description: (v: string) => handleEditHero('description', v)
                },
                about: {
                  title: (v: string) => handleEditAbout('title', v),
                  content: (v: string) => handleEditAbout('content', v)
                }
              }}
            />
          )
        default:
          return <div className="p-8 text-center text-gray-500">Template not found</div>
      }
    } catch (error) {
      console.error('Error rendering template:', error)
      return <div className="p-8 text-center text-red-500">Error rendering template</div>
    }
  }



    return (
      <div className="h-screen flex flex-col bg-gray-50 relative">
        {/* Floating Save Button for Unsaved Changes (only for existing projects) */}
        {hasUnsavedChanges && currentProjectId && (
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={saveProjectData}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 transition-all duration-200"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        )}
      {/* Database Setup Guide */}
      <DatabaseStatus error={dbError || undefined} />
      
      {/* Top Bar - Professional minimalist */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="min-w-0 flex-1 flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div className="truncate text-sm text-gray-900 font-medium">{projectData?.name || 'Untitled Project'}</div>
          <div className="hidden sm:block text-xs text-gray-500">Editing</div>
        </div>

        <div className="flex items-center gap-2">
          {/* Preview Button */}
          <button
            onClick={async () => {
              await saveProjectData()
              // Generate unique version ID for this preview
              const versionId = crypto.randomUUID().split('-')[0] // Use first part of UUID for shorter version
              const projectId = currentProjectId || (projectData?.id && projectData.id !== 'new-project' ? projectData.id : '')
              // Open production preview in new tab
              window.open(`/preview/${projectId}/${versionId}`, '_blank')
            }}
            disabled={isSaving}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Save & Preview"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>

          {/* Save Button */}
          <button
            onClick={saveProjectData}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save
              </>
            )}
          </button>

          {/* Save & Exit Button */}
          <button
            onClick={async () => {
              await saveProjectData()
              // Redirect to dashboard and open Projects tab via hash
              window.location.href = '/dashboard#projects'
            }}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Save & Exit
              </>
            )}
          </button>
        </div>
      </div>

      {/* Pane Switcher (visible until 2xl) */}
      <div className="2xl:hidden border-b border-gray-200 bg-white">
        <div className="px-2 py-2 flex items-center justify-between gap-2">
          <button
            className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${activePane === 'structure' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-700'}`}
            onClick={() => setActivePane('structure')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActivePane('structure') }}
            aria-label="Show Structure"
            tabIndex={0}
          >
            Structure
          </button>
          <button
            className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${activePane === 'preview' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-700'}`}
            onClick={() => setActivePane('preview')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActivePane('preview') }}
            aria-label="Show Preview"
            tabIndex={0}
          >
            Preview
          </button>
          <button
            className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${activePane === 'settings' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-700'}`}
            onClick={() => setActivePane('settings')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActivePane('settings') }}
            aria-label="Show Settings"
            tabIndex={0}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Main Content - Stacked until 2xl, three-panel at 2xl+ */}
      <div className="flex-1 flex flex-col 2xl:flex-row overflow-hidden">
        {/* Left Sidebar - Sections */}
        <div className={`bg-white border-r border-gray-200 transition-all duration-300 min-h-0 ${
          // Show only when active until 2xl
          activePane === 'structure' ? 'flex' : 'hidden'
        } 2xl:flex flex-col ${
          // Width behavior: full width until 2xl, fixed widths at 2xl+
          sidebarCollapsed ? 'w-full 2xl:w-16' : 'w-full 2xl:w-80'
        }`}>
          {/* Sidebar Header */}
          <div className="px-4 sm:px-6 py-3 border-b border-gray-200 flex items-center justify-between">
            {!sidebarCollapsed && (
              <h3 className="text-sm font-semibold text-gray-900">Structure</h3>
            )}

            {/* Collapse/Expand Button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            {sidebarCollapsed ? (
              <>
                {/* Collapsed state - show icons only */}
                <div className="p-2 space-y-2">
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                </div>
              </>
            ) : (
              <>
                {isLoading ? (
                      <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-500">Loading sections...</p>
                      </div>
                    ) : (
                      <div className="p-4 space-y-2">
                        {/* Project node */}
                        <div className="space-y-2">
                          <div
                            className={`group cursor-pointer rounded-lg border transition-all ${
                              selectedSection === 'project'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                            onClick={() => handleSectionSelect('project')}
                          >
                            <div className="px-4 py-3 flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-sm font-medium text-gray-900">Project</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {getUniqueSectionsForUI(sections).map((section: any) => (
                          <div key={section.id} className="space-y-2">
                            {/* Section Header */}
                            <div 
                              className={`group cursor-pointer rounded-lg border transition-all ${
                                selectedSection === section.id 
                                  ? 'border-blue-500 bg-blue-50' 
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                              onClick={() => handleSectionSelect(section.id)}
                            >
                              <div className="px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-2 h-2 rounded-full ${
                                    section.is_enabled ? 'bg-green-500' : 'bg-gray-300'
                                  }`}></div>
                                  <span className="text-sm font-medium text-gray-900">{section.name}</span>
                                </div>
                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleSectionToggle(section.id, !section.is_enabled)
                                    }}
                                    className="p-1 text-gray-400 hover:text-gray-600"
                                  >
                                    {section.is_enabled ? (
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                    ) : (
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                      </svg>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            {/* Section Blocks */}
                            {selectedSection === section.id && (
                              <div className="ml-6 space-y-1">
                                {section.blocks.map((block: any) => (
                                  <div 
                                    key={block.id}
                                    className={`group cursor-pointer rounded-md border transition-all ${
                                      selectedBlock === block.id 
                                        ? 'border-blue-400 bg-blue-25' 
                                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-25'
                                    }`}
                                    onClick={() => handleBlockSelect(block.id)}
                                  >
                                    <div className="px-3 py-2 flex items-center justify-between">
                                      <div className="flex items-center space-x-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${
                                          block.is_enabled ? 'bg-green-400' : 'bg-gray-300'
                                        }`}></div>
                                        <span className="text-xs font-medium text-gray-700">{block.name}</span>
                                        {(block?.type?.toLowerCase?.().includes('nav') || block?.name?.toLowerCase?.().includes('nav')) && (
                                          <span className="ml-2 inline-flex items-center rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 border border-blue-200">Header</span>
                                        )}
                                      </div>
                                      <div className="flex items-center space-x-1 opacity-100">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleBlockToggle(block.id, !block.is_enabled)
                                          }}
                                          className="p-0.5 text-gray-400 hover:text-gray-600"
                                        >
                                          {block.is_enabled ? (
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                          ) : (
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                            </svg>
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
          </div>
        </div>

        {/* Center Preview Area - 1:1 rendering */}
        <div className={`${activePane === 'preview' ? 'block' : 'hidden'} 2xl:block flex-1 bg-white overflow-auto min-h-0`}>
          {renderTemplate()}
        </div>

        {/* Right Sidebar - Settings */}
        <div className={`${activePane === 'settings' ? 'flex' : 'hidden'} 2xl:flex w-full 2xl:w-80 bg-white border-l border-gray-200 flex-col min-h-0`}>
          {/* Settings Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
            <p className="text-sm text-gray-500 mt-1">
              {selectedBlock ? 'Block Settings' : selectedSection ? 'Section Settings' : 'Select a section or block to customize'}
            </p>
          </div>
          
          {/* Settings Content */}
          <div className="flex-1 overflow-y-auto">
            {selectedSection === 'project' ? (
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Project Settings</h3>
                  <p className="text-xs text-gray-600 mb-3">Update general settings for your project.</p>
                </div>

                {/* Project Name */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Project Name</label>
                  <input
                    type="text"
                    value={projectData.name}
                    onChange={(e) => onContentChange({ ...projectData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter project name"
                  />
                </div>

                {/* Social Links */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Social Links</label>
                  <input
                    type="text"
                    value={(projectData as any).social?.twitter || (projectData as any).content?.social?.twitter || ''}
                    onChange={(e) => onContentChange({
                      ...projectData,
                      social: { ...(projectData as any).social, twitter: e.target.value },
                      content: {
                        ...projectData.content,
                        social: { ...(projectData.content as any)?.social, twitter: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Twitter URL"
                  />
                  <input
                    type="text"
                    value={(projectData as any).social?.telegram || (projectData as any).content?.social?.telegram || ''}
                    onChange={(e) => onContentChange({
                      ...projectData,
                      social: { ...(projectData as any).social, telegram: e.target.value },
                      content: {
                        ...projectData.content,
                        social: { ...(projectData.content as any)?.social, telegram: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Telegram URL"
                  />
                  <input
                    type="text"
                    value={(projectData as any).social?.discord || (projectData as any).content?.social?.discord || ''}
                    onChange={(e) => onContentChange({
                      ...projectData,
                      social: { ...(projectData as any).social, discord: e.target.value },
                      content: {
                        ...projectData.content,
                        social: { ...(projectData.content as any)?.social, discord: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Discord URL"
                  />

                </div>

                {/* Branding Logo */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Branding Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = () => {
                        onContentChange({
                          ...projectData,
                          branding: { ...(projectData as any).branding, logo: String(reader.result) }
                        })
                      }
                      reader.readAsDataURL(file)
                    }}
                    className="block w-full text-xs text-gray-700"
                  />
                  {(projectData as any)?.branding?.logo && (
                    <img src={(projectData as any).branding.logo} alt="Logo preview" className="h-12 w-12 rounded object-cover" />
                  )}
                </div>

                {/* Brand Colors */}
                <div className="pt-4 border-t border-gray-100">
                  <ColorPicker
                    colors={{
                      primary: projectData?.colors?.primary || template?.colors?.primary || '#000000',
                      secondary: projectData?.colors?.secondary || template?.colors?.secondary || '#666666',
                      accent: projectData?.colors?.accent || template?.colors?.accent || '#ff6b6b',
                      background: projectData?.colors?.background || (template?.colors as any)?.background || '#ffffff',
                    }}
                    onColorChange={handleColorChange}
                  />
                </div>
              </div>
            ) : selectedBlock ? (
              <BlockSettings
                block={sections
                  .flatMap(s => s.blocks)
                  .find(b => b.id === selectedBlock)}
                template={template}
                onSettingsChange={(settings) => handleBlockSettingsUpdate(selectedBlock, settings)}
                onContentChange={(content) => handleBlockContentUpdate(selectedBlock, content)}
                onToggleEnabled={(blockId, enabled) => handleBlockToggle(blockId, enabled)}
              />
            ) : selectedSection ? (
              <SectionSettings
                section={sections.find(s => s.id === selectedSection)}
                onSettingsChange={(settings) => handleSectionSettingsUpdate(selectedSection, settings)}
                onToggleEnabled={(sectionId, enabled) => handleSectionToggle(sectionId, enabled)}
              />
            ) : (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Customize Your Template</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Select a section or block in the sidebar to start customizing your template.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Keyboard Shortcuts</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Save</span>
                      <span className="font-mono">⌘ S</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Undo</span>
                      <span className="font-mono">⌘ Z</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Redo</span>
                      <span className="font-mono">⌘ Y</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Selection Modal */}
      {showProjectSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Choose a Project</h3>
              <p className="text-sm text-gray-600 mt-1">
                You have existing projects for this template. Which one would you like to continue working on?
              </p>
            </div>
            
            <div className="px-6 py-4 max-h-96 overflow-y-auto">
              {isLoadingProjects ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading projects...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {existingProjects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleProjectSelect(project)}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{project.name}</h4>
                          <p className="text-sm text-gray-500">
                            Last updated: {new Date(project.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={handleCreateNewProject}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Create New Project
                </button>
                <button
                  onClick={() => setShowProjectSelector(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
