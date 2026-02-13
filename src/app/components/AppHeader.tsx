"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";

const PAGE_TITLES: Record<string, string> = {
  "/schedule": "개발일정",
  "/schedule/list": "일정 목록",
  "/schedule/new": "일정등록",
  "/work-log": "업무일지",
  "/work-log/list": "일지목록",
};

export function AppHeader() {
  const pathname = usePathname();
  const title = pathname
    ? pathname.endsWith("/edit") && pathname.startsWith("/schedule/")
      ? "일정 수정"
      : PAGE_TITLES[pathname] ?? "DevSchedule"
    : "DevSchedule";

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
      <SidebarTrigger className="-ml-1" />
      <h1 className="text-base font-semibold text-foreground">
        {title}
      </h1>
    </header>
  );
}
