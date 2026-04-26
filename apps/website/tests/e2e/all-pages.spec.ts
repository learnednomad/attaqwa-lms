import { test, expect, Page } from '@playwright/test';

/**
 * All-Pages broad sweep — hydration + render checks for every user-facing route.
 *
 * This suite depends on a fully seeded Strapi + BetterAuth stack. In local dev bring
 * it up per docs/ci-strapi-e2e-handoff.md §2. In CI the e2e-tests job in
 * .github/workflows/ci.yml provisions the same stack, and `E2E_FULL_STACK=1` in that
 * job unlocks this file; otherwise it auto-skips.
 *
 * Selector rules (follow critical-paths.spec.ts):
 *   - Use `.first()` or `getByRole` — never bare `text=Foo` for strings that repeat
 *     across nav/footer/body (Playwright strict mode will flag them).
 *   - Protected routes (/student/*, /admin/*) redirect to login via middleware.ts;
 *     call loginAsStudent()/loginAsAdmin() before asserting on their content.
 */

test.skip(
  !!process.env.CI && !process.env.E2E_FULL_STACK,
  'Full-stack E2E suite skipped in CI until Strapi + seeded content are provisioned (set E2E_FULL_STACK=1)',
);

const STUDENT_EMAIL = process.env.E2E_STUDENT_EMAIL ?? 'student@attaqwa.org';
const STUDENT_PASSWORD = process.env.E2E_STUDENT_PASSWORD ?? 'Student123!';
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? 'superadmin@attaqwa.org';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? 'SuperAdmin123!';

// Matches both the website's student login ("Login to Student Portal") and the
// admin-on-website page ("Sign In"). Mirrors the helper in critical-paths.spec.ts.
const LOGIN_BUTTON_RE = /^(Sign\s*In|Login(\s+to\s+Student\s+Portal)?)$/i;

async function submitLogin(page: Page) {
  // Wait for hydration before clicking — without this, Playwright can fire the
  // click before React attaches onSubmit, and the browser falls back to a
  // default GET form submission that clears the form and leaves you on /login.
  // Probing useSession's get-session call (kicked off on mount) is the most
  // reliable hydration signal here; once it resolves the form is interactive.
  const button = page.getByRole('button', { name: LOGIN_BUTTON_RE }).first();
  await button.waitFor({ state: 'visible' });
  await page.waitForLoadState('networkidle');
  await button.click();
}

async function loginAsStudent(page: Page) {
  await page.goto('/student/login');
  await page.fill('input[type="email"]', STUDENT_EMAIL);
  await page.fill('input[type="password"]', STUDENT_PASSWORD);
  await submitLogin(page);
  await page.waitForURL('**/student/dashboard', { timeout: 15_000 });
}

async function loginAsWebsiteAdmin(page: Page) {
  await page.goto('/admin/login');
  await page.fill('input[type="email"]', ADMIN_EMAIL);
  await page.fill('input[type="password"]', ADMIN_PASSWORD);
  await submitLogin(page);
  // After login the client pushes to /admin (see apps/website/src/app/admin/login/page.tsx).
  await page.waitForURL(/\/admin(\/?$|\/(?!login))/, { timeout: 15_000 });
}

function prayerCell(page: Page, name: string) {
  return page.getByText(name, { exact: true }).first();
}

// Collects hydration warnings across every nav in a test. Failures on hydration
// errors are assertive because they cause real user-visible bugs.
function attachHydrationListener(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (
      text.includes('Hydration') ||
      text.includes('Text content did not match') ||
      text.includes('Warning: Expected server HTML')
    ) {
      errors.push(text);
    }
  });
  return errors;
}

test.describe('All Pages Comprehensive Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test.describe('Public Pages', () => {
    test('Homepage loads without errors', async ({ page }) => {
      const hydration = attachHydrationListener(page);

      await page.goto('/');
      await expect(page).toHaveTitle(/Masjid At-Taqwa/);
      await expect(page.locator('h1').first()).toBeVisible();

      // Header/nav hydrates client-side; assert it via ARIA landmark to avoid
      // matching duplicate nav links in footer.
      await expect(page.getByRole('navigation', { name: /main navigation/i }).first()).toBeVisible();

      expect(hydration).toHaveLength(0);
    });

    test('Prayer Times page loads without errors', async ({ page }) => {
      const hydration = attachHydrationListener(page);

      await page.goto('/prayer-times');

      // Prayer names appear in the page heading + the today-card + footer widgets,
      // so use the same first-visible selector as critical-paths.
      for (const name of ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
        await expect(prayerCell(page, name)).toBeVisible({ timeout: 15_000 });
      }

      expect(hydration).toHaveLength(0);
    });

    test('Announcements page loads without errors', async ({ page }) => {
      const hydration = attachHydrationListener(page);

      await page.goto('/announcements');
      await expect(page.locator('h1').filter({ hasText: /Announcements?/i }).first()).toBeVisible();

      expect(hydration).toHaveLength(0);
    });

    test('Events page loads without errors', async ({ page }) => {
      const hydration = attachHydrationListener(page);

      await page.goto('/events');
      await expect(page.locator('h1').filter({ hasText: /Events/i }).first()).toBeVisible();

      expect(hydration).toHaveLength(0);
    });

    test('Calendar page loads without errors', async ({ page }) => {
      const hydration = attachHydrationListener(page);

      await page.goto('/calendar');
      await expect(page.locator('h1').filter({ hasText: /Calendar/i }).first()).toBeVisible();

      expect(hydration).toHaveLength(0);
    });

    test('Dashboard route redirects unauthenticated users to student login', async ({ page }) => {
      const hydration = attachHydrationListener(page);

      // /dashboard is a server redirect → /student/dashboard, which middleware
      // then redirects to /student/login for unauthenticated visitors.
      // In Next.js 16 dev mode the first hop returns a 200 RSC payload that the
      // browser follows after hydration, so the chain takes longer than a prod
      // 307→307 hop — give it room and wait until the page settles before
      // asserting on the URL.
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      await page.waitForURL(/\/student\/login/, { timeout: 30_000 });
      await expect(page.locator('input[type="email"]').first()).toBeVisible();

      expect(hydration).toHaveLength(0);
    });

    test('About page loads without errors', async ({ page }) => {
      const hydration = attachHydrationListener(page);

      await page.goto('/about');
      await expect(page.locator('h1').filter({ hasText: /About/i }).first()).toBeVisible();

      expect(hydration).toHaveLength(0);
    });

    test('Services page loads without errors', async ({ page }) => {
      const hydration = attachHydrationListener(page);

      await page.goto('/services');
      await expect(page.locator('h1').filter({ hasText: /Services/i }).first()).toBeVisible();

      expect(hydration).toHaveLength(0);
    });

    test('Contact page loads without errors', async ({ page }) => {
      const hydration = attachHydrationListener(page);

      await page.goto('/contact');
      await expect(page.locator('h1').filter({ hasText: /Contact/i }).first()).toBeVisible();

      expect(hydration).toHaveLength(0);
    });
  });

  test.describe('Resource Pages', () => {
    test('Islamic Calendar page loads without errors', async ({ page }) => {
      const hydration = attachHydrationListener(page);

      await page.goto('/resources/islamic-calendar');
      await expect(page.locator('h1').filter({ hasText: /Islamic Calendar/i }).first()).toBeVisible();

      expect(hydration).toHaveLength(0);
    });

    test('Quran Study page loads without errors', async ({ page }) => {
      const hydration = attachHydrationListener(page);

      await page.goto('/resources/quran-study');
      await expect(page.locator('h1').filter({ hasText: /Quran Study/i }).first()).toBeVisible();

      expect(hydration).toHaveLength(0);
    });

    test('Hadith Collections page loads without errors', async ({ page }) => {
      const hydration = attachHydrationListener(page);

      await page.goto('/resources/hadith-collections');
      await expect(page.locator('h1').filter({ hasText: /Hadith Collections/i }).first()).toBeVisible();

      expect(hydration).toHaveLength(0);
    });
  });

  test.describe('Education Pages', () => {
    test('Education Browse page loads without errors', async ({ page }) => {
      const hydration = attachHydrationListener(page);

      await page.goto('/education/browse');
      // Actual h1 is "Browse Courses" (not "Islamic Education") as of the
      // Strapi-courses migration. Assert h1 visibility rather than exact copy.
      await expect(page.locator('h1').first()).toBeVisible();

      expect(hydration).toHaveLength(0);
    });

    test('Seerah module page renders without errors', async ({ page }) => {
      const hydration = attachHydrationListener(page);

      // /education/seerah/[moduleId] fetches `/api/seerah/modules/:id`; that route
      // isn't implemented in the website today, so the module card shows a
      // loading or empty state. We only assert the shell hydrates cleanly.
      await page.goto('/education/seerah/early-life');
      await expect(page.getByRole('main')).toBeVisible();

      expect(hydration).toHaveLength(0);
    });
  });

  test.describe('Student Portal Pages', () => {
    test('Student Login page loads without errors', async ({ page }) => {
      const hydration = attachHydrationListener(page);

      await page.goto('/student/login');
      await expect(page.locator('h1').filter({ hasText: /Student Portal/i }).first()).toBeVisible();
      await expect(page.locator('input[type="email"]').first()).toBeVisible();
      await expect(page.locator('input[type="password"]').first()).toBeVisible();
      await expect(page.getByRole('button', { name: LOGIN_BUTTON_RE }).first()).toBeVisible();

      expect(hydration).toHaveLength(0);
    });

    test('Student Dashboard redirects when not logged in', async ({ page }) => {
      const hydration = attachHydrationListener(page);

      await page.goto('/student/dashboard');
      // middleware.ts redirects with ?callbackUrl=..., so match on pathname only.
      await page.waitForURL(/\/student\/login/, { timeout: 10_000 });

      expect(hydration).toHaveLength(0);
    });

    test('Student login flow works with seeded credentials', async ({ page }) => {
      const hydration = attachHydrationListener(page);

      await loginAsStudent(page);
      await expect(page.locator('h1').first()).toBeVisible();

      expect(hydration).toHaveLength(0);
    });
  });

  // Login once per worker so parallel test files don't trip BetterAuth's login
  // rate limiter (observed: "Too many requests" after ~3 concurrent logins).
  test.describe('Admin Pages', () => {
    test.describe.configure({ mode: 'serial' });

    let adminPage: Page;

    test.beforeAll(async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
      adminPage = await context.newPage();
      await loginAsWebsiteAdmin(adminPage);
    });

    test.afterAll(async () => {
      await adminPage?.context().close();
    });

    test('Admin Dashboard page loads after login', async () => {
      await adminPage.goto('/admin');
      // apps/website/src/app/admin/page.tsx:154 → h1 "Dashboard".
      await expect(adminPage.locator('h1').filter({ hasText: /Dashboard/i }).first()).toBeVisible();
    });

    test('Admin Prayer Times page loads after login', async () => {
      await adminPage.goto('/admin/prayer-times');
      // The "Monthly Prayer Times" card only mounts when `view === 'month'`;
      // asserting the h1 is sufficient to confirm the route hydrated.
      await expect(adminPage.locator('h1').filter({ hasText: /Prayer Times/i }).first()).toBeVisible();
    });

    test('Admin Announcements page loads after login', async () => {
      await adminPage.goto('/admin/announcements');
      await expect(adminPage.locator('h1').filter({ hasText: /Announcements/i }).first()).toBeVisible();
      // Button reads "Create New" on both announcements and events list pages.
      await expect(adminPage.getByRole('link', { name: /Create New/i }).first()).toBeVisible();
    });

    test('Admin Events page loads after login', async () => {
      await adminPage.goto('/admin/events');
      await expect(adminPage.locator('h1').filter({ hasText: /Events/i }).first()).toBeVisible();
      await expect(adminPage.getByRole('link', { name: /Create New/i }).first()).toBeVisible();
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('Homepage is responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/');

      const mobileMenu = page.getByRole('button', { name: /menu/i });
      await expect(mobileMenu.first()).toBeVisible();
      await mobileMenu.first().click();

      // Prayer Times appears in both the mobile drawer and in on-page copy — scope
      // to an accessible link and take the first match.
      await expect(
        page.getByRole('link', { name: /Prayer Times/i }).first(),
      ).toBeVisible();
    });

    test('Prayer Times page is responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/prayer-times');
      await expect(prayerCell(page, 'Fajr')).toBeVisible({ timeout: 15_000 });
      await expect(prayerCell(page, 'Maghrib')).toBeVisible({ timeout: 15_000 });
    });
  });

  test.describe('Performance Tests', () => {
    test('Homepage loads within acceptable time', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(10_000);
      console.log(`Homepage load time: ${loadTime}ms`);
    });

    test('Prayer Times API responds successfully', async ({ page }) => {
      // The website's prayer-times endpoint lives under /api/v1/*.
      const response = await page.request.get('/api/v1/prayer-times');
      expect(response.status()).toBe(200);
    });
  });

  test.describe('Accessibility Tests', () => {
    test('Homepage has proper ARIA landmarks', async ({ page }) => {
      await page.goto('/');

      // Desktop viewport renders exactly one aria-labelled nav (mobile drawer
      // mounts only when the menu is open).
      const nav = page.locator('nav[aria-label]');
      await expect(nav).toHaveCount(1);

      await expect(page.getByRole('main')).toBeVisible();
      expect(await page.locator('h1').count()).toBeGreaterThanOrEqual(1);
    });

    test('Forms have proper labels', async ({ page }) => {
      await page.goto('/student/login');

      await expect(page.getByLabel(/Email/i).first()).toBeVisible();
      await expect(page.getByLabel(/Password/i).first()).toBeVisible();
    });
  });
});

test.describe('Hydration Error Detection', () => {
  test('No hydration errors across all date-dependent components', async ({ page }) => {
    const hydrationErrors: string[] = [];

    page.on('console', (msg) => {
      const text = msg.text();
      if (
        text.includes('Warning: Text content did not match') ||
        text.includes('Warning: Expected server HTML') ||
        text.includes('Hydration failed')
      ) {
        hydrationErrors.push(text);
      }
    });

    // /dashboard redirects to /student/login; both exercise date components in
    // their banners, so include them via the login path explicitly.
    const pagesWithDates = [
      '/',
      '/prayer-times',
      '/resources/islamic-calendar',
      '/student/login',
    ];

    for (const url of pagesWithDates) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
    }

    expect(hydrationErrors).toHaveLength(0);
  });
});
