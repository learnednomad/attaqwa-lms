/**
 * Course Picker Dialog
 * Opened from the global lessons library "New Lesson" CTA. Creation always
 * happens in course context, so we pick the course first then hand off to
 * the course outline (where the drawer auto-opens in Phase 2).
 */

'use client';

import { Loader2, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { listCoursesForPicker, type AdminLessonCourse } from '@/lib/api/strapi-client';

interface CoursePickerDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CoursePickerDialog({ open, onClose }: CoursePickerDialogProps) {
  const router = useRouter();
  const [courses, setCourses] = useState<AdminLessonCourse[] | null>(null);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    listCoursesForPicker()
      .then((data) => {
        if (cancelled) return;
        setCourses(data);
        setLoading(false);
        setHighlighted(0);
        setTimeout(() => searchRef.current?.focus(), 0);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('[CoursePicker] failed to load courses', err);
        setError('Could not load courses. Please try again.');
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const filtered = useMemo(() => {
    if (!courses) return [];
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return courses;
    return courses.filter((c) => c.title.toLowerCase().includes(trimmed));
  }, [courses, query]);

  useEffect(() => {
    setHighlighted(0);
  }, [query]);

  if (!open) return null;

  const pick = (course: AdminLessonCourse) => {
    const identifier = course.documentId || course.id;
    onClose();
    router.push(`/courses/${identifier}/lessons?lesson=new`);
  };

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((h) => Math.min(filtered.length - 1, h + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(0, h - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const pick$ = filtered[highlighted];
      if (pick$) pick(pick$);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-picker-title"
      className="fixed inset-0 z-50 flex items-start justify-center bg-charcoal-900/50 px-4 pt-24"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border border-charcoal-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center justify-between border-b border-charcoal-200 px-4 py-3">
          <h2 id="course-picker-title" className="text-base font-semibold text-charcoal-900">
            Add lesson to course
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-charcoal-500 hover:bg-charcoal-100 hover:text-charcoal-900"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="relative border-b border-charcoal-200 px-4 py-3">
          <Search className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses..."
            className="w-full rounded-lg border border-charcoal-300 py-2 pl-10 pr-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div className="max-h-72 overflow-y-auto" role="listbox" aria-label="Courses">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary-500" />
              <span className="text-sm text-charcoal-500">Loading courses...</span>
            </div>
          ) : error ? (
            <p className="py-8 text-center text-sm text-red-600">{error}</p>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-charcoal-500">
              {query ? `No courses matching "${query}"` : 'No courses yet — create one first.'}
            </p>
          ) : (
            <ul>
              {filtered.map((course, i) => {
                const isActive = i === highlighted;
                return (
                  <li key={course.id} role="option" aria-selected={isActive}>
                    <button
                      type="button"
                      onClick={() => pick(course)}
                      onMouseEnter={() => setHighlighted(i)}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-charcoal-800 hover:bg-charcoal-50'
                      }`}
                    >
                      <span className="truncate font-medium">{course.title}</span>
                      <span className="ml-3 shrink-0 text-xs text-charcoal-400">
                        {isActive ? '↵ Enter' : ''}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-charcoal-200 bg-charcoal-50 px-4 py-2 text-xs text-charcoal-500">
          <span>↑↓ to navigate · ↵ to select · Esc to close</span>
          <span>{filtered.length} course{filtered.length === 1 ? '' : 's'}</span>
        </div>
      </div>
    </div>
  );
}
