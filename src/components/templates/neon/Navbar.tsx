"use client"

import { Menu, X, Twitter, MessageCircle, Globe } from 'lucide-react'
import { useState } from 'react'

interface NavbarProps {
  tokenSymbol: string
  primaryColor: string
  secondaryColor: string
  social?: {
    twitter?: string
    telegram?: string
    discord?: string
    website?: string
  }
}

export const Navbar = ({ tokenSymbol, primaryColor, secondaryColor, social }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="relative bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center neon-glow"
              style={{ 
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                boxShadow: `0 0 20px ${primaryColor}40`
              }}
            >
              <span className="text-white font-bold text-lg">{tokenSymbol[0]}</span>
            </div>
            <span className="text-white font-bold text-xl neon-text">{tokenSymbol}</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-white/80 hover:text-white transition-colors">About</a>
            <a href="#tokenomics" className="text-white/80 hover:text-white transition-colors">Tokenomics</a>
            <a href="#roadmap" className="text-white/80 hover:text-white transition-colors">Roadmap</a>
            <a href="#team" className="text-white/80 hover:text-white transition-colors">Team</a>
            
            {/* Social Links */}
            {social && (
              <div className="flex items-center space-x-4">
                {social.twitter && (
                  <a 
                    href={social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full transition-all duration-300 hover:scale-110"
                    style={{ 
                      backgroundColor: `${primaryColor}20`,
                      color: primaryColor
                    }}
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {social.telegram && (
                  <a 
                    href={social.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full transition-all duration-300 hover:scale-110"
                    style={{ 
                      backgroundColor: `${secondaryColor}20`,
                      color: secondaryColor
                    }}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>
                )}
                {social.discord && (
                  <a 
                    href={social.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full transition-all duration-300 hover:scale-110"
                    style={{ 
                      backgroundColor: `${primaryColor}20`,
                      color: primaryColor
                    }}
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}

            {/* CTA Button */}
            <button 
              className="px-6 py-2 rounded-full font-semibold transition-all duration-300 neon-glow hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                color: 'white',
                boxShadow: `0 0 20px ${primaryColor}40`
              }}
            >
              Buy Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-white/80 hover:text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              <a href="#about" className="text-white/80 hover:text-white transition-colors">About</a>
              <a href="#tokenomics" className="text-white/80 hover:text-white transition-colors">Tokenomics</a>
              <a href="#roadmap" className="text-white/80 hover:text-white transition-colors">Roadmap</a>
              <a href="#team" className="text-white/80 hover:text-white transition-colors">Team</a>
              
              {/* Mobile Social Links */}
              {social && (
                <div className="flex items-center space-x-4 pt-4">
                  {social.twitter && (
                    <a 
                      href={social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full"
                      style={{ 
                        backgroundColor: `${primaryColor}20`,
                        color: primaryColor
                      }}
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {social.telegram && (
                    <a 
                      href={social.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full"
                      style={{ 
                        backgroundColor: `${secondaryColor}20`,
                        color: secondaryColor
                      }}
                    >
                      <MessageCircle className="w-5 h-5" />
                    </a>
                  )}
                  {social.discord && (
                    <a 
                      href={social.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full"
                      style={{ 
                        backgroundColor: `${primaryColor}20`,
                        color: primaryColor
                      }}
                    >
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}

              {/* Mobile CTA Button */}
              <button 
                className="px-6 py-2 rounded-full font-semibold mt-4 neon-glow"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  color: 'white',
                  boxShadow: `0 0 20px ${primaryColor}40`
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
