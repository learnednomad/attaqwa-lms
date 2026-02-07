/**
 * Student Portal API Client
 * Connects student dashboard pages to Strapi backend via BFF endpoints
 */

import { API_V1_ENDPOINTS } from '@attaqwa/shared';

// Use BFF (Next.js API routes) instead of direct Strapi
const BFF_BASE_URL = '/api/v1';

// Types for API responses
export interface Course {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  age_tier: 'children' | 'youth' | 'adults' | 'seniors';
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks: number;
  schedule: string;
  instructor: string;
  is_featured: boolean;
  learning_outcomes: string[];
  max_students: number | null;
  current_enrollments: number;
  start_date: string | null;
  end_date: string | null;
  thumbnail?: {
    url: string;
    alternativeText?: string;
  };
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  lesson_order: number;
  lesson_type: 'video' | 'reading' | 'interactive' | 'audio';
  duration_minutes: number;
  content: string;
  video_url?: string;
  learning_objectives: string[];
  is_free: boolean;
  is_preview: boolean;
  course?: Course;
  quiz?: Quiz;
}

export interface Quiz {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  quiz_type: 'multiple_choice' | 'true_false' | 'mixed';
  time_limit_minutes: number;
  passing_score: number;
  max_attempts: number;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  question_type: 'multiple_choice' | 'true_false';
  options: string[];
  correct_answer: number | boolean;
  points: number;
  explanation?: string;
}

export interface Enrollment {
  id: number;
  documentId: string;
  enrollment_status: 'pending' | 'active' | 'completed' | 'dropped' | 'suspended';
  enrollment_date: string;
  completion_date?: string;
  overall_progress: number;
  lessons_completed: number;
  quizzes_completed: number;
  average_quiz_score?: number;
  total_time_spent_minutes: number;
  last_activity_date?: string;
  certificate_issued: boolean;
  certificate_url?: string;
  course: Course;
}

export interface UserProgress {
  id: number;
  documentId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percentage: number;
  time_spent_minutes: number;
  quiz_score?: number;
  quiz_attempts?: number;
  last_accessed?: string;
  completed_at?: string;
  lesson?: Lesson;
  quiz?: Quiz;
}

export interface Achievement {
  id: number;
  documentId: string;
  title: string;
  description: string;
  icon?: string;
  badge_image?: {
    url: string;
  };
  points: number;
  category: string;
  requirement_type: string;
  requirement_value: number;
}

export interface UserAchievement {
  id: number;
  documentId: string;
  earned_at: string;
  achievement: Achievement;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
    summary?: Record<string, number>;
    version?: string;
    timestamp?: string;
  };
}

/**
 * Generic fetch wrapper with cookie-based auth
 *
 * SECURITY: Authentication is handled via httpOnly cookies instead of localStorage
 * All requests include credentials: 'include' to send cookies
 */
async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(endpoint, {
    ...options,
    headers,
    // SECURITY: Include cookies for httpOnly token authentication
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.error?.message || error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============================================================================
// COURSES API
// ============================================================================
export const coursesApi = {
  /**
   * Get all available courses
   */
  getAll: async (params?: {
    age_tier?: string;
    subject?: string;
    difficulty?: string;
    featured?: boolean;
  }): Promise<ApiResponse<Course[]>> => {
    const searchParams = new URLSearchParams();
    if (params?.age_tier) searchParams.set('age_tier', params.age_tier);
    if (params?.subject) searchParams.set('subject', params.subject);
    if (params?.difficulty) searchParams.set('difficulty', params.difficulty);
    if (params?.featured) searchParams.set('featured', 'true');

    const query = searchParams.toString();
    const endpoint = query ? `${BFF_BASE_URL}/courses?${query}` : `${BFF_BASE_URL}/courses`;

    return fetchWithAuth<ApiResponse<Course[]>>(endpoint);
  },

  /**
   * Get course by ID or slug
   */
  getById: async (id: string): Promise<ApiResponse<Course>> => {
    return fetchWithAuth<ApiResponse<Course>>(`${BFF_BASE_URL}/courses/${id}`);
  },
};

// ============================================================================
// LESSONS API
// ============================================================================
export const lessonsApi = {
  /**
   * Get all lessons (optionally filter by course)
   */
  getAll: async (params?: {
    course_id?: string;
    is_free?: boolean;
  }): Promise<ApiResponse<Lesson[]>> => {
    const searchParams = new URLSearchParams();
    if (params?.course_id) searchParams.set('course_id', params.course_id);
    if (params?.is_free !== undefined) searchParams.set('is_free', String(params.is_free));

    const query = searchParams.toString();
    const endpoint = query ? `${BFF_BASE_URL}/lessons?${query}` : `${BFF_BASE_URL}/lessons`;

    return fetchWithAuth<ApiResponse<Lesson[]>>(endpoint);
  },

  /**
   * Get lesson by ID
   */
  getById: async (id: string): Promise<ApiResponse<Lesson>> => {
    return fetchWithAuth<ApiResponse<Lesson>>(`${BFF_BASE_URL}/lessons/${id}`);
  },
};

// ============================================================================
// QUIZZES API
// ============================================================================
export const quizzesApi = {
  /**
   * Get all quizzes
   */
  getAll: async (): Promise<ApiResponse<Quiz[]>> => {
    return fetchWithAuth<ApiResponse<Quiz[]>>(`${BFF_BASE_URL}/quizzes`);
  },

  /**
   * Get quiz by ID
   */
  getById: async (id: string): Promise<ApiResponse<Quiz>> => {
    return fetchWithAuth<ApiResponse<Quiz>>(`${BFF_BASE_URL}/quizzes/${id}`);
  },
};

// ============================================================================
// USER ENROLLMENTS API (Authenticated)
// ============================================================================
export const enrollmentsApi = {
  /**
   * Get current user's enrollments
   */
  getMine: async (params?: {
    status?: 'active' | 'completed' | 'dropped';
  }): Promise<ApiResponse<Enrollment[]> & { meta: { summary: Record<string, number> } }> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);

    const query = searchParams.toString();
    const endpoint = query
      ? `${BFF_BASE_URL}/users/me/enrollments?${query}`
      : `${BFF_BASE_URL}/users/me/enrollments`;

    return fetchWithAuth(endpoint);
  },

  /**
   * Enroll in a course
   */
  enroll: async (courseId: number): Promise<ApiResponse<Enrollment>> => {
    return fetchWithAuth<ApiResponse<Enrollment>>(`${BFF_BASE_URL}/users/me/enrollments`, {
      method: 'POST',
      body: JSON.stringify({ course: courseId }),
    });
  },

  /**
   * Update enrollment status (e.g., drop course)
   */
  updateStatus: async (
    enrollmentId: number,
    status: 'active' | 'completed' | 'dropped' | 'suspended'
  ): Promise<ApiResponse<Enrollment>> => {
    return fetchWithAuth<ApiResponse<Enrollment>>(
      `${BFF_BASE_URL}/users/me/enrollments/${enrollmentId}`,
      {
        method: 'PUT',
        body: JSON.stringify({ enrollment_status: status }),
      }
    );
  },
};

// ============================================================================
// USER PROGRESS API (Authenticated)
// ============================================================================
export const progressApi = {
  /**
   * Get current user's progress across all courses
   */
  getMine: async (params?: {
    course_id?: string;
    status?: 'not_started' | 'in_progress' | 'completed';
  }): Promise<ApiResponse<UserProgress[]>> => {
    const searchParams = new URLSearchParams();
    if (params?.course_id) searchParams.set('course_id', params.course_id);
    if (params?.status) searchParams.set('status', params.status);

    const query = searchParams.toString();
    const endpoint = query
      ? `${BFF_BASE_URL}/users/me/progress?${query}`
      : `${BFF_BASE_URL}/users/me/progress`;

    return fetchWithAuth(endpoint);
  },

  /**
   * Update lesson progress
   */
  updateLesson: async (
    lessonId: number,
    data: {
      status?: 'not_started' | 'in_progress' | 'completed';
      progress_percentage?: number;
      time_spent_minutes?: number;
    }
  ): Promise<ApiResponse<UserProgress>> => {
    return fetchWithAuth<ApiResponse<UserProgress>>(
      `${BFF_BASE_URL}/users/me/progress/lessons/${lessonId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Submit quiz answers
   */
  submitQuiz: async (
    quizId: number,
    answers: Record<string, number | boolean>
  ): Promise<ApiResponse<UserProgress & { score: number; passed: boolean }>> => {
    return fetchWithAuth(
      `${BFF_BASE_URL}/users/me/progress/quizzes/${quizId}/submit`,
      {
        method: 'POST',
        body: JSON.stringify({ answers }),
      }
    );
  },
};

// ============================================================================
// USER ACHIEVEMENTS API (Authenticated)
// ============================================================================
export const achievementsApi = {
  /**
   * Get all available achievements
   */
  getAll: async (): Promise<ApiResponse<Achievement[]>> => {
    return fetchWithAuth<ApiResponse<Achievement[]>>(`${BFF_BASE_URL}/achievements`);
  },

  /**
   * Get current user's earned achievements
   */
  getMine: async (): Promise<ApiResponse<UserAchievement[]>> => {
    return fetchWithAuth<ApiResponse<UserAchievement[]>>(`${BFF_BASE_URL}/users/me/achievements`);
  },
};

// ============================================================================
// STUDENT DASHBOARD AGGREGATED DATA
// ============================================================================
export interface StudentDashboardData {
  student: {
    id: number;
    name: string;
    email: string;
    username: string;
  };
  enrollments: {
    total: number;
    active: number;
    completed: number;
    certificates: number;
  };
  progress: {
    lessonsCompleted: number;
    totalLessons: number;
    quizzesCompleted: number;
    averageQuizScore: number;
    totalTimeSpentMinutes: number;
  };
  recentActivity: UserProgress[];
  upcomingDeadlines: Enrollment[];
  achievements: {
    earned: number;
    total: number;
    recent: UserAchievement[];
  };
}

export const dashboardApi = {
  /**
   * Get aggregated dashboard data
   * Combines multiple API calls into a single dashboard response
   */
  getData: async (): Promise<StudentDashboardData> => {
    try {
      // Parallel fetch all required data
      const [enrollmentsRes, progressRes, achievementsRes] = await Promise.all([
        enrollmentsApi.getMine(),
        progressApi.getMine(),
        achievementsApi.getMine(),
      ]);

      const enrollments = enrollmentsRes.data || [];
      const progress = progressRes.data || [];
      const achievements = achievementsRes.data || [];

      // Calculate aggregates
      const activeEnrollments = enrollments.filter(e => e.enrollment_status === 'active');
      const completedEnrollments = enrollments.filter(e => e.enrollment_status === 'completed');
      const certificatesIssued = enrollments.filter(e => e.certificate_issued);

      const completedLessons = progress.filter(p => p.status === 'completed' && p.lesson);
      const quizProgress = progress.filter(p => p.quiz_score !== undefined);
      const avgQuizScore = quizProgress.length > 0
        ? quizProgress.reduce((sum, p) => sum + (p.quiz_score || 0), 0) / quizProgress.length
        : 0;
      const totalTime = progress.reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0);

      // SECURITY: Student info should come from the API, not localStorage
      // The API endpoints use httpOnly cookies for authentication
      const studentData = { id: 0, name: 'Student', email: '', username: '' };

      return {
        student: {
          id: studentData.id || 0,
          name: studentData.name || studentData.username || 'Student',
          email: studentData.email || '',
          username: studentData.username || '',
        },
        enrollments: {
          total: enrollments.length,
          active: activeEnrollments.length,
          completed: completedEnrollments.length,
          certificates: certificatesIssued.length,
        },
        progress: {
          lessonsCompleted: completedLessons.length,
          totalLessons: progress.filter(p => p.lesson).length,
          quizzesCompleted: quizProgress.filter(p => p.status === 'completed').length,
          averageQuizScore: Math.round(avgQuizScore),
          totalTimeSpentMinutes: totalTime,
        },
        recentActivity: progress
          .filter(p => p.last_accessed)
          .sort((a, b) => new Date(b.last_accessed!).getTime() - new Date(a.last_accessed!).getTime())
          .slice(0, 5),
        upcomingDeadlines: activeEnrollments
          .filter(e => e.course?.end_date)
          .sort((a, b) => new Date(a.course.end_date!).getTime() - new Date(b.course.end_date!).getTime())
          .slice(0, 3),
        achievements: {
          earned: achievements.length,
          total: 0, // Would need separate call to get all achievements
          recent: achievements.slice(0, 3),
        },
      };
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      throw error;
    }
  },
};

// ============================================================================
// EXPORT COMBINED API
// ============================================================================
export const studentApi = {
  courses: coursesApi,
  lessons: lessonsApi,
  quizzes: quizzesApi,
  enrollments: enrollmentsApi,
  progress: progressApi,
  achievements: achievementsApi,
  dashboard: dashboardApi,
};

export default studentApi;
