-- Fix function overloading issue by dropping all versions and recreating
-- Drop ALL versions of the create_project_from_template function

-- Drop function with TEXT parameters
DROP FUNCTION IF EXISTS create_project_from_template(UUID, TEXT, TEXT, TEXT);

-- Drop function with VARCHAR parameters  
DROP FUNCTION IF EXISTS create_project_from_template(UUID, VARCHAR, VARCHAR, VARCHAR);

-- Drop function with any other parameter combinations
DROP FUNCTION IF EXISTS create_project_from_template(UUID, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS create_project_from_template(UUID, VARCHAR, VARCHAR, VARCHAR, VARCHAR);

-- Create the function with correct parameter names and TEXT types
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
  -- Header Block (from root level)
  IF v_template_data->'header' IS NOT NULL THEN
    v_block_data := jsonb_build_object(
      'logo', v_template_data->'header'->>'logo',
      'displayName', v_template_data->'header'->>'displayName',
      'navigation', v_template_data->'header'->'navItems',
      'cta', v_template_data->'header'->'cta',
      'colors', v_template_data->'header'->'colors'
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

  -- Hero Block (from content.hero)
  IF v_template_data->'content'->'hero' IS NOT NULL THEN
    v_block_data := jsonb_build_object(
      'title', v_template_data->'content'->'hero'->>'title',
      'subtitle', v_template_data->'content'->'hero'->>'subtitle',
      'description', v_template_data->'content'->'hero'->>'description',
      'stats', v_template_data->'content'->'hero'->'stats',
      'primaryButton', v_template_data->'content'->'hero'->'primaryButton',
      'secondaryButton', v_template_data->'content'->'hero'->'secondaryButton',
      'tokenSymbol', v_template_data->'content'->'hero'->>'tokenSymbol',
      'showTokenPill', v_template_data->'content'->'hero'->>'showTokenPill',
      'showStats', v_template_data->'content'->'hero'->>'showStats',
      'showPrimaryButton', v_template_data->'content'->'hero'->>'showPrimaryButton',
      'showSecondaryButton', v_template_data->'content'->'hero'->>'showSecondaryButton',
      'showTokenVisual', v_template_data->'content'->'hero'->>'showTokenVisual',
      'showScrollIndicator', v_template_data->'content'->'hero'->>'showScrollIndicator',
      'scrollText', v_template_data->'content'->'hero'->>'scrollText',
      'backgroundImage', v_template_data->'content'->'hero'->>'backgroundImage'
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

  -- About Block (from content.about)
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

  -- Tokenomics Block (from content.tokenomics)
  IF v_template_data->'content'->'tokenomics' IS NOT NULL THEN
    v_block_data := jsonb_build_object(
      'title', v_template_data->'content'->'tokenomics'->>'title',
      'description', v_template_data->'content'->'tokenomics'->>'description',
      'totalSupply', v_template_data->'content'->'tokenomics'->>'totalSupply',
      'distribution', v_template_data->'content'->'tokenomics'->'distribution'
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

  -- Roadmap Block (from content.roadmap)
  IF v_template_data->'content'->'roadmap' IS NOT NULL THEN
    v_block_data := jsonb_build_object(
      'title', 'Roadmap',
      'description', 'Our journey to success',
      'phases', v_template_data->'content'->'roadmap'
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

  -- Team Block (from content.team)
  IF v_template_data->'content'->'team' IS NOT NULL THEN
    v_block_data := jsonb_build_object(
      'title', 'Our Team',
      'description', 'Meet the brilliant minds behind the project',
      'members', v_template_data->'content'->'team'
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

  -- Community Block (from content.community)
  IF v_template_data->'content'->'community' IS NOT NULL THEN
    v_block_data := jsonb_build_object(
      'title', v_template_data->'content'->'community'->>'title',
      'description', v_template_data->'content'->'community'->>'description',
      'cards', v_template_data->'content'->'community'->'cards'
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

  -- Footer Block (from root level social data)
  v_block_data := jsonb_build_object(
    'copyright', '© 2024 All rights reserved',
    'social', v_template_data->'social'
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

  RETURN v_project_id;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_project_from_template(UUID, TEXT, TEXT, TEXT) TO authenticated;
