-- 실험실 완성작 미리보기 → 메인 그리드 공개용 컬럼 추가
-- Supabase SQL Editor에서 실행

alter table public.published_lessons
  add column if not exists lesson_detail jsonb;

alter table public.published_lessons
  add column if not exists source text not null default 'studio'
  check (source in ('studio', 'lab'));
