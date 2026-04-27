import { NextRequest, NextResponse } from "next/server";

const AUTH_URL =
  process.env.AUTH_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_AUTH_URL ||
  "http://localhost:3003";

async function proxyAuth(request: NextRequest) {
  const url = new URL(request.url);
  const targetUrl = `${AUTH_URL}${url.pathname}${url.search}`;

  const headers = new Headers(request.headers);
  headers.delete("host");

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body:
      request.method !== "GET" && request.method !== "HEAD"
        ? await request.text()
        : undefined,
  });

  // Strip CORS headers from upstream — request is same-origin from the
  // browser's perspective (admin's own /api/auth/*). The website's
  // BetterAuth emits Access-Control-Allow-Origin pinned to its own host,
  // which Safari treats as a CORS violation when forwarded verbatim.
  const responseHeaders = new Headers(response.headers);
  for (const key of Array.from(responseHeaders.keys())) {
    if (key.toLowerCase().startsWith("access-control-")) {
      responseHeaders.delete(key);
    }
  }

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export async function GET(request: NextRequest) {
  return proxyAuth(request);
}

export async function POST(request: NextRequest) {
  return proxyAuth(request);
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
