/**
 * Strapi API Client for AttaqwaMasjid LMS
 * Handles all communication with Strapi v5 backend
 */

// Strapi base URL
const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_BASE = `${STRAPI_BASE}/api/v1`;

// ============================================================================
// Type Definitions
// ============================================================================

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiEntity {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Course extends StrapiEntity {
  title: string;
  slug: string;
  description: string;
  subject: string;
  age_tier: string;
  difficulty: string; // Changed from difficulty_level to match Strapi
  duration_weeks: number; // Changed from estimated_duration to match Strapi
  thumbnail?: any; // Changed from thumbnail_url to match Strapi media object
  prerequisites?: string[];
  learning_objectives?: string[];
  lessons?: Lesson[];
  instructor?: string;
  is_featured?: boolean;
}

export interface Lesson extends StrapiEntity {
  title: string;
  slug: string;
  description: string;
  content: string;
  content_type: string;
  order_index: number;
  duration_minutes: number;
  media_url?: string;
  course?: Course;
  quiz?: Quiz;
}

export interface Quiz extends StrapiEntity {
  title: string;
  description: string;
  passing_score: number;
  time_limit_minutes?: number;
  questions: QuizQuestion[];
  lesson?: Lesson;
}

export interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correct_answer: string;
  explanation?: string;
  points: number;
}

export interface Enrollment extends StrapiEntity {
  enrollment_status: 'pending' | 'active' | 'completed' | 'dropped' | 'suspended';
  overall_progress: number;
  enrollment_date: string;
  completion_date?: string;
  lessons_completed: number;
  quizzes_completed: number;
  average_quiz_score?: number;
  total_time_spent_minutes: number;
  last_activity_date?: string;
  user: any;
  course: Course;
}

export interface LessonProgress extends StrapiEntity {
  completed: boolean;
  time_spent_minutes: number;
  quiz_score?: number;
  quiz_attempts: number;
  last_accessed_at: string;
  enrollment: Enrollment;
  lesson: Lesson;
}

// ============================================================================
// Query Builder Utilities
// ============================================================================

interface StrapiFilters {
  [key: string]: any;
}

interface StrapiQueryParams {
  filters?: StrapiFilters;
  populate?: string | string[] | Record<string, any>;
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
  sort?: string | string[];
  fields?: string[];
}

function buildStrapiQuery(params: StrapiQueryParams): string {
  const searchParams = new URLSearchParams();

  // Build filters: filters[field][$operator]=value
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (typeof value === 'object' && !Array.isArray(value)) {
        // Nested operator: { $eq: 'value' }
        Object.entries(value).forEach(([operator, operatorValue]) => {
          searchParams.append(`filters[${key}][${operator}]`, String(operatorValue));
        });
      } else if (Array.isArray(value)) {
        // Array value: filters[field][$in][0]=val1&filters[field][$in][1]=val2
        value.forEach((val, index) => {
          searchParams.append(`filters[${key}][$in][${index}]`, String(val));
        });
      } else {
        // Simple equality
        searchParams.append(`filters[${key}][$eq]`, String(value));
      }
    });
  }

  // Build populate
  if (params.populate) {
    if (typeof params.populate === 'string') {
      searchParams.append('populate', params.populate);
    } else if (Array.isArray(params.populate)) {
      params.populate.forEach((field, index) => {
        searchParams.append(`populate[${index}]`, field);
      });
    } else {
      // Deep populate with nested structure
      Object.entries(params.populate).forEach(([key, value]) => {
        if (typeof value === 'object') {
          searchParams.append(`populate[${key}][populate]`, '*');
        } else {
          searchParams.append(`populate[${key}]`, String(value));
        }
      });
    }
  }

  // Build pagination
  if (params.pagination) {
    if (params.pagination.page !== undefined) {
      searchParams.append('pagination[page]', String(params.pagination.page));
    }
    if (params.pagination.pageSize !== undefined) {
      searchParams.append('pagination[pageSize]', String(params.pagination.pageSize));
    }
    if (params.pagination.start !== undefined) {
      searchParams.append('pagination[start]', String(params.pagination.start));
    }
    if (params.pagination.limit !== undefined) {
      searchParams.append('pagination[limit]', String(params.pagination.limit));
    }
  }

  // Build sort
  if (params.sort) {
    if (typeof params.sort === 'string') {
      searchParams.append('sort', params.sort);
    } else if (Array.isArray(params.sort)) {
      params.sort.forEach((sortField, index) => {
        searchParams.append(`sort[${index}]`, sortField);
      });
    }
  }

  // Build fields selection
  if (params.fields) {
    params.fields.forEach((field, index) => {
      searchParams.append(`fields[${index}]`, field);
    });
  }

  return searchParams.toString();
}

async function fetchStrapi<T>(
  endpoint: string,
  queryParams?: StrapiQueryParams,
  options?: RequestInit
): Promise<StrapiResponse<T>> {
  const query = queryParams ? buildStrapiQuery(queryParams) : '';
  const url = `${API_BASE}${endpoint}${query ? `?${query}` : ''}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `Strapi API error: ${response.status}`);
  }

  return response.json();
}

// ============================================================================
// Courses API
// ============================================================================

export const coursesApi = {
  /**
   * Get all courses with optional filtering
   */
  getAll: async (filters?: {
    subject?: string;
    age_tier?: string;
    difficulty?: string; // Changed from difficulty_level to match Strapi
    search?: string;
  }): Promise<StrapiResponse<Course[]>> => {
    const strapiFilters: StrapiFilters = {};

    if (filters?.subject) {
      strapiFilters.subject = { $eq: filters.subject };
    }
    if (filters?.age_tier) {
      strapiFilters.age_tier = { $eq: filters.age_tier };
    }
    if (filters?.difficulty) {
      strapiFilters.difficulty = { $eq: filters.difficulty }; // Changed from difficulty_level
    }
    if (filters?.search) {
      strapiFilters.$or = [
        { title: { $containsi: filters.search } },
        { description: { $containsi: filters.search } },
      ];
    }

    return fetchStrapi<Course[]>('/courses', {
      filters: strapiFilters,
      populate: ['lessons'],
      sort: ['createdAt:desc'],
      pagination: { pageSize: 100 },
    });
  },

  /**
   * Get course by slug with lessons populated
   */
  getBySlug: async (slug: string): Promise<Course | null> => {
    const response = await fetchStrapi<Course[]>('/courses', {
      filters: { slug: { $eq: slug } },
      populate: {
        lessons: {
          populate: ['quiz'],
        },
      },
    });

    return response.data[0] || null;
  },

  /**
   * Get course by ID
   */
  getById: async (id: string): Promise<Course> => {
    const response = await fetchStrapi<Course>(`/courses/${id}`, {
      populate: {
        lessons: {
          populate: ['quiz'],
        },
      },
    });

    return response.data;
  },

  /**
   * Get course with full details including all lessons and quizzes
   */
  getWithDetails: async (slug: string): Promise<Course | null> => {
    const response = await fetchStrapi<Course[]>('/courses', {
      filters: { slug: { $eq: slug } },
      populate: {
        lessons: {
          populate: {
            quiz: {
              populate: '*',
            },
          },
        },
      },
    });

    return response.data[0] || null;
  },
};

// ============================================================================
// Lessons API
// ============================================================================

export const lessonsApi = {
  /**
   * Get lesson by slug
   */
  getBySlug: async (slug: string): Promise<Lesson | null> => {
    const response = await fetchStrapi<Lesson[]>('/lessons', {
      filters: { slug: { $eq: slug } },
      populate: {
        course: true,
        quiz: {
          populate: '*',
        },
      },
    });

    return response.data[0] || null;
  },

  /**
   * Get lesson by ID
   */
  getById: async (id: string): Promise<Lesson> => {
    const response = await fetchStrapi<Lesson>(`/lessons/${id}`, {
      populate: {
        course: true,
        quiz: {
          populate: '*',
        },
      },
    });

    return response.data;
  },

  /**
   * Get all lessons for a course
   */
  getByCourse: async (courseSlug: string): Promise<Lesson[]> => {
    const response = await fetchStrapi<Lesson[]>('/lessons', {
      filters: {
        course: {
          slug: { $eq: courseSlug },
        },
      },
      populate: ['quiz'],
      sort: ['order_index:asc'],
    });

    return response.data;
  },
};

// ============================================================================
// Quizzes API
// ============================================================================

/**
 * Transform Strapi quiz questions to frontend format
 */
function transformQuizQuestions(strapiQuestions: any[]): QuizQuestion[] {
  return strapiQuestions.map((q, index) => ({
    id: `q-${index}`, // Generate ID using index
    question_text: q.question, // Map 'question' to 'question_text'
    question_type: q.type?.toLowerCase() as 'multiple_choice' | 'true_false' | 'short_answer', // Convert MULTIPLE_CHOICE to multiple_choice
    options: q.options,
    correct_answer: q.correct_answer,
    explanation: q.explanation,
    points: q.points || 10, // Default to 10 points if not specified
  }));
}

export const quizzesApi = {
  /**
   * Get quiz by ID
   */
  getById: async (id: string): Promise<Quiz> => {
    const response = await fetchStrapi<any>(`/quizzes/${id}`, {
      populate: {
        lesson: {
          populate: ['course'],
        },
      },
    });

    // Transform questions to match frontend interface
    const quiz = response.data;
    if (quiz.questions) {
      quiz.questions = transformQuizQuestions(quiz.questions);
    }

    return quiz as Quiz;
  },

  /**
   * Get quiz for a lesson
   */
  getByLesson: async (lessonSlug: string): Promise<Quiz | null> => {
    const response = await fetchStrapi<any[]>('/quizzes', {
      filters: {
        lesson: {
          slug: { $eq: lessonSlug },
        },
      },
      populate: {
        lesson: {
          populate: ['course'],
        },
      },
    });

    // Transform questions to match frontend interface
    const quiz = response.data[0];
    if (quiz && quiz.questions) {
      quiz.questions = transformQuizQuestions(quiz.questions);
    }

    return quiz as Quiz || null;
  },
};

// ============================================================================
// Enrollments API
// ============================================================================

export const enrollmentsApi = {
  /**
   * Get all enrollments for current user
   */
  getMy: async (userId: string): Promise<StrapiResponse<Enrollment[]>> => {
    return fetchStrapi<Enrollment[]>('/enrollments', {
      filters: {
        user: { id: { $eq: userId } },
      },
      populate: {
        course: {
          populate: ['lessons'],
        },
      },
      sort: ['createdAt:desc'],
    });
  },

  /**
   * Get enrollment for specific course
   */
  getByCourse: async (userId: string, courseSlug: string): Promise<Enrollment | null> => {
    const response = await fetchStrapi<Enrollment[]>('/enrollments', {
      filters: {
        user: { id: { $eq: userId } },
        course: { slug: { $eq: courseSlug } },
      },
      populate: {
        course: true,
      },
    });

    return response.data[0] || null;
  },

  /**
   * Create new enrollment
   */
  create: async (userId: string, courseId: string): Promise<Enrollment> => {
    const response = await fetch(`${API_BASE}/enrollments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          user: userId,
          course: courseId,
          enrollment_status: 'active',
          overall_progress: 0,
          enrollment_date: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create enrollment');
    }

    const result = await response.json();
    return result.data;
  },
};

// ============================================================================
// Lesson Progress API
// ============================================================================

export const lessonProgressApi = {
  /**
   * Get progress for a specific lesson
   */
  getByLesson: async (
    enrollmentId: string,
    lessonId: string
  ): Promise<LessonProgress | null> => {
    const response = await fetchStrapi<LessonProgress[]>('/lesson-progresses', {
      filters: {
        enrollment: { id: { $eq: enrollmentId } },
        lesson: { id: { $eq: lessonId } },
      },
      populate: {
        lesson: true,
        enrollment: true,
      },
    });

    return response.data[0] || null;
  },

  /**
   * Update lesson progress
   */
  update: async (
    progressId: string,
    updates: Partial<{
      completed: boolean;
      time_spent_minutes: number;
      quiz_score: number;
      quiz_attempts: number;
    }>
  ): Promise<LessonProgress> => {
    const response = await fetch(`${API_BASE}/lesson-progresses/${progressId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          ...updates,
          last_accessed_at: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update lesson progress');
    }

    const result = await response.json();
    return result.data;
  },

  /**
   * Create new lesson progress entry
   */
  create: async (enrollmentId: string, lessonId: string): Promise<LessonProgress> => {
    const response = await fetch(`${API_BASE}/lesson-progresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          enrollment: enrollmentId,
          lesson: lessonId,
          completed: false,
          time_spent_minutes: 0,
          quiz_attempts: 0,
          last_accessed_at: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create lesson progress');
    }

    const result = await response.json();
    return result.data;
  },
};

// ============================================================================
// AI API
// ============================================================================

export const aiApi = {
  /**
   * Health check for AI service
   */
  getHealth: async () => {
    const response = await fetch(`${API_BASE}/ai/health`);
    if (!response.ok) return null;
    const json = await response.json();
    return json.data;
  },

  /**
   * Semantic search across all content
   */
  search: async (query: string, contentType?: string, limit?: number) => {
    const response = await fetch(`${API_BASE}/ai/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, contentType, limit: limit || 10 }),
    });
    if (!response.ok) return [];
    const json = await response.json();
    return json.data || [];
  },

  /**
   * Get AI summary for content
   */
  summarize: async (content: string) => {
    const response = await fetch(`${API_BASE}/ai/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) return null;
    const json = await response.json();
    return json.data?.summary || null;
  },

  /**
   * Get personalized recommendations for authenticated user
   */
  getRecommendations: async (token: string, limit?: number) => {
    const response = await fetch(
      `${API_BASE}/ai/recommend?limit=${limit || 5}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) return [];
    const json = await response.json();
    return json.data || [];
  },
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate course progress based on completed lessons
 */
export function calculateCourseProgress(
  completedLessons: number,
  totalLessons: number
): number {
  if (totalLessons === 0) return 0;
  return Math.round((completedLessons / totalLessons) * 100);
}

/**
 * Format duration in minutes to human-readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

/**
 * Get age tier display name
 */
export function getAgeTierLabel(ageTier: string): string {
  const labels: Record<string, string> = {
    preschool: 'Preschool',
    elementary: 'Elementary',
    middle_school: 'Middle School',
    high_school: 'High School',
    college: 'College',
    adults: 'Adults',
    seniors: 'Seniors',
  };
  return labels[ageTier] || ageTier;
}

/**
 * Get subject display name
 */
export function getSubjectLabel(subject: string): string {
  const labels: Record<string, string> = {
    quran: 'Quran',
    hadith: 'Hadith',
    fiqh: 'Fiqh',
    aqeedah: 'Aqeedah',
    seerah: 'Seerah',
    arabic: 'Arabic',
    islamic_history: 'Islamic History',
    akhlaq: 'Akhlaq',
  };
  return labels[subject] || subject;
}

/**
 * Get difficulty level display
 */
export function getDifficultyLabel(level: string): string {
  const labels: Record<string, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };
  return labels[level] || level;
}
