-- Quick Setup SQL for Template Editor
-- Run this in your Supabase SQL Editor to create the essential tables

-- Create templates table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  colors JSONB NOT NULL DEFAULT '{"primary": "#3B82F6", "secondary": "#1E40AF", "accent": "#F59E0B"}',
  thumbnail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create template_sections table
CREATE TABLE IF NOT EXISTS public.template_sections (
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

-- Create section_blocks table
CREATE TABLE IF NOT EXISTS public.section_blocks (
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_template_sections_template_id ON public.template_sections(template_id);
CREATE INDEX IF NOT EXISTS idx_template_sections_order ON public.template_sections(order_index);
CREATE INDEX IF NOT EXISTS idx_section_blocks_section_id ON public.section_blocks(section_id);
CREATE INDEX IF NOT EXISTS idx_section_blocks_order ON public.section_blocks(order_index);

-- Enable RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_blocks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for templates (public read access)
CREATE POLICY IF NOT EXISTS "Anyone can view templates" ON public.templates
  FOR SELECT USING (true);

-- RLS Policies for template_sections (public read access)
CREATE POLICY IF NOT EXISTS "Anyone can view template sections" ON public.template_sections
  FOR SELECT USING (true);

-- RLS Policies for section_blocks (public read access)
CREATE POLICY IF NOT EXISTS "Anyone can view section blocks" ON public.section_blocks
  FOR SELECT USING (true);

-- Insert default templates
INSERT INTO public.templates (name, slug, description, colors) VALUES
('Neon', 'neon', 'A vibrant, neon-themed template with glowing effects and modern animations', '{"primary": "#00ff88", "secondary": "#ff0080", "accent": "#ffff00"}'),
('Classic', 'classic', 'A clean, professional template with elegant typography and subtle animations', '{"primary": "#3B82F6", "secondary": "#1E40AF", "accent": "#F59E0B"}'),
('Minimal', 'minimal', 'A minimalist template focusing on content with clean lines and ample white space', '{"primary": "#000000", "secondary": "#666666", "accent": "#ff6b6b"}')
ON CONFLICT (slug) DO NOTHING;

-- Insert default template sections for each template
INSERT INTO public.template_sections (template_id, name, type, order_index) 
SELECT t.id, 'Header', 'header', 0 FROM public.templates t
ON CONFLICT DO NOTHING;

INSERT INTO public.template_sections (template_id, name, type, order_index) 
SELECT t.id, 'Template', 'template', 1 FROM public.templates t
ON CONFLICT DO NOTHING;

INSERT INTO public.template_sections (template_id, name, type, order_index) 
SELECT t.id, 'Footer', 'footer', 2 FROM public.templates t
ON CONFLICT DO NOTHING;

-- Insert default section blocks for template sections
INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Navigation', 'navbar', 0, '{"logo": "🚀", "menuItems": ["Home", "About", "Tokenomics", "Team", "Roadmap"]}' 
FROM public.template_sections ts WHERE ts.type = 'header'
ON CONFLICT DO NOTHING;

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Hero Section', 'hero', 0, '{"title": "Welcome to the Future", "subtitle": "The Next Big Thing in Crypto", "description": "Join the revolution with our innovative meme coin that combines humor, community, and cutting-edge blockchain technology."}' 
FROM public.template_sections ts WHERE ts.type = 'template'
ON CONFLICT DO NOTHING;

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'About Section', 'about', 1, '{"title": "About Our Project", "description": "We are building something special that will change the crypto landscape forever.", "features": [{"title": "Community Driven", "description": "Built by the community, for the community", "icon": "👥"}, {"title": "Transparent", "description": "All transactions and decisions are public", "icon": "🔍"}, {"title": "Innovative", "description": "Pushing the boundaries of what is possible", "icon": "💡"}]}' 
FROM public.template_sections ts WHERE ts.type = 'template'
ON CONFLICT DO NOTHING;

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Tokenomics', 'tokenomics', 2, '{"title": "Tokenomics", "description": "Fair and transparent token distribution", "totalSupply": "1,000,000,000", "distribution": [{"name": "Liquidity", "percentage": 40, "color": "#FF6B6B"}, {"name": "Community", "percentage": 30, "color": "#4ECDC4"}, {"name": "Team", "percentage": 15, "color": "#45B7D1"}, {"name": "Marketing", "percentage": 10, "color": "#96CEB4"}, {"name": "Development", "percentage": 5, "color": "#FFEAA7"}]}' 
FROM public.template_sections ts WHERE ts.type = 'template'
ON CONFLICT DO NOTHING;

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Team Section', 'team', 3, '{"title": "Our Team", "description": "Meet the brilliant minds behind the project", "members": [{"name": "Alex Johnson", "role": "Founder & CEO", "avatar": "👨‍💼", "social": {"twitter": "@alexjohnson"}}, {"name": "Sarah Chen", "role": "Lead Developer", "avatar": "👩‍💻", "social": {"twitter": "@sarahchen"}}, {"name": "Mike Rodriguez", "role": "Marketing Director", "avatar": "👨‍💼", "social": {"twitter": "@mikerodriguez"}}]}' 
FROM public.template_sections ts WHERE ts.type = 'template'
ON CONFLICT DO NOTHING;

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Roadmap', 'roadmap', 4, '{"title": "Roadmap", "description": "Our journey to success", "phases": [{"title": "Phase 1: Launch", "description": "Initial token launch and community building", "date": "Q1 2024", "completed": true}, {"title": "Phase 2: Development", "description": "Core features and platform development", "date": "Q2 2024", "completed": false}, {"title": "Phase 3: Expansion", "description": "Partnerships and ecosystem growth", "date": "Q3 2024", "completed": false}]}' 
FROM public.template_sections ts WHERE ts.type = 'template'
ON CONFLICT DO NOTHING;

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Footer', 'footer', 0, '{"socialLinks": {"twitter": "https://twitter.com/memecoin", "telegram": "https://t.me/memecoin", "website": "https://memecoin.com"}, "copyright": "© 2024 Meme Coin. All rights reserved."}' 
FROM public.template_sections ts WHERE ts.type = 'footer'
ON CONFLICT DO NOTHING;

-- Verify the setup
SELECT 'Setup complete! Tables created:' as status;
SELECT 'templates' as table_name, COUNT(*) as count FROM public.templates
UNION ALL
SELECT 'template_sections' as table_name, COUNT(*) as count FROM public.template_sections
UNION ALL
SELECT 'section_blocks' as table_name, COUNT(*) as count FROM public.section_blocks;


