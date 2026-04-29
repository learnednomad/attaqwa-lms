/**
 * API Client — Strapi Content APIs
 *
 * Auth is handled by BetterAuth (see src/lib/auth.ts and src/lib/auth-client.ts).
 * Strapi is used as a pure content API with a server-side API token.
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

export type { AuthUser, LoginInput, RegisterInput };

// Browser: hit own origin → /api/v1/* catch-all proxy attaches the token
//          server-side, no localhost fallback ever ends up in the bundle.
// SSR / Node: hit Strapi directly via the internal URL with the token.
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const SSR_API_BASE =
  process.env.STRAPI_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:1337';

class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const isBrowser = typeof window !== 'undefined';
  // Browser: endpoint is a relative path (e.g. `/api/v1/announcements`) that
  // hits the website's own catch-all proxy on the same origin.
  // Server: prepend the Strapi base URL so SSR / Node still works.
  const url = isBrowser ? endpoint : `${SSR_API_BASE}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Server-side calls need the token directly. Browser calls skip the token
  // here — the catch-all proxy adds it server-side.
  if (!isBrowser && STRAPI_API_TOKEN) {
    defaultHeaders['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
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

/**
 * Same-origin request helper for admin-only BFF routes.
 *
 * Admin pages run in the browser and can't carry STRAPI_API_TOKEN, so they
 * must call our own /api/admin/* proxies (which run server-side with the
 * token + a BetterAuth session check). The session cookie is sent
 * automatically because we use `credentials: 'include'`.
 */
async function makeAdminRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
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
      errorMessage = response.statusText || `HTTP ${response.status}`;
    }
    throw new ApiError(response.status, errorMessage);
  }

  return response.json();
}

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
const prayerTimesApi = {
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
// Itikaf + Appeals are admin-only resources. The browser cannot carry
// STRAPI_API_TOKEN, so these route through /api/admin/* BFF proxies which
// validate the BetterAuth session and forward server-side with the token.
const ADMIN_BFF_ITIKAF = '/api/admin/itikaf-registrations';
const ADMIN_BFF_APPEALS = '/api/admin/appeals';

export const itikafRegistrationsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<ItikafRegistration>> => {
    const filters: Record<string, string | boolean | number> = {};
    if (params?.status) filters.status = params.status;

    const query = buildStrapiQuery({ page: params?.page, limit: params?.limit, filters });
    const endpoint = query ? `${ADMIN_BFF_ITIKAF}?${query}` : ADMIN_BFF_ITIKAF;

    const raw = await makeAdminRequest<StrapiPaginatedResponse<ItikafRegistration>>(endpoint);
    return transformPaginated(raw);
  },

  getById: async (id: string): Promise<ApiResponse<ItikafRegistration>> => {
    return makeAdminRequest<ApiResponse<ItikafRegistration>>(`${ADMIN_BFF_ITIKAF}/${id}`);
  },

  create: async (data: Omit<ItikafRegistration, 'id' | 'documentId' | 'status' | 'notes' | 'user' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ItikafRegistration>> => {
    return makeAdminRequest<ApiResponse<ItikafRegistration>>(ADMIN_BFF_ITIKAF, {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  },

  update: async (id: string, data: Partial<ItikafRegistration>): Promise<ApiResponse<ItikafRegistration>> => {
    return makeAdminRequest<ApiResponse<ItikafRegistration>>(`${ADMIN_BFF_ITIKAF}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    return makeAdminRequest<ApiResponse<{ message: string }>>(`${ADMIN_BFF_ITIKAF}/${id}`, {
      method: 'DELETE',
    });
  },
};

// Appeals API (admin-only proxy)
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
    const endpoint = query ? `${ADMIN_BFF_APPEALS}?${query}` : ADMIN_BFF_APPEALS;

    const raw = await makeAdminRequest<StrapiPaginatedResponse<Appeal>>(endpoint);
    return transformPaginated(raw);
  },

  getById: async (id: string): Promise<ApiResponse<Appeal>> => {
    return makeAdminRequest<ApiResponse<Appeal>>(`${ADMIN_BFF_APPEALS}/${id}`);
  },

  create: async (data: Omit<Appeal, 'id' | 'documentId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Appeal>> => {
    return makeAdminRequest<ApiResponse<Appeal>>(ADMIN_BFF_APPEALS, {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  },

  update: async (id: string, data: Partial<Appeal>): Promise<ApiResponse<Appeal>> => {
    return makeAdminRequest<ApiResponse<Appeal>>(`${ADMIN_BFF_APPEALS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    return makeAdminRequest<ApiResponse<{ message: string }>>(`${ADMIN_BFF_APPEALS}/${id}`, {
      method: 'DELETE',
    });
  },
};

// Export a single API object for convenience
const api = {
  announcements: announcementsApi,
  events: eventsApi,
  prayerTimes: prayerTimesApi,
  prayerTimeOverrides: prayerTimeOverridesApi,
  itikafRegistrations: itikafRegistrationsApi,
  appeals: appealsApi,
};
