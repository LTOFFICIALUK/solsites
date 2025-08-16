"use client"

import React from 'react'
import { CommunityProps } from '@/types/template'
import { ExternalLink } from 'lucide-react'

export const MemecoinCommunity: React.FC<CommunityProps> = ({ data, colors, preview = false, className = '' }) => {
  return (
    <section className={`py-20 bg-black ${className}`} id="community">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white">
            {data.title}
          </h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto">
            {data.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.cards.map((card, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 text-center"
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">
                {card.title}
              </h3>
              <p className="text-white/70 mb-4">
                {card.description}
              </p>
              {card.link && (
                <a
                  href={card.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors"
                >
                  <span>Join Now</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
