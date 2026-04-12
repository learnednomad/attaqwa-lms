/**
 * Lesson Drawer
 * Right-side slide-in that owns lesson authoring — create (with upfront
 * type picker) or edit. URL-driven so `?lesson=new` or `?lesson=<id>` both
 * deep-link correctly and survive refresh.
 */

'use client';

import { Loader2, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { AIToolsPanel } from '@/components/lessons/ai-tools-panel';
import { LessonForm, type LessonFormData } from '@/components/lessons/lesson-form';
import { LESSON_TEMPLATES } from '@/components/lessons/lesson-templates';
import { LessonTypePicker } from '@/components/lessons/lesson-type-picker';
import type { LessonType } from '@/components/lessons/lesson-type-badge';
import { submitLesson, strapiToFormType } from '@/components/lessons/submit-lesson';
import { Button } from '@/components/ui/button';
import { getLesson, type AdminLesson } from '@/lib/api/strapi-client';
import { cn } from '@/lib/utils/cn';

export type LessonDrawerTarget =
  | { mode: 'create'; initialType?: LessonType; lessonOrder?: number }
  | { mode: 'edit'; lessonId: string | number };

interface LessonDrawerProps {
  open: boolean;
  courseId: string | number;
  /** Course title for the drawer header. */
  courseTitle?: string;
  target: LessonDrawerTarget | null;
  onClose: () => void;
  /** Called after a successful create or update. */
  onSaved: (lesson: AdminLesson) => void;
}

export function LessonDrawer({
  open,
  courseId,
  courseTitle,
  target,
  onClose,
  onSaved,
}: LessonDrawerProps) {
  const [pickedType, setPickedType] = useState<LessonType | null>(null);
  const [step, setStep] = useState<'picker' | 'form'>('picker');
  const [initialData, setInitialData] = useState<Record<string, unknown> | undefined>(undefined);
  const [useTemplate, setUseTemplate] = useState(false);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Whenever the target changes, reset state per mode.
  useEffect(() => {
    if (!open || !target) return;
    setError(null);
    setUseTemplate(false);
    if (target.mode === 'create') {
      setInitialData(undefined);
      if (target.initialType) {
        setPickedType(target.initialType);
        setStep('form');
      } else {
        setPickedType(null);
        setStep('picker');
      }
    } else {
      // edit: fetch the lesson
      setStep('form');
      setLoadingLesson(true);
      getLesson(target.lessonId)
        .then((lesson) => {
          if (!lesson) {
            setError('Could not load this lesson.');
            return;
          }
          setInitialData(lesson as unknown as Record<string, unknown>);
          setPickedType((lesson.lesson_type as LessonType) || null);
        })
        .catch((err) => {
          console.error('[LessonDrawer] load failed', err);
          setError('Could not load this lesson.');
        })
        .finally(() => setLoadingLesson(false));
    }
  }, [open, target]);

  // Focus management: remember focus, move into drawer, restore on close.
  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      // Focus panel on next tick so the content is mounted.
      setTimeout(() => panelRef.current?.focus(), 0);
    } else if (previouslyFocused.current) {
      previouslyFocused.current.focus();
    }
  }, [open]);

  // Esc to close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const title = useMemo(() => {
    if (!target) return 'Lesson';
    if (target.mode === 'edit') return 'Edit lesson';
    if (step === 'picker') return 'New lesson';
    return 'New lesson details';
  }, [target, step]);

  const handleFormSubmit = useCallback(
    async (data: LessonFormData) => {
      if (!target) return;
      setSubmitting(true);
      setError(null);
      try {
        const strapiType = pickedType ?? undefined;
        const lessonOrder = target.mode === 'create' ? target.lessonOrder : undefined;
        const saved = await submitLesson({
          mode: target.mode,
          courseId,
          lessonId: target.mode === 'edit' ? target.lessonId : undefined,
          formData: data,
          strapiType,
          lessonOrder,
        });
        onSaved(saved);
      } catch (err) {
        console.error('[LessonDrawer] submit failed', err);
        setError(err instanceof Error ? err.message : 'Save failed.');
      } finally {
        setSubmitting(false);
      }
    },
    [courseId, onSaved, pickedType, target]
  );

  // Pre-fill initial data for create mode based on picked type so the
  // existing LessonForm renders the right editor.
  const initialForForm = useMemo(() => {
    if (target?.mode === 'edit' && initialData) {
      return initialData;
    }
    if (target?.mode === 'create' && pickedType) {
      // Map Strapi enum → form internal type.
      const formType = strapiToFormType(pickedType);
      const base: Record<string, unknown> = { lesson_type: pickedType, type: formType };
      if (useTemplate) {
        const tpl = LESSON_TEMPLATES[pickedType];
        if (tpl) {
          base.title = tpl.initial.title;
          base.description = tpl.initial.description;
          if (tpl.initial.duration_minutes) {
            base.duration_minutes = tpl.initial.duration_minutes;
          }
          if (tpl.initial.content) {
            base.content = tpl.initial.content;
          }
        }
      }
      return base;
    }
    return undefined;
  }, [initialData, pickedType, target, useTemplate]);

  if (!open || !target) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-charcoal-900/40 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lesson-drawer-title"
        tabIndex={-1}
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col border-l border-charcoal-200 bg-white shadow-2xl outline-none'
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-charcoal-200 px-5 py-4">
          <div className="min-w-0">
            <h2
              id="lesson-drawer-title"
              className="truncate text-lg font-semibold text-charcoal-900"
            >
              {title}
            </h2>
            {courseTitle ? (
              <p className="mt-0.5 truncate text-xs text-charcoal-500">
                in <span className="font-medium text-charcoal-700">{courseTitle}</span>
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-charcoal-500 hover:bg-charcoal-100 hover:text-charcoal-900"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {error ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          ) : null}

          {loadingLesson ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary-500" />
              <span className="text-sm text-charcoal-500">Loading lesson...</span>
            </div>
          ) : target.mode === 'create' && step === 'picker' ? (
            <div className="space-y-5">
              <LessonTypePicker
                value={pickedType}
                onChange={setPickedType}
                onConfirm={(t) => {
                  setPickedType(t);
                  setStep('form');
                }}
              />
              {pickedType ? (
                <div className="rounded-lg border border-charcoal-200 bg-white p-3 text-xs text-charcoal-700">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-charcoal-900">
                        Template: {LESSON_TEMPLATES[pickedType].name}
                      </p>
                      <p className="mt-0.5 text-charcoal-500">
                        {LESSON_TEMPLATES[pickedType].description}
                      </p>
                    </div>
                    <label className="flex shrink-0 cursor-pointer items-center gap-2 text-xs text-charcoal-700">
                      <input
                        type="checkbox"
                        checked={useTemplate}
                        onChange={(e) => setUseTemplate(e.target.checked)}
                        className="h-4 w-4 rounded border-charcoal-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span>Start from template</span>
                    </label>
                  </div>
                </div>
              ) : null}
              <div className="flex justify-end gap-2 border-t border-charcoal-200 pt-4">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={() => pickedType && setStep('form')}
                  disabled={!pickedType}
                >
                  Continue
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <AIToolsPanel
                lessonType={pickedType}
                lessonTitle={(initialForForm?.title as string) ?? ''}
                lessonContent={(initialForForm?.content as string) ?? ''}
              />
              <LessonForm
                key={`${target.mode}-${
                  target.mode === 'edit' ? target.lessonId : pickedType ?? 'new'
                }`}
                courseId={String(courseId)}
                initialData={initialForForm}
                onSubmit={handleFormSubmit}
                onCancel={onClose}
                isLoading={submitting}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
