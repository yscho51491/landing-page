-- ============================================================
-- 홈 화면 공개 수업 (published_lessons + lesson-covers 버킷)
-- 실험실 완성작 미리보기가 메인에 나오려면 이 SQL을 실행하세요.
-- Supabase SQL Editor에 붙여넣고 Run
-- ============================================================

create table if not exists public.published_lessons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  audience text not null default '',
  idea text not null default '',
  materials text[] not null default '{}',
  cover_image_url text not null,
  lesson_detail jsonb,
  source text not null default 'studio' check (source in ('studio', 'lab')),
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.published_lessons
  add column if not exists lesson_detail jsonb;

alter table public.published_lessons
  add column if not exists source text not null default 'studio'
  check (source in ('studio', 'lab'));

alter table public.published_lessons enable row level security;

drop policy if exists "published_lessons_select" on public.published_lessons;
create policy "published_lessons_select"
  on public.published_lessons for select
  using (is_public = true or auth.uid() = user_id);

drop policy if exists "published_lessons_insert_own" on public.published_lessons;
create policy "published_lessons_insert_own"
  on public.published_lessons for insert
  with check (auth.uid() = user_id);

drop policy if exists "published_lessons_update_own" on public.published_lessons;
create policy "published_lessons_update_own"
  on public.published_lessons for update
  using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('lesson-covers', 'lesson-covers', true)
on conflict (id) do nothing;

drop policy if exists "lesson_covers_insert_own" on storage.objects;
create policy "lesson_covers_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'lesson-covers'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "lesson_covers_read" on storage.objects;
create policy "lesson_covers_read"
  on storage.objects for select
  using (bucket_id = 'lesson-covers');
