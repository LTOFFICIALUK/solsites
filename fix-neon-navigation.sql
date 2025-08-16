-- FIX NEON TEMPLATE DATABASE CONTENT
-- This SQL updates the neon template's database content to match what the editor expects
-- Run this SQL to fix the mismatch between database content and editor overrides

-- Fix neon template navigation to match editor expectations
UPDATE public.section_blocks 
SET content = '{"logoUrl": "", "displayName": "", "navItems": [{"label": "Token Details", "href": "#token-details"}, {"label": "Community", "href": "#community"}], "cta": {"text": "Buy Now"}, "social": {"twitter": "https://twitter.com/memecoin", "telegram": "https://t.me/memecoin", "discord": "https://discord.gg/memetoken", "website": "https://memetoken.com"}}'
WHERE id IN (
  SELECT sb.id 
  FROM public.section_blocks sb
  JOIN public.template_sections ts ON sb.section_id = ts.id
  JOIN public.templates t ON ts.template_id = t.id
  WHERE t.slug = 'neon' 
  AND sb.type = 'navbar'
  AND ts.type = 'header'
);

-- Fix neon template hero section to include all the properties the editor expects
UPDATE public.section_blocks 
SET content = '{"title": "Welcome to the Future", "subtitle": "The Next Big Thing in Crypto", "description": "Join the revolution with our innovative meme coin that combines humor, community, and cutting-edge blockchain technology.", "showTokenPill": true, "showStats": true, "showPrimaryButton": true, "showSecondaryButton": true, "showTokenVisual": true, "showScrollIndicator": true, "tokenSymbol": "MEME", "stats": [{"value": "10K+", "label": "Holders", "color": "primary"}, {"value": "$2.5M", "label": "Market Cap", "color": "secondary"}, {"value": "$500K", "label": "24h Volume", "color": "accent"}], "primaryButton": {"text": "Buy Now", "href": ""}, "secondaryButton": {"text": "Watch Video", "href": ""}, "scrollText": "Scroll to explore"}'
WHERE id IN (
  SELECT sb.id 
  FROM public.section_blocks sb
  JOIN public.template_sections ts ON sb.section_id = ts.id
  JOIN public.templates t ON ts.template_id = t.id
  WHERE t.slug = 'neon' 
  AND sb.type = 'hero'
  AND ts.type = 'template'
);

-- Verify the updates - check only the base template blocks (not user project copies)
SELECT 'Base neon template blocks updated:' as status;
SELECT DISTINCT t.name as template_name, ts.name as section_name, sb.name as block_name, sb.type as block_type, 
       ts.order_index, sb.order_index,
       CASE WHEN sb.content::text LIKE '%Token Details%' THEN '✅ Updated' ELSE '❌ Not Updated' END as navigation_status,
       CASE WHEN sb.content::text LIKE '%showTokenPill%' THEN '✅ Updated' ELSE '❌ Not Updated' END as hero_status
FROM public.section_blocks sb
JOIN public.template_sections ts ON sb.section_id = ts.id
JOIN public.templates t ON ts.template_id = t.id
WHERE t.slug = 'neon'
  AND (sb.type = 'navbar' OR sb.type = 'hero')
ORDER BY ts.order_index, sb.order_index;
