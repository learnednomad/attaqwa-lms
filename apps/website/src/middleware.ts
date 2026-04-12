import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side auth guard for protected website routes.
 *
 * Checks for the BetterAuth session cookie before allowing access to
 * the student dashboard and learning pages. Public pages (courses listing,
 * announcements, prayer times) remain accessible without auth.
 */

const PROTECTED_PREFIXES = ["/student"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard protected routes
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) {
    return NextResponse.next();
  }

  // Allow login / forgot-password / change-password within student area.
  // The change-password page has its own in-page auth check; letting it
  // through the middleware keeps the forced-change UX working.
  if (
    pathname.startsWith("/student/login") ||
    pathname.startsWith("/student/forgot-password") ||
    pathname.startsWith("/student/change-password")
  ) {
    return NextResponse.next();
  }

  // Check for BetterAuth session cookie
  const sessionToken =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  if (!sessionToken?.value) {
    const loginUrl = new URL("/student/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*"],
};
