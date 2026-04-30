/**
 * Course Card
 * Rich card for the /courses grid view. Shows thumbnail, lesson-type
 * breakdown, duration, enrollment, and status in a scannable layout.
 * Whole card is clickable → course detail page.
 */

'use client';

import {
  BookOpen,
  Copy,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';
import { formatCategoryLabel, formatDuration, formatRelativeTime } from '@/lib/utils/formatters';

 interface CourseCardLesson {
  id: number;
  lesson_type?: string | null;
  duration_minutes?: number | null;
  updatedAt?: string | null;
}

 interface CourseCardThumbnail {
  url?: string | null;
  formats?: {
    thumbnail?: { url?: string | null };
    small?: { url?: string | null };
    medium?: { url?: string | null };
  } | null;
}

export interface CourseCardData {
  id: number;
  documentId?: string;
  title: string;
  instructor?: string | null;
  description?: string | null;
  subject?: string | null;
  difficulty?: string | null;
  age_tier?: string | null;
  current_enrollments?: number | null;
  max_students?: number | null;
  publishedAt?: string | null;
  updatedAt?: string;
  lessons?: CourseCardLesson[];
  thumbnail?: CourseCardThumbnail | null;
}

interface CourseCardProps {
  course: CourseCardData;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

const TYPE_DOT_COLORS: Record<string, string> = {
  video: 'bg-blue-500',
  reading: 'bg-emerald-500',
  interactive: 'bg-purple-500',
  quiz: 'bg-amber-500',
  practice: 'bg-rose-500',
};

const TYPE_LABELS: Record<string, string> = {
  video: 'Video',
  reading: 'Reading',
  interactive: 'Interactive',
  quiz: 'Quiz',
  practice: 'Practice',
};

function getDifficultyVariant(
  difficulty: string | null | undefined
): 'success' | 'warning' | 'danger' | 'default' {
  switch ((difficulty || '').toLowerCase()) {
    case 'beginner':
      return 'success';
    case 'intermediate':
      return 'warning';
    case 'advanced':
      return 'danger';
    default:
      return 'default';
  }
}

function getThumbnailUrl(thumb: CourseCardThumbnail | null | undefined): string | null {
  if (!thumb) return null;
  const raw =
    thumb.formats?.medium?.url ||
    thumb.formats?.small?.url ||
    thumb.formats?.thumbnail?.url ||
    thumb.url ||
    null;
  if (!raw) return null;
  if (raw.startsWith('http')) return raw;
  const strapiHost = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
  return `${strapiHost}${raw}`;
}

function getGradientFor(title: string): string {
  // Stable pick based on first char code.
  const palette = [
    'from-emerald-400 to-teal-500',
    'from-sky-400 to-indigo-500',
    'from-amber-400 to-rose-500',
    'from-purple-400 to-fuchsia-500',
    'from-lime-400 to-emerald-500',
    'from-rose-400 to-pink-500',
  ];
  const code = title.charCodeAt(0) || 0;
  return palette[code % palette.length];
}

export function CourseCard({ course, onDelete, onDuplicate }: CourseCardProps) {
  const identifier = course.documentId || course.id;
  const cardHref = `/courses/${identifier}/lessons`;
  const lessons = course.lessons || [];
  const lessonCount = lessons.length;
  const totalMinutes = lessons.reduce((sum, l) => sum + (l.duration_minutes || 0), 0);
  const published = !!course.publishedAt;
  const thumbUrl = getThumbnailUrl(course.thumbnail);

  // Count by lesson_type
  const typeCounts = lessons.reduce<Record<string, number>>((acc, l) => {
    const k = (l.lesson_type || 'reading').toLowerCase();
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const typeEntries = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);

  // Most recent lesson update → "activity"
  const mostRecentLessonUpdate = lessons
    .map((l) => l.updatedAt)
    .filter((d): d is string => !!d)
    .sort()
    .reverse()[0];
  const activityTimestamp = mostRecentLessonUpdate || course.updatedAt;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-charcoal-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <Link
        href={cardHref}
        className="flex flex-1 flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        {/* Thumbnail / gradient header */}
        <div className="relative h-28 w-full overflow-hidden">
          {thumbUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className={cn(
                'flex h-full w-full items-center justify-center bg-gradient-to-br text-3xl font-bold text-white/90',
                getGradientFor(course.title || '?')
              )}
              aria-hidden="true"
            >
              {(course.title || '?').trim().charAt(0).toUpperCase()}
            </div>
          )}
          {/* Status pill */}
          <div className="absolute left-2 top-2">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium backdrop-blur',
                published ? 'bg-emerald-500/90 text-white' : 'bg-charcoal-900/60 text-white'
              )}
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  published ? 'bg-white' : 'bg-white/70'
                )}
              />
              {published ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-start gap-2">
            {course.subject ? (
              <Badge variant="info">{formatCategoryLabel(course.subject)}</Badge>
            ) : null}
            {course.difficulty ? (
              <Badge variant={getDifficultyVariant(course.difficulty)}>
                {formatCategoryLabel(course.difficulty)}
              </Badge>
            ) : null}
          </div>

          <div>
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-charcoal-900">
              {course.title}
            </h3>
            {course.instructor ? (
              <p className="mt-0.5 truncate text-xs text-charcoal-500">
                by {course.instructor}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-charcoal-600">
            <span className="inline-flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-charcoal-400" />
              {lessonCount} lesson{lessonCount === 1 ? '' : 's'}
            </span>
            {totalMinutes > 0 ? (
              <span className="text-charcoal-500">· {formatDuration(totalMinutes)}</span>
            ) : null}
            {typeof course.current_enrollments === 'number' ? (
              <span className="inline-flex items-center gap-1 text-charcoal-500">
                <Users className="h-3.5 w-3.5 text-charcoal-400" />
                {course.current_enrollments}
                {course.max_students ? ` / ${course.max_students}` : ''}
              </span>
            ) : null}
          </div>

          {/* Lesson type breakdown */}
          {typeEntries.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5">
              {typeEntries.map(([type, count]) => (
                <span
                  key={type}
                  className="inline-flex items-center gap-1 rounded-full bg-charcoal-50 px-2 py-0.5 text-[11px] text-charcoal-700"
                  title={`${count} ${TYPE_LABELS[type] || type} lesson${count === 1 ? '' : 's'}`}
                >
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      TYPE_DOT_COLORS[type] || 'bg-charcoal-400'
                    )}
                  />
                  {TYPE_LABELS[type] || formatCategoryLabel(type)} · {count}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-charcoal-400 italic">No lessons yet</p>
          )}

          <div className="mt-auto flex items-center justify-between pt-1 text-[11px] text-charcoal-400">
            <span title={activityTimestamp ? new Date(activityTimestamp).toLocaleString() : undefined}>
              Updated {activityTimestamp ? formatRelativeTime(activityTimestamp) : '—'}
            </span>
            <span className="invisible text-charcoal-500 group-hover:visible">Open →</span>
          </div>
        </div>
      </Link>

      {/* Row actions + quick add — outside the Link so clicks don't navigate */}
      <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <Link
          href={`/courses/${identifier}/lessons?lesson=new`}
          className="rounded-md bg-white/95 p-1.5 text-charcoal-700 shadow-sm ring-1 ring-charcoal-200 hover:bg-primary-50 hover:text-primary-700"
          title="Add lesson"
          aria-label={`Add lesson to ${course.title}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Plus className="h-4 w-4" />
        </Link>
        <CardActionsMenu
          editHref={`/courses/${identifier}/settings`}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      </div>
    </article>
  );
}

function CardActionsMenu({
  editHref,
  onDuplicate,
  onDelete,
}: {
  editHref: string;
  onDuplicate?: () => void;
  onDelete?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Course actions"
        className="rounded-md bg-white/95 p-1.5 text-charcoal-700 shadow-sm ring-1 ring-charcoal-200 hover:bg-charcoal-50"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-lg border border-charcoal-200 bg-white shadow-lg"
        >
          <Link
            href={editHref}
            role="menuitem"
            className="flex items-center gap-2 px-3 py-2 text-sm text-charcoal-800 hover:bg-charcoal-50"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
          {onDuplicate ? (
            <button
              type="button"
              role="menuitem"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(false);
                onDuplicate();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-charcoal-800 hover:bg-charcoal-50"
            >
              <Copy className="h-4 w-4" />
              Duplicate
            </button>
          ) : null}
          {onDelete ? (
            <button
              type="button"
              role="menuitem"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(false);
                onDelete();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
