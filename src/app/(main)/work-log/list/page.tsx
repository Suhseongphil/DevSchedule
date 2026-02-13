"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { createClient } from "@/lib/supabase/client";
import type { WorkLogRow } from "@/types/database";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function WorkLogListPage() {
  const [logs, setLogs] = useState<WorkLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const supabase = createClient();

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: e } = await supabase
      .from("work_logs")
      .select("*")
      .order("log_date", { ascending: false });
    if (e) {
      setError(e.message);
      setLogs([]);
    } else {
      setLogs(data ?? []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("이 업무일지를 삭제할까요?")) return;
      setDeletingId(id);
      setError(null);
      const { error: e } = await supabase.from("work_logs").delete().eq("id", id);
      setDeletingId(null);
      if (e) {
        setError(e.message);
        return;
      }
      fetchLogs();
    },
    [supabase, fetchLogs]
  );

  return (
    <div className="w-full max-w-[1600px] px-3 py-3">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">일지목록</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            등록한 업무일지를 날짜순으로 확인할 수 있습니다.
          </p>
        </div>
        <Button asChild>
          <Link href="/work-log">업무일지 작성</Link>
        </Button>
      </div>

      {error && (
        <p className="mb-4 text-sm text-destructive">{error}</p>
      )}

      <Card className="border-border gap-0 py-0">
        <CardHeader className="px-3 py-2.5 pb-1.5">
          <CardTitle className="text-sm font-medium">전체 업무일지</CardTitle>
          <CardDescription>
            작성일 기준 최신순
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 py-2 pt-0">
          {loading ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              로딩 중…
            </p>
          ) : logs.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              등록된 업무일지가 없습니다.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {logs.map((log) => {
                const logDate = new Date(log.log_date + "T00:00:00");
                return (
                  <li
                    key={log.id}
                    className="flex flex-col gap-1 py-2.5 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        {format(logDate, "yyyy년 M월 d일 (EEE)", { locale: ko })}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
                        disabled={deletingId === log.id}
                        onClick={() => handleDelete(log.id)}
                      >
                        {deletingId === log.id ? "삭제 중…" : "삭제"}
                      </Button>
                    </div>
                    <div className="whitespace-pre-wrap rounded-lg border border-border bg-muted/40 px-2.5 py-2 text-sm text-foreground">
                      {log.content}
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
