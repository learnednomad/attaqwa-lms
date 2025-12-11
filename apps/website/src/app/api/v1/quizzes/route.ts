import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

/**
 * GET /api/v1/quizzes
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
    const lessonId = searchParams.get('lesson');
    const courseId = searchParams.get('course');

    if (lessonId) strapiParams.set('filters[lesson][documentId][$eq]', lessonId);
    if (courseId) strapiParams.set('filters[lesson][course][documentId][$eq]', courseId);

    // Published filter
    strapiParams.set('filters[is_published][$eq]', 'true');

    // Sorting
    const sort = searchParams.get('sort') || 'createdAt:desc';
    strapiParams.set('sort', sort);

    // Populate relations
    const populate = searchParams.get('populate') || 'lesson,questions';
    strapiParams.set('populate', populate);

    // Fetch from Strapi v1 endpoint
    const response = await fetch(`${STRAPI_URL}/api/v1/quizzes?${strapiParams.toString()}`, {
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
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Failed to fetch quizzes',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/quizzes
 * Create a new quiz (admin only)
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

    const response = await fetch(`${STRAPI_URL}/api/v1/quizzes`, {
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
    console.error('Error creating quiz:', error);
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Failed to create quiz',
        },
      },
      { status: 500 }
    );
  }
}
