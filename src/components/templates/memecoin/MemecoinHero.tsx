"use client"

import React from 'react'
import { HeroProps } from '@/types/template'
import { Flame, Star } from 'lucide-react'

export const MemecoinHero: React.FC<HeroProps> = ({ data, colors, className = '' }) => {
  const gradientStyle = {
    background: `linear-gradient(135deg, ${colors.gradient?.from || colors.primary} 0%, ${colors.gradient?.to || colors.secondary} 100%)`
  }

  return (
    <section 
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}
      style={gradientStyle}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-bounce text-4xl">🍔</div>
        <div className="absolute top-40 right-20 animate-pulse text-3xl">🔥</div>
        <div className="absolute bottom-40 left-20 animate-spin text-2xl">⚡</div>
        <div className="absolute bottom-20 right-10 animate-bounce text-3xl">🚀</div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Token Pill */}
        {data.showTokenPill && (
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white mb-8 animate-pulse">
            <Flame className="w-4 h-4 mr-2 text-yellow-400" />
            {data.tokenSymbol || 'TOKEN'} Token
          </div>
        )}

        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 text-white drop-shadow-2xl">
          {data.title}
        </h1>

        {/* Subtitle */}
        {data.subtitle && (
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white/90">
            {data.subtitle}
          </h2>
        )}

        {/* Description */}
        <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-4xl mx-auto text-white/80 leading-relaxed">
          {data.description}
        </p>

        {/* Stats */}
        {data.showStats && data.stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
            {data.stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.icon} {stat.value}
                </div>
                <div className="text-sm text-white/70">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          {data.showPrimaryButton && data.primaryButton && (
            <a
              href={data.primaryButton.href}
              className={`inline-flex items-center px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                data.primaryButton.variant === 'primary'
                  ? 'bg-white text-orange-600 hover:bg-gray-100'
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              <Flame className="w-5 h-5 mr-2" />
              {data.primaryButton.text}
            </a>
          )}

          {data.showSecondaryButton && data.secondaryButton && (
            <a
              href={data.secondaryButton.href}
              className="inline-flex items-center px-8 py-4 rounded-full text-lg font-bold bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
            >
              <Star className="w-5 h-5 mr-2" />
              {data.secondaryButton.text}
            </a>
          )}
        </div>


      </div>

      {/* Token Visual */}
      {data.showTokenVisual && (
        <div className="absolute top-1/2 right-10 transform -translate-y-1/2 hidden lg:block">
          <div className="relative">
            <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-6xl animate-pulse">
              🍔
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-black animate-ping">
              $
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
