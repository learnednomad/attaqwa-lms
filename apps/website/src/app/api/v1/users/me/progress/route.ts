import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

/**
 * GET /api/v1/users/me/progress
 * Get current user's learning progress across all courses
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
    const courseId = searchParams.get('course');
    const lessonId = searchParams.get('lesson');

    // Build Strapi query params
    const strapiParams = new URLSearchParams();
    strapiParams.set('populate', 'lesson,lesson.course,quiz');

    if (courseId) {
      strapiParams.set('filters[lesson][course][documentId][$eq]', courseId);
    }
    if (lessonId) {
      strapiParams.set('filters[lesson][documentId][$eq]', lessonId);
    }

    // Fetch user progress from Strapi
    const response = await fetch(`${STRAPI_URL}/api/v1/user-progresses?${strapiParams.toString()}`, {
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
    const progressItems = data.data || [];
    const completedLessons = progressItems.filter((p: any) => p.status === 'completed').length;
    const inProgressLessons = progressItems.filter((p: any) => p.status === 'in_progress').length;
    const totalProgress = progressItems.length > 0
      ? progressItems.reduce((sum: number, p: any) => sum + (p.progress_percentage || 0), 0) / progressItems.length
      : 0;

    return NextResponse.json({
      data: progressItems,
      meta: {
        summary: {
          totalLessons: progressItems.length,
          completedLessons,
          inProgressLessons,
          averageProgress: Math.round(totalProgress),
        },
        version: 'v1',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Failed to fetch user progress',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/users/me/progress
 * Update or create progress for a specific lesson
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
    if (!body.lesson) {
      return NextResponse.json(
        {
          error: {
            status: 400,
            name: 'ValidationError',
            message: 'lesson field is required',
          },
        },
        { status: 400 }
      );
    }

    const response = await fetch(`${STRAPI_URL}/api/v1/user-progresses`, {
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
    console.error('Error updating user progress:', error);
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Failed to update user progress',
        },
      },
      { status: 500 }
    );
  }
}
