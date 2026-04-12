/**
 * Lessons Index
 * Cross-course lessons library. Grouped by course with collapsible sections,
 * pill-style type filters, relative timestamps, and hover-only row actions.
 */

'use client';

import {
  ChevronDown,
  ChevronRight,
  Copy,
  Loader2,
  MoreVertical,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { CoursePickerDialog } from '@/components/lessons/course-picker-dialog';
import { LESSON_TYPES, LessonTypeBadge, type LessonType } from '@/components/lessons/lesson-type-badge';
import { Button } from '@/components/ui/button';
import {
  type AdminLesson,
  deleteLessonById,
  duplicateLesson,
  listLessons,
} from '@/lib/api/strapi-client';
import { cn } from '@/lib/utils/cn';
import { formatDate, formatDuration, formatRelativeTime } from '@/lib/utils/formatters';

const PAGE_SIZE = 100;

interface Filters {
  type: string;
  q: string;
}

export function LessonsIndex() {
  const [filters, setFilters] = useState<Filters>({ type: 'all', q: '' });
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mutatingId, setMutatingId] = useState<number | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const fetchLessons = useCallback(async () => {
    setIsLoading(true);
    try {
      const { items } = await listLessons({
        type: filters.type === 'all' ? undefined : filters.type,
        q: filters.q.trim() || undefined,
        pageSize: PAGE_SIZE,
        sort: ['course.title:asc', 'lesson_order:asc'],
      });
      setLessons(items);
    } catch (error) {
      console.error('[LessonsIndex] Failed to load lessons:', error);
      setLessons([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters.type, filters.q]);

  useEffect(() => {
    const timer = setTimeout(fetchLessons, 250);
    return () => clearTimeout(timer);
  }, [fetchLessons]);

  const grouped = useMemo(() => groupByCourse(lessons), [lessons]);

  const toggleCourse = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const collapseAll = () => setCollapsed(new Set(grouped.map((g) => g.key)));
  const expandAll = () => setCollapsed(new Set());

  const handleDuplicate = async (lesson: AdminLesson) => {
    if (!lesson.course?.id) return;
    setMutatingId(lesson.id);
    try {
      await duplicateLesson(lesson.documentId || lesson.id);
      await fetchLessons();
    } catch {
      alert('Could not duplicate lesson.');
    } finally {
      setMutatingId(null);
    }
  };

  const handleDelete = async (lesson: AdminLesson) => {
    if (!confirm(`Delete lesson "${lesson.title}"? This cannot be undone.`)) return;
    setMutatingId(lesson.id);
    try {
      await deleteLessonById(lesson.documentId || lesson.id);
      await fetchLessons();
    } catch {
      alert('Could not delete lesson.');
    } finally {
      setMutatingId(null);
    }
  };

  const totalDuration = (items: AdminLesson[]) =>
    items.reduce((sum, l) => sum + (l.duration_minutes || 0), 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Lessons</h1>
          <p className="mt-1 text-sm text-charcoal-600">
            Browse lessons across every course, grouped by where they live.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchLessons} aria-label="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={() => setPickerOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New lesson
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-lg border border-charcoal-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
          <input
            type="text"
            value={filters.q}
            onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
            placeholder="Search lessons by title…"
            className="w-full rounded-lg border border-charcoal-300 py-1.5 pl-9 pr-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <FilterPill
            active={filters.type === 'all'}
            onClick={() => setFilters((f) => ({ ...f, type: 'all' }))}
          >
            All types
          </FilterPill>
          {LESSON_TYPES.map((t) => (
            <FilterPill
              key={t.value}
              active={filters.type === t.value}
              onClick={() => setFilters((f) => ({ ...f, type: t.value }))}
            >
              {t.label}
            </FilterPill>
          ))}
        </div>
      </div>

      {/* Secondary toolbar */}
      {grouped.length > 0 && (
        <div className="flex items-center justify-between text-xs text-charcoal-500">
          <span>
            {lessons.length} lesson{lessons.length === 1 ? '' : 's'} across{' '}
            {grouped.length} course{grouped.length === 1 ? '' : 's'}
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={expandAll}
              className="hover:text-charcoal-800 hover:underline"
            >
              Expand all
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="hover:text-charcoal-800 hover:underline"
            >
              Collapse all
            </button>
          </div>
        </div>
      )}

      {/* Groups */}
      {isLoading ? (
        <div className="flex items-center justify-center rounded-lg border border-charcoal-200 bg-white py-16">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary-500" />
          <span className="text-sm text-charcoal-500">Loading lessons…</span>
        </div>
      ) : grouped.length === 0 ? (
        <EmptyState hasFilters={!!filters.q || filters.type !== 'all'} />
      ) : (
        <div className="space-y-3">
          {grouped.map((group) => {
            const isCollapsed = collapsed.has(group.key);
            return (
              <section
                key={group.key}
                className="overflow-hidden rounded-lg border border-charcoal-200 bg-white"
              >
                <header className="flex items-center gap-2 border-b border-charcoal-100 bg-charcoal-50/60 px-3 py-2">
                  <button
                    type="button"
                    onClick={() => toggleCourse(group.key)}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    aria-expanded={!isCollapsed}
                    aria-controls={`group-${group.key}`}
                  >
                    {isCollapsed ? (
                      <ChevronRight className="h-4 w-4 shrink-0 text-charcoal-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-charcoal-500" />
                    )}
                    {group.courseId ? (
                      <Link
                        href={`/courses/${group.courseDocId || group.courseId}`}
                        className="truncate text-sm font-semibold text-charcoal-900 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {group.courseTitle}
                      </Link>
                    ) : (
                      <span className="truncate text-sm font-semibold text-charcoal-700">
                        {group.courseTitle}
                      </span>
                    )}
                    <span className="shrink-0 rounded-full bg-charcoal-100 px-2 py-0.5 text-[11px] font-medium text-charcoal-600">
                      {group.items.length}
                    </span>
                    <span className="hidden shrink-0 text-xs text-charcoal-500 sm:inline">
                      · {formatDuration(totalDuration(group.items))} total
                    </span>
                  </button>
                  {group.courseId ? (
                    <Link
                      href={`/courses/${group.courseDocId || group.courseId}/lessons?lesson=new`}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-charcoal-600 hover:bg-charcoal-100 hover:text-charcoal-900"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add
                    </Link>
                  ) : null}
                </header>
                {!isCollapsed && (
                  <ul id={`group-${group.key}`} className="divide-y divide-charcoal-100">
                    {group.items.map((lesson) => (
                      <LessonRow
                        key={lesson.id}
                        lesson={lesson}
                        busy={mutatingId === lesson.id}
                        onDuplicate={() => handleDuplicate(lesson)}
                        onDelete={() => handleDelete(lesson)}
                      />
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}

      <CoursePickerDialog open={pickerOpen} onClose={() => setPickerOpen(false)} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Supporting components
// ---------------------------------------------------------------------------

interface LessonRowProps {
  lesson: AdminLesson;
  busy: boolean;
  onDuplicate: () => void;
  onDelete: () => void;
}

function LessonRow({ lesson, busy, onDuplicate, onDelete }: LessonRowProps) {
  const courseIdentifier = lesson.course?.documentId || lesson.course?.id;
  const href = courseIdentifier
    ? `/courses/${courseIdentifier}/lessons?lesson=${lesson.documentId || lesson.id}`
    : '#';
  const published = !!lesson.publishedAt;

  return (
    <li className="group relative">
      <Link
        href={href}
        className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-charcoal-50/70 focus:bg-charcoal-50 focus:outline-none"
      >
        {/* Status dot */}
        <span
          className={cn(
            'h-2 w-2 shrink-0 rounded-full',
            published ? 'bg-emerald-500' : 'bg-charcoal-300'
          )}
          title={published ? 'Published' : 'Draft'}
          aria-label={published ? 'Published' : 'Draft'}
        />

        {/* Title + description */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-charcoal-900">{lesson.title}</p>
          {lesson.description ? (
            <p className="truncate text-xs text-charcoal-500">{lesson.description}</p>
          ) : null}
        </div>

        <LessonTypeBadge type={lesson.lesson_type} className="hidden shrink-0 sm:inline-flex" />

        <span className="hidden w-14 shrink-0 text-right text-xs text-charcoal-500 md:inline">
          {lesson.duration_minutes ? formatDuration(lesson.duration_minutes) : '—'}
        </span>

        <span
          className="hidden w-24 shrink-0 text-right text-xs text-charcoal-400 lg:inline"
          title={formatDate(lesson.updatedAt, 'MMM dd, yyyy p')}
        >
          {formatRelativeTime(lesson.updatedAt)}
        </span>

        {/* Spacer reserved for action menu so layout doesn't shift on hover */}
        <span className="w-8 shrink-0" aria-hidden="true" />
      </Link>

      {/* Hover/focus actions — absolutely positioned so the Link above stays clickable */}
      <div className="absolute right-2 top-1/2 hidden -translate-y-1/2 group-hover:block group-focus-within:block">
        <RowActionsMenu
          busy={busy}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          editHref={href}
        />
      </div>
    </li>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full px-3 py-1 text-xs font-medium transition-colors',
        active
          ? 'bg-primary-600 text-white shadow-sm'
          : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
      )}
    >
      {children}
    </button>
  );
}

function RowActionsMenu({
  busy,
  onDuplicate,
  onDelete,
  editHref,
}: {
  busy: boolean;
  onDuplicate: () => void;
  onDelete: () => void;
  editHref: string;
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
    <div ref={ref} className="relative" onClick={(e) => e.preventDefault()}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Lesson actions"
        className="rounded p-1.5 text-charcoal-500 hover:bg-charcoal-100 hover:text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
        disabled={busy}
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-lg border border-charcoal-200 bg-white shadow-lg"
        >
          <MenuLink href={editHref} icon={<Pencil className="h-4 w-4" />} label="Edit" />
          <MenuButton
            icon={<Copy className="h-4 w-4" />}
            label="Duplicate"
            onClick={() => {
              setOpen(false);
              onDuplicate();
            }}
          />
          <MenuButton
            icon={<Trash2 className="h-4 w-4" />}
            label="Delete"
            danger
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

function MenuLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="flex items-center gap-2 px-3 py-2 text-sm text-charcoal-800 hover:bg-charcoal-50"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function MenuButton({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors',
        danger ? 'text-red-600 hover:bg-red-50' : 'text-charcoal-800 hover:bg-charcoal-50'
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-charcoal-200 bg-white py-16 text-center">
      <Sparkles className="h-10 w-10 text-charcoal-300" aria-hidden="true" />
      <p className="mt-3 text-sm font-medium text-charcoal-800">
        {hasFilters ? 'No lessons match your filters' : 'No lessons yet'}
      </p>
      <p className="mt-1 text-xs text-charcoal-500">
        {hasFilters
          ? 'Try clearing your search or type filter.'
          : 'Pick a course and start authoring your first lesson.'}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface CourseGroup {
  key: string;
  courseId: number | null;
  courseDocId: string | null;
  courseTitle: string;
  items: AdminLesson[];
}

function groupByCourse(lessons: AdminLesson[]): CourseGroup[] {
  const map = new Map<string, CourseGroup>();
  for (const lesson of lessons) {
    const id = lesson.course?.id ?? null;
    const key = id != null ? String(id) : '__orphan__';
    let group = map.get(key);
    if (!group) {
      group = {
        key,
        courseId: id,
        courseDocId: lesson.course?.documentId ?? null,
        courseTitle: lesson.course?.title || 'Unassigned lessons',
        items: [],
      };
      map.set(key, group);
    }
    group.items.push(lesson);
  }
  for (const group of map.values()) {
    group.items.sort((a, b) => (a.lesson_order ?? 0) - (b.lesson_order ?? 0));
  }
  return Array.from(map.values()).sort((a, b) =>
    a.courseTitle.localeCompare(b.courseTitle)
  );
}
