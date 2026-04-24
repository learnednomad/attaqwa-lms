import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for E2E testing.
 *
 * Three boot modes:
 *   1. Local dev (default): Playwright starts `pnpm dev` on :3003; admin/api must already
 *      be up or the test will skip admin-dependent flows.
 *   2. Docker stack (CI or full local): set PLAYWRIGHT_SKIP_WEBSERVER=1 so Playwright
 *      does NOT try to boot its own server — it runs against whatever is already on
 *      BASE_URL / ADMIN_URL. Use this with docker-compose.dev.yml up -d --wait.
 *   3. Minimal local (website + postgres only): keep the webServer block, but auth-gated
 *      tests will skip because admin is not running.
 *
 * ADMIN_URL defaults to http://localhost:3000 (the admin app's canonical port).
 */

const websitePort = Number(process.env.PLAYWRIGHT_WEBSITE_PORT ?? 3003);
const websiteHost = process.env.PLAYWRIGHT_WEBSITE_HOST ?? 'localhost';
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://${websiteHost}:${websitePort}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['html'], ['github'], ['list']] : 'html',
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Firefox / WebKit / mobile projects removed from default — CI runs chromium only.
    // Re-enable locally when debugging a browser-specific bug.
  ],

  // Only boot a webServer when Playwright owns the lifecycle. When the full stack is
  // already running (Docker compose, Coolify preview, local multi-terminal), set
  // PLAYWRIGHT_SKIP_WEBSERVER=1 to bypass.
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command: 'pnpm dev',
        url: baseURL,
        env: {
          PORT: String(websitePort),
        },
        reuseExistingServer: !process.env.CI,
        timeout: 240 * 1000,
      },
});
