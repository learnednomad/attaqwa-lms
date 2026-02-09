/**
 * LMS Type Definitions (Shared with Mobile App)
 * Complete TypeScript interfaces for AttaqwaMasjid LMS System
 */

// ============================================================================
// Base Strapi Types
// ============================================================================

export interface StrapiMedia {
  id: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: Record<string, any>;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// ============================================================================
// User & Authentication Types
// ============================================================================

export interface User {
  id: string;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  role: UserRole;
  profile?: UserProfile;
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  type: 'authenticated' | 'teacher' | 'admin' | 'student' | 'parent';
}

export interface UserProfile {
  id: string;
  fullName: string;
  avatar?: StrapiMedia;
  bio?: string;
  dateOfBirth?: string;
  phone?: string;
  ageTier?: AgeTier;
}

export type AgeTier = 'children' | 'youth' | 'adults' | 'seniors';

// Runtime const for AgeTier
export const AgeTier = {
  CHILDREN: 'children' as const,
  YOUTH: 'youth' as const,
  ADULTS: 'adults' as const,
  SENIORS: 'seniors' as const,
} as const;

/**
 * Authentication types for website and admin apps
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

// ============================================================================
// Course Types
// ============================================================================

export type CourseCategory =
  | 'quran'
  | 'hadith'
  | 'fiqh'
  | 'seerah'
  | 'aqeedah'
  | 'general';

// Runtime const for CourseCategory
export const CourseCategory = {
  QURAN: 'quran' as const,
  HADITH: 'hadith' as const,
  FIQH: 'fiqh' as const,
  SEERAH: 'seerah' as const,
  AQEEDAH: 'aqeedah' as const,
  GENERAL: 'general' as const,
} as const;

export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';

// Runtime const for CourseDifficulty
export const CourseDifficulty = {
  BEGINNER: 'beginner' as const,
  INTERMEDIATE: 'intermediate' as const,
  ADVANCED: 'advanced' as const,
} as const;

// Alias for backward compatibility
export const DifficultyLevel = CourseDifficulty;

export interface Course {
  id: string;
  documentId?: string;
  title: string;
  description: string;
  category: CourseCategory;
  ageTier: AgeTier;
  difficulty: CourseDifficulty;
  coverImage?: StrapiMedia;
  instructor?: Instructor;
  lessons?: Lesson[];
  prerequisites?: Course[];
  isPublished: boolean;
  estimatedDuration: number; // in minutes
  certificates?: Certificate[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Instructor {
  id: string;
  name: string;
  bio?: string;
  photo?: StrapiMedia;
  qualifications?: string[];
  email?: string;
}

// ============================================================================
// Lesson Types
// ============================================================================

export type LessonType = 'article' | 'video' | 'audio' | 'quiz' | 'interactive';

// Runtime const for LessonType
export const LessonType = {
  ARTICLE: 'article' as const,
  VIDEO: 'video' as const,
  AUDIO: 'audio' as const,
  QUIZ: 'quiz' as const,
  INTERACTIVE: 'interactive' as const,
} as const;

export interface Lesson {
  id: string;
  documentId?: string;
  title: string;
  description?: string; // Short description of the lesson
  content: string; // Rich text content
  type: LessonType;
  course: Pick<Course, 'id' | 'title'>;
  order: number;
  duration: number; // in minutes
  media?: StrapiMedia;
  attachments?: StrapiMedia[];
  quiz?: Quiz;
  isLocked: boolean; // Requires previous lessons to be completed
  isRequired?: boolean; // Lesson is required for course completion
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Quiz Types
// ============================================================================

export interface Quiz {
  id: string;
  title: string;
  lesson: Pick<Lesson, 'id' | 'title'>;
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  passingScore: number; // 0-100
  randomizeQuestions: boolean;
  createdAt: string;
  updatedAt: string;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'fill_blank';

// Runtime const for QuestionType
export const QuestionType = {
  MULTIPLE_CHOICE: 'multiple_choice' as const,
  TRUE_FALSE: 'true_false' as const,
  FILL_BLANK: 'fill_blank' as const,
} as const;

export interface QuizQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options: string[] | { [key: string]: string }; // For multiple choice
  correctAnswer: string;
  explanation?: string; // Rich text
  points: number;
}

// ============================================================================
// Progress Tracking Types
// ============================================================================

export interface UserProgress {
  id: string;
  user: Pick<User, 'id' | 'username'>;
  lesson: Pick<Lesson, 'id' | 'title'>;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percentage: number; // 0-100
  time_spent_minutes: number;
  quiz_score?: number; // 0-100
  quiz_attempts?: number;
  last_accessed?: string;
  completed_at?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseEnrollment {
  id: string;
  user: Pick<User, 'id' | 'username'>;
  course: Course;
  enrollment_status: 'pending' | 'active' | 'completed' | 'dropped' | 'suspended';
  enrollment_date: string;
  completion_date?: string;
  overall_progress: number; // 0-100
  lessons_completed: number;
  quizzes_completed: number;
  average_quiz_score?: number;
  total_time_spent_minutes: number;
  last_activity_date?: string;
}

export interface ProgressStatsResponse {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalLessons: number;
  completedLessons: number;
  totalTimeSpent: number; // in minutes
  averageQuizScore: number; // 0-100
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
}

// ============================================================================
// Gamification Types
// ============================================================================

export type BadgeType = 'bronze' | 'silver' | 'gold' | 'platinum';
export type AchievementCategory =
  | 'course_completion'
  | 'quiz_mastery'
  | 'streak'
  | 'participation';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: StrapiMedia;
  criteria: AchievementCriteria;
  points: number;
  badgeType: BadgeType;
  category: AchievementCategory;
  createdAt: string;
  updatedAt: string;
}

export interface AchievementCriteria {
  type: 'course_completion' | 'quiz_score' | 'streak_days' | 'total_lessons';
  value: number;
  category?: CourseCategory;
}

export interface UserAchievement {
  id: string;
  user: Pick<User, 'id' | 'username'>;
  achievement: Achievement;
  earnedAt: string;
  progress: number; // 0-100
  metadata?: Record<string, any>;
}

export interface Leaderboard {
  user: string; // User ID
  username: string;
  avatar?: StrapiMedia;
  totalPoints: number;
  level: number;
  rank: number;
  achievements: number;
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
}

export interface LeaderboardFilters {
  category?: CourseCategory;
  period?: 'daily' | 'weekly' | 'monthly' | 'all_time';
  ageTier?: AgeTier;
  limit?: number;
}

export interface Streak {
  id: string;
  user: Pick<User, 'id' | 'username'>;
  type: 'daily_login' | 'lesson_completion';
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakStartDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Certificate Types
// ============================================================================

export interface Certificate {
  id: string;
  user: Pick<User, 'id' | 'username'>;
  course: Pick<Course, 'id' | 'title'>;
  issuedAt: string;
  certificateNumber: string;
  pdfUrl?: string;
  verificationCode: string;
}

// ============================================================================
// xAPI (Learning Analytics) Types
// ============================================================================

export interface XAPIStatement {
  actor: {
    account: {
      name: string; // User ID
      homePage: string; // App URL
    };
  };
  verb: {
    id: string; // e.g., "http://adlnet.gov/expapi/verbs/completed"
    display: { [language: string]: string };
  };
  object: {
    id: string; // Lesson/Course/Quiz ID
    definition: {
      name: { [language: string]: string };
      type: string; // Activity type
    };
  };
  result?: {
    completion?: boolean;
    success?: boolean;
    score?: {
      scaled: number; // 0-1
      raw: number;
      min: number;
      max: number;
    };
    duration?: string; // ISO 8601 duration
  };
  timestamp: string; // ISO 8601 datetime
}

// ============================================================================
// API Response Types
// ============================================================================

export interface CoursesResponse extends StrapiResponse<Course[]> {}
export interface CourseDetailResponse extends StrapiResponse<Course> {}
export interface LessonsResponse extends StrapiResponse<Lesson[]> {}
export interface QuizzesResponse extends StrapiResponse<Quiz[]> {}
export interface EnrollmentsResponse extends StrapiResponse<CourseEnrollment[]> {}

// ============================================================================
// Filter Types
// ============================================================================

export interface CourseFilters {
  category?: CourseCategory;
  ageTier?: AgeTier;
  difficulty?: CourseDifficulty;
  isPublished?: boolean;
  search?: string;
}

export interface LessonFilters {
  courseId?: string;
  type?: LessonType;
}

// ============================================================================
// Admin-Specific Types
// ============================================================================

export interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalLessons: number;
  totalQuizzes: number;
  activeEnrollments: number;
  completionRate: number;
  averageProgress: number;
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  user: Pick<User, 'id' | 'username'>;
  action: string;
  resource: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface CourseAnalytics {
  courseId: string;
  totalEnrollments: number;
  activeStudents: number;
  completionRate: number;
  averageTimeSpent: number;
  averageQuizScore: number;
  dropoutRate: number;
  lessonCompletionRates: {
    lessonId: string;
    lessonTitle: string;
    completionRate: number;
  }[];
}

// ============================================================================
// AI / Ollama Types
// ============================================================================

export interface ModerationResult {
  score: number;
  flags: ModerationFlag[];
  reasoning: string;
  recommendation: 'approve' | 'needs_review' | 'reject';
}

export interface ModerationFlag {
  type: 'ACCURACY' | 'AGE_APPROPRIATENESS' | 'CULTURAL_SENSITIVITY' | 'QUALITY' | 'SAFETY';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface TagSuggestion {
  subject: string;
  difficulty: string;
  ageTier: string;
  keywords: string[];
}

export type AIJobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface AIJob<T = any> {
  id: string;
  type: string;
  status: AIJobStatus;
  result?: T;
  error?: string;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
}

export interface SemanticSearchResult {
  contentType: string;
  contentId: string;
  title: string;
  snippet: string;
  score: number;
  metadata?: Record<string, any>;
}

export interface ContentRecommendation {
  courseId: string;
  title: string;
  description: string;
  score: number;
  reason: string;
  difficulty: CourseDifficulty;
  category: CourseCategory;
}

export interface ModerationQueueItem {
  id: string;
  contentType: string;
  contentId: string;
  contentTitle: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_review';
  aiScore: number;
  aiFlags: ModerationFlag[];
  aiReasoning: string;
  reviewer?: Pick<User, 'id' | 'username'>;
  reviewerNotes?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OllamaHealthStatus {
  available: boolean;
  enabled: boolean;
  baseUrl: string;
  model: string;
  models: string[];
}

// ============================================================================
// Masjid Admin Types
// ============================================================================

export type AnnouncementCategory = 'general' | 'ramadan' | 'eid' | 'urgent' | 'community' | 'fundraising';

export interface Announcement {
  id: string;
  documentId?: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  imageUrl?: string;
  imageAlt?: string;
  pdfUrl?: string;
  isActive: boolean;
  isPinned?: boolean;
  publishDate?: string;
  expiryDate?: string;
  author?: Pick<User, 'id' | 'username'>;
  createdAt: string;
  updatedAt: string;
}

export type EventCategory = 'lecture' | 'community' | 'youth' | 'sisters' | 'fundraiser' | 'other';

export interface MasjidEvent {
  id: string;
  documentId?: string;
  title: string;
  description: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  isIndoor?: boolean;
  isOutdoor?: boolean;
  imageUrl?: string;
  imageAlt?: string;
  isActive: boolean;
  isRecurring?: boolean;
  recurrencePattern?: string;
  maxAttendees?: number;
  category?: EventCategory;
  createdAt: string;
  updatedAt: string;
}

export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTimeOverride {
  id: string;
  documentId?: string;
  date: string;
  prayer: PrayerName;
  overrideTime: string;
  reason?: string;
  isActive: boolean;
  createdBy?: Pick<User, 'id' | 'username'>;
  createdAt: string;
  updatedAt: string;
}

export type ItikafDurationType = 'full' | 'last_ten' | 'weekend' | 'custom';
export type ItikafStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface ItikafRegistration {
  id: string;
  documentId?: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female';
  age: number;
  durationType: ItikafDurationType;
  startDate: string;
  endDate: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalConditions?: string;
  specialRequirements?: string;
  status: ItikafStatus;
  notes?: string;
  user?: Pick<User, 'id' | 'username'>;
  createdAt: string;
  updatedAt: string;
}

export type AppealCategory = 'zakat' | 'sadaqah' | 'building_fund' | 'emergency' | 'education' | 'community';

export interface Appeal {
  id: string;
  documentId?: string;
  title: string;
  description: string;
  category: AppealCategory;
  goalAmount?: number;
  currentAmount?: number;
  currency?: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  isFeatured?: boolean;
  imageUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
}
