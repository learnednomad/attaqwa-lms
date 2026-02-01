/**
 * Feature Flag Service
 *
 * Simple feature flag system for gating access to features in development.
 * Environment variables control which features are enabled.
 */

export class FeatureFlagService {
  /**
   * Check if education UI features are accessible to public users
   */
  static canAccessEducationUI(): boolean {
    // Enable education UI if environment variable is set to 'true'
    // Defaults to true for development
    if (typeof window === 'undefined') {
      // Server-side: check Node environment variable
      return process.env.NEXT_PUBLIC_ENABLE_EDUCATION_UI !== 'false';
    }
    // Client-side: check browser environment variable
    return process.env.NEXT_PUBLIC_ENABLE_EDUCATION_UI !== 'false';
  }

  /**
   * Check if education admin features are accessible
   */
  static canAccessEducationAdmin(): boolean {
    // Enable education admin if environment variable is set to 'true'
    // Defaults to true for development
    if (typeof window === 'undefined') {
      // Server-side: check Node environment variable
      return process.env.NEXT_PUBLIC_ENABLE_EDUCATION_ADMIN !== 'false';
    }
    // Client-side: check browser environment variable
    return process.env.NEXT_PUBLIC_ENABLE_EDUCATION_ADMIN !== 'false';
  }
}
