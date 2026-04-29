/**
 * Strapi API Client for Next.js Web Admin
 * Handles content API requests with server-side API token.
 * Auth is handled by BetterAuth (see lib/auth-client.ts).
 */

import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { API_V1_ENDPOINTS, API_CONFIG } from '@attaqwa/shared';

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

// All API calls go through the admin's own proxy (/api/v1/* → Strapi)
// This avoids cross-origin issues and handles auth server-side
const API_URL = typeof window !== 'undefined'
  ? '/api'
  : `http://localhost:${process.env.PORT || '3000'}/api`;

// API Version configuration
const API_VERSION = API_CONFIG.CURRENT_VERSION; // 'v1'

class StrapiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          console.error('[StrapiClient] Unauthorized');
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic CRUD methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<{ data: T }> {
    const response = await this.client.get<{ data: T }>(url, config);
    return response.data;
  }

  async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<{ data: T }> {
    const response = await this.client.post<{ data: T }>(url, data, config);
    return response.data;
  }

  async put<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<{ data: T }> {
    const response = await this.client.put<{ data: T }>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<{ data: T }> {
    const response = await this.client.delete<{ data: T }>(url, config);
    return response.data;
  }

  // File upload
  async upload(file: File, refId?: string, ref?: string, field?: string) {
    const formData = new FormData();
    formData.append('files', file);

    if (refId) formData.append('refId', refId);
    if (ref) formData.append('ref', ref);
    if (field) formData.append('field', field);

    try {
      const response = await this.client.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Upload failed');
    }
  }

  // Get media URL
  getMediaUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${STRAPI_URL}${path}`;
  }
}

// Export singleton instance
export const strapiClient = new StrapiClient();

// Helper functions for building Strapi queries
const buildStrapiQuery = {
  filters: (filters: Record<string, string | number | boolean>) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      params.append(`filters[${key}][$eq]`, String(value));
    });
    return params.toString();
  },

  populate: (fields: string[] | string) => {
    const params = new URLSearchParams();
    if (Array.isArray(fields)) {
      fields.forEach((field, index) => {
        params.append(`populate[${index}]`, field);
      });
    } else {
      params.append('populate', fields);
    }
    return params.toString();
  },

  pagination: (options: { page?: number; pageSize?: number }) => {
    const params = new URLSearchParams();
    if (options.page) params.append('pagination[page]', String(options.page));
    if (options.pageSize) params.append('pagination[pageSize]', String(options.pageSize));
    return params.toString();
  },

  sort: (sortOptions: string[]) => {
    const params = new URLSearchParams();
    sortOptions.forEach((sort, index) => {
      params.append(`sort[${index}]`, sort);
    });
    return params.toString();
  },

  combine: (...queryParts: string[]) => {
    return queryParts.filter(Boolean).join('&');
  },
};

// v1 Versioned API endpoints for admin operations
export const adminApiEndpoints = {
  // LMS Core (v1 versioned)
  courses: `/${API_VERSION}/courses`,
  lessons: `/${API_VERSION}/lessons`,
  quizzes: `/${API_VERSION}/quizzes`,

  // User Management (v1 versioned)
  userProgress: `/${API_VERSION}/user-progresses`,
  courseEnrollments: `/${API_VERSION}/course-enrollments`,
  achievements: `/${API_VERSION}/achievements`,
  userAchievements: `/${API_VERSION}/user-achievements`,

  // Gamification (v1 versioned)
  leaderboards: `/${API_VERSION}/leaderboards`,
  streaks: `/${API_VERSION}/streaks`,

  // Masjid admin content
  announcements: `/${API_VERSION}/announcements`,
  events: `/${API_VERSION}/events`,
  iqamahSchedules: `/${API_VERSION}/iqamah-schedules`,
  prayerTimeOverrides: `/${API_VERSION}/prayer-time-overrides`,
  itikafRegistrations: `/${API_VERSION}/itikaf-registrations`,
  appeals: `/${API_VERSION}/appeals`,
  moderationQueues: `/${API_VERSION}/moderation-queues`,

  // File upload (standard Strapi)
  upload: '/upload',
} as const;

// Export shared endpoints for consistency

// ---------------------------------------------------------------------------
// Lesson helpers (Phase 1: global library, Phase 2: outline + drawer)
// ---------------------------------------------------------------------------

export interface AdminLessonCourse {
  id: number;
  documentId?: string;
  title: string;
  slug?: string;
}

export interface AdminLesson {
  id: number;
  documentId?: string;
  title: string;
  slug?: string;
  description?: string;
  lesson_order: number;
  lesson_type: string;
  duration_minutes: number;
  content?: string | null;
  video_url?: string | null;
  is_free?: boolean;
  is_preview?: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  course?: AdminLessonCourse | null;
}

 interface ListLessonsParams {
  courseId?: string | number | null;
  type?: string | null;
  q?: string | null;
  page?: number;
  pageSize?: number;
  sort?: string[];
}

 interface ListLessonsResult {
  items: AdminLesson[];
  pagination: { page: number; pageSize: number; pageCount: number; total: number };
}

function buildLessonListParams(params: ListLessonsParams): URLSearchParams {
  const query = new URLSearchParams();
  query.set('populate[course][fields][0]', 'title');
  query.set('populate[course][fields][1]', 'slug');
  query.set('publicationState', 'preview');

  const sort = params.sort ?? ['course.title:asc', 'lesson_order:asc'];
  sort.forEach((s, i) => query.set(`sort[${i}]`, s));

  query.set('pagination[page]', String(params.page ?? 1));
  query.set('pagination[pageSize]', String(params.pageSize ?? 25));

  if (params.courseId) {
    // courseId is the Strapi 5 documentId (string) sourced from /courses/[id]/...
    // route params, not the numeric primary key. Filtering on `id` 500s in
    // Strapi when the value can't cast to integer.
    query.set('filters[course][documentId][$eq]', String(params.courseId));
  }
  if (params.type) {
    query.set('filters[lesson_type][$eq]', params.type);
  }
  if (params.q) {
    query.set('filters[title][$containsi]', params.q);
  }

  return query;
}

export async function listLessons(params: ListLessonsParams = {}): Promise<ListLessonsResult> {
  const query = buildLessonListParams(params);
  const response = await strapiClient.get<AdminLesson[]>(
    `${adminApiEndpoints.lessons}?${query.toString()}`
  );
  // Strapi can return either { data: T[] } (wrapped once by axios) or
  // { data: { data: T[], meta: {...} } } depending on proxy behaviour.
  // Normalise both shapes here.
  // @ts-expect-error runtime shape check
  const body = response?.data?.data ? response.data : response;
  const items = Array.isArray((body as any).data)
    ? ((body as any).data as AdminLesson[])
    : [];
  const metaPagination = (body as any)?.meta?.pagination ?? {
    page: params.page ?? 1,
    pageSize: params.pageSize ?? items.length,
    pageCount: 1,
    total: items.length,
  };
  return { items, pagination: metaPagination };
}

export async function getLesson(id: string | number): Promise<AdminLesson | null> {
  const query = new URLSearchParams();
  query.set('populate[course][fields][0]', 'title');
  query.set('populate[course][fields][1]', 'slug');
  query.set('populate[quiz]', 'true');
  query.set('publicationState', 'preview');
  const response = await strapiClient.get<AdminLesson>(
    `${adminApiEndpoints.lessons}/${id}?${query.toString()}`
  );
  return (response.data as any) ?? null;
}

export async function createLesson(payload: Partial<AdminLesson> & { course: number }) {
  return strapiClient.post<AdminLesson>(adminApiEndpoints.lessons, { data: payload });
}

export async function updateLesson(id: string | number, payload: Partial<AdminLesson>) {
  return strapiClient.put<AdminLesson>(`${adminApiEndpoints.lessons}/${id}`, { data: payload });
}

export async function deleteLessonById(id: string | number) {
  return strapiClient.delete<AdminLesson>(`${adminApiEndpoints.lessons}/${id}`);
}

/**
 * Duplicate a lesson into the same course. Copies the content fields,
 * appends " (Copy)" to the title, and places the duplicate after the
 * current highest lesson_order in that course.
 */
export async function duplicateLesson(id: string | number): Promise<AdminLesson | null> {
  const source = await getLesson(id);
  if (!source) return null;

  const courseId = source.course?.id;
  if (!courseId) {
    throw new Error('Cannot duplicate a lesson without a course relation');
  }

  const siblings = await listLessons({ courseId, pageSize: 100 });
  const nextOrder =
    siblings.items.reduce((max, l) => Math.max(max, l.lesson_order ?? 0), 0) + 1;

  const {
    id: _id,
    documentId: _doc,
    createdAt: _c,
    updatedAt: _u,
    publishedAt: _p,
    course: _course,
    slug: _slug,
    ...rest
  } = source;

  const payload = {
    ...rest,
    title: `${source.title} (Copy)`,
    lesson_order: nextOrder,
    course: courseId,
  } as Partial<AdminLesson> & { course: number };

  const created = await createLesson(payload);
  return (created.data as any) ?? null;
}

export async function listCoursesForPicker(): Promise<AdminLessonCourse[]> {
  const query = new URLSearchParams();
  query.set('fields[0]', 'title');
  query.set('fields[1]', 'slug');
  query.set('sort[0]', 'title:asc');
  query.set('pagination[pageSize]', '200');
  query.set('publicationState', 'preview');
  const response = await strapiClient.get<AdminLessonCourse[]>(
    `${adminApiEndpoints.courses}?${query.toString()}`
  );
  // @ts-expect-error runtime shape check
  const body = response?.data?.data ? response.data : response;
  const items = Array.isArray((body as any).data) ? ((body as any).data as AdminLessonCourse[]) : [];
  return items;
}

/**
 * Persist a new lesson order across a set of lessons in one course.
 * Strapi v5 has no bulk endpoint at this API, so we issue sequential PUTs.
 * Caller owns optimistic UI; we return the first failure if any.
 */
export async function reorderLessons(
  orderedIds: Array<string | number>
): Promise<void> {
  for (let i = 0; i < orderedIds.length; i += 1) {
    const id = orderedIds[i];
    // eslint-disable-next-line no-await-in-loop
    await updateLesson(id, { lesson_order: i + 1 });
  }
}

