-- ============================================================
-- 추천인 ID (이메일) 보너스 — 신규 가입 시 추천인·피추천인 각 5코인
-- Supabase SQL Editor에 붙여넣고 Run
-- ============================================================

create table if not exists public.referral_claims (
  new_user_id uuid primary key references auth.users (id) on delete cascade,
  referrer_user_id uuid not null references auth.users (id) on delete cascade,
  referrer_email text not null,
  claimed_at timestamptz not null default now()
);

create index if not exists referral_claims_referrer_idx
  on public.referral_claims (referrer_user_id);

alter table public.referral_claims enable row level security;

drop policy if exists "referral_claims_select_own" on public.referral_claims;
create policy "referral_claims_select_own"
  on public.referral_claims for select
  using (auth.uid() = new_user_id or auth.uid() = referrer_user_id);

create or replace function public.claim_referral_bonus(p_referrer_email text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_user_email text;
  v_referrer_email text;
  v_referrer_id uuid;
  v_created_at timestamptz;
  v_new_balance integer;
begin
  if v_user_id is null then
    raise exception 'UNAUTHORIZED';
  end if;

  v_referrer_email := lower(trim(coalesce(p_referrer_email, '')));
  if v_referrer_email = '' or position('@' in v_referrer_email) = 0 then
    raise exception 'INVALID_EMAIL';
  end if;

  select lower(trim(coalesce(email, '')))
  into v_user_email
  from auth.users
  where id = v_user_id;

  if v_user_email = v_referrer_email then
    raise exception 'SELF_REFERRAL';
  end if;

  select id
  into v_referrer_id
  from auth.users
  where lower(trim(coalesce(email, ''))) = v_referrer_email;

  if v_referrer_id is null then
    raise exception 'REFERRER_NOT_FOUND';
  end if;

  if exists (
    select 1 from public.referral_claims where new_user_id = v_user_id
  ) then
    raise exception 'ALREADY_CLAIMED';
  end if;

  select created_at
  into v_created_at
  from public.profiles
  where id = v_user_id;

  -- 가입 후 24시간 이내에만 추천인 보너스 신청 가능
  if v_created_at is null or v_created_at < now() - interval '24 hours' then
    raise exception 'NOT_NEW_USER';
  end if;

  insert into public.referral_claims (new_user_id, referrer_user_id, referrer_email)
  values (v_user_id, v_referrer_id, v_referrer_email);

  update public.profiles
  set coins = coins + 5
  where id = v_user_id
  returning coins into v_new_balance;

  update public.profiles
  set coins = coins + 5
  where id = v_referrer_id;

  return jsonb_build_object('ok', true, 'coins', v_new_balance);
end;
$$;

grant execute on function public.claim_referral_bonus(text) to authenticated;
