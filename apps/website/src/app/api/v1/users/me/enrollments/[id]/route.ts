import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { z } from 'zod';
import { auth } from '@/lib/auth';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

/**
 * PUT /api/v1/users/me/enrollments/[id]
 *
 * Update progress / status on an enrollment owned by the signed-in user.
 * Ownership is scoped through `user_email` — same convention as the rest
 * of `/users/me/*`. We fetch the enrollment first to verify the email
 * matches the BetterAuth session, then forward the whitelisted fields.
 *
 * `[id]` is the Strapi `documentId` (Strapi v5 routes accept it for
 * findOne/update). Mobile already passes the value it gets back from
 * `/users/me/enrollments` so no extra mapping is needed.
 */

const updateBodySchema = z
  .object({
    overall_progress: z.number().int().min(0).max(100).optional(),
    enrollment_status: z
      .enum(['pending', 'active', 'completed', 'dropped', 'suspended'])
      .optional(),
    completion_date: z.string().datetime().optional(),
    notes: z.string().max(2000).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one updatable field is required',
  });

async function strapiFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  return fetch(`${STRAPI_URL}/api/v1${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      ...(init.headers ?? {}),
    },
  });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json(
        {
          error: {
            status: 401,
            name: 'UnauthorizedError',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    if (!STRAPI_API_TOKEN) {
      return NextResponse.json(
        {
          error: {
            status: 500,
            name: 'ConfigurationError',
            message: 'STRAPI_API_TOKEN is not configured on the website server',
          },
        },
        { status: 500 }
      );
    }

    const { id } = await context.params;
    const rawBody = await request.json().catch(() => null);
    const validation = updateBodySchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: {
            status: 400,
            name: 'ValidationError',
            message: 'Invalid request body',
            details: validation.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    // Ownership check: confirm `user_email` on the enrollment matches the
    // BetterAuth session. We look it up only by id+email so the response is
    // empty for both "not found" and "found but not yours" — never leaks
    // existence of other users' enrollments to a probing client.
    const ownerLookupParams = new URLSearchParams();
    ownerLookupParams.set('fields[0]', 'user_email');
    ownerLookupParams.set('filters[user_email][$eq]', session.user.email);
    ownerLookupParams.set('filters[documentId][$eq]', id);
    const ownerLookup = await strapiFetch(
      `/course-enrollments?${ownerLookupParams.toString()}`
    );

    if (!ownerLookup.ok) {
      console.error(
        `Strapi error during enrollment ownership lookup: ${ownerLookup.status}`
      );
      return NextResponse.json(
        {
          error: {
            status: 502,
            name: 'UpstreamError',
            message: 'Backend lookup failed',
          },
        },
        { status: 502 }
      );
    }

    const ownerData = (await ownerLookup.json()) as {
      data?: Array<{ user_email?: string }>;
    };
    if (!ownerData.data || ownerData.data.length === 0) {
      return NextResponse.json(
        {
          error: {
            status: 404,
            name: 'NotFoundError',
            message: 'Enrollment not found',
          },
        },
        { status: 404 }
      );
    }

    // Always touch last_activity_date when the user pokes the enrollment.
    const patch: Record<string, unknown> = {
      ...validation.data,
      last_activity_date: new Date().toISOString(),
    };

    const updateRes = await strapiFetch(
      `/course-enrollments/${encodeURIComponent(id)}`,
      {
        method: 'PUT',
        body: JSON.stringify({ data: patch }),
      }
    );

    if (!updateRes.ok) {
      const errorData = await updateRes.json().catch(() => ({}));
      return NextResponse.json(errorData, { status: updateRes.status });
    }

    const data = await updateRes.json();
    return NextResponse.json({
      data: data.data,
      meta: {
        version: 'v1',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating enrollment:', error);
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Failed to update enrollment',
        },
      },
      { status: 500 }
    );
  }
}
