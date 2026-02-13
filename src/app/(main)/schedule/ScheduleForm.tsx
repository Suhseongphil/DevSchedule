"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { DevScheduleRow } from "@/types/database";
import { SCHEDULE_COLORS } from "@/lib/schedule-colors";

function toDateOnly(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

type Props = {
  onSuccess: () => void;
  initialSchedule?: DevScheduleRow | null;
};

export function ScheduleForm({ onSuccess, initialSchedule }: Props) {
  const [title, setTitle] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [content, setContent] = useState("");
  const [delayedEndAt, setDelayedEndAt] = useState("");
  const [color, setColor] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const supabase = createClient();
  const isEdit = Boolean(initialSchedule?.id);

  useEffect(() => {
    if (initialSchedule) {
      setTitle(initialSchedule.title);
      setStartAt(toDateOnly(initialSchedule.start_at));
      setEndAt(toDateOnly(initialSchedule.end_at));
      setContent(initialSchedule.content ?? "");
      setDelayedEndAt(toDateOnly(initialSchedule.delayed_end_at));
      setColor(initialSchedule.color ?? "");
    }
  }, [initialSchedule]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startAt || !endAt) {
      setMessage({ type: "error", text: "제목, 시작일, 종료일을 입력하세요." });
      return;
    }
    const start = new Date(startAt + "T00:00:00");
    const end = new Date(endAt + "T23:59:59.999");
    if (end < start) {
      setMessage({ type: "error", text: "종료일은 시작일 이후여야 합니다." });
      return;
    }
    setSubmitting(true);
    setMessage(null);

    const payload = {
      title: title.trim(),
      start_at: start.toISOString(),
      end_at: end.toISOString(),
      content: content.trim() || null,
      delayed_end_at: delayedEndAt ? new Date(delayedEndAt + "T23:59:59.999").toISOString() : null,
      color: color.trim() || null,
    };

    const { error } = isEdit && initialSchedule
      ? await supabase
          .from("dev_schedules")
          .update(payload)
          .eq("id", initialSchedule.id)
      : await supabase.from("dev_schedules").insert(payload);

    setSubmitting(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }
    setMessage({ type: "ok", text: isEdit ? "수정되었습니다." : "등록되었습니다." });
    if (!isEdit) {
      setTitle("");
      setStartAt("");
      setEndAt("");
      setContent("");
      setDelayedEndAt("");
      setColor("");
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2 space-y-2">
          <label className="text-sm font-medium text-muted-foreground">제목</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: API 개발"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">시작일</label>
          <Input
            type="date"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">종료일</label>
          <Input
            type="date"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2 space-y-2">
          <label className="text-sm font-medium text-muted-foreground">내용 (선택)</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
            placeholder="상세 내용"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">지연 종료일 (선택)</label>
          <Input
            type="date"
            value={delayedEndAt}
            onChange={(e) => setDelayedEndAt(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            일정이 지연된 경우, 실제 완료(예정)일을 넣으면 캘린더에 지연 구간으로 표시됩니다.
          </p>
        </div>
        <div className="sm:col-span-2 space-y-2">
          <label className="text-sm font-medium text-muted-foreground">캘린더 색상 (선택)</label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setColor("")}
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs ${
                color === ""
                  ? "border-foreground ring-2 ring-offset-2 ring-offset-background ring-foreground"
                  : "border-border bg-muted hover:bg-muted/80"
              }`}
              title="자동"
            >
              ?
            </button>
            {SCHEDULE_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setColor(c.id)}
                className={`h-8 w-8 shrink-0 rounded-full border-2 transition-opacity hover:opacity-90 ${
                  color === c.id ? "ring-2 ring-offset-2 ring-offset-background ring-foreground" : "border-border"
                }`}
                style={{ backgroundColor: c.bg, borderColor: color === c.id ? c.border : "transparent" }}
                title={c.name}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            선택하지 않으면 자동으로 색이 지정됩니다.
          </p>
        </div>
      </div>
      {message && (
        <p
          className={`mt-3 text-sm ${
            message.type === "ok" ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
          }`}
        >
          {message.text}
        </p>
      )}
      <Button type="submit" disabled={submitting} className="mt-4">
        {submitting
          ? isEdit
            ? "수정 중…"
            : "등록 중…"
          : isEdit
            ? "수정"
            : "등록"}
      </Button>
    </form>
  );
}
