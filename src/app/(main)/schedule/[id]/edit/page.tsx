"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { DevScheduleRow } from "@/types/database";
import { ScheduleForm } from "../../ScheduleForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ScheduleEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : null;
  const [schedule, setSchedule] = useState<DevScheduleRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchSchedule = useCallback(async () => {
    if (!id) {
      setLoading(false);
      setError("일정 ID가 없습니다.");
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: e } = await supabase
      .from("dev_schedules")
      .select("*")
      .eq("id", id)
      .single();
    setLoading(false);
    if (e) {
      setError(e.message);
      setSchedule(null);
      return;
    }
    setSchedule(data);
  }, [id, supabase]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const handleSuccess = () => {
    router.push("/schedule/list");
  };

  if (!id) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <p className="text-sm text-destructive">잘못된 경로입니다.</p>
        <Button variant="link" asChild className="mt-2 p-0">
          <Link href="/schedule/list">일정 목록으로</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <p className="text-center text-sm text-muted-foreground">로딩 중…</p>
      </div>
    );
  }

  if (error || !schedule) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <p className="text-sm text-destructive">
          {error ?? "일정을 찾을 수 없습니다."}
        </p>
        <Button variant="link" asChild className="mt-2 p-0">
          <Link href="/schedule/list">일정 목록으로</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">일정 수정</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          지연된 경우 지연 종료일시를 입력하면 캘린더에 반영됩니다.
        </p>
      </div>
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{schedule.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduleForm
            onSuccess={handleSuccess}
            initialSchedule={schedule}
          />
        </CardContent>
      </Card>
      <div className="mt-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/schedule/list">목록으로 돌아가기</Link>
        </Button>
      </div>
    </div>
  );
}
