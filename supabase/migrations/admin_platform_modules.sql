-- ============================================================
--  KVJ Analytics — Admin Platform Phase 2.x modules migration
--  Adds tables for: Media Library, Users & Roles, Certificates,
--  Audit Logs. (Orders/Payments reuse `orders`; Assessments/
--  Question Bank reuse `mock_tests`/`questions`; Reports/Analytics/
--  Settings need no new tables — Settings reuses `page_content`.)
--  Safe to re-run (uses "if not exists").
-- ============================================================

-- MEDIA LIBRARY (tracks files uploaded via /api/admin/upload + /api/admin/media)
create table if not exists public.media_library (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  type text not null default 'image' check (type in ('image', 'video', 'document', 'other')),
  mime_type text,
  size_bytes bigint default 0,
  folder text default 'uploads',
  tags text[] default '{}',
  uploaded_by text,
  created_at timestamptz default now()
);
alter table public.media_library enable row level security;
create policy "Admins can manage media_library" on public.media_library for all using (true) with check (true);

-- ADMIN USERS (internal staff — Super Admin/Admin/Sub Admin/Trainer records).
-- Note: this is the RBAC *data model* only. Auth is still the single shared HMAC
-- session (lib/adminAuth.ts) — per-user login + permission enforcement is a
-- future step (doc 013), tracked here so the module is ready to wire up.
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  role text not null default 'admin' check (role in ('super_admin', 'admin', 'sub_admin', 'trainer', 'college_coordinator', 'corporate_user')),
  status text not null default 'active' check (status in ('active', 'invited', 'suspended')),
  permissions jsonb not null default '{}',
  last_active_at timestamptz,
  created_at timestamptz default now()
);
alter table public.admin_users enable row level security;
create policy "Admins can manage admin_users" on public.admin_users for all using (true) with check (true);

-- CERTIFICATES (issued to students on course/exam completion)
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_slug text not null,
  certificate_number text unique not null,
  verify_code text unique not null,
  issued_at timestamptz default now(),
  status text not null default 'issued' check (status in ('issued', 'revoked')),
  pdf_url text
);
alter table public.certificates enable row level security;
create policy "Users can view their own certificates" on public.certificates for select using (auth.uid() = user_id);
create policy "Admins can manage certificates" on public.certificates for all using (true) with check (true);

-- AUDIT LOGS (admin action trail)
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor text not null default 'admin',
  action text not null,
  entity_type text not null,
  entity_id text,
  meta jsonb not null default '{}',
  created_at timestamptz default now()
);
alter table public.audit_logs enable row level security;
create policy "Admins can manage audit_logs" on public.audit_logs for all using (true) with check (true);
create index if not exists audit_logs_created_at_idx on public.audit_logs (created_at desc);

-- Orders: allow a "refunded" status (Orders/Payments admin modules can mark refunds).
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in ('pending', 'paid', 'failed', 'cancelled', 'refunded'));

-- ADMIN SETTINGS row (Settings module reuses page_content; seed an empty row so PUT can upsert).
insert into public.page_content (slug, data)
values ('admin-settings', '{}')
on conflict (slug) do nothing;
