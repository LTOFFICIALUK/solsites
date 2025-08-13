import { getTemplateBySlug } from '@/data/templates'
import { NeonTemplate } from '@/components/templates/neon/NeonTemplate'
import { ClassicTemplate } from '@/components/templates/classic/ClassicTemplate'
import { MinimalTemplate } from '@/components/templates/minimal/MinimalTemplate'
import { ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface TemplatePreviewProps {
  params: Promise<{
    slug: string
  }>
}

// Sample project data for previews
const sampleProjectData = {
  tokenInfo: {
    name: "Sample Token",
    symbol: "SAMPLE",
    contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
    description: "A revolutionary meme coin built on Solana blockchain with innovative features and strong community focus."
  },
  branding: {
    primaryColor: "#3B82F6",
    secondaryColor: "#1E40AF",
    accentColor: "#F59E0B",
    logo: "",
    banner: ""
  },
  social: {
    twitter: "https://twitter.com/sampletoken",
    telegram: "https://t.me/sampletoken",
    discord: "https://discord.gg/sampletoken",
    website: "https://sampletoken.com"
  },
  content: {
    hero: {
      title: "The Future of",
      subtitle: "Meme Coins",
      description: "Join the revolution with the most innovative meme coin on Solana. Built by the community, for the community."
    },
    about: {
      title: "Why Choose Sample Token?",
      content: "Sample Token combines the fun of meme coins with real utility and strong fundamentals. Our community-driven approach ensures sustainable growth and long-term success."
    },
    features: [
      {
        title: "Community Driven",
        description: "Built by the community, for the community. Every holder has a voice.",
        icon: "users"
      },
      {
        title: "Zero Tax",
        description: "No buy or sell taxes. Keep more of your profits.",
        icon: "zap"
      },
      {
        title: "Liquidity Locked",
        description: "Liquidity locked for maximum security and trust.",
        icon: "lock"
      },
      {
        title: "Transparent",
        description: "Open source contract with full transparency.",
        icon: "eye"
      }
    ],
    roadmap: [
      {
        title: "Launch",
        description: "Token launch on Solana with initial liquidity",
        date: "Q1 2024",
        completed: true
      },
      {
        title: "Marketing Campaign",
        description: "Aggressive marketing push across social media",
        date: "Q2 2024",
        completed: true
      },
      {
        title: "Exchange Listings",
        description: "List on major DEXs and CEXs",
        date: "Q3 2024",
        completed: false
      },
      {
        title: "NFT Collection",
        description: "Launch exclusive NFT collection for holders",
        date: "Q4 2024",
        completed: false
      }
    ],
    team: [
      {
        name: "Alex Johnson",
        role: "Founder & CEO",
        avatar: "",
        social: "https://twitter.com/alexjohnson"
      },
      {
        name: "Sarah Chen",
        role: "Lead Developer",
        avatar: "",
        social: "https://twitter.com/sarahchen"
      },
      {
        name: "Mike Rodriguez",
        role: "Marketing Director",
        avatar: "",
        social: "https://twitter.com/mikerodriguez"
      }
    ]
  }
}

export default async function TemplatePreviewPage({ params }: TemplatePreviewProps) {
  const { slug } = await params
  const template = getTemplateBySlug(slug)

  if (!template) {
    notFound()
  }

  // Update sample data with template-specific colors
  const previewData = {
    ...sampleProjectData,
    branding: {
      ...sampleProjectData.branding,
      primaryColor: template.colors.primary,
      secondaryColor: template.colors.secondary,
      accentColor: template.colors.accent
    }
  }

  const renderTemplate = () => {
    switch (template.id) {
      case 'neon':
        return <NeonTemplate projectData={previewData} />
      case 'classic':
        return <ClassicTemplate projectData={previewData} />
      case 'minimal':
        return <MinimalTemplate projectData={previewData} />
      default:
        return <div>Template not found</div>
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Preview Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href={`/templates/${slug}`}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Template</span>
            </Link>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: template.colors.primary }}
              ></div>
              <span className="font-medium">{template.name} Template Preview</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              Live Preview Mode
            </div>
            <Link 
              href={`/templates/${slug}`}
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
