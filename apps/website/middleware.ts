import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/student", "/teacher", "/admin"];
const PUBLIC_AUTH_PAGES = [
  "/student/login",
  "/teacher/login",
  "/admin/login",
  "/student/register",
  "/student/forgot-password",
  "/teacher/forgot-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isPublicAuth = PUBLIC_AUTH_PAGES.includes(pathname);

  if (isProtected && !isPublicAuth) {
    // Check for BetterAuth session cookie
    const sessionCookie =
      request.cookies.get("__Secure-better-auth.session_token") ??
      request.cookies.get("better-auth.session_token");

    if (!sessionCookie?.value) {
      const loginPath = pathname.startsWith("/admin")
        ? "/admin/login"
        : pathname.startsWith("/teacher")
          ? "/teacher/login"
          : "/student/login";
      return NextResponse.redirect(new URL(loginPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/teacher/:path*", "/admin/:path*"],
};
