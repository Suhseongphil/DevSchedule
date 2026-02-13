/** 캘린더 일정용 색상 팔레트 (배경, 테두리) - 등록/수정 폼과 캘린더에서 공용 */
export const SCHEDULE_COLORS = [
  { id: "0", bg: "#2563eb", border: "#1d4ed8", name: "파랑" },
  { id: "1", bg: "#059669", border: "#047857", name: "초록" },
  { id: "2", bg: "#7c3aed", border: "#6d28d9", name: "보라" },
  { id: "3", bg: "#d97706", border: "#b45309", name: "주황" },
  { id: "4", bg: "#dc2626", border: "#b91c1c", name: "빨강" },
  { id: "5", bg: "#0d9488", border: "#0f766e", name: "청록" },
  { id: "6", bg: "#ca8a04", border: "#a16207", name: "노랑" },
  { id: "7", bg: "#db2777", border: "#be185d", name: "분홍" },
] as const;

export type ScheduleColorId = (typeof SCHEDULE_COLORS)[number]["id"];

export function getScheduleColor(colorId: string | null): { bg: string; border: string } | null {
  if (colorId == null || colorId === "") return null;
  const found = SCHEDULE_COLORS.find((c) => c.id === colorId);
  return found ? { bg: found.bg, border: found.border } : null;
}
