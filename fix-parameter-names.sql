-- Fix the create_project_from_template function parameter names
-- First drop the existing function, then recreate it

-- Drop the existing function
DROP FUNCTION IF EXISTS create_project_from_template(UUID, TEXT, TEXT, TEXT);

-- Create the function with correct parameter names
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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_project_from_template(UUID, TEXT, TEXT, TEXT) TO authenticated;
