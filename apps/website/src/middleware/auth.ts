/**
 * Authentication helpers for API route handlers.
 * Uses BetterAuth session validation instead of JWT verification.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Verify authentication from request.
 * Reads BetterAuth session cookie and validates against the database.
 */
export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return null;
    }

    return {
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role ?? 'user',
    };
  } catch {
    return null;
  }
}

/**
 * Create authentication middleware for API routes.
 */
export function createAuthMiddleware(requiredRole?: string | string[]) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const user = await verifyAuth(request);

    if (!user) {
      return NextResponse.json(
        { error: { status: 401, message: 'Authentication required' } },
        { status: 401 }
      );
    }

    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (!roles.includes(user.role)) {
        return NextResponse.json(
          { error: { status: 403, message: 'Insufficient permissions' } },
          { status: 403 }
        );
      }
    }

    return null;
  };
}
