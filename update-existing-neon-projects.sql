-- UPDATE EXISTING NEON PROJECTS
-- This SQL updates existing neon projects to use the new template content

-- Update navigation blocks for existing neon projects
UPDATE public.user_project_blocks 
SET content = '{"logoUrl": "", "displayName": "", "navItems": [{"label": "Token Details", "href": "#token-details"}, {"label": "Community", "href": "#community"}], "cta": {"text": "Buy Now"}, "social": {"twitter": "https://twitter.com/memecoin", "telegram": "https://t.me/memecoin", "discord": "https://discord.gg/memetoken", "website": "https://memetoken.com"}}'
WHERE id IN (
  SELECT upb.id 
  FROM public.user_project_blocks upb
  JOIN public.user_project_sections ups ON upb.project_section_id = ups.id
  JOIN public.user_projects up ON ups.project_id = up.id
  JOIN public.templates t ON up.template_id = t.id
  WHERE t.slug = 'neon' 
    AND upb.type = 'navbar'
    AND ups.type = 'header'
);

-- Update hero blocks for existing neon projects
UPDATE public.user_project_blocks 
SET content = '{"title": "Welcome to the Future", "subtitle": "The Next Big Thing in Crypto", "description": "Join the revolution with our innovative meme coin that combines humor, community, and cutting-edge blockchain technology.", "showTokenPill": true, "showStats": true, "showPrimaryButton": true, "showSecondaryButton": true, "showTokenVisual": true, "showScrollIndicator": true, "tokenSymbol": "MEME", "stats": [{"value": "10K+", "label": "Holders", "color": "primary"}, {"value": "$2.5M", "label": "Market Cap", "color": "secondary"}, {"value": "$500K", "label": "24h Volume", "color": "accent"}], "primaryButton": {"text": "Buy Now", "href": ""}, "secondaryButton": {"text": "Watch Video", "href": ""}, "scrollText": "Scroll to explore"}'
WHERE id IN (
  SELECT upb.id 
  FROM public.user_project_blocks upb
  JOIN public.user_project_sections ups ON upb.project_section_id = ups.id
  JOIN public.user_projects up ON ups.project_id = up.id
  JOIN public.templates t ON up.template_id = t.id
  WHERE t.slug = 'neon' 
    AND upb.type = 'hero'
    AND ups.type = 'template'
);

-- Verify the updates
SELECT 'Existing neon projects updated:' as status;
SELECT 
  up.name as project_name,
  t.slug as template_slug,
  COUNT(CASE WHEN upb.type = 'navbar' THEN 1 END) as navbar_blocks_updated,
  COUNT(CASE WHEN upb.type = 'hero' THEN 1 END) as hero_blocks_updated
FROM public.user_projects up
JOIN public.templates t ON up.template_id = t.id
JOIN public.user_project_sections ups ON up.id = ups.project_id
JOIN public.user_project_blocks upb ON ups.id = upb.project_section_id
WHERE t.slug = 'neon'
  AND (upb.type = 'navbar' OR upb.type = 'hero')
GROUP BY up.name, t.slug;
