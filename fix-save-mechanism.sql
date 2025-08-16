-- Fix Save Mechanism: Single Source of Truth
-- This implements Option 1: Save only to user_project_blocks and derive project data from blocks

-- 1. Create a function to get merged project content from blocks only
CREATE OR REPLACE FUNCTION get_project_content(p_project_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'sections', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', ups.id,
          'name', ups.name,
          'type', ups.type,
          'order_index', ups.order_index,
          'is_enabled', ups.is_enabled,
          'settings', ups.settings,
          'blocks', (
            SELECT jsonb_agg(
              jsonb_build_object(
                'id', upb.id,
                'name', upb.name,
                'type', upb.type,
                'order_index', upb.order_index,
                'is_enabled', upb.is_enabled,
                'settings', upb.settings,
                'content', upb.content
              ) ORDER BY upb.order_index
            ) FROM user_project_blocks upb 
            WHERE upb.project_section_id = ups.id
          )
        ) ORDER BY ups.order_index
      ) FROM user_project_sections ups 
      WHERE ups.project_id = p_project_id
    )
  ) INTO result;
  
  RETURN result;
END;
$$;

-- 2. Grant execute permission
GRANT EXECUTE ON FUNCTION get_project_content(uuid) TO anon, authenticated;

-- 3. Clean up existing project data to remove content (keep only metadata)
UPDATE user_projects 
SET data = jsonb_strip_nulls(
  data - 'content' - 'header' - 'social' - 'tokenInfo' - 'branding'
)
WHERE data ? 'content';

-- 4. Test the new function (replace with actual project ID)
-- SELECT get_project_content('your-project-id-here');
