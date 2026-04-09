import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

/**
 * GET /api/v1/users/me/progress
 * Get current user's learning progress across all courses
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

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

    const searchParams = request.nextUrl.searchParams;
    const courseId = searchParams.get('course') || searchParams.get('course_id');
    const lessonId = searchParams.get('lesson');

    // Build Strapi query params
    const strapiParams = new URLSearchParams();
    strapiParams.set('populate', 'lesson,lesson.course,quiz');
    strapiParams.set('filters[user_email][$eq]', session.user.email);

    if (courseId) {
      strapiParams.set('filters[lesson][course][documentId][$eq]', courseId);
    }
    if (lessonId) {
      strapiParams.set('filters[lesson][documentId][$eq]', lessonId);
    }

    // Fetch user progress from Strapi using service token
    const response = await fetch(`${STRAPI_URL}/api/v1/user-progresses?${strapiParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        console.error('Strapi auth error - check STRAPI_API_TOKEN');
        return NextResponse.json(
          {
            error: {
              status: 502,
              name: 'UpstreamAuthError',
              message: 'Backend authentication failed',
            },
          },
          { status: 502 }
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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

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

    const progressData = {
      ...body,
      user_email: session.user.email,
    };

    const response = await fetch(`${STRAPI_URL}/api/v1/user-progresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({ data: progressData }),
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
