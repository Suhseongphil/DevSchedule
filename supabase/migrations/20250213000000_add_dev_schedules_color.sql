-- 일정 캘린더 색상 지정용 컬럼 (0~7: 팔레트 인덱스, null: 자동)
alter table public.dev_schedules
  add column if not exists color text;
