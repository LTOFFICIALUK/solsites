"use client"

import { ClassicHero } from './ClassicHero'
import { ClassicAbout } from './ClassicAbout'
import { ClassicTokenomics } from './ClassicTokenomics'
import { ClassicRoadmap } from './ClassicRoadmap'
import { ClassicTeam } from './ClassicTeam'
import { ClassicFooter } from './ClassicFooter'
import { ClassicNavbar } from './ClassicNavbar'

interface ClassicTemplateProps {
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
    header?: {
      displayName?: string
      colors?: { primary?: string; secondary?: string }
      navItems?: Array<{ label: string; href: string }>
      cta?: { text: string; href?: string }
    }
    content: {
      hero: {
        title: string
        subtitle: string
        description: string
        // Comprehensive hero content
        tokenSymbol?: string
        showTokenPill?: boolean
        showStats?: boolean
        stats?: Array<{ value: string; label: string; color: string }>
        showPrimaryButton?: boolean
        primaryButton?: { text: string; href: string }
        showSecondaryButton?: boolean
        secondaryButton?: { text: string; href: string }
        showTokenVisual?: boolean
        tokenLogo?: string
        tokenPrice?: string
        priceChange?: string
        circulatingSupply?: string
        totalSupply?: string

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
      roadmap: {
        title: string
        description: string
        phases: Array<{
          title: string
          description: string
          date: string
          completed: boolean
        }>
      }
      team: {
        title: string
        description: string
        members: Array<{
          name: string
          role: string
          avatar: string
          social?: string
        }>
      }
      footer?: {
        tokenSymbol?: string
        description?: string
        social?: {
          twitter?: string
          telegram?: string
          discord?: string
          website?: string
        }
        tokenLinks?: Array<{ label: string; href: string }>
        communityLinks?: Array<{ label: string; href: string }>
        copyrightText?: string
        backgroundColor?: string
        textColor?: string
        mutedTextColor?: string
        borderColor?: string
        columns?: string
        padding?: string
      }
    }
  }
  visibility?: Partial<Record<'navbar' | 'hero' | 'about' | 'tokenomics' | 'roadmap' | 'team' | 'footer', boolean>>

}

export const ClassicTemplate = ({ projectData, visibility }: ClassicTemplateProps) => {
  const { tokenInfo, branding, social, content } = projectData
  const show = (key: keyof NonNullable<ClassicTemplateProps['visibility']>) => visibility?.[key] ?? true

  return (
    <div className="classic-template" style={{
      ['--brand-primary' as any]: branding.primaryColor,
      ['--brand-secondary' as any]: branding.secondaryColor,
      ['--brand-accent' as any]: branding.accentColor,
    }}>
      {/* Custom CSS for classic template */}
      <style jsx global>{`
        .classic-template {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: ${projectData?.branding?.backgroundColor || '#FFFFFF'};
          color: #1e293b;
        }
        
        .classic-gradient {
          background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
        }
        
        .classic-shadow {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .classic-border {
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .classic-hover {
          transition: all 0.3s ease;
        }
        
        .classic-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>

      {/* Navigation */}
      {show('navbar') && (
      <ClassicNavbar 
        tokenSymbol={tokenInfo.symbol}
        displayName={projectData?.header?.displayName}
        primaryColor={projectData?.header?.colors?.primary || branding.primaryColor}
        secondaryColor={projectData?.header?.colors?.secondary || branding.secondaryColor}
        logoUrl={branding.logo}
        navItems={projectData?.header?.navItems}
        cta={projectData?.header?.cta}
        social={social}
        colors={projectData?.header?.colors as any}
      />)}

      {/* Hero Section */}
      {show('hero') && (
      <ClassicHero
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        description={content.hero.description}
        tokenSymbol={content.hero.tokenSymbol || tokenInfo.symbol}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
        backgroundImage={branding.banner}
        logo={branding.logo}
        // Comprehensive hero content
        showTokenPill={content.hero.showTokenPill}
        showStats={content.hero.showStats}
        stats={content.hero.stats}
        showPrimaryButton={content.hero.showPrimaryButton}
        primaryButton={content.hero.primaryButton}
        showSecondaryButton={content.hero.showSecondaryButton}
        secondaryButton={content.hero.secondaryButton}
        showTokenVisual={content.hero.showTokenVisual}
        tokenLogo={branding.logo || content.hero.tokenLogo}
        tokenPrice={content.hero.tokenPrice}
        priceChange={content.hero.priceChange}
        circulatingSupply={content.hero.circulatingSupply}
        totalSupply={content.hero.totalSupply}


      />)}

      {/* About Section */}
      {show('about') && (
      <ClassicAbout
        title={content.about.title}
        description={content.about.description}
        features={content.about.features || []}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}

      />)}

      {/* Tokenomics Section */}
      {show('tokenomics') && (
      <ClassicTokenomics
        title={(content as any).tokenomics?.title || 'Tokenomics'}
        description={(content as any).tokenomics?.description || 'Fair and transparent token distribution'}
        totalSupply={(content as any).tokenomics?.totalSupply || '1,000,000,000'}
        distribution={(content as any).tokenomics?.distribution || []}
        features={(content as any).tokenomics?.features || []}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
      />)}

      {/* Roadmap Section */}
      {show('roadmap') && (
      <ClassicRoadmap
        content={{
          title: content.roadmap?.title || 'Roadmap',
          description: content.roadmap?.description || 'Our journey to success',
          showCtaButton: (content as any).roadmap?.showCtaButton,
          ctaButton: (content as any).roadmap?.ctaButton,
          roadmap: Array.isArray(content.roadmap) ? content.roadmap : content.roadmap?.phases || []
        }}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
      />)}

      {/* Team Section */}
      {show('team') && (
      <ClassicTeam
        content={{
          title: content.team?.title || 'Our Team',
          description: content.team?.description || 'Meet the brilliant minds behind our project',
          members: content.team?.members || content.team || []
        }}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
      />)}

      {/* Footer */}
      {show('footer') && (
      <ClassicFooter
        projectName={tokenInfo.name}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
        colors={projectData?.header?.colors as any}
      />)}
    </div>
  )
}