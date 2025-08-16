-- RPCs and helpers to make Neon projects save reliably
create or replace function public._norm_type(t text)
returns text language sql immutable as $$
  select lower(regexp_replace(coalesce(t, ''), '\s+', '', 'g'))
$$;

create or replace function public.seed_project_sections(p_project_id uuid, p_template_id uuid)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_owner uuid;
  s record;
  up_rec user_project_sections%rowtype;
  b record;
begin
  select user_id into v_owner from user_projects where id = p_project_id;
  if v_owner is distinct from auth.uid() then
    raise exception 'not owner';
  end if;

  for s in select * from template_sections where template_id = p_template_id order by order_index loop
    insert into user_project_sections(project_id, section_id, name, type, order_index, is_enabled, settings)
    values (p_project_id, s.id, s.name, s.type, s.order_index, coalesce(s.is_enabled, true), coalesce(s.settings, '{}'::jsonb))
    on conflict (project_id, section_id) do update set
      name = excluded.name,
      type = excluded.type,
      order_index = excluded.order_index,
      is_enabled = excluded.is_enabled,
      settings = excluded.settings
    returning * into up_rec;

    for b in select * from section_blocks where section_id = s.id order by order_index loop
      insert into user_project_blocks(project_section_id, block_id, name, type, order_index, is_enabled, settings, content)
      values (up_rec.id, b.id, b.name, b.type, b.order_index, coalesce(b.is_enabled, true), coalesce(b.settings, '{}'::jsonb), coalesce(b.content, '{}'::jsonb))
      on conflict (project_section_id, block_id) do update set
        name = excluded.name,
        type = excluded.type,
        order_index = excluded.order_index,
        is_enabled = excluded.is_enabled,
        settings = excluded.settings;
    end loop;
  end loop;
end
$$;

create or replace function public.save_block_content(
  p_project_id uuid,
  p_section_type text,
  p_block_type text,
  p_content jsonb
)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_owner uuid;
  v_tpl_id uuid;
  v_section user_project_sections%rowtype;
  v_src_section template_sections%rowtype;
  v_src_block section_blocks%rowtype;
begin
  select user_id, template_id into v_owner, v_tpl_id from user_projects where id = p_project_id;
  if v_owner is distinct from auth.uid() then
    raise exception 'not owner';
  end if;

  perform public.seed_project_sections(p_project_id, v_tpl_id);

  select * into v_section from user_project_sections
  where project_id = p_project_id and public._norm_type(type) = public._norm_type(p_section_type)
  order by order_index limit 1;

  if v_section.id is null then
    perform public.seed_project_sections(p_project_id, v_tpl_id);
    select * into v_section from user_project_sections
    where project_id = p_project_id and public._norm_type(type) = public._norm_type(p_section_type)
    order by order_index limit 1;
  end if;
  if v_section.id is null then
    raise exception 'section not found for type %', p_section_type;
  end if;

  select ts.* into v_src_section from template_sections ts
  where ts.template_id = v_tpl_id and public._norm_type(ts.type) = public._norm_type(p_section_type)
  order by ts.order_index limit 1;
  if v_src_section.id is null then
    raise exception 'template section not found for %', p_section_type;
  end if;

  select sb.* into v_src_block from section_blocks sb
  where sb.section_id = v_src_section.id and public._norm_type(sb.type) = public._norm_type(p_block_type)
  order by sb.order_index limit 1;
  if v_src_block.id is null then
    raise exception 'template block not found for % in %', p_block_type, p_section_type;
  end if;

  insert into user_project_blocks(project_section_id, block_id, name, type, order_index, is_enabled, settings, content)
  values (v_section.id, v_src_block.id, v_src_block.name, v_src_block.type, v_src_block.order_index, coalesce(v_src_block.is_enabled, true), coalesce(v_src_block.settings, '{}'::jsonb), coalesce(p_content, '{}'::jsonb))
  on conflict (project_section_id, block_id) do update set
    content = excluded.content,
    updated_at = now();
end
$$;

grant execute on function public.seed_project_sections(uuid, uuid) to anon, authenticated;
grant execute on function public.save_block_content(uuid, text, text, jsonb) to anon, authenticated;
-- Quick fix for the template issue
-- Run this in your Supabase SQL editor

-- Step 1: Check what templates exist
SELECT id, name, slug FROM templates;

-- Step 2: Find the neon template UUID
SELECT id as neon_uuid FROM templates WHERE slug = 'neon';

-- Step 3: Fix the project template_id (replace the UUID below with the actual neon template UUID from step 2)
-- UPDATE user_projects 
-- SET template_id = 'PASTE_THE_NEON_UUID_HERE'
-- WHERE id = '061cd16c-7357-4212-b031-b99d89b58aed';

-- Step 4: Verify the fix
SELECT 
  up.id,
  up.name,
  up.template_id,
  t.name as template_name,
  t.slug as template_slug
FROM user_projects up
LEFT JOIN templates t ON up.template_id = t.id
WHERE up.id = '061cd16c-7357-4212-b031-b99d89b58aed';
