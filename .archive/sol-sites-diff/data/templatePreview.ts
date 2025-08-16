import { getTemplateBySlug } from './templates'

// Shared preview/default data for templates
export const getNeonPreviewData = () => {
  const neon = getTemplateBySlug('neon')
  return {
    tokenInfo: {
      name: 'Sample Token',
      symbol: 'SAMPLE',
      contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
      description:
        'A revolutionary meme coin built on Solana blockchain with innovative features and strong community focus.'
    },
    branding: {
      primaryColor: neon?.colors.primary || '#3B82F6',
      secondaryColor: neon?.colors.secondary || '#1E40AF',
      accentColor: neon?.colors.accent || '#F59E0B',
      logo: '',
      banner: ''
    },
    social: {
      twitter: 'https://twitter.com/sampletoken',
      telegram: 'https://t.me/sampletoken',
      discord: 'https://discord.gg/sampletoken',
      website: 'https://sampletoken.com'
    },
    content: {
      hero: {
        title: 'The Future of',
        subtitle: 'Meme Coins',
        description:
          'Join the revolution with the most innovative meme coin on Solana. Built by the community, for the community.'
      },
      about: {
        title: 'Why Choose Sample Token?',
        content:
          'Sample Token combines the fun of meme coins with real utility and strong fundamentals. Our community-driven approach ensures sustainable growth and long-term success.'
      },
      features: [
        { title: 'Community Driven', description: 'Built by the community, for the community. Every holder has a voice.', icon: 'users' },
        { title: 'Zero Tax', description: 'No buy or sell taxes. Keep more of your profits.', icon: 'zap' },
        { title: 'Liquidity Locked', description: 'Liquidity locked for maximum security and trust.', icon: 'lock' },
        { title: 'Transparent', description: 'Open source contract with full transparency.', icon: 'eye' }
      ],
      roadmap: [
        { title: 'Launch', description: 'Token launch on Solana with initial liquidity', date: 'Q1 2024', completed: true },
        { title: 'Marketing Campaign', description: 'Aggressive marketing push across social media', date: 'Q2 2024', completed: true },
        { title: 'Exchange Listings', description: 'List on major DEXs and CEXs', date: 'Q3 2024', completed: false },
        { title: 'NFT Collection', description: 'Launch exclusive NFT collection for holders', date: 'Q4 2024', completed: false }
      ],
      team: [
        { name: 'Alex Johnson', role: 'Founder & CEO', avatar: '', social: 'https://twitter.com/alexjohnson' },
        { name: 'Sarah Chen', role: 'Lead Developer', avatar: '', social: 'https://twitter.com/sarahchen' },
        { name: 'Mike Rodriguez', role: 'Marketing Director', avatar: '', social: 'https://twitter.com/mikerodriguez' }
      ]
    }
  }
}


