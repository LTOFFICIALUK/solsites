"use client"

import { Menu, X, MessageCircle, ArrowRight } from 'lucide-react'
import { useState } from 'react'

interface ClassicNavbarProps {
  tokenSymbol: string
  displayName?: string
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
  colors?: {
    socialBgColor?: string
    socialIconColor?: string
    buttonBgColor?: string
    buttonTextColor?: string
    navTextColor?: string
    navBgColor?: string
    tokenNameColor?: string
  }
}

export const ClassicNavbar = ({ tokenSymbol, displayName, primaryColor, secondaryColor, logoUrl, navItems, cta, social, colors }: ClassicNavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="relative backdrop-blur-md border-b border-gray-200" style={{ backgroundColor: colors?.navBgColor || 'rgba(255, 255, 255, 0.95)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            {logoUrl ? (
              <img src={logoUrl} alt={`${tokenSymbol} logo`} className="w-12 h-12 rounded-xl object-cover classic-shadow" />
            ) : (
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center classic-shadow"
                style={{ 
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                }}
              >
                <span className="text-white font-bold text-xl">{tokenSymbol[0]}</span>
              </div>
            )}
            <div>
              {displayName && <span className="text-2xl font-bold" style={{ color: colors?.tokenNameColor || '#111827' }}>{displayName}</span>}
              <div className="text-sm text-gray-500">Token</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {(navItems && navItems.length > 0 ? navItems : [
              { label: 'About', href: '#about' },
              { label: 'Tokenomics', href: '#tokenomics' },
              { label: 'Roadmap', href: '#roadmap' },
              { label: 'Team', href: '#team' }
            ]).map((item) => (
              <a key={item.href + item.label} href={item.href} className="font-medium transition-colors" style={{ color: colors?.navTextColor || '#374151' }}>{item.label}</a>
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
                      backgroundColor: colors?.socialBgColor || `${primaryColor}10`,
                      color: colors?.socialIconColor || secondaryColor
                    }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                )}
                {social.telegram && (
                  <a 
                    href={social.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
                    style={{ 
                      backgroundColor: colors?.socialBgColor || `${primaryColor}10`,
                      color: colors?.socialIconColor || secondaryColor
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
                    className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
                    style={{ 
                      backgroundColor: colors?.socialBgColor || `${primaryColor}10`,
                      color: colors?.socialIconColor || secondaryColor
                    }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.019 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}

            {/* CTA Button */}
            {(cta?.href ? (
              <a 
                href={cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 classic-hover"
                style={{
                  background: colors?.buttonBgColor || `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  color: colors?.buttonTextColor || 'white'
                }}
              >
                {cta?.text || 'Buy Now'}
                <ArrowRight className="inline-block ml-2 w-4 h-4" />
              </a>
            ) : (
              <button 
                className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 classic-hover"
                style={{
                  background: colors?.buttonBgColor || `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  color: colors?.buttonTextColor || 'white'
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
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-200">
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
                        color: secondaryColor
                      }}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  )}
                  {social.telegram && (
                    <a 
                      href={social.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg"
                      style={{ 
                        backgroundColor: `${primaryColor}10`,
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
                      className="p-2 rounded-lg"
                      style={{ 
                        backgroundColor: `${primaryColor}10`,
                        color: secondaryColor
                      }}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.019 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
                      </svg>
                    </a>
                  )}
                </div>
              )}

              {/* Mobile CTA Button */}
              {(cta?.href ? (
                <a 
                  href={cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl font-semibold mt-4"
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
                  className="px-6 py-3 rounded-xl font-semibold mt-4"
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
