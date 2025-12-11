import { NextRequest, NextResponse } from 'next/server';

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
    if (contentType) strapiParams.set('filters[content_type][$eq]', contentType);

    // Published filter
    strapiParams.set('filters[is_published][$eq]', 'true');

    // Sorting by order
    const sort = searchParams.get('sort') || 'order:asc';
    strapiParams.set('sort', sort);

    // Populate relations
    const populate = searchParams.get('populate') || 'course,quizzes';
    strapiParams.set('populate', populate);

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
    const body = await request.json();
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        {
          error: {
            status: 401,
            name: 'UnauthorizedError',
            message: 'Missing authorization header',
          },
        },
        { status: 401 }
      );
    }

    const response = await fetch(`${STRAPI_URL}/api/v1/lessons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({ data: body }),
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
