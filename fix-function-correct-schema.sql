-- Fix the create_project_from_template function to match actual table structure
-- Execute this in your Supabase dashboard SQL editor

-- First, drop any existing functions to avoid conflicts
DROP FUNCTION IF EXISTS create_project_from_template(UUID, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS create_project_from_template(UUID, VARCHAR, VARCHAR, VARCHAR);

-- Create the function with correct parameter names and table structure
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
      'displayName', v_template_data->'header'->>'displayName',
      'navItems', v_template_data->'header'->'navItems',
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
      'Navigation',
      'navbar',
      v_block_order,
      v_block_data,
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
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'Hero Section',
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
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'About Section',
      'about',
      v_block_order,
      v_block_data,
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
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'Features',
      'features',
      v_block_order,
      jsonb_build_object('features', v_template_data->'content'->'features'),
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
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'Token Details',
      'token-details',
      v_block_order,
      v_template_data->'content'->'tokenDetails',
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
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'Tokenomics',
      'tokenomics',
      v_block_order,
      v_template_data->'content'->'tokenomics',
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
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'Roadmap',
      'roadmap',
      v_block_order,
      jsonb_build_object('phases', v_template_data->'content'->'roadmap'),
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
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'Team',
      'team',
      v_block_order,
      jsonb_build_object('members', v_template_data->'content'->'team'),
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
      is_enabled,
      created_at,
      updated_at
    ) VALUES (
      v_project_id,
      'Community',
      'community',
      v_block_order,
      v_template_data->'content'->'community',
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
    true,
    NOW(),
    NOW()
  );

  RETURN v_project_id;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_project_from_template(UUID, TEXT, TEXT, TEXT) TO authenticated;

-- Fix RLS policies for user_projects table
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own projects" ON user_projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON user_projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON user_projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON user_projects;

-- Create new policies
CREATE POLICY "Users can view their own projects" ON user_projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON user_projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON user_projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON user_projects
  FOR DELETE USING (auth.uid() = user_id);

-- Fix RLS policies for user_project_blocks table
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view blocks from their projects" ON user_project_blocks;
DROP POLICY IF EXISTS "Users can insert blocks to their projects" ON user_project_blocks;
DROP POLICY IF EXISTS "Users can update blocks from their projects" ON user_project_blocks;
DROP POLICY IF EXISTS "Users can delete blocks from their projects" ON user_project_blocks;

-- Create new policies
CREATE POLICY "Users can view blocks from their projects" ON user_project_blocks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_projects 
      WHERE user_projects.id = user_project_blocks.project_id 
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert blocks to their projects" ON user_project_blocks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_projects 
      WHERE user_projects.id = user_project_blocks.project_id 
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update blocks from their projects" ON user_project_blocks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_projects 
      WHERE user_projects.id = user_project_blocks.project_id 
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete blocks from their projects" ON user_project_blocks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_projects 
      WHERE user_projects.id = user_project_blocks.project_id 
      AND user_projects.user_id = auth.uid()
    )
  );

-- Enable RLS on tables if not already enabled
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_project_blocks ENABLE ROW LEVEL SECURITY;
