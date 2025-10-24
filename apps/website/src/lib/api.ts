import { 
  API_ENDPOINTS, 
  ERROR_MESSAGES,
  type ApiResponse,
  type PaginatedResponse,
  type ErrorResponse,
  type Announcement,
  type Event,
  type PrayerTimes,
  type AuthUser,
  type LoginInput,
  type RegisterInput
} from '@attaqwa/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function makeRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Include cookies for server-side auth
  });

  if (!response.ok) {
    let errorMessage = ERROR_MESSAGES.SERVER_ERROR;
    
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

// Auth API
export const authApi = {
  login: async (credentials: LoginInput): Promise<{ user: AuthUser; token: string }> => {
    const response = await makeRequest<{ user: AuthUser; token: string }>(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );
    
    // Store token in localStorage for client-side usage
    if (typeof window !== 'undefined' && response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  },

  register: async (userData: RegisterInput): Promise<{ user: AuthUser; token: string }> => {
    const response = await makeRequest<{ user: AuthUser; token: string }>(
      API_ENDPOINTS.AUTH.REGISTER,
      {
        method: 'POST',
        body: JSON.stringify(userData),
      }
    );
    
    if (typeof window !== 'undefined' && response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  },

  logout: async (): Promise<void> => {
    await makeRequest(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    });
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  getMe: async (): Promise<{ user: AuthUser }> => {
    return makeRequest<{ user: AuthUser }>(API_ENDPOINTS.AUTH.ME);
  },
};

// Announcements API
export const announcementsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    isEvent?: boolean;
    isActive?: boolean;
  }): Promise<PaginatedResponse<Announcement>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.isEvent !== undefined) searchParams.append('isEvent', params.isEvent.toString());
    if (params?.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());
    
    const query = searchParams.toString();
    const endpoint = query ? `${API_ENDPOINTS.ANNOUNCEMENTS}?${query}` : API_ENDPOINTS.ANNOUNCEMENTS;
    
    return makeRequest<PaginatedResponse<Announcement>>(endpoint);
  },

  getById: async (id: string): Promise<ApiResponse<Announcement>> => {
    return makeRequest<ApiResponse<Announcement>>(`${API_ENDPOINTS.ANNOUNCEMENTS}/${id}`);
  },

  create: async (data: Omit<Announcement, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Announcement>> => {
    return makeRequest<ApiResponse<Announcement>>(API_ENDPOINTS.ANNOUNCEMENTS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Announcement>): Promise<ApiResponse<Announcement>> => {
    return makeRequest<ApiResponse<Announcement>>(`${API_ENDPOINTS.ANNOUNCEMENTS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    return makeRequest<ApiResponse<{ message: string }>>(`${API_ENDPOINTS.ANNOUNCEMENTS}/${id}`, {
      method: 'DELETE',
    });
  },
};

// Events API
export const eventsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    upcoming?: boolean;
    isActive?: boolean;
  }): Promise<PaginatedResponse<Event>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.upcoming !== undefined) searchParams.append('upcoming', params.upcoming.toString());
    if (params?.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());
    
    const query = searchParams.toString();
    const endpoint = query ? `${API_ENDPOINTS.EVENTS}?${query}` : API_ENDPOINTS.EVENTS;
    
    return makeRequest<PaginatedResponse<Event>>(endpoint);
  },

  getById: async (id: string): Promise<ApiResponse<Event>> => {
    return makeRequest<ApiResponse<Event>>(`${API_ENDPOINTS.EVENTS}/${id}`);
  },

  create: async (data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Event>> => {
    return makeRequest<ApiResponse<Event>>(API_ENDPOINTS.EVENTS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Event>): Promise<ApiResponse<Event>> => {
    return makeRequest<ApiResponse<Event>>(`${API_ENDPOINTS.EVENTS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    return makeRequest<ApiResponse<{ message: string }>>(`${API_ENDPOINTS.EVENTS}/${id}`, {
      method: 'DELETE',
    });
  },
};

// Prayer Times API
export const prayerTimesApi = {
  getToday: async (params?: {
    city?: string;
    country?: string;
    method?: string;
  }): Promise<ApiResponse<PrayerTimes>> => {
    const searchParams = new URLSearchParams();
    if (params?.city) searchParams.append('city', params.city);
    if (params?.country) searchParams.append('country', params.country);
    if (params?.method) searchParams.append('method', params.method);
    
    const query = searchParams.toString();
    const endpoint = query ? `${API_ENDPOINTS.PRAYER_TIMES}?${query}` : API_ENDPOINTS.PRAYER_TIMES;
    
    return makeRequest<ApiResponse<PrayerTimes>>(endpoint);
  },

  getWeek: async (params?: {
    city?: string;
    country?: string;
    method?: string;
  }): Promise<ApiResponse<PrayerTimes[]>> => {
    const searchParams = new URLSearchParams();
    if (params?.city) searchParams.append('city', params.city);
    if (params?.country) searchParams.append('country', params.country);
    if (params?.method) searchParams.append('method', params.method);
    
    const query = searchParams.toString();
    const endpoint = query ? `${API_ENDPOINTS.PRAYER_TIMES}/week?${query}` : `${API_ENDPOINTS.PRAYER_TIMES}/week`;
    
    return makeRequest<ApiResponse<PrayerTimes[]>>(endpoint);
  },

  getMonth: async (params?: {
    month?: string;
    city?: string;
    country?: string;
    method?: string;
  }): Promise<ApiResponse<PrayerTimes[]>> => {
    const searchParams = new URLSearchParams();
    if (params?.month) searchParams.append('month', params.month);
    if (params?.city) searchParams.append('city', params.city);
    if (params?.country) searchParams.append('country', params.country);
    if (params?.method) searchParams.append('method', params.method);
    
    const query = searchParams.toString();
    const endpoint = query ? `${API_ENDPOINTS.PRAYER_TIMES}/month?${query}` : `${API_ENDPOINTS.PRAYER_TIMES}/month`;
    
    return makeRequest<ApiResponse<PrayerTimes[]>>(endpoint);
  },
};

// Export a single API object for convenience
export const api = {
  auth: authApi,
  announcements: announcementsApi,
  events: eventsApi,
  prayerTimes: prayerTimesApi,
};