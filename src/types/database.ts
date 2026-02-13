export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/** 개발일정 (캘린더) */
export interface DevScheduleRow {
  id: string;
  title: string;
  start_at: string; // ISO datetime
  end_at: string;
  content: string | null;
  delayed_end_at: string | null; // 지연 시 종료일
  color: string | null; // 캘린더 표시 색상 (팔레트 id "0"~"7", null이면 자동)
  created_at: string;
  updated_at: string;
}

/** 업무일지 */
export interface WorkLogRow {
  id: string;
  log_date: string; // YYYY-MM-DD
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      dev_schedules: {
        Row: DevScheduleRow;
        Insert: Omit<DevScheduleRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Omit<DevScheduleRow, "id" | "created_at" | "updated_at">
        > & { updated_at?: string };
      };
      work_logs: {
        Row: WorkLogRow;
        Insert: Omit<WorkLogRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Omit<WorkLogRow, "id" | "created_at" | "updated_at">
        > & { updated_at?: string };
      };
    };
  };
}
