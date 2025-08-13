export interface TemplateConfig {
  id: string
  name: string
  slug: string
  description: string
  category: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background?: string
    text?: string
  }
  features: string[]
  preview?: string
  customizable?: {
    colors: boolean
    fonts: boolean
    layout: boolean
    content: boolean
    images: boolean
  }
}

export default TemplateConfig

