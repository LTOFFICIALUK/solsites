"use client"

import React from 'react'
import { FooterProps } from '@/types/template'
import { ExternalLink } from 'lucide-react'

export const MemecoinFooter: React.FC<FooterProps> = ({ data, branding, colors, preview = false, className = '' }) => {
  return (
    <footer className={`bg-black border-t border-white/10 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-3xl">{branding.logo}</div>
              <div className="text-2xl font-bold text-white">
                {branding.logo ? 'HappyMeal' : 'Token'}
              </div>
            </div>
            <p className="text-white/70 mb-6 max-w-md">
              The viral crypto sensation taking Japanese Twitter by storm! Join the community and be part of the next big thing.
            </p>
          </div>

          {/* Social Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-white mb-4">Community</h3>
            <div className="space-y-2">
              {data.twitter && (
                <a
                  href={data.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-white/70 hover:text-white transition-colors"
                >
                  <span>Twitter</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
              {data.telegram && (
                <a
                  href={data.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-white/70 hover:text-white transition-colors"
                >
                  <span>Telegram</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
              {data.discord && (
                <a
                  href={data.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-white/70 hover:text-white transition-colors"
                >
                  <span>Discord</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="#about" className="block text-white/70 hover:text-white transition-colors">
                About
              </a>
              <a href="#tokenomics" className="block text-white/70 hover:text-white transition-colors">
                Tokenomics
              </a>
              <a href="#roadmap" className="block text-white/70 hover:text-white transition-colors">
                Roadmap
              </a>
              <a href="#community" className="block text-white/70 hover:text-white transition-colors">
                Community
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            © 2024 {branding.logo ? 'HappyMeal' : 'Token'}. All rights reserved.
          </p>
          <p className="text-white/60 text-sm mt-2 md:mt-0">
            Disclaimer: This is a meme coin created for entertainment purposes.
          </p>
        </div>
      </div>
    </footer>
  )
}
