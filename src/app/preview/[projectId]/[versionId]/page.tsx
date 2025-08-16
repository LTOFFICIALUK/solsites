"use client"

import { useParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { loadProjectData, ProjectData, ProjectBlock } from '@/lib/services'
import { MemecoinTemplate } from '@/components/templates/memecoin/MemecoinTemplate'
import { getTemplateBySlug } from '@/data/templates'
import { trackPageView, getCurrentSessionId, endSession } from '@/lib/analytics'

export default function ProductionPreviewPage() {
  const params = useParams()
  const projectId = params.projectId as string
  const versionId = params.versionId as string
  
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasTrackedInitialView, setHasTrackedInitialView] = useState(false)

  // Load project data using the new unified system
  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log('🔍 Loading project for versioned preview with ID:', projectId)

        // Use the same loadProjectData function as the editor
        const data = await loadProjectData(projectId)
        setProjectData(data)
        
        console.log('✅ Project loaded for versioned preview:', data)
        
      } catch (err) {
        console.error('❌ Error loading project for versioned preview:', err)
        setError(err instanceof Error ? err.message : 'Failed to load project')
      } finally {
        setIsLoading(false)
      }
    }

    if (projectId) {
      loadProject()
    }
  }, [projectId])

  // Track page view when project data is loaded
  useEffect(() => {
    if (!projectId || !projectData || hasTrackedInitialView) return
    const pageUrl = typeof window !== 'undefined' ? window.location.href : `/preview/${projectId}/${versionId}`
    trackPageView(projectId, pageUrl)
    setHasTrackedInitialView(true)
  }, [projectId, projectData, hasTrackedInitialView, versionId])

  // End session on tab close/unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const sessionId = getCurrentSessionId()
      if (sessionId) {
        endSession(sessionId)
      }
    }

      window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  // Transform project data to template format (same as editor)
  const transformToTemplateData = useCallback((projectData: ProjectData) => {
    if (!projectData || !projectData.blocks) return null;

    // Get template info
    const template = getTemplateBySlug('memecoin');
    if (!template) return null;

    // Transform blocks to template data structure
    const templateData: any = {
      tokenInfo: {
        name: "HappyMeal",
        symbol: "HAPPY",
        contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
        description: "The viral crypto sensation taking Japanese Twitter by storm! 27M+ views in a single day!",
        totalSupply: "1,000,000,000",
        circulatingSupply: "800,000,000",
        price: "$0.0025",
        marketCap: "$2,000,000"
      },
      branding: {
        primaryColor: "#FF6B35",
        secondaryColor: "#E55A2B",
        accentColor: "#FFD700",
        logo: "🍔",
        banner: "/api/placeholder/1200/400",
        favicon: "🍔"
      },
      social: {
        twitter: "https://twitter.com/happymealtoken",
        telegram: "https://t.me/happymealtoken",
        discord: "https://discord.gg/happymealtoken",
        website: "https://happymealtoken.com"
      },
      header: {},
      content: {
        features: [
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
        ],
        roadmap: [
          {
            title: "Viral Launch",
            description: "Token launch coinciding with peak social media virality",
            date: "Q1 2024",
            completed: true,
            items: ["27M+ Twitter views", "Trending #1 in Japan", "Community building"]
          },
          {
            title: "Exchange Listings",
            description: "Major DEX and CEX listings to increase accessibility",
            date: "Q2 2024",
            completed: false,
            items: ["Raydium listing", "Jupiter integration", "CEX partnerships"]
          },
          {
            title: "NFT Collection",
            description: "Exclusive Happy Meal themed NFT collection for holders",
            date: "Q3 2024",
            completed: false,
            items: ["10,000 unique NFTs", "Holder benefits", "Rare toy variants"]
          },
          {
            title: "Global Expansion",
            description: "Taking the viral sensation worldwide",
            date: "Q4 2024",
            completed: false,
            items: ["International marketing", "Partnerships", "Ecosystem growth"]
          }
        ],
        team: [
          {
            name: "Anonymous",
            role: "Founder & Meme Lord",
            avatar: "🎭",
            social: "https://twitter.com/happymealfounder",
            bio: "The mysterious creator behind the viral sensation"
          },
          {
            name: "Community",
            role: "The Real Heroes",
            avatar: "👥",
            social: "https://twitter.com/happymealcommunity",
            bio: "27M+ strong community driving the viral movement"
          }
        ]
      }
    };

    // Map blocks to template data
    projectData.blocks.forEach(block => {
      switch (block.type) {
        case 'header':
          templateData.header = {
            displayName: block.content.displayName || "HappyMeal",
            colors: block.content.colors || { primary: "#FF6B35", secondary: "#E55A2B" },
            navItems: block.content.navigation || [],
            cta: block.content.cta || { text: 'Buy $HAPPY Now', href: '#', variant: 'primary' },
            logo: block.content.logo || "🍔"
          };
          break;
        case 'hero':
          templateData.content.hero = {
            title: block.content.title || "HappyMeal",
            subtitle: block.content.subtitle || "ハッピーセット",
            description: block.content.description || "The viral crypto sensation taking Japanese Twitter by storm! 27M+ views in a single day!",
            stats: block.content.stats || [],
            primaryButton: block.content.primaryButton || { text: "Buy $HAPPY Now", href: "#", variant: "primary" },
            secondaryButton: block.content.secondaryButton || { text: "Join Community", href: "#", variant: "secondary" },
            tokenSymbol: block.content.tokenSymbol || "HAPPY",
            showTokenPill: block.content.showTokenPill || true,
            showStats: block.content.showStats || true,
            showPrimaryButton: block.content.showPrimaryButton || true,
            showSecondaryButton: block.content.showSecondaryButton || true,
            showTokenVisual: block.content.showTokenVisual || true,

            backgroundImage: block.content.backgroundImage || "/api/placeholder/1920/1080"
          };
          break;
        case 'about':
          templateData.content.about = {
            title: block.content.title || "The Viral Story",
            description: block.content.description || "What started as a simple Happy Meal toy craze became Japan's biggest social media controversy.",
            content: block.content.content || "The viral story of how a simple McDonald's Happy Meal toy created a nationwide frenzy in Japan, leading to massive social media engagement and the birth of the most talked-about meme coin of 2024.",
            contractAddress: block.content.contractAddress || "0x1234567890abcdef1234567890abcdef12345678",
            ctaTitle: block.content.ctaTitle || "Are the toys really worth it?",
            ctaDescription: block.content.ctaDescription || "Original Price: ¥500 | Resale Price: ??? | 600% Markup! 🔥",
            ctaPrimary: block.content.ctaPrimary || { text: "View Chart", href: "#", variant: "primary" },
            ctaSecondary: block.content.ctaSecondary || { text: "See the Trend", href: "#", variant: "secondary" },
            features: block.content.features || []
          };
          break;
        case 'tokenomics':
          templateData.content.tokenomics = {
            title: block.content.title || "Tokenomics",
            description: block.content.description || "Fair and transparent token distribution designed for long-term success",
            totalSupply: block.content.totalSupply || "1,000,000,000 HAPPY",
            distribution: block.content.distribution || []
          };
          break;
        case 'roadmap':
          templateData.content.roadmap = Array.isArray(block.content.phases) ? block.content.phases : [
            {
              title: "Viral Launch",
              description: "Token launch coinciding with peak social media virality",
              date: "Q1 2024",
              completed: true,
              items: ["27M+ Twitter views", "Trending #1 in Japan", "Community building"]
            },
            {
              title: "Exchange Listings",
              description: "Major DEX and CEX listings to increase accessibility",
              date: "Q2 2024",
              completed: false,
              items: ["Raydium listing", "Jupiter integration", "CEX partnerships"]
            },
            {
              title: "NFT Collection",
              description: "Exclusive Happy Meal themed NFT collection for holders",
              date: "Q3 2024",
              completed: false,
              items: ["10,000 unique NFTs", "Holder benefits", "Rare toy variants"]
            },
            {
              title: "Global Expansion",
              description: "Taking the viral sensation worldwide",
              date: "Q4 2024",
              completed: false,
              items: ["International marketing", "Partnerships", "Ecosystem growth"]
            }
          ];
          break;
        case 'team':
          templateData.content.team = Array.isArray(block.content.members) ? block.content.members : [
            {
              name: "Anonymous",
              role: "Founder & Meme Lord",
              avatar: "🎭",
              social: "https://twitter.com/happymealfounder",
              bio: "The mysterious creator behind the viral sensation"
            },
            {
              name: "Community",
              role: "The Real Heroes",
              avatar: "👥",
              social: "https://twitter.com/happymealcommunity",
              bio: "27M+ strong community driving the viral movement"
            }
          ];
          break;
        case 'community':
          templateData.content.community = {
            title: block.content.title || "Join the Community",
            description: block.content.description || "Be part of the viral phenomenon that's taking Japan and the world by storm",
            cards: block.content.cards || []
          };
          break;
        case 'token-details':
          templateData.content.tokenDetails = {
            title: block.content.title || "Token Details",
            description: block.content.description || "Join the viral sensation that's taking crypto by storm.",
            contractAddress: block.content.contractAddress || "0x1234567890abcdef1234567890abcdef12345678",
            features: block.content.features || []
          };
          break;
      }
    });

    return { template, data: templateData };
  }, [projectData]);

  // Render the project
  const renderProject = () => {
    if (!projectData) return null;

    const templateData = transformToTemplateData(projectData);
    if (!templateData) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Template Not Found</h1>
            <p className="text-gray-600">The template for this project could not be loaded.</p>
          </div>
        </div>
      );
    }

    return (
      <MemecoinTemplate
        template={templateData.template}
        data={templateData.data}
        preview={false} // This is production preview, not editor preview
      />
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-900">Loading Preview...</h1>
          <p className="text-gray-600 mt-2">Preparing your project for preview</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Preview</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {renderProject()}
    </div>
  );
}
