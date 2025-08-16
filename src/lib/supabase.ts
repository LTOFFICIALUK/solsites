import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Get the current URL for redirects
const getRedirectUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  // Use environment variable or default to localhost for development
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'sol-sites-web'
    }
  }
})

// Database types
export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface Template {
  id: string
  name: string
  slug: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  thumbnail: string
  created_at: string
  updated_at: string
}

export interface UserProject {
  id: string
  user_id: string
  template_id: string
  name: string
  slug: string
  domain: string
  data: {
    tokenInfo: {
      name: string
      symbol: string
      contractAddress: string
      description: string
    }
    branding: {
      primaryColor: string
      secondaryColor: string
      accentColor: string
      logo: string
      banner: string
    }
    social: {
      twitter?: string
      telegram?: string
      discord?: string
      website?: string
    }
    content: {
      hero: {
        title: string
        subtitle: string
        description: string
        showTokenPill?: boolean
        showStats?: boolean
        showPrimaryButton?: boolean
        showSecondaryButton?: boolean
        showTokenVisual?: boolean

        tokenSymbol?: string
        stats?: Array<{ value: string; label: string; color: string }>
        primaryButton?: { text: string; href: string }
        secondaryButton?: { text: string; href: string }
      }
      about: {
        title: string
        content: string
      }
      features: Array<{
        title: string
        description: string
        icon: string
      }>
      roadmap: Array<{
        title: string
        description: string
        date: string
        completed: boolean
      }>
      team: Array<{
        name: string
        role: string
        avatar: string
        social?: string
      }>
    }
  }
  is_published: boolean
  created_at: string
  updated_at: string
}