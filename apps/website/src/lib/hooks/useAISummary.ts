/**
 * Hook for fetching AI-generated lesson summaries
 * Uses React Query with 1hr stale time for caching
 */

'use client';

import { useQuery } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

async function fetchSummary(content: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/v1/ai/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });

  if (res.status === 503) {
    throw new Error('AI service unavailable');
  }

  if (!res.ok) {
    throw new Error('Failed to generate summary');
  }

  const json = await res.json();
  return json.data.summary;
}

export function useAISummary(content: string | undefined, enabled: boolean = true) {
  return useQuery({
    queryKey: ['ai-summary', content?.slice(0, 100)],
    queryFn: () => fetchSummary(content!),
    enabled: enabled && !!content && content.length > 100,
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: false,
  });
}
