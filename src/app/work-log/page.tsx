"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { WorkLogRow } from "@/types/database";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function WorkLogPage() {
  const [logs, setLogs] = useState<WorkLogRow[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => new Date());
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;

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

  const logsByDate = logs.reduce<Record<string, WorkLogRow[]>>((acc, log) => {
    const d = log.log_date;
    if (!acc[d]) acc[d] = [];
    acc[d].push(log);
    return acc;
  }, {});

  const selectedLogs = selectedDateStr ? logsByDate[selectedDateStr] ?? [] : [];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !selectedDateStr) return;
    setSaving(true);
    setError(null);
    const { error: e2 } = await supabase.from("work_logs").insert({
      log_date: selectedDateStr,
      content: content.trim(),
    });
    setSaving(false);
    if (e2) {
      setError(e2.message);
      return;
    }
    setContent("");
    fetchLogs();
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-foreground">
            업무 일지
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            날짜를 선택하고 해당 날짜의 업무를 기록하세요.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">날짜 선택</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-lg border-0"
              />
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="space-y-1">
              <CardTitle className="text-sm font-medium">
                {selectedDate
                  ? format(selectedDate, "yyyy년 M월 d일 (EEE)", { locale: ko })
                  : "날짜를 선택하세요"}
              </CardTitle>
              <CardDescription className="text-xs">
                선택한 날짜의 업무를 자유롭게 입력하고 저장하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="work-log-content" className="text-sm font-medium text-muted-foreground">
                    오늘 한 업무
                  </label>
                  <Textarea
                    id="work-log-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="업무 내용을 입력하세요."
                    rows={5}
                    className="min-h-28 resize-none"
                  />
                </div>
                <Button type="submit" disabled={saving || !content.trim() || !selectedDateStr}>
                  {saving ? "저장 중…" : "저장"}
                </Button>
              </form>

              <div className="border-t border-border pt-6">
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                  이 날짜의 기록
                </h3>
                {loading ? (
                  <p className="text-sm text-muted-foreground">로딩 중…</p>
                ) : selectedLogs.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                    이 날짜에 기록된 업무가 없습니다.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {selectedLogs.map((log) => (
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
