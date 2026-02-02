import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/middleware/auth';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

/**
 * GET /api/v1/courses
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
    const ageTier = searchParams.get('age_tier');
    const subject = searchParams.get('subject');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');

    if (ageTier) strapiParams.set('filters[age_tier][$eq]', ageTier);
    if (subject) strapiParams.set('filters[subject][$eq]', subject);
    if (difficulty) strapiParams.set('filters[difficulty][$eq]', difficulty);
    if (search) strapiParams.set('filters[title][$containsi]', search);

    // Note: Strapi v5 with draftAndPublish only returns published content by default
    // No need to filter by publishedAt explicitly

    // Sorting
    const sort = searchParams.get('sort') || 'createdAt:desc';
    strapiParams.set('sort', sort);

    // Populate relations - Strapi v5 uses array syntax or * for all
    const populate = searchParams.get('populate');
    if (populate) {
      // Support both comma-separated and array format
      const fields = populate.split(',');
      fields.forEach((field, i) => {
        strapiParams.set(`populate[${i}]`, field.trim());
      });
    } else {
      // Default: populate thumbnail relation and lessons
      strapiParams.set('populate[0]', 'thumbnail');
      strapiParams.set('populate[1]', 'lessons');
    }

    // Fetch from Strapi v1 endpoint
    const response = await fetch(`${STRAPI_URL}/api/v1/courses?${strapiParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Strapi error: ${response.status}`);
    }

    const data = await response.json();

    // Return Strapi v5 flat format
    return NextResponse.json({
      data: data.data,
      meta: {
        ...data.meta,
        version: 'v1',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Failed to fetch courses',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/courses
 * Create a new course (admin only)
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

    const response = await fetch(`${STRAPI_URL}/api/v1/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
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
    console.error('Error creating course:', error);
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Failed to create course',
        },
      },
      { status: 500 }
    );
  }
}
