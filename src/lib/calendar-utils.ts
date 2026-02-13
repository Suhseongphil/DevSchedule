import type { DevScheduleRow } from "@/types/database";

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: {
    type: "planned" | "delayed";
    schedule: DevScheduleRow;
  };
};

/** DB 개발일정 목록을 React Big Calendar 이벤트로 변환. 지연 구간은 별도 이벤트로 표시 */
export function schedulesToCalendarEvents(rows: DevScheduleRow[]): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  for (const row of rows) {
    const start = new Date(row.start_at);
    const end = new Date(row.end_at);

    events.push({
      id: `${row.id}-planned`,
      title: row.title,
      start,
      end,
      resource: { type: "planned", schedule: row },
    });

    if (row.delayed_end_at) {
      const delayedEnd = new Date(row.delayed_end_at);
      if (delayedEnd > end) {
        events.push({
          id: `${row.id}-delayed`,
          title: `${row.title} (지연)`,
          start: end,
          end: delayedEnd,
          resource: { type: "delayed", schedule: row },
        });
      }
    }
  }

  return events;
}

/** 특정 날짜에 해당하는 일정(원본 스케줄)만 필터. 하루 전체 구간과 겹치는 것 포함 */
export function getSchedulesForDate(
  rows: DevScheduleRow[],
  date: Date
): DevScheduleRow[] {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  return rows.filter((row) => {
    const start = new Date(row.start_at);
    const end = row.delayed_end_at
      ? new Date(row.delayed_end_at)
      : new Date(row.end_at);
    return start <= dayEnd && end >= dayStart;
  });
}
