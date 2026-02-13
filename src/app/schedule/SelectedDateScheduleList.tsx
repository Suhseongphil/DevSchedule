"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { DevScheduleRow } from "@/types/database";
import { Button } from "@/components/ui/button";

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
              const start = new Date(s.start_at);
              const end = new Date(s.end_at);
              const hasDelay = s.delayed_end_at != null;
              const endDisplay = hasDelay
                ? new Date(s.delayed_end_at!)
                : end;
              return (
                <li
                  key={s.id}
                  className="rounded-lg border border-border bg-muted/40 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-foreground">
                        {s.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {format(start, "HH:mm")} ~ {format(endDisplay, "HH:mm")}
                        {hasDelay && (
                          <span className="ml-1 text-red-500 dark:text-red-400">
                            (지연)
                          </span>
                        )}
                      </p>
                      {s.content && (
                        <p className="mt-1.5 whitespace-pre-wrap text-xs text-muted-foreground">
                          {s.content}
                        </p>
                      )}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        asChild
                      >
                        <Link href={`/schedule/${s.id}/edit`}>수정</Link>
                      </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
