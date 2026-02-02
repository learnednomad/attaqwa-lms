import { NextRequest, NextResponse } from 'next/server';
import { createAuthToken } from '@/middleware/auth';
import { studentAuth } from '@/lib/auth-cookies';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

/**
 * POST /api/student/auth/login
 * Validates credentials against Strapi and sets an httpOnly cookie with the JWT.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, studentId } = body;

    if ((!email && !studentId) || !password) {
      return NextResponse.json(
        { error: 'Email/Student ID and password are required' },
        { status: 400 }
      );
    }

    // Attempt to authenticate against Strapi
    try {
      const strapiResponse = await fetch(`${STRAPI_URL}/api/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: email || studentId,
          password,
        }),
      });

      if (strapiResponse.ok) {
        const strapiData = await strapiResponse.json();
        const strapiUser = strapiData.user;

        // Create our own JWT for cookie storage
        const token = createAuthToken({
          userId: String(strapiUser.id),
          email: strapiUser.email,
          studentId: strapiUser.studentId || studentId,
          name: strapiUser.username || strapiUser.name || 'Student',
          role: strapiUser.role?.name || 'student',
        });

        // Set httpOnly cookie
        await studentAuth.setToken(token);

        return NextResponse.json({
          user: {
            id: String(strapiUser.id),
            email: strapiUser.email,
            studentId: strapiUser.studentId || studentId,
            name: strapiUser.username || strapiUser.name || 'Student',
            role: strapiUser.role?.name || 'student',
          },
        });
      }

      // Strapi returned an error
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    } catch {
      // Strapi is not available — return 503
      return NextResponse.json(
        { error: 'Authentication service unavailable' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('[API] Student auth/login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
