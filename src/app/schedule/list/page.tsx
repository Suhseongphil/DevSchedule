"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { createClient } from "@/lib/supabase/client";
import type { DevScheduleRow } from "@/types/database";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ScheduleListPage() {
  const [schedules, setSchedules] = useState<DevScheduleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const supabase = createClient();

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: e } = await supabase
      .from("dev_schedules")
      .select("*")
      .order("start_at", { ascending: false });
    if (e) {
      setError(e.message);
      setSchedules([]);
    } else {
      setSchedules(data ?? []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleDelete = useCallback(
    async (id: string, title: string) => {
      if (!confirm(`"${title}" 일정을 삭제할까요?`)) return;
      setDeletingId(id);
      setError(null);
      const { error: e } = await supabase.from("dev_schedules").delete().eq("id", id);
      setDeletingId(null);
      if (e) {
        setError(e.message);
        return;
      }
      fetchSchedules();
    },
    [supabase, fetchSchedules]
  );

  return (
    <div className="w-full max-w-[1600px] px-3 py-3">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">일정 목록</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            등록된 일정을 확인하고 수정할 수 있습니다.
          </p>
        </div>
        <Button asChild>
          <Link href="/schedule/new">일정등록</Link>
        </Button>
      </div>

      {error && (
        <p className="mb-4 text-sm text-destructive">{error}</p>
      )}

      <Card className="border-border gap-0 py-0">
        <CardHeader className="px-3 py-2.5 pb-1.5">
          <CardTitle className="text-sm font-medium">전체 일정</CardTitle>
          <CardDescription>
            시작일 기준 최신순
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 py-2 pt-0">
          {loading ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              로딩 중…
            </p>
          ) : schedules.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              등록된 일정이 없습니다.
            </p>
          ) : (
            <ul className="divide-y divide-border">
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
                    className="flex flex-col gap-1 py-2.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{s.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {format(start, "yyyy.MM.dd (EEE) HH:mm", { locale: ko })}{" "}
                        ~ {format(endDisplay, "MM.dd HH:mm", { locale: ko })}
                        {hasDelay && (
                          <span className="ml-1 text-red-500 dark:text-red-400">
                            지연
                          </span>
                        )}
                      </p>
                      {s.content && (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {s.content}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs" asChild>
                        <Link href={`/schedule/${s.id}/edit`}>수정</Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                        disabled={deletingId === s.id}
                        onClick={() => handleDelete(s.id, s.title)}
                      >
                        {deletingId === s.id ? "삭제 중…" : "삭제"}
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
