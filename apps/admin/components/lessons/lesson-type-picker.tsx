/**
 * Lesson Type Picker
 * Five-card grid (radiogroup) shown as step 1 of the create flow.
 * Arrow keys move focus, Enter / Space selects.
 */

'use client';

import {
  BookOpen,
  HelpCircle,
  PlayCircle,
  Sparkles,
  Target,
  type LucideIcon,
} from 'lucide-react';
import { useRef } from 'react';

import type { LessonType } from '@/components/lessons/lesson-type-badge';
import { cn } from '@/lib/utils/cn';

interface TypeOption {
  value: LessonType;
  label: string;
  description: string;
  Icon: LucideIcon;
  accent: string;
}

const OPTIONS: TypeOption[] = [
  {
    value: 'video',
    label: 'Video',
    description: 'Recorded lecture, Qari recitation, or visual walkthrough.',
    Icon: PlayCircle,
    accent: 'text-blue-600',
  },
  {
    value: 'reading',
    label: 'Reading',
    description: 'Text article, tafseer, or hadith commentary.',
    Icon: BookOpen,
    accent: 'text-emerald-600',
  },
  {
    value: 'interactive',
    label: 'Interactive',
    description: 'Guided activity or embedded interactive.',
    Icon: Sparkles,
    accent: 'text-purple-600',
  },
  {
    value: 'quiz',
    label: 'Quiz',
    description: 'Assessment with graded questions and feedback.',
    Icon: HelpCircle,
    accent: 'text-amber-600',
  },
  {
    value: 'practice',
    label: 'Practice',
    description: 'Memorization drill, pronunciation, or exercise.',
    Icon: Target,
    accent: 'text-rose-600',
  },
];

interface LessonTypePickerProps {
  value: LessonType | null;
  onChange: (type: LessonType) => void;
  onConfirm?: (type: LessonType) => void;
}

export function LessonTypePicker({ value, onChange, onConfirm }: LessonTypePickerProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusIndex = (i: number) => {
    const n = OPTIONS.length;
    const wrapped = ((i % n) + n) % n;
    refs.current[wrapped]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      focusIndex(idx + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      focusIndex(idx - 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(OPTIONS[idx].value);
      onConfirm?.(OPTIONS[idx].value);
    }
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-charcoal-900">Choose a lesson type</h3>
      <p className="mt-1 text-xs text-charcoal-500">
        This decides which content editor you&apos;ll see next. You can change it later.
      </p>
      <div
        role="radiogroup"
        aria-label="Lesson type"
        className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {OPTIONS.map((opt, i) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected || (value == null && i === 0) ? 0 : -1}
              onClick={() => {
                onChange(opt.value);
                onConfirm?.(opt.value);
              }}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                'flex items-start gap-3 rounded-lg border-2 p-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/30',
                selected
                  ? 'border-primary-500 bg-primary-50 shadow-sm'
                  : 'border-charcoal-200 bg-white hover:border-charcoal-300'
              )}
            >
              <opt.Icon
                className={cn('mt-0.5 h-5 w-5 shrink-0', opt.accent)}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <div className="text-sm font-medium text-charcoal-900">{opt.label}</div>
                <div className="mt-0.5 text-xs leading-snug text-charcoal-500">
                  {opt.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
