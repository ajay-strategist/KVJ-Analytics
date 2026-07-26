-- Blog posts (admin-managed). Public reads published rows; admin writes via service role.
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  body_html text,
  cover_url text,
  author_name text default 'KVJ Analytics',
  author_slug text default 'kvj-analytics',
  author_bio text,
  category_title text default 'Insights',
  category_slug text default 'insights',
  published_at timestamptz default now(),
  featured boolean default false,
  is_published boolean default true,
  display_order int default 1,
  created_at timestamptz default now()
);

create index if not exists blog_posts_published_idx on public.blog_posts (is_published, published_at desc);
create index if not exists blog_posts_slug_idx on public.blog_posts (slug);

alter table public.blog_posts enable row level security;

-- Public can read published posts
drop policy if exists "Public read published blog posts" on public.blog_posts;
create policy "Public read published blog posts"
  on public.blog_posts for select
  using (is_published = true);

-- Writes happen only via the service-role key in admin API routes (bypasses RLS),
-- so no anon insert/update/delete policies are defined.
