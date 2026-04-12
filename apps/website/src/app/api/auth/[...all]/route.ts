import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const { GET: authGet, POST: authPost } = toNextJsHandler(auth);

export async function GET(request: NextRequest) {
  const response = await authGet(request);
  return addCorsHeaders(response, request);
}

// ---------------------------------------------------------------------------
// CORS preflight handler for cross-origin requests (e.g. admin app)
// ---------------------------------------------------------------------------
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3003",
  ...(process.env.BETTER_AUTH_BASE_URL ? [process.env.BETTER_AUTH_BASE_URL] : []),
];

function getCorsHeaders(request: NextRequest) {
  const origin = request.headers.get("origin");
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
  };
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

// ---------------------------------------------------------------------------
// In-memory rate limiter for sign-in attempts
// TODO: Replace with Redis-backed rate limiter for multi-instance deployments.
// In-memory Map resets on every redeploy and is per-instance only, meaning
// distributed brute-force attacks across replicas bypass the limit.
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 10; // max attempts per window

const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = attempts.get(ip);

  // Periodic cleanup
  if (attempts.size > 1000) {
    for (const [k, v] of attempts) {
      if (now > v.resetAt) attempts.delete(k);
    }
  }

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count };
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// ---------------------------------------------------------------------------
// POST handler with validation
// ---------------------------------------------------------------------------
function addCorsHeaders(response: NextResponse | Response, request: NextRequest): NextResponse {
  const corsHeaders = getCorsHeaders(request);
  const newResponse = new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
  for (const [key, value] of Object.entries(corsHeaders)) {
    newResponse.headers.set(key, value);
  }
  return newResponse;
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;

  // --- Rate limit sign-in ---
  if (path.endsWith("/sign-in/email")) {
    const ip = getClientIp(request);
    const { allowed, remaining } = rateLimit(ip);

    if (!allowed) {
      return addCorsHeaders(
        NextResponse.json(
          {
            code: "TOO_MANY_REQUESTS",
            message: "Too many login attempts. Please try again later.",
          },
          {
            status: 429,
            headers: { "Retry-After": "900" },
          }
        ),
        request
      );
    }

    const response = await authPost(request);

    // Reset rate limit on successful login
    if (response.status === 200) {
      attempts.delete(ip);
    }

    return addCorsHeaders(response, request);
  }

  // --- Validate sign-up ---
  if (path.endsWith("/sign-up/email")) {
    const cloned = request.clone();
    try {
      const body = await cloned.json();

      // Reject whitespace-only passwords
      if (typeof body.password === "string" && !body.password.trim()) {
        return addCorsHeaders(
          NextResponse.json(
            {
              code: "PASSWORD_TOO_SHORT",
              message: "Password cannot be empty or whitespace only",
            },
            { status: 400 }
          ),
          request
        );
      }

      // Strip HTML tags from name to prevent stored XSS
      if (typeof body.name === "string" && /<[^>]*>/.test(body.name)) {
        const sanitized = body.name.replace(/<[^>]*>/g, "").trim();
        if (!sanitized) {
          return addCorsHeaders(
            NextResponse.json(
              {
                code: "INVALID_NAME",
                message: "Name contains invalid characters",
              },
              { status: 400 }
            ),
            request
          );
        }
        const sanitizedRequest = new NextRequest(request.url, {
          method: "POST",
          headers: request.headers,
          body: JSON.stringify({ ...body, name: sanitized }),
        });
        return addCorsHeaders(await authPost(sanitizedRequest), request);
      }
    } catch {
      // JSON parse error — let better-auth handle it
    }
  }

  return addCorsHeaders(await authPost(request), request);
}
