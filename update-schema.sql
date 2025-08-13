-- Update user_projects table to make slug unique per user instead of globally
ALTER TABLE public.user_projects DROP CONSTRAINT IF EXISTS user_projects_slug_key;
CREATE UNIQUE INDEX IF NOT EXISTS user_projects_user_slug_unique ON public.user_projects(user_id, slug);

-- Idempotent RPC to seed user_project_sections and user_project_blocks for a project from a template
-- Bypasses RLS via SECURITY DEFINER but enforces ownership via auth.uid() check
create or replace function public.seed_project_sections(p_project_id uuid, p_template_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner uuid;
begin
  -- Verify project exists and is owned by caller
  select user_id into v_owner from public.user_projects where id = p_project_id;
  if v_owner is null then
    raise exception 'project not found';
  end if;
  if v_owner <> auth.uid() then
    raise exception 'forbidden';
  end if;

  -- Upsert sections from template into user_project_sections
  insert into public.user_project_sections (
    project_id, section_id, name, type, order_index, is_enabled, settings
  )
  select
    p_project_id,
    ts.id,
    ts.name,
    ts.type,
    ts.order_index,
    coalesce(ts.is_enabled, true),
    coalesce(ts.settings, '{}'::jsonb)
  from public.template_sections ts
  where ts.template_id = p_template_id
  on conflict (project_id, section_id) do update set
    name = excluded.name,
    type = excluded.type,
    order_index = excluded.order_index,
    is_enabled = excluded.is_enabled,
    settings = excluded.settings;

  -- Upsert blocks for each section
  insert into public.user_project_blocks (
    project_section_id, block_id, name, type, order_index, is_enabled, settings, content
  )
  select
    ups.id as project_section_id,
    sb.id,
    sb.name,
    sb.type,
    sb.order_index,
    coalesce(sb.is_enabled, true),
    coalesce(sb.settings, '{}'::jsonb),
    coalesce(sb.content, '{}'::jsonb)
  from public.section_blocks sb
  join public.template_sections ts on ts.id = sb.section_id
  join public.user_project_sections ups on ups.project_id = p_project_id and ups.section_id = ts.id
  where ts.template_id = p_template_id
  on conflict (project_section_id, block_id) do update set
    name = excluded.name,
    type = excluded.type,
    order_index = excluded.order_index,
    is_enabled = excluded.is_enabled,
    settings = excluded.settings,
    content = excluded.content;
end;
$$;

grant execute on function public.seed_project_sections(uuid, uuid) to anon, authenticated;
