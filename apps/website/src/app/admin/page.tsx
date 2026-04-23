'use client';

import { useEffect, useState } from 'react';
import { useAnnouncements } from '@/lib/hooks/useAnnouncements';
import { useEvents } from '@/lib/hooks/useEvents';
import { useTodayPrayerTimes } from '@/lib/hooks/usePrayerTimes';
import { useAppeals } from '@/lib/hooks/useAppeals';
import { useItikafRegistrations } from '@/lib/hooks/useItikafRegistrations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Megaphone,
  Calendar,
  Clock,
  Heart,
  Moon,
  Activity,
  ArrowRight,
  Plus,
  Compass,
  Sunrise as SunriseIcon,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { formatTime, PRAYER_NAMES } from '@attaqwa/shared';

// Masjid At-Taqwa, Doraville, GA
const MASJID_LAT = 33.9114;
const MASJID_LNG = -84.2614;

const PRAYER_ORDER = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
type PrayerKey = (typeof PRAYER_ORDER)[number];

function parseTimeToToday(t: string | undefined | null): Date | null {
  if (!t) return null;
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) {
    const m24 = t.match(/^(\d{1,2}):(\d{2})$/);
    if (!m24) return null;
    const d = new Date();
    d.setHours(parseInt(m24[1], 10), parseInt(m24[2], 10), 0, 0);
    return d;
  }
  let hours = parseInt(m[1], 10);
  const minutes = parseInt(m[2], 10);
  const isPM = m[3].toUpperCase() === 'PM';
  if (isPM && hours !== 12) hours += 12;
  if (!isPM && hours === 12) hours = 0;
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'now';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return '<1m';
}

function getHijriFormatted(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(date);
  } catch {
    return '';
  }
}

function getGreeting(hour: number): string {
  if (hour < 5) return 'Peaceful night';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 20) return 'Good evening';
  return 'Peaceful night';
}

export default function AdminDashboard() {
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30 * 1000);
    return () => clearInterval(id);
  }, []);

  const { data: announcements, isLoading: announcementsLoading } = useAnnouncements({ limit: 5, isActive: true });
  const { data: upcomingEvents, isLoading: eventsLoading } = useEvents({ upcoming: true, limit: 5 });
  const { data: prayerTimes } = useTodayPrayerTimes(MASJID_LAT, MASJID_LNG);
  const { data: appeals } = useAppeals({ isActive: true, limit: 10 });
  const { data: itikafRegistrations } = useItikafRegistrations({ limit: 10 });

  const activeAppealsCount = appeals?.data?.length ?? 0;
  const pendingItikafCount = itikafRegistrations?.data?.filter((r) => r.status === 'pending').length ?? 0;
  const announcementsCount = announcements?.pagination?.total ?? 0;
  const eventsCount = upcomingEvents?.pagination?.total ?? 0;

  const prayers = !prayerTimes ? [] : (() => {
    const iqama = (prayerTimes as unknown as { iqama?: Record<string, string> }).iqama ?? {};
    return PRAYER_ORDER.map((key: PrayerKey) => ({
      key,
      label: PRAYER_NAMES[key.toUpperCase() as keyof typeof PRAYER_NAMES] || key,
      adhan: (prayerTimes as unknown as Record<string, string>)[key],
      iqama: key === 'sunrise' ? undefined : iqama[key],
      isSunrise: key === 'sunrise',
    }));
  })();

  const nextPrayer = (() => {
    for (const p of prayers) {
      const t = parseTimeToToday(p.iqama ?? p.adhan);
      if (t && t.getTime() > now.getTime()) {
        return { ...p, target: t, usesIqama: !!p.iqama };
      }
    }
    return null;
  })();

  const hijri = getHijriFormatted(new Date());
  const gregorian = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
  const greeting = getGreeting(now.getHours());

  const stats = [
    { title: 'Announcements', value: announcementsCount, icon: Megaphone, href: '/admin/announcements',
      tint: 'bg-blue-50 text-blue-600 border-blue-100' },
    { title: 'Upcoming Events', value: eventsCount, icon: Calendar, href: '/admin/events',
      tint: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { title: 'Active Appeals', value: activeAppealsCount, icon: Heart, href: '/admin/appeals',
      tint: 'bg-rose-50 text-rose-600 border-rose-100' },
    { title: "Pending I'tikaf", value: pendingItikafCount, icon: Moon, href: '/admin/itikaf',
      tint: 'bg-violet-50 text-violet-600 border-violet-100' },
  ];

  const quickActions = [
    { href: '/admin/announcements/new', label: 'New Announcement', icon: Megaphone, tint: 'hover:border-blue-300 hover:bg-blue-50/60' },
    { href: '/admin/events/new', label: 'New Event', icon: Calendar, tint: 'hover:border-emerald-300 hover:bg-emerald-50/60' },
    { href: '/admin/appeals/new', label: 'New Appeal', icon: Heart, tint: 'hover:border-rose-300 hover:bg-rose-50/60' },
    { href: '/admin/itikaf', label: "Manage I'tikaf", icon: Moon, tint: 'hover:border-violet-300 hover:bg-violet-50/60' },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <p className="text-sm text-emerald-700 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {greeting}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mt-1">Dashboard</h1>
          <p className="text-gray-600 mt-1 text-sm">
            Overview of Masjid At-Taqwa&apos;s digital presence
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium text-gray-900">{gregorian}</span>
          </div>
          {hijri && (
            <div className="flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-amber-600" />
              <span>{hijri}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats — clickable cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className="group rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-medium text-gray-600">{stat.title}</span>
              <div className={`p-1.5 rounded-md border ${stat.tint}`}>
                <stat.icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-3 flex items-end justify-between">
              <div className="text-3xl font-bold text-gray-900 tabular-nums">{stat.value}</div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        ))}
      </div>

      {/* Next prayer hero */}
      {nextPrayer && (
        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-amber-50/40 overflow-hidden">
          <CardContent className="py-4 px-4 sm:px-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-wider text-emerald-700 font-semibold">Next prayer</div>
                <div className="text-lg sm:text-xl font-bold text-gray-900 flex flex-wrap items-baseline gap-x-2">
                  <span>{nextPrayer.label}</span>
                  <span className="text-gray-400 font-normal text-xs sm:text-sm">
                    · {nextPrayer.usesIqama ? 'Iqama' : 'Time'} {formatTime((nextPrayer.iqama ?? nextPrayer.adhan) ?? '')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">In</div>
                <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
                  {formatCountdown(nextPrayer.target.getTime() - now.getTime())}
                </div>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/prayer-times">
                  Manage
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's Prayer Times — compact Iqama+Adhan */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="w-4 h-4 text-emerald-600" />
              Today&apos;s Prayer Times
            </CardTitle>
            <Button asChild size="sm" variant="ghost">
              <Link href="/admin/prayer-times">
                Full view
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {prayerTimes ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {prayers.filter((p) => !p.isSunrise).map((p) => {
                    const isNext = nextPrayer?.key === p.key;
                    return (
                      <div
                        key={p.key}
                        className={`rounded-lg border p-2 sm:p-3 text-center transition-all ${
                          isNext ? 'border-emerald-400 bg-emerald-50/60 ring-1 ring-emerald-200' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="text-[11px] font-semibold text-gray-900 mb-1">{p.label}</div>
                        {p.iqama ? (
                          <>
                            <div className="text-sm sm:text-base font-bold text-emerald-700 font-mono tabular-nums whitespace-nowrap">
                              {formatTime(p.iqama)}
                            </div>
                            <div className="text-[10px] text-gray-400 mt-0.5 font-mono tabular-nums whitespace-nowrap">
                              Adhan {p.adhan ? formatTime(p.adhan) : '—'}
                            </div>
                          </>
                        ) : (
                          <div className="text-sm sm:text-base font-bold text-gray-700 font-mono tabular-nums whitespace-nowrap">
                            {p.adhan ? formatTime(p.adhan) : '—'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-600">
                  {(() => {
                    const sunrise = prayers.find((p) => p.isSunrise);
                    if (!sunrise?.adhan) return null;
                    return (
                      <div className="flex items-center gap-1.5">
                        <SunriseIcon className="w-3.5 h-3.5 text-amber-600" />
                        <span>Sunrise</span>
                        <span className="font-mono tabular-nums font-semibold text-amber-700">{formatTime(sunrise.adhan)}</span>
                      </div>
                    );
                  })()}
                  {prayerTimes.qibla && (
                    <div className="flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Qibla</span>
                      <span className="font-semibold text-gray-900">{prayerTimes.qibla}°</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="w-4 h-4 text-emerald-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 transition-all group ${a.tint}`}
              >
                <span className="flex items-center gap-2.5">
                  <a.icon className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
                  {a.label}
                </span>
                <Plus className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Announcements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Megaphone className="w-4 h-4 text-blue-600" />
              Recent Announcements
            </CardTitle>
            <Button asChild size="sm" variant="ghost">
              <Link href="/admin/announcements">
                View all
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {announcementsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
              </div>
            ) : announcements?.data && announcements.data.length > 0 ? (
              <div className="space-y-3">
                {announcements.data.slice(0, 3).map((announcement) => (
                  <Link
                    key={announcement.id}
                    href="/admin/announcements"
                    className="block border-l-4 border-blue-500 pl-4 py-1 hover:bg-gray-50 -mx-2 px-4 rounded transition-colors"
                  >
                    <h4 className="font-medium text-gray-900 text-sm">{announcement.title}</h4>
                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                      {announcement.content.substring(0, 120)}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-gray-200 rounded-lg">
                <Megaphone className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No announcements yet</p>
                <Button asChild size="sm" variant="outline" className="mt-3">
                  <Link href="/admin/announcements/new">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Create one
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Upcoming Events
            </CardTitle>
            <Button asChild size="sm" variant="ghost">
              <Link href="/admin/events">
                View all
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {eventsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
              </div>
            ) : upcomingEvents?.data && upcomingEvents.data.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.data.slice(0, 3).map((event) => (
                  <Link
                    key={event.id}
                    href="/admin/events"
                    className="block border-l-4 border-emerald-500 pl-4 py-1 hover:bg-gray-50 -mx-2 px-4 rounded transition-colors"
                  >
                    <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                    {event.description && (
                      <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{event.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-[11px] text-gray-400">
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      {event.startTime && <span>{event.startTime}</span>}
                      {event.location && <span className="truncate max-w-[180px]">{event.location}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-gray-200 rounded-lg">
                <Calendar className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No upcoming events</p>
                <Button asChild size="sm" variant="outline" className="mt-3">
                  <Link href="/admin/events/new">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Create one
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
