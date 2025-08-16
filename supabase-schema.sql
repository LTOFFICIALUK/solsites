-- =====================================================
-- COMPLETE DATABASE REBUILD - UNIFIED BLOCK SYSTEM
-- =====================================================

-- Drop all existing tables to start fresh
DROP TABLE IF EXISTS user_project_blocks CASCADE;
DROP TABLE IF EXISTS user_project_sections CASCADE;
DROP TABLE IF EXISTS section_blocks CASCADE;
DROP TABLE IF EXISTS template_sections CASCADE;
DROP TABLE IF EXISTS user_projects CASCADE;
DROP TABLE IF EXISTS templates CASCADE;
DROP TABLE IF EXISTS page_views CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS unique_visitors CASCADE;

-- =====================================================
-- CORE TABLES - SIMPLIFIED ARCHITECTURE
-- =====================================================

-- 1. Templates table (defines available templates)
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    colors JSONB DEFAULT '{}',
    default_data JSONB, -- New column for template default data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Projects table (stores project metadata)
CREATE TABLE user_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Project Blocks table (stores ALL project content as blocks)
CREATE TABLE user_project_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES user_projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- e.g., 'hero', 'navbar', 'about'
    type VARCHAR(100) NOT NULL, -- e.g., 'hero', 'navbar', 'about', 'footer'
    content JSONB NOT NULL DEFAULT '{}', -- ALL content for this block
    settings JSONB DEFAULT '{}', -- New column for block-specific settings
    order_index INTEGER NOT NULL DEFAULT 0,
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ANALYTICS TABLES (keeping existing structure)
-- =====================================================

CREATE TABLE page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES user_projects(id) ON DELETE CASCADE,
    visitor_id VARCHAR(255) NOT NULL,
    page_url VARCHAR(500) NOT NULL,
    referrer VARCHAR(500),
    user_agent TEXT,
    ip_address INET,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id VARCHAR(255) NOT NULL,
    project_id UUID REFERENCES user_projects(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    page_views_count INTEGER DEFAULT 0
);

CREATE TABLE unique_visitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id VARCHAR(255) UNIQUE NOT NULL,
    project_id UUID REFERENCES user_projects(id) ON DELETE CASCADE,
    first_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_visits INTEGER DEFAULT 1
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_user_projects_user_id ON user_projects(user_id);
CREATE INDEX idx_user_projects_slug ON user_projects(slug);
CREATE INDEX idx_user_projects_template_id ON user_projects(template_id);
CREATE INDEX idx_user_project_blocks_project_id ON user_project_blocks(project_id);
CREATE INDEX idx_user_project_blocks_order ON user_project_blocks(project_id, order_index);
CREATE INDEX idx_page_views_project_id ON page_views(project_id);
CREATE INDEX idx_page_views_visitor_id ON page_views(visitor_id);
CREATE INDEX idx_sessions_project_id ON sessions(project_id);
CREATE INDEX idx_unique_visitors_project_id ON unique_visitors(project_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_project_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE unique_visitors ENABLE ROW LEVEL SECURITY;

-- User can only access their own projects
CREATE POLICY "Users can view own projects" ON user_projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON user_projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON user_projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON user_projects
    FOR DELETE USING (auth.uid() = user_id);

-- User can only access blocks for their own projects
CREATE POLICY "Users can view own project blocks" ON user_project_blocks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_projects 
            WHERE id = user_project_blocks.project_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own project blocks" ON user_project_blocks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_projects 
            WHERE id = user_project_blocks.project_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own project blocks" ON user_project_blocks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_projects 
            WHERE id = user_project_blocks.project_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own project blocks" ON user_project_blocks
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_projects 
            WHERE id = user_project_blocks.project_id 
            AND user_id = auth.uid()
        )
    );

-- Public read access for published projects
CREATE POLICY "Public can view published projects" ON user_projects
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view published project blocks" ON user_project_blocks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_projects 
            WHERE id = user_project_blocks.project_id 
            AND is_published = true
        )
    );

-- Analytics policies (public read/write for tracking)
CREATE POLICY "Public can insert page views" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert sessions" ON sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert unique visitors" ON unique_visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update unique visitors" ON unique_visitors FOR UPDATE USING (true);

-- =====================================================
-- SEED DATA - TEMPLATES
-- =====================================================

INSERT INTO templates (id, name, slug, description, colors, default_data) VALUES
-- Neon Template
('2545a36f-7143-4741-af71-86aa20c217cd', 'Neon', 'neon', 'Modern neon-themed template with vibrant colors', '{"primary": "#00ff88", "secondary": "#ff0088", "accent": "#8800ff", "background": "#0a0a0a", "text": "#ffffff"}', '[{"name": "navbar", "type": "navbar", "content": {"logo": "My Project", "navItems": [{"text": "Home", "href": "#"}, {"text": "About", "href": "#about"}], "cta": {"text": "Get Started", "href": "#"}}, "order_index": 0}, {"name": "hero", "type": "hero", "content": {"title": "Welcome to My Project", "subtitle": "The future is here", "description": "This is a revolutionary new project that will change everything.", "cta": {"text": "Learn More", "href": "#"}, "image": "/placeholder-hero.jpg"}, "order_index": 1}, {"name": "about", "type": "about", "content": {"title": "About Us", "description": "We are a team of innovators dedicated to creating amazing experiences.", "features": [{"title": "Feature 1", "description": "Amazing feature description"}, {"title": "Feature 2", "description": "Another great feature"}]}, "order_index": 2}, {"name": "footer", "type": "footer", "content": {"copyright": "© 2024 My Project. All rights reserved.", "social": {"twitter": "https://twitter.com", "discord": "https://discord.gg", "telegram": "https://t.me"}}, "order_index": 3}]'),

-- Classic Template  
('e2d9687e-548f-43ac-86a6-73bbaaf2a217', 'Classic', 'classic', 'Traditional template with clean design', '{"primary": "#3b82f6", "secondary": "#1f2937", "accent": "#f59e0b", "background": "#ffffff", "text": "#1f2937"}', '[{"name": "navbar", "type": "navbar", "content": {"logo": "My Project", "navItems": [{"text": "Home", "href": "#"}, {"text": "About", "href": "#about"}], "cta": {"text": "Get Started", "href": "#"}}, "order_index": 0}, {"name": "hero", "type": "hero", "content": {"title": "Welcome to My Project", "subtitle": "The future is here", "description": "This is a revolutionary new project that will change everything.", "cta": {"text": "Learn More", "href": "#"}, "image": "/placeholder-hero.jpg"}, "order_index": 1}, {"name": "about", "type": "about", "content": {"title": "About Us", "description": "We are a team of innovators dedicated to creating amazing experiences.", "features": [{"title": "Feature 1", "description": "Amazing feature description"}, {"title": "Feature 2", "description": "Another great feature"}]}, "order_index": 2}, {"name": "footer", "type": "footer", "content": {"copyright": "© 2024 My Project. All rights reserved.", "social": {"twitter": "https://twitter.com", "discord": "https://discord.gg", "telegram": "https://t.me"}}, "order_index": 3}]'),

-- Minimal Template
('0079a4f3-9c9b-4604-aafc-3354c922e246', 'Minimal', 'minimal', 'Minimalist template with focus on content', '{"primary": "#000000", "secondary": "#666666", "accent": "#333333", "background": "#ffffff", "text": "#000000"}', '[{"name": "navbar", "type": "navbar", "content": {"logo": "My Project", "navItems": [{"text": "Home", "href": "#"}, {"text": "About", "href": "#about"}], "cta": {"text": "Get Started", "href": "#"}}, "order_index": 0}, {"name": "hero", "type": "hero", "content": {"title": "Welcome to My Project", "subtitle": "The future is here", "description": "This is a revolutionary new project that will change everything.", "cta": {"text": "Learn More", "href": "#"}, "image": "/placeholder-hero.jpg"}, "order_index": 1}, {"name": "about", "type": "about", "content": {"title": "About Us", "description": "We are a team of innovators dedicated to creating amazing experiences.", "features": [{"title": "Feature 1", "description": "Amazing feature description"}, {"title": "Feature 2", "description": "Another great feature"}]}, "order_index": 2}, {"name": "footer", "type": "footer", "content": {"copyright": "© 2024 My Project. All rights reserved.", "social": {"twitter": "https://twitter.com", "discord": "https://discord.gg", "telegram": "https://t.me"}}, "order_index": 3}]');

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to create a new project from template
-- =====================================================
-- CREATE PROJECT FROM TEMPLATE FUNCTION - UPDATED
-- =====================================================

CREATE OR REPLACE FUNCTION create_project_from_template(
  p_user_id UUID,
  p_project_name TEXT,
  p_project_slug TEXT,
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

  -- Create the project
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
    p_project_name,
    p_project_slug,
    v_template_id,
    false,
    NOW(),
    NOW()
  ) RETURNING id INTO v_project_id;

  -- Create blocks from template default data
  -- Navbar Block
  IF v_template_data->'header' IS NOT NULL THEN
    v_block_data := jsonb_build_object(
      'logo', v_template_data->'header'->>'logo',
      'navItems', v_template_data->'header'->'navItems',
      'cta', v_template_data->'header'->'cta'
    );
    
    INSERT INTO user_project_blocks (
      project_id,
      name,
      type,
      order_index,
      content,
      settings,
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'Navigation',
      'navbar',
      v_block_order,
      v_block_data,
      '{}'::jsonb,
      true,
      NOW(),
      NOW()
    );
    v_block_order := v_block_order + 1;
  END IF;

  -- Hero Block
  IF v_template_data->'content'->'hero' IS NOT NULL THEN
    v_block_data := jsonb_build_object(
      'title', v_template_data->'content'->'hero'->>'title',
      'subtitle', v_template_data->'content'->'hero'->>'subtitle',
      'description', v_template_data->'content'->'hero'->>'description',
      'tokenSymbol', v_template_data->'content'->'hero'->>'tokenSymbol',
      'stats', v_template_data->'content'->'hero'->'stats',
      'primaryButton', v_template_data->'content'->'hero'->'primaryButton',
      'secondaryButton', v_template_data->'content'->'hero'->'secondaryButton',
      'scrollText', v_template_data->'content'->'hero'->>'scrollText',
      'showTokenPill', v_template_data->'content'->'hero'->>'showTokenPill',
      'showStats', v_template_data->'content'->'hero'->>'showStats',
      'showPrimaryButton', v_template_data->'content'->'hero'->>'showPrimaryButton',
      'showSecondaryButton', v_template_data->'content'->'hero'->>'showSecondaryButton',
      'showTokenVisual', v_template_data->'content'->'hero'->>'showTokenVisual',
      'showScrollIndicator', v_template_data->'content'->'hero'->>'showScrollIndicator'
    );
    
    INSERT INTO user_project_blocks (
      project_id,
      name,
      type,
      order_index,
      content,
      settings,
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'Hero Section',
      'hero',
      v_block_order,
      v_block_data,
      '{}'::jsonb,
      true,
      NOW(),
      NOW()
    );
    v_block_order := v_block_order + 1;
  END IF;

  -- About Block
  IF v_template_data->'content'->'about' IS NOT NULL THEN
    v_block_data := jsonb_build_object(
      'title', v_template_data->'content'->'about'->>'title',
      'description', v_template_data->'content'->'about'->>'description',
      'content', v_template_data->'content'->'about'->>'content',
      'contractAddress', v_template_data->'content'->'about'->>'contractAddress',
      'ctaTitle', v_template_data->'content'->'about'->>'ctaTitle',
      'ctaDescription', v_template_data->'content'->'about'->>'ctaDescription',
      'ctaPrimary', v_template_data->'content'->'about'->'ctaPrimary',
      'ctaSecondary', v_template_data->'content'->'about'->'ctaSecondary',
      'features', v_template_data->'content'->'about'->'features'
    );
    
    INSERT INTO user_project_blocks (
      project_id,
      name,
      type,
      order_index,
      content,
      settings,
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'About Section',
      'about',
      v_block_order,
      v_block_data,
      '{}'::jsonb,
      true,
      NOW(),
      NOW()
    );
    v_block_order := v_block_order + 1;
  END IF;

  -- Features Block
  IF v_template_data->'content'->'features' IS NOT NULL THEN
    INSERT INTO user_project_blocks (
      project_id,
      name,
      type,
      order_index,
      content,
      settings,
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'Features',
      'features',
      v_block_order,
      jsonb_build_object('features', v_template_data->'content'->'features'),
      '{}'::jsonb,
      true,
      NOW(),
      NOW()
    );
    v_block_order := v_block_order + 1;
  END IF;

  -- Token Details Block
  IF v_template_data->'content'->'tokenDetails' IS NOT NULL THEN
    INSERT INTO user_project_blocks (
      project_id,
      name,
      type,
      order_index,
      content,
      settings,
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'Token Details',
      'token-details',
      v_block_order,
      v_template_data->'content'->'tokenDetails',
      '{}'::jsonb,
      true,
      NOW(),
      NOW()
    );
    v_block_order := v_block_order + 1;
  END IF;

  -- Tokenomics Block
  IF v_template_data->'content'->'tokenomics' IS NOT NULL THEN
    INSERT INTO user_project_blocks (
      project_id,
      name,
      type,
      order_index,
      content,
      settings,
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'Tokenomics',
      'tokenomics',
      v_block_order,
      v_template_data->'content'->'tokenomics',
      '{}'::jsonb,
      true,
      NOW(),
      NOW()
    );
    v_block_order := v_block_order + 1;
  END IF;

  -- Roadmap Block
  IF v_template_data->'content'->'roadmap' IS NOT NULL THEN
    INSERT INTO user_project_blocks (
      project_id,
      name,
      type,
      order_index,
      content,
      settings,
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'Roadmap',
      'roadmap',
      v_block_order,
      jsonb_build_object('phases', v_template_data->'content'->'roadmap'),
      '{}'::jsonb,
      true,
      NOW(),
      NOW()
    );
    v_block_order := v_block_order + 1;
  END IF;

  -- Team Block
  IF v_template_data->'content'->'team' IS NOT NULL THEN
    INSERT INTO user_project_blocks (
      project_id,
      name,
      type,
      order_index,
      content,
      settings,
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'Team',
      'team',
      v_block_order,
      jsonb_build_object('members', v_template_data->'content'->'team'),
      '{}'::jsonb,
      true,
      NOW(),
      NOW()
    );
    v_block_order := v_block_order + 1;
  END IF;

  -- Community Block
  IF v_template_data->'content'->'community' IS NOT NULL THEN
    INSERT INTO user_project_blocks (
      project_id,
      name,
      type,
      order_index,
      content,
      settings,
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'Community',
      'community',
      v_block_order,
      v_template_data->'content'->'community',
      '{}'::jsonb,
      true,
      NOW(),
      NOW()
    );
    v_block_order := v_block_order + 1;
  END IF;

  -- Footer Block
  INSERT INTO user_project_blocks (
    project_id,
    name,
    type,
    order_index,
    content,
    settings,
    is_enabled,
    created_at,
    updated_at
  ) VALUES (
    v_project_id,
    'Footer',
    'footer',
    v_block_order,
    jsonb_build_object(
      'social', v_template_data->'social',
      'copyright', '© 2024 All rights reserved'
    ),
    '{}'::jsonb,
    true,
    NOW(),
    NOW()
  );

  RETURN v_project_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get project data with all blocks
CREATE OR REPLACE FUNCTION get_project_data(p_project_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_project JSONB;
    v_blocks JSONB;
    v_result JSONB;
BEGIN
    -- Get project metadata
    SELECT jsonb_build_object(
        'id', up.id,
        'name', up.name,
        'slug', up.slug,
        'template_id', up.template_id,
        'is_published', up.is_published,
        'created_at', up.created_at,
        'updated_at', up.updated_at
    ) INTO v_project
    FROM user_projects up
    WHERE up.id = p_project_id;
    
    -- Get all blocks
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', upb.id,
            'name', upb.name,
            'type', upb.type,
            'content', upb.content,
            'order_index', upb.order_index,
            'is_enabled', upb.is_enabled
        ) ORDER BY upb.order_index
    ) INTO v_blocks
    FROM user_project_blocks upb
    WHERE upb.project_id = p_project_id;
    
    -- Combine project and blocks
    v_result := jsonb_build_object(
        'project', v_project,
        'blocks', COALESCE(v_blocks, '[]'::jsonb)
    );
    
    RETURN v_result;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION create_project_from_template(UUID, VARCHAR, VARCHAR, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION get_project_data(UUID) TO authenticated, anon;

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_projects_updated_at BEFORE UPDATE ON user_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_project_blocks_updated_at BEFORE UPDATE ON user_project_blocks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
