/**
 * API Client
 *
 * SECURITY IMPROVEMENTS:
 * - Removed localStorage token storage (XSS vulnerability)
 * - Authentication is handled via httpOnly cookies
 * - All requests include credentials for cookie-based auth
 */

import {
  API_V1_ENDPOINTS,
  API_ENDPOINTS,
  ERROR_MESSAGES
} from '@attaqwa/shared';
import type {
  AuthUser,
  LoginInput,
  RegisterInput,
} from '@attaqwa/shared';
import type {
  ApiResponse,
  PaginatedResponse,
  ErrorResponse,
  Announcement,
  Event,
  PrayerTime,
  PrayerTimeOverride,
  ItikafRegistration,
  Appeal,
} from '@/types';

// Auth types now consolidated in @attaqwa/shared-types
export type { AuthUser, LoginInput, RegisterInput };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// In-memory JWT storage for client-side auth
let _authToken: string | null = null;

export function getAuthToken() {
  return _authToken;
}

async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add JWT token if available
  if (_authToken) {
    defaultHeaders['Authorization'] = `Bearer ${_authToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    let errorMessage: string = ERROR_MESSAGES.SERVER_ERROR;

    try {
      const errorData: ErrorResponse = await response.json();
      errorMessage = errorData.message || errorData.error;
    } catch {
      // Fallback to status text if JSON parsing fails
      errorMessage = response.statusText || `HTTP ${response.status}`;
    }

    throw new ApiError(response.status, errorMessage);
  }

  return response.json();
}

// Strapi returns { data, meta: { pagination: { page, pageSize, pageCount, total } } }
// Our PaginatedResponse expects { data, pagination: { page, limit, total } }
interface StrapiPaginatedResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

function transformPaginated<T>(strapi: StrapiPaginatedResponse<T>): PaginatedResponse<T> {
  return {
    data: strapi.data,
    pagination: {
      page: strapi.meta.pagination.page,
      limit: strapi.meta.pagination.pageSize,
      total: strapi.meta.pagination.total,
      totalPages: strapi.meta.pagination.pageCount,
    },
    success: true,
  };
}

// Build Strapi v5 compatible query params
function buildStrapiQuery(params?: {
  page?: number;
  limit?: number;
  filters?: Record<string, string | boolean | number>;
  sort?: string;
}): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append('pagination[page]', params.page.toString());
  if (params.limit) searchParams.append('pagination[pageSize]', params.limit.toString());
  if (params.filters) {
    for (const [key, value] of Object.entries(params.filters)) {
      if (value !== undefined) {
        searchParams.append(`filters[${key}][$eq]`, String(value));
      }
    }
  }
  if (params.sort) searchParams.append('sort', params.sort);
  return searchParams.toString();
}

// Auth API (using v1 endpoints)
export const authApi = {
  login: async (credentials: LoginInput): Promise<{ user: AuthUser }> => {
    // Strapi expects 'identifier' not 'email' for the login endpoint
    const response = await makeRequest<{
      jwt: string;
      user: { id: number; username: string; email: string; role?: { type: string } };
    }>(
      API_V1_ENDPOINTS.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify({
          identifier: credentials.email,
          password: credentials.password,
        }),
      }
    );

    // Store JWT for subsequent requests
    _authToken = response.jwt;

    // Map Strapi user to our AuthUser type
    // After login, fetch /me to get role (login response doesn't include it)
    const strapiMe = await makeRequest<{
      id: number;
      username: string;
      email: string;
      role?: { type: string };
    }>(API_V1_ENDPOINTS.ME);

    const roleType = strapiMe.role?.type;
    const user: AuthUser = {
      id: String(response.user.id),
      email: response.user.email,
      name: response.user.username,
      role: roleType === 'admin' ? 'admin' : 'user',
    };

    return { user };
  },

  register: async (userData: RegisterInput): Promise<{ user: AuthUser }> => {
    const response = await makeRequest<{
      jwt: string;
      user: { id: number; username: string; email: string };
    }>(
      API_V1_ENDPOINTS.REGISTER,
      {
        method: 'POST',
        body: JSON.stringify({
          username: userData.name,
          email: userData.email,
          password: userData.password,
        }),
      }
    );

    _authToken = response.jwt;

    const user: AuthUser = {
      id: String(response.user.id),
      email: response.user.email,
      name: response.user.username,
      role: 'user',
    };

    return { user };
  },

  logout: async (): Promise<void> => {
    _authToken = null;
  },

  getMe: async (): Promise<{ user: AuthUser }> => {
    if (!_authToken) {
      throw new ApiError(401, 'Not authenticated');
    }

    const strapiUser = await makeRequest<{
      id: number;
      username: string;
      email: string;
      role?: { type: string };
    }>(API_V1_ENDPOINTS.ME);

    const roleType = strapiUser.role?.type;
    const user: AuthUser = {
      id: String(strapiUser.id),
      email: strapiUser.email,
      name: strapiUser.username,
      role: roleType === 'admin' ? 'admin' : 'user',
    };

    return { user };
  },
};

// Announcements API (using v1 endpoints)
export const announcementsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    isEvent?: boolean;
    isActive?: boolean;
  }): Promise<PaginatedResponse<Announcement>> => {
    const filters: Record<string, string | boolean | number> = {};
    if (params?.isEvent !== undefined) filters.isEvent = params.isEvent;
    if (params?.isActive !== undefined) filters.isActive = params.isActive;

    const query = buildStrapiQuery({ page: params?.page, limit: params?.limit, filters });
    const endpoint = query ? `${API_V1_ENDPOINTS.ANNOUNCEMENTS}?${query}` : API_V1_ENDPOINTS.ANNOUNCEMENTS;

    const raw = await makeRequest<StrapiPaginatedResponse<Announcement>>(endpoint);
    return transformPaginated(raw);
  },

  getById: async (id: string): Promise<ApiResponse<Announcement>> => {
    return makeRequest<ApiResponse<Announcement>>(`${API_V1_ENDPOINTS.ANNOUNCEMENTS}/${id}`);
  },

  create: async (data: Omit<Announcement, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Announcement>> => {
    return makeRequest<ApiResponse<Announcement>>(API_V1_ENDPOINTS.ANNOUNCEMENTS, {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  },

  update: async (id: string, data: Partial<Announcement>): Promise<ApiResponse<Announcement>> => {
    return makeRequest<ApiResponse<Announcement>>(`${API_V1_ENDPOINTS.ANNOUNCEMENTS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    return makeRequest<ApiResponse<{ message: string }>>(`${API_V1_ENDPOINTS.ANNOUNCEMENTS}/${id}`, {
      method: 'DELETE',
    });
  },
};

// Events API (using v1 endpoints)
export const eventsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    upcoming?: boolean;
    isActive?: boolean;
  }): Promise<PaginatedResponse<Event>> => {
    const filters: Record<string, string | boolean | number> = {};
    if (params?.isActive !== undefined) filters.isActive = params.isActive;
    // 'upcoming' is not a Strapi field - handle via date filter
    // For now, just sort by date descending
    const sort = params?.upcoming ? 'date:asc' : 'date:desc';

    const query = buildStrapiQuery({ page: params?.page, limit: params?.limit, filters, sort });
    const endpoint = query ? `${API_V1_ENDPOINTS.EVENTS}?${query}` : API_V1_ENDPOINTS.EVENTS;

    const raw = await makeRequest<StrapiPaginatedResponse<Event>>(endpoint);
    return transformPaginated(raw);
  },

  getById: async (id: string): Promise<ApiResponse<Event>> => {
    return makeRequest<ApiResponse<Event>>(`${API_V1_ENDPOINTS.EVENTS}/${id}`);
  },

  create: async (data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Event>> => {
    return makeRequest<ApiResponse<Event>>(API_V1_ENDPOINTS.EVENTS, {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  },

  update: async (id: string, data: Partial<Event>): Promise<ApiResponse<Event>> => {
    return makeRequest<ApiResponse<Event>>(`${API_V1_ENDPOINTS.EVENTS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    return makeRequest<ApiResponse<{ message: string }>>(`${API_V1_ENDPOINTS.EVENTS}/${id}`, {
      method: 'DELETE',
    });
  },
};

// Prayer Times API (using v1 endpoints)
export const prayerTimesApi = {
  getToday: async (params?: {
    city?: string;
    country?: string;
    method?: string;
  }): Promise<ApiResponse<PrayerTime>> => {
    const searchParams = new URLSearchParams();
    if (params?.city) searchParams.append('city', params.city);
    if (params?.country) searchParams.append('country', params.country);
    if (params?.method) searchParams.append('method', params.method);

    const query = searchParams.toString();
    const endpoint = query ? `${API_V1_ENDPOINTS.PRAYER_TIMES}?${query}` : API_V1_ENDPOINTS.PRAYER_TIMES;

    return makeRequest<ApiResponse<PrayerTime>>(endpoint);
  },

  getWeek: async (params?: {
    city?: string;
    country?: string;
    method?: string;
  }): Promise<ApiResponse<PrayerTime[]>> => {
    const searchParams = new URLSearchParams();
    if (params?.city) searchParams.append('city', params.city);
    if (params?.country) searchParams.append('country', params.country);
    if (params?.method) searchParams.append('method', params.method);

    const query = searchParams.toString();
    const endpoint = query ? `${API_V1_ENDPOINTS.PRAYER_TIMES_WEEK}?${query}` : API_V1_ENDPOINTS.PRAYER_TIMES_WEEK;

    return makeRequest<ApiResponse<PrayerTime[]>>(endpoint);
  },

  getMonth: async (params?: {
    month?: string;
    city?: string;
    country?: string;
    method?: string;
  }): Promise<ApiResponse<PrayerTime[]>> => {
    const searchParams = new URLSearchParams();
    if (params?.month) searchParams.append('month', params.month);
    if (params?.city) searchParams.append('city', params.city);
    if (params?.country) searchParams.append('country', params.country);
    if (params?.method) searchParams.append('method', params.method);

    const query = searchParams.toString();
    const endpoint = query ? `${API_V1_ENDPOINTS.PRAYER_TIMES_MONTH}?${query}` : API_V1_ENDPOINTS.PRAYER_TIMES_MONTH;

    return makeRequest<ApiResponse<PrayerTime[]>>(endpoint);
  },
};

// Prayer Time Overrides API (using v1 endpoints)
export const prayerTimeOverridesApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
  }): Promise<PaginatedResponse<PrayerTimeOverride>> => {
    const filters: Record<string, string | boolean | number> = {};
    if (params?.isActive !== undefined) filters.isActive = params.isActive;

    const query = buildStrapiQuery({ page: params?.page, limit: params?.limit, filters });
    const endpoint = query ? `${API_V1_ENDPOINTS.PRAYER_TIME_OVERRIDES}?${query}` : API_V1_ENDPOINTS.PRAYER_TIME_OVERRIDES;

    const raw = await makeRequest<StrapiPaginatedResponse<PrayerTimeOverride>>(endpoint);
    return transformPaginated(raw);
  },

  getById: async (id: string): Promise<ApiResponse<PrayerTimeOverride>> => {
    return makeRequest<ApiResponse<PrayerTimeOverride>>(`${API_V1_ENDPOINTS.PRAYER_TIME_OVERRIDES}/${id}`);
  },

  create: async (data: Omit<PrayerTimeOverride, 'id' | 'documentId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<PrayerTimeOverride>> => {
    return makeRequest<ApiResponse<PrayerTimeOverride>>(API_V1_ENDPOINTS.PRAYER_TIME_OVERRIDES, {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  },

  update: async (id: string, data: Partial<PrayerTimeOverride>): Promise<ApiResponse<PrayerTimeOverride>> => {
    return makeRequest<ApiResponse<PrayerTimeOverride>>(`${API_V1_ENDPOINTS.PRAYER_TIME_OVERRIDES}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    return makeRequest<ApiResponse<{ message: string }>>(`${API_V1_ENDPOINTS.PRAYER_TIME_OVERRIDES}/${id}`, {
      method: 'DELETE',
    });
  },
};

// I'tikaf Registrations API (using v1 endpoints)
export const itikafRegistrationsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<ItikafRegistration>> => {
    const filters: Record<string, string | boolean | number> = {};
    if (params?.status) filters.status = params.status;

    const query = buildStrapiQuery({ page: params?.page, limit: params?.limit, filters });
    const endpoint = query ? `${API_V1_ENDPOINTS.ITIKAF_REGISTRATIONS}?${query}` : API_V1_ENDPOINTS.ITIKAF_REGISTRATIONS;

    const raw = await makeRequest<StrapiPaginatedResponse<ItikafRegistration>>(endpoint);
    return transformPaginated(raw);
  },

  getById: async (id: string): Promise<ApiResponse<ItikafRegistration>> => {
    return makeRequest<ApiResponse<ItikafRegistration>>(`${API_V1_ENDPOINTS.ITIKAF_REGISTRATIONS}/${id}`);
  },

  create: async (data: Omit<ItikafRegistration, 'id' | 'documentId' | 'status' | 'notes' | 'user' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ItikafRegistration>> => {
    return makeRequest<ApiResponse<ItikafRegistration>>(API_V1_ENDPOINTS.ITIKAF_REGISTRATIONS, {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  },

  update: async (id: string, data: Partial<ItikafRegistration>): Promise<ApiResponse<ItikafRegistration>> => {
    return makeRequest<ApiResponse<ItikafRegistration>>(`${API_V1_ENDPOINTS.ITIKAF_REGISTRATIONS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    return makeRequest<ApiResponse<{ message: string }>>(`${API_V1_ENDPOINTS.ITIKAF_REGISTRATIONS}/${id}`, {
      method: 'DELETE',
    });
  },
};

// Appeals API (using v1 endpoints)
export const appealsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    category?: string;
  }): Promise<PaginatedResponse<Appeal>> => {
    const filters: Record<string, string | boolean | number> = {};
    if (params?.isActive !== undefined) filters.isActive = params.isActive;
    if (params?.category) filters.category = params.category;

    const query = buildStrapiQuery({ page: params?.page, limit: params?.limit, filters });
    const endpoint = query ? `${API_V1_ENDPOINTS.APPEALS}?${query}` : API_V1_ENDPOINTS.APPEALS;

    const raw = await makeRequest<StrapiPaginatedResponse<Appeal>>(endpoint);
    return transformPaginated(raw);
  },

  getById: async (id: string): Promise<ApiResponse<Appeal>> => {
    return makeRequest<ApiResponse<Appeal>>(`${API_V1_ENDPOINTS.APPEALS}/${id}`);
  },

  create: async (data: Omit<Appeal, 'id' | 'documentId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Appeal>> => {
    return makeRequest<ApiResponse<Appeal>>(API_V1_ENDPOINTS.APPEALS, {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  },

  update: async (id: string, data: Partial<Appeal>): Promise<ApiResponse<Appeal>> => {
    return makeRequest<ApiResponse<Appeal>>(`${API_V1_ENDPOINTS.APPEALS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    return makeRequest<ApiResponse<{ message: string }>>(`${API_V1_ENDPOINTS.APPEALS}/${id}`, {
      method: 'DELETE',
    });
  },
};

// Export a single API object for convenience
export const api = {
  auth: authApi,
  announcements: announcementsApi,
  events: eventsApi,
  prayerTimes: prayerTimesApi,
  prayerTimeOverrides: prayerTimeOverridesApi,
  itikafRegistrations: itikafRegistrationsApi,
  appeals: appealsApi,
};
