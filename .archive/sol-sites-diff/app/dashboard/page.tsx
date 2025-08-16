"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { projectService, templateService } from '@/lib/services'
import { UserProject, Template } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  ExternalLink, 
  LogOut, 
  Home,
  Folder,
  Layout as TemplateIcon,
  Settings,
  BarChart3,
  Globe,
  Menu,
  X,
  Sparkles,
  Users,
  Clock,
  ArrowRight,
  Check,
  AlertCircle,
  Copy,
  RefreshCw
} from 'lucide-react'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<UserProject[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [editingDomain, setEditingDomain] = useState<string | null>(null)
  const [newDomain, setNewDomain] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [domainStatus, setDomainStatus] = useState<{[key: string]: 'available' | 'taken' | 'checking' | 'invalid'}>({})
  const [showMobileRightPanel, setShowMobileRightPanel] = useState(false)

  useEffect(() => {
    if (user && !loading) {
      loadData()
    }
  }, [user, loading])

  // Read hash to select default tab (e.g., /dashboard#projects)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '')
      if (hash && ['overview','projects','templates','analytics','domains','settings'].includes(hash)) {
        setActiveTab(hash)
      }
    }
  }, [])

  const loadData = async () => {
    try {
      const [userProjects, allTemplates] = await Promise.all([
        projectService.getUserProjects(user!.id),
        templateService.getAllTemplates()
      ])
      setProjects(userProjects)
      setTemplates(allTemplates)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateProject = async (templateId: string) => {
    if (!user) return

    try {
      const projectName = prompt('Enter your project name:')
      if (!projectName) return

      const project = await projectService.createProject({
        user_id: user.id,
        template_id: templateId,
        name: projectName,
        slug: `${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
        domain: `${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}.solsites.fun`,
        data: {
          tokenInfo: {
            name: projectName,
            symbol: projectName.substring(0, 4).toUpperCase(),
            contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
            description: 'Join the revolution with our innovative meme coin that combines humor, community, and cutting-edge blockchain technology.'
          },
          branding: {
            primaryColor: '#3B82F6',
            secondaryColor: '#1E40AF',
            accentColor: '#F59E0B',
            logo: '🚀',
            banner: 'https://picsum.photos/1200/400'
          },
          social: {
            twitter: 'https://twitter.com/memetoken',
            telegram: 'https://t.me/memetoken',
            discord: 'https://discord.gg/memetoken',
            website: 'https://memetoken.com'
          },
          content: {
            hero: {
              title: 'Welcome to the Future',
              subtitle: 'The Next Big Thing in Crypto',
              description: 'Join the revolution with our innovative meme coin that combines humor, community, and cutting-edge blockchain technology.'
            },
            about: {
              title: 'About Our Project',
              content: 'We\'re building something special that will change the crypto landscape forever.'
            },
            features: [
              {
                title: 'Community Driven',
                description: 'Built by the community, for the community.',
                icon: 'users'
              },
              {
                title: 'Transparent',
                description: 'Full transparency in all our operations and decisions.',
                icon: 'eye'
              },
              {
                title: 'Innovative',
                description: 'Cutting-edge technology and forward-thinking approach.',
                icon: 'zap'
              }
            ],
            roadmap: [
              {
                title: 'Phase 1: Launch',
                description: 'Initial token launch and community building',
                date: 'Q1 2024',
                completed: true
              },
              {
                title: 'Phase 2: Development',
                description: 'Core features and platform development',
                date: 'Q2 2024',
                completed: false
              },
              {
                title: 'Phase 3: Expansion',
                description: 'Partnerships and ecosystem growth',
                date: 'Q3 2024',
                completed: false
              }
            ],
            team: [
              {
                name: 'Alex Johnson',
                role: 'Founder & CEO',
                avatar: '',
                social: 'https://twitter.com/alexjohnson'
              },
              {
                name: 'Sarah Chen',
                role: 'Lead Developer',
                avatar: '',
                social: 'https://twitter.com/sarahchen'
              },
              {
                name: 'Mike Rodriguez',
                role: 'Marketing Director',
                avatar: '',
                social: 'https://twitter.com/mikerodriguez'
              }
            ]
          }
        },
        is_published: false
      })

      setProjects([project, ...projects])
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project')
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      await projectService.deleteProject(projectId)
      setProjects(projects.filter(p => p.id !== projectId))
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project')
    }
  }

  // Domain management functions
  const handleEditDomain = (projectId: string, currentDomain: string) => {
    setEditingDomain(projectId)
    setNewDomain(currentDomain.replace('.solsites.fun', ''))
    setDomainStatus({})
  }

  const checkDomainAvailability = async (domain: string) => {
    if (!domain || domain.length < 3) {
      setDomainStatus(prev => ({ ...prev, [editingDomain!]: 'invalid' }))
      return
    }

    setIsChecking(true)
    setDomainStatus(prev => ({ ...prev, [editingDomain!]: 'checking' }))

    // Simulate domain availability check
    setTimeout(() => {
      const isAvailable = Math.random() > 0.3 // 70% chance of being available for demo
      setDomainStatus(prev => ({ 
        ...prev, 
        [editingDomain!]: isAvailable ? 'available' : 'taken' 
      }))
      setIsChecking(false)
    }, 1000)
  }

  const handleSaveDomain = async () => {
    if (!editingDomain || !newDomain || domainStatus[editingDomain] !== 'available') return

    try {
      const fullDomain = `${newDomain.toLowerCase().replace(/[^a-z0-9-]/g, '-')}.solsites.fun`
      
      // Update project domain in database
      await projectService.updateProject(editingDomain, {
        domain: fullDomain
      })

      // Update local state
      setProjects(projects.map(p => 
        p.id === editingDomain 
          ? { ...p, domain: fullDomain }
          : p
      ))

      setEditingDomain(null)
      setNewDomain('')
      setDomainStatus({})
    } catch (error) {
      console.error('Error updating domain:', error)
      alert('Failed to update domain')
    }
  }

  const handleCancelEdit = () => {
    setEditingDomain(null)
    setNewDomain('')
    setDomainStatus({})
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access your dashboard</h1>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  const sidebarItems = [
    { id: 'overview', name: 'Overview', icon: Home },
    { id: 'projects', name: 'My Projects', icon: Folder },
    { id: 'templates', name: 'Templates', icon: TemplateIcon, href: '/templates' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'domains', name: 'Domains', icon: Globe },
    { id: 'settings', name: 'Settings', icon: Settings },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              <div className="bg-white rounded-lg p-3 md:p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-1 md:p-2 bg-blue-50 rounded-lg">
                    <Folder className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
                  </div>
                  <div className="ml-2 md:ml-4 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Total Projects</p>
                    <p className="text-lg md:text-2xl font-bold text-gray-900">{projects.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-3 md:p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-1 md:p-2 bg-green-50 rounded-lg">
                    <Globe className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
                  </div>
                  <div className="ml-2 md:ml-4 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Published</p>
                    <p className="text-lg md:text-2xl font-bold text-gray-900">{projects.filter(p => p.is_published).length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-3 md:p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-1 md:p-2 bg-yellow-50 rounded-lg">
                    <Edit className="w-4 h-4 md:w-6 md:h-6 text-yellow-600" />
                  </div>
                  <div className="ml-2 md:ml-4 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Drafts</p>
                    <p className="text-lg md:text-2xl font-bold text-gray-900">{projects.filter(p => !p.is_published).length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-3 md:p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-1 md:p-2 bg-purple-50 rounded-lg">
                    <TemplateIcon className="w-4 h-4 md:w-6 md:h-6 text-purple-600" />
                  </div>
                  <div className="ml-2 md:ml-4 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Templates</p>
                    <p className="text-lg md:text-2xl font-bold text-gray-900">{templates.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Template Browsing */}
            <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Browse Templates</h2>
                  <p className="text-sm text-gray-600">Choose from our professional meme coin templates</p>
                </div>
                <Link href="/templates">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <span className="hidden sm:inline">View All Templates</span>
                    <span className="sm:hidden">View All</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {templates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-3 md:p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <TemplateIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                      <div className="ml-3 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm md:text-base truncate">{template.name}</h3>
                        <p className="text-xs md:text-sm text-gray-500">Professional template</p>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4" style={{ 
                      display: '-webkit-box', 
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden' 
                    }}>{template.description}</p>
                    <div className="space-y-2">
                      <Link href={`/templates/${template.slug}/preview`}>
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                          <span className="text-xs md:text-sm">Preview</span>
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleCreateProject(template.id)}
                        size="sm"
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        <Plus className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                        <span className="text-xs md:text-sm">Use Template</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Projects */}
            {projects.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h2>
                <div className="space-y-3">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-gray-200 rounded-lg gap-3">
                      <div className="flex items-center min-w-0">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Folder className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                        </div>
                        <div className="ml-3 min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm md:text-base truncate">{project.name}</h3>
                          <p className="text-xs md:text-sm text-gray-500 truncate">{project.domain}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                          project.is_published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.is_published ? 'Published' : 'Draft'}
                        </span>
                        <Link href={`/edit/${project.id}`}>
                          <Button size="sm" variant="outline" className="flex-shrink-0">
                            <Edit className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                {projects.length > 3 && (
                  <div className="mt-4 text-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveTab('projects')}
                    >
                      View All Projects
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )

      case 'projects':
        return (
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">My Projects</h1>
                  <p className="text-sm md:text-base text-gray-600">Manage all your meme coin websites</p>
                </div>
                <Button 
                  onClick={() => router.push('/templates')}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>

            {projects.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-6 md:p-12 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Folder className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                </div>
                <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">Create your first meme coin website to get started</p>
                <Button 
                  onClick={() => router.push('/templates')}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                    <div className="p-4 md:p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center min-w-0">
                          <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0 ring-1 ring-inset ring-white/20">
                            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
                          </div>
                          <div className="ml-3 min-w-0">
                            <Link href={`/edit/${project.id}`} className="block font-semibold text-gray-900 text-sm md:text-base truncate hover:underline">
                              {project.name}
                            </Link>
                            <p className="text-xs md:text-sm text-gray-500 truncate">{project.domain || 'No domain yet'}</p>
                          </div>
                        </div>
                        <span className="hidden sm:inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium border-gray-200 text-gray-700">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${project.is_published ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                          {project.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 flex flex-wrap sm:flex-nowrap items-center gap-2">
                        <Link href={`/edit/${project.id}`} className="flex-1 sm:flex-none">
                          <Button size="sm" className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 rounded-md">
                            <Edit className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                            <span className="text-xs md:text-sm">Edit</span>
                          </Button>
                        </Link>
                        <Link href={`/preview/${project.id}`} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                          <Button size="sm" variant="outline" className="w-full border-gray-300 hover:!bg-black/90 hover:!text-white rounded-md">
                            <Eye className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                            <span className="text-xs md:text-sm">Preview</span>
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white border-transparent rounded-md"
                        >
                          <Trash2 className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                          <span className="text-xs md:text-sm">Delete</span>
                        </Button>
                      </div>

                      {/* Footer (mobile) */}
                      <div className="mt-3 sm:hidden">
                        <span className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium border-gray-200 text-gray-700">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${project.is_published ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                          {project.is_published ? 'Published' : 'Draft'}
                        </span>
                        {project.is_published && (
                          <Link href={`https://${project.domain}`} target="_blank" className="ml-2 inline-block">
                            <Button size="sm" variant="outline" className="border-gray-300 rounded-md">
                              <ExternalLink className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                              <span className="text-xs md:text-sm">Live</span>
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'analytics':
        return (
          <div className="space-y-4 md:space-y-6">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="text-sm md:text-base text-gray-600">Track your website performance and visitor insights</p>
            </div>

            {projects.length === 0 ? (
              // No projects message
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 md:p-8 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-blue-900 mb-2">No Analytics Data Yet</h3>
                <p className="text-sm md:text-base text-blue-800 mb-4 md:mb-6">
                  Analytics will appear here once you create and publish your first website. Start building to see your traffic insights!
                </p>
                <div className="flex justify-center">
                  <Link href="/templates">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                      <TemplateIcon className="w-4 h-4 mr-2" />
                      Browse Templates
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Analytics Overview Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                  <div className="bg-white rounded-lg p-3 md:p-6 shadow-sm border">
                    <div className="flex items-center">
                      <div className="p-1 md:p-2 bg-blue-50 rounded-lg">
                        <BarChart3 className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
                      </div>
                      <div className="ml-2 md:ml-4 min-w-0">
                        <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Total Views</p>
                        <p className="text-lg md:text-2xl font-bold text-gray-900">
                          {projects.filter(p => p.is_published).length > 0 ? '2,847' : '0'}
                        </p>
                        <p className="text-xs text-green-600 hidden md:block">
                          {projects.filter(p => p.is_published).length > 0 ? '+12% from last week' : 'No published sites'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 md:p-6 shadow-sm border">
                    <div className="flex items-center">
                      <div className="p-1 md:p-2 bg-green-50 rounded-lg">
                        <Users className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
                      </div>
                      <div className="ml-2 md:ml-4 min-w-0">
                        <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Unique Visitors</p>
                        <p className="text-lg md:text-2xl font-bold text-gray-900">
                          {projects.filter(p => p.is_published).length > 0 ? '1,234' : '0'}
                        </p>
                        <p className="text-xs text-green-600 hidden md:block">
                          {projects.filter(p => p.is_published).length > 0 ? '+8% from last week' : 'No published sites'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 md:p-6 shadow-sm border">
                    <div className="flex items-center">
                      <div className="p-1 md:p-2 bg-purple-50 rounded-lg">
                        <Globe className="w-4 h-4 md:w-6 md:h-6 text-purple-600" />
                      </div>
                      <div className="ml-2 md:ml-4 min-w-0">
                        <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Published Sites</p>
                        <p className="text-lg md:text-2xl font-bold text-gray-900">{projects.filter(p => p.is_published).length}</p>
                        <p className="text-xs text-gray-600 hidden md:block">Active websites</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 md:p-6 shadow-sm border">
                    <div className="flex items-center">
                      <div className="p-1 md:p-2 bg-yellow-50 rounded-lg">
                        <Clock className="w-4 h-4 md:w-6 md:h-6 text-yellow-600" />
                      </div>
                      <div className="ml-2 md:ml-4 min-w-0">
                        <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Avg. Session</p>
                        <p className="text-lg md:text-2xl font-bold text-gray-900">
                          {projects.filter(p => p.is_published).length > 0 ? '2m 34s' : '0s'}
                        </p>
                        <p className="text-xs text-green-600 hidden md:block">
                          {projects.filter(p => p.is_published).length > 0 ? '+15% from last week' : 'No published sites'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytics Charts Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Overview</h3>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Traffic chart coming soon</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Sites</h3>
                    {projects.filter(p => p.is_published).length > 0 ? (
                      <div className="space-y-3">
                        {projects.filter(p => p.is_published).slice(0, 3).map((project, index) => (
                          <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                                {index + 1}
                              </span>
                              <div>
                                <p className="font-medium text-gray-900">{project.name}</p>
                                <p className="text-sm text-gray-500">{project.domain}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">{(Math.random() * 1000 + 100).toFixed(0)} views</p>
                              <p className="text-xs text-green-600">+{(Math.random() * 20 + 5).toFixed(1)}%</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">No published sites to show analytics for</p>
                        <Button 
                          variant="outline" 
                          className="mt-3"
                          onClick={() => setActiveTab('projects')}
                        >
                          Publish a Site
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/templates">
                      <Button variant="outline" className="w-full">
                        <TemplateIcon className="w-4 h-4 mr-2" />
                        Browse Templates
                      </Button>
                    </Link>
                    <Link href="/dashboard/domains">
                      <Button variant="outline" className="w-full">
                        <Globe className="w-4 h-4 mr-2" />
                        Manage Domains
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Export Analytics
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        )

      case 'templates':
        // Redirect to templates page
        if (typeof window !== 'undefined') {
          window.location.href = '/templates'
        }
        return (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Redirecting to Templates...</h3>
            <p className="text-gray-600 mb-4">Please wait while we redirect you to the templates page</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        )

      case 'domains':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Domain Management</h1>
              <p className="text-gray-600">Manage your custom subdomains</p>
            </div>

            {/* Domain Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <Globe className="w-6 h-6 text-blue-600 mt-1 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Custom Subdomains</h3>
                  <p className="text-blue-800 mb-3">
                    All your websites get a custom subdomain in the format: <code className="bg-blue-100 px-2 py-1 rounded text-sm">yourproject.solsites.fun</code>
                  </p>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• Choose any available subdomain name</p>
                    <p>• Only letters, numbers, and hyphens allowed</p>
                    <p>• Minimum 3 characters, maximum 63 characters</p>
                    <p>• Changes take effect immediately after publishing</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects with Domains */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Project Domains</h2>
              
              {projects.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                  <p className="text-gray-600 mb-6">Create a project to get your custom subdomain</p>
                                  <Button 
                  onClick={() => router.push('/templates')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Create Your First Project
                </Button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-white rounded-lg shadow-sm border p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                          <p className="text-sm text-gray-500">Project ID: {project.id.slice(0, 8)}...</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            project.is_published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {project.is_published ? 'Published' : 'Draft'}
                          </span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setActiveTab('projects')}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit Project
                          </Button>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        {editingDomain === project.id ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Subdomain
                              </label>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={newDomain}
                                  onChange={(e) => {
                                    setNewDomain(e.target.value)
                                    if (e.target.value.length >= 3) {
                                      checkDomainAvailability(e.target.value)
                                    } else {
                                      setDomainStatus(prev => ({ ...prev, [project.id]: 'invalid' }))
                                    }
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                                  placeholder="your-project-name"
                                  aria-label="New subdomain"
                                />
                                <span className="text-gray-500">.solsites.fun</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => checkDomainAvailability(newDomain)}
                                  disabled={isChecking}
                                >
                                  {isChecking ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <RefreshCw className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>

                            {/* Domain Status */}
                            {domainStatus[project.id] && (
                              <div className={`flex items-center space-x-2 p-3 rounded-md ${
                                domainStatus[project.id] === 'available' 
                                  ? 'bg-green-50 border border-green-200' 
                                  : domainStatus[project.id] === 'taken'
                                  ? 'bg-red-50 border border-red-200'
                                  : domainStatus[project.id] === 'checking'
                                  ? 'bg-blue-50 border border-blue-200'
                                  : 'bg-yellow-50 border border-yellow-200'
                              }`}>
                                {domainStatus[project.id] === 'available' && (
                                  <>
                                    <Check className="w-4 h-4 text-green-600" />
                                    <span className="text-green-800">Domain is available!</span>
                                  </>
                                )}
                                {domainStatus[project.id] === 'taken' && (
                                  <>
                                    <X className="w-4 h-4 text-red-600" />
                                    <span className="text-red-800">Domain is already taken</span>
                                  </>
                                )}
                                {domainStatus[project.id] === 'checking' && (
                                  <>
                                    <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                                    <span className="text-blue-800">Checking availability...</span>
                                  </>
                                )}
                                {domainStatus[project.id] === 'invalid' && (
                                  <>
                                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                                    <span className="text-yellow-800">Domain must be at least 3 characters</span>
                                  </>
                                )}
                              </div>
                            )}

                            <div className="flex items-center space-x-3">
                              <Button
                                onClick={handleSaveDomain}
                                disabled={domainStatus[project.id] !== 'available'}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Save Domain
                              </Button>
                              <Button
                                variant="outline"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                <Globe className="w-5 h-5 text-gray-400" />
                                <span className="font-mono text-lg text-gray-900">{project.domain}</span>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(project.domain)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditDomain(project.id, project.domain)}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Change Domain
                              </Button>
                              
                              {project.is_published && (
                                <Link href={`https://${project.domain}`} target="_blank">
                                  <Button size="sm" variant="outline">
                                    <ExternalLink className="w-4 h-4 mr-1" />
                                    Visit Site
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )

      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your account and preferences</p>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email Address</p>
                    <p className="text-gray-900">{user?.email}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Email
                  </Button>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Account Created</p>
                    <p className="text-gray-900">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">User ID</p>
                    <p className="text-gray-900 font-mono text-sm">{user?.id}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Copy ID
                  </Button>
                </div>
              </div>
            </div>

            {/* Project Statistics */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                  <p className="text-sm text-gray-600">Total Projects</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{projects.filter(p => p.is_published).length}</p>
                  <p className="text-sm text-gray-600">Published Sites</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{projects.filter(p => !p.is_published).length}</p>
                  <p className="text-sm text-gray-600">Draft Projects</p>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h2>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('domains')}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Manage Domains
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Export Analytics Data
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={signOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/templates">
                  <Button variant="outline" className="w-full">
                    <TemplateIcon className="w-4 h-4 mr-2" />
                    Browse Templates
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/templates')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Project
                </Button>
              </div>
            </div>

            {/* No Projects Message */}
            {projects.length === 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to Get Started?</h3>
                    <p className="text-blue-800 mb-4">
                      You haven't created any projects yet. Start building your first meme coin website by choosing a template.
                    </p>
                    <div className="flex space-x-3">
                      <Link href="/templates">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Browse Templates
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        onClick={() => router.push('/templates')}
                      >
                        Browse Templates
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">This section is under development</p>
          </div>
        )
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5 h-16">
          {sidebarItems.slice(0, 4).map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => item.href ? window.location.href = item.href : setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-colors ${
                  activeTab === item.id
                    ? 'text-purple-700 bg-purple-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="truncate">{item.name.split(' ')[0]}</span>
              </button>
            )
          })}
          <button
            onClick={() => setShowMobileRightPanel(true)}
            className="flex flex-col items-center justify-center space-y-1 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Menu className="w-5 h-5" />
            <span>More</span>
          </button>
        </div>
      </div>

      {/* Mobile Right Panel */}
      {showMobileRightPanel && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowMobileRightPanel(false)}>
          <div className="fixed right-0 top-0 bottom-0 w-64 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between h-16 px-6 border-b">
              <span className="text-lg font-semibold text-gray-900">More Options</span>
              <button
                onClick={() => setShowMobileRightPanel(false)}
                className="p-1"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
              {sidebarItems.slice(4).map((item) => {
                const Icon = item.icon
                if (item.href) {
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      onClick={() => setShowMobileRightPanel(false)}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  )
                }
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setShowMobileRightPanel(false)
                    }}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </button>
                )
              })}
            </nav>
            <div className="border-t px-4 py-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  signOut()
                  setShowMobileRightPanel(false)
                }}
                className="w-full flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex-col`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SOL Sites</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            if (item.href) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            }
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            )
          })}
        </nav>
        
        <div className="border-t px-4 py-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={signOut}
            className="w-full flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop Top Bar */}
        <header className="hidden lg:flex bg-white shadow-sm border-b h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Welcome back, <span className="font-medium">{user?.email?.split('@')[0]}</span>
            </div>
          </div>
        </header>

        {/* Mobile Top Bar */}
        <header className="lg:hidden bg-white shadow-sm border-b h-14 flex items-center justify-between px-4">
          <h1 className="text-lg font-semibold text-gray-900 capitalize">{activeTab}</h1>
          <div className="text-xs text-gray-600 truncate max-w-32">
            {user?.email?.split('@')[0]}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 lg:pb-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
