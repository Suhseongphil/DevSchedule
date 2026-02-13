"use client";

import { usePathname, useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  "/schedule": "개발일정",
  "/schedule/list": "일정 목록",
  "/schedule/new": "일정등록",
  "/work-log": "업무일지",
  "/work-log/list": "일지목록",
};

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const title = pathname
    ? pathname.endsWith("/edit") && pathname.startsWith("/schedule/")
      ? "일정 수정"
      : PAGE_TITLES[pathname] ?? "DevSchedule"
    : "DevSchedule";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-base font-semibold text-foreground">
          {title}
        </h1>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleLogout}
        title="로그아웃"
      >
        <LogOut className="size-4" />
      </Button>
    </header>
  );
}
