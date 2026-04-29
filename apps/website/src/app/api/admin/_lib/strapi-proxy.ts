/**
 * Shared helpers for /api/admin/* BFF routes.
 *
 * Admin pages render in the browser, so they can't use STRAPI_API_TOKEN
 * directly (it's a server-only env var). These helpers run server-side,
 * verify the BetterAuth session has an admin role, then forward to Strapi
 * with the privileged token.
 *
 * Pattern intentionally mirrors apps/website/src/app/api/v1/users/me/*.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const STRAPI_URL =
  process.env.STRAPI_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:1337';

const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

const ADMIN_ROLES = new Set(['admin', 'superadmin', 'masjidadmin']);

 interface AdminGuardResult {
  ok: boolean;
  response?: NextResponse;
  session?: {
    user: { id: string; email: string; role?: string | null };
  };
}

/**
 * Verifies the inbound request has an admin BetterAuth session.
 * On failure, returns a NextResponse that the caller should return immediately.
 */
export async function requireAdmin(): Promise<AdminGuardResult> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: {
            status: 401,
            name: 'UnauthorizedError',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      ),
    };
  }

  const role = (session.user as { role?: string | null }).role ?? '';
  if (!ADMIN_ROLES.has(role.toLowerCase())) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: {
            status: 403,
            name: 'ForbiddenError',
            message: 'Admin role required',
          },
        },
        { status: 403 }
      ),
    };
  }

  return {
    ok: true,
    session: {
      user: {
        id: session.user.id,
        email: session.user.email,
        role: role,
      },
    },
  };
}

/**
 * Proxies a request to Strapi with the server-side STRAPI_API_TOKEN.
 *
 * @param strapiPath path beginning with `/api/v1/...`
 * @param init standard fetch init (method/body/headers); `Authorization` is
 *             always overridden to the admin token.
 */
export async function strapiFetch(
  strapiPath: string,
  init: RequestInit = {}
): Promise<Response> {
  const url = `${STRAPI_URL}${strapiPath}`;
  return fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers as Record<string, string> | undefined),
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
    },
    cache: 'no-store',
  });
}

/**
 * Read-side proxy — forwards the inbound query string to Strapi unchanged.
 * Returns a normalised JSON response or an error envelope on failure.
 */
export async function proxyGet(
  request: NextRequest,
  strapiBasePath: string
): Promise<NextResponse> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response!;

  const search = request.nextUrl.search ?? '';
  const upstream = await strapiFetch(`${strapiBasePath}${search}`);

  if (!upstream.ok) {
    return NextResponse.json(
      {
        error: {
          status: upstream.status,
          name: 'UpstreamError',
          message: `Strapi responded ${upstream.status}`,
        },
      },
      { status: upstream.status }
    );
  }

  const body = await upstream.json();
  return NextResponse.json(body, { status: 200 });
}

/**
 * Write-side proxy — forwards body + method to Strapi.
 */
export async function proxyMutation(
  request: NextRequest,
  strapiPath: string,
  method: 'POST' | 'PUT' | 'DELETE'
): Promise<NextResponse> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response!;

  const body =
    method === 'DELETE'
      ? undefined
      : JSON.stringify(await request.json().catch(() => ({})));

  const upstream = await strapiFetch(strapiPath, { method, body });

  if (!upstream.ok) {
    let detail: unknown = undefined;
    try {
      detail = await upstream.json();
    } catch {
      /* ignore */
    }
    return NextResponse.json(
      {
        error: {
          status: upstream.status,
          name: 'UpstreamError',
          message: `Strapi responded ${upstream.status}`,
          detail,
        },
      },
      { status: upstream.status }
    );
  }

  const responseBody = await upstream
    .json()
    .catch(() => ({ data: null, meta: {} }));
  return NextResponse.json(responseBody, { status: upstream.status });
}
