-- Fix RLS Policies - Drop existing policies and recreate them safely

-- Drop existing RLS policies for user_project_sections
DROP POLICY IF EXISTS "Users can view their own project sections" ON public.user_project_sections;
DROP POLICY IF EXISTS "Users can insert their own project sections" ON public.user_project_sections;
DROP POLICY IF EXISTS "Users can update their own project sections" ON public.user_project_sections;
DROP POLICY IF EXISTS "Users can delete their own project sections" ON public.user_project_sections;

-- Drop existing RLS policies for user_project_blocks
DROP POLICY IF EXISTS "Users can view their own project blocks" ON public.user_project_blocks;
DROP POLICY IF EXISTS "Users can insert their own project blocks" ON public.user_project_blocks;
DROP POLICY IF EXISTS "Users can update their own project blocks" ON public.user_project_blocks;
DROP POLICY IF EXISTS "Users can delete their own project blocks" ON public.user_project_blocks;

-- Drop existing RLS policies for user_projects
DROP POLICY IF EXISTS "Users can view their own projects" ON public.user_projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON public.user_projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.user_projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.user_projects;

-- Drop existing RLS policies for users
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

-- Drop existing RLS policies for templates
DROP POLICY IF EXISTS "Anyone can view templates" ON public.templates;

-- Drop existing RLS policies for template_sections
DROP POLICY IF EXISTS "Anyone can view template sections" ON public.template_sections;

-- Drop existing RLS policies for section_blocks
DROP POLICY IF EXISTS "Anyone can view section blocks" ON public.section_blocks;

-- Drop existing RLS policies for analytics
DROP POLICY IF EXISTS "Users can view analytics for their own projects" ON public.page_views;
DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;
DROP POLICY IF EXISTS "Users can view sessions for their own projects" ON public.sessions;
DROP POLICY IF EXISTS "Anyone can insert sessions" ON public.sessions;
DROP POLICY IF EXISTS "Anyone can update sessions" ON public.sessions;
DROP POLICY IF EXISTS "Users can view unique visitors for their own projects" ON public.unique_visitors;
DROP POLICY IF EXISTS "Anyone can insert unique visitors" ON public.unique_visitors;
DROP POLICY IF EXISTS "Anyone can update unique visitors" ON public.unique_visitors;

-- Recreate RLS Policies for users
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Recreate RLS Policies for templates (public read access)
CREATE POLICY "Anyone can view templates" ON public.templates
  FOR SELECT USING (true);

-- Recreate RLS Policies for template_sections (public read access)
CREATE POLICY "Anyone can view template sections" ON public.template_sections
  FOR SELECT USING (true);

-- Recreate RLS Policies for section_blocks (public read access)
CREATE POLICY "Anyone can view section blocks" ON public.section_blocks
  FOR SELECT USING (true);

-- Recreate RLS Policies for user_projects
CREATE POLICY "Users can view their own projects" ON public.user_projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON public.user_projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public.user_projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON public.user_projects
  FOR DELETE USING (auth.uid() = user_id);

-- Recreate RLS Policies for user_project_sections
CREATE POLICY "Users can view their own project sections" ON public.user_project_sections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_projects 
      WHERE user_projects.id = user_project_sections.project_id 
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own project sections" ON public.user_project_sections
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_projects 
      WHERE user_projects.id = user_project_sections.project_id 
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own project sections" ON public.user_project_sections
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_projects 
      WHERE user_projects.id = user_project_sections.project_id 
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own project sections" ON public.user_project_sections
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_projects 
      WHERE user_projects.id = user_project_sections.project_id 
      AND user_projects.user_id = auth.uid()
    )
  );

-- Recreate RLS Policies for user_project_blocks
CREATE POLICY "Users can view their own project blocks" ON public.user_project_blocks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_project_sections 
      JOIN public.user_projects ON user_projects.id = user_project_sections.project_id
      WHERE user_project_sections.id = user_project_blocks.project_section_id 
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own project blocks" ON public.user_project_blocks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_project_sections 
      JOIN public.user_projects ON user_projects.id = user_project_sections.project_id
      WHERE user_project_sections.id = user_project_blocks.project_section_id 
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own project blocks" ON public.user_project_blocks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_project_sections 
      JOIN public.user_projects ON user_projects.id = user_project_sections.project_id
      WHERE user_project_sections.id = user_project_blocks.project_section_id 
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own project blocks" ON public.user_project_blocks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_project_sections 
      JOIN public.user_projects ON user_projects.id = user_project_sections.project_id
      WHERE user_project_sections.id = user_project_blocks.project_section_id 
      AND user_projects.user_id = auth.uid()
    )
  );

-- Recreate RLS Policies for analytics (users can only see their own project analytics)
CREATE POLICY "Users can view analytics for their own projects" ON public.page_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_projects 
      WHERE user_projects.id = page_views.project_id 
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert page views" ON public.page_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view sessions for their own projects" ON public.sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_projects 
      WHERE user_projects.id = sessions.project_id 
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert sessions" ON public.sessions
  FOR INSERT WITH CHECK (true);
 
CREATE POLICY "Anyone can update sessions" ON public.sessions
  FOR UPDATE USING (true);

CREATE POLICY "Users can view unique visitors for their own projects" ON public.unique_visitors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_projects 
      WHERE user_projects.id = unique_visitors.project_id 
      AND user_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert unique visitors" ON public.unique_visitors
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update unique visitors" ON public.unique_visitors
  FOR UPDATE USING (true);

-- Update user_projects table to make slug unique per user instead of globally
ALTER TABLE public.user_projects DROP CONSTRAINT IF EXISTS user_projects_slug_key;
CREATE UNIQUE INDEX IF NOT EXISTS user_projects_user_slug_unique ON public.user_projects(user_id, slug);
