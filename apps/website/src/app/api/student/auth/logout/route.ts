import { NextResponse } from 'next/server';
import { studentAuth } from '@/lib/auth-cookies';

/**
 * POST /api/student/auth/logout
 * Clears the student authentication httpOnly cookie.
 */
export async function POST() {
  try {
    await studentAuth.clearToken();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Student auth/logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
