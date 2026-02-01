import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

/**
 * GET /api/v1/users/me/achievements
 * Get current user's earned achievements
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
    const category = searchParams.get('category');

    // Build Strapi query params
    const strapiParams = new URLSearchParams();
    strapiParams.set('populate', 'achievement,achievement.badge_image');
    strapiParams.set('sort', 'earned_at:desc');

    if (category) {
      strapiParams.set('filters[achievement][category][$eq]', category);
    }

    // Fetch user achievements from Strapi
    const response = await fetch(`${STRAPI_URL}/api/v1/user-achievements?${strapiParams.toString()}`, {
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

    // Calculate summary
    const achievements = data.data || [];
    const totalPoints = achievements.reduce(
      (sum: number, a: any) => sum + (a.achievement?.points || 0),
      0
    );

    // Group by category
    const byCategory: Record<string, number> = {};
    achievements.forEach((a: any) => {
      const cat = a.achievement?.category || 'other';
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    });

    return NextResponse.json({
      data: achievements,
      meta: {
        summary: {
          totalAchievements: achievements.length,
          totalPoints,
          byCategory,
        },
        pagination: data.meta?.pagination,
        version: 'v1',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Failed to fetch achievements',
        },
      },
      { status: 500 }
    );
  }
}
