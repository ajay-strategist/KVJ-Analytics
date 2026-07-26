-- Additive columns for blog_posts table to support premium features
alter table public.blog_posts 
  add column if not exists status text default 'published',
  add column if not exists featured_flags text[] default '{}',
  add column if not exists tags text[] default '{}',
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists seo_keywords text,
  add column if not exists authors_json jsonb default '[]'::jsonb,
  add column if not exists category_json jsonb default '{}'::jsonb,
  add column if not exists related_ids uuid[] default '{}',
  add column if not exists version_history jsonb default '[]'::jsonb;

-- Indices for fast searching and filtering
create index if not exists blog_posts_status_idx on public.blog_posts (status);
create index if not exists blog_posts_tags_idx on public.blog_posts using gin (tags);
create index if not exists blog_posts_featured_flags_idx on public.blog_posts using gin (featured_flags);

-- Reversible rollback commands (for reference):
-- alter table public.blog_posts 
--   drop column if exists status,
--   drop column if exists featured_flags,
--   drop column if exists tags,
--   drop column if exists seo_title,
--   drop column if exists seo_description,
--   drop column if exists seo_keywords,
--   drop column if exists authors_json,
--   drop column if exists category_json,
--   drop column if exists related_ids,
--   drop column if exists version_history;
