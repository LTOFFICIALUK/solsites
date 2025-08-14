import { supabase, Template, UserProject } from './supabase'

// Template services
export const templateService = {
  async getAllTemplates(): Promise<Template[]> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getTemplateBySlug(slug: string): Promise<Template | null> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  },

  async getTemplateById(id: string): Promise<Template | null> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }
}

// Project services
export const projectService = {
  async getUserProjects(userId: string): Promise<UserProject[]> {
    const { data, error } = await supabase
      .from('user_projects')
      .select(`
        *,
        templates (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getProjectById(id: string): Promise<UserProject | null> {
    const { data, error } = await supabase
      .from('user_projects')
      .select(`
        *,
        templates (*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async getProjectBySlug(slug: string): Promise<UserProject | null> {
    const { data, error } = await supabase
      .from('user_projects')
      .select(`
        *,
        templates (*)
      `)
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  },

  async createProject(project: Omit<UserProject, 'id' | 'created_at' | 'updated_at'>): Promise<UserProject> {
    const { data, error } = await supabase
      .from('user_projects')
      .insert(project)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateProject(id: string, updates: Partial<UserProject>): Promise<UserProject> {
    const { data, error } = await supabase
      .from('user_projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_projects')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async publishProject(id: string): Promise<UserProject> {
    const { data, error } = await supabase
      .from('user_projects')
      .update({ is_published: true })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async unpublishProject(id: string): Promise<UserProject> {
    const { data, error } = await supabase
      .from('user_projects')
      .update({ is_published: false })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Helper function to create a new project from a template
export async function createProjectFromTemplate(
  userId: string,
  templateId: string,
  projectName: string
): Promise<UserProject> {
  // Get the template
  const template = await templateService.getTemplateById(templateId)
  if (!template) {
    throw new Error('Template not found')
  }

  // Generate a unique slug
  const baseSlug = projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')
  const slug = `${baseSlug}-${Date.now()}`

  // Create default project data based on template
  const defaultData = {
    tokenInfo: {
      name: projectName,
      symbol: projectName.substring(0, 4).toUpperCase(),
      contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
      description: 'Join the revolution with our innovative meme coin that combines humor, community, and cutting-edge blockchain technology.'
    },
    branding: {
      primaryColor: template.colors.primary,
      secondaryColor: template.colors.secondary,
      accentColor: template.colors.accent,
      logo: '🚀',
      banner: 'https://via.placeholder.com/1200x400'
    },
    social: {
      twitter: 'https://twitter.com/memetoken',
      telegram: 'https://t.me/memetoken',
      discord: 'https://discord.gg/memetoken',
      website: 'https://memetoken.com'
    },
    header: {
      navItems: [
        { label: 'About', href: '#about' },
        { label: 'Tokenomics', href: '#tokenomics' },
        { label: 'Roadmap', href: '#roadmap' },
        { label: 'Team', href: '#team' }
      ],
      cta: { text: 'Buy Now' }
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
  }

  // Create the project
  const project = await projectService.createProject({
    user_id: userId,
    template_id: templateId,
    name: projectName,
    slug,
    domain: `${slug}.solsites.fun`,
    data: defaultData,
    is_published: false
  })

  return project
}
