import { test, expect, Page } from '@playwright/test';

/**
 * Critical Path E2E Tests for Refactoring Safety
 *
 * URL configuration:
 *   - Website: `page.goto('/foo')` resolves via Playwright baseURL (defaults to :3003).
 *   - Admin:   `process.env.ADMIN_URL` (defaults to http://localhost:3000).
 *
 * Auth credentials come from `scripts/seed-auth-users.sql`. CI seeds these via the
 * `migrations` job in `docker.yml` or the `e2e-tests` job in `ci.yml`. Locally you
 * can seed by running `psql "$DATABASE_URL" -f scripts/seed-auth-users.sql`.
 *
 * Paths 1–3 require Strapi + seeded course/lesson data on top of the auth seed. When
 * Strapi isn't reachable they auto-skip instead of hard-failing.
 *
 * Selector rules followed here:
 *   - Never rely on text-only selectors without scoping — many copy strings (nav,
 *     footer, mobile menu) repeat across the DOM and trip Playwright's strict mode.
 *   - Prefer role + accessible name (getByRole) where possible.
 *   - When falling back to text, use `exact: true` + `.first()`.
 *   - Login buttons: student page says "Login to Student Portal", admin-on-website
 *     page says "Sign In". Match with a tolerant regex on a submit-typed button.
 */

const ADMIN_URL = process.env.ADMIN_URL ?? 'http://localhost:3000';
const STUDENT_EMAIL = process.env.E2E_STUDENT_EMAIL ?? 'student@attaqwa.org';
const STUDENT_PASSWORD = process.env.E2E_STUDENT_PASSWORD ?? 'Student123!';
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? 'superadmin@attaqwa.org';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? 'SuperAdmin123!';

const LOGIN_BUTTON_RE = /^(Sign\s*In|Login(\s+to\s+Student\s+Portal)?)$/i;

async function submitLogin(page: Page) {
  const submit = page.getByRole('button', { name: LOGIN_BUTTON_RE });
  await submit.first().click();
}

async function loginAsStudent(page: Page) {
  await page.goto('/student/login');
  await page.fill('input[type="email"]', STUDENT_EMAIL);
  await page.fill('input[type="password"]', STUDENT_PASSWORD);
  await submitLogin(page);
  await page.waitForURL('**/student/dashboard', { timeout: 15_000 });
}

async function loginAsAdmin(page: Page) {
  await page.goto(`${ADMIN_URL}/admin/login`);
  await page.waitForSelector('input[type="email"]', { timeout: 5_000 });
  await page.fill('input[type="email"]', ADMIN_EMAIL);
  await page.fill('input[type="password"]', ADMIN_PASSWORD);
  await submitLogin(page);
  await page.waitForURL('**/admin', { timeout: 15_000 });
}

async function adminReachable(): Promise<boolean> {
  try {
    const res = await fetch(`${ADMIN_URL}/admin/login`, { redirect: 'manual' });
    return res.status < 500;
  } catch {
    return false;
  }
}

/** First visible prayer-time cell for the given prayer name. Handles menus/footers
 *  that repeat the label by filtering to a visible node. */
function prayerCell(page: Page, name: string) {
  return page.getByText(name, { exact: true }).first();
}

test.describe('Critical Path 1: Student Course Discovery Journey', () => {
  test('Student can login, browse courses, and view course details', async ({ page }) => {
    await loginAsStudent(page);
    // Student dashboard renders "Welcome Back, <name>" as its h1 — asserting a
    // generic h1 keeps the test resilient to name/copy tweaks.
    await expect(page.locator('h1').first()).toBeVisible();

    await page.goto('/education/browse');
    await expect(page.locator('h1').first()).toBeVisible();

    const firstCourse = page.locator('[data-testid="course-card"]').first();
    const hasCourses = await firstCourse.count() > 0;
    if (!hasCourses) {
      test.skip(true, 'No seeded courses found — run `pnpm --filter api seed:complete` before re-running.');
    }

    await firstCourse.click();
    await page.waitForURL('**/education/**', { timeout: 5_000 });
    await expect(page.locator('h1').first()).toBeVisible();
  });
});

test.describe('Critical Path 2: Student Quiz Journey', () => {
  test('Student can take a quiz, submit answers, and view results', async ({ page }) => {
    await loginAsStudent(page);
    await page.goto('/education/browse');

    const courseCard = page.locator('[data-testid="course-card"]').first();
    if (await courseCard.count() === 0) {
      test.skip(true, 'No seeded courses available for quiz flow.');
    }
    await courseCard.click();

    const quizButton = page.getByRole('button', { name: /Start Quiz/i }).or(page.getByRole('link', { name: /Quiz/i }));
    if (await quizButton.count() === 0) {
      test.skip(true, 'Course has no quiz — seed fixtures with a quiz to cover this path.');
    }

    await quizButton.first().click();
    await page.waitForURL('**/quiz/**', { timeout: 5_000 });

    const questionElement = page.locator('[data-testid="quiz-question"]').or(page.locator('form')).first();
    await expect(questionElement).toBeVisible({ timeout: 5_000 });

    const answerOptions = page.locator('input[type="radio"], input[type="checkbox"]');
    if (await answerOptions.count() > 0) {
      await answerOptions.first().click();
    }

    await page.getByRole('button', { name: /Submit/i }).first().click();

    const resultsIndicator = page.getByText(/Results|Score|Complete/i).first();
    await expect(resultsIndicator).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('Critical Path 3: Admin Course Management Journey', () => {
  test('Admin can login, create a course, and publish it', async ({ page }) => {
    if (!(await adminReachable())) {
      test.skip(true, `Admin app not reachable at ${ADMIN_URL}. Start it via docker compose or pnpm --filter admin dev.`);
    }

    await loginAsAdmin(page);
    await expect(page.locator('h1').first()).toBeVisible();

    const coursesLink = page.getByRole('link', { name: /Courses/i });
    if (await coursesLink.count() === 0) {
      test.skip(true, 'Admin UI does not expose a Courses link — schema change?');
    }
    await coursesLink.first().click();
    await page.waitForURL('**/courses', { timeout: 5_000 });

    await page.getByRole('button', { name: /Create|New Course/i }).first().click();
    await page.waitForSelector('form', { timeout: 5_000 });

    const titleInput = page.locator('input[name="title"], input[placeholder*="title" i]').first();
    await titleInput.fill(`E2E Course ${Date.now()}`);

    const descriptionInput = page.locator('textarea[name="description"], textarea').first();
    if (await descriptionInput.count() > 0) {
      await descriptionInput.fill('E2E test course.');
    }

    await page.getByRole('button', { name: /Save|Submit/i }).first().click();
    await page.waitForTimeout(2_000);

    const publishButton = page.getByRole('button', { name: /Publish|Activate/i });
    if (await publishButton.count() > 0) {
      await publishButton.first().click();
      await expect(page.getByText(/Published|Active/i).first()).toBeVisible({ timeout: 5_000 });
    }
  });
});

test.describe('Critical Path 4: Public Pages Accessibility', () => {
  test('Public users can access homepage and prayer times without login', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1').first()).toBeVisible();

    await page.getByRole('link', { name: /Prayer Times/i }).first().click();
    await page.waitForURL('**/prayer-times', { timeout: 5_000 });

    for (const name of ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
      await expect(prayerCell(page, name)).toBeVisible({ timeout: 15_000 });
    }
  });
});

test.describe('Critical Path 5: Mobile Responsiveness (Core Flows)', () => {
  test('Student can complete core flows on mobile device', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto('/');
    await expect(page.locator('h1').first()).toBeVisible();

    const mobileMenu = page.getByRole('button', { name: /menu/i });
    if (await mobileMenu.count() > 0) {
      await mobileMenu.first().click();
      const studentLink = page.getByRole('link', { name: /Student/i });
      if (await studentLink.count() > 0) {
        await studentLink.first().click();
        await page.waitForURL('**/student/login', { timeout: 5_000 });
        await expect(page.locator('input[type="email"]').first()).toBeVisible();
      }
    }

    await page.goto('/prayer-times');
    await expect(prayerCell(page, 'Fajr')).toBeVisible({ timeout: 15_000 });
  });
});

test.describe('Critical Paths: System Health Check', () => {
  test('All critical paths are accessible and functional', async ({ page }) => {
    const healthCheck = {
      homepage: false,
      prayerTimes: false,
      studentLogin: false,
      adminLogin: false,
      education: false,
    };

    try {
      await page.goto('/');
      await expect(page.locator('h1').first()).toBeVisible({ timeout: 5_000 });
      healthCheck.homepage = true;
    } catch (e) {
      console.error('Homepage failed:', e);
    }

    try {
      await page.goto('/prayer-times');
      await expect(prayerCell(page, 'Fajr')).toBeVisible({ timeout: 15_000 });
      healthCheck.prayerTimes = true;
    } catch (e) {
      console.error('Prayer Times failed:', e);
    }

    try {
      await page.goto('/student/login');
      await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 5_000 });
      healthCheck.studentLogin = true;
    } catch (e) {
      console.error('Student Login failed:', e);
    }

    if (await adminReachable()) {
      try {
        await page.goto(`${ADMIN_URL}/admin/login`);
        await page.waitForSelector('input[type="email"]', { timeout: 5_000 });
        healthCheck.adminLogin = true;
      } catch (e) {
        console.error('Admin Login failed:', e);
      }
    }

    try {
      await page.goto('/education/browse');
      await expect(page.locator('h1').first()).toBeVisible({ timeout: 5_000 });
      healthCheck.education = true;
    } catch (e) {
      console.error('Education Browse failed:', e);
    }

    console.log('\nSystem Health Check Results:');
    console.table(healthCheck);

    expect(healthCheck.homepage).toBe(true);
    expect(healthCheck.prayerTimes).toBe(true);
    expect(healthCheck.studentLogin).toBe(true);
    expect(healthCheck.education).toBe(true);
    // adminLogin intentionally not asserted — Path 3 already gates on that.
  });
});
