import { NextRequest, NextResponse } from 'next/server';
import { createAuthToken } from '@/middleware/auth';
import { adminAuth } from '@/lib/auth-cookies';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

/**
 * POST /api/admin/auth/login
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
          name: strapiUser.username || strapiUser.name || 'Admin',
          role: 'admin',
        });

        // Set httpOnly cookie
        await adminAuth.setToken(token);

        return NextResponse.json({
          user: {
            id: String(strapiUser.id),
            email: strapiUser.email,
            name: strapiUser.username || strapiUser.name || 'Admin',
            role: 'admin',
          },
        });
      }

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    } catch {
      return NextResponse.json(
        { error: 'Authentication service unavailable' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('[API] Admin auth/login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
