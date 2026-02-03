/**
 * Hook for AI-powered course recommendations
 * Uses React Query with 15min stale time.
 */

'use client';

import { useQuery } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

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
  token: string,
  limit: number
): Promise<Recommendation[]> {
  const res = await fetch(`${API_URL}/api/v1/ai/recommend?limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return [];

  const json = await res.json();
  return json.data || [];
}

export function useRecommendations(token: string | null, limit: number = 5) {
  return useQuery({
    queryKey: ['ai-recommendations', limit],
    queryFn: () => fetchRecommendations(token!, limit),
    enabled: !!token,
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: false,
  });
}
