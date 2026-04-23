/**
 * GET /api/admin/system-info
 * Returns real runtime + dependency versions and Strapi connectivity health.
 * Replaces the previous hardcoded "v2.1.0 / Uptime 99.9%" placeholders.
 */

import { NextResponse } from 'next/server';
import { requireAdmin, strapiFetch } from '../_lib/strapi-proxy';
import packageJson from '../../../../../package.json';

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response!;

  const websiteVersion =
    (packageJson as { version?: string }).version || 'unknown';
  const nextVersion =
    ((packageJson as { dependencies?: Record<string, string> }).dependencies?.next ?? '').replace(
      /^\^/,
      ''
    ) || 'unknown';

  let strapiStatus: 'reachable' | 'unreachable' = 'unreachable';
  let strapiVersion: string | null = null;
  try {
    const probe = await strapiFetch('/api/v1/announcements?pagination[pageSize]=1');
    if (probe.ok) {
      strapiStatus = 'reachable';
      const xpb = probe.headers.get('x-powered-by');
      if (xpb && xpb.toLowerCase().includes('strapi')) {
        strapiVersion = xpb;
      }
    }
  } catch {
    // strapiStatus stays 'unreachable'
  }

  const memMb = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
  const uptimeSec = Math.round(process.uptime());
  const uptimeHuman = formatUptime(uptimeSec);

  return NextResponse.json({
    website: {
      version: websiteVersion,
      nextVersion,
      nodeVersion: process.version,
      env: process.env.NODE_ENV ?? 'unknown',
      uptimeSeconds: uptimeSec,
      uptimeHuman,
      rssMemoryMb: Number(memMb),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    strapi: {
      url: process.env.STRAPI_URL || process.env.NEXT_PUBLIC_API_URL || null,
      status: strapiStatus,
      versionHint: strapiVersion,
    },
    database: {
      url: process.env.DATABASE_URL ? maskDsn(process.env.DATABASE_URL) : null,
    },
    smtp: {
      host: process.env.SMTP_HOST ?? null,
      port: process.env.SMTP_PORT ?? null,
      from: process.env.EMAIL_FROM ?? null,
      configured: Boolean(process.env.SMTP_HOST),
    },
    timestamp: new Date().toISOString(),
  });
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const parts: string[] = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes || !parts.length) parts.push(`${minutes}m`);
  return parts.join(' ');
}

function maskDsn(dsn: string): string {
  try {
    const url = new URL(dsn);
    const user = url.username || 'user';
    const host = url.hostname;
    const db = url.pathname.replace(/^\//, '') || '';
    return `${url.protocol}//${user}:***@${host}/${db}`;
  } catch {
    return 'set';
  }
}
