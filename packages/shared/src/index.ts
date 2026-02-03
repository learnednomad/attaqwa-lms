// ============================================================================
// API VERSION CONFIGURATION
// ============================================================================
export const API_CONFIG = {
  CURRENT_VERSION: 'v1',
  SUPPORTED_VERSIONS: ['v1'] as const,
  DEPRECATION_DATE: '2025-12-01', // 12 months deprecation period
} as const;

// ============================================================================
// API ENDPOINTS - VERSIONED (v1) - RECOMMENDED
// ============================================================================
export const API_V1_ENDPOINTS = {
  // Auth (Strapi standard - no version prefix needed)
  LOGIN: '/api/auth/local',
  REGISTER: '/api/auth/local/register',
  ME: '/api/users/me',
  LOGOUT: '/api/auth/logout',

  // LMS Core Resources
  COURSES: '/api/v1/courses',
  LESSONS: '/api/v1/lessons',
  QUIZZES: '/api/v1/quizzes',
  ACHIEVEMENTS: '/api/v1/achievements',
  LEADERBOARDS: '/api/v1/leaderboards',
  STREAKS: '/api/v1/streaks',

  // User-Centric Resources
  USER_PROGRESS: '/api/v1/users/me/progress',
  USER_ENROLLMENTS: '/api/v1/users/me/enrollments',
  USER_ACHIEVEMENTS: '/api/v1/users/me/achievements',

  // Islamic Content (flattened hierarchy)
  PRAYER_TIMES: '/api/v1/prayer-times',
  PRAYER_TIMES_WEEK: '/api/v1/prayer-times/week',
  PRAYER_TIMES_MONTH: '/api/v1/prayer-times/month',
  AYAHS: '/api/v1/ayahs',
  AYAH_DAILY: '/api/v1/ayahs/daily',
  HADITHS: '/api/v1/hadiths',
  HIJRI_CALENDAR: '/api/v1/hijri-calendar',

  // Community Resources
  ANNOUNCEMENTS: '/api/v1/announcements',
  EVENTS: '/api/v1/events',
  EDUCATION_CONTENT: '/api/v1/education-contents',

  // AI Endpoints
  AI_HEALTH: '/api/v1/ai/health',
  AI_MODERATE: '/api/v1/ai/moderate',
  AI_SUMMARIZE: '/api/v1/ai/summarize',
  AI_GENERATE_TAGS: '/api/v1/ai/generate-tags',
  AI_GENERATE_QUIZ: '/api/v1/ai/generate-quiz',
  AI_JOB: '/api/v1/ai/jobs', // Append /:jobId
  AI_SEARCH: '/api/v1/ai/search',
  AI_RECOMMEND: '/api/v1/ai/recommend',

  // Moderation Queue
  MODERATION_QUEUE: '/api/v1/moderation-queues',
} as const;

// ============================================================================
// API ENDPOINTS - LEGACY (deprecated, will be removed 2025-12-01)
// ============================================================================
/**
 * @deprecated Use API_V1_ENDPOINTS instead. Legacy endpoints will be removed in v2.0 (Dec 2025).
 * Migration guide: docs/api-migration-plan.md
 */
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
  name: 'Masjid At-Taqwa',
  address: '2674 Woodwin Rd',
  city: 'Doraville',
  province: 'GA',
  postalCode: '30360',
  phone: '(678) 896-9257',
  email: 'Mohammad30360@hotmail.com',
  schoolEmail: 'Attaqwa.du@gmail.com',
  website: 'https://masjidattaqwaatlanta.org',
  coordinates: {
    lat: 33.9114,
    lng: -84.2614,
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
  AI_SUMMARY: 'ai-summary',
  AI_TAGS: 'ai-tags',
  AI_SEARCH: 'ai-search',
  AI_RECOMMENDATIONS: 'ai-recommendations',
  AI_MODERATION: 'ai-moderation',
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
  // Base types
  StrapiResponse,
  StrapiMedia,

  // User types
  User,
  UserRole,
  UserProfile,

  // Auth types
  AuthUser,
  LoginInput,
  RegisterInput,

  // Course types
  Course,
  Instructor,

  // Lesson types
  Lesson,

  // Quiz types
  Quiz,
  QuizQuestion,

  // Progress types
  UserProgress,
  CourseEnrollment,
  ProgressStatsResponse,

  // Response types
  CoursesResponse,
  CourseDetailResponse,
  LessonsResponse,
  QuizzesResponse,
  EnrollmentsResponse,

  // Filter types
  CourseFilters,
  LessonFilters,

  // AI types
  ModerationResult,
  ModerationFlag,
  TagSuggestion,
  AIJobStatus,
  AIJob,
  SemanticSearchResult,
  ContentRecommendation,
  ModerationQueueItem,
  OllamaHealthStatus,
} from '@attaqwa/shared-types';

// Export runtime const objects for enum-like usage
export {
  AgeTier,
  CourseCategory,
  CourseDifficulty,
  DifficultyLevel,
  LessonType,
  QuestionType,
} from '@attaqwa/shared-types';

// ============================================================================
// FEATURE FLAGS
// ============================================================================
export { FeatureFlagService } from './feature-flags';
