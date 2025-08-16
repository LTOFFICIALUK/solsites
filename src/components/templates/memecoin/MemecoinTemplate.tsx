"use client"

import React from 'react'
import { TemplateComponentProps } from '@/types/template'
import { MemecoinNavbar } from './MemecoinNavbar'
import { MemecoinHero } from './MemecoinHero'
import { MemecoinAbout } from './MemecoinAbout'
import { MemecoinFeatures } from './MemecoinFeatures'
import { MemecoinTokenDetails } from './MemecoinTokenDetails'
import { MemecoinRoadmap } from './MemecoinRoadmap'
import { MemecoinTeam } from './MemecoinTeam'
import { MemecoinTokenomics } from './MemecoinTokenomics'
import { MemecoinCommunity } from './MemecoinCommunity'
import { MemecoinFooter } from './MemecoinFooter'

export const MemecoinTemplate: React.FC<TemplateComponentProps> = ({
  template,
  data,
  preview = false,
  className = ''
}) => {
  const { colors } = template

  return (
    <div className={`${preview ? 'h-full' : 'min-h-screen'} bg-black text-white ${className}`}>
      {/* Navbar */}
      <MemecoinNavbar 
        data={data.header} 
        colors={colors} 
        preview={preview}
      />

      {/* Hero Section */}
      <MemecoinHero 
        data={data.content.hero} 
        colors={colors} 
        preview={preview}
      />

      {/* About Section */}
      <MemecoinAbout 
        data={data.content.about} 
        colors={colors} 
        preview={preview}
      />

      {/* Features Section */}
      <MemecoinFeatures 
        data={data.content.features} 
        colors={colors} 
        preview={preview}
      />

      {/* Token Details Section */}
      {data.content.tokenDetails && (
        <MemecoinTokenDetails 
          data={data.content.tokenDetails} 
          colors={colors} 
          preview={preview}
        />
      )}

      {/* Tokenomics Section */}
      {data.content.tokenomics && (
        <MemecoinTokenomics 
          data={data.content.tokenomics} 
          colors={colors} 
          preview={preview}
        />
      )}

      {/* Roadmap Section */}
      <MemecoinRoadmap 
        data={data.content.roadmap} 
        colors={colors} 
        preview={preview}
      />

      {/* Team Section */}
      <MemecoinTeam 
        data={data.content.team} 
        colors={colors} 
        preview={preview}
      />

      {/* Community Section */}
      {data.content.community && (
        <MemecoinCommunity 
          data={data.content.community} 
          colors={colors} 
          preview={preview}
        />
      )}

      {/* Footer */}
      <MemecoinFooter 
        data={data.social} 
        branding={data.branding}
        colors={colors} 
        preview={preview}
      />
    </div>
  )
}
