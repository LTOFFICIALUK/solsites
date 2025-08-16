const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://sxtmrdchzcxtknokyrjz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4dG1yZGNoemN4dGtub2t5cmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjc5NjgsImV4cCI6MjA3MDYwMzk2OH0.hyJgzWaYSOJj5kLn_K0G8P_6_W1wTxdvOOPq1P6lu9w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateDatabase() {
  console.log('🔄 Starting database update...');

  try {
    // First, let's check the current templates
    console.log('📋 Checking current templates...');
    const { data: currentTemplates, error: fetchError } = await supabase
      .from('templates')
      .select('*');

    if (fetchError) {
      console.error('❌ Error fetching templates:', fetchError);
      return;
    }

    console.log('📊 Current templates:', currentTemplates?.length || 0);

    // Delete all existing templates
    console.log('🗑️ Deleting existing templates...');
    const { error: deleteError } = await supabase
      .from('templates')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('❌ Error deleting templates:', deleteError);
      return;
    }

    console.log('✅ Templates deleted successfully');

    // Add the new Memecoin template
    console.log('➕ Adding new Memecoin template...');
    
    const memecoinTemplate = {
      id: 'memecoin-template-001',
      name: 'Memecoin',
      slug: 'memecoin',
      description: 'High-energy, viral design perfect for explosive meme coins. Features bold gradients, dynamic animations, and social media optimized content.',
      colors: {
        primary: '#FF6B35',
        secondary: '#E55A2B',
        accent: '#FFD700',
        background: '#0A0A0A',
        text: '#FFFFFF',
        gradient: {
          from: '#FF6B35',
          to: '#E55A2B'
        }
      },
      default_data: {
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
          ],
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
      }
    };

    const { data: insertData, error: insertError } = await supabase
      .from('templates')
      .insert([memecoinTemplate]);

    if (insertError) {
      console.error('❌ Error inserting template:', insertError);
      return;
    }

    console.log('✅ Memecoin template added successfully');

    // Verify the template was added
    console.log('🔍 Verifying template...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('templates')
      .select('*')
      .eq('slug', 'memecoin');

    if (verifyError) {
      console.error('❌ Error verifying template:', verifyError);
      return;
    }

    console.log('✅ Template verification successful');
    console.log('📋 Template data:', JSON.stringify(verifyData[0], null, 2));

    console.log('🎉 Database update completed successfully!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

updateDatabase();
