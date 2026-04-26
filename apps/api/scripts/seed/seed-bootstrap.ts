/**
 * Seed Bootstrap — courses, lessons, quizzes via HTTP (CI + manual)
 *
 * Run AFTER Strapi is up and STRAPI_API_TOKEN is set. Idempotent: skips when
 * courses already exist. Replaces the in-bootstrap.ts content seed that was
 * gated on `NODE_ENV !== 'production'`, allowing CI to run Strapi in
 * production mode for parity with prod deploys.
 *
 * Inputs (env):
 *   STRAPI_URL          (default http://localhost:1337)
 *   STRAPI_API_TOKEN    full-access token (required)
 *
 * Order: courses → lessons → quizzes. Each step short-circuits if data
 * already exists, mirroring the prior seedXIfEmpty semantics.
 */

import { COURSES, type CourseTemplate } from './templates';
import {
  getLessonTemplatesForCourse,
  generateQuizForLesson,
  type LessonTemplate,
  type QuizTemplate,
} from './lesson-quiz-templates';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_API_TOKEN) {
  console.error('❌ STRAPI_API_TOKEN is required. Run scripts/seed/ci-bootstrap.ts first.');
  process.exit(1);
}

interface ApiResult<T = unknown> {
  ok: boolean;
  status: number;
  body: T | null;
}

async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<ApiResult<T>> {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      // See ci-bootstrap.ts — required when Strapi runs NODE_ENV=production
      // behind plain-HTTP localhost (CI) and STRAPI_PROXY=true is set.
      'X-Forwarded-Proto': 'https',
      'X-Forwarded-Host': new URL(STRAPI_URL).host,
      ...(init.headers || {}),
    },
  });
  const body = (await res.json().catch(() => null)) as T | null;
  return { ok: res.ok, status: res.status, body };
}

interface StrapiEntry {
  id: number;
  documentId: string;
  [k: string]: unknown;
}

interface StrapiList {
  data?: StrapiEntry[];
  meta?: { pagination?: { total?: number } };
}

async function countExisting(endpoint: string): Promise<number> {
  const res = await api<StrapiList>(`${endpoint}?pagination[pageSize]=1`);
  if (!res.ok) {
    throw new Error(`GET ${endpoint} failed: status=${res.status} body=${JSON.stringify(res.body)}`);
  }
  return res.body?.meta?.pagination?.total ?? res.body?.data?.length ?? 0;
}

async function createEntry(endpoint: string, data: Record<string, unknown>): Promise<StrapiEntry | null> {
  const res = await api<{ data: StrapiEntry }>(endpoint, {
    method: 'POST',
    body: JSON.stringify({ data: { ...data, publishedAt: new Date().toISOString() } }),
  });
  if (!res.ok) {
    console.error(`   ✗ POST ${endpoint} (${(data as any).slug}): status=${res.status}`, res.body);
    return null;
  }
  return res.body?.data ?? null;
}

async function listAll<T extends StrapiEntry>(endpoint: string, query = ''): Promise<T[]> {
  const res = await api<{ data: T[] }>(`${endpoint}?pagination[pageSize]=200${query}`);
  if (!res.ok) {
    throw new Error(`GET ${endpoint} failed: status=${res.status}`);
  }
  return res.body?.data ?? [];
}

interface SeededCourse extends StrapiEntry {
  title: string;
  slug: string;
  age_tier: string;
  subject: string;
}

async function seedCourses(): Promise<{ created: number; skipped: boolean }> {
  const existing = await countExisting('/api/v1/courses');
  if (existing > 0) {
    console.log(`📚 ${existing} courses exist, skipping`);
    return { created: 0, skipped: true };
  }
  console.log(`📚 Seeding ${COURSES.length} courses...`);

  let created = 0;
  for (const course of COURSES) {
    const entry = await createEntry('/api/v1/courses', course as unknown as Record<string, unknown>);
    if (entry) created++;
  }
  console.log(`✅ Created ${created}/${COURSES.length} courses`);
  return { created, skipped: false };
}

interface SeededLesson extends StrapiEntry {
  title: string;
  slug: string;
  lesson_type: string;
  course?: { documentId: string; age_tier?: string; subject?: string } | null;
}

async function seedLessons(): Promise<{ created: number; skipped: boolean }> {
  const existing = await countExisting('/api/v1/lessons');
  if (existing > 0) {
    console.log(`📖 ${existing} lessons exist, skipping`);
    return { created: 0, skipped: true };
  }

  const courses = await listAll<SeededCourse>('/api/v1/courses');
  if (courses.length === 0) {
    console.log('   ⚠️  No courses found — cannot seed lessons');
    return { created: 0, skipped: true };
  }

  console.log(`📖 Seeding lessons for ${courses.length} courses...`);
  let created = 0;
  for (const course of courses) {
    const templates: LessonTemplate[] = getLessonTemplatesForCourse(course as unknown as CourseTemplate);
    for (const [index, template] of templates.entries()) {
      const entry = await createEntry('/api/v1/lessons', {
        ...template,
        lesson_order: index + 1,
        course: course.documentId,
      });
      if (entry) created++;
    }
  }
  console.log(`✅ Created ${created} lessons`);
  return { created, skipped: false };
}

async function seedQuizzes(): Promise<{ created: number; skipped: boolean }> {
  const existing = await countExisting('/api/v1/quizzes');
  if (existing > 0) {
    console.log(`📝 ${existing} quizzes exist, skipping`);
    return { created: 0, skipped: true };
  }

  const lessons = await listAll<SeededLesson>('/api/v1/lessons', '&populate=course');
  if (lessons.length === 0) {
    console.log('   ⚠️  No lessons found — cannot seed quizzes');
    return { created: 0, skipped: true };
  }

  const quizLessons = lessons.filter((l) => {
    const t = l.title.toLowerCase();
    return l.lesson_type === 'quiz' || t.includes('assessment') || t.includes('review');
  });

  console.log(`📝 Seeding ${quizLessons.length} quizzes (filtered from ${lessons.length} lessons)...`);
  let created = 0;
  for (const lesson of quizLessons) {
    const quiz: QuizTemplate = generateQuizForLesson({
      title: lesson.title,
      slug: lesson.slug,
      course: lesson.course ?? null,
    });
    const entry = await createEntry('/api/v1/quizzes', {
      ...quiz,
      lesson: lesson.documentId,
    });
    if (entry) created++;
  }
  console.log(`✅ Created ${created} quizzes`);
  return { created, skipped: false };
}

async function main() {
  console.log(`\n🌱 seed-bootstrap → ${STRAPI_URL}\n`);
  const start = Date.now();
  try {
    await seedCourses();
    await seedLessons();
    await seedQuizzes();
    console.log(`\n✅ seed-bootstrap done in ${((Date.now() - start) / 1000).toFixed(1)}s\n`);
  } catch (err) {
    console.error('\n❌ seed-bootstrap failed:', err);
    process.exit(1);
  }
}

main();
