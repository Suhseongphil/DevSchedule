"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DevScheduleRow } from "@/types/database";
import {
  schedulesToCalendarEvents,
  getSchedulesForDate,
  type CalendarEvent,
} from "@/lib/calendar-utils";
import { ScheduleCalendar } from "./ScheduleCalendar";
import { SelectedDateScheduleList } from "./SelectedDateScheduleList";
import { SelectedDateWorkLogList } from "./SelectedDateWorkLogList";

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<DevScheduleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => new Date());

  const supabase = createClient();

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: e } = await supabase
      .from("dev_schedules")
      .select("*")
      .order("start_at", { ascending: true });
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

  const events: CalendarEvent[] = schedulesToCalendarEvents(schedules);
  const selectedDateSchedules = selectedDate
    ? getSchedulesForDate(schedules, selectedDate)
    : [];

  return (
    <div className="flex flex-col gap-4 p-4">
      {error && (
        <p className="shrink-0 text-sm text-destructive">{error}</p>
      )}

      {/* 캘린더: 뷰포트에 딱 맞춤 → 스크롤 없이 한 화면에만 보임 */}
      <div className="h-[calc(100vh-5.5rem)] min-h-[320px] shrink-0">
        {loading ? (
          <div className="flex h-full w-full items-center justify-center rounded-lg border border-border bg-card text-sm text-muted-foreground">
            로딩 중…
          </div>
        ) : (
          <ScheduleCalendar
            events={events}
            onSelectSlot={({ start }) => setSelectedDate(start)}
          />
        )}
      </div>

      {/* 하단 카드: 스크롤해야 보임 */}
      <div className="grid shrink-0 grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="min-h-[240px] overflow-hidden">
          <SelectedDateScheduleList
            date={selectedDate}
            schedules={selectedDateSchedules}
          />
        </div>
        <div className="min-h-[240px] overflow-hidden">
          <SelectedDateWorkLogList date={selectedDate} />
        </div>
      </div>
    </div>
  );
}
