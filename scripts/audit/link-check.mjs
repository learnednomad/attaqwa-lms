#!/usr/bin/env node
// Crawl every public page and verify all internal <a href> and <link> targets
// resolve. Catches dead links/anchors/menu items that the route-level smoke
// test misses (e.g. a footer link to a page that was renamed).
//
// Reports a dedupe'd list of (source-page, broken-target, status).

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const req = createRequire(path.resolve(__dirname, '../../apps/website/package.json'));
const { chromium } = req('playwright');

const SITE = process.env.SMOKE_SITE ?? 'https://attaqwamasjid.cloud';

const SEED = [
  '/',
  '/about',
  '/services',
  '/resources',
  '/education',
  '/prayer-times',
  '/contact',
  '/donate',
  '/admin/login',
  '/student/login',
  '/teacher/login',
];

async function collectLinks(page, url) {
  const links = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href]'))
      .map((a) => a.getAttribute('href'))
      .filter(Boolean),
  );
  return links;
}

function normalize(href, base) {
  try {
    const u = new URL(href, base);
    if (u.origin !== new URL(base).origin) return null; // external — skip
    if (u.hash && u.pathname === new URL(base).pathname) return null; // in-page anchor
    return u.pathname + u.search;
  } catch {
    return null;
  }
}

const FOLLOW_PREFIXES = ['/services', '/resources', '/education', '/admin', '/student', '/teacher'];

function shouldFollow(target, seen, queueLen) {
  if (seen.has(target) || queueLen >= 80) return false;
  if (target.split('/').length <= 2) return true;
  return FOLLOW_PREFIXES.some((p) => target.startsWith(p));
}

async function crawlPage(page, sitePath, linkSources, seen, queue) {
  const url = SITE + sitePath;
  process.stderr.write(`crawl ${sitePath}\n`);
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    // Wait for hydration: on the deployed site every page bails out of SSR
    // (see PR #66), so a[href] elements only appear after React mounts.
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    await page.waitForSelector('a[href]', { timeout: 5000 }).catch(() => {});
    const links = await collectLinks(page, url);
    for (const href of links) {
      const target = normalize(href, url);
      if (!target) continue;
      if (!linkSources.has(target)) linkSources.set(target, new Set());
      linkSources.get(target).add(sitePath);
      if (shouldFollow(target, seen, queue.length)) queue.push(target);
    }
  } catch (e) {
    process.stderr.write(`  NAV-ERROR ${e.message}\n`);
  }
}

async function probeTarget(target) {
  const u = SITE + target;
  try {
    let res = await fetch(u, { method: 'HEAD', redirect: 'manual' });
    if (res.status === 405 || res.status === 501) {
      res = await fetch(u, { method: 'GET', redirect: 'manual' });
    }
    return { target, status: res.status };
  } catch (e) {
    return { target, status: 0, error: String(e.message ?? e) };
  }
}

function renderReport(seen, results) {
  const broken = results.filter((r) => r.status === 0 || r.status >= 400);
  console.log(`# Link check (${SITE})\n`);
  console.log(`**Pages crawled:** ${seen.size}`);
  console.log(`**Unique internal links:** ${results.length}`);
  console.log(`**Broken (4xx/5xx/net):** ${broken.length}\n`);
  if (broken.length) {
    console.log('## Broken targets\n');
    broken.sort((a, b) => a.target.localeCompare(b.target));
    for (const b of broken) {
      const src = b.sources.slice(0, 5).join(', ') + (b.sources.length > 5 ? ', …' : '');
      console.log(`- \`${b.target}\` → **${b.status}${b.error ? ' ' + b.error : ''}** (from: ${src})`);
    }
  }
  return broken.length;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ userAgent: 'attaqwa-linkcheck/1.0' });
  const page = await ctx.newPage();

  const seen = new Set();
  const queue = [...SEED];
  const linkSources = new Map();

  while (queue.length) {
    const sitePath = queue.shift();
    if (seen.has(sitePath)) continue;
    seen.add(sitePath);
    await crawlPage(page, sitePath, linkSources, seen, queue);
  }

  const probed = await Promise.all([...linkSources.keys()].map(probeTarget));
  const results = probed.map((r) => ({ ...r, sources: [...linkSources.get(r.target)] }));

  await browser.close();
  process.exit(renderReport(seen, results) ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
