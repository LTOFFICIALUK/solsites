-- =====================================================
-- COMPREHENSIVE DATABASE FIX SCRIPT
-- =====================================================

BEGIN;

-- =====================================================
-- 1. ADD DEFAULT_DATA COLUMN TO TEMPLATES TABLE
-- =====================================================

-- Add default_data column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'templates' AND column_name = 'default_data'
  ) THEN
    ALTER TABLE templates ADD COLUMN default_data JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- =====================================================
-- 2. UPDATE MEMECOIN TEMPLATE WITH DEFAULT DATA
-- =====================================================

UPDATE templates 
SET default_data = $JSON${
  "tokenInfo": {
    "name": "HappyMeal",
    "description": "The viral crypto sensation taking Japanese Twitter by storm! 27M+ views in a single day!"
  },
  "branding": {
    "logo": "/solsites-logo.svg",
    "primaryColor": "#8B5CF6",
    "secondaryColor": "#3B82F6",
    "accentColor": "#F59E0B"
  },
  "header": {
    "navigation": [
      { "text": "Home", "href": "#home" },
      { "text": "About", "href": "#about" },
      { "text": "Tokenomics", "href": "#tokenomics" },
      { "text": "Roadmap", "href": "#roadmap" },
      { "text": "Team", "href": "#team" },
      { "text": "Community", "href": "#community" }
    ],
    "cta": {
      "text": "Buy Now",
      "href": "#buy",
      "variant": "primary"
    }
  },
  "hero": {
    "title": "HappyMeal Token",
    "subtitle": "The viral crypto sensation taking Japanese Twitter by storm!",
    "description": "27M+ views in a single day! Join the revolution that's taking the internet by storm.",
    "stats": [
      { "label": "Market Cap", "value": "$2.7M", "color": "purple" },
      { "label": "Holders", "value": "1,337", "color": "blue" },
      { "label": "Liquidity", "value": "$420K", "color": "orange" }
    ],
    "cta": {
      "primary": { "text": "Buy Now", "href": "#buy" },
      "secondary": { "text": "Join Community", "href": "#community" }
    }
  },
  "about": {
    "title": "About HappyMeal Token",
    "description": "What started as a simple Happy Meal toy craze became Japan's biggest social media controversy.",
    "content": "The viral story of how a simple McDonald's Happy Meal toy created a nationwide frenzy in Japan, leading to massive social media engagement and the birth of the most talked-about meme coin of 2024.",
    "features": [
      {
        "title": "Viral Marketing",
        "description": "Leveraging the power of social media to create unprecedented engagement",
        "icon": "trending-up"
      },
      {
        "title": "Community Driven",
        "description": "Built by the community, for the community",
        "icon": "users"
      },
      {
        "title": "Transparent",
        "description": "Full transparency in all operations and tokenomics",
        "icon": "eye"
      }
    ]
  },
  "tokenomics": {
    "title": "Tokenomics",
    "description": "Fair and transparent token distribution",
    "totalSupply": "1,000,000,000",
    "distribution": [
      { "category": "Liquidity", "percentage": 40, "color": "#3B82F6" },
      { "category": "Marketing", "percentage": 20, "color": "#8B5CF6" },
      { "category": "Development", "percentage": 15, "color": "#F59E0B" },
      { "category": "Team", "percentage": 10, "color": "#10B981" },
      { "category": "Community", "percentage": 15, "color": "#EF4444" }
    ],
    "features": [
      "Locked Liquidity",
      "Anti-Bot Protection",
      "Reflection Rewards",
      "Auto-Burn Mechanism"
    ]
  },
  "roadmap": {
    "title": "Roadmap",
    "description": "Our journey to revolutionize the meme coin space",
    "phases": [
      {
        "title": "Phase 1: Launch",
        "description": "Token launch and initial marketing campaign",
        "items": ["Token Launch", "Website Launch", "Social Media Setup", "Community Building"],
        "status": "completed"
      },
      {
        "title": "Phase 2: Growth",
        "description": "Expanding reach and building partnerships",
        "items": ["CEX Listings", "Influencer Partnerships", "Marketing Campaigns", "Community Expansion"],
        "status": "in-progress"
      },
      {
        "title": "Phase 3: Ecosystem",
        "description": "Building a comprehensive ecosystem",
        "items": ["NFT Collection", "Staking Platform", "Governance Token", "Cross-Chain Bridge"],
        "status": "planned"
      }
    ]
  },
  "team": {
    "title": "Meet the Team",
    "description": "The passionate team behind HappyMeal Token",
    "members": [
      {
        "name": "Satoshi Nakamoto",
        "role": "Founder & CEO",
        "bio": "Former McDonald's employee turned crypto entrepreneur. Expert in viral marketing and community building.",
        "avatar": "/team/satoshi.jpg",
        "social": {
          "twitter": "https://twitter.com/satoshi",
          "linkedin": "https://linkedin.com/in/satoshi"
        }
      },
      {
        "name": "Vitalik Buterin",
        "role": "CTO",
        "bio": "Blockchain architect and smart contract specialist. Building the future of decentralized finance.",
        "avatar": "/team/vitalik.jpg",
        "social": {
          "twitter": "https://twitter.com/vitalik",
          "linkedin": "https://linkedin.com/in/vitalik"
        }
      }
    ]
  },
  "community": {
    "title": "Join Our Community",
    "description": "Be part of the viral phenomenon that's taking Japan and the world by storm",
    "stats": [
      { "label": "Twitter Followers", "value": "27K+", "icon": "twitter" },
      { "label": "Telegram Members", "value": "15K+", "icon": "message-circle" },
      { "label": "Discord Members", "value": "8K+", "icon": "discord" }
    ],
    "socialLinks": [
      { "platform": "Twitter", "url": "https://twitter.com/happymealtoken", "icon": "twitter" },
      { "platform": "Telegram", "url": "https://t.me/happymealtoken", "icon": "message-circle" },
      { "platform": "Discord", "url": "https://discord.gg/happymealtoken", "icon": "discord" },
      { "platform": "Reddit", "url": "https://reddit.com/r/happymealtoken", "icon": "reddit" }
    ]
  },
  "footer": {
    "logo": "/solsites-logo.svg",
    "description": "The viral crypto sensation taking Japanese Twitter by storm!",
    "socialLinks": [
      { "platform": "Twitter", "url": "https://twitter.com/happymealtoken", "icon": "twitter" },
      { "platform": "Telegram", "url": "https://t.me/happymealtoken", "icon": "message-circle" },
      { "platform": "Discord", "url": "https://discord.gg/happymealtoken", "icon": "discord" }
    ],
    "links": [
      { "text": "Privacy Policy", "href": "/privacy" },
      { "text": "Terms of Service", "href": "/terms" },
      { "text": "Contact", "href": "/contact" }
    ]
  },
  "faq": [
    {
      "question": "What is HappyMeal Token?",
      "answer": "HappyMeal Token is a meme coin inspired by the viral McDonald's Happy Meal toy controversy in Japan, capturing the zeitgeist of internet culture."
    },
    {
      "question": "Is this affiliated with McDonald's?",
      "answer": "No, this is an independent meme coin created for entertainment purposes and is not affiliated with McDonald's Corporation."
    },
    {
      "question": "How can I buy HappyMeal Token?",
      "answer": "You can buy HappyMeal Token on major decentralized exchanges like PancakeSwap and Uniswap using BNB or ETH."
    },
    {
      "question": "What makes HappyMeal Token unique?",
      "answer": "HappyMeal Token combines viral marketing, community engagement, and transparent tokenomics to create a truly unique meme coin experience."
    }
  ]
}$JSON$::jsonb
WHERE slug = 'memecoin';

-- =====================================================
-- 3. CREATE PROJECT FROM TEMPLATE FUNCTION (FIXED)
-- =====================================================

CREATE OR REPLACE FUNCTION create_project_from_template(
  p_user_id UUID,
  p_name TEXT,
  p_slug TEXT,
  p_template_slug TEXT
) RETURNS UUID AS $$
DECLARE
  v_project_id UUID;
  v_template_id UUID;
  v_template_data JSONB;
  v_block_order INTEGER := 0;
  v_block_data JSONB;
BEGIN
  -- Get template data
  SELECT id, default_data INTO v_template_id, v_template_data
  FROM templates 
  WHERE slug = p_template_slug;
  
  IF v_template_id IS NULL THEN
    RAISE EXCEPTION 'Template not found: %', p_template_slug;
  END IF;
  
  -- Create project
  INSERT INTO user_projects (
    user_id,
    name,
    slug,
    template_id,
    is_published,
    created_at,
    updated_at
  ) VALUES (
    p_user_id,
    p_name,
    p_slug,
    v_template_id,
    false,
    NOW(),
    NOW()
  ) RETURNING id INTO v_project_id;
  
  -- Create blocks from template data
  -- Header Block
  IF v_template_data->'header' IS NOT NULL THEN
    v_block_data := jsonb_build_object(
      'navigation', v_template_data->'header'->'navigation',
      'cta', v_template_data->'header'->'cta'
    );
    
    INSERT INTO user_project_blocks (
      project_id,
      name,
      type,
      order_index,
      content,
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'Header',
      'header',
      v_block_order,
      v_block_data,
      true,
      NOW(),
      NOW()
    );
    v_block_order := v_block_order + 1;
  END IF;

  -- Hero Block
  IF v_template_data->'hero' IS NOT NULL THEN
    v_block_data := jsonb_build_object(
      'title', v_template_data->'hero'->>'title',
      'subtitle', v_template_data->'hero'->>'subtitle',
      'description', v_template_data->'hero'->>'description',
      'stats', v_template_data->'hero'->'stats',
      'cta', v_template_data->'hero'->'cta'
    );
    
    INSERT INTO user_project_blocks (
      project_id,
      name,
      type,
      order_index,
      content,
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'Hero',
      'hero',
      v_block_order,
      v_block_data,
      true,
      NOW(),
      NOW()
    );
    v_block_order := v_block_order + 1;
  END IF;

  -- About Block
  IF v_template_data->'about' IS NOT NULL THEN
    v_block_data := jsonb_build_object(
      'title', v_template_data->'about'->>'title',
      'description', v_template_data->'about'->>'description',
      'content', v_template_data->'about'->>'content',
      'features', v_template_data->'about'->'features'
    );
    
    INSERT INTO user_project_blocks (
      project_id,
      name,
      type,
      order_index,
      content,
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'About',
      'about',
      v_block_order,
      v_block_data,
      true,
      NOW(),
      NOW()
    );
    v_block_order := v_block_order + 1;
  END IF;

  -- Tokenomics Block
  IF v_template_data->'tokenomics' IS NOT NULL THEN
    v_block_data := jsonb_build_object(
      'title', v_template_data->'tokenomics'->>'title',
      'description', v_template_data->'tokenomics'->>'description',
      'totalSupply', v_template_data->'tokenomics'->>'totalSupply',
      'distribution', v_template_data->'tokenomics'->'distribution',
      'features', v_template_data->'tokenomics'->'features'
    );
    
    INSERT INTO user_project_blocks (
      project_id,
      name,
      type,
      order_index,
      content,
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'Tokenomics',
      'tokenomics',
      v_block_order,
      v_block_data,
      true,
      NOW(),
      NOW()
    );
    v_block_order := v_block_order + 1;
  END IF;

  -- Roadmap Block
  IF v_template_data->'roadmap' IS NOT NULL THEN
    v_block_data := jsonb_build_object(
      'title', v_template_data->'roadmap'->>'title',
      'description', v_template_data->'roadmap'->>'description',
      'phases', v_template_data->'roadmap'->'phases'
    );
    
    INSERT INTO user_project_blocks (
      project_id,
      name,
      type,
      order_index,
      content,
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'Roadmap',
      'roadmap',
      v_block_order,
      v_block_data,
      true,
      NOW(),
      NOW()
    );
    v_block_order := v_block_order + 1;
  END IF;

  -- Team Block
  IF v_template_data->'team' IS NOT NULL THEN
    v_block_data := jsonb_build_object(
      'title', v_template_data->'team'->>'title',
      'description', v_template_data->'team'->>'description',
      'members', v_template_data->'team'->'members'
    );
    
    INSERT INTO user_project_blocks (
      project_id,
      name,
      type,
      order_index,
      content,
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'Team',
      'team',
      v_block_order,
      v_block_data,
      true,
      NOW(),
      NOW()
    );
    v_block_order := v_block_order + 1;
  END IF;

  -- Community Block
  IF v_template_data->'community' IS NOT NULL THEN
    v_block_data := jsonb_build_object(
      'title', v_template_data->'community'->>'title',
      'description', v_template_data->'community'->>'description',
      'stats', v_template_data->'community'->'stats',
      'socialLinks', v_template_data->'community'->'socialLinks'
    );
    
    INSERT INTO user_project_blocks (
      project_id,
      name,
      type,
      order_index,
      content,
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'Community',
      'community',
      v_block_order,
      v_block_data,
      true,
      NOW(),
      NOW()
    );
    v_block_order := v_block_order + 1;
  END IF;

  -- Footer Block
  IF v_template_data->'footer' IS NOT NULL THEN
    v_block_data := jsonb_build_object(
      'logo', v_template_data->'footer'->>'logo',
      'description', v_template_data->'footer'->>'description',
      'socialLinks', v_template_data->'footer'->'socialLinks',
      'links', v_template_data->'footer'->'links'
    );
    
    INSERT INTO user_project_blocks (
      project_id,
      name,
      type,
      order_index,
      content,
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'Footer',
      'footer',
      v_block_order,
      v_block_data,
      true,
      NOW(),
      NOW()
    );
  END IF;

  RETURN v_project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. CREATE PROJECT DATA LOADING FUNCTION (FIXED)
-- =====================================================

CREATE OR REPLACE FUNCTION get_project_data(p_project_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_project_data JSONB;
  v_blocks_data JSONB;
BEGIN
  -- Get project info
  SELECT jsonb_build_object(
    'project', jsonb_build_object(
      'id', up.id,
      'name', up.name,
      'slug', up.slug,
      'template_id', up.template_id,
      'is_published', up.is_published,
      'created_at', up.created_at,
      'updated_at', up.updated_at
    )
  ) INTO v_project_data
  FROM user_projects up
  WHERE up.id = p_project_id;
  
  IF v_project_data IS NULL THEN
    RAISE EXCEPTION 'Project not found: %', p_project_id;
  END IF;
  
  -- Get blocks data (REMOVED settings column reference)
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', upb.id,
      'name', upb.name,
      'type', upb.type,
      'content', upb.content,
      'order_index', upb.order_index,
      'is_enabled', upb.is_enabled
    ) ORDER BY upb.order_index
  ) INTO v_blocks_data
  FROM user_project_blocks upb
  WHERE upb.project_id = p_project_id AND upb.is_enabled = true;
  
  -- Combine project and blocks data
  RETURN v_project_data || jsonb_build_object('blocks', COALESCE(v_blocks_data, '[]'::jsonb));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. GRANT PERMISSIONS
-- =====================================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION create_project_from_template(UUID, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_project_data(UUID) TO authenticated;

COMMIT;
