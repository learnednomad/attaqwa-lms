/**
 * Teacher Portal API Client
 * Connects teacher dashboard pages to Strapi backend via BFF endpoints
 */

import { Course, Lesson, Quiz, Enrollment, UserProgress, Achievement } from './student-api';

const BFF_BASE_URL = '/api/v1';

// Teacher-specific types
export interface TeacherCourse extends Course {
  total_students: number;
  average_progress: number;
  completion_rate: number;
  pending_assignments: number;
}

export interface StudentEnrollment extends Enrollment {
  student: {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface AssignmentSubmission {
  id: number;
  documentId: string;
  student_id: number;
  student_name: string;
  student_email: string;
  assignment_title: string;
  submitted_at: string;
  grade?: number;
  feedback?: string;
  status: 'pending' | 'graded' | 'returned';
}

export interface TeacherDashboardData {
  teacher: {
    id: number;
    name: string;
    email: string;
    title: string;
  };
  courses: {
    total: number;
    active: number;
    totalStudents: number;
    averageCompletion: number;
  };
  students: {
    total: number;
    activeThisWeek: number;
    needingAttention: number;
  };
  assignments: {
    pendingGrading: number;
    recentSubmissions: AssignmentSubmission[];
  };
  recentActivity: {
    type: 'enrollment' | 'submission' | 'completion' | 'question';
    message: string;
    timestamp: string;
    student_name: string;
    course_title: string;
  }[];
}

// Get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('teacherToken') || localStorage.getItem('auth_token');
}

// Generic fetch wrapper with auth
async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.error?.message || error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// API Response wrapper
interface ApiResponse<T> {
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

// ============================================================================
// TEACHER COURSES API
// ============================================================================
export const teacherCoursesApi = {
  /**
   * Get courses taught by the teacher
   */
  getMyCourses: async (): Promise<ApiResponse<TeacherCourse[]>> => {
    // For now, get all courses - in production, filter by teacher
    return fetchWithAuth<ApiResponse<TeacherCourse[]>>(`${BFF_BASE_URL}/courses`);
  },

  /**
   * Get course details with enrollments
   */
  getCourseDetails: async (courseId: string): Promise<ApiResponse<TeacherCourse & { enrollments: StudentEnrollment[] }>> => {
    return fetchWithAuth(`${BFF_BASE_URL}/courses/${courseId}?populate=enrollments`);
  },

  /**
   * Update course details
   */
  updateCourse: async (courseId: string, data: Partial<Course>): Promise<ApiResponse<Course>> => {
    return fetchWithAuth(`${BFF_BASE_URL}/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
  },
};

// ============================================================================
// TEACHER STUDENTS API
// ============================================================================
export const teacherStudentsApi = {
  /**
   * Get all students in teacher's courses
   */
  getMyStudents: async (courseId?: string): Promise<ApiResponse<StudentEnrollment[]>> => {
    const params = courseId ? `?course_id=${courseId}` : '';
    // Use enrollments endpoint to get students
    return fetchWithAuth(`${BFF_BASE_URL}/users/me/enrollments${params}`);
  },

  /**
   * Get student progress details
   */
  getStudentProgress: async (studentId: string, courseId?: string): Promise<ApiResponse<UserProgress[]>> => {
    const params = courseId ? `?course_id=${courseId}` : '';
    return fetchWithAuth(`${BFF_BASE_URL}/users/me/progress${params}`);
  },
};

// ============================================================================
// TEACHER GRADES API
// ============================================================================
export const teacherGradesApi = {
  /**
   * Get all submissions pending grading
   */
  getPendingSubmissions: async (): Promise<ApiResponse<AssignmentSubmission[]>> => {
    // Would need custom endpoint - return mock for now
    return { data: [] };
  },

  /**
   * Grade a submission
   */
  gradeSubmission: async (
    submissionId: string,
    data: { grade: number; feedback?: string }
  ): Promise<ApiResponse<AssignmentSubmission>> => {
    return fetchWithAuth(`${BFF_BASE_URL}/submissions/${submissionId}/grade`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update student progress/grade
   */
  updateStudentGrade: async (
    progressId: string,
    data: { quiz_score?: number; status?: string }
  ): Promise<ApiResponse<UserProgress>> => {
    return fetchWithAuth(`${BFF_BASE_URL}/user-progress/${progressId}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
  },
};

// ============================================================================
// TEACHER LESSONS API
// ============================================================================
export const teacherLessonsApi = {
  /**
   * Get lessons for a course
   */
  getCourseLessons: async (courseId: string): Promise<ApiResponse<Lesson[]>> => {
    return fetchWithAuth(`${BFF_BASE_URL}/lessons?course_id=${courseId}`);
  },

  /**
   * Create a new lesson
   */
  createLesson: async (data: Partial<Lesson>): Promise<ApiResponse<Lesson>> => {
    return fetchWithAuth(`${BFF_BASE_URL}/lessons`, {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  },

  /**
   * Update a lesson
   */
  updateLesson: async (lessonId: string, data: Partial<Lesson>): Promise<ApiResponse<Lesson>> => {
    return fetchWithAuth(`${BFF_BASE_URL}/lessons/${lessonId}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
  },
};

// ============================================================================
// TEACHER ANALYTICS API
// ============================================================================
export const teacherAnalyticsApi = {
  /**
   * Get course analytics
   */
  getCourseAnalytics: async (courseId: string): Promise<{
    enrollmentTrend: { date: string; count: number }[];
    completionRate: number;
    averageScore: number;
    activeStudents: number;
    lessonEngagement: { lesson: string; views: number; completions: number }[];
  }> => {
    // Would need custom analytics endpoint
    return {
      enrollmentTrend: [],
      completionRate: 0,
      averageScore: 0,
      activeStudents: 0,
      lessonEngagement: [],
    };
  },
};

// ============================================================================
// TEACHER DASHBOARD API
// ============================================================================
export const teacherDashboardApi = {
  /**
   * Get aggregated dashboard data
   */
  getData: async (): Promise<TeacherDashboardData> => {
    try {
      // Fetch courses and calculate stats
      const coursesRes = await teacherCoursesApi.getMyCourses();
      const courses = coursesRes.data || [];

      // Get teacher data from localStorage
      const teacherData = typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('teacherData') || '{}')
        : {};

      // Calculate totals
      const totalStudents = courses.reduce((sum, c) => sum + (c.current_enrollments || 0), 0);

      return {
        teacher: {
          id: teacherData.id || 0,
          name: teacherData.username || teacherData.name || 'Teacher',
          email: teacherData.email || '',
          title: teacherData.title || 'Instructor',
        },
        courses: {
          total: courses.length,
          active: courses.filter(c => !c.end_date || new Date(c.end_date) > new Date()).length,
          totalStudents,
          averageCompletion: 0, // Would need enrollment data
        },
        students: {
          total: totalStudents,
          activeThisWeek: Math.floor(totalStudents * 0.7), // Estimate
          needingAttention: Math.floor(totalStudents * 0.1), // Estimate
        },
        assignments: {
          pendingGrading: 0,
          recentSubmissions: [],
        },
        recentActivity: [],
      };
    } catch (error) {
      console.error('Failed to fetch teacher dashboard data:', error);
      throw error;
    }
  },
};

// ============================================================================
// EXPORT COMBINED API
// ============================================================================
export const teacherApi = {
  courses: teacherCoursesApi,
  students: teacherStudentsApi,
  grades: teacherGradesApi,
  lessons: teacherLessonsApi,
  analytics: teacherAnalyticsApi,
  dashboard: teacherDashboardApi,
};

export default teacherApi;
