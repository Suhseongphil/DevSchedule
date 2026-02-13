"use client";

import { useState, useCallback } from "react";
import { Calendar, dateFnsLocalizer, type View } from "react-big-calendar";
import { format, startOfWeek, getDay } from "date-fns";
import { ko } from "date-fns/locale";
import type { CalendarEvent } from "@/lib/calendar-utils";
import { getScheduleColor, SCHEDULE_COLORS } from "@/lib/schedule-colors";

/** 일정 ID로 항상 같은 색이 나오도록 인덱스 계산 (색 미지정 시 사용) */
function getColorIndex(scheduleId: string): number {
  let n = 0;
  for (let i = 0; i < scheduleId.length; i++) n = (n * 31 + scheduleId.charCodeAt(i)) >>> 0;
  return n;
}

const localizer = dateFnsLocalizer({
  format,
  parse: (s: string) => new Date(s),
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0, locale: ko }),
  getDay,
  locales: { ko },
});

type Props = {
  events: CalendarEvent[];
  height: number;
  holidayDates: Set<string>;
  holidayNames: Record<string, string>;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
};

export default function CalendarInner({ events, height, holidayDates, holidayNames, onSelectSlot }: Props) {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>("month");

  const onNavigate = useCallback((newDate: Date) => {
    setDate(newDate);
  }, []);

  const onView = useCallback((newView: View) => {
    setView(newView);
  }, []);

  const HolidayDateHeader = useCallback(
    ({ date: cellDate, label, drilldownView, onDrillDown }: { date: Date; label: string; drilldownView?: string; onDrillDown?: (e: React.MouseEvent) => void }) => {
      const key = format(cellDate, "yyyy-MM-dd");
      const isHoliday = holidayDates.has(key);
      const name = holidayNames[key];
      const content =
        drilldownView != null && onDrillDown ? (
          <button type="button" className="rbc-button-link" onClick={onDrillDown}>
            {label}
          </button>
        ) : (
          <span>{label}</span>
        );
      if (!isHoliday) return content;
      return (
        <span className="rbc-date-cell-holiday" title={name ?? undefined}>
          {content}
          {name && (
            <span className="rbc-date-cell-holiday-name" aria-hidden>
              {name}
            </span>
          )}
        </span>
      );
    },
    [holidayDates, holidayNames]
  );

  return (
    <Calendar
      key={`cal-${date.getFullYear()}-${date.getMonth()}`}
      components={{
        month: { dateHeader: HolidayDateHeader },
      }}
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      titleAccessor="title"
      style={{ height }}
      views={["month", "agenda"]}
      view={view}
      date={date}
      onNavigate={onNavigate}
      onView={onView}
      selectable
      onSelectSlot={onSelectSlot}
      messages={{
        next: "다음",
        previous: "이전",
        today: "오늘",
        month: "월",
        agenda: "목록",
        date: "날짜",
        event: "일정",
        noEventsInRange: "이 기간에 일정이 없습니다.",
      }}
      eventPropGetter={(event: CalendarEvent) => {
        if (event.resource?.type === "delayed") {
          return { className: "delayed-event" };
        }
        const schedule = event.resource?.schedule;
        const custom = schedule ? getScheduleColor(schedule.color) : null;
        const { bg, border } =
          custom ??
          (() => {
            const scheduleId = schedule?.id ?? event.id;
            const idx = getColorIndex(scheduleId) % SCHEDULE_COLORS.length;
            return SCHEDULE_COLORS[idx];
          })();
        return {
          style: {
            backgroundColor: bg,
            borderColor: border,
            color: "#fff",
          },
        };
      }}
    />
  );
}
