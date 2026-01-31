import { NextResponse } from 'next/server';
import { teacherAuth } from '@/lib/auth-cookies';

/**
 * POST /api/teacher/auth/logout
 * Clears the teacher httpOnly auth cookie.
 */
export async function POST() {
  await teacherAuth.clearToken();
  return NextResponse.json({ success: true });
}
