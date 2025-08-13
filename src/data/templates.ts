import { TemplateConfig } from '@/types/template'

export const templates: TemplateConfig[] = [
  {
    id: 'neon',
    name: 'Neon',
    description: 'High-energy, vibrant design perfect for explosive meme coins. Features bold gradients, neon effects, and dynamic animations.',
    category: 'modern',
    preview: '/templates/neon/preview.png',
    slug: 'neon',
    features: [
      'Bold neon gradients',
      'Dynamic animations',
      'High-energy visuals',
      'Mobile-optimized',
      'Social media ready'
    ],
    colors: {
      primary: '#FF0080',
      secondary: '#00FFFF',
      accent: '#FFD700',
      background: '#0A0A0A',
      text: '#FFFFFF'
    },
    customizable: {
      colors: true,
      fonts: true,
      layout: true,
      content: true,
      images: true
    }
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Professional and trustworthy design that builds confidence. Clean layout with premium feel for serious projects.',
    category: 'classic',
    preview: '/templates/classic/preview.png',
    slug: 'classic',
    features: [
      'Professional design',
      'Clean typography',
      'Trustworthy feel',
      'SEO optimized',
      'Fast loading'
    ],
    colors: {
      primary: '#2563EB',
      secondary: '#1E40AF',
      accent: '#F59E0B',
      background: '#FFFFFF',
      text: '#1F2937'
    },
    customizable: {
      colors: true,
      fonts: true,
      layout: true,
      content: true,
      images: true
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Sleek and modern design focused on content. Perfect for projects that want to stand out through simplicity.',
    category: 'minimal',
    preview: '/templates/minimal/preview.png',
    slug: 'minimal',
    features: [
      'Clean minimal design',
      'Focus on content',
      'Modern typography',
      'Fast performance',
      'Easy customization'
    ],
    colors: {
      primary: '#000000',
      secondary: '#6B7280',
      accent: '#3B82F6',
      background: '#FAFAFA',
      text: '#111827'
    },
    customizable: {
      colors: true,
      fonts: true,
      layout: true,
      content: true,
      images: true
    }
  }
]

export const getTemplateById = (id: string): TemplateConfig | undefined => {
  return templates.find(template => template.id === id)
}

export const getTemplateBySlug = (slug: string): TemplateConfig | undefined => {
  return templates.find(template => template.slug === slug)
}
