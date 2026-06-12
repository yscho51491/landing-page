-- ============================================================
-- 아트랩 코인 (기존 DB에 추가할 때만 실행)
-- Supabase SQL Editor에 붙여넣고 Run
-- ============================================================

alter table public.profiles
  add column if not exists coins integer not null default 0 check (coins >= 0);

create table if not exists public.coin_signup_grants (
  email text primary key,
  granted_at timestamptz not null default now()
);

alter table public.coin_signup_grants enable row level security;

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

-- 기존 가입자 1회 보너스 (이메일이 처음 등록되는 경우만)
insert into public.coin_signup_grants (email)
select distinct lower(trim(email))
from auth.users
where email is not null and trim(email) <> ''
on conflict (email) do nothing;

update public.profiles p
set coins = 3
from auth.users u
where p.id = u.id
  and p.coins = 0
  and lower(trim(u.email)) in (select email from public.coin_signup_grants);

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
