/**
 * Strapi API Client for Next.js Web Admin
 * Handles content API requests with server-side API token.
 * Auth is handled by BetterAuth (see lib/auth-client.ts).
 */

import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { API_V1_ENDPOINTS, API_CONFIG } from '@attaqwa/shared';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';
const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

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

    // Request interceptor to add API token
    this.client.interceptors.request.use(
      (config) => {
        if (STRAPI_API_TOKEN) {
          config.headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          console.error('[StrapiClient] Unauthorized — check STRAPI_API_TOKEN');
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
export const buildStrapiQuery = {
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

  // File upload (standard Strapi)
  upload: '/upload',
} as const;

// Export shared endpoints for consistency
export { API_V1_ENDPOINTS, API_CONFIG };
