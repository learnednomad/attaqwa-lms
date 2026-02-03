/**
 * Course Recommendations Component
 * Card grid with recommended courses, "Why this?" tooltip, and dismiss button.
 */

'use client';

import { BookOpen, Info, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { useRecommendations, type Recommendation } from '@/lib/hooks/useRecommendations';

const SUBJECT_LABELS: Record<string, string> = {
  quran: 'Quran',
  arabic: 'Arabic',
  fiqh: 'Fiqh',
  hadith: 'Hadith',
  seerah: 'Seerah',
  aqeedah: 'Aqeedah',
  akhlaq: 'Akhlaq',
  tajweed: 'Tajweed',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
};

interface RecommendationsProps {
  token: string | null;
}

export function Recommendations({ token }: RecommendationsProps) {
  const { data: recommendations, isLoading } = useRecommendations(token);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  if (!token || isLoading) return null;

  const visible = (recommendations || []).filter((r) => !dismissed.has(r.courseId));
  if (visible.length === 0) return null;

  const dismiss = (courseId: string) => {
    setDismissed((prev) => new Set(prev).add(courseId));
  };

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-gray-900">Recommended For You</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((rec) => (
          <RecommendationCard
            key={rec.courseId}
            recommendation={rec}
            onDismiss={() => dismiss(rec.courseId)}
          />
        ))}
      </div>
    </section>
  );
}

function RecommendationCard({
  recommendation,
  onDismiss,
}: {
  recommendation: Recommendation;
  onDismiss: () => void;
}) {
  const [showReason, setShowReason] = useState(false);

  return (
    <div className="relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className="absolute right-3 top-3 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        title="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Subject & Difficulty */}
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
          {SUBJECT_LABELS[recommendation.subject] || recommendation.subject}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${DIFFICULTY_COLORS[recommendation.difficulty] || 'bg-gray-100 text-gray-700'}`}>
          {recommendation.difficulty}
        </span>
      </div>

      {/* Title */}
      <Link href={`/courses/${recommendation.courseId}`}>
        <h3 className="mb-2 font-semibold text-gray-900 hover:text-green-700">
          {recommendation.title}
        </h3>
      </Link>

      {/* Description */}
      <p className="mb-3 line-clamp-2 text-sm text-gray-600">
        {recommendation.description}
      </p>

      {/* Why this? */}
      <div className="relative">
        <button
          onClick={() => setShowReason(!showReason)}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
        >
          <Info className="h-3.5 w-3.5" />
          Why this?
        </button>
        {showReason && (
          <p className="mt-1 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
            {recommendation.reason}
          </p>
        )}
      </div>
    </div>
  );
}
