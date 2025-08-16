"use client"

import React from 'react'
import { RoadmapProps } from '@/types/template'
import { CheckCircle, Circle } from 'lucide-react'

export const MemecoinRoadmap: React.FC<RoadmapProps> = ({ data, colors, preview = false, className = '' }) => {
  return (
    <section className={`py-20 bg-black ${className}`} id="roadmap">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white">
            Roadmap
          </h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto">
            Our journey to viral success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.map((phase, index) => (
            <div 
              key={index}
              className={`relative p-6 rounded-lg border transition-all duration-300 ${
                phase.completed 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-white/60">
                  {phase.date}
                </span>
                {phase.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <Circle className="w-6 h-6 text-white/40" />
                )}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">
                {phase.title}
              </h3>
              <p className="text-white/70 mb-4">
                {phase.description}
              </p>
              
              {phase.items && (
                <ul className="space-y-2">
                  {phase.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-white/60 flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
