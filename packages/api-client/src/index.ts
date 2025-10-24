/**
 * Strapi API Client for AttaqwaMasjid LMS
 * Shared client for web applications (admin & website)
 * Handles authentication, requests, and error handling
 */

import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import type { User } from '@attaqwa/shared-types';

export interface StrapiClientConfig {
  strapiUrl?: string;
  apiUrl?: string;
  storageKey?: string;
  onUnauthorized?: () => void;
}

export class StrapiClient {
  private client: AxiosInstance;
  private token: string | null = null;
  private storageKey: string;
  private strapiUrl: string;
  private onUnauthorized?: () => void;

  constructor(config: StrapiClientConfig = {}) {
    this.strapiUrl = config.strapiUrl || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    const apiUrl = config.apiUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';
    this.storageKey = config.storageKey || 'strapi_token';
    this.onUnauthorized = config.onUnauthorized;

    this.client = axios.create({
      baseURL: apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
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
          // Token expired, clear auth
          this.clearAuth();
          if (this.onUnauthorized) {
            this.onUnauthorized();
          } else if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );

    // Load token from storage on client
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem(this.storageKey);
      if (storedToken) {
        this.token = storedToken;
      }
    }
  }

  // Authentication methods
  async login(identifier: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const response = await this.client.post('/auth/local', {
        identifier,
        password,
      });

      const { jwt, user } = response.data;
      this.setAuth(jwt);

      return { user, token: jwt };
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Login failed');
    }
  }

  async register(
    username: string,
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    try {
      const response = await this.client.post('/auth/local/register', {
        username,
        email,
        password,
      });

      const { jwt, user } = response.data;
      this.setAuth(jwt);

      return { user, token: jwt };
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Registration failed');
    }
  }

  async getMe(): Promise<User> {
    try {
      const response = await this.client.get('/users/me', {
        params: {
          populate: ['role', 'profile', 'profile.avatar'],
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch user');
    }
  }

  setAuth(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, token);
    }
  }

  clearAuth() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
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
