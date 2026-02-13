import { getHolidayEntries } from "@/lib/holidays-kr";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const yearStr = searchParams.get("year");
  const yearEndStr = searchParams.get("yearEnd");

  const year = yearStr ? parseInt(yearStr, 10) : new Date().getFullYear();
  const yearEnd = yearEndStr ? parseInt(yearEndStr, 10) : year + 1;

  if (Number.isNaN(year) || Number.isNaN(yearEnd) || year < 2004 || yearEnd < year) {
    return NextResponse.json({ dates: [], nameByDate: {} }, { status: 400 });
  }

  try {
    const { dates, nameByDate } = await getHolidayEntries(year, yearEnd);
    return NextResponse.json({ dates, nameByDate });
  } catch {
    return NextResponse.json({ dates: [], nameByDate: {} });
  }
}
