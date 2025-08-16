"use client"

import React from 'react'
import { TokenomicsProps } from '@/types/template'

export const MemecoinTokenomics: React.FC<TokenomicsProps> = ({ data, colors, preview = false, className = '' }) => {
  return (
    <section className={`py-20 bg-black ${className}`} id="tokenomics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white">
            {data.title}
          </h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto mb-8">
            {data.description}
          </p>
          <div className="text-3xl font-bold text-orange-400">
            {data.totalSupply}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {data.distribution.map((item, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center"
            >
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold"
                style={{ backgroundColor: item.color }}
              >
                {item.percentage}%
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {item.name}
              </h3>
              {item.description && (
                <p className="text-white/70 text-sm">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
