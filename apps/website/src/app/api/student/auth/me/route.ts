import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/middleware/auth';

/**
 * GET /api/student/auth/me
 * Returns the currently authenticated student's data from the httpOnly cookie.
 * Returns 401 if not authenticated.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.userId,
        email: user.email,
        studentId: user.studentId,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('[API] Student auth/me error:', error);
    return NextResponse.json(
      { error: 'Authentication check failed' },
      { status: 500 }
    );
  }
}
