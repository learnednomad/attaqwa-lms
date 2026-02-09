import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/auth-cookies';

/**
 * POST /api/admin/auth/logout
 * Clears the admin authentication cookie.
 */
export async function POST() {
  try {
    await adminAuth.clearToken();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Admin auth/logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
