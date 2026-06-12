-- ============================================================
-- 마이페이지: 사용자별 실험실 수업·완성작 저장
-- Supabase SQL Editor에 붙여넣고 Run
-- ============================================================

create table if not exists public.user_lab_lessons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  word1 text not null,
  word2 text not null,
  lesson_detail jsonb not null,
  cover_image_url text,
  created_at timestamptz not null default now()
);

create index if not exists user_lab_lessons_user_created_idx
  on public.user_lab_lessons (user_id, created_at desc);

alter table public.user_lab_lessons enable row level security;

drop policy if exists "user_lab_lessons_select_own" on public.user_lab_lessons;
create policy "user_lab_lessons_select_own"
  on public.user_lab_lessons for select
  using (auth.uid() = user_id);

drop policy if exists "user_lab_lessons_insert_own" on public.user_lab_lessons;
create policy "user_lab_lessons_insert_own"
  on public.user_lab_lessons for insert
  with check (auth.uid() = user_id);

drop policy if exists "user_lab_lessons_update_own" on public.user_lab_lessons;
create policy "user_lab_lessons_update_own"
  on public.user_lab_lessons for update
  using (auth.uid() = user_id);

-- 기존 published_lessons(lab) 데이터를 마이페이지에도 보이게 백필
insert into public.user_lab_lessons (user_id, word1, word2, lesson_detail, cover_image_url, created_at)
select
  p.user_id,
  trim(split_part(p.audience, '×', 1)),
  trim(split_part(p.audience, '×', 2)),
  p.lesson_detail,
  p.cover_image_url,
  p.created_at
from public.published_lessons p
where p.source = 'lab'
  and p.lesson_detail is not null
  and not exists (
    select 1
    from public.user_lab_lessons u
    where u.user_id = p.user_id
      and u.cover_image_url = p.cover_image_url
      and u.created_at = p.created_at
  );
