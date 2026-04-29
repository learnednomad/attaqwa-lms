/**
 * Hook for AI-powered course recommendations
 * Uses React Query with 15min stale time.
 */

'use client';

import { useQuery } from '@tanstack/react-query';

// Client hook — call our own catch-all proxy on the website's origin.
const API_URL = '';

export interface Recommendation {
  courseId: string;
  title: string;
  description: string;
  score: number;
  reason: string;
  difficulty: string;
  subject: string;
}

async function fetchRecommendations(
  limit: number
): Promise<Recommendation[]> {
  const res = await fetch(`${API_URL}/api/v1/ai/recommend?limit=${limit}`, {
    credentials: 'include',
  });

  if (!res.ok) return [];

  const json = await res.json();
  return json.data || [];
}

export function useRecommendations(limit: number = 5) {
  return useQuery({
    queryKey: ['ai-recommendations', limit],
    queryFn: () => fetchRecommendations(limit),
    enabled: true,
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: false,
  });
}
