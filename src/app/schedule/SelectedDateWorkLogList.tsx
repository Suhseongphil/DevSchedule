"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { WorkLogRow } from "@/types/database";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

type Props = {
  date: Date | null;
};

export function SelectedDateWorkLogList({ date }: Props) {
  const [logs, setLogs] = useState<WorkLogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const fetchLogs = useCallback(async () => {
    if (!date) {
      setLogs([]);
      return;
    }
    setLoading(true);
    const dateStr = format(date, "yyyy-MM-dd");
    const { data, error } = await supabase
      .from("work_logs")
      .select("*")
      .eq("log_date", dateStr)
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      setLogs([]);
      return;
    }
    setLogs(data ?? []);
  }, [date, supabase]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  if (!date) {
    return (
      <div className="flex h-full min-h-[200px] flex-col rounded-lg border border-border bg-card px-4 py-5">
        <p className="text-center text-sm text-muted-foreground">
          캘린더에서 날짜를 클릭하면 해당 날짜의 업무일지가 여기에 표시됩니다.
        </p>
      </div>
    );
  }

  const dateStr = format(date, "yyyy년 M월 d일 (EEE)", { locale: ko });

  return (
    <div className="flex h-full min-h-[200px] flex-col rounded-lg border border-border bg-card">
      <div className="shrink-0 border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">
          {dateStr} 업무일지
        </h3>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">로딩 중…</p>
        ) : logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            이 날짜에 기록된 업무일지가 없습니다.
          </p>
        ) : (
          <ul className="space-y-3">
            {logs.map((log) => (
              <li
                key={log.id}
                className="whitespace-pre-wrap rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-foreground"
              >
                {log.content}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
