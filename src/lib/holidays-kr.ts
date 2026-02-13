import { holidays as fetchHolidays } from "@kyungseopk1m/holidays-kr";

/** YYYYMMDD 숫자를 "YYYY-MM-DD" 문자열로 변환 */
function toDateKey(n: number): string {
  const s = String(n);
  if (s.length !== 8) return "";
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

function addDateToSet(set: Set<string>, raw: unknown): void {
  if (raw == null) return;
  if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    set.add(raw);
    return;
  }
  const n = typeof raw === "number" ? raw : parseInt(String(raw).replace(/-/g, ""), 10);
  if (!Number.isNaN(n) && n >= 20040101) {
    const key = toDateKey(n);
    if (key) set.add(key);
  }
}

/** res.data를 배열로 정규화 (배열이거나 월별 객체인 경우) */
function normalizeData(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const out: Record<string, unknown>[] = [];
    for (const v of Object.values(data)) {
      if (Array.isArray(v)) out.push(...v);
      else if (v && typeof v === "object") out.push(v as Record<string, unknown>);
    }
    return out;
  }
  return [];
}

export type HolidayEntry = { dates: string[]; nameByDate: Record<string, string> };

/**
 * 해당 연도(들)의 한국 공휴일 날짜 Set + 날짜별 이름 맵 반환.
 * @kyungseopk1m/holidays-kr 사용 (한국천문연구원 데이터, MIT)
 */
export async function getHolidayDateSet(
  year: number,
  yearEnd?: number
): Promise<Set<string>> {
  const { dates } = await getHolidayEntries(year, yearEnd);
  return new Set(dates);
}

/**
 * 해당 연도(들)의 한국 공휴일 목록 + 날짜별 이름 반환 (공휴일 이름 표기용).
 */
export async function getHolidayEntries(
  year: number,
  yearEnd?: number
): Promise<HolidayEntry> {
  const dateSet = new Set<string>();
  const nameByDate: Record<string, string> = {};
  const end = yearEnd ?? year;

  for (let y = year; y <= end; y++) {
    const res = await fetchHolidays(String(y));
    if (!res?.success || res.data == null) continue;
    const list = normalizeData(res.data);
    for (const item of list) {
      if (!item || typeof item !== "object") continue;
      const name = (item.name ?? item.dateName) as string | undefined;
      const raw = item.date ?? item.locdate;
      if (raw == null) continue;
      let key: string;
      if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
        key = raw;
      } else {
        const n = typeof raw === "number" ? raw : parseInt(String(raw).replace(/-/g, ""), 10);
        if (Number.isNaN(n) || n < 20040101) continue;
        key = toDateKey(n);
        if (!key) continue;
      }
      dateSet.add(key);
      if (name) nameByDate[key] = name;
    }
  }

  return { dates: Array.from(dateSet), nameByDate };
}
