/**
 * Shared create/update logic for a lesson, so the LessonDrawer and any
 * legacy full-page routes emit identical Strapi payloads.
 */

import type { LessonFormData } from '@/components/lessons/lesson-form';
import type { LessonType } from '@/components/lessons/lesson-type-badge';
import {
  adminApiEndpoints,
  type AdminLesson,
  createLesson,
  strapiClient,
  updateLesson,
} from '@/lib/api/strapi-client';

type FormInternalType = LessonFormData['type'];

/** Map the LessonForm's internal type to the Strapi enum. */
function formTypeToStrapi(type: FormInternalType): LessonType {
  switch (type) {
    case 'video':
      return 'video';
    case 'audio':
    case 'article':
      return 'reading';
    case 'quiz':
      return 'quiz';
    case 'interactive':
    default:
      return 'interactive';
  }
}

/** Map the Strapi enum back to the LessonForm's internal type for initialData. */
export function strapiToFormType(type: string | null | undefined): FormInternalType {
  switch ((type || '').toLowerCase()) {
    case 'video':
      return 'video';
    case 'reading':
      return 'article';
    case 'quiz':
      return 'quiz';
    case 'interactive':
    case 'practice':
      return 'interactive';
    default:
      return 'article';
  }
}

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') +
    '-' +
    Date.now().toString(36)
  );
}

async function uploadFile(file: File): Promise<number> {
  const fd = new FormData();
  fd.append('files', file);
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any)?.error || `Upload failed (${res.status})`);
  }
  const uploaded = await res.json();
  return uploaded[0]?.id;
}

 interface SubmitLessonArgs {
  mode: 'create' | 'edit';
  courseId: string | number;
  lessonId?: string | number;
  formData: LessonFormData;
  /** If provided, overrides the type derived from formData.type (honours the picker selection). */
  strapiType?: LessonType;
  /** For create, override lesson_order instead of trusting the form. */
  lessonOrder?: number;
}

export async function submitLesson(args: SubmitLessonArgs): Promise<AdminLesson> {
  const { mode, courseId, lessonId, formData, strapiType, lessonOrder } = args;
  const lessonType = strapiType ?? formTypeToStrapi(formData.type);

  let videoFileId: number | undefined;
  let audioFileId: number | undefined;
  if (formData.content.videoFile) {
    videoFileId = await uploadFile(formData.content.videoFile);
  }
  if (formData.content.audioFile) {
    audioFileId = await uploadFile(formData.content.audioFile);
  }

  const payload: Record<string, unknown> = {
    title: formData.title,
    description: formData.description || undefined,
    lesson_type: lessonType,
    lesson_order: lessonOrder ?? formData.order ?? 1,
    duration_minutes: formData.duration || 10,
  };

  if (mode === 'create') {
    payload.slug = slugify(formData.title);
    payload.course = courseId;
  }

  if (formData.type === 'video' && formData.content.videoUrl) {
    payload.video_url = formData.content.videoUrl;
  }
  if (videoFileId) payload.video_file = videoFileId;
  if (audioFileId) payload.audio_file = audioFileId;

  if (formData.type === 'article' && formData.content.articleBody) {
    payload.content = formData.content.articleBody;
  }
  if (formData.content.videoTranscript || formData.content.audioTranscript) {
    payload.content = formData.content.videoTranscript || formData.content.audioTranscript;
  }

  let result: AdminLesson;
  if (mode === 'create') {
    const res = await createLesson(payload as any);
    result = (res.data as any) as AdminLesson;
  } else {
    if (!lessonId) throw new Error('lessonId required for edit');
    const res = await updateLesson(lessonId, payload as any);
    result = (res.data as any) as AdminLesson;
  }

  // Quiz: persist linked Quiz entity if questions are present.
  if (
    formData.type === 'quiz' &&
    formData.content.questions &&
    formData.content.questions.length > 0
  ) {
    try {
      const quizSlug = `quiz-${slugify(formData.title)}`;
      const totalPoints = formData.content.questions.reduce(
        (sum, q) => sum + (q.points || 10),
        0
      );
      await strapiClient.post(adminApiEndpoints.quizzes, {
        data: {
          title: `Quiz: ${formData.title}`,
          slug: quizSlug,
          quiz_type: 'practice',
          passing_score: formData.content.passingScore || 70,
          time_limit_minutes: formData.content.timeLimit || undefined,
          questions: formData.content.questions,
          total_points: totalPoints,
          lesson: (result as any)?.documentId || (result as any)?.id,
        },
      });
    } catch (err) {
      console.warn('[submitLesson] Quiz persistence failed — lesson still saved.', err);
    }
  }

  return result;
}
