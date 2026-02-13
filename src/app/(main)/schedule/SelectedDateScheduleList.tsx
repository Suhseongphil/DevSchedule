"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { DevScheduleRow } from "@/types/database";

type Props = {
  date: Date | null;
  schedules: DevScheduleRow[];
};

export function SelectedDateScheduleList({ date, schedules }: Props) {
  if (!date) {
    return (
      <div className="flex h-full min-h-[200px] flex-col rounded-lg border border-border bg-card px-4 py-5">
        <p className="text-center text-sm text-muted-foreground">
          캘린더에서 날짜를 클릭하면 해당 날짜의 일정이 여기에 표시됩니다.
        </p>
      </div>
    );
  }

  const dateStr = format(date, "yyyy년 M월 d일 (EEE)", { locale: ko });

  return (
    <div className="flex h-full min-h-[200px] flex-col rounded-lg border border-border bg-card">
      <div className="shrink-0 border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">
          {dateStr} 일정
        </h3>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {schedules.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            이 날짜에 등록된 일정이 없습니다.
          </p>
        ) : (
          <ul className="space-y-2">
            {schedules.map((s) => {
              const hasDelay = s.delayed_end_at != null;
              return (
                <li
                  key={s.id}
                  className="rounded-lg border border-border bg-muted/40 p-3"
                >
                  <p className="font-medium text-sm text-foreground">
                    {s.title}
                    {hasDelay && (
                      <span className="ml-1.5 text-xs text-red-500 dark:text-red-400">
                        (지연)
                      </span>
                    )}
                  </p>
                  {s.content && (
                    <p className="mt-1.5 whitespace-pre-wrap text-xs text-muted-foreground">
                      {s.content}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
