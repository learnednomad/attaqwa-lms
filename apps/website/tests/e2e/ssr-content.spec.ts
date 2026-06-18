import { test, expect } from '@playwright/test';

/**
 * SSR-content regression suite.
 *
 * Asserts that public pages serve real HTML (with a landmark + heading + the
 * key headline copy) in the *initial* HTML response — i.e. before any client
 * JS runs. Without this guard a future change to providers.tsx that wraps
 * children in another `dynamic(..., { ssr: false })` boundary would silently
 * regress the whole site to client-only rendering, as happened pre-PR #66.
 *
 * Implementation note: we use `request.get()` instead of `page.goto()` so the
 * assertions run on the raw SSR markup, not on the post-hydration DOM. If we
 * used the browser, React would have already filled the body in by the time
 * we asserted, defeating the purpose.
 *
 * No backend services required — runs against whatever the website is serving
 * on baseURL. The webServer block in playwright.config.ts boots Next for us.
 */

const CASES = [
  { path: '/', mustContain: ['<main', 'Masjid At-Taqwa'] },
  { path: '/prayer-times', mustContain: ['<main', '<h1', 'Daily Prayer Times'] },
  { path: '/admin/login', mustContain: ['<main', '<h1', 'Admin sign in'] },
  { path: '/education/seerah', mustContain: ['<main', '<h1', 'Authentic Seerah Curriculum'] },
  { path: '/services', mustContain: ['<main', '<h1'] },
  { path: '/about', mustContain: ['<main', '<h1'] },
];

test.describe('SSR content', () => {
  for (const { path, mustContain } of CASES) {
    test(`${path} ships real HTML, not a CSR bailout`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.status(), `${path} should return 200`).toBe(200);
      const html = await res.text();
      expect(
        html,
        `${path} must not bail out to client-side rendering`,
      ).not.toContain('BAILOUT_TO_CLIENT_SIDE_RENDERING');
      for (const needle of mustContain) {
        expect(html, `${path} SSR HTML missing ${needle}`).toContain(needle);
      }
    });
  }
});
