/**
 * Strapi API Client for AttaqwaMasjid LMS
 * Shared client for web applications (admin & website)
 * Uses NEXT_PUBLIC_STRAPI_API_TOKEN for authentication (BetterAuth handles user auth separately)
 */

import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

export interface StrapiClientConfig {
  strapiUrl?: string;
  apiUrl?: string;
}

export class StrapiClient {
  private client: AxiosInstance;
  private strapiUrl: string;

  constructor(config: StrapiClientConfig = {}) {
    this.strapiUrl = config.strapiUrl || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    const apiUrl = config.apiUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';

    this.client = axios.create({
      baseURL: apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add API token
    this.client.interceptors.request.use(
      (config) => {
        const apiToken = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
        if (apiToken) {
          config.headers.Authorization = `Bearer ${apiToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
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
    } catch (error: unknown) {
      const axiosErr = error as { response?: { data?: { error?: { message?: string } } } };
      throw new Error(axiosErr.response?.data?.error?.message || 'Upload failed');
    }
  }

  // Get media URL
  getMediaUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${this.strapiUrl}${path}`;
  }
}

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

// Default export: Create singleton instance (can be overridden)
export const strapiClient = new StrapiClient();
