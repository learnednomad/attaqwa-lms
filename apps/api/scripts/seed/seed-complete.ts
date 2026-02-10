/**
 * Comprehensive Database Seeder - AttaqwaMasjid LMS
 *
 * Seeds ALL user-facing data via Strapi REST API:
 * users, enrollments, progress, achievements, streaks, leaderboard, moderation
 *
 * PREREQUISITES:
 *   - Strapi running with bootstrap-seeded courses/lessons/quizzes
 *   - No prior admin registered (or script will fall back to login)
 *
 * USAGE:
 *   docker exec attaqwa-api-dev sh -c "cd apps/api && npx tsx scripts/seed/seed-complete.ts"
 *   -- or locally --
 *   pnpm --filter api seed:complete
 */

import pg from 'pg';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

// ─── Database client for direct status updates ──────────────────────────────
// Strapi v5 CM API interprets `status` in request body as publication status,
// conflicting with content-type `status` enum fields. Direct SQL bypasses this.

let _pgPool: pg.Pool | null = null;

function getPgPool(): pg.Pool {
  if (!_pgPool) {
    _pgPool = new pg.Pool({
      host: process.env.DATABASE_HOST || 'postgres',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      database: process.env.DATABASE_NAME || 'attaqwa_lms',
      user: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'dev-password-change-me',
    });
  }
  return _pgPool;
}

async function sqlUpdateStatus(table: string, id: number, status: string): Promise<boolean> {
  try {
    const pool = getPgPool();
    await pool.query(`UPDATE ${table} SET status = $1 WHERE id = $2`, [status, id]);
    return true;
  } catch (e: any) {
    console.error(`  ! SQL update failed for ${table}#${id}: ${e.message}`);
    return false;
  }
}

async function closePg() {
  if (_pgPool) {
    await _pgPool.end();
    _pgPool = null;
  }
}

// ─── helpers ────────────────────────────────────────────────────────────────

async function api(path: string, opts: RequestInit = {}) {
  const url = `${STRAPI_URL}${path}`;
  const res = await fetch(url, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...opts.headers },
  });
  const body = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, body };
}

async function apiAuth(path: string, jwt: string, opts: RequestInit = {}) {
  return api(path, {
    ...opts,
    headers: { Authorization: `Bearer ${jwt}`, ...opts.headers },
  });
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function dateOnly(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ─── Content Manager API helper ─────────────────────────────────────────────
// Strapi v5 blocks `user` (users-permissions relation) from public REST API bodies.
// We use the admin Content Manager API for records that need user relations.

const CM_BASE = '/content-manager/collection-types';

async function cmCreate(uid: string, adminJwt: string, data: Record<string, any>) {
  return apiAuth(`${CM_BASE}/${uid}`, adminJwt, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async function cmUpdate(uid: string, documentId: string, adminJwt: string, data: Record<string, any>) {
  return apiAuth(`${CM_BASE}/${uid}/${documentId}`, adminJwt, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// REST API PUT wraps data in { data: { ... } } — avoids CM API `status` field conflict
async function restUpdate(endpoint: string, documentId: string, data: Record<string, any>) {
  return api(`${endpoint}/${documentId}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
}

// ─── Phase 0: Strapi Admin ─────────────────────────────────────────────────

async function ensureStrapiAdmin(): Promise<string> {
  console.log('\n--- Phase 0: Strapi Admin ---');

  const adminCreds = {
    email: 'admin@attaqwa.local',
    password: 'Admin1234!',
    firstname: 'Admin',
    lastname: 'AttaqwaLMS',
  };

  // Try registering first admin
  const reg = await api('/admin/register-admin', {
    method: 'POST',
    body: JSON.stringify(adminCreds),
  });

  if (reg.ok && reg.body?.data?.token) {
    console.log('  + Strapi admin registered');
    return reg.body.data.token;
  }

  // Already exists — login
  const login = await api('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email: adminCreds.email, password: adminCreds.password }),
  });

  if (login.ok && login.body?.data?.token) {
    console.log('  = Strapi admin already exists, logged in');
    return login.body.data.token;
  }

  console.warn('  ! Could not register or login Strapi admin — continuing without admin JWT');
  return '';
}

// ─── Phase 1: Register Users ────────────────────────────────────────────────

interface UserDef {
  username: string;
  email: string;
  password: string;
  role: string;
}

const USERS: UserDef[] = [
  { username: 'ahmed_student', email: 'ahmed@attaqwa.test', password: 'Student123!', role: 'student' },
  { username: 'fatima_student', email: 'fatima@attaqwa.test', password: 'Student123!', role: 'student' },
  { username: 'omar_student', email: 'omar@attaqwa.test', password: 'Student123!', role: 'student' },
  { username: 'sheikh_instructor', email: 'instructor@attaqwa.test', password: 'Instructor123!', role: 'instructor' },
  { username: 'admin_user', email: 'admin@attaqwa.test', password: 'Admin123!', role: 'admin' },
];

interface RegisteredUser {
  id: number;
  jwt: string;
  username: string;
  role: string;
}

async function registerUsers(): Promise<RegisteredUser[]> {
  console.log('\n--- Phase 1: Register Users ---');
  const registered: RegisteredUser[] = [];

  for (const u of USERS) {
    // Try register
    const reg = await api('/api/auth/local/register', {
      method: 'POST',
      body: JSON.stringify({ username: u.username, email: u.email, password: u.password }),
    });

    if (reg.ok && reg.body?.jwt) {
      console.log(`  + Registered ${u.username}`);
      registered.push({ id: reg.body.user.id, jwt: reg.body.jwt, username: u.username, role: u.role });
      continue;
    }

    // Already exists — login
    const login = await api('/api/auth/local', {
      method: 'POST',
      body: JSON.stringify({ identifier: u.email, password: u.password }),
    });

    if (login.ok && login.body?.jwt) {
      console.log(`  = ${u.username} already exists, logged in`);
      registered.push({ id: login.body.user.id, jwt: login.body.jwt, username: u.username, role: u.role });
    } else {
      console.error(`  ! Failed for ${u.username}:`, login.body?.error?.message || 'unknown');
    }
  }

  return registered;
}

// ─── Phase 2: Fetch Existing Content ────────────────────────────────────────

interface StrapiItem { id: number; documentId: string; [k: string]: any }

async function fetchAll(endpoint: string): Promise<StrapiItem[]> {
  const items: StrapiItem[] = [];
  let page = 1;
  const sep = endpoint.includes('?') ? '&' : '?';
  while (true) {
    const res = await api(`${endpoint}${sep}pagination[page]=${page}&pagination[pageSize]=100`);
    if (!res.ok || !res.body?.data?.length) break;
    items.push(...res.body.data);
    if (res.body.meta?.pagination?.pageCount <= page) break;
    page++;
  }
  return items;
}

// ─── Phase 3: Achievements ─────────────────────────────────────────────────

const ACHIEVEMENTS = [
  { title: 'First Steps', slug: 'first-steps', description: 'Complete your first lesson', achievement_type: 'participation', rarity: 'common', points: 10, criteria: { type: 'lessons_completed', threshold: 1 }, display_order: 1 },
  { title: 'Course Explorer', slug: 'course-explorer', description: 'Enroll in 3 courses', achievement_type: 'participation', rarity: 'common', points: 25, criteria: { type: 'courses_enrolled', threshold: 3 }, display_order: 2 },
  { title: 'Dedicated Learner', slug: 'dedicated-learner', description: 'Complete your first course', achievement_type: 'course_completion', rarity: 'common', points: 50, criteria: { type: 'courses_completed', threshold: 1 }, display_order: 3 },
  { title: 'Knowledge Seeker', slug: 'knowledge-seeker', description: 'Complete 3 courses', achievement_type: 'course_completion', rarity: 'uncommon', points: 100, criteria: { type: 'courses_completed', threshold: 3 }, display_order: 4 },
  { title: 'Scholar', slug: 'scholar', description: 'Complete 5 courses', achievement_type: 'course_completion', rarity: 'rare', points: 250, criteria: { type: 'courses_completed', threshold: 5 }, display_order: 5 },
  { title: 'Quiz Whiz', slug: 'quiz-whiz', description: 'Pass 5 quizzes', achievement_type: 'quiz_mastery', rarity: 'common', points: 50, criteria: { type: 'quizzes_passed', threshold: 5 }, display_order: 6 },
  { title: 'Perfect Score', slug: 'perfect-score', description: 'Score 100% on any quiz', achievement_type: 'quiz_mastery', rarity: 'rare', points: 150, criteria: { type: 'quiz_perfect_score', threshold: 1 }, display_order: 7 },
  { title: 'Quiz Master', slug: 'quiz-master', description: 'Score 90%+ on 10 quizzes', achievement_type: 'quiz_mastery', rarity: 'epic', points: 300, criteria: { type: 'quizzes_high_score', threshold: 10 }, display_order: 8 },
  { title: 'Consistent Learner', slug: 'consistent-learner', description: 'Maintain a 7-day learning streak', achievement_type: 'streak', rarity: 'uncommon', points: 75, criteria: { type: 'streak_days', threshold: 7 }, display_order: 9 },
  { title: 'Month of Dedication', slug: 'month-of-dedication', description: 'Maintain a 30-day learning streak', achievement_type: 'streak', rarity: 'rare', points: 200, criteria: { type: 'streak_days', threshold: 30 }, display_order: 10 },
  { title: 'Ramadan Scholar', slug: 'ramadan-scholar', description: 'Complete a course during Ramadan', achievement_type: 'streak', rarity: 'epic', points: 500, criteria: { type: 'ramadan_completion', threshold: 1 }, display_order: 11 },
  { title: 'Quran Companion', slug: 'quran-companion', description: 'Complete 10 Quran lessons', achievement_type: 'special', rarity: 'uncommon', points: 150, criteria: { type: 'subject_lessons', subject: 'quran', threshold: 10 }, display_order: 12 },
  { title: 'Arabic Navigator', slug: 'arabic-navigator', description: 'Complete 10 Arabic lessons', achievement_type: 'special', rarity: 'uncommon', points: 150, criteria: { type: 'subject_lessons', subject: 'arabic', threshold: 10 }, display_order: 13 },
  { title: 'Community Pillar', slug: 'community-pillar', description: 'Engage with the community consistently for 60 days', achievement_type: 'participation', rarity: 'rare', points: 200, criteria: { type: 'community_engagement_days', threshold: 60 }, display_order: 14 },
  { title: 'Hafiz in Training', slug: 'hafiz-in-training', description: 'Complete all Quran memorisation courses', achievement_type: 'special', rarity: 'legendary', points: 1000, criteria: { type: 'quran_courses_completed', threshold: 'all' }, display_order: 15 },
];

async function seedAchievements(): Promise<StrapiItem[]> {
  console.log('\n--- Phase 3: Achievements ---');

  // Check existing
  const existing = await fetchAll('/api/v1/achievements');
  if (existing.length >= 15) {
    console.log(`  = ${existing.length} achievements already exist, skipping`);
    return existing;
  }

  const existingSlugs = new Set(existing.map(a => a.slug));
  const created: StrapiItem[] = [...existing];

  for (const ach of ACHIEVEMENTS) {
    if (existingSlugs.has(ach.slug)) continue;
    const res = await api('/api/v1/achievements', {
      method: 'POST',
      body: JSON.stringify({ data: { ...ach, is_active: true, publishedAt: new Date().toISOString() } }),
    });
    if (res.ok && res.body?.data) {
      created.push(res.body.data);
      console.log(`  + ${ach.title}`);
    } else {
      console.error(`  ! ${ach.title}: ${res.body?.error?.message || res.status}`);
    }
    await sleep(80); // rate limit protection
  }

  console.log(`  Total achievements: ${created.length}`);
  return created;
}

// ─── Phase 4: Course Enrollments ────────────────────────────────────────────

async function seedEnrollments(
  students: RegisteredUser[],
  courses: StrapiItem[],
  adminJwt: string,
): Promise<StrapiItem[]> {
  console.log('\n--- Phase 4: Course Enrollments ---');

  const existing = await fetchAll('/api/v1/course-enrollments');
  if (existing.length >= 10) {
    console.log(`  = ${existing.length} enrollments exist, skipping`);
    return existing;
  }

  const ahmed = students.find(s => s.username === 'ahmed_student')!;
  const fatima = students.find(s => s.username === 'fatima_student')!;
  const omar = students.find(s => s.username === 'omar_student')!;

  if (!ahmed || !fatima || !omar) {
    console.error('  ! Missing student users, cannot seed enrollments');
    return existing;
  }

  // Build enrollment definitions
  // Ahmed: 5 courses (1 completed, 4 active at varying progress)
  // Fatima: 4 courses (2 completed, 2 active at high progress)
  // Omar: 3 courses (0 completed, 2 active low progress, 1 pending)
  // Use modular indices based on actual course count so it works with any number of courses
  const numCourses = courses.length;
  const enrollmentDefs: {
    user: RegisteredUser;
    courseIndex: number;
    status: string;
    progress: number;
    lessonsCompleted: number;
    quizzesCompleted: number;
    avgQuiz: number;
    timeSpent: number;
    daysAgo: number;
  }[] = [
    // Ahmed: 5 enrollments (1 completed, 4 active)
    { user: ahmed, courseIndex: 0 % numCourses, status: 'completed', progress: 100, lessonsCompleted: 4, quizzesCompleted: 1, avgQuiz: 85, timeSpent: 180, daysAgo: 60 },
    { user: ahmed, courseIndex: 1 % numCourses, status: 'active', progress: 75, lessonsCompleted: 3, quizzesCompleted: 1, avgQuiz: 78, timeSpent: 150, daysAgo: 30 },
    { user: ahmed, courseIndex: 2 % numCourses, status: 'active', progress: 50, lessonsCompleted: 2, quizzesCompleted: 0, avgQuiz: 0, timeSpent: 90, daysAgo: 20 },
    { user: ahmed, courseIndex: 3 % numCourses, status: 'active', progress: 30, lessonsCompleted: 1, quizzesCompleted: 0, avgQuiz: 0, timeSpent: 45, daysAgo: 10 },
    { user: ahmed, courseIndex: 4 % numCourses, status: 'active', progress: 60, lessonsCompleted: 2, quizzesCompleted: 1, avgQuiz: 72, timeSpent: 120, daysAgo: 15 },
    // Fatima: 4 enrollments (2 completed, 2 active)
    { user: fatima, courseIndex: 0 % numCourses, status: 'completed', progress: 100, lessonsCompleted: 4, quizzesCompleted: 1, avgQuiz: 95, timeSpent: 200, daysAgo: 45 },
    { user: fatima, courseIndex: 1 % numCourses, status: 'completed', progress: 100, lessonsCompleted: 4, quizzesCompleted: 1, avgQuiz: 92, timeSpent: 220, daysAgo: 20 },
    { user: fatima, courseIndex: 2 % numCourses, status: 'active', progress: 85, lessonsCompleted: 3, quizzesCompleted: 1, avgQuiz: 88, timeSpent: 170, daysAgo: 5 },
    { user: fatima, courseIndex: 5 % numCourses, status: 'active', progress: 70, lessonsCompleted: 3, quizzesCompleted: 0, avgQuiz: 0, timeSpent: 130, daysAgo: 3 },
    // Omar: 3 enrollments (0 completed, 2 active, 1 pending)
    { user: omar, courseIndex: 3 % numCourses, status: 'active', progress: 25, lessonsCompleted: 1, quizzesCompleted: 0, avgQuiz: 0, timeSpent: 30, daysAgo: 14 },
    { user: omar, courseIndex: 4 % numCourses, status: 'active', progress: 20, lessonsCompleted: 1, quizzesCompleted: 0, avgQuiz: 0, timeSpent: 25, daysAgo: 7 },
    { user: omar, courseIndex: 5 % numCourses, status: 'pending', progress: 0, lessonsCompleted: 0, quizzesCompleted: 0, avgQuiz: 0, timeSpent: 0, daysAgo: 2 },
  ];

  const created: StrapiItem[] = [...existing];

  for (const def of enrollmentDefs) {
    const course = courses[def.courseIndex];
    if (!course) {
      console.error(`  ! Course index ${def.courseIndex} not found`);
      continue;
    }

    const data: Record<string, any> = {
      user: { connect: [{ id: def.user.id }] },
      course: { connect: [{ documentId: course.documentId }] },
      enrollment_status: def.status,
      enrollment_date: daysAgo(def.daysAgo),
      overall_progress: def.progress,
      lessons_completed: def.lessonsCompleted,
      quizzes_completed: def.quizzesCompleted,
      average_quiz_score: def.avgQuiz || null,
      total_time_spent_minutes: def.timeSpent,
      last_activity_date: def.status === 'pending' ? null : daysAgo(Math.max(0, def.daysAgo - 5)),
    };

    if (def.status === 'completed') {
      data.completion_date = daysAgo(Math.max(0, def.daysAgo - 10));
    }

    const res = await cmCreate('api::course-enrollment.course-enrollment', adminJwt, data);

    if (res.ok && res.body?.data) {
      created.push(res.body.data);
      console.log(`  + ${def.user.username} -> ${course.title} (${def.status})`);
    } else {
      console.error(`  ! ${def.user.username} -> course#${def.courseIndex}: ${res.body?.error?.message || res.status}`);
    }
    await sleep(100); // rate limit protection
  }

  console.log(`  Total enrollments: ${created.length}`);
  return created;
}

// ─── Phase 5: User Progress ────────────────────────────────────────────────

async function seedUserProgress(
  students: RegisteredUser[],
  lessons: StrapiItem[],
  quizzes: StrapiItem[],
  adminJwt: string,
): Promise<void> {
  console.log('\n--- Phase 5: User Progress ---');

  const existing = await fetchAll('/api/v1/user-progresses');
  if (existing.length >= 20) {
    console.log(`  = ${existing.length} progress records exist, skipping`);
    return;
  }

  const ahmed = students.find(s => s.username === 'ahmed_student')!;
  const fatima = students.find(s => s.username === 'fatima_student')!;
  const omar = students.find(s => s.username === 'omar_student')!;

  if (!ahmed || !fatima || !omar || lessons.length === 0) {
    console.error('  ! Missing students or lessons, skipping progress seeding');
    return;
  }

  // Build a map of lesson documentId -> quiz documentId
  const lessonToQuiz = new Map<string, string>();
  for (const q of quizzes) {
    if (q.lesson?.documentId) {
      lessonToQuiz.set(q.lesson.documentId, q.documentId);
    }
  }

  // Define progress per user as percentage-of-lessons
  const progressDefs: {
    user: RegisteredUser;
    lessonFraction: number; // fraction of total lessons to create progress for
    completedFraction: number; // of those, what fraction is completed
    quizScore: () => number;
    timePerLesson: number;
  }[] = [
    { user: ahmed, lessonFraction: 0.6, completedFraction: 0.7, quizScore: () => 70 + Math.floor(Math.random() * 20), timePerLesson: 25 },
    { user: fatima, lessonFraction: 0.85, completedFraction: 0.85, quizScore: () => 85 + Math.floor(Math.random() * 15), timePerLesson: 30 },
    { user: omar, lessonFraction: 0.25, completedFraction: 0.3, quizScore: () => 50 + Math.floor(Math.random() * 25), timePerLesson: 15 },
  ];

  let total = 0;

  for (const def of progressDefs) {
    const count = Math.max(1, Math.floor(lessons.length * def.lessonFraction));
    const completedCount = Math.floor(count * def.completedFraction);
    const selectedLessons = lessons.slice(0, count);
    let userTotal = 0;

    for (let i = 0; i < selectedLessons.length; i++) {
      const lesson = selectedLessons[i];
      const isCompleted = i < completedCount;
      const isInProgress = !isCompleted && i < completedCount + 3;
      const quizDocId = lessonToQuiz.get(lesson.documentId);
      const targetStatus = isCompleted ? 'completed' : isInProgress ? 'in_progress' : 'not_started';

      // Create without `status` field — Strapi CM API conflicts with content-type `status` enum.
      // The field defaults to 'not_started'; we update it in a follow-up PUT.
      const data: Record<string, any> = {
        user: { connect: [{ id: def.user.id }] },
        lesson: { connect: [{ documentId: lesson.documentId }] },
        progress_percentage: isCompleted ? 100 : isInProgress ? 30 + Math.floor(Math.random() * 50) : 0,
        time_spent_minutes: isCompleted ? def.timePerLesson : isInProgress ? Math.floor(def.timePerLesson * 0.4) : 0,
        last_accessed: isCompleted || isInProgress ? daysAgo(Math.floor(Math.random() * 30)) : null,
      };

      if (isCompleted) {
        data.completed_at = daysAgo(Math.floor(Math.random() * 40) + 5);
      }

      if (quizDocId && isCompleted) {
        data.quiz = { connect: [{ documentId: quizDocId }] };
        data.quiz_score = def.quizScore();
        data.quiz_attempts = 1 + Math.floor(Math.random() * 2);
      }

      const res = await cmCreate('api::user-progress.user-progress', adminJwt, data);

      if (res.ok && res.body?.data) {
        // Update status via direct SQL (CM API conflicts with content-type `status` enum)
        if (targetStatus !== 'not_started') {
          await sqlUpdateStatus('user_progresses', res.body.data.id, targetStatus);
        }
        total++;
        userTotal++;
      } else {
        console.error(`  ! progress ${def.user.username}/${lesson.documentId}: ${JSON.stringify(res.body?.error?.message || res.status)}`);
      }

      // Rate limit protection: pause every 5 requests
      if (i > 0 && i % 5 === 0) await sleep(100);
    }

    console.log(`  + ${def.user.username}: ${userTotal} progress records`);
  }

  console.log(`  Total progress records: ${total}`);
}

// ─── Phase 6: User Achievements ─────────────────────────────────────────────

async function seedUserAchievements(
  students: RegisteredUser[],
  achievements: StrapiItem[],
  adminJwt: string,
): Promise<void> {
  console.log('\n--- Phase 6: User Achievements ---');

  const existing = await fetchAll('/api/v1/user-achievements');
  if (existing.length >= 10) {
    console.log(`  = ${existing.length} user achievements exist, skipping`);
    return;
  }

  const ahmed = students.find(s => s.username === 'ahmed_student')!;
  const fatima = students.find(s => s.username === 'fatima_student')!;
  const omar = students.find(s => s.username === 'omar_student')!;

  if (!ahmed || !fatima || !omar || achievements.length === 0) {
    console.error('  ! Missing students or achievements');
    return;
  }

  const bySlug = new Map(achievements.map(a => [a.slug, a]));

  // Ahmed: First Steps, Course Explorer, Dedicated Learner, Quiz Whiz, Consistent Learner, Quran Companion
  // Fatima: First Steps, Course Explorer, Dedicated Learner, Knowledge Seeker, Quiz Whiz, Perfect Score, Consistent Learner, Month of Dedication, Quran Companion
  // Omar: First Steps

  const awards: { user: RegisteredUser; slug: string; completed: boolean; progress: number; daysAgo: number }[] = [
    { user: ahmed, slug: 'first-steps', completed: true, progress: 100, daysAgo: 58 },
    { user: ahmed, slug: 'course-explorer', completed: true, progress: 100, daysAgo: 45 },
    { user: ahmed, slug: 'dedicated-learner', completed: true, progress: 100, daysAgo: 30 },
    { user: ahmed, slug: 'quiz-whiz', completed: true, progress: 100, daysAgo: 25 },
    { user: ahmed, slug: 'consistent-learner', completed: true, progress: 100, daysAgo: 20 },
    { user: ahmed, slug: 'quran-companion', completed: false, progress: 60, daysAgo: 10 },
    { user: fatima, slug: 'first-steps', completed: true, progress: 100, daysAgo: 44 },
    { user: fatima, slug: 'course-explorer', completed: true, progress: 100, daysAgo: 38 },
    { user: fatima, slug: 'dedicated-learner', completed: true, progress: 100, daysAgo: 30 },
    { user: fatima, slug: 'knowledge-seeker', completed: false, progress: 66, daysAgo: 15 },
    { user: fatima, slug: 'quiz-whiz', completed: true, progress: 100, daysAgo: 28 },
    { user: fatima, slug: 'perfect-score', completed: true, progress: 100, daysAgo: 22 },
    { user: fatima, slug: 'consistent-learner', completed: true, progress: 100, daysAgo: 18 },
    { user: fatima, slug: 'month-of-dedication', completed: false, progress: 80, daysAgo: 5 },
    { user: fatima, slug: 'quran-companion', completed: false, progress: 70, daysAgo: 8 },
    { user: omar, slug: 'first-steps', completed: true, progress: 100, daysAgo: 12 },
  ];

  let total = 0;

  for (const award of awards) {
    const ach = bySlug.get(award.slug);
    if (!ach) {
      console.error(`  ! Achievement ${award.slug} not found`);
      continue;
    }

    const res = await cmCreate('api::user-achievement.user-achievement', adminJwt, {
      user: { connect: [{ id: award.user.id }] },
      achievement: { connect: [{ documentId: ach.documentId }] },
      earned_date: daysAgo(award.daysAgo),
      is_completed: award.completed,
      is_displayed: true,
      progress: award.progress,
      notes: award.completed ? `Earned by ${award.user.username}` : `In progress: ${award.progress}%`,
    });

    if (res.ok) {
      total++;
      console.log(`  + ${award.user.username} -> ${award.slug} (${award.completed ? 'completed' : award.progress + '%'})`);
    } else {
      console.error(`  ! ${award.user.username}/${award.slug}: ${res.body?.error?.message || res.status}`);
    }
    await sleep(80); // rate limit protection
  }

  console.log(`  Total user achievements: ${total}`);
}

// ─── Phase 7: Streaks ──────────────────────────────────────────────────────

async function seedStreaks(students: RegisteredUser[], adminJwt: string): Promise<void> {
  console.log('\n--- Phase 7: Streaks ---');

  const existing = await fetchAll('/api/v1/streaks');
  if (existing.length >= 3) {
    console.log(`  = ${existing.length} streaks exist, skipping`);
    return;
  }

  const streakDefs: { username: string; current: number; longest: number; totalDays: number; startDaysAgo: number; freezes: number }[] = [
    { username: 'ahmed_student', current: 12, longest: 18, totalDays: 45, startDaysAgo: 12, freezes: 1 },
    { username: 'fatima_student', current: 24, longest: 24, totalDays: 60, startDaysAgo: 24, freezes: 0 },
    { username: 'omar_student', current: 3, longest: 5, totalDays: 10, startDaysAgo: 3, freezes: 2 },
  ];

  for (const def of streakDefs) {
    const user = students.find(s => s.username === def.username);
    if (!user) continue;

    const res = await cmCreate('api::streak.streak', adminJwt, {
      user: { connect: [{ id: user.id }] },
      current_streak: def.current,
      longest_streak: def.longest,
      total_days_active: def.totalDays,
      streak_start_date: dateOnly(def.startDaysAgo),
      last_activity_date: dateOnly(0),
      is_active: true,
      streak_frozen: false,
      freeze_count: def.freezes,
      streak_history: Array.from({ length: Math.min(7, def.current) }, (_, i) => ({
        date: dateOnly(i),
        active: true,
      })),
    });

    if (res.ok) {
      console.log(`  + ${def.username}: ${def.current}-day streak`);
    } else {
      console.error(`  ! ${def.username}: ${res.body?.error?.message || res.status}`);
    }
  }
}

// ─── Phase 8: Leaderboard ──────────────────────────────────────────────────

async function seedLeaderboard(students: RegisteredUser[], adminJwt: string): Promise<void> {
  console.log('\n--- Phase 8: Leaderboard ---');

  const existing = await fetchAll('/api/v1/leaderboards');
  if (existing.length >= 3) {
    console.log(`  = ${existing.length} leaderboard entries exist, skipping`);
    return;
  }

  const leaderDefs: {
    username: string;
    rank: number;
    points: number;
    level: number;
    coursesCompleted: number;
    lessonsCompleted: number;
    quizzesCompleted: number;
    avgQuiz: number;
    currentStreak: number;
    longestStreak: number;
    achievementsEarned: number;
  }[] = [
    { username: 'fatima_student', rank: 1, points: 1850, level: 5, coursesCompleted: 2, lessonsCompleted: 14, quizzesCompleted: 3, avgQuiz: 92, currentStreak: 24, longestStreak: 24, achievementsEarned: 7 },
    { username: 'ahmed_student', rank: 2, points: 1200, level: 3, coursesCompleted: 1, lessonsCompleted: 12, quizzesCompleted: 3, avgQuiz: 78, currentStreak: 12, longestStreak: 18, achievementsEarned: 5 },
    { username: 'omar_student', rank: 3, points: 210, level: 1, coursesCompleted: 0, lessonsCompleted: 2, quizzesCompleted: 0, avgQuiz: 0, currentStreak: 3, longestStreak: 5, achievementsEarned: 1 },
  ];

  for (const def of leaderDefs) {
    const user = students.find(s => s.username === def.username);
    if (!user) continue;

    const res = await cmCreate('api::leaderboard.leaderboard', adminJwt, {
      user: { connect: [{ id: user.id }] },
      rank: def.rank,
      total_points: def.points,
      level: def.level,
      courses_completed: def.coursesCompleted,
      lessons_completed: def.lessonsCompleted,
      quizzes_completed: def.quizzesCompleted,
      average_quiz_score: def.avgQuiz || null,
      current_streak: def.currentStreak,
      longest_streak: def.longestStreak,
      achievements_earned: def.achievementsEarned,
      last_updated: new Date().toISOString(),
    });

    if (res.ok) {
      console.log(`  + #${def.rank} ${def.username}: ${def.points} pts, level ${def.level}`);
    } else {
      console.error(`  ! ${def.username}: ${res.body?.error?.message || res.status}`);
    }
  }
}

// ─── Phase 9: Moderation Queue ─────────────────────────────────────────────

async function seedModerationQueue(
  courses: StrapiItem[],
  lessons: StrapiItem[],
  adminJwt: string,
): Promise<void> {
  console.log('\n--- Phase 9: Moderation Queue ---');

  if (!adminJwt) {
    console.log('  ! No admin JWT available, skipping moderation queue');
    return;
  }

  // Check existing via content manager
  const existRes = await apiAuth(
    `${CM_BASE}/api::moderation-queue.moderation-queue?page=1&pageSize=1`,
    adminJwt,
  );
  const existingCount = existRes.body?.pagination?.total || 0;
  if (existingCount >= 5) {
    console.log(`  = ${existingCount} moderation items exist, skipping`);
    return;
  }

  const items: {
    content_type: string;
    content_id: string;
    content_title: string;
    status: string;
    ai_score: number;
    ai_reasoning: string;
    ai_flags: string[];
  }[] = [
    { content_type: 'course', content_id: courses[0]?.documentId || 'c1', content_title: courses[0]?.title || 'Course 1', status: 'approved', ai_score: 0.95, ai_reasoning: 'Content aligns with Islamic educational standards. No issues detected.', ai_flags: [] },
    { content_type: 'course', content_id: courses[1]?.documentId || 'c2', content_title: courses[1]?.title || 'Course 2', status: 'approved', ai_score: 0.92, ai_reasoning: 'Appropriate for children. Content is age-suitable.', ai_flags: [] },
    { content_type: 'lesson', content_id: lessons[0]?.documentId || 'l1', content_title: lessons[0]?.title || 'Lesson 1', status: 'pending', ai_score: 0.78, ai_reasoning: 'Content quality is good but references need verification.', ai_flags: ['needs_reference_check'] },
    { content_type: 'lesson', content_id: lessons[2]?.documentId || 'l3', content_title: lessons[2]?.title || 'Lesson 3', status: 'pending', ai_score: 0.65, ai_reasoning: 'Some content may need scholarly review for accuracy.', ai_flags: ['scholarly_review', 'accuracy_check'] },
    { content_type: 'lesson', content_id: lessons[4]?.documentId || 'l5', content_title: lessons[4]?.title || 'Lesson 5', status: 'needs_review', ai_score: 0.52, ai_reasoning: 'Flagged for potential sensitivity in historical context discussion.', ai_flags: ['sensitivity', 'historical_context'] },
    { content_type: 'course', content_id: courses[5]?.documentId || 'c6', content_title: courses[5]?.title || 'Course 6', status: 'approved', ai_score: 0.97, ai_reasoning: 'Excellent content quality with well-sourced references.', ai_flags: [] },
    { content_type: 'lesson', content_id: lessons[10]?.documentId || 'l11', content_title: lessons[10]?.title || 'Lesson 11', status: 'rejected', ai_score: 0.35, ai_reasoning: 'Content does not meet minimum quality standards. Needs significant revision.', ai_flags: ['low_quality', 'needs_revision'] },
    { content_type: 'lesson', content_id: lessons[15]?.documentId || 'l16', content_title: lessons[15]?.title || 'Lesson 16', status: 'pending', ai_score: 0.70, ai_reasoning: 'Generally acceptable. Minor formatting issues detected.', ai_flags: ['formatting'] },
  ];

  let total = 0;

  for (const item of items) {
    // Create without `status` field — Strapi CM API conflicts with content-type `status` enum.
    // The field defaults to 'pending'; we update it in a follow-up PUT.
    const res = await cmCreate('api::moderation-queue.moderation-queue', adminJwt, {
      content_type: item.content_type,
      content_id: item.content_id,
      content_title: item.content_title,
      ai_score: item.ai_score,
      ai_reasoning: item.ai_reasoning,
      ai_flags: item.ai_flags,
      reviewed_at: item.status !== 'pending' ? daysAgo(Math.floor(Math.random() * 10)) : null,
    });

    if (res.ok && res.body?.data) {
      // Update status via direct SQL (CM API conflicts with content-type `status` enum)
      if (item.status !== 'pending') {
        await sqlUpdateStatus('moderation_queues', res.body.data.id, item.status);
      }
      total++;
      console.log(`  + [${item.status}] ${item.content_title}`);
    } else {
      console.error(`  ! ${item.content_title}: ${JSON.stringify(res.body?.error?.message || res.status)}`);
    }

    await sleep(100); // rate limit protection
  }

  console.log(`  Total moderation items: ${total}`);
}

// ─── Phase 10: Announcements ──────────────────────────────────────────────

async function seedAnnouncements(adminJwt: string): Promise<void> {
  console.log('\n--- Phase 10: Announcements ---');

  if (!adminJwt) {
    console.log('  ! No admin JWT available, skipping announcements');
    return;
  }

  const existRes = await apiAuth(
    `${CM_BASE}/api::announcement.announcement?page=1&pageSize=1`,
    adminJwt,
  );
  const existingCount = existRes.body?.pagination?.total || 0;
  if (existingCount >= 5) {
    console.log(`  = ${existingCount} announcements exist, skipping`);
    return;
  }

  const items = [
    { title: 'Masjid Renovation Update', content: 'Alhamdulillah, the renovation of the main prayer hall is progressing well. The new carpet installation will be completed by the end of this month. We appreciate your patience during this time.', category: 'general', isActive: true, isPinned: true },
    { title: 'Ramadan Preparation Meeting', content: 'Join us this Saturday after Dhuhr prayer for a community meeting to prepare for the blessed month of Ramadan. We will discuss the Taraweeh schedule, iftar arrangements, and volunteer opportunities.', category: 'ramadan', isActive: true, isPinned: false },
    { title: 'Eid al-Fitr Prayer Announcement', content: 'Eid al-Fitr prayer will be held at 8:00 AM in the main hall and overflow area. Please arrive early. Takbeer will begin at 7:30 AM. Bring your own prayer mats.', category: 'eid', isActive: true, isPinned: true },
    { title: 'Urgent: Parking Lot Closure', content: 'Due to emergency utility work, the east parking lot will be closed from Monday to Wednesday. Please use the west entrance and street parking. We apologize for any inconvenience.', category: 'urgent', isActive: true, isPinned: false },
    { title: 'Community Iftar Program', content: 'Every Friday during Ramadan, we will host a community iftar. Volunteers needed for setup and food preparation. Contact the office to sign up.', category: 'community', isActive: true, isPinned: false },
    { title: 'Annual Fundraising Dinner', content: 'Join us for our annual fundraising dinner on March 15th at 7:00 PM. Special guest speaker Sheikh Ahmad. Tickets available at the masjid office or online. All proceeds go to the education fund.', category: 'fundraising', isActive: true, isPinned: false },
    { title: 'New Youth Program Launch', content: 'Exciting news! We are launching a new youth mentorship program for ages 13-18. Weekly sessions every Saturday after Asr prayer. Registration is now open.', category: 'community', isActive: true, isPinned: false },
    { title: 'Past Announcement - Archived', content: 'This is a past announcement that has been deactivated for testing purposes.', category: 'general', isActive: false, isPinned: false },
  ];

  let total = 0;
  for (const item of items) {
    const res = await cmCreate('api::announcement.announcement', adminJwt, item);
    if (res.ok && res.body?.data) {
      total++;
      console.log(`  + [${item.category}] ${item.title}`);
    } else {
      console.error(`  ! ${item.title}: ${JSON.stringify(res.body?.error?.message || res.status)}`);
    }
    await sleep(100);
  }
  console.log(`  Total announcements: ${total}`);
}

// ─── Phase 11: Events ─────────────────────────────────────────────────────

async function seedEvents(adminJwt: string): Promise<void> {
  console.log('\n--- Phase 11: Events ---');

  if (!adminJwt) {
    console.log('  ! No admin JWT available, skipping events');
    return;
  }

  const existRes = await apiAuth(
    `${CM_BASE}/api::event.event?page=1&pageSize=1`,
    adminJwt,
  );
  const existingCount = existRes.body?.pagination?.total || 0;
  if (existingCount >= 4) {
    console.log(`  = ${existingCount} events exist, skipping`);
    return;
  }

  const today = new Date();
  const futureDate = (days: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };
  const pastDate = (days: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  };

  const items = [
    { title: 'Friday Khutbah: The Power of Dua', description: 'Join us for this weeks Friday khutbah on the importance and etiquette of making dua.', date: futureDate(2), startTime: '13:00', endTime: '14:00', location: 'Main Prayer Hall', isIndoor: true, isActive: true, category: 'lecture' },
    { title: 'Community Potluck Dinner', description: 'Monthly community gathering with food, fellowship, and fun for the whole family. Please bring a dish to share.', date: futureDate(10), startTime: '18:00', endTime: '21:00', location: 'Community Hall', isIndoor: true, isActive: true, category: 'community' },
    { title: 'Youth Basketball Tournament', description: 'Annual youth basketball tournament for ages 12-18. Registration required. Prizes for top teams.', date: futureDate(21), startTime: '10:00', endTime: '16:00', location: 'Gymnasium', isIndoor: true, isActive: true, category: 'youth', maxAttendees: 60 },
    { title: 'Sisters Halaqa: Tafseer of Surah Maryam', description: 'Weekly sisters study circle focusing on the tafseer of Surah Maryam. All sisters welcome.', date: futureDate(5), startTime: '11:00', endTime: '12:30', location: 'Sisters Prayer Room', isIndoor: true, isActive: true, isRecurring: true, recurrencePattern: 'weekly', category: 'sisters' },
    { title: 'Past: Islamic History Lecture', description: 'A lecture on the golden age of Islamic civilization and its contributions to science and arts.', date: pastDate(14), startTime: '19:00', endTime: '20:30', location: 'Main Prayer Hall', isIndoor: true, isActive: false, category: 'lecture' },
    { title: 'Past: Annual Charity Walk', description: 'Community charity walk to raise funds for local food bank. 5K route through the neighborhood.', date: pastDate(30), startTime: '09:00', endTime: '12:00', location: 'Masjid Parking Lot', isOutdoor: true, isActive: false, category: 'fundraiser' },
  ];

  let total = 0;
  for (const item of items) {
    const res = await cmCreate('api::event.event', adminJwt, item);
    if (res.ok && res.body?.data) {
      total++;
      console.log(`  + [${item.category}] ${item.title}`);
    } else {
      console.error(`  ! ${item.title}: ${JSON.stringify(res.body?.error?.message || res.status)}`);
    }
    await sleep(100);
  }
  console.log(`  Total events: ${total}`);
}

// ─── Phase 12: Prayer Time Overrides ──────────────────────────────────────

async function seedPrayerTimeOverrides(adminJwt: string): Promise<void> {
  console.log('\n--- Phase 12: Prayer Time Overrides ---');

  if (!adminJwt) {
    console.log('  ! No admin JWT available, skipping prayer time overrides');
    return;
  }

  const existRes = await apiAuth(
    `${CM_BASE}/api::prayer-time-override.prayer-time-override?page=1&pageSize=1`,
    adminJwt,
  );
  const existingCount = existRes.body?.pagination?.total || 0;
  if (existingCount >= 2) {
    console.log(`  = ${existingCount} prayer time overrides exist, skipping`);
    return;
  }

  const today = new Date();
  const futureDate = (days: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const items = [
    { date: futureDate(1), prayer: 'isha', overrideTime: '20:30', reason: 'Ramadan adjustment - earlier Isha for Taraweeh', isActive: true },
    { date: futureDate(2), prayer: 'isha', overrideTime: '20:30', reason: 'Ramadan adjustment - earlier Isha for Taraweeh', isActive: true },
    { date: futureDate(3), prayer: 'fajr', overrideTime: '05:15', reason: 'Daylight saving time correction', isActive: true },
  ];

  let total = 0;
  for (const item of items) {
    const res = await cmCreate('api::prayer-time-override.prayer-time-override', adminJwt, item);
    if (res.ok && res.body?.data) {
      total++;
      console.log(`  + [${item.prayer}] ${item.date}: ${item.overrideTime} (${item.reason})`);
    } else {
      console.error(`  ! ${item.date} ${item.prayer}: ${JSON.stringify(res.body?.error?.message || res.status)}`);
    }
    await sleep(100);
  }
  console.log(`  Total prayer time overrides: ${total}`);
}

// ─── Phase 13: I'tikaf Registrations ──────────────────────────────────────

async function seedItikafRegistrations(adminJwt: string): Promise<void> {
  console.log('\n--- Phase 13: I\'tikaf Registrations ---');

  if (!adminJwt) {
    console.log('  ! No admin JWT available, skipping i\'tikaf registrations');
    return;
  }

  const existRes = await apiAuth(
    `${CM_BASE}/api::itikaf-registration.itikaf-registration?page=1&pageSize=1`,
    adminJwt,
  );
  const existingCount = existRes.body?.pagination?.total || 0;
  if (existingCount >= 3) {
    console.log(`  = ${existingCount} i'tikaf registrations exist, skipping`);
    return;
  }

  const items: {
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    age: number;
    durationType: string;
    startDate: string;
    endDate: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    medicalConditions?: string;
    specialRequirements?: string;
    status: string;
    notes?: string;
  }[] = [
    { fullName: 'Ahmed Ibrahim', email: 'ahmed@example.com', phone: '617-555-0101', gender: 'male', age: 32, durationType: 'last_ten', startDate: '2026-03-10', endDate: '2026-03-20', emergencyContactName: 'Sarah Ibrahim', emergencyContactPhone: '617-555-0102', status: 'approved', notes: 'Returning participant' },
    { fullName: 'Omar Hassan', email: 'omar@example.com', phone: '617-555-0201', gender: 'male', age: 25, durationType: 'full', startDate: '2026-03-01', endDate: '2026-03-30', emergencyContactName: 'Yusuf Hassan', emergencyContactPhone: '617-555-0202', medicalConditions: 'Mild asthma - carries inhaler', status: 'approved' },
    { fullName: 'Khalid Mansour', email: 'khalid@example.com', phone: '617-555-0301', gender: 'male', age: 45, durationType: 'weekend', startDate: '2026-03-14', endDate: '2026-03-16', emergencyContactName: 'Amina Mansour', emergencyContactPhone: '617-555-0302', status: 'pending' },
    { fullName: 'Bilal Thompson', email: 'bilal@example.com', phone: '617-555-0401', gender: 'male', age: 19, durationType: 'last_ten', startDate: '2026-03-10', endDate: '2026-03-20', emergencyContactName: 'James Thompson', emergencyContactPhone: '617-555-0402', specialRequirements: 'First time - needs guidance on i\'tikaf etiquette', status: 'pending' },
    { fullName: 'Youssef Ali', email: 'youssef@example.com', phone: '617-555-0501', gender: 'male', age: 55, durationType: 'custom', startDate: '2026-03-15', endDate: '2026-03-18', emergencyContactName: 'Layla Ali', emergencyContactPhone: '617-555-0502', medicalConditions: 'Diabetes - needs regular meals', status: 'rejected', notes: 'Capacity reached for requested dates' },
  ];

  let total = 0;
  for (const item of items) {
    const { status: desiredStatus, ...createData } = item;
    const res = await cmCreate('api::itikaf-registration.itikaf-registration', adminJwt, createData);
    if (res.ok && res.body?.data) {
      if (desiredStatus !== 'pending') {
        await sqlUpdateStatus('itikaf_registrations', res.body.data.id, desiredStatus);
      }
      total++;
      console.log(`  + [${desiredStatus}] ${item.fullName}`);
    } else {
      console.error(`  ! ${item.fullName}: ${JSON.stringify(res.body?.error?.message || res.status)}`);
    }
    await sleep(100);
  }
  console.log(`  Total i'tikaf registrations: ${total}`);
}

// ─── Phase 14: Appeals ────────────────────────────────────────────────────

async function seedAppeals(adminJwt: string): Promise<void> {
  console.log('\n--- Phase 14: Appeals ---');

  if (!adminJwt) {
    console.log('  ! No admin JWT available, skipping appeals');
    return;
  }

  const existRes = await apiAuth(
    `${CM_BASE}/api::appeal.appeal?page=1&pageSize=1`,
    adminJwt,
  );
  const existingCount = existRes.body?.pagination?.total || 0;
  if (existingCount >= 2) {
    console.log(`  = ${existingCount} appeals exist, skipping`);
    return;
  }

  const today = new Date();
  const futureDate = (days: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const items = [
    { title: 'Ramadan Zakat Fund 2026', description: 'Collect and distribute Zakat al-Fitr and Zakat al-Mal during the blessed month of Ramadan. All funds will be distributed to eligible recipients in our local community.', category: 'zakat', goalAmount: 50000, currentAmount: 32450, currency: 'USD', startDate: futureDate(-10), endDate: futureDate(30), isActive: true, isFeatured: true, contactEmail: 'zakat@attaqwa.org' },
    { title: 'Masjid Expansion - Phase 2', description: 'The second phase of our masjid expansion project includes adding a new multipurpose hall, expanded parking, and improved accessibility features. Your generous contributions will help us serve the growing community.', category: 'building_fund', goalAmount: 500000, currentAmount: 175000, currency: 'USD', startDate: futureDate(-60), endDate: futureDate(180), isActive: true, isFeatured: true, contactEmail: 'expansion@attaqwa.org', contactPhone: '617-555-1000' },
    { title: 'Emergency Relief - Palestine', description: 'Emergency humanitarian aid collection for families affected by the crisis in Palestine. All funds will be distributed through verified humanitarian organizations.', category: 'emergency', goalAmount: 25000, currentAmount: 21300, currency: 'USD', startDate: futureDate(-30), isActive: true, isFeatured: false, contactEmail: 'relief@attaqwa.org' },
  ];

  let total = 0;
  for (const item of items) {
    const res = await cmCreate('api::appeal.appeal', adminJwt, item);
    if (res.ok && res.body?.data) {
      total++;
      console.log(`  + [${item.category}] ${item.title}: $${item.currentAmount}/$${item.goalAmount}`);
    } else {
      console.error(`  ! ${item.title}: ${JSON.stringify(res.body?.error?.message || res.status)}`);
    }
    await sleep(100);
  }
  console.log(`  Total appeals: ${total}`);
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('========================================');
  console.log('  AttaqwaMasjid LMS - Complete Seeder');
  console.log('========================================');

  // Health check
  console.log(`\nConnecting to Strapi at ${STRAPI_URL}...`);
  try {
    const health = await fetch(`${STRAPI_URL}/_health`);
    if (!health.ok) throw new Error(`HTTP ${health.status}`);
  } catch (e: any) {
    console.error(`\n  Strapi is not reachable: ${e.message}`);
    console.error('  Make sure Strapi is running before seeding.');
    process.exit(1);
  }
  console.log('  Strapi is healthy\n');

  // Phase 0
  const adminJwt = await ensureStrapiAdmin();
  if (!adminJwt) {
    console.error('\n  Admin JWT is required for seeding. Cannot continue.');
    process.exit(1);
  }

  // Phase 1
  const users = await registerUsers();
  const students = users.filter(u => u.role === 'student');

  // Phase 2: Fetch bootstrap content
  console.log('\n--- Phase 2: Fetch Existing Content ---');
  const courses = await fetchAll('/api/v1/courses');
  console.log(`  Courses: ${courses.length}`);

  const lessons = await fetchAll('/api/v1/lessons');
  console.log(`  Lessons: ${lessons.length}`);

  // Fetch quizzes with lesson relation populated
  const quizzes = await fetchAll('/api/v1/quizzes?populate=lesson');
  console.log(`  Quizzes: ${quizzes.length}`);

  if (courses.length === 0) {
    console.error('\n  No courses found. Strapi bootstrap may not have run yet.');
    console.error('  Restart Strapi and try again.');
    process.exit(1);
  }

  // Phase 3
  const achievements = await seedAchievements();

  // Phase 4
  await seedEnrollments(students, courses, adminJwt);

  // Phase 5
  await seedUserProgress(students, lessons, quizzes, adminJwt);

  // Phase 6
  await seedUserAchievements(students, achievements, adminJwt);

  // Phase 7
  await seedStreaks(students, adminJwt);

  // Phase 8
  await seedLeaderboard(students, adminJwt);

  // Phase 9
  await seedModerationQueue(courses, lessons, adminJwt);

  // Phase 10
  await seedAnnouncements(adminJwt);

  // Phase 11
  await seedEvents(adminJwt);

  // Phase 12
  await seedPrayerTimeOverrides(adminJwt);

  // Phase 13
  await seedItikafRegistrations(adminJwt);

  // Phase 14
  await seedAppeals(adminJwt);

  // Cleanup
  await closePg();

  // Summary
  console.log('\n========================================');
  console.log('  Seeding Complete!');
  console.log('========================================');
  console.log('\n  Test Account Credentials:');
  console.log('  ┌──────────────────┬──────────────────────────┬─────────────────┐');
  console.log('  │ Username         │ Email                    │ Password        │');
  console.log('  ├──────────────────┼──────────────────────────┼─────────────────┤');
  for (const u of USERS) {
    console.log(`  │ ${u.username.padEnd(16)} │ ${u.email.padEnd(24)} │ ${u.password.padEnd(15)} │`);
  }
  console.log('  └──────────────────┴──────────────────────────┴─────────────────┘');
  console.log('\n  Strapi Admin: admin@attaqwa.local / Admin1234!');
  console.log('\n  Website:  http://localhost:3001');
  console.log('  Admin:    http://localhost:3000');
  console.log('  Strapi:   http://localhost:1337/admin\n');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\nFatal error:', err);
    process.exit(1);
  });
