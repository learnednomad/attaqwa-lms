/**
 * Course Lessons Outline
 * Drag-and-drop sortable list of lessons with inline quick-add and an
 * URL-driven editor drawer. Replaces the static list on the course
 * detail page.
 */

'use client';

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Copy,
  GripVertical,
  Loader2,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { LessonDrawer, type LessonDrawerTarget } from '@/components/lessons/lesson-drawer';
import { LESSON_TYPES, LessonTypeBadge, type LessonType } from '@/components/lessons/lesson-type-badge';
import { Button } from '@/components/ui/button';
import {
  type AdminLesson,
  deleteLessonById,
  duplicateLesson,
  listLessons,
  reorderLessons,
  strapiClient,
  adminApiEndpoints,
} from '@/lib/api/strapi-client';
import { cn } from '@/lib/utils/cn';
import { formatDuration } from '@/lib/utils/formatters';

interface CourseLessonsOutlineProps {
  courseId: string;
  courseTitle?: string;
}

export function CourseLessonsOutline({ courseId, courseTitle }: CourseLessonsOutlineProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const fetchLessons = useCallback(async () => {
    setLoading(true);
    try {
      const { items } = await listLessons({
        courseId,
        pageSize: 100,
        sort: ['lesson_order:asc'],
      });
      setLessons(items);
    } catch (err) {
      console.error('[CourseLessonsOutline] fetch failed', err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  // Drawer: URL-driven target derivation.
  const lessonParam = searchParams.get('lesson');
  const drawerOpen = !!lessonParam;
  const drawerTarget: LessonDrawerTarget | null = useMemo(() => {
    if (!lessonParam) return null;
    if (lessonParam === 'new') {
      const nextOrder =
        lessons.reduce((max, l) => Math.max(max, l.lesson_order ?? 0), 0) + 1;
      return { mode: 'create', lessonOrder: nextOrder };
    }
    // If the param is a numeric id or a Strapi documentId, let the drawer resolve it.
    return { mode: 'edit', lessonId: lessonParam };
  }, [lessonParam, lessons]);

  const openNew = () => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    params.set('lesson', 'new');
    router.replace(`?${params.toString()}`, { scroll: false });
  };
  const openEdit = (lesson: AdminLesson) => {
    const identifier = lesson.documentId || String(lesson.id);
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    params.set('lesson', identifier);
    router.replace(`?${params.toString()}`, { scroll: false });
  };
  const closeDrawer = useCallback(() => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    params.delete('lesson');
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : `/courses/${courseId}/lessons`, { scroll: false });
  }, [courseId, router, searchParams]);

  const handleSaved = async () => {
    closeDrawer();
    await fetchLessons();
  };

  // Dnd sensors: pointer + keyboard for a11y.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = lessons.findIndex((l) => String(l.id) === String(active.id));
    const newIndex = lessons.findIndex((l) => String(l.id) === String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(lessons, oldIndex, newIndex);
    const previous = lessons;
    setLessons(reordered);
    setReordering(true);
    try {
      await reorderLessons(reordered.map((l) => l.documentId || l.id));
      await fetchLessons();
    } catch (err) {
      console.error('[CourseLessonsOutline] reorder failed', err);
      setLessons(previous);
      alert('Could not save the new order. Reverted to previous order.');
    } finally {
      setReordering(false);
    }
  };

  const handleDuplicate = async (lesson: AdminLesson) => {
    setBusyId(lesson.id);
    try {
      await duplicateLesson(lesson.documentId || lesson.id);
      await fetchLessons();
    } catch (err) {
      console.error('[CourseLessonsOutline] duplicate failed', err);
      alert('Could not duplicate lesson.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (lesson: AdminLesson) => {
    if (!confirm(`Delete lesson "${lesson.title}"? This cannot be undone.`)) return;
    setBusyId(lesson.id);
    try {
      await deleteLessonById(lesson.documentId || lesson.id);
      await fetchLessons();
    } catch (err) {
      console.error('[CourseLessonsOutline] delete failed', err);
      alert('Could not delete lesson.');
    } finally {
      setBusyId(null);
    }
  };

  const handleQuickAdd = async (title: string, type: LessonType) => {
    const nextOrder =
      lessons.reduce((max, l) => Math.max(max, l.lesson_order ?? 0), 0) + 1;
    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') +
      '-' +
      Date.now().toString(36);

    try {
      const res = await strapiClient.post<AdminLesson>(adminApiEndpoints.lessons, {
        data: {
          title,
          slug,
          lesson_type: type,
          lesson_order: nextOrder,
          duration_minutes: 10,
          course: courseId,
        },
      });
      const created = (res.data as unknown) as AdminLesson;
      await fetchLessons();
      // Pop the drawer open for the author to enrich details.
      if (created) openEdit(created);
    } catch (err) {
      console.error('[CourseLessonsOutline] quick-add failed', err);
      alert('Could not create lesson.');
    }
  };

  const listIds = useMemo(() => lessons.map((l) => String(l.id)), [lessons]);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-charcoal-200 pb-3">
        <div>
          <h3 className="text-lg font-semibold text-charcoal-900">Lessons</h3>
          <p className="text-xs text-charcoal-500">
            Drag to reorder · Click a lesson to edit · Changes save automatically
          </p>
        </div>
        <div className="flex items-center gap-2">
          {reordering ? (
            <span className="inline-flex items-center text-xs text-charcoal-500">
              <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Saving order…
            </span>
          ) : null}
          <Button size="sm" onClick={openNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add lesson
          </Button>
        </div>
      </div>

      {/* Instructions for keyboard DnD — visually hidden, referenced via aria-describedby */}
      <p id="dnd-instructions" className="sr-only">
        Press Space or Enter to pick up a lesson, use the arrow keys to move it, and
        press Space or Enter again to drop. Press Escape to cancel.
      </p>

      {/* Quick add row */}
      <QuickAddRow onAdd={handleQuickAdd} />

      {/* Outline */}
      <div className="mt-3">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-sm text-charcoal-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary-500" />
            Loading lessons…
          </div>
        ) : lessons.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-charcoal-200 py-10 text-center">
            <p className="text-sm text-charcoal-600">No lessons yet.</p>
            <p className="mt-1 text-xs text-charcoal-500">
              Use the quick-add row above, or click <span className="font-medium">Add lesson</span>.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            onDragEnd={handleDragEnd}
            accessibility={{
              announcements: {
                onDragStart: ({ active }) => {
                  const l = lessons.find((x) => String(x.id) === String(active.id));
                  return `Picked up lesson ${l?.title ?? ''}.`;
                },
                onDragOver: ({ active, over }) => {
                  const l = lessons.find((x) => String(x.id) === String(active.id));
                  const idx = lessons.findIndex((x) => String(x.id) === String(over?.id));
                  return over && idx >= 0
                    ? `Lesson ${l?.title ?? ''} is over position ${idx + 1} of ${lessons.length}.`
                    : 'No drop target.';
                },
                onDragEnd: ({ active, over }) => {
                  const l = lessons.find((x) => String(x.id) === String(active.id));
                  const idx = lessons.findIndex((x) => String(x.id) === String(over?.id));
                  return over && idx >= 0
                    ? `Lesson ${l?.title ?? ''} moved to position ${idx + 1} of ${lessons.length}.`
                    : `Drag cancelled for ${l?.title ?? ''}.`;
                },
                onDragCancel: ({ active }) => {
                  const l = lessons.find((x) => String(x.id) === String(active.id));
                  return `Cancelled drag for ${l?.title ?? ''}.`;
                },
              },
            }}
          >
            <SortableContext items={listIds} strategy={verticalListSortingStrategy}>
              <ul className="space-y-2">
                {lessons.map((lesson) => (
                  <LessonRow
                    key={lesson.id}
                    lesson={lesson}
                    busy={busyId === lesson.id}
                    onEdit={() => openEdit(lesson)}
                    onDuplicate={() => handleDuplicate(lesson)}
                    onDelete={() => handleDelete(lesson)}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <LessonDrawer
        open={drawerOpen}
        courseId={courseId}
        courseTitle={courseTitle}
        target={drawerTarget}
        onClose={closeDrawer}
        onSaved={handleSaved}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quick add row
// ---------------------------------------------------------------------------

interface QuickAddRowProps {
  onAdd: (title: string, type: LessonType) => Promise<void> | void;
}

function QuickAddRow({ onAdd }: QuickAddRowProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<LessonType>('reading');
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const disabled = submitting || title.trim().length < 3;

  const submit = async () => {
    if (disabled) return;
    setSubmitting(true);
    try {
      await onAdd(title.trim(), type);
      setTitle('');
      setType('reading');
      inputRef.current?.focus();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-2 rounded-lg border border-charcoal-200 bg-white p-3 sm:flex-row sm:items-center">
      <input
        ref={inputRef}
        type="text"
        placeholder="Quick add: lesson title…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
        }}
        className="flex-1 rounded-lg border border-charcoal-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value as LessonType)}
        className="rounded-lg border border-charcoal-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        aria-label="Lesson type"
      >
        {LESSON_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
      <Button size="sm" onClick={submit} disabled={disabled} isLoading={submitting}>
        Add
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Lesson row (sortable)
// ---------------------------------------------------------------------------

interface LessonRowProps {
  lesson: AdminLesson;
  busy: boolean;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

function LessonRow({ lesson, busy, onEdit, onDuplicate, onDelete }: LessonRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(lesson.id) });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-3 rounded-lg border border-charcoal-200 bg-white px-3 py-2.5 shadow-sm transition-shadow',
        isDragging && 'shadow-lg ring-2 ring-primary-200'
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Reorder lesson: ${lesson.title}`}
        aria-describedby="dnd-instructions"
        className="cursor-grab rounded p-1 text-charcoal-400 hover:bg-charcoal-100 hover:text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" aria-hidden="true" />
      </button>

      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
        {lesson.lesson_order ?? '·'}
      </span>

      <button
        type="button"
        onClick={onEdit}
        className="flex min-w-0 flex-1 flex-col items-start text-left hover:underline focus:outline-none"
      >
        <span className="truncate text-sm font-medium text-charcoal-900">{lesson.title}</span>
        {lesson.description ? (
          <span className="mt-0.5 w-full truncate text-xs text-charcoal-500">
            {lesson.description}
          </span>
        ) : null}
      </button>

      <LessonTypeBadge type={lesson.lesson_type} className="hidden sm:inline-flex" />
      <span className="hidden w-16 text-right text-xs text-charcoal-500 md:inline">
        {lesson.duration_minutes ? formatDuration(lesson.duration_minutes) : '—'}
      </span>

      <RowActionsMenu
        busy={busy}
        onEdit={onEdit}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />
    </li>
  );
}

// ---------------------------------------------------------------------------
// Row actions menu (lightweight custom popover)
// ---------------------------------------------------------------------------

function RowActionsMenu({
  busy,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  busy: boolean;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
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
        onClick={() => setOpen((o) => !o)}
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
          className="absolute right-0 top-full z-10 mt-1 w-40 overflow-hidden rounded-lg border border-charcoal-200 bg-white shadow-lg"
        >
          <MenuItem
            icon={<Pencil className="h-4 w-4" />}
            label="Edit"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
          />
          <MenuItem
            icon={<Copy className="h-4 w-4" />}
            label="Duplicate"
            onClick={() => {
              setOpen(false);
              onDuplicate();
            }}
          />
          <MenuItem
            icon={<Trash2 className="h-4 w-4" />}
            label="Delete"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            danger
          />
        </div>
      ) : null}
    </div>
  );
}

function MenuItem({
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
        danger
          ? 'text-red-600 hover:bg-red-50'
          : 'text-charcoal-800 hover:bg-charcoal-50'
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
