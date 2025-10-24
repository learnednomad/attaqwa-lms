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

export type AgeTier = 'children' | 'youth' | 'adults' | 'all';

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

export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';

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

export interface Lesson {
  id: string;
  documentId?: string;
  title: string;
  content: string; // Rich text content
  type: LessonType;
  course: Pick<Course, 'id' | 'title'>;
  order: number;
  duration: number; // in minutes
  media?: StrapiMedia;
  attachments?: StrapiMedia[];
  quiz?: Quiz;
  isLocked: boolean; // Requires previous lessons to be completed
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
  progress: number; // 0-100
  completed: boolean;
  quizScore?: number; // 0-100
  timeSpent: number; // in minutes
  lastAccessed: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseEnrollment {
  id: string;
  user: Pick<User, 'id' | 'username'>;
  course: Course;
  enrolledAt: string;
  completedAt?: string;
  status: 'enrolled' | 'in_progress' | 'completed' | 'dropped';
  progress: number; // 0-100
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
