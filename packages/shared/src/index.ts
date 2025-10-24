// ============================================================================
// API ENDPOINTS
// ============================================================================
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/local',
  REGISTER: '/api/auth/local/register',
  ME: '/api/users/me',
  LOGOUT: '/api/auth/logout',

  // Content
  ANNOUNCEMENTS: '/api/announcements',
  EVENTS: '/api/events',
  PRAYER_TIMES: '/api/prayer-times',
  EDUCATION_CONTENT: '/api/education-contents',
  QUIZZES: '/api/quizzes',

  // User
  USER_PROGRESS: '/api/user-progress',
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized. Please log in.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Validation error. Please check your input.',
} as const;

// ============================================================================
// MOSQUE INFO
// ============================================================================
export const MOSQUE_INFO = {
  name: 'Attaqwa Masjid',
  address: '123 Main Street, Springfield, MA 01101',
  phone: '(413) 555-1234',
  email: 'info@attaqwamasjid.org',
  website: 'https://attaqwamasjid.org',
  coordinates: {
    lat: 42.1015,
    lng: -72.5898,
  },
  socialMedia: {
    facebook: 'https://facebook.com/attaqwamasjid',
    twitter: 'https://twitter.com/attaqwamasjid',
    instagram: 'https://instagram.com/attaqwamasjid',
  },
} as const;

// ============================================================================
// PRAYER NAMES
// ============================================================================
export const PRAYER_NAMES = {
  FAJR: 'Fajr',
  DHUHR: 'Dhuhr',
  ASR: 'Asr',
  MAGHRIB: 'Maghrib',
  ISHA: 'Isha',
  JUMUAH: "Jumu'ah",
} as const;

// ============================================================================
// CACHE CONFIGURATION
// ============================================================================
export const CACHE_KEYS = {
  ANNOUNCEMENTS: 'announcements',
  EVENTS: 'events',
  PRAYER_TIMES: 'prayer-times',
  EDUCATION_CONTENT: 'education-content',
  USER_PROGRESS: 'user-progress',
} as const;

export const CACHE_TTL = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 15 * 60 * 1000, // 15 minutes
  LONG: 60 * 60 * 1000, // 1 hour
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format time in 12-hour format
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format date in readable format
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// ============================================================================
// TYPES - Export from shared-types
// ============================================================================
export type {
  ApiResponse,
  PaginatedResponse,
  ErrorResponse,
  Announcement,
  Event,
  PrayerTimes,
  AuthUser,
  LoginInput,
  RegisterInput,
  AgeTier,
  IslamicSubject,
  DifficultyLevel,
  EducationContentType,
} from '@attaqwa/shared-types';
