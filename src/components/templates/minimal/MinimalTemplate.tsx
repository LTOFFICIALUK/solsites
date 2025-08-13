"use client"

import { MinimalHero } from './MinimalHero'
import { MinimalAbout } from './MinimalAbout'
import { MinimalTokenomics } from './MinimalTokenomics'
import { MinimalRoadmap } from './MinimalRoadmap'
import { MinimalTeam } from './MinimalTeam'
import { MinimalFooter } from './MinimalFooter'
import { MinimalNavbar } from './MinimalNavbar'

interface MinimalTemplateProps {
  projectData: {
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
      backgroundColor?: string
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
  visibility?: Partial<Record<'navbar' | 'hero' | 'about' | 'tokenomics' | 'team' | 'roadmap' | 'footer', boolean>>
  onEdit?: {
    hero?: { title?: (v: string) => void; subtitle?: (v: string) => void; description?: (v: string) => void }
    about?: { title?: (v: string) => void; content?: (v: string) => void }
  }
}

export const MinimalTemplate = ({ projectData, visibility, onEdit }: MinimalTemplateProps) => {
  const { tokenInfo, branding, social, content } = projectData
  const show = (key: keyof NonNullable<MinimalTemplateProps['visibility']>) => visibility?.[key] ?? true

  return (
    <div className="minimal-template" style={{
      ['--brand-primary' as any]: branding.primaryColor,
      ['--brand-secondary' as any]: branding.secondaryColor,
      ['--brand-accent' as any]: branding.accentColor,
    }}>
      {/* Custom CSS for minimal template */}
      <style jsx global>{`
        .minimal-template {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: ${projectData?.branding?.backgroundColor || '#ffffff'};
          color: #000000;
        }
        
        .minimal-gradient {
          background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
        }
        
        .minimal-shadow {
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }
        
        .minimal-border {
          border: 1px solid #e5e7eb;
        }
        
        .minimal-hover {
          transition: all 0.2s ease;
        }
        
        .minimal-hover:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .minimal-text-gradient {
          background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Navigation */}
      {show('navbar') && (
      <MinimalNavbar 
        tokenSymbol={tokenInfo.symbol}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        social={social}
      />)}

      {/* Hero Section */}
      {show('hero') && (
      <MinimalHero
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        description={content.hero.description}
        tokenSymbol={tokenInfo.symbol}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
        backgroundImage={branding.banner}
        logo={branding.logo}
        onEdit={onEdit?.hero as any}
      />)}

      {/* About Section */}
      {show('about') && (
      <MinimalAbout
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
        content={{
          about: {
            title: content.about.title,
            subtitle: '',
            description: content.about.content,
            features: content.features.map((f) => f.title || String(f))
          }
        }}
        onEdit={onEdit?.about as any}
      />)}

      {/* Tokenomics Section */}
      {show('tokenomics') && (
      <MinimalTokenomics
        tokenSymbol={tokenInfo.symbol}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
      />)}

      {/* Roadmap Section */}
      {show('roadmap') && (
      <MinimalRoadmap
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
        content={{ roadmap: content.roadmap }}
      />)}

      {/* Team Section */}
      {show('team') && (
      <MinimalTeam
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
        content={{ team: content.team }}
      />)}

      {/* Footer */}
      {show('footer') && (
      <MinimalFooter
        tokenSymbol={tokenInfo.symbol}
        social={social}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
      />)}
    </div>
  )
}