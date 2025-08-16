"use client"

import React, { useState } from 'react'
import { NavbarProps } from '@/types/template'
import { Menu, X, ExternalLink } from 'lucide-react'

export const MemecoinNavbar: React.FC<NavbarProps> = ({ data, colors, preview = false, className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const gradientStyle = {
    background: `linear-gradient(135deg, ${colors.gradient?.from || colors.primary} 0%, ${colors.gradient?.to || colors.secondary} 100%)`
  }

  return (
    <nav 
      className={`${preview ? 'relative' : 'fixed top-0 left-0 right-0 z-50'} backdrop-blur-md bg-black/20 border-b border-white/10 ${className}`}
      style={gradientStyle}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{data.logo || '🍔'}</div>
              <div className="text-xl font-bold text-white">
                {data.displayName}
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {data.navItems?.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-white/80 hover:text-white transition-colors duration-200 font-medium"
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
              >
                {item.label}
                {item.external && <ExternalLink className="inline w-3 h-3 ml-1" />}
              </a>
            )) || (
              <div className="text-white/60 text-sm">Navigation items not configured</div>
            )}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            {data.cta && (
              <a
                href={data.cta.href}
                className={`inline-flex items-center px-6 py-2 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                  data.cta.variant === 'primary'
                    ? 'bg-white text-orange-600 hover:bg-gray-100'
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                }`}
                target={data.cta.external ? '_blank' : undefined}
                rel={data.cta.external ? 'noopener noreferrer' : undefined}
              >
                {data.cta.text}
                {data.cta.external && <ExternalLink className="w-4 h-4 ml-2" />}
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/50 backdrop-blur-md rounded-lg mt-2">
              {data.navItems?.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="block px-3 py-2 text-white/80 hover:text-white transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                >
                  {item.label}
                  {item.external && <ExternalLink className="inline w-3 h-3 ml-1" />}
                </a>
              )) || (
                <div className="px-3 py-2 text-white/60 text-sm">Navigation items not configured</div>
              )}
              {data.cta && (
                <a
                  href={data.cta.href}
                  className={`block px-3 py-2 rounded-lg font-bold transition-all duration-300 ${
                    data.cta.variant === 'primary'
                      ? 'bg-white text-orange-600 hover:bg-gray-100'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  target={data.cta.external ? '_blank' : undefined}
                  rel={data.cta.external ? 'noopener noreferrer' : undefined}
                >
                  {data.cta.text}
                  {data.cta.external && <ExternalLink className="inline w-4 h-4 ml-2" />}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
