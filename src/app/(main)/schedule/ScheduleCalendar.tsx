"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { CalendarEvent } from "@/lib/calendar-utils";

const CalendarInner = dynamic(() => import("./CalendarInner"), { ssr: false });

const MIN_CALENDAR_HEIGHT = 400;

type Props = {
  events: CalendarEvent[];
  holidayDates?: Set<string>;
  holidayNames?: Record<string, string>;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
};

export function ScheduleCalendar({ events, holidayDates, holidayNames, onSelectSlot }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(MIN_CALENDAR_HEIGHT);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateHeight = () => {
      const h = el.offsetHeight;
      setHeight(h > 0 ? Math.max(h, MIN_CALENDAR_HEIGHT) : MIN_CALENDAR_HEIGHT);
    };
    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="relative flex h-full min-w-0 flex-col rounded-lg border border-border bg-card p-2">
      <div ref={containerRef} className="relative min-h-0 min-w-0 flex-1">
        <ScheduleCalendarInner
          events={events}
          holidayDates={holidayDates}
          holidayNames={holidayNames}
          onSelectSlot={onSelectSlot}
          height={height}
        />
      </div>
    </div>
  );
}

function ScheduleCalendarInner({
  events,
  holidayDates,
  holidayNames,
  onSelectSlot,
  height,
}: {
  events: CalendarEvent[];
  holidayDates?: Set<string>;
  holidayNames?: Record<string, string>;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
  height: number;
}) {
  return (
    <div className="h-full min-w-0 w-full overflow-x-hidden">
      <CalendarInner
        events={events}
        holidayDates={holidayDates ?? new Set()}
        holidayNames={holidayNames ?? {}}
        height={height}
        onSelectSlot={onSelectSlot}
      />
    </div>
  );
}
