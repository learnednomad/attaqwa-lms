/**
 * Lesson Type Badge
 * Color-coded badge for a lesson's content type.
 */

import { BookOpen, FileText, HelpCircle, PlayCircle, Sparkles, Target } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

import { cn } from '@/lib/utils/cn';

export type LessonType = 'video' | 'reading' | 'interactive' | 'quiz' | 'practice';

const meta: Record<
  LessonType,
  { label: string; className: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }
> = {
  video: {
    label: 'Video',
    className: 'bg-blue-100 text-blue-700',
    Icon: PlayCircle,
  },
  reading: {
    label: 'Reading',
    className: 'bg-emerald-100 text-emerald-700',
    Icon: BookOpen,
  },
  interactive: {
    label: 'Interactive',
    className: 'bg-purple-100 text-purple-700',
    Icon: Sparkles,
  },
  quiz: {
    label: 'Quiz',
    className: 'bg-amber-100 text-amber-700',
    Icon: HelpCircle,
  },
  practice: {
    label: 'Practice',
    className: 'bg-rose-100 text-rose-700',
    Icon: Target,
  },
};

interface LessonTypeBadgeProps {
  type: string | null | undefined;
  className?: string;
  showIcon?: boolean;
}

export function LessonTypeBadge({ type, className, showIcon = true }: LessonTypeBadgeProps) {
  const key = (type || 'reading').toLowerCase() as LessonType;
  const variant = meta[key] ?? {
    label: type || 'Unknown',
    className: 'bg-charcoal-100 text-charcoal-700',
    Icon: FileText,
  };
  const Icon = variant.Icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant.className,
        className
      )}
    >
      {showIcon ? <Icon className="h-3 w-3" aria-hidden="true" /> : null}
      {variant.label}
    </span>
  );
}

export const LESSON_TYPES: { value: LessonType; label: string; description: string }[] = [
  { value: 'video', label: 'Video', description: 'Recorded lecture, Qari recitation, or visual walkthrough.' },
  { value: 'reading', label: 'Reading', description: 'Text-based article, tafseer, or hadith commentary.' },
  { value: 'interactive', label: 'Interactive', description: 'Guided activity with embedded interactions.' },
  { value: 'quiz', label: 'Quiz', description: 'Assessment with graded questions and feedback.' },
  { value: 'practice', label: 'Practice', description: 'Memorization drill, pronunciation, or hands-on exercise.' },
];
