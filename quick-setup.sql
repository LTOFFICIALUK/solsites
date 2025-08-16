-- Enable Row Level Security

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create templates table
CREATE TABLE public.templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  colors JSONB NOT NULL DEFAULT '{"primary": "#3B82F6", "secondary": "#1E40AF", "accent": "#F59E0B"}',
  thumbnail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_projects table
CREATE TABLE public.user_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES public.templates(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT UNIQUE,
  data JSONB NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add performance indexes for user_projects
CREATE INDEX idx_user_projects_user_id ON public.user_projects(user_id);
CREATE INDEX idx_user_projects_template_id ON public.user_projects(template_id);
CREATE INDEX idx_user_projects_slug ON public.user_projects(slug);
CREATE INDEX idx_user_projects_domain ON public.user_projects(domain);
CREATE INDEX idx_user_projects_is_published ON public.user_projects(is_published);
CREATE INDEX idx_user_projects_created_at ON public.user_projects(created_at);

-- Create template_sections table for Shopify-like section management
CREATE TABLE public.template_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.templates(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'header', 'template', 'footer'
  order_index INTEGER NOT NULL DEFAULT 0,
  is_enabled BOOLEAN DEFAULT TRUE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create section_blocks table for individual blocks within sections
CREATE TABLE public.section_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID REFERENCES public.template_sections(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'hero', 'about', 'tokenomics', 'team', 'roadmap', etc.
  order_index INTEGER NOT NULL DEFAULT 0,
  is_enabled BOOLEAN DEFAULT TRUE,
  settings JSONB DEFAULT '{}',
  content JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_project_sections table for user customizations
CREATE TABLE public.user_project_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.user_projects(id) ON DELETE CASCADE NOT NULL,
  section_id UUID REFERENCES public.template_sections(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_enabled BOOLEAN DEFAULT TRUE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, section_id)
);

-- Add performance indexes for user_project_sections
CREATE INDEX idx_user_project_sections_project_id ON public.user_project_sections(project_id);
CREATE INDEX idx_user_project_sections_section_id ON public.user_project_sections(section_id);
CREATE INDEX idx_user_project_sections_type ON public.user_project_sections(type);
CREATE INDEX idx_user_project_sections_order_index ON public.user_project_sections(order_index);

-- Create user_project_blocks table for user customizations
CREATE TABLE public.user_project_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_section_id UUID REFERENCES public.user_project_sections(id) ON DELETE CASCADE NOT NULL,
  block_id UUID REFERENCES public.section_blocks(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_enabled BOOLEAN DEFAULT TRUE,
  settings JSONB DEFAULT '{}',
  content JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_section_id, block_id)
);

-- Add performance indexes for user_project_blocks
CREATE INDEX idx_user_project_blocks_project_section_id ON public.user_project_blocks(project_section_id);
CREATE INDEX idx_user_project_blocks_block_id ON public.user_project_blocks(block_id);
CREATE INDEX idx_user_project_blocks_type ON public.user_project_blocks(type);
CREATE INDEX idx_user_project_blocks_order_index ON public.user_project_blocks(order_index);
CREATE INDEX idx_user_project_blocks_content ON public.user_project_blocks USING GIN(content);

-- Create analytics tables
CREATE TABLE public.page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.user_projects(id) ON DELETE CASCADE NOT NULL,
  visitor_id TEXT NOT NULL, -- Anonymous visitor identifier
  session_id TEXT NOT NULL, -- Session identifier
  page_url TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  country TEXT,
  city TEXT,
  device_type TEXT, -- mobile, desktop, tablet
  browser TEXT,
  os TEXT,
  screen_resolution TEXT,
  language TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.user_projects(id) ON DELETE CASCADE NOT NULL,
  visitor_id TEXT NOT NULL,
  session_id TEXT UNIQUE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  page_views_count INTEGER DEFAULT 1,
  is_bounce BOOLEAN DEFAULT TRUE,
  referrer TEXT,
  entry_page TEXT,
  exit_page TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  country TEXT,
  city TEXT
);

CREATE TABLE public.unique_visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.user_projects(id) ON DELETE CASCADE NOT NULL,
  visitor_id TEXT NOT NULL,
  first_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_visits INTEGER DEFAULT 1,
  total_page_views INTEGER DEFAULT 1,
  total_session_duration INTEGER DEFAULT 0,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  UNIQUE(project_id, visitor_id)
);

-- Create indexes for performance
CREATE INDEX idx_user_projects_user_id ON public.user_projects(user_id);
CREATE INDEX idx_user_projects_template_id ON public.user_projects(template_id);
CREATE INDEX idx_user_projects_slug ON public.user_projects(slug);
CREATE INDEX idx_user_projects_domain ON public.user_projects(domain);

CREATE INDEX idx_template_sections_template_id ON public.template_sections(template_id);
CREATE INDEX idx_template_sections_order ON public.template_sections(order_index);
CREATE INDEX idx_section_blocks_section_id ON public.section_blocks(section_id);
CREATE INDEX idx_section_blocks_order ON public.section_blocks(order_index);

CREATE INDEX idx_user_project_sections_project_id ON public.user_project_sections(project_id);
CREATE INDEX idx_user_project_sections_order ON public.user_project_sections(order_index);
CREATE INDEX idx_user_project_blocks_project_section_id ON public.user_project_blocks(project_section_id);
CREATE INDEX idx_user_project_blocks_order ON public.user_project_blocks(order_index);

CREATE INDEX idx_page_views_project_id ON public.page_views(project_id);
CREATE INDEX idx_page_views_created_at ON public.page_views(created_at);
CREATE INDEX idx_page_views_visitor_id ON public.page_views(visitor_id);
CREATE INDEX idx_page_views_session_id ON public.page_views(session_id);

CREATE INDEX idx_sessions_project_id ON public.sessions(project_id);
CREATE INDEX idx_sessions_started_at ON public.sessions(started_at);
CREATE INDEX idx_sessions_visitor_id ON public.sessions(visitor_id);

-- Insert default templates
INSERT INTO public.templates (name, slug, description, colors) VALUES
('Classic', 'classic', 'Professional and trustworthy design that builds confidence. Clean layout with premium feel for serious projects.', '{"primary": "#2563EB", "secondary": "#1E40AF", "accent": "#F59E0B"}'),
('Neon', 'neon', 'High-energy, vibrant design perfect for explosive meme coins. Features bold gradients, neon effects, and dynamic animations.', '{"primary": "#22C55E", "secondary": "#16A34A", "accent": "#15803D"}'),
('Minimal', 'minimal', 'Sleek and modern design focused on content. Perfect for projects that want to stand out through simplicity.', '{"primary": "#000000", "secondary": "#6B7280", "accent": "#3B82F6"}')
ON CONFLICT (slug) DO NOTHING;

-- Insert template sections for Classic template
INSERT INTO public.template_sections (template_id, name, type, order_index) 
SELECT id, 'Header', 'header', 0 FROM public.templates WHERE slug = 'classic'
ON CONFLICT DO NOTHING;

INSERT INTO public.template_sections (template_id, name, type, order_index) 
SELECT id, 'Template', 'template', 1 FROM public.templates WHERE slug = 'classic'
ON CONFLICT DO NOTHING;

INSERT INTO public.template_sections (template_id, name, type, order_index) 
SELECT id, 'Footer', 'footer', 2 FROM public.templates WHERE slug = 'classic'
ON CONFLICT DO NOTHING;

-- Insert template sections for Neon template
INSERT INTO public.template_sections (template_id, name, type, order_index) 
SELECT id, 'Header', 'header', 0 FROM public.templates WHERE slug = 'neon'
ON CONFLICT DO NOTHING;

INSERT INTO public.template_sections (template_id, name, type, order_index) 
SELECT id, 'Template', 'template', 1 FROM public.templates WHERE slug = 'neon'
ON CONFLICT DO NOTHING;

INSERT INTO public.template_sections (template_id, name, type, order_index) 
SELECT id, 'Footer', 'footer', 2 FROM public.templates WHERE slug = 'neon'
ON CONFLICT DO NOTHING;

-- Insert template sections for Minimal template
INSERT INTO public.template_sections (template_id, name, type, order_index) 
SELECT id, 'Header', 'header', 0 FROM public.templates WHERE slug = 'minimal'
ON CONFLICT DO NOTHING;

INSERT INTO public.template_sections (template_id, name, type, order_index) 
SELECT id, 'Template', 'template', 1 FROM public.templates WHERE slug = 'minimal'
ON CONFLICT DO NOTHING;

INSERT INTO public.template_sections (template_id, name, type, order_index) 
SELECT id, 'Footer', 'footer', 2 FROM public.templates WHERE slug = 'minimal'
ON CONFLICT DO NOTHING;

-- Create RPC function to seed user project sections and blocks
CREATE OR REPLACE FUNCTION public.seed_project_sections(p_project_id uuid, p_template_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_owner uuid;
BEGIN
  -- Verify project exists and is owned by caller
  SELECT user_id INTO v_owner FROM public.user_projects WHERE id = p_project_id;
  IF v_owner IS NULL THEN
    RAISE EXCEPTION 'project not found';
  END IF;
  IF v_owner <> auth.uid() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  -- Upsert sections from template into user_project_sections
  INSERT INTO public.user_project_sections (
    project_id, section_id, name, type, order_index, is_enabled, settings
  )
  SELECT
    p_project_id,
    ts.id,
    ts.name,
    ts.type,
    ts.order_index,
    COALESCE(ts.is_enabled, true),
    COALESCE(ts.settings, '{}'::jsonb)
  FROM public.template_sections ts
  WHERE ts.template_id = p_template_id
  ON CONFLICT (project_id, section_id) DO UPDATE SET
    name = excluded.name,
    type = excluded.type,
    order_index = excluded.order_index,
    is_enabled = excluded.is_enabled,
    settings = excluded.settings;

  -- Upsert blocks for each section
  INSERT INTO public.user_project_blocks (
    project_section_id, block_id, name, type, order_index, is_enabled, settings, content
  )
  SELECT
    ups.id AS project_section_id,
    sb.id,
    sb.name,
    sb.type,
    sb.order_index,
    COALESCE(sb.is_enabled, true),
    COALESCE(sb.settings, '{}'::jsonb),
    COALESCE(sb.content, '{}'::jsonb)
  FROM public.section_blocks sb
  JOIN public.template_sections ts ON ts.id = sb.section_id
  JOIN public.user_project_sections ups ON ups.project_id = p_project_id AND ups.section_id = ts.id
  WHERE ts.template_id = p_template_id
  ON CONFLICT (project_section_id, block_id) DO UPDATE SET
    name = excluded.name,
    type = excluded.type,
    order_index = excluded.order_index,
    is_enabled = excluded.is_enabled,
    settings = excluded.settings,
    content = excluded.content;
END;
$$;

-- Grant execute permission on the RPC function
GRANT EXECUTE ON FUNCTION public.seed_project_sections(uuid, uuid) TO anon, authenticated;

-- Insert section blocks for Classic template
INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Hero Section', 'hero', 0, '{"title": "Welcome to the Future", "subtitle": "The Next Big Thing in Crypto", "description": "Join the revolution with our innovative meme coin that combines humor, community, and cutting-edge blockchain technology."}' 
FROM public.template_sections ts WHERE ts.type = 'template' AND ts.template_id = (SELECT id FROM public.templates WHERE slug = 'classic')
ON CONFLICT DO NOTHING;

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'About Section', 'about', 1, '{"title": "About Our Project", "description": "We are building something special that will change the crypto landscape forever.", "features": [{"title": "Community Driven", "description": "Built by the community, for the community", "icon": "👥"}, {"title": "Transparent", "description": "All transactions and decisions are public", "icon": "🔍"}, {"title": "Innovative", "description": "Pushing the boundaries of what is possible", "icon": "💡"}]}' 
FROM public.template_sections ts WHERE ts.type = 'template' AND ts.template_id = (SELECT id FROM public.templates WHERE slug = 'classic')
ON CONFLICT DO NOTHING;

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Tokenomics', 'tokenomics', 2, '{"title": "Tokenomics", "description": "Fair and transparent token distribution", "totalSupply": "1,000,000,000", "distribution": [{"name": "Liquidity", "percentage": 40, "color": "#FF6B6B"}, {"name": "Community", "percentage": 30, "color": "#4ECDC4"}, {"name": "Team", "percentage": 15, "color": "#45B7D1"}, {"name": "Marketing", "percentage": 10, "color": "#96CEB4"}, {"name": "Development", "percentage": 5, "color": "#FFEAA7"}]}' 
FROM public.template_sections ts WHERE ts.type = 'template' AND ts.template_id = (SELECT id FROM public.templates WHERE slug = 'classic')
ON CONFLICT DO NOTHING;

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Team Section', 'team', 3, '{"title": "Our Team", "description": "Meet the brilliant minds behind the project", "members": [{"name": "Alex Johnson", "role": "Founder & CEO", "avatar": "👨‍💼", "social": {"twitter": "@alexjohnson"}}, {"name": "Sarah Chen", "role": "Lead Developer", "avatar": "👩‍💻", "social": {"twitter": "@sarahchen"}}, {"name": "Mike Rodriguez", "role": "Marketing Director", "avatar": "👨‍💼", "social": {"twitter": "@mikerodriguez"}}]}' 
FROM public.template_sections ts WHERE ts.type = 'template' AND ts.template_id = (SELECT id FROM public.templates WHERE slug = 'classic')
ON CONFLICT DO NOTHING;

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Roadmap', 'roadmap', 4, '{"title": "Roadmap", "description": "Our journey to success", "phases": [{"title": "Phase 1: Launch", "description": "Initial token launch and community building", "date": "Q1 2024", "completed": true}, {"title": "Phase 2: Development", "description": "Core features and platform development", "date": "Q2 2024", "completed": false}, {"title": "Phase 3: Expansion", "description": "Partnerships and ecosystem growth", "date": "Q3 2024", "completed": false}]}' 
FROM public.template_sections ts WHERE ts.type = 'template' AND ts.template_id = (SELECT id FROM public.templates WHERE slug = 'classic')
ON CONFLICT DO NOTHING;

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Navigation', 'navbar', 0, '{"logoUrl": "", "displayName": "", "navItems": [{"label": "About", "href": "#about"}, {"label": "Tokenomics", "href": "#tokenomics"}, {"label": "Roadmap", "href": "#roadmap"}, {"label": "Team", "href": "#team"}], "cta": {"text": "Buy Now"}, "social": {"twitter": "https://twitter.com/memecoin", "telegram": "https://t.me/memecoin", "discord": "https://discord.gg/memetoken", "website": "https://memetoken.com"}}' 
FROM public.template_sections ts WHERE ts.type = 'header' AND ts.template_id = (SELECT id FROM public.templates WHERE slug = 'classic')
ON CONFLICT DO NOTHING;

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Footer', 'footer', 0, '{"socialLinks": {"twitter": "https://twitter.com/memecoin", "telegram": "https://t.me/memecoin", "website": "https://memecoin.com"}, "copyright": "© 2024 Meme Coin. All rights reserved."}' 
FROM public.template_sections ts WHERE ts.type = 'footer' AND ts.template_id = (SELECT id FROM public.templates WHERE slug = 'classic')
ON CONFLICT DO NOTHING;

-- Insert section blocks for Neon template
INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Hero Section', 'hero', 0, '{"title": "Welcome to the Future", "subtitle": "The Next Big Thing in Crypto", "description": "Join the revolution with our innovative meme coin that combines humor, community, and cutting-edge blockchain technology.", "showTokenPill": true, "showStats": true, "showPrimaryButton": true, "showSecondaryButton": true, "showTokenVisual": true, "showScrollIndicator": true, "tokenSymbol": "MEME", "stats": [{"value": "10K+", "label": "Holders", "color": "primary"}, {"value": "$2.5M", "label": "Market Cap", "color": "secondary"}, {"value": "$500K", "label": "24h Volume", "color": "accent"}], "primaryButton": {"text": "Buy Now", "href": ""}, "secondaryButton": {"text": "Watch Video", "href": ""}, "scrollText": "Scroll to explore"}' 
FROM public.template_sections ts WHERE ts.type = 'template' AND ts.template_id = (SELECT id FROM public.templates WHERE slug = 'neon')
ON CONFLICT DO NOTHING;

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'About Section', 'about', 1, '{"title": "About Our Project", "description": "We are building something special that will change the crypto landscape forever.", "features": [{"title": "Community Driven", "description": "Built by the community, for the community", "icon": "👥"}, {"title": "Transparent", "description": "All transactions and decisions are public", "icon": "🔍"}, {"title": "Innovative", "description": "Pushing the boundaries of what is possible", "icon": "💡"}]}' 
FROM public.template_sections ts WHERE ts.type = 'template' AND ts.template_id = (SELECT id FROM public.templates WHERE slug = 'neon')
ON CONFLICT DO NOTHING;

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Tokenomics', 'tokenomics', 2, '{"title": "Tokenomics", "description": "Fair and transparent token distribution", "totalSupply": "1,000,000,000", "distribution": [{"name": "Liquidity", "percentage": 40, "color": "#FF6B6B"}, {"name": "Community", "percentage": 30, "color": "#4ECDC4"}, {"name": "Team", "percentage": 15, "color": "#45B7D1"}, {"name": "Marketing", "percentage": 10, "color": "#96CEB4"}, {"name": "Development", "percentage": 5, "color": "#FFEAA7"}]}' 
FROM public.template_sections ts WHERE ts.type = 'template' AND ts.template_id = (SELECT id FROM public.templates WHERE slug = 'neon')
ON CONFLICT DO NOTHING;

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Team Section', 'team', 3, '{"title": "Our Team", "description": "Meet the brilliant minds behind the project", "members": [{"name": "Alex Johnson", "role": "Founder & CEO", "avatar": "👨‍💼", "social": {"twitter": "@alexjohnson"}}, {"name": "Sarah Chen", "role": "Lead Developer", "avatar": "👩‍💻", "social": {"twitter": "@sarahchen"}}, {"name": "Mike Rodriguez", "role": "Marketing Director", "avatar": "👨‍💼", "social": {"twitter": "@mikerodriguez"}}]}' 
FROM public.template_sections ts WHERE ts.type = 'template' AND ts.template_id = (SELECT id FROM public.templates WHERE slug = 'neon')
ON CONFLICT DO NOTHING;

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Roadmap', 'roadmap', 4, '{"title": "Roadmap", "description": "Our journey to success", "phases": [{"title": "Phase 1: Launch", "description": "Initial token launch and community building", "date": "Q1 2024", "completed": true}, {"title": "Phase 2: Development", "description": "Core features and platform development", "date": "Q2 2024", "completed": false}, {"title": "Phase 3: Expansion", "description": "Partnerships and ecosystem growth", "date": "Q3 2024", "completed": false}]}' 
FROM public.template_sections ts WHERE ts.type = 'template' AND ts.template_id = (SELECT id FROM public.templates WHERE slug = 'neon')
ON CONFLICT DO NOTHING;

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Navigation', 'navbar', 0, '{"logoUrl": "", "displayName": "", "navItems": [{"label": "Token Details", "href": "#token-details"}, {"label": "Community", "href": "#community"}], "cta": {"text": "Buy Now"}, "social": {"twitter": "https://twitter.com/memecoin", "telegram": "https://t.me/memecoin", "discord": "https://discord.gg/memetoken", "website": "https://memetoken.com"}}' 
FROM public.template_sections ts WHERE ts.type = 'header' AND ts.template_id = (SELECT id FROM public.templates WHERE slug = 'neon')
ON CONFLICT DO NOTHING;

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Footer', 'footer', 0, '{"socialLinks": {"twitter": "https://twitter.com/memecoin", "telegram": "https://t.me/memecoin", "website": "https://memecoin.com"}, "copyright": "© 2024 Meme Coin. All rights reserved."}' 
FROM public.template_sections ts WHERE ts.type = 'footer' AND ts.template_id = (SELECT id FROM public.templates WHERE slug = 'neon')
ON CONFLICT DO NOTHING;

-- Insert section blocks for Minimal template
INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Hero Section', 'hero', 0, '{"title": "Welcome to the Future", "subtitle": "The Next Big Thing in Crypto", "description": "Join the revolution with our innovative meme coin that combines humor, community, and cutting-edge blockchain technology."}' 
FROM public.template_sections ts WHERE ts.type = 'template' AND ts.template_id = (SELECT id FROM public.templates WHERE slug = 'minimal')
ON CONFLICT DO NOTHING;

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'About Section', 'about', 1, '{"title": "About Our Project", "description": "We are building something special that will change the crypto landscape forever.", "features": [{"title": "Community Driven", "description": "Built by the community, for the community", "icon": "👥"}, {"title": "Transparent", "description": "All transactions and decisions are public", "icon": "🔍"}, {"title": "Innovative", "description": "Pushing the boundaries of what is possible", "icon": "💡"}]}' 
FROM public.template_sections ts WHERE ts.type = 'template' AND ts.template_id = (SELECT id FROM public.templates WHERE slug = 'minimal')
ON CONFLICT DO NOTHING;

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Tokenomics', 'tokenomics', 2, '{"title": "Tokenomics", "description": "Fair and transparent token distribution", "totalSupply": "1,000,000,000", "distribution": [{"name": "Liquidity", "percentage": 40, "color": "#FF6B6B"}, {"name": "Community", "percentage": 30, "color": "#4ECDC4"}, {"name": "Team", "percentage": 15, "color": "#45B7D1"}, {"name": "Marketing", "percentage": 10, "color": "#96CEB4"}, {"name": "Development", "percentage": 5, "color": "#FFEAA7"}]}' 
FROM public.template_sections ts WHERE ts.type = 'template' AND ts.template_id = (SELECT id FROM public.templates WHERE slug = 'minimal')
ON CONFLICT DO NOTHING;

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Team Section', 'team', 3, '{"title": "Our Team", "description": "Meet the brilliant minds behind the project", "members": [{"name": "Alex Johnson", "role": "Founder & CEO", "avatar": "👨‍💼", "social": {"twitter": "@alexjohnson"}}, {"name": "Sarah Chen", "role": "Lead Developer", "avatar": "👩‍💻", "social": {"twitter": "@sarahchen"}}, {"name": "Mike Rodriguez", "role": "Marketing Director", "avatar": "👨‍💼", "social": {"twitter": "@mikerodriguez"}}]}' 
FROM public.template_sections ts WHERE ts.type = 'template' AND ts.template_id = (SELECT id FROM public.templates WHERE slug = 'minimal')
ON CONFLICT DO NOTHING;

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Roadmap', 'roadmap', 4, '{"title": "Roadmap", "description": "Our journey to success", "phases": [{"title": "Phase 1: Launch", "description": "Initial token launch and community building", "date": "Q1 2024", "completed": true}, {"title": "Phase 2: Development", "description": "Core features and platform development", "date": "Q2 2024", "completed": false}, {"title": "Phase 3: Expansion", "description": "Partnerships and ecosystem growth", "date": "Q3 2024", "completed": false}]}' 
FROM public.template_sections ts WHERE ts.type = 'template' AND ts.template_id = (SELECT id FROM public.templates WHERE slug = 'minimal')
ON CONFLICT DO NOTHING;

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Navigation', 'navbar', 0, '{"logoUrl": "", "displayName": "", "navItems": [{"label": "About", "href": "#about"}, {"label": "Tokenomics", "href": "#tokenomics"}, {"label": "Roadmap", "href": "#roadmap"}, {"label": "Team", "href": "#team"}], "cta": {"text": "Buy Now"}, "social": {"twitter": "https://twitter.com/memecoin", "telegram": "https://t.me/memecoin", "discord": "https://discord.gg/memetoken", "website": "https://memetoken.com"}}' 
FROM public.template_sections ts WHERE ts.type = 'header' AND ts.template_id = (SELECT id FROM public.templates WHERE slug = 'minimal')
ON CONFLICT DO NOTHING;

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Footer', 'footer', 0, '{"socialLinks": {"twitter": "https://twitter.com/memecoin", "telegram": "https://t.me/memecoin", "website": "https://memecoin.com"}, "copyright": "© 2024 Meme Coin. All rights reserved."}' 
FROM public.template_sections ts WHERE ts.type = 'footer' AND ts.template_id = (SELECT id FROM public.templates WHERE slug = 'minimal')
ON CONFLICT DO NOTHING;

-- Verify the setup
SELECT 'Setup complete! Tables created:' as status;
SELECT 'templates' as table_name, COUNT(*) as count FROM public.templates
UNION ALL
SELECT 'template_sections' as table_name, COUNT(*) as count FROM public.template_sections
UNION ALL
SELECT 'section_blocks' as table_name, COUNT(*) as count FROM public.section_blocks
UNION ALL
SELECT 'user_projects' as table_name, COUNT(*) as count FROM public.user_projects
UNION ALL
SELECT 'user_project_sections' as table_name, COUNT(*) as count FROM public.user_project_sections
UNION ALL
SELECT 'user_project_blocks' as table_name, COUNT(*) as count FROM public.user_project_blocks;


