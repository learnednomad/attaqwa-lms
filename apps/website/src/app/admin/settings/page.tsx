'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Settings,
  Globe,
  Bell,
  Mail,
  Server,
  Database,
  AlertCircle,
  CheckCircle2,
  RefreshCcw,
} from 'lucide-react';
import { MOSQUE_INFO } from '@attaqwa/shared';

type SystemInfo = {
  website: {
    version: string;
    nextVersion: string;
    nodeVersion: string;
    env: string;
    uptimeSeconds: number;
    uptimeHuman: string;
    rssMemoryMb: number;
    timezone: string;
  };
  strapi: {
    url: string | null;
    status: 'reachable' | 'unreachable';
    versionHint: string | null;
  };
  database: { url: string | null };
  smtp: {
    host: string | null;
    port: string | null;
    from: string | null;
    configured: boolean;
  };
  timestamp: string;
};

export default function AdminSettingsPage() {
  const [info, setInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/system-info', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as SystemInfo;
      setInfo(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load system info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchInfo();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Read-only diagnostics. Detailed configuration lives in the env file
            (Coolify in production) and the Strapi admin at{' '}
            <a
              href={info?.strapi.url ? `${info.strapi.url}/admin` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-islamic-green-600 hover:underline"
            >
              /admin (Strapi)
            </a>
            .
          </p>
        </div>
        <Button
          onClick={fetchInfo}
          disabled={loading}
          variant="outline"
          className="gap-2 self-start sm:self-auto"
        >
          <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50/40">
          <CardContent className="py-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700">
                Could not load system info
              </p>
              <p className="text-xs text-red-600 mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Globe className="h-5 w-5 text-islamic-green-600" />
                Masjid Information
              </CardTitle>
              <CardDescription>
                Sourced from <code className="text-xs">@attaqwa/shared</code>{' '}
                <code className="text-xs">MOSQUE_INFO</code>. Edit{' '}
                <code className="text-xs">apps/website/src/constants/index.ts</code>{' '}
                to change.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Row label="Name" value={MOSQUE_INFO.name} />
              <Row
                label="Address"
                value={`${MOSQUE_INFO.address}, ${MOSQUE_INFO.city}, ${MOSQUE_INFO.province} ${MOSQUE_INFO.postalCode}`}
              />
              <Row label="Primary Phone" value={MOSQUE_INFO.phone} />
              <Row label="Primary Email" value={MOSQUE_INFO.email} mono />
              <Row label="Imam Email" value={MOSQUE_INFO.imamEmail} mono />
              <Row label="School Email" value={MOSQUE_INFO.schoolEmail} mono />
              <Row label="Website" value={MOSQUE_INFO.website} mono />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-600" />
                Notification Status
              </CardTitle>
              <CardDescription>
                SMTP configured via env vars on the Strapi service. See{' '}
                <code className="text-xs">.env.example</code> for the full list.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Row
                label="SMTP delivery"
                valueNode={
                  info?.smtp.configured ? (
                    <Badge className="bg-emerald-100 text-emerald-700 gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Configured
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-700 gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Not configured
                    </Badge>
                  )
                }
              />
              <Row label="SMTP host" value={info?.smtp.host ?? '—'} mono />
              <Row label="SMTP port" value={info?.smtp.port ?? '—'} mono />
              <Row label="From address" value={info?.smtp.from ?? '—'} mono />
              <p className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                Inquiry submissions still persist to Strapi admin even when SMTP
                is unset; only outbound notifications skip silently.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Server className="h-5 w-5 text-islamic-green-600" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading && !info ? (
                <p className="text-sm text-gray-500">Loading…</p>
              ) : info ? (
                <div className="space-y-2">
                  <Row
                    label="Website version"
                    value={info.website.version}
                    compact
                    mono
                  />
                  <Row
                    label="Next.js"
                    value={info.website.nextVersion}
                    compact
                    mono
                  />
                  <Row
                    label="Node.js"
                    value={info.website.nodeVersion}
                    compact
                    mono
                  />
                  <Row label="Environment" value={info.website.env} compact mono />
                  <Row
                    label="Process uptime"
                    value={info.website.uptimeHuman}
                    compact
                  />
                  <Row
                    label="RSS memory"
                    value={`${info.website.rssMemoryMb} MB`}
                    compact
                    mono
                  />
                  <Row
                    label="Timezone"
                    value={info.website.timezone}
                    compact
                    mono
                  />
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                Connected Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              {info ? (
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-500">Strapi</span>
                      {info.strapi.status === 'reachable' ? (
                        <Badge className="bg-emerald-100 text-emerald-700 gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Reachable
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Unreachable
                        </Badge>
                      )}
                    </div>
                    <code className="text-xs text-gray-700 break-all">
                      {info.strapi.url ?? '—'}
                    </code>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-500">Database</span>
                    </div>
                    <code className="text-xs text-gray-700 break-all">
                      {info.database.url ?? '—'}
                    </code>
                  </div>
                  <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                    Last refreshed: {new Date(info.timestamp).toLocaleString()}
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                Where to change settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <p>
                <strong>Content</strong> (announcements, events, library, prayer
                times overrides, inquiry triage): Strapi admin at{' '}
                <code className="text-xs">/admin</code> on the API host.
              </p>
              <p>
                <strong>Branding + contact info</strong>: edit{' '}
                <code className="text-xs">apps/website/src/constants/index.ts</code>{' '}
                and redeploy.
              </p>
              <p>
                <strong>Email + URLs + secrets</strong>: env vars on the website
                and api services in Coolify.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  valueNode,
  mono,
  compact,
}: {
  label: string;
  value?: string;
  valueNode?: React.ReactNode;
  mono?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 ${
        compact ? 'py-1.5' : 'py-2 border-b border-gray-100 last:border-0'
      }`}
    >
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      {valueNode ? (
        valueNode
      ) : (
        <span
          className={`text-sm text-right text-gray-900 ${
            mono ? 'font-mono text-xs' : ''
          }`}
        >
          {value ?? '—'}
        </span>
      )}
    </div>
  );
}
