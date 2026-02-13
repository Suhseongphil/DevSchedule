"use client";

import { useRouter } from "next/navigation";
import { ScheduleForm } from "../ScheduleForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ScheduleNewPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-foreground">일정등록</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          개발 일정을 등록하면 캘린더에 표시됩니다.
        </p>
      </div>
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">새 일정</CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduleForm
            onSuccess={() => {
              router.push("/schedule/list");
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
