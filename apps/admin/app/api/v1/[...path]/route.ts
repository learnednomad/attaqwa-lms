import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL =
  process.env.STRAPI_INTERNAL_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const AUTH_URL =
  process.env.AUTH_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_AUTH_URL ||
  "http://localhost:3003";

/**
 * Verify the caller has an active admin session via BetterAuth.
 * Returns the user object on success, null on failure.
 */
async function verifyAdminSession(
  request: NextRequest
): Promise<{ role: string } | null> {
  try {
    const cookie = request.headers.get("cookie");
    if (!cookie) return null;

    const res = await fetch(`${AUTH_URL}/api/auth/get-session`, {
      headers: { cookie },
    });

    if (!res.ok) return null;

    const session = await res.json();
    const user = session?.user;
    if (!user || user.role !== "admin") return null;

    return user;
  } catch {
    return null;
  }
}

async function proxyToStrapi(request: NextRequest) {
  // Verify the caller is an authenticated admin before proxying
  const admin = await verifyAdminSession(request);
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized — admin session required" },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const targetUrl = `${STRAPI_URL}/api${url.pathname.replace(/^\/api/, "")}${url.search}`;

  if (!STRAPI_API_TOKEN) {
    return NextResponse.json(
      { error: "STRAPI_API_TOKEN is not configured. Set it in your .env file." },
      { status: 500 }
    );
  }

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("cookie"); // Don't forward session cookies to Strapi
  headers.set("Authorization", `Bearer ${STRAPI_API_TOKEN}`);

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body:
      request.method !== "GET" && request.method !== "HEAD"
        ? await request.text()
        : undefined,
  });

  // Strip CORS headers from upstream — request is same-origin from the
  // browser's perspective (admin's own /api/v1/*). Strapi may emit
  // Access-Control-Allow-Origin pinned to a different host; Safari then
  // treats the response as a CORS violation when forwarded verbatim.
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
  return proxyToStrapi(request);
}

export async function POST(request: NextRequest) {
  return proxyToStrapi(request);
}

export async function PUT(request: NextRequest) {
  return proxyToStrapi(request);
}

export async function DELETE(request: NextRequest) {
  return proxyToStrapi(request);
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
