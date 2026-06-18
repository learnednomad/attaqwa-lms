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

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ userAgent: 'attaqwa-linkcheck/1.0' });
  const page = await ctx.newPage();

  const seen = new Set();
  const queue = [...SEED];
  const linkSources = new Map(); // path -> Set<source-pages>

  while (queue.length) {
    const path = queue.shift();
    if (seen.has(path)) continue;
    seen.add(path);
    const url = SITE + path;
    process.stderr.write(`crawl ${path}\n`);
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      const links = await collectLinks(page, url);
      for (const href of links) {
        const target = normalize(href, url);
        if (!target) continue;
        if (!linkSources.has(target)) linkSources.set(target, new Set());
        linkSources.get(target).add(path);
        // Only enqueue same-section follow-ups to keep crawl bounded
        if (
          !seen.has(target) &&
          queue.length < 80 &&
          (target.startsWith('/services') ||
            target.startsWith('/resources') ||
            target.startsWith('/education') ||
            target.startsWith('/admin') ||
            target.startsWith('/student') ||
            target.startsWith('/teacher') ||
            target.split('/').length <= 2)
        ) {
          queue.push(target);
        }
      }
    } catch (e) {
      process.stderr.write(`  NAV-ERROR ${e.message}\n`);
    }
  }

  // Probe each target with a HEAD (or GET if HEAD not allowed)
  const results = [];
  for (const target of linkSources.keys()) {
    const u = SITE + target;
    try {
      let res = await fetch(u, { method: 'HEAD', redirect: 'manual' });
      if (res.status === 405 || res.status === 501) {
        res = await fetch(u, { method: 'GET', redirect: 'manual' });
      }
      results.push({ target, status: res.status, sources: [...linkSources.get(target)] });
    } catch (e) {
      results.push({ target, status: 0, error: String(e.message ?? e), sources: [...linkSources.get(target)] });
    }
  }

  await browser.close();

  const broken = results.filter((r) => r.status === 0 || r.status >= 400);

  console.log(`# Link check (${SITE})\n`);
  console.log(`**Pages crawled:** ${seen.size}`);
  console.log(`**Unique internal links:** ${results.length}`);
  console.log(`**Broken (4xx/5xx/net):** ${broken.length}\n`);

  if (broken.length) {
    console.log('## Broken targets\n');
    broken.sort((a, b) => a.target.localeCompare(b.target));
    for (const b of broken) {
      console.log(`- \`${b.target}\` → **${b.status}${b.error ? ' ' + b.error : ''}** (from: ${b.sources.slice(0, 5).join(', ')}${b.sources.length > 5 ? ', …' : ''})`);
    }
  }

  process.exit(broken.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
