#!/usr/bin/env node
// Contract test for the public Strapi API. Goes beyond status codes: fetches
// real bodies and verifies the response shape Strapi v5 promises
// (data: [...], meta: { pagination: {...} }). Catches cases where a route
// returns 200 but with an unexpected payload (e.g. someone overrode the
// controller and forgot to wrap in the standard envelope).

const API = process.env.SMOKE_API ?? 'https://api.attaqwamasjid.cloud';

const COLLECTIONS = [
  'announcements',
  'events',
  'lessons',
  'courses',
  'library-resources',
  'iqamah-schedules',
  'achievements',
  'quizzes',
];

function assertShape(name, body) {
  const issues = [];
  if (typeof body !== 'object' || body === null) {
    issues.push('body is not an object');
    return issues;
  }
  if (!('data' in body)) issues.push('missing `data` key');
  if (!('meta' in body)) issues.push('missing `meta` key');
  if (Array.isArray(body.data)) {
    if (!body.meta || !body.meta.pagination)
      issues.push('list response missing meta.pagination');
    else {
      const p = body.meta.pagination;
      for (const k of ['page', 'pageSize', 'pageCount', 'total']) {
        if (typeof p[k] !== 'number') issues.push(`meta.pagination.${k} is not a number`);
      }
    }
  }
  return issues;
}

async function probe(name) {
  const url = `${API}/api/v1/${name}`;
  try {
    const res = await fetch(url);
    const ct = res.headers.get('content-type') ?? '';
    const text = await res.text();
    if (res.status === 403) return { name, url, status: 403, note: 'admin-only (expected)' };
    if (res.status !== 200)
      return { name, url, status: res.status, note: `unexpected status, body=${text.slice(0, 120)}` };
    if (!ct.includes('application/json'))
      return { name, url, status: res.status, note: `content-type=${ct}` };
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      return { name, url, status: res.status, note: 'invalid JSON' };
    }
    const issues = assertShape(name, body);
    return { name, url, status: res.status, count: Array.isArray(body.data) ? body.data.length : null, issues };
  } catch (e) {
    return { name, url, status: 0, note: String(e.message ?? e) };
  }
}

async function main() {
  const results = await Promise.all(COLLECTIONS.map(probe));

  console.log(`# API contract (${API})\n`);
  let bad = 0;
  for (const r of results) {
    const issues = (r.issues ?? []).join(', ');
    const okLine = `- **${r.name}** → ${r.status}${r.count != null ? ` (${r.count} items)` : ''}`;
    if (r.note) {
      console.log(`${okLine}  _${r.note}_`);
      if (r.status >= 500 || r.status === 0) bad++;
    } else if (issues) {
      console.log(`${okLine}  ⚠ ${issues}`);
      bad++;
    } else {
      console.log(okLine);
    }
  }
  console.log('');
  process.exit(bad ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
