/**
 * Admin Statistics API
 * Fetches real data from Strapi API for dashboard, students, and analytics pages
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3003';

interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

interface StrapiResponse<T> {
  data: T[];
  meta: { pagination: PaginationMeta };
}

async function strapiGet<T>(endpoint: string, params?: Record<string, string>): Promise<StrapiResponse<T>> {
  const url = new URL(`${API_URL}/api/v1/${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getResourceCount(resource: string): Promise<number> {
  const data = await strapiGet(resource, { 'pagination[pageSize]': '1' });
  return data.meta.pagination.total;
}

export interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalLessons: number;
  totalEnrollments: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [courses, lessons, enrollments] = await Promise.all([
    getResourceCount('courses'),
    getResourceCount('lessons'),
    getResourceCount('course-enrollments'),
  ]);

  // Get user count from BetterAuth admin API
  let totalUsers = 0;
  try {
    const res = await fetch(`${AUTH_URL}/api/auth/admin/list-users`, {
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      totalUsers = data?.users?.length ?? 0;
    }
  } catch {
    // Fallback: count from Strapi if auth endpoint unavailable
  }

  return {
    totalUsers,
    totalCourses: courses,
    totalLessons: lessons,
    totalEnrollments: enrollments,
  };
}

export interface CourseWithStats {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  subject: string;
  difficulty: string;
  age_tier: string;
  instructor: string;
  current_enrollments: number;
  duration_weeks: number;
  publishedAt: string | null;
  createdAt: string;
  lessons?: { id: number }[];
}

export async function getCoursesWithStats(): Promise<CourseWithStats[]> {
  const data = await strapiGet<CourseWithStats>('courses', {
    'pagination[pageSize]': '100',
    'sort': 'current_enrollments:desc',
    'populate[0]': 'lessons',
  });
  return data.data;
}

export async function getRecentEnrollments(): Promise<any[]> {
  const data = await strapiGet<any>('course-enrollments', {
    'pagination[pageSize]': '10',
    'sort': 'createdAt:desc',
    'populate[0]': 'user',
    'populate[1]': 'course',
  });
  return data.data;
}

export async function getRecentProgress(): Promise<any[]> {
  const data = await strapiGet<any>('user-progresses', {
    'pagination[pageSize]': '10',
    'sort': 'updatedAt:desc',
    'populate[0]': 'user',
    'populate[1]': 'lesson',
  });
  return data.data;
}

export async function getLessonsWithStats(): Promise<any[]> {
  const data = await strapiGet<any>('lessons', {
    'pagination[pageSize]': '100',
    'sort': 'createdAt:desc',
    'populate[0]': 'course',
  });
  return data.data;
}

export async function getAchievements(): Promise<any[]> {
  const data = await strapiGet<any>('achievements', {
    'pagination[pageSize]': '100',
  });
  return data.data;
}

export async function getUserAchievements(): Promise<any[]> {
  const data = await strapiGet<any>('user-achievements', {
    'pagination[pageSize]': '100',
    'populate[0]': 'user',
    'populate[1]': 'achievement',
  });
  return data.data;
}
