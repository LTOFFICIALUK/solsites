-- DEBUG SECTION TYPES
-- This SQL shows what section types exist in the database for neon projects

-- Check template sections (base template)
SELECT 'Template Sections:' as info;
SELECT t.slug as template_slug, ts.name, ts.type, ts.order_index
FROM public.template_sections ts
JOIN public.templates t ON ts.template_id = t.id
WHERE t.slug = 'neon'
ORDER BY ts.order_index;

-- Check user project sections for a specific neon project
SELECT 'User Project Sections:' as info;
SELECT up.name as project_name, ups.name, ups.type, ups.order_index, ups.is_enabled
FROM public.user_project_sections ups
JOIN public.user_projects up ON ups.project_id = up.id
JOIN public.templates t ON up.template_id = t.id
WHERE t.slug = 'neon'
ORDER BY up.name, ups.order_index;

-- Check user project blocks for a specific neon project
SELECT 'User Project Blocks:' as info;
SELECT up.name as project_name, ups.name as section_name, upb.name as block_name, upb.type as block_type, upb.order_index
FROM public.user_project_blocks upb
JOIN public.user_project_sections ups ON upb.project_section_id = ups.id
JOIN public.user_projects up ON ups.project_id = up.id
JOIN public.templates t ON up.template_id = t.id
WHERE t.slug = 'neon'
ORDER BY up.name, ups.order_index, upb.order_index;
