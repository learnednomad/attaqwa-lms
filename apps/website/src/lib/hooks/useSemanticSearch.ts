/**
 * Hook for AI-powered semantic search
 * Uses React Query with debounced query, keeps previous data while loading.
 */

'use client';

import { useQuery } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export interface SearchResult {
  contentType: string;
  contentId: string;
  title: string;
  snippet: string;
  score: number;
  metadata?: Record<string, any>;
}

async function fetchSearchResults(
  query: string,
  contentType?: string
): Promise<SearchResult[]> {
  const res = await fetch(`${API_URL}/api/v1/ai/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, contentType, limit: 20 }),
  });

  if (!res.ok) {
    // Fall back to empty results on error (graceful degradation)
    return [];
  }

  const json = await res.json();
  return json.data || [];
}

export function useSemanticSearch(query: string, contentType?: string) {
  return useQuery({
    queryKey: ['ai-search', query, contentType],
    queryFn: () => fetchSearchResults(query, contentType),
    enabled: query.length >= 3,
    placeholderData: (prev) => prev, // Keep previous data while loading
    staleTime: 30 * 1000, // 30 seconds
    retry: false,
  });
}
