-- TEST NEON TEMPLATE FIX
-- This SQL checks if the neon template database content is correct

-- Check base template navigation content
SELECT 'Navigation Block Content:' as test_name;
SELECT sb.content->>'navItems' as navigation_items
FROM public.section_blocks sb
JOIN public.template_sections ts ON sb.section_id = ts.id
JOIN public.templates t ON ts.template_id = t.id
WHERE t.slug = 'neon' 
  AND sb.type = 'navbar'
  AND ts.type = 'header'
LIMIT 1;

-- Check base template hero content
SELECT 'Hero Block Properties:' as test_name;
SELECT 
  sb.content->>'showTokenPill' as show_token_pill,
  sb.content->>'tokenSymbol' as token_symbol,
  sb.content->>'showStats' as show_stats
FROM public.section_blocks sb
JOIN public.template_sections ts ON sb.section_id = ts.id
JOIN public.templates t ON ts.template_id = t.id
WHERE t.slug = 'neon' 
  AND sb.type = 'hero'
  AND ts.type = 'template'
LIMIT 1;

-- Check if there are any neon template blocks with old content
SELECT 'Blocks with Old Content:' as test_name;
SELECT COUNT(*) as count_old_navigation
FROM public.section_blocks sb
JOIN public.template_sections ts ON sb.section_id = ts.id
JOIN public.templates t ON ts.template_id = t.id
WHERE t.slug = 'neon' 
  AND sb.type = 'navbar'
  AND ts.type = 'header'
  AND sb.content::text LIKE '%About%';  -- Old content indicator
