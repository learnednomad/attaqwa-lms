/**
 * Secure Cookie-Based Authentication Helpers
 *
 * SECURITY: These helpers manage authentication tokens using httpOnly cookies
 * instead of localStorage to prevent XSS attacks from stealing tokens.
 *
 * Cookie Configuration:
 * - httpOnly: true - Prevents JavaScript access (XSS protection)
 * - secure: true in production - Only sent over HTTPS
 * - sameSite: 'strict' - Prevents CSRF attacks
 * - path: '/' - Available across the entire site
 */

import { cookies } from 'next/headers';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

// Cookie names for different auth contexts
export const AUTH_COOKIE_NAMES = {
  STUDENT: 'student-auth-token',
  TEACHER: 'teacher-auth-token',
  ADMIN: 'admin-auth-token',
  // Generic auth token (fallback)
  AUTH: 'auth-token',
} as const;

type AuthCookieName = (typeof AUTH_COOKIE_NAMES)[keyof typeof AUTH_COOKIE_NAMES];

// Default cookie options for secure authentication
const getDefaultCookieOptions = (): Partial<ResponseCookie> => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  // 7 days expiration
  maxAge: 60 * 60 * 24 * 7,
});

/**
 * Set an authentication cookie with secure defaults
 *
 * @param cookieName - The name of the cookie to set
 * @param token - The JWT token to store
 * @param options - Optional override for cookie options
 */
export async function setAuthCookie(
  cookieName: AuthCookieName,
  token: string,
  options?: Partial<ResponseCookie>
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(cookieName, token, {
    ...getDefaultCookieOptions(),
    ...options,
  });
}

/**
 * Get an authentication token from cookies
 *
 * @param cookieName - The name of the cookie to retrieve
 * @returns The token value or undefined if not found
 */
export async function getAuthToken(
  cookieName: AuthCookieName
): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(cookieName)?.value;
}

/**
 * Clear an authentication cookie (logout)
 *
 * @param cookieName - The name of the cookie to clear
 */
export async function clearAuthCookie(cookieName: AuthCookieName): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

/**
 * Clear all authentication cookies (full logout)
 */
export async function clearAllAuthCookies(): Promise<void> {
  const cookieStore = await cookies();

  Object.values(AUTH_COOKIE_NAMES).forEach((cookieName) => {
    cookieStore.delete(cookieName);
  });
}

/**
 * Check if user has any valid auth cookie
 *
 * @returns The first found auth cookie name and token, or null
 */
export async function getAnyAuthToken(): Promise<{
  cookieName: AuthCookieName;
  token: string;
} | null> {
  const cookieStore = await cookies();

  for (const cookieName of Object.values(AUTH_COOKIE_NAMES)) {
    const token = cookieStore.get(cookieName)?.value;
    if (token) {
      return { cookieName, token };
    }
  }

  return null;
}

// ============================================================================
// Convenience functions for specific user types
// ============================================================================

/**
 * Student Authentication Helpers
 */
export const studentAuth = {
  setToken: (token: string) => setAuthCookie(AUTH_COOKIE_NAMES.STUDENT, token),
  getToken: () => getAuthToken(AUTH_COOKIE_NAMES.STUDENT),
  clearToken: () => clearAuthCookie(AUTH_COOKIE_NAMES.STUDENT),
};

/**
 * Teacher Authentication Helpers
 */
export const teacherAuth = {
  setToken: (token: string) => setAuthCookie(AUTH_COOKIE_NAMES.TEACHER, token),
  getToken: () => getAuthToken(AUTH_COOKIE_NAMES.TEACHER),
  clearToken: () => clearAuthCookie(AUTH_COOKIE_NAMES.TEACHER),
};

/**
 * Admin Authentication Helpers
 */
export const adminAuth = {
  setToken: (token: string) => setAuthCookie(AUTH_COOKIE_NAMES.ADMIN, token),
  getToken: () => getAuthToken(AUTH_COOKIE_NAMES.ADMIN),
  clearToken: () => clearAuthCookie(AUTH_COOKIE_NAMES.ADMIN),
};
