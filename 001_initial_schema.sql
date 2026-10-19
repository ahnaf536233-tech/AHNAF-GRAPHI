-- AHNAF GRAPHI: প্রথমে পড়ে দেখুন, তারপর Supabase SQL Editor-এ চালান।
-- নতুন/ফাঁকা প্রজেক্টের জন্য। বিদ্যমান টেবিল থাকলে আগে স্কিমা দেখে নিন। এতে কোনো টেবিল DROP বা ডেটা DELETE নেই।
create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text, created_at timestamptz not null default now());
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;
drop policy if exists "own admin row" on public.admin_users;
create policy "own admin row" on public.admin_users for select to authenticated using (user_id = auth.uid());
-- insert/update/delete পলিসি ইচ্ছাকৃতভাবে নেই: ব্রাউজার থেকে কেউ নিজেকে অ্যাডমিন বানাতে পারবে না।

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid()); $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name_bn text not null check (char_length(name_bn) between 1 and 120),
  name_en text check (char_length(name_en) <= 120),
  desc_bn text check (char_length(desc_bn) <= 1000), desc_en text check (char_length(desc_en) <= 1000),
  price numeric(10,2) check (price >= 0), price_note text check (char_length(price_note) <= 200),
  published boolean not null default false, sort_order int not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title_bn text not null check (char_length(title_bn) between 1 and 120),
  title_en text check (char_length(title_en) <= 120), category text check (char_length(category) <= 60),
  image_path text check (char_length(image_path) <= 300),
  published boolean not null default false, sort_order int not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.site_settings (
  key text primary key check (key ~ '^[a-z0-9_.-]{1,60}$'),
  value jsonb not null default '""', is_public boolean not null default false,
  updated_at timestamptz not null default now());
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  contact text not null check (char_length(contact) between 5 and 100),
  service_id uuid references public.services(id) on delete set null, service_name text,
  requirements text not null check (char_length(requirements) between 5 and 2000),
  deadline date, reference_url text check (char_length(reference_url) <= 500),
  status text not null default 'Pending' check (status in ('Pending','In Progress','Completed','Cancelled')),
  created_at timestamptz not null default now());
create index if not exists orders_created_idx on public.orders (created_at desc);
create index if not exists orders_contact_idx on public.orders (contact, created_at desc);
create index if not exists services_pub_idx on public.services (published, sort_order);
create index if not exists projects_pub_idx on public.portfolio_projects (published, sort_order);

do $$ declare t text; begin
  foreach t in array array['services','portfolio_projects','site_settings'] loop
    execute format('drop trigger if exists trg_touch on public.%I', t);
    execute format('create trigger trg_touch before update on public.%I for each row execute function public.touch_updated_at()', t);
  end loop; end $$;

alter table public.services enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.site_settings enable row level security;
alter table public.orders enable row level security;
revoke all on public.services, public.portfolio_projects, public.site_settings, public.orders from anon, authenticated;
grant select on public.services, public.portfolio_projects, public.site_settings to anon, authenticated;
grant insert, update, delete on public.services, public.portfolio_projects, public.site_settings to authenticated;
grant select, update, delete on public.orders to authenticated; -- insert নেই: অর্ডার শুধু Edge Function দিয়ে

drop policy if exists "public read published" on public.services;
create policy "public read published" on public.services for select to anon, authenticated using (published);
drop policy if exists "admin all" on public.services;
create policy "admin all" on public.services for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "public read published" on public.portfolio_projects;
create policy "public read published" on public.portfolio_projects for select to anon, authenticated using (published);
drop policy if exists "admin all" on public.portfolio_projects;
create policy "admin all" on public.portfolio_projects for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "public read public settings" on public.site_settings;
create policy "public read public settings" on public.site_settings for select to anon, authenticated using (is_public);
drop policy if exists "admin all" on public.site_settings;
create policy "admin all" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin read" on public.orders;
create policy "admin read" on public.orders for select to authenticated using (public.is_admin());
drop policy if exists "admin update" on public.orders;
create policy "admin update" on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin delete" on public.orders;
create policy "admin delete" on public.orders for delete to authenticated using (public.is_admin());

-- স্টোরেজ: পাবলিক বাকেটে ছবি দেখা যায় (তালিকা করা যায় না); আপলোড/বদল/ডিলিট শুধু অ্যাডমিন
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio','portfolio',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
drop policy if exists "portfolio admin insert" on storage.objects;
create policy "portfolio admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio' and public.is_admin());
drop policy if exists "portfolio admin update" on storage.objects;
create policy "portfolio admin update" on storage.objects for update to authenticated using (bucket_id = 'portfolio' and public.is_admin()) with check (bucket_id = 'portfolio' and public.is_admin());
drop policy if exists "portfolio admin delete" on storage.objects;
create policy "portfolio admin delete" on storage.objects for delete to authenticated using (bucket_id = 'portfolio' and public.is_admin());
drop policy if exists "portfolio admin select" on storage.objects;
create policy "portfolio admin select" on storage.objects for select to authenticated using (bucket_id = 'portfolio' and public.is_admin());
