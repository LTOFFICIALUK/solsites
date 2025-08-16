"use client"

import React from 'react'
import { Copy } from 'lucide-react'

interface TokenDetailsProps {
  data: {
    title?: string
    description?: string
    contractAddress?: string
    features?: Array<{
      title: string
      description: string
      icon: string
      color?: string
    }>
  }
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  preview?: boolean
  className?: string
}

export const MemecoinTokenDetails: React.FC<TokenDetailsProps> = ({ 
  data, 
  colors, 
  preview = false, 
  className = '' 
}) => {
  const handleCopy = async () => {
    if (data.contractAddress) {
      try {
        await navigator.clipboard.writeText(data.contractAddress)
        // You could add a toast notification here
      } catch (error) {
        console.error('Failed to copy contract address:', error)
      }
    }
  }

  const defaultFeatures = [
    {
      title: "Fair Launch",
      description: "Community-driven launch with equal opportunity for all investors.",
      icon: "⚖️",
      color: "#FF6B35"
    },
    {
      title: "Viral Momentum", 
      description: "Riding the wave of the biggest Japanese social media trend.",
      icon: "🚀",
      color: "#E55A2B"
    },
    {
      title: "Solana Network",
      description: "Fast, low-cost transactions on the most efficient blockchain.",
      icon: "⚡", 
      color: "#FFD700"
    },
    {
      title: "Meme Power",
      description: "Capturing the zeitgeist of Japanese internet culture with authentic viral content.",
      icon: "🎭",
      color: "#FF6B35"
    }
  ]

  const features = data.features && data.features.length > 0 ? data.features : defaultFeatures

  return (
    <section className={`py-20 bg-black ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white">
            {data.title || "Token Details"}
          </h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto">
            {data.description || "Join the viral sensation that's taking crypto by storm."}
          </p>
        </div>

        {/* Contract Address Box */}
        {data.contractAddress && (
          <div className="max-w-2xl mx-auto mb-16">
            <div 
              className="rounded-2xl p-8 text-white shadow-xl"
              style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Contract Address</h3>
                <p className="text-white/80 text-sm">Copy the contract address to trade</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 mb-4">
                <code className="text-sm md:text-base break-all text-white font-mono">
                  {data.contractAddress}
                </code>
              </div>
              <div className="text-center">
                <button 
                  onClick={handleCopy} 
                  className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200 flex items-center justify-center mx-auto space-x-2 hover:scale-105"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Address</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Token Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
