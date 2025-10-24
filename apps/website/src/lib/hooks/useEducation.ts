import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { 
  EducationContent,
  EducationContentFilters,
  UserProgress,
  QuizAttempt,
  EducationAnalytics,
  UserEducationStats,
  CreateEducationContentRequest,
  UpdateEducationContentRequest,
  SubmitQuizAnswersRequest,
  UpdateProgressRequest
} from '@attaqwa/shared';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// API functions
const api = {
  // Get education content with filters
  getEducationContent: async (filters?: EducationContentFilters) => {
    const params = new URLSearchParams();
    if (filters?.subject) params.append('subject', filters.subject);
    if (filters?.ageTier) params.append('ageTier', filters.ageTier);
    if (filters?.difficultyLevel) params.append('difficultyLevel', filters.difficultyLevel);
    if (filters?.contentType) params.append('contentType', filters.contentType);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.tags) params.append('tags', filters.tags.join(','));
    
    const response = await fetch(`${API_BASE}/api/education?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch education content');
    return response.json();
  },

  // Get single education content
  getEducationContentById: async (id: string) => {
    const response = await fetch(`${API_BASE}/api/education/${id}`);
    if (!response.ok) throw new Error('Failed to fetch education content');
    return response.json();
  },

  // Create education content (Admin only)
  createEducationContent: async (data: CreateEducationContentRequest) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE}/api/education`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create education content');
    return response.json();
  },

  // Update education content (Admin only)
  updateEducationContent: async (id: string, data: UpdateEducationContentRequest) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE}/api/education/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update education content');
    return response.json();
  },

  // Delete education content (Admin only)
  deleteEducationContent: async (id: string) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE}/api/education/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete education content');
    return response.json();
  },

  // Submit quiz answers
  submitQuizAnswers: async (quizId: string, data: SubmitQuizAnswersRequest) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE}/api/education/${quizId}/submit-quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to submit quiz');
    return response.json();
  },

  // Update user progress
  updateProgress: async (contentId: string, data: UpdateProgressRequest) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE}/api/education/${contentId}/progress`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update progress');
    return response.json();
  },

  // Get user progress
  getUserProgress: async () => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE}/api/education/progress/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch user progress');
    return response.json();
  },

  // Get user quiz attempts
  getUserQuizAttempts: async () => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE}/api/education/quiz-attempts/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch quiz attempts');
    return response.json();
  },

  // Get education analytics (Admin only)
  getEducationAnalytics: async () => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE}/api/education/analytics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch education analytics');
    return response.json();
  },

  // Get user education stats
  getUserEducationStats: async () => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE}/api/education/stats/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch user education stats');
    return response.json();
  },
};

// React Query hooks
export function useEducationContent(filters?: EducationContentFilters) {
  return useQuery({
    queryKey: ['education-content', filters],
    queryFn: () => api.getEducationContent(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useEducationContentById(id: string) {
  return useQuery({
    queryKey: ['education-content', id],
    queryFn: () => api.getEducationContentById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateEducationContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.createEducationContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education-content'] });
    },
  });
}

export function useUpdateEducationContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEducationContentRequest }) => 
      api.updateEducationContent(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['education-content'] });
      queryClient.invalidateQueries({ queryKey: ['education-content', variables.id] });
    },
  });
}

export function useDeleteEducationContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.deleteEducationContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education-content'] });
    },
  });
}

export function useSubmitQuizAnswers() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ quizId, answers }: { quizId: string; answers: SubmitQuizAnswersRequest }) => 
      api.submitQuizAnswers(quizId, answers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      queryClient.invalidateQueries({ queryKey: ['user-quiz-attempts'] });
      queryClient.invalidateQueries({ queryKey: ['user-education-stats'] });
    },
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ contentId, data }: { contentId: string; data: UpdateProgressRequest }) => 
      api.updateProgress(contentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      queryClient.invalidateQueries({ queryKey: ['user-education-stats'] });
    },
  });
}

export function useUserProgress() {
  return useQuery({
    queryKey: ['user-progress'],
    queryFn: api.getUserProgress,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useUserQuizAttempts() {
  return useQuery({
    queryKey: ['user-quiz-attempts'],
    queryFn: api.getUserQuizAttempts,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useEducationAnalytics() {
  return useQuery({
    queryKey: ['education-analytics'],
    queryFn: api.getEducationAnalytics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUserEducationStats() {
  return useQuery({
    queryKey: ['user-education-stats'],
    queryFn: api.getUserEducationStats,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}