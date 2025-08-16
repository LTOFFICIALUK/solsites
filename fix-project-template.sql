-- Fix project template issue
-- This script will help identify and fix the template problem

-- First, let's see what's in the database for this project
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

-- Check what templates are available
SELECT 
  id,
  name,
  slug,
  description
FROM templates;

-- Find the neon template UUID
SELECT id as neon_template_id FROM templates WHERE slug = 'neon';

-- If the project exists but has an invalid template_id, fix it using the correct UUID
UPDATE user_projects 
SET template_id = (SELECT id FROM templates WHERE slug = 'neon' LIMIT 1)
WHERE id = '061cd16c-7357-4212-b031-b99d89b58aed' 
AND (template_id IS NULL OR template_id NOT IN (SELECT id FROM templates));

-- Verify the fix
SELECT 
  up.id,
  up.name,
  up.template_id,
  up.slug,
  t.name as template_name,
  t.slug as template_slug
FROM user_projects up
LEFT JOIN templates t ON up.template_id = t.id
WHERE up.id = '061cd16c-7357-4212-b031-b99d89b58aed';

-- Check for any other projects with invalid template_ids
SELECT 
  up.id,
  up.name,
  up.template_id,
  up.slug,
  t.name as template_name
FROM user_projects up
LEFT JOIN templates t ON up.template_id = t.id
WHERE t.id IS NULL;
