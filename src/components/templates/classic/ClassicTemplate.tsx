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

export const ClassicTemplate = ({ projectData, visibility, onEdit }: ClassicTemplateProps) => {
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
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        social={social}
      />)}

      {/* Hero Section */}
      {show('hero') && (
      <ClassicHero
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
      <ClassicAbout
        title={content.about.title}
        description={content.about.content}
        features={content.features}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
        onEdit={onEdit?.about as any}
      />)}

      {/* Tokenomics Section */}
      {show('tokenomics') && (
      <ClassicTokenomics
        tokenSymbol={tokenInfo.symbol}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
      />)}

      {/* Roadmap Section */}
      {show('roadmap') && (
      <ClassicRoadmap
        roadmap={content.roadmap}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
      />)}

      {/* Team Section */}
      {show('team') && (
      <ClassicTeam
        team={content.team}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
      />)}

      {/* Footer */}
      {show('footer') && (
      <ClassicFooter
        tokenSymbol={tokenInfo.symbol}
        social={social}
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        accentColor={branding.accentColor}
      />)}
    </div>
  )
}