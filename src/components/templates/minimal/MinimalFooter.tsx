import { Twitter, MessageCircle, Globe } from 'lucide-react'

interface MinimalFooterProps {
  projectName?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  colors?: {
    navBgColor?: string
  }
}

export const MinimalFooter = ({ 
  projectName = 'Vibes',
  primaryColor, 
  secondaryColor, 
  accentColor,
  colors
}: MinimalFooterProps) => {
  const currentYear = new Date().getFullYear()
  const finalProjectName = projectName || 'Vibes'

  return (
    <footer 
      className="text-white py-16"
      style={{ backgroundColor: colors?.navBgColor || '#1F2937' }}
      role="contentinfo" aria-label="Footer"
    >
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-2">
        <div className="flex flex-col items-center justify-center space-y-2">
          <p 
            className="text-center text-sm font-medium tracking-wide"
            style={{ color: '#ffffff' }}
          >
            {finalProjectName}
          </p>
          <p 
            className="text-center text-xs tracking-wide opacity-70"
            style={{ color: '#9CA3AF' }}
          >
            © {currentYear} {finalProjectName}. All rights reserved. Built with{' '}
            <a 
              href="https://solsites.fun" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:opacity-80 transition-opacity"
              style={{ color: '#9CA3AF' }}
            >
              SOL Sites
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}


// Deprecated duplicate type (kept for reference). Use the MinimalFooterProps above.
