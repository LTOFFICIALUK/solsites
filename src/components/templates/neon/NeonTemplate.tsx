"use client"

import { NeonHero } from './Hero'
import { TokenDetails } from './TokenDetails'
import { Community } from './Community'
import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { getIconComponent } from '@/lib/icons'

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
      tokenomics?: {
        title?: string
        description?: string
        totalSupply?: string
        distribution?: Array<{ name: string; percentage: number; amount: string; color: string; description: string }>
        features?: Array<{ title: string; description: string; icon: string }>
        layout?: 'chart-left' | 'chart-right'
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
      community?: {
        title?: string
        description?: string
        cards?: Array<{ title?: string; description?: string; icon?: string; buttonText?: string; cta?: { text?: string; href?: string } }>
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
  visibility?: Partial<Record<'navbar' | 'hero' | 'about' | 'tokenomics' | 'community' | 'roadmap' | 'team' | 'footer', boolean>>
}

export const NeonTemplate = ({ projectData, visibility }: NeonTemplateProps) => {
  const { tokenInfo, branding, social, content } = projectData
  const show = (key: keyof NonNullable<NeonTemplateProps['visibility']>) => visibility?.[key] ?? true

  // Helper function to convert icon names to React components
  const getIconComponentLocal = (iconName: string) => {
    return getIconComponent(iconName)
  }

  // Convert features with string icons to React components
  const convertFeaturesToReactIcons = (features: any[] | undefined) => {
    if (!features) return undefined
    return features.map(feature => {
      if (typeof feature.icon === 'string') {
        const IconComponent = getIconComponentLocal(feature.icon)
        return {
          ...feature,
          icon: <IconComponent className="w-8 h-8" />
        }
      }
      return feature
    })
  }

  // Convert community cards into component-friendly structure
  const convertCommunityCards = (cards: any[] | undefined) => {
    if (!cards) return undefined
    return cards.map(card => {
      let iconNode = card.icon
      if (typeof iconNode === 'string') {
        const IconComponent = getIconComponentLocal(iconNode)
        iconNode = <IconComponent className="w-6 h-6" />
      }
      const cta = card.cta || (card.buttonText ? { text: card.buttonText } : undefined)
      return {
        ...card,
        icon: iconNode,
        cta
      }
    })
  }

  return (
    <div className="neon-template" style={{
      ['--brand-primary' as any]: branding.primaryColor,
      ['--brand-secondary' as any]: branding.secondaryColor,
      ['--brand-accent' as any]: branding.accentColor,
    }}>
      {/* Custom CSS for neon effects */}
      <style jsx global>{`
        .neon-template {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: ${projectData?.branding?.backgroundColor || '#0A0A0A'};
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
      <NeonHero
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
      <TokenDetails
        title={content.about.title}
        description={content.about.description}
        contractAddress={tokenInfo.contractAddress}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
        features={convertFeaturesToReactIcons(content.about.features || [])}
      />)}

      {/* Tokenomics Section */}
      {show('tokenomics') && (
      <TokenDetails
        title={(content as any).tokenomics?.title || 'Tokenomics'}
        description={(content as any).tokenomics?.description || 'Fair and transparent token distribution'}
        contractAddress={tokenInfo.contractAddress}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
        totalSupply={(content as any).tokenomics?.totalSupply || '1,000,000,000'}
        distribution={(content as any).tokenomics?.distribution || []}
        features={convertFeaturesToReactIcons((content as any).tokenomics?.features || [])}
      />)}

      {/* Community Section */}
      {show('community') && (
      <Community
        title={content?.community?.title || "Join the Community"}
        description={content?.community?.description || "Be part of the viral movement. Connect, trade, and follow the trend."}
        cards={convertCommunityCards(content?.community?.cards)}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
        socials={social}
      />)}

      {/* Roadmap Section */}
      {show('roadmap') && (
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
              {content.roadmap?.title || 'Roadmap'}
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              {content.roadmap?.description || 'Our journey to success'}
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(content.roadmap?.phases || []).map((phase, index) => (
              <div key={index} className="relative p-6 rounded-xl neon-border">
                <div className="text-sm text-white/60 mb-2">{phase.date}</div>
                <h3 className="text-xl font-bold mb-3">{phase.title}</h3>
                <p className="text-white/80">{phase.description}</p>
                {phase.completed && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>)}

      {/* Team Section */}
      {show('team') && (
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
              {content.team?.title || 'Our Team'}
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              {content.team?.description || 'Meet the brilliant minds behind our project'}
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(content.team?.members || []).map((member, index) => (
              <div key={index} className="text-center p-6 rounded-xl neon-border">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl">
                  {member.avatar}
                </div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-white/80 mb-4">{member.role}</p>
                {member.social && (
                  <a href={member.social} className="text-primary hover:text-secondary transition-colors">
                    View Profile
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>)}

      {/* Footer */}
      {show('footer') && (
      <Footer
        projectName={tokenInfo.name}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
        colors={projectData?.header?.colors as any}
      />)}
    </div>
  )
}
