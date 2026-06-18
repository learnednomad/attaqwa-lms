#!/usr/bin/env node
// Smoke-tests every public website route + Strapi API endpoint against the live
// production deployment. Reports status code, redirect target, content-length,
// and flags 4xx/5xx as failures (auth-protected pages must redirect, not error).
//
// Usage: node scripts/audit/smoke.mjs [--json]

const SITE = process.env.SMOKE_SITE ?? 'https://attaqwamasjid.cloud';
const ADMIN = process.env.SMOKE_ADMIN ?? 'https://admin.attaqwamasjid.cloud';
const API = process.env.SMOKE_API ?? 'https://api.attaqwamasjid.cloud';

// Public website routes (auth-gated routes should 200 or 3xx, never 5xx)
const ROUTES = [
  '/',
  '/about',
  '/announcements',
  '/calendar',
  '/community',
  '/contact',
  '/dashboard',
  '/donate',
  '/education',
  '/education/achievements',
  '/education/browse',
  '/education/content/sample',
  '/education/courses/sample',
  '/education/lessons/sample',
  '/education/progress',
  '/education/quizzes/sample',
  '/education/seerah',
  '/education/seerah/sample',
  '/events',
  '/prayer-times',
  '/privacy',
  '/resources',
  '/resources/calendar-downloads',
  '/resources/hadith-collections',
  '/resources/hadith-collections/bukhari',
  '/resources/hadith-collections/bukhari/1',
  '/resources/islamic-calendar',
  '/resources/library',
  '/resources/library/sample',
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
  // Admin/student/teacher portals — should redirect to login, not error
  '/admin',
  '/admin/login',
  '/admin/announcements',
  '/admin/appeals',
  '/admin/education',
  '/admin/events',
  '/admin/inquiries',
  '/admin/itikaf',
  '/admin/prayer-times',
  '/admin/settings',
  '/admin/users',
  '/student/login',
  '/student/dashboard',
  '/student/community',
  '/student/courses',
  '/student/forgot-password',
  '/student/change-password',
  '/teacher/login',
  '/teacher/dashboard',
  '/teacher/courses',
  // Important infra
  '/sitemap.xml',
  '/sitemap-index.xml',
  '/sitemap-prayer-times.xml',
  '/sitemap-islamic-content.xml',
  '/robots.txt',
  '/api/health',
  '/api/docs',
  '/api/v1/prayer-times',
  '/api/v1/iqamah-times',
  '/api/v1/lessons',
  '/api/v1/courses',
  '/api/v1/tarawih-config',
  '/api/v1/mushaf',
];

// Strapi REST endpoints (public collections). 200 expected; 404 means content
// type missing; 403 means permission missing.
const API_ROUTES = [
  '/_health',
  '/api/v1/announcements',
  '/api/v1/events',
  '/api/v1/lessons',
  '/api/v1/courses',
  '/api/v1/library-resources',
  '/api/v1/iqamah-schedules',
  '/api/v1/prayer-time-overrides',
  '/api/v1/achievements',
  '/api/v1/quizzes',
];

async function probe(base, path) {
  const url = base + path;
  const start = Date.now();
  try {
    const res = await fetch(url, {
      redirect: 'manual',
      headers: { 'user-agent': 'attaqwa-audit/1.0' },
    });
    const ms = Date.now() - start;
    const cl = res.headers.get('content-length') ?? '';
    const ct = res.headers.get('content-type') ?? '';
    const loc = res.headers.get('location') ?? '';
    return { url, status: res.status, ms, cl, ct, loc };
  } catch (e) {
    return { url, status: 0, ms: Date.now() - start, error: String(e.message ?? e) };
  }
}

function classify(r) {
  if (r.status === 0) return 'NET-FAIL';
  if (r.status >= 500) return 'FAIL-5xx';
  if (r.status === 404) return 'FAIL-404';
  if (r.status === 403) return 'FORBIDDEN';
  if (r.status >= 400) return 'WARN-4xx';
  if (r.status >= 300) return 'REDIRECT';
  return 'OK';
}

async function main() {
  const json = process.argv.includes('--json');
  const all = [];

  const siteResults = await Promise.all(ROUTES.map((p) => probe(SITE, p)));
  const apiResults = await Promise.all(API_ROUTES.map((p) => probe(API, p)));
  const adminResults = await Promise.all(['/'].map((p) => probe(ADMIN, p)));

  for (const r of siteResults) all.push({ kind: 'site', ...r, verdict: classify(r) });
  for (const r of apiResults) all.push({ kind: 'api', ...r, verdict: classify(r) });
  for (const r of adminResults) all.push({ kind: 'admin', ...r, verdict: classify(r) });

  if (json) {
    console.log(JSON.stringify(all, null, 2));
    return;
  }

  const counts = {};
  for (const r of all) counts[r.verdict] = (counts[r.verdict] ?? 0) + 1;

  console.log(`\n=== Smoke results (${all.length} probes) ===`);
  console.log(counts);
  console.log('');

  const fails = all.filter((r) => r.verdict.startsWith('FAIL') || r.verdict === 'NET-FAIL');
  const warns = all.filter((r) => r.verdict === 'WARN-4xx' || r.verdict === 'FORBIDDEN');

  if (fails.length) {
    console.log('--- FAILURES ---');
    for (const r of fails) {
      console.log(`[${r.verdict}] ${r.status} ${r.url}${r.error ? '  err=' + r.error : ''}`);
    }
  }
  if (warns.length) {
    console.log('\n--- WARNINGS ---');
    for (const r of warns) {
      console.log(`[${r.verdict}] ${r.status} ${r.url}`);
    }
  }

  console.log('\n--- REDIRECTS ---');
  for (const r of all.filter((x) => x.verdict === 'REDIRECT')) {
    console.log(`[${r.status}] ${r.url} -> ${r.loc}`);
  }

  process.exit(fails.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
