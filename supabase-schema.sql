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

CREATE INDEX idx_unique_visitors_project_id ON public.unique_visitors(project_id);
CREATE INDEX idx_unique_visitors_visitor_id ON public.unique_visitors(visitor_id);
CREATE INDEX idx_unique_visitors_first_visit_at ON public.unique_visitors(first_visit_at);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_project_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_project_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unique_visitors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for templates (public read access)
CREATE POLICY "Anyone can view templates" ON public.templates
  FOR SELECT USING (true);

-- RLS Policies for template_sections (public read access)
CREATE POLICY "Anyone can view template sections" ON public.template_sections
  FOR SELECT USING (true);

-- RLS Policies for section_blocks (public read access)
CREATE POLICY "Anyone can view section blocks" ON public.section_blocks
  FOR SELECT USING (true);

-- RLS Policies for user_projects
CREATE POLICY "Users can view their own projects" ON public.user_projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON public.user_projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public.user_projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON public.user_projects
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_project_sections
CREATE POLICY "Users can view their own project sections" ON public.user_project_sections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_projects 
      WHERE user_projects.id = user_project_sections.project_id 
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own project sections" ON public.user_project_sections
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_projects 
      WHERE user_projects.id = user_project_sections.project_id 
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own project sections" ON public.user_project_sections
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_projects 
      WHERE user_projects.id = user_project_sections.project_id 
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own project sections" ON public.user_project_sections
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_projects 
      WHERE user_projects.id = user_project_sections.project_id 
      AND user_projects.user_id = auth.uid()
    )
  );

-- RLS Policies for user_project_blocks
CREATE POLICY "Users can view their own project blocks" ON public.user_project_blocks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_project_sections 
      JOIN public.user_projects ON user_projects.id = user_project_sections.project_id
      WHERE user_project_sections.id = user_project_blocks.project_section_id 
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own project blocks" ON public.user_project_blocks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_project_sections 
      JOIN public.user_projects ON user_projects.id = user_project_sections.project_id
      WHERE user_project_sections.id = user_project_blocks.project_section_id 
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own project blocks" ON public.user_project_blocks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_project_sections 
      JOIN public.user_projects ON user_projects.id = user_project_sections.project_id
      WHERE user_project_sections.id = user_project_blocks.project_section_id 
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own project blocks" ON public.user_project_blocks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_project_sections 
      JOIN public.user_projects ON user_projects.id = user_project_sections.project_id
      WHERE user_project_sections.id = user_project_blocks.project_section_id 
      AND user_projects.user_id = auth.uid()
    )
  );

-- RLS Policies for analytics (users can only see their own project analytics)
CREATE POLICY "Users can view analytics for their own projects" ON public.page_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_projects 
      WHERE user_projects.id = page_views.project_id 
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert page views" ON public.page_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view sessions for their own projects" ON public.sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_projects 
      WHERE user_projects.id = sessions.project_id 
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert sessions" ON public.sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view unique visitors for their own projects" ON public.unique_visitors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_projects 
      WHERE user_projects.id = unique_visitors.project_id 
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert unique visitors" ON public.unique_visitors
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update unique visitors" ON public.unique_visitors
  FOR UPDATE USING (true);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default templates
INSERT INTO public.templates (name, slug, description, colors) VALUES
('Neon', 'neon', 'A vibrant, neon-themed template with glowing effects and modern animations', '{"primary": "#00ff88", "secondary": "#ff0080", "accent": "#ffff00"}'),
('Classic', 'classic', 'A clean, professional template with elegant typography and subtle animations', '{"primary": "#3B82F6", "secondary": "#1E40AF", "accent": "#F59E0B"}'),
('Minimal', 'minimal', 'A minimalist template focusing on content with clean lines and ample white space', '{"primary": "#000000", "secondary": "#666666", "accent": "#ff6b6b"}');

-- Insert default template sections for each template
INSERT INTO public.template_sections (template_id, name, type, order_index) 
SELECT t.id, 'Header', 'header', 0 FROM public.templates t;

INSERT INTO public.template_sections (template_id, name, type, order_index) 
SELECT t.id, 'Template', 'template', 1 FROM public.templates t;

INSERT INTO public.template_sections (template_id, name, type, order_index) 
SELECT t.id, 'Footer', 'footer', 2 FROM public.templates t;

-- Insert default section blocks for template sections
INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Navigation', 'navbar', 0, '{"logo": "🚀", "menuItems": ["Home", "About", "Tokenomics", "Team", "Roadmap"]}' 
FROM public.template_sections ts WHERE ts.type = 'header';

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Hero Section', 'hero', 0, '{"title": "Welcome to the Future", "subtitle": "The Next Big Thing in Crypto", "description": "Join the revolution with our innovative meme coin that combines humor, community, and cutting-edge blockchain technology."}' 
FROM public.template_sections ts WHERE ts.type = 'template';

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'About Section', 'about', 1, '{"title": "About Our Project", "description": "We are building something special that will change the crypto landscape forever.", "features": [{"title": "Community Driven", "description": "Built by the community, for the community", "icon": "👥"}, {"title": "Transparent", "description": "All transactions and decisions are public", "icon": "🔍"}, {"title": "Innovative", "description": "Pushing the boundaries of what is possible", "icon": "💡"}]}' 
FROM public.template_sections ts WHERE ts.type = 'template';

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Tokenomics', 'tokenomics', 2, '{"title": "Tokenomics", "description": "Fair and transparent token distribution", "totalSupply": "1,000,000,000", "distribution": [{"name": "Liquidity", "percentage": 40, "color": "#FF6B6B"}, {"name": "Community", "percentage": 30, "color": "#4ECDC4"}, {"name": "Team", "percentage": 15, "color": "#45B7D1"}, {"name": "Marketing", "percentage": 10, "color": "#96CEB4"}, {"name": "Development", "percentage": 5, "color": "#FFEAA7"}]}' 
FROM public.template_sections ts WHERE ts.type = 'template';

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Team Section', 'team', 3, '{"title": "Our Team", "description": "Meet the brilliant minds behind the project", "members": [{"name": "Alex Johnson", "role": "Founder & CEO", "avatar": "👨‍💼", "social": {"twitter": "@alexjohnson"}}, {"name": "Sarah Chen", "role": "Lead Developer", "avatar": "👩‍💻", "social": {"twitter": "@sarahchen"}}, {"name": "Mike Rodriguez", "role": "Marketing Director", "avatar": "👨‍💼", "social": {"twitter": "@mikerodriguez"}}]}' 
FROM public.template_sections ts WHERE ts.type = 'template';

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Roadmap', 'roadmap', 4, '{"title": "Roadmap", "description": "Our journey to success", "phases": [{"title": "Phase 1: Launch", "description": "Initial token launch and community building", "date": "Q1 2024", "completed": true}, {"title": "Phase 2: Development", "description": "Core features and platform development", "date": "Q2 2024", "completed": false}, {"title": "Phase 3: Expansion", "description": "Partnerships and ecosystem growth", "date": "Q3 2024", "completed": false}]}' 
FROM public.template_sections ts WHERE ts.type = 'template';

INSERT INTO public.section_blocks (section_id, name, type, order_index, content)
SELECT ts.id, 'Footer', 'footer', 0, '{"socialLinks": {"twitter": "https://twitter.com/memecoin", "telegram": "https://t.me/memecoin", "website": "https://memecoin.com"}, "copyright": "© 2024 Meme Coin. All rights reserved."}' 
FROM public.template_sections ts WHERE ts.type = 'footer';
