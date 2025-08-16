-- Check project data for debugging
SELECT 
  id,
  name,
  template_id,
  slug,
  is_published,
  created_at,
  updated_at
FROM user_projects 
WHERE id = '061cd16c-7357-4212-b031-b99d89b58aed';

-- Check all available templates
SELECT 
  id,
  name,
  slug,
  description
FROM templates;

-- Check if there are any projects with invalid template_ids
SELECT 
  up.id,
  up.name,
  up.template_id,
  up.slug,
  t.name as template_name
FROM user_projects up
LEFT JOIN templates t ON up.template_id = t.id
WHERE t.id IS NULL;
