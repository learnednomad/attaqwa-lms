import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { AUTH_COOKIE_NAMES } from '@/lib/auth-cookies';
import type { AuthUser } from '@/middleware/auth';

const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || 'development-only-insecure-key-change-in-production';
};

/**
 * GET /api/teacher/auth/me
 * Returns the currently authenticated teacher's data from the teacher-specific httpOnly cookie.
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAMES.TEACHER)?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, getJwtSecret(), {
      algorithms: ['HS256'],
      maxAge: '7d',
    }) as AuthUser;

    if (!decoded.userId || !decoded.email) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }
}
