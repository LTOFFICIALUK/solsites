import { Twitter, MessageCircle, Globe } from 'lucide-react'

interface MinimalFooterProps {
  tokenSymbol: string
  social?: {
    twitter?: string
    telegram?: string
    discord?: string
    website?: string
  }
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

export const MinimalFooter = ({ tokenSymbol, social, primaryColor, secondaryColor, accentColor }: MinimalFooterProps) => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                }}
              >
                <span className="text-white font-bold text-sm">{tokenSymbol[0]}</span>
              </div>
              <span className="text-lg font-bold">{tokenSymbol}</span>
            </div>
            <p className="text-gray-400 text-sm">
              The future of meme coins on Solana blockchain.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Token</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#tokenomics" className="hover:text-white transition-colors">Tokenomics</a></li>
              <li><a href="#roadmap" className="hover:text-white transition-colors">Roadmap</a></li>
              <li><a href="#team" className="hover:text-white transition-colors">Team</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Telegram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Medium</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            {social && (
              <div className="flex space-x-3">
                {social.twitter && (
                  <a 
                    href={social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
                    style={{ 
                      backgroundColor: `${primaryColor}20`,
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
                      backgroundColor: `${secondaryColor}20`,
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
                      backgroundColor: `${primaryColor}20`,
                      color: primaryColor
                    }}
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 {tokenSymbol}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}


interface MinimalFooterProps {
  tokenSymbol: string
  social?: {
    twitter?: string
    telegram?: string
    discord?: string
    website?: string
  }
  primaryColor: string
  secondaryColor: string
  accentColor: string
}
