"use client"

import React from 'react'
import { AboutProps } from '@/types/template'
import { Flame, TrendingUp, CheckCircle } from 'lucide-react'

export const MemecoinAbout: React.FC<AboutProps> = ({ data, colors, preview = false, className = '' }) => {
  const gradientStyle = {
    background: `linear-gradient(135deg, ${colors.gradient?.from || colors.primary} 0%, ${colors.gradient?.to || colors.secondary} 100%)`
  }

  return (
    <section className={`py-20 bg-black ${className}`} id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white">
            {data.title}
          </h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            {data.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Story Points */}
          <div className="space-y-8">
            {data.features?.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {index + 1}. {feature.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Value Proposition */}
          <div className="relative">
            <div 
              className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 text-center text-white"
              style={gradientStyle}
            >
              <div className="mb-6">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  {data.ctaTitle || 'Are the toys really worth it?'}
                </h3>
                <p className="text-lg text-white/90 mb-6">
                  {data.ctaDescription || 'Original Price: ¥500 | Resale Price: ??? | 600% Markup! 🔥'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">¥500</div>
                  <div className="text-sm text-white/70">Original Price</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-400">600%</div>
                  <div className="text-sm text-white/70">Markup</div>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 text-yellow-400 font-bold text-lg">
                <Flame className="w-5 h-5" />
                <span>Trending #1 in Japan</span>
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>

            {/* CTA Buttons */}
            {(data.ctaPrimary || data.ctaSecondary) && (
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                {data.ctaPrimary && (
                  <a
                    href={data.ctaPrimary.href}
                    className={`flex-1 inline-flex items-center justify-center px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                      data.ctaPrimary.variant === 'primary'
                        ? 'bg-white text-orange-600 hover:bg-gray-100'
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {data.ctaPrimary.text}
                  </a>
                )}
                {data.ctaSecondary && (
                  <a
                    href={data.ctaSecondary.href}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-full font-bold bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
                  >
                    <Flame className="w-4 h-4 mr-2" />
                    {data.ctaSecondary.text}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Contract Address */}
        {data.contractAddress && (
          <div className="mt-16 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 max-w-2xl mx-auto">
              <h3 className="text-lg font-bold text-white mb-4">Contract Address</h3>
              <div className="flex items-center justify-center space-x-4">
                <code className="text-sm text-white/70 font-mono bg-black/50 px-4 py-2 rounded">
                  {data.contractAddress}
                </code>
                <button 
                  onClick={() => navigator.clipboard.writeText(data.contractAddress!)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
