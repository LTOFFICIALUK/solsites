const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://sxtmrdchzcxtknokyrjz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4dG1yZGNoemN4dGtub2t5cmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjc5NjgsImV4cCI6MjA3MDYwMzk2OH0.hyJgzWaYSOJj5kLn_K0G8P_6_W1wTxdvOOPq1P6lu9w';

const supabase = createClient(supabaseUrl, supabaseKey);

// Import the default data from our templates file
const memecoinDefaultData = {
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
  header: {
    displayName: "HappyMeal",
    colors: { 
      primary: "#FF6B35", 
      secondary: "#E55A2B" 
    },
    navItems: [
      { label: 'About', href: '#about' },
      { label: 'Tokenomics', href: '#tokenomics' },
      { label: 'Roadmap', href: '#roadmap' },
      { label: 'Community', href: '#community' }
    ],
    cta: { text: 'Buy $HAPPY Now', href: '#', variant: 'primary' },
    logo: "🍔"
  },
  content: {
    hero: {
      title: "HappyMeal",
      subtitle: "ハッピーセット",
      description: "The viral crypto sensation taking Japanese Twitter by storm! 27M+ views in a single day!",
      showTokenPill: true,
      showStats: true,
      showPrimaryButton: true,
      showSecondaryButton: true,
      showTokenVisual: true,
      showScrollIndicator: true,
      tokenSymbol: "HAPPY",
      stats: [
        { value: "27M+", label: "Peak Views", color: "primary", icon: "🔥" },
        { value: "Trending #1", label: "Japan", color: "secondary", icon: "🇯🇵" },
        { value: "Viral", label: "Sensation", color: "accent", icon: "⚡" }
      ],
      primaryButton: { text: "Buy $HAPPY Now", href: "#", variant: "primary" },
      secondaryButton: { text: "Join Community", href: "#", variant: "secondary" },
      scrollText: "Scroll to explore the viral story",
      backgroundImage: "/api/placeholder/1920/1080"
    },
    about: {
      title: "The Viral Story",
      description: "What started as a simple Happy Meal toy craze became Japan's biggest social media controversy.",
      content: "The viral story of how a simple McDonald's Happy Meal toy created a nationwide frenzy in Japan, leading to massive social media engagement and the birth of the most talked-about meme coin of 2024.",
      contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
      ctaTitle: "Are the toys really worth it?",
      ctaDescription: "Original Price: ¥500 | Resale Price: ??? | 600% Markup! 🔥",
      ctaPrimary: { text: "View Chart", href: "#", variant: "primary" },
      ctaSecondary: { text: "See the Trend", href: "#", variant: "secondary" },
      features: [
        {
          title: "The Toy Rush Begins",
          description: "People started buying Happy Meals just for the collectible toys, creating a massive resale market.",
          icon: "🎁",
          color: "#FF6B35"
        },
        {
          title: "Food Waste Controversy",
          description: "Public outrage over food waste as people only wanted the toys, not the food.",
          icon: "🍔",
          color: "#E55A2B"
        },
        {
          title: "Twitter Explosion",
          description: "The controversy went viral on Japanese Twitter, reaching 27M+ views in a single day.",
          icon: "🔥",
          color: "#FFD700"
        }
      ]
    },
    features: [
      {
        title: "Viral Marketing",
        description: "Built for maximum social media impact with trending hashtags and shareable content",
        icon: "🚀",
        color: "#FF6B35"
      },
      {
        title: "Community Driven",
        description: "Strong community focus with active social media presence and engagement",
        icon: "👥",
        color: "#E55A2B"
      },
      {
        title: "Meme Culture",
        description: "Embraces internet culture and meme trends for maximum virality",
        icon: "😂",
        color: "#FFD700"
      }
    ],
    roadmap: {
      title: "Roadmap to the Moon",
      description: "Our journey from viral sensation to established meme coin ecosystem",
      phases: [
        {
          title: "Phase 1: Launch",
          date: "Q1 2024",
          description: "Initial launch and community building",
          isCompleted: true,
          items: [
            "Token launch on major DEXs",
            "Community social media setup",
            "Initial marketing campaign"
          ]
        },
        {
          title: "Phase 2: Growth",
          date: "Q2 2024",
          description: "Expanding reach and utility",
          isCompleted: false,
          items: [
            "CEX listings",
            "Partnership announcements",
            "Ecosystem development"
          ]
        },
        {
          title: "Phase 3: Ecosystem",
          date: "Q3 2024",
          description: "Building comprehensive ecosystem",
          isCompleted: false,
          items: [
            "DeFi integrations",
            "NFT marketplace",
            "Governance platform"
          ]
        }
      ]
    },
    team: {
      title: "Meet the Team",
      description: "The passionate team behind the viral sensation",
      members: [
        {
          name: "Chef Meme",
          role: "Founder & CEO",
          bio: "Former McDonald's employee turned crypto entrepreneur. Expert in viral marketing and community building.",
          avatar: "/api/placeholder/200/200",
          social: {
            twitter: "https://twitter.com/chefmeme",
            linkedin: "https://linkedin.com/in/chefmeme"
          }
        },
        {
          name: "Satoshi Nakamoto",
          role: "Lead Developer",
          bio: "Blockchain developer with 10+ years experience. Built multiple successful DeFi protocols.",
          avatar: "/api/placeholder/200/200",
          social: {
            twitter: "https://twitter.com/satoshi",
            github: "https://github.com/satoshi"
          }
        },
        {
          name: "Crypto Karen",
          role: "Marketing Director",
          bio: "Social media expert who knows how to make things go viral. Former TikTok influencer.",
          avatar: "/api/placeholder/200/200",
          social: {
            twitter: "https://twitter.com/cryptokaren",
            instagram: "https://instagram.com/cryptokaren"
          }
        }
      ]
    },
    tokenomics: {
      title: "Tokenomics",
      description: "Fair and transparent token distribution designed for long-term success",
      totalSupply: "1,000,000,000 HAPPY",
      distribution: [
        { name: "Liquidity", percentage: 40, color: "#FF6B35", description: "Locked for stability" },
        { name: "Community", percentage: 30, color: "#E55A2B", description: "Fair launch allocation" },
        { name: "Marketing", percentage: 15, color: "#FFD700", description: "Viral campaigns" },
        { name: "Development", percentage: 10, color: "#FF8C42", description: "Ecosystem growth" },
        { name: "Team", percentage: 5, color: "#FFA07A", description: "Vested over time" }
      ]
    },
    community: {
      title: "Join the Community",
      description: "Be part of the viral phenomenon that's taking Japan and the world by storm",
      cards: [
        {
          title: "X Community",
          description: "Join 27M+ enthusiasts sharing memes, updates, and viral content",
          icon: "🐦",
          link: "https://twitter.com/happymealtoken"
        },
        {
          title: "Live Trading",
          description: "Track real-time price action and market movements",
          icon: "📈",
          link: "#"
        },
        {
          title: "Twitter Trend",
          description: "Follow the viral hashtag #HappyMealToken",
          icon: "🔥",
          link: "https://twitter.com/search?q=%23HappyMealToken"
        }
      ]
    },
    faq: [
      {
        question: "What is HappyMeal Token?",
        answer: "HappyMeal Token is a meme coin inspired by the viral McDonald's Happy Meal toy controversy in Japan, capturing the zeitgeist of internet culture."
      },
      {
        question: "Is this affiliated with McDonald's?",
        answer: "No, this is an independent meme coin created for entertainment purposes and is not affiliated with McDonald's Corporation."
      },
      {
        question: "How can I buy HappyMeal Token?",
        answer: "You can buy HAPPY tokens on major DEXs like Raydium or through our website. Always DYOR and invest responsibly."
      }
    ]
  }
};

async function updateTemplateData() {
  console.log('🔄 Updating template with default_data...\n');
  
  const { data, error } = await supabase
    .from('templates')
    .update({ 
      default_data: memecoinDefaultData,
      updated_at: new Date().toISOString()
    })
    .eq('slug', 'memecoin')
    .select();
  
  if (error) {
    console.error('❌ Error updating template:', error);
    return;
  }
  
  console.log('✅ Template updated successfully!');
  console.log('Updated template:', data[0]);
}

updateTemplateData().catch(console.error);
