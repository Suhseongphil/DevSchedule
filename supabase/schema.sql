-- 개발일정 캘린더용 테이블
-- Supabase 대시보드 > SQL Editor에서 실행

create table if not exists public.dev_schedules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  content text,
  delayed_end_at timestamptz,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 업무일지 테이블
create table if not exists public.work_logs (
  id uuid primary key default gen_random_uuid(),
  log_date date not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at 자동 갱신 (선택)
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists dev_schedules_updated_at on public.dev_schedules;
create trigger dev_schedules_updated_at
  before update on public.dev_schedules
  for each row execute function public.set_updated_at();

drop trigger if exists work_logs_updated_at on public.work_logs;
create trigger work_logs_updated_at
  before update on public.work_logs
  for each row execute function public.set_updated_at();

-- RLS: 개인용이므로 anon 키로 접근 허용 (필요 시 나중에 auth 적용)
alter table public.dev_schedules enable row level security;
alter table public.work_logs enable row level security;

create policy "Allow all for dev_schedules" on public.dev_schedules
  for all using (true) with check (true);

create policy "Allow all for work_logs" on public.work_logs
  for all using (true) with check (true);

-- 접속용 로그인 유저 테이블 (회원가입 없음, DB 직접 입력)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password text not null,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Allow select for login" on public.users
  for select using (true);
