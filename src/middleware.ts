import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth";

const PUBLIC_PATHS = ["/login"];
const API_AUTH_PREFIX = "/api/auth/";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API 인증 경로는 통과
  if (pathname.startsWith(API_AUTH_PREFIX)) {
    return NextResponse.next();
  }

  // 로그인 페이지는 미인증 시에만 허용
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);
    if (session) {
      return NextResponse.redirect(new URL("/schedule", request.url));
    }
    return NextResponse.next();
  }

  // 그 외 경로: 로그인 필요
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
