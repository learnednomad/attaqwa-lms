import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const { GET: authGet, POST: authPost } = toNextJsHandler(auth);

export { authGet as GET };

// ---------------------------------------------------------------------------
// In-memory rate limiter for sign-in attempts
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
export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;

  // --- Rate limit sign-in ---
  if (path.endsWith("/sign-in/email")) {
    const ip = getClientIp(request);
    const { allowed, remaining } = rateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        {
          code: "TOO_MANY_REQUESTS",
          message: "Too many login attempts. Please try again later.",
        },
        {
          status: 429,
          headers: { "Retry-After": "900" },
        }
      );
    }

    const response = await authPost(request);

    // Reset rate limit on successful login
    if (response.status === 200) {
      attempts.delete(ip);
    }

    return response;
  }

  // --- Validate sign-up ---
  if (path.endsWith("/sign-up/email")) {
    const cloned = request.clone();
    try {
      const body = await cloned.json();

      // Reject whitespace-only passwords
      if (typeof body.password === "string" && !body.password.trim()) {
        return NextResponse.json(
          {
            code: "PASSWORD_TOO_SHORT",
            message: "Password cannot be empty or whitespace only",
          },
          { status: 400 }
        );
      }

      // Strip HTML tags from name to prevent stored XSS
      if (typeof body.name === "string" && /<[^>]*>/.test(body.name)) {
        const sanitized = body.name.replace(/<[^>]*>/g, "").trim();
        if (!sanitized) {
          return NextResponse.json(
            {
              code: "INVALID_NAME",
              message: "Name contains invalid characters",
            },
            { status: 400 }
          );
        }
        const sanitizedRequest = new NextRequest(request.url, {
          method: "POST",
          headers: request.headers,
          body: JSON.stringify({ ...body, name: sanitized }),
        });
        return authPost(sanitizedRequest);
      }
    } catch {
      // JSON parse error — let better-auth handle it
    }
  }

  return authPost(request);
}
