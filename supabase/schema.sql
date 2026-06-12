-- ============================================================
-- 아트티쳐랩: 유저 수업 공개 기능 스키마
-- Supabase 대시보드 → SQL Editor에 붙여넣고 Run 하세요.
-- ============================================================

-- 0. profiles 테이블 재생성
-- (Table Editor 기본값으로 만들면 id가 bigint라서 auth.users(uuid)와
--  연결되지 않습니다. uuid 기반으로 다시 만듭니다.)
drop table if exists public.profiles cascade;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'paid')),
  coins integer not null default 0 check (coins >= 0),
  created_at timestamptz not null default now()
);

-- 가입 보너스 코인 지급 이력 (이메일 기준, 탈퇴 후 재가입 차단)
create table if not exists public.coin_signup_grants (
  email text primary key,
  granted_at timestamptz not null default now()
);

alter table public.coin_signup_grants enable row level security;

-- 1. 신규 가입자 → profiles 자동 생성 트리거
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  normalized_email text;
  initial_coins integer := 0;
begin
  normalized_email := lower(trim(coalesce(new.email, '')));

  if normalized_email <> '' then
    begin
      insert into public.coin_signup_grants (email)
      values (normalized_email);
      initial_coins := 3;
    exception
      when unique_violation then
        initial_coins := 0;
    end;
  end if;

  insert into public.profiles (id, plan, coins)
  values (new.id, 'free', initial_coins)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 기존 가입자 백필 (최초 1회 가입 보너스 3코인)
insert into public.coin_signup_grants (email)
select distinct lower(trim(email))
from auth.users
where email is not null and trim(email) <> ''
on conflict (email) do nothing;

insert into public.profiles (id, plan, coins)
select u.id, 'free', case when g.email is not null then 3 else 0 end
from auth.users u
left join public.coin_signup_grants g
  on g.email = lower(trim(u.email))
on conflict (id) do update
  set coins = case
    when public.profiles.coins = 0 and excluded.coins > 0 then excluded.coins
    else public.profiles.coins
  end;

-- profiles RLS
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- 코인 차감·환불 (서버 RPC 전용)
create or replace function public.spend_artlab_coins(amount integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_balance integer;
begin
  if amount is null or amount <= 0 then
    raise exception 'INVALID_AMOUNT';
  end if;

  update public.profiles
  set coins = coins - amount
  where id = auth.uid() and coins >= amount
  returning coins into new_balance;

  if not found then
    raise exception 'INSUFFICIENT_COINS';
  end if;

  return new_balance;
end;
$$;

create or replace function public.refund_artlab_coins(amount integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_balance integer;
begin
  if amount is null or amount <= 0 then
    raise exception 'INVALID_AMOUNT';
  end if;

  update public.profiles
  set coins = coins + amount
  where id = auth.uid()
  returning coins into new_balance;

  if not found then
    raise exception 'PROFILE_NOT_FOUND';
  end if;

  return new_balance;
end;
$$;

grant execute on function public.spend_artlab_coins(integer) to authenticated;
grant execute on function public.refund_artlab_coins(integer) to authenticated;

-- 2. 공개 수업 테이블
create table if not exists public.published_lessons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  audience text not null default '',
  idea text not null default '',
  materials text[] not null default '{}',
  cover_image_url text not null,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

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

-- 3. 커버 이미지 Storage 버킷 (public)
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
