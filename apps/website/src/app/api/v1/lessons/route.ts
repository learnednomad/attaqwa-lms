import { NextRequest, NextResponse } from 'next/server';
import { getAnyAuthToken } from '@/lib/auth-cookies';
import { verifyAuth } from '@/middleware/auth';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

/**
 * GET /api/v1/lessons
 * Proxy to Strapi with v1 versioned response format
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Build Strapi query params
    const strapiParams = new URLSearchParams();

    // Pagination
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '25';
    strapiParams.set('pagination[page]', page);
    strapiParams.set('pagination[pageSize]', pageSize);

    // Filters
    const courseId = searchParams.get('course');
    const contentType = searchParams.get('content_type');

    if (courseId) strapiParams.set('filters[course][documentId][$eq]', courseId);
    if (contentType) strapiParams.set('filters[lesson_type][$eq]', contentType);

    // Sorting by lesson_order
    const sort = searchParams.get('sort') || 'lesson_order:asc';
    strapiParams.set('sort', sort);

    // Populate relations (Strapi v5 array syntax)
    // Note: relation name is 'quiz' (singular) per lesson schema
    strapiParams.set('populate[0]', 'course');
    strapiParams.set('populate[1]', 'quiz');

    // Fetch from Strapi v1 endpoint
    const response = await fetch(`${STRAPI_URL}/api/v1/lessons?${strapiParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Strapi error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      data: data.data,
      meta: {
        ...data.meta,
        version: 'v1',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Failed to fetch lessons',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/lessons
 * Create a new lesson (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // SECURITY: Verify authentication and role
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: { status: 401, message: 'Authentication required' } },
        { status: 401 }
      );
    }
    if (!['ADMIN', 'TEACHER', 'admin', 'teacher'].includes(user.role)) {
      return NextResponse.json(
        { error: { status: 403, message: 'Insufficient permissions' } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    const authResult = await getAnyAuthToken();
    const token = authResult?.token || null;

    const response = await fetch(`${STRAPI_URL}/api/v1/lessons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader || `Bearer ${token}`,
      },
      body: JSON.stringify({ data: body.data || body }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json(
      {
        data: data.data,
        meta: {
          version: 'v1',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Failed to create lesson',
        },
      },
      { status: 500 }
    );
  }
}
