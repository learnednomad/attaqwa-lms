import { NextRequest, NextResponse } from 'next/server';
import { createAuthToken } from '@/middleware/auth';
import { teacherAuth } from '@/lib/auth-cookies';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

/**
 * POST /api/teacher/auth/login
 * Validates credentials against Strapi and sets an httpOnly cookie with the JWT.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Attempt to authenticate against Strapi
    try {
      const strapiResponse = await fetch(`${STRAPI_URL}/api/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: email,
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
          name: strapiUser.username || strapiUser.name || 'Teacher',
          role: strapiUser.role?.name || 'teacher',
        });

        // Set httpOnly cookie
        await teacherAuth.setToken(token);

        return NextResponse.json({
          user: {
            id: String(strapiUser.id),
            email: strapiUser.email,
            name: strapiUser.username || strapiUser.name || 'Teacher',
            role: strapiUser.role?.name || 'teacher',
          },
        });
      }

      // Strapi returned an auth error — fall through to dev fallback below
    } catch {
      // Strapi is not available — fall through to dev fallback below
    }

    // Development fallback: allow login without valid Strapi credentials
    if (process.env.NODE_ENV === 'development') {
      console.warn('[AUTH] Using development fallback for teacher login');

      const token = createAuthToken({
        userId: 'dev-teacher-001',
        email: email || 'teacher@attaqwa.org',
        name: 'Development Teacher',
        role: 'teacher',
      });

      await teacherAuth.setToken(token);

      return NextResponse.json({
        user: {
          id: 'dev-teacher-001',
          email: email || 'teacher@attaqwa.org',
          name: 'Development Teacher',
          role: 'teacher',
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('[API] Teacher auth/login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
