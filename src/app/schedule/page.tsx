"use client";

import { useEffect, useState } from "react";
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
  const [holidayDates, setHolidayDates] = useState<Set<string>>(new Set());
  const [holidayNames, setHolidayNames] = useState<Record<string, string>>({});

  const supabase = createClient();

  useEffect(() => {
    setLoading(true);
    setError(null);

    const year = new Date().getFullYear();
    const schedulesPromise = supabase
      .from("dev_schedules")
      .select("*")
      .order("start_at", { ascending: true });
    const holidaysPromise = fetch(
      `/api/holidays-kr?year=${year}&yearEnd=${year + 1}`
    ).then((res) => res.json());

    Promise.allSettled([schedulesPromise, holidaysPromise]).then(
      ([schedulesResult, holidaysResult]) => {
        if (schedulesResult.status === "fulfilled") {
          const res = schedulesResult.value;
          if (res.error) {
            setError(res.error.message);
            setSchedules([]);
          } else {
            setSchedules(res.data ?? []);
          }
        } else {
          setError(schedulesResult.reason?.message ?? "일정 로딩 실패");
        }
        if (holidaysResult.status === "fulfilled") {
          const body = holidaysResult.value as {
            dates?: string[];
            nameByDate?: Record<string, string>;
          };
          const arr = Array.isArray(body?.dates) ? body.dates : [];
          setHolidayDates(new Set(arr));
          setHolidayNames(
            typeof body?.nameByDate === "object" && body.nameByDate
              ? body.nameByDate
              : {}
          );
        } else {
          setHolidayDates(new Set());
          setHolidayNames({});
        }
        setLoading(false);
      }
    );
  }, [supabase]);

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
            holidayDates={holidayDates}
            holidayNames={holidayNames}
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
