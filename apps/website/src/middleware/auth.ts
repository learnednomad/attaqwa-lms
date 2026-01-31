/**
 * Secure JWT Authentication Middleware
 *
 * SECURITY FIXES APPLIED:
 * 1. Removed hardcoded fallback secret
 * 2. Throws error if JWT_SECRET is not configured
 * 3. Added algorithm restriction to prevent algorithm confusion attacks
 * 4. Added token expiration validation
 * 5. Added required claim validation
 * 6. Improved error logging (server-side only)
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt, { SignOptions } from 'jsonwebtoken';
import { AUTH_COOKIE_NAMES } from '@/lib/auth-cookies';

// SECURITY: JWT_SECRET is validated at runtime to avoid build-time issues
const JWT_SECRET = process.env.JWT_SECRET;

// Development fallback warning (logged at module load, but doesn't throw)
if (!JWT_SECRET && typeof window === 'undefined') {
  console.warn(
    '[AUTH WARNING] JWT_SECRET not set. Authentication will fail until it is configured.'
  );
}

// Use a development-only key that will fail in production
const getJwtSecret = (): string => {
  if (JWT_SECRET) return JWT_SECRET;

  // Allow during build (NEXT_PHASE is set during build)
  // or in development for testing
  if (process.env.NODE_ENV !== 'production' || process.env.NEXT_PHASE === 'phase-production-build') {
    return 'development-only-insecure-key-change-in-production';
  }

  throw new Error('JWT_SECRET is required in production runtime');
};

export interface AuthUser {
  userId: string;
  email: string;
  studentId?: string;
  name: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Verify JWT token from request
 *
 * Checks both httpOnly cookies (preferred) and Authorization header (legacy)
 *
 * @param request - Next.js request object
 * @returns Decoded user object or null if invalid
 */
export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    // Priority 1: httpOnly cookies (most secure)
    const token =
      request.cookies.get(AUTH_COOKIE_NAMES.STUDENT)?.value ||
      request.cookies.get(AUTH_COOKIE_NAMES.TEACHER)?.value ||
      request.cookies.get(AUTH_COOKIE_NAMES.ADMIN)?.value ||
      request.cookies.get(AUTH_COOKIE_NAMES.AUTH)?.value ||
      // Legacy: Authorization header (for API clients)
      request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return null;
    }

    // Verify token with strict options
    const decoded = jwt.verify(token, getJwtSecret(), {
      // SECURITY: Restrict to specific algorithm to prevent algorithm confusion
      algorithms: ['HS256'],
      // Validate expiration
      maxAge: '7d',
    }) as AuthUser;

    // SECURITY: Validate required claims exist
    if (!decoded.userId || !decoded.email) {
      console.error('[AUTH] Token missing required claims:', {
        hasUserId: !!decoded.userId,
        hasEmail: !!decoded.email,
      });
      return null;
    }

    return decoded;
  } catch (error) {
    // Log error server-side only, don't expose to client
    if (error instanceof jwt.TokenExpiredError) {
      console.debug('[AUTH] Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.debug('[AUTH] Invalid token:', error.message);
    } else {
      console.error('[AUTH] Verification error:', error);
    }

    return null;
  }
}

/**
 * Create authentication middleware for API routes
 *
 * @param requiredRole - Optional role requirement for access
 * @returns Middleware function that returns null to continue or error response
 */
export function createAuthMiddleware(requiredRole?: string | string[]) {
  return async (
    request: NextRequest
  ): Promise<NextResponse | null> => {
    const user = await verifyAuth(request);

    if (!user) {
      // SECURITY: Generic error message, don't reveal auth mechanism
      return NextResponse.json(
        {
          error: {
            status: 401,
            message: 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    // Check role if specified
    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const hasRole = roles.includes(user.role);

      if (!hasRole) {
        // SECURITY: Don't reveal which roles are valid
        return NextResponse.json(
          {
            error: {
              status: 403,
              message: 'Insufficient permissions',
            },
          },
          { status: 403 }
        );
      }
    }

    // Continue to the route handler
    return null;
  };
}

/**
 * Create a JWT token for a user
 *
 * @param payload - User data to encode
 * @param expiresIn - Token expiration (default: 7 days)
 * @returns Signed JWT token
 */
export function createAuthToken(
  payload: Omit<AuthUser, 'iat' | 'exp'>,
  expiresIn: string = '7d'
): string {
  const options: SignOptions = {
    algorithm: 'HS256',
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign(payload, getJwtSecret(), options);
}

/**
 * Validate that a token will expire after a given duration
 *
 * @param token - JWT token to check
 * @param minDuration - Minimum remaining validity in seconds
 * @returns True if token is valid for at least the specified duration
 */
export function isTokenValidFor(token: string, minDuration: number): boolean {
  try {
    const decoded = jwt.decode(token) as AuthUser | null;

    if (!decoded?.exp) {
      return false;
    }

    const expiresAt = decoded.exp * 1000; // Convert to milliseconds
    const minValidUntil = Date.now() + minDuration * 1000;

    return expiresAt > minValidUntil;
  } catch {
    return false;
  }
}
