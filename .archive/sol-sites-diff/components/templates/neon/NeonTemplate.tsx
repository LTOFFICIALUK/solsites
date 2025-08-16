"use client"

import { Hero } from '../shared/Hero'
import { About, defaultFeatures } from '../shared/About'
import { Tokenomics, defaultTokenomics } from '../shared/Tokenomics'
import { Roadmap } from './Roadmap'
import { Team } from './Team'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

interface NeonTemplateProps {
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
      roadmap: {
        title?: string
        description?: string
        showCtaButton?: boolean
        ctaButton?: {
          text?: string
          href?: string
        }
        phases: Array<{
          title: string
          description: string
          date: string
          completed: boolean
        }>
      }
      team: {
        title?: string
        description?: string
        members?: Array<{
          name: string
          role: string
          avatar: string
          social?: string
        }>
      }
    }
  }
  visibility?: Partial<Record<'navbar' | 'hero' | 'about' | 'tokenomics' | 'team' | 'roadmap' | 'footer', boolean>>
  onEdit?: {
    hero?: { title?: (v: string) => void; subtitle?: (v: string) => void; description?: (v: string) => void }
    about?: { title?: (v: string) => void; content?: (v: string) => void }
  }
}

export const NeonTemplate = ({ projectData, visibility, onEdit }: NeonTemplateProps) => {
  const { tokenInfo, branding, social, content } = projectData
  const show = (key: keyof NonNullable<NeonTemplateProps['visibility']>) => visibility?.[key] ?? true

  return (
    <div className="neon-template" style={{
      // Use CSS variables for brand colors to ensure consistent theming
      ['--brand-primary' as any]: branding.primaryColor,
      ['--brand-secondary' as any]: branding.secondaryColor,
      ['--brand-accent' as any]: branding.accentColor,
    }}>
      {/* Custom CSS for neon effects */}
      <style jsx global>{`
        .neon-template {
          background: ${((projectData as any)?.branding?.backgroundColor) || '#0A0A0A'};
          color: white;
        }
        
        .neon-glow {
          box-shadow: 0 0 20px var(--brand-primary)40;
        }
        
        .neon-text {
          text-shadow: 0 0 10px var(--brand-primary), 0 0 20px var(--brand-primary), 0 0 30px var(--brand-primary);
        }
        
        .neon-border {
          border: 2px solid var(--brand-primary);
          box-shadow: 0 0 10px var(--brand-primary)40;
        }
        
        @keyframes neonPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .neon-pulse {
          animation: neonPulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* Navigation */}
      {show('navbar') && (
      <Navbar 
        tokenSymbol={tokenInfo.symbol}
        primaryColor={(projectData as any)?.header?.colors?.primary || branding.primaryColor}
        secondaryColor={(projectData as any)?.header?.colors?.secondary || branding.secondaryColor}
        logoUrl={branding.logo}
        navItems={(projectData as any)?.header?.navItems}
        cta={(projectData as any)?.header?.cta}
        social={social}
      />)}

      {/* Hero Section */}
      {show('hero') && (
      <Hero
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        description={content.hero.description}
        tokenSymbol={tokenInfo.symbol}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
        backgroundImage={branding.banner}
        showVideo={false}
        showStats={Boolean((content as any)?.hero?.showStats)}
        stats={((content as any)?.hero?.stats) || undefined}
        ctaText={((content as any)?.hero?.primaryButton?.text) || 'Buy Now'}
        className="neon-hero"
        onEdit={onEdit?.hero}
      />)}

      {/* About Section */}
      {show('about') && (
      <About
        title={content.about.title}
        description={content.about.content}
        features={defaultFeatures}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
        className="bg-black/50"
      />)}

      {/* Tokenomics Section */}
      {show('tokenomics') && (
      <Tokenomics
        tokenSymbol={tokenInfo.symbol}
        totalSupply="1,000,000,000"
        distribution={defaultTokenomics}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
        className="bg-gradient-to-r from-black/30 to-black/50"
      />)}

      {/* Roadmap Section */}
      {show('roadmap') && (
      <Roadmap
        content={{
          title: content.roadmap?.title,
          description: content.roadmap?.description,
          showCtaButton: content.roadmap?.showCtaButton,
          ctaButton: content.roadmap?.ctaButton,
          roadmap: content.roadmap?.phases
        }}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
      />)}

      {/* Team Section */}
      {show('team') && (
      <Team
        content={{
          title: content.team?.title,
          description: content.team?.description,
          members: content.team?.members || []
        }}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
      />)}

      {/* Footer */}
      {show('footer') && (
      <Footer
        tokenSymbol={tokenInfo.symbol}
        social={social}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
      />)}
    </div>
  )
}
