import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

/**
 * GET /api/v1/users/me/enrollments
 * Get current user's course enrollments
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
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

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status'); // active, completed, dropped

    // Build Strapi query params
    const strapiParams = new URLSearchParams();
    strapiParams.set('populate', 'course,course.thumbnail,course.instructor');

    if (status) {
      strapiParams.set('filters[enrollment_status][$eq]', status);
    }

    strapiParams.set('sort', 'createdAt:desc');

    // Fetch enrollments from Strapi
    const response = await fetch(`${STRAPI_URL}/api/v1/course-enrollments?${strapiParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          {
            error: {
              status: 401,
              name: 'UnauthorizedError',
              message: 'Invalid or expired token',
            },
          },
          { status: 401 }
        );
      }
      throw new Error(`Strapi error: ${response.status}`);
    }

    const data = await response.json();

    // Calculate summary statistics
    const enrollments = data.data || [];
    const activeCount = enrollments.filter((e: any) => e.enrollment_status === 'active').length;
    const completedCount = enrollments.filter((e: any) => e.enrollment_status === 'completed').length;
    const certificatesEarned = enrollments.filter((e: any) => e.certificate_issued).length;

    return NextResponse.json({
      data: enrollments,
      meta: {
        summary: {
          totalEnrollments: enrollments.length,
          active: activeCount,
          completed: completedCount,
          certificatesEarned,
        },
        pagination: data.meta?.pagination,
        version: 'v1',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Failed to fetch enrollments',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/users/me/enrollments
 * Enroll in a course
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
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

    const body = await request.json();

    // Validate required fields
    if (!body.course) {
      return NextResponse.json(
        {
          error: {
            status: 400,
            name: 'ValidationError',
            message: 'course field is required',
          },
        },
        { status: 400 }
      );
    }

    const enrollmentData = {
      course: body.course,
      enrollment_status: 'active',
      overall_progress: 0,
      certificate_issued: false,
    };

    const response = await fetch(`${STRAPI_URL}/api/v1/course-enrollments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({ data: enrollmentData }),
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
          message: 'Successfully enrolled in course',
          version: 'v1',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Failed to enroll in course',
        },
      },
      { status: 500 }
    );
  }
}
