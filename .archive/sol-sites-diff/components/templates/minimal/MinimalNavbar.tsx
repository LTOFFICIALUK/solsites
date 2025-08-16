"use client"

import { Menu, X, Twitter, MessageCircle, Globe, ArrowRight } from 'lucide-react'
import { useState } from 'react'

interface MinimalNavbarProps {
  tokenSymbol: string
  primaryColor: string
  secondaryColor: string
  logoUrl?: string
  navItems?: Array<{ label: string; href: string }>
  cta?: { text: string; href?: string }
  social?: {
    twitter?: string
    telegram?: string
    discord?: string
    website?: string
  }
}

export const MinimalNavbar = ({ tokenSymbol, primaryColor, secondaryColor, logoUrl, navItems, cta, social }: MinimalNavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="relative bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            {logoUrl ? (
              <img src={logoUrl} alt={`${tokenSymbol} logo`} className="w-8 h-8 rounded-lg object-cover minimal-shadow" />
            ) : (
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center minimal-shadow"
                style={{ 
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                }}
              >
                <span className="text-white font-bold text-sm">{tokenSymbol[0]}</span>
              </div>
            )}
            <span className="text-xl font-bold text-gray-900">{tokenSymbol}</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {(navItems && navItems.length > 0 ? navItems : [
              { label: 'About', href: '#about' },
              { label: 'Tokenomics', href: '#tokenomics' },
              { label: 'Roadmap', href: '#roadmap' },
              { label: 'Team', href: '#team' }
            ]).map((item) => (
              <a key={item.href + item.label} href={item.href} className="text-gray-700 hover:text-gray-900 font-medium transition-colors">{item.label}</a>
            ))}
            
            {/* Social Links */}
            {social && (
              <div className="flex items-center space-x-3">
                {social.twitter && (
                  <a 
                    href={social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
                    style={{ 
                      backgroundColor: `${primaryColor}10`,
                      color: primaryColor
                    }}
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {social.telegram && (
                  <a 
                    href={social.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
                    style={{ 
                      backgroundColor: `${secondaryColor}10`,
                      color: secondaryColor
                    }}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                )}
                {social.discord && (
                  <a 
                    href={social.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
                    style={{ 
                      backgroundColor: `${primaryColor}10`,
                      color: primaryColor
                    }}
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}

            {/* CTA Button */}
            {(cta?.href ? (
              <a 
                href={cta.href}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-300 minimal-hover"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  color: 'white'
                }}
              >
                {cta?.text || 'Buy Now'}
                <ArrowRight className="inline-block ml-2 w-4 h-4" />
              </a>
            ) : (
              <button 
                className="px-4 py-2 rounded-lg font-medium transition-all duration-300 minimal-hover"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  color: 'white'
                }}
              >
                {cta?.text || 'Buy Now'}
                <ArrowRight className="inline-block ml-2 w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-gray-900"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {(navItems && navItems.length > 0 ? navItems : [
                { label: 'About', href: '#about' },
                { label: 'Tokenomics', href: '#tokenomics' },
                { label: 'Roadmap', href: '#roadmap' },
                { label: 'Team', href: '#team' }
              ]).map((item) => (
                <a key={item.href + item.label} href={item.href} className="text-gray-700 hover:text-gray-900 font-medium transition-colors">{item.label}</a>
              ))}
              
              {/* Mobile Social Links */}
              {social && (
                <div className="flex items-center space-x-3 pt-4">
                  {social.twitter && (
                    <a 
                      href={social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg"
                      style={{ 
                        backgroundColor: `${primaryColor}10`,
                        color: primaryColor
                      }}
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {social.telegram && (
                    <a 
                      href={social.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg"
                      style={{ 
                        backgroundColor: `${secondaryColor}10`,
                        color: secondaryColor
                      }}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  )}
                  {social.discord && (
                    <a 
                      href={social.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg"
                      style={{ 
                        backgroundColor: `${primaryColor}10`,
                        color: primaryColor
                      }}
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}

              {/* Mobile CTA Button */}
              {(cta?.href ? (
                <a 
                  href={cta.href}
                  className="px-4 py-2 rounded-lg font-medium mt-4"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    color: 'white'
                  }}
                >
                  {cta?.text || 'Buy Now'}
                  <ArrowRight className="inline-block ml-2 w-4 h-4" />
                </a>
              ) : (
                <button 
                  className="px-4 py-2 rounded-lg font-medium mt-4"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    color: 'white'
                  }}
                >
                  {cta?.text || 'Buy Now'}
                  <ArrowRight className="inline-block ml-2 w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
