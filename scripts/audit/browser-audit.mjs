#!/usr/bin/env node
// Headless-browser audit. For each public route, opens the page in chromium,
// waits for network-idle, then collects:
//   - any uncaught JS errors (page.on('pageerror'))
//   - any console.error / console.warn calls
//   - any failed network requests (response status >= 400)
//   - whether <title> resolved and there's at least 1 <h1> or visible main
//
// Prints a Markdown report to stdout. Exits 1 if any FAIL row.

// Resolves to whichever Playwright install is closest on disk. Try the website
// app first (which depends on @playwright/test → playwright); fall back to the
// nearest node_modules via standard resolution.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const candidates = [
  path.resolve(__dirname, '../../apps/website'),
  __dirname,
];
let chromium;
let lastErr;
for (const base of candidates) {
  try {
    const req = createRequire(path.join(base, 'package.json'));
    ({ chromium } = req('playwright'));
    break;
  } catch (e) {
    lastErr = e;
  }
}
if (!chromium) {
  console.error('Could not load playwright. Try: cd apps/website && pnpm install');
  console.error(String(lastErr));
  process.exit(2);
}

const SITE = process.env.SMOKE_SITE ?? 'https://attaqwamasjid.cloud';
const ROUTES = [
  '/',
  '/about',
  '/announcements',
  '/calendar',
  '/community',
  '/contact',
  '/donate',
  '/education',
  '/education/browse',
  '/education/progress',
  '/education/seerah',
  '/events',
  '/prayer-times',
  '/privacy',
  '/resources',
  '/resources/calendar-downloads',
  '/resources/hadith-collections',
  '/resources/islamic-calendar',
  '/resources/library',
  '/resources/new-muslim',
  '/resources/qibla-direction',
  '/resources/quran-study',
  '/services',
  '/services/ask-an-imam',
  '/services/funeral-services',
  '/services/help-the-poor',
  '/services/quran-learning',
  '/services/ramadan-services',
  '/services/salah-prayer',
  '/services/zakat-charity',
  '/terms',
  '/admin/login',
  '/student/login',
  '/teacher/login',
];

// Hosts whose 4xx/5xx in a request should NOT fail the route — usually third-party
// telemetry/analytics, font/CDN edge probes, sentry, etc.
const IGNORE_REQ_HOSTS = [
  /(?:^|\.)sentry\.io$/i,
  /(?:^|\.)google-analytics\.com$/i,
  /(?:^|\.)googletagmanager\.com$/i,
  /(?:^|\.)doubleclick\.net$/i,
];

// Console messages matching these substrings are demoted from error → info
// (browser-internal noise, third-party script noise, etc.)
const CONSOLE_IGNORE = [
  /Failed to load resource: net::ERR_/i,
  /\[Fast Refresh\]/i,
  /\bdownload the React DevTools\b/i,
];

async function auditOne(browser, path) {
  const ctx = await browser.newContext({
    userAgent: 'attaqwa-audit-browser/1.0 (+chromium-headless)',
    viewport: { width: 1280, height: 800 },
  });
  const page = await ctx.newPage();
  const jsErrors = [];
  const consoleErrors = [];
  const badRequests = [];

  page.on('pageerror', (e) => jsErrors.push(String(e.message ?? e)));
  page.on('console', (msg) => {
    if (msg.type() !== 'error' && msg.type() !== 'warning') return;
    const text = msg.text();
    if (CONSOLE_IGNORE.some((re) => re.test(text))) return;
    consoleErrors.push(`[${msg.type()}] ${text}`);
  });
  page.on('response', (resp) => {
    const status = resp.status();
    if (status < 400) return;
    const u = new URL(resp.url());
    if (IGNORE_REQ_HOSTS.some((re) => re.test(u.hostname))) return;
    badRequests.push(`${status} ${resp.request().method()} ${resp.url()}`);
  });

  const url = SITE + path;
  let mainStatus = 0;
  let title = '';
  let hasMain = false;
  let nav = null;
  try {
    // Two-phase wait: first reach DOMContentLoaded (always terminates), then
    // best-effort wait for networkidle. Pages with long-lived third-party
    // connections (Donorbox, chat widgets) never reach networkidle but render
    // fine for users, so a networkidle timeout here is informational, not fatal.
    nav = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    mainStatus = nav?.status() ?? 0;
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    title = await page.title();
    hasMain = (await page.locator('main, [role="main"], h1').count()) > 0;
  } catch (e) {
    jsErrors.push(`NAV-ERROR: ${e.message ?? e}`);
  }

  await ctx.close();

  const failures = [];
  if (mainStatus >= 500) failures.push(`HTTP ${mainStatus}`);
  if (mainStatus === 0) failures.push('navigation failed');
  if (jsErrors.length) failures.push(`${jsErrors.length} JS error(s)`);
  if (badRequests.length) failures.push(`${badRequests.length} bad request(s)`);
  if (!hasMain && mainStatus >= 200 && mainStatus < 400)
    failures.push('no <main>/<h1>');

  return {
    path,
    status: mainStatus,
    title,
    hasMain,
    jsErrors,
    consoleErrors,
    badRequests,
    failures,
  };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  // Run with a small concurrency to avoid overloading the live site.
  const CONC = 3;
  let i = 0;
  async function worker() {
    while (i < ROUTES.length) {
      const idx = i++;
      const path = ROUTES[idx];
      process.stderr.write(`[${idx + 1}/${ROUTES.length}] ${path}\n`);
      try {
        results.push(await auditOne(browser, path));
      } catch (e) {
        results.push({
          path,
          status: 0,
          title: '',
          hasMain: false,
          jsErrors: [String(e.message ?? e)],
          consoleErrors: [],
          badRequests: [],
          failures: ['worker error'],
        });
      }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  await browser.close();

  // Sort: failures first
  results.sort((a, b) => (b.failures.length - a.failures.length) || a.path.localeCompare(b.path));

  let out = `# Browser audit (${SITE})\n\n`;
  const failed = results.filter((r) => r.failures.length);
  out += `**Total routes:** ${results.length}\n`;
  out += `**Failed:** ${failed.length}\n`;
  out += `**OK:** ${results.length - failed.length}\n\n`;

  if (failed.length) {
    out += `## Failed routes\n\n`;
    for (const r of failed) {
      out += `### ${r.path} — status ${r.status}\n`;
      out += `- title: \`${r.title}\`\n`;
      out += `- failures: ${r.failures.join(', ')}\n`;
      if (r.jsErrors.length) {
        out += `- JS errors:\n`;
        for (const e of r.jsErrors.slice(0, 5)) out += `  - \`${e.slice(0, 300)}\`\n`;
      }
      if (r.consoleErrors.length) {
        out += `- Console:\n`;
        for (const e of r.consoleErrors.slice(0, 5)) out += `  - \`${e.slice(0, 300)}\`\n`;
      }
      if (r.badRequests.length) {
        out += `- Failed requests:\n`;
        for (const e of r.badRequests.slice(0, 10)) out += `  - ${e}\n`;
      }
      out += `\n`;
    }
  }

  out += `## All routes\n\n| Route | Status | Title | Failures |\n|---|---|---|---|\n`;
  for (const r of results) {
    out += `| ${r.path} | ${r.status} | ${r.title.slice(0, 50)} | ${r.failures.join('; ') || '—'} |\n`;
  }

  console.log(out);
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
