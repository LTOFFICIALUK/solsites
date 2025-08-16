-- Fix section order for existing projects
-- Update Team section order_index from 3 to 4
-- Update Roadmap section order_index from 4 to 3

-- Update user_project_blocks for Team sections
UPDATE user_project_blocks 
SET order_index = 4 
WHERE type = 'team' AND order_index = 3;

-- Update user_project_blocks for Roadmap sections  
UPDATE user_project_blocks 
SET order_index = 3 
WHERE type = 'roadmap' AND order_index = 4;

-- Update section_blocks for Team sections
UPDATE section_blocks 
SET order_index = 4 
WHERE type = 'team' AND order_index = 3;

-- Update section_blocks for Roadmap sections
UPDATE section_blocks 
SET order_index = 3 
WHERE type = 'roadmap' AND order_index = 4;

-- Verify the changes
SELECT 
  'user_project_blocks' as table_name,
  type,
  order_index,
  COUNT(*) as count
FROM user_project_blocks 
WHERE type IN ('team', 'roadmap')
GROUP BY type, order_index
ORDER BY type, order_index;

SELECT 
  'section_blocks' as table_name,
  type,
  order_index,
  COUNT(*) as count
FROM section_blocks 
WHERE type IN ('team', 'roadmap')
GROUP BY type, order_index
ORDER BY type, order_index;
