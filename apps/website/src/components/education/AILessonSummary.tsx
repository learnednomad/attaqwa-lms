/**
 * AI Lesson Summary Component
 * Lazy-loaded summary on lesson pages with skeleton loading state.
 * Degrades gracefully when AI is unavailable.
 */

'use client';

import { useAISummary } from '@/lib/hooks/useAISummary';

interface AILessonSummaryProps {
  content: string;
}

function SummarySkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-3 w-3/4 rounded bg-gray-200" />
      <div className="h-3 w-full rounded bg-gray-200" />
      <div className="h-3 w-5/6 rounded bg-gray-200" />
    </div>
  );
}

export function AILessonSummary({ content }: AILessonSummaryProps) {
  const { data: summary, isLoading, isError } = useAISummary(content);

  // Don't render anything if AI is unavailable
  if (isError) return null;

  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
        AI Summary
      </p>
      {isLoading ? (
        <SummarySkeleton />
      ) : (
        <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
      )}
    </div>
  );
}
