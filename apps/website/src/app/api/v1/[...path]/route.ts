/**
 * Catch-all Strapi proxy for the website.
 *
 * Mirrors the admin app's `/api/v1/[...path]/route.ts` pattern. Forwards
 * any request the website's specific route files don't handle to Strapi
 * with the server-side STRAPI_API_TOKEN attached.
 *
 * Why: client-side fetches calling Strapi directly would either (a) leak
 * `localhost:1337` into the production bundle, or (b) require a token in
 * the browser. Both are bad. Routing through `/api/v1/*` on the website's
 * own origin lets the bundle stay environment-agnostic and keeps the token
 * server-side.
 *
 * Auth model:
 *   - GET requests: forwarded with the token (Strapi route definitions
 *     decide if the endpoint is public — most public-content endpoints
 *     have `auth: false` configured in apps/api).
 *   - POST/PUT/PATCH/DELETE: BetterAuth session must exist with role
 *     admin or moderator. 401/403 returned otherwise.
 *
 * Specific route files (apps/website/src/app/api/v1/courses/route.ts etc.)
 * take routing priority over this catch-all and run their own validation
 * before calling Strapi.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/middleware/auth";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const ADMIN_ROLES = new Set(["ADMIN", "MODERATOR", "admin", "moderator"]);

async function proxyToStrapi(
  request: NextRequest,
  requireAdmin: boolean
): Promise<NextResponse> {
  if (!STRAPI_API_TOKEN) {
    return NextResponse.json(
      {
        error: {
          status: 500,
          message:
            "STRAPI_API_TOKEN is not configured on the website server.",
        },
      },
      { status: 500 }
    );
  }

  if (requireAdmin) {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: { status: 401, message: "Authentication required" } },
        { status: 401 }
      );
    }
    if (!ADMIN_ROLES.has(user.role)) {
      return NextResponse.json(
        { error: { status: 403, message: "Insufficient permissions" } },
        { status: 403 }
      );
    }
  }

  const url = new URL(request.url);
  // Strip the website's `/api` prefix; Strapi expects `/api/v1/<resource>`.
  const targetUrl = `${STRAPI_URL}/api${url.pathname.replace(/^\/api/, "")}${url.search}`;

  const headers = new Headers();
  // Only forward content-type and accept; everything else (cookies, auth)
  // we set ourselves.
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");
  if (contentType) headers.set("content-type", contentType);
  if (accept) headers.set("accept", accept);
  headers.set("authorization", `Bearer ${STRAPI_API_TOKEN}`);

  const init: RequestInit = {
    method: request.method,
    headers,
  };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  const response = await fetch(targetUrl, init);

  // Strip CORS headers — same-origin from the browser's perspective. Lesson
  // learned the hard way in PR #35.
  const responseHeaders = new Headers(response.headers);
  for (const key of Array.from(responseHeaders.keys())) {
    if (key.toLowerCase().startsWith("access-control-")) {
      responseHeaders.delete(key);
    }
  }
  // Drop transfer-encoding; NextResponse handles framing itself and
  // forwarding can confuse some clients.
  responseHeaders.delete("transfer-encoding");
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export async function GET(request: NextRequest) {
  return proxyToStrapi(request, false);
}

export async function POST(request: NextRequest) {
  return proxyToStrapi(request, true);
}

export async function PUT(request: NextRequest) {
  return proxyToStrapi(request, true);
}

export async function PATCH(request: NextRequest) {
  return proxyToStrapi(request, true);
}

export async function DELETE(request: NextRequest) {
  return proxyToStrapi(request, true);
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
