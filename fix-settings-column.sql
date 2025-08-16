-- Fix the get_project_data function to remove the settings column reference
-- that doesn't exist in the user_project_blocks table

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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_project_data(UUID) TO authenticated;
