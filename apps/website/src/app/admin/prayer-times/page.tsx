'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTodayPrayerTimes, useWeekPrayerTimes, useMonthPrayerTimes } from '@/lib/hooks/usePrayerTimes';
import { usePrayerTimeOverrides, useCreatePrayerTimeOverride, useDeletePrayerTimeOverride } from '@/lib/hooks/usePrayerTimeOverrides';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Clock,
  Calendar,
  Settings2,
  Download,
  RefreshCw,
  Plus,
  Trash2,
  AlertTriangle,
  Save,
  Users,
  Sunrise as SunriseIcon,
  Compass,
  Moon,
  Activity,
} from 'lucide-react';
import { formatTime, PRAYER_NAMES } from '@attaqwa/shared';
import type { PrayerName } from '@/types';

interface IqamahTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  updatedAt: string | null;
}

type ViewKey = 'today' | 'week' | 'month' | 'overrides' | 'iqamah' | 'tarawih';

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
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function getHijriFormatted(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return '';
  }
}

function formatRelativeTime(date: Date | null): string {
  if (!date) return '—';
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 5) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const min = Math.floor(diffSec / 60);
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

interface PrayerDefinition {
  key: PrayerKey;
  label: string;
  adhan: string | undefined;
  iqama: string | undefined;
  isSunrise: boolean;
}

function buildPrayerList(todayData: Record<string, unknown> | undefined): PrayerDefinition[] {
  if (!todayData) return [];
  const iqama = (todayData.iqama as Record<string, string> | undefined) ?? {};
  return PRAYER_ORDER.map((key) => ({
    key,
    label: PRAYER_NAMES[key.toUpperCase() as keyof typeof PRAYER_NAMES] || key,
    adhan: todayData[key] as string | undefined,
    iqama: key === 'sunrise' ? undefined : iqama[key],
    isSunrise: key === 'sunrise',
  }));
}

function pickNextPrayer(
  prayers: PrayerDefinition[],
  now: Date
): { idx: number; target: Date; label: string; usesIqama: boolean } | null {
  for (let i = 0; i < prayers.length; i++) {
    const p = prayers[i];
    const candidate = p.iqama ?? p.adhan;
    const t = parseTimeToToday(candidate);
    if (t && t.getTime() > now.getTime()) {
      return { idx: i, target: t, label: p.label, usesIqama: !!p.iqama };
    }
  }
  return null;
}

export default function PrayerTimesPage() {
  const [city, setCity] = useState('Doraville');
  const [country, setCountry] = useState('USA');
  const [method, setMethod] = useState('2');
  const [view, setView] = useState<ViewKey>('today');
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [now, setNow] = useState<Date>(new Date());
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Override form state
  const [showOverrideForm, setShowOverrideForm] = useState(false);
  const [overrideDate, setOverrideDate] = useState('');
  const [overridePrayer, setOverridePrayer] = useState<PrayerName>('fajr');
  const [overrideTime, setOverrideTime] = useState('');
  const [overrideReason, setOverrideReason] = useState('');

  const [iqamahTimes, setIqamahTimes] = useState<IqamahTimes>({
    fajr: '6:45 AM', dhuhr: '1:15 PM', asr: '4:15 PM', maghrib: '+5', isha: '7:45 PM',
    updatedAt: null,
  });
  const [iqamahLoading, setIqamahLoading] = useState(false);
  const [iqamahSaving, setIqamahSaving] = useState(false);
  const [iqamahMessage, setIqamahMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [tarawihEnabled, setTarawihEnabled] = useState(false);
  const [tarawihTime, setTarawihTime] = useState('9:00 PM');
  const [tarawihUpdatedAt, setTarawihUpdatedAt] = useState<string | null>(null);
  const [tarawihLoading, setTarawihLoading] = useState(false);
  const [tarawihSaving, setTarawihSaving] = useState(false);
  const [tarawihMessage, setTarawihMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Tick clock every second so countdown updates
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const fetchIqamahTimes = useCallback(async () => {
    setIqamahLoading(true);
    try {
      const res = await fetch('/api/v1/iqamah-times');
      if (res.ok) setIqamahTimes(await res.json());
    } catch (error) {
      console.error('Failed to fetch iqamah times:', error);
    } finally {
      setIqamahLoading(false);
    }
  }, []);

  const fetchTarawihConfig = useCallback(async () => {
    setTarawihLoading(true);
    try {
      const res = await fetch('/api/v1/tarawih-config');
      if (res.ok) {
        const data = await res.json();
        setTarawihEnabled(data.enabled);
        setTarawihTime(data.time);
        setTarawihUpdatedAt(data.updatedAt);
      }
    } catch (error) {
      console.error('Failed to fetch tarawih config:', error);
    } finally {
      setTarawihLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIqamahTimes();
    fetchTarawihConfig();
  }, [fetchIqamahTimes, fetchTarawihConfig]);

  const handleSaveIqamah = async () => {
    setIqamahSaving(true);
    setIqamahMessage(null);
    try {
      const res = await fetch('/api/v1/iqamah-times', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(iqamahTimes),
      });
      if (res.ok) {
        setIqamahTimes(await res.json());
        setIqamahMessage({ type: 'success', text: 'Iqamah times updated successfully!' });
      } else {
        const err = await res.json();
        setIqamahMessage({ type: 'error', text: err.error || 'Failed to save' });
      }
    } catch {
      setIqamahMessage({ type: 'error', text: 'Failed to save iqamah times' });
    } finally {
      setIqamahSaving(false);
      setTimeout(() => setIqamahMessage(null), 3000);
    }
  };

  const handleSaveTarawih = async () => {
    setTarawihSaving(true);
    setTarawihMessage(null);
    try {
      const res = await fetch('/api/v1/tarawih-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: tarawihEnabled, time: tarawihTime }),
      });
      if (res.ok) {
        const data = await res.json();
        setTarawihEnabled(data.enabled);
        setTarawihTime(data.time);
        setTarawihUpdatedAt(data.updatedAt);
        setTarawihMessage({ type: 'success', text: 'Tarawih config updated successfully!' });
      } else {
        const err = await res.json();
        setTarawihMessage({ type: 'error', text: err.error || 'Failed to save' });
      }
    } catch {
      setTarawihMessage({ type: 'error', text: 'Failed to save tarawih config' });
    } finally {
      setTarawihSaving(false);
      setTimeout(() => setTarawihMessage(null), 3000);
    }
  };

  // Masjid At-Taqwa, Doraville, GA
  const latitude = 33.9114;
  const longitude = -84.2614;

  const { data: todayData, isLoading: todayLoading, refetch: refetchToday, dataUpdatedAt: todayUpdatedAt } = useTodayPrayerTimes(latitude, longitude);
  const { data: weekData, isLoading: weekLoading, refetch: refetchWeek } = useWeekPrayerTimes(latitude, longitude);
  const { data: monthData, isLoading: monthLoading, refetch: refetchMonth } = useMonthPrayerTimes(latitude, longitude);
  const { data: overridesData, isLoading: overridesLoading } = usePrayerTimeOverrides();
  const createOverride = useCreatePrayerTimeOverride();
  const deleteOverride = useDeletePrayerTimeOverride();

  useEffect(() => {
    if (todayUpdatedAt) setLastSynced(new Date(todayUpdatedAt));
  }, [todayUpdatedAt]);

  const handleSettingsUpdate = () => {
    refetchToday();
    refetchWeek();
    refetchMonth();
    setSettingsOpen(false);
  };

  const handleRefresh = () => {
    refetchToday();
    refetchWeek();
    refetchMonth();
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    alert(`Export to ${format.toUpperCase()} functionality would be implemented here`);
  };

  const handleCreateOverride = async () => {
    if (!overrideDate || !overridePrayer || !overrideTime) return;
    try {
      await createOverride.mutateAsync({
        date: overrideDate,
        prayer: overridePrayer,
        overrideTime,
        reason: overrideReason || undefined,
        isActive: true,
      } as any);
      setShowOverrideForm(false);
      setOverrideDate('');
      setOverridePrayer('fajr');
      setOverrideTime('');
      setOverrideReason('');
    } catch (error) {
      console.error('Failed to create override:', error);
    }
  };

  const handleDeleteOverride = async (id: string) => {
    if (!confirm('Are you sure you want to delete this override?')) return;
    try {
      await deleteOverride.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete override:', error);
    }
  };

  const prayers = useMemo(() => buildPrayerList(todayData as unknown as Record<string, unknown> | undefined), [todayData]);
  const next = useMemo(() => pickNextPrayer(prayers, now), [prayers, now]);
  const activeOverridesCount = useMemo(
    () => (overridesData?.data?.filter((o) => o.isActive).length ?? 0),
    [overridesData]
  );

  const isLoading = todayLoading || weekLoading || monthLoading;
  const hijriDate = getHijriFormatted(new Date());
  const gregorianDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  const tabs: { key: ViewKey; label: string; icon?: React.ReactNode; badge?: number; group: 'range' | 'view' }[] = [
    { key: 'today', label: 'Today', group: 'range' },
    { key: 'week', label: 'This Week', group: 'range' },
    { key: 'month', label: 'This Month', group: 'range' },
    { key: 'iqamah', label: 'Iqamah Times', icon: <Users className="w-3.5 h-3.5" />, group: 'view' },
    { key: 'tarawih', label: 'Tarawih', icon: <Moon className="w-3.5 h-3.5" />, group: 'view' },
    { key: 'overrides', label: 'Overrides', icon: <AlertTriangle className="w-3.5 h-3.5" />, badge: activeOverridesCount, group: 'view' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Prayer Times</h1>
          <p className="text-gray-600 mt-1 text-sm">
            Manage and view prayer times for the community
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings2 className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Prayer Time Settings</DialogTitle>
                <DialogDescription>
                  Location and calculation method for prayer time computations.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4 pb-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="method">Calculation Method</Label>
                  <select
                    id="method"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="1">University of Islamic Sciences, Karachi</option>
                    <option value="2">Islamic Society of North America (ISNA)</option>
                    <option value="3">Muslim World League (MWL)</option>
                    <option value="4">Umm al-Qura, Makkah</option>
                    <option value="5">Egyptian General Authority of Survey</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSettingsOpen(false)}>Cancel</Button>
                <Button onClick={handleSettingsUpdate} className="bg-emerald-600 hover:bg-emerald-700">
                  Save & Update
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => handleExport('pdf')} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Meta strip */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-600 border-y border-gray-200 py-2.5 px-1">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-medium text-gray-900">{gregorianDate}</span>
        </div>
        {hijriDate && (
          <div className="flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5 text-amber-600" />
            <span>{hijriDate}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-emerald-600" />
          <span>Qibla: {todayData?.qibla ?? '—'}&deg;</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span>Source:</span>
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            Aladhan API
          </Badge>
          <span className="text-gray-400">·</span>
          <span>Iqama:</span>
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            Strapi schedule
          </Badge>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <span>Synced {formatRelativeTime(lastSynced)}</span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="inline-flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((t, i) => {
            const active = view === t.key;
            const prev = tabs[i - 1];
            const showDivider = prev && prev.group !== t.group;
            return (
              <div key={t.key} className="flex items-center">
                {showDivider && <div className="w-px h-5 bg-gray-300 mx-1" />}
                <button
                  onClick={() => setView(t.key)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t.icon}
                  {t.label}
                  {t.badge && t.badge > 0 ? (
                    <span className={`ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      active ? 'bg-amber-100 text-amber-700' : 'bg-amber-500 text-white'
                    }`}>
                      {t.badge}
                    </span>
                  ) : null}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {isLoading && view !== 'overrides' && view !== 'iqamah' && view !== 'tarawih' && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      )}

      {/* Today view */}
      {view === 'today' && todayData && (
        <div className="space-y-4">
          {/* Next prayer hero */}
          {next && (
            <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-amber-50/40 overflow-hidden relative">
              <CardContent className="py-5 px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-wider text-emerald-700 font-semibold">Next prayer</div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5 flex flex-wrap items-baseline gap-x-2">
                      <span>{next.label}</span>
                      <span className="text-gray-400 font-normal text-sm sm:text-base">
                        {next.usesIqama ? '· Iqama' : '· Time'} {formatTime(prayers[next.idx].iqama ?? prayers[next.idx].adhan ?? '')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">In</div>
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-700 font-mono tabular-nums">
                    {formatCountdown(next.target.getTime() - now.getTime())}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Prayer grid */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="w-4 h-4 text-emerald-600" />
                Today&apos;s Prayer Times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {prayers.filter((p) => !p.isSunrise).map((p) => {
                  const isNext = next && prayers[next.idx].key === p.key;
                  return (
                    <div
                      key={p.key}
                      className={`rounded-xl border p-4 flex flex-col items-center text-center transition-all ${
                        isNext
                          ? 'border-emerald-400 bg-emerald-50/60 ring-2 ring-emerald-200 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm tracking-wide">{p.label}</h3>
                        {isNext && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-1.5 py-0.5 rounded">
                            Next
                          </span>
                        )}
                      </div>
                      {p.iqama ? (
                        <>
                          <div className="text-[10px] uppercase tracking-wider text-emerald-600 font-semibold">Iqama</div>
                          <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums whitespace-nowrap mt-0.5">
                            {formatTime(p.iqama)}
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-100 w-full">
                            <div className="text-[10px] uppercase tracking-wider text-gray-400">Adhan</div>
                            <div className="text-sm text-gray-600 font-mono tabular-nums whitespace-nowrap">
                              {p.adhan ? formatTime(p.adhan) : '—'}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-2xl font-bold text-gray-700 font-mono tabular-nums whitespace-nowrap mt-0.5">
                          {p.adhan ? formatTime(p.adhan) : '—'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Sunrise slim row */}
              {(() => {
                const sunrise = prayers.find((p) => p.isSunrise);
                if (!sunrise || !sunrise.adhan) return null;
                return (
                  <div className="mt-4 flex items-center gap-3 px-4 py-2.5 rounded-lg bg-amber-50/60 border border-amber-200">
                    <SunriseIcon className="w-4 h-4 text-amber-700" />
                    <span className="text-sm font-medium text-amber-900">Sunrise</span>
                    <span className="text-xs text-amber-700">(no congregation)</span>
                    <span className="ml-auto text-base font-mono tabular-nums font-semibold text-amber-900 whitespace-nowrap">
                      {formatTime(sunrise.adhan)}
                    </span>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Week view */}
      {view === 'week' && weekData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-4 h-4 text-emerald-600" />
              This Week&apos;s Prayer Times
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-semibold text-gray-700">Date</th>
                    <th className="text-center py-2 font-semibold text-gray-700">Fajr</th>
                    <th className="text-center py-2 font-semibold text-gray-700">Sunrise</th>
                    <th className="text-center py-2 font-semibold text-gray-700">Dhuhr</th>
                    <th className="text-center py-2 font-semibold text-gray-700">Asr</th>
                    <th className="text-center py-2 font-semibold text-gray-700">Maghrib</th>
                    <th className="text-center py-2 font-semibold text-gray-700">Isha</th>
                  </tr>
                </thead>
                <tbody>
                  {weekData.map((day) => (
                    <tr key={day.date} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 font-medium">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-3 text-center font-mono tabular-nums">{formatTime(day.prayerTimes.fajr)}</td>
                      <td className="py-3 text-center font-mono tabular-nums text-amber-700">{formatTime(day.prayerTimes.sunrise)}</td>
                      <td className="py-3 text-center font-mono tabular-nums">{formatTime(day.prayerTimes.dhuhr)}</td>
                      <td className="py-3 text-center font-mono tabular-nums">{formatTime(day.prayerTimes.asr)}</td>
                      <td className="py-3 text-center font-mono tabular-nums">{formatTime(day.prayerTimes.maghrib)}</td>
                      <td className="py-3 text-center font-mono tabular-nums">{formatTime(day.prayerTimes.isha)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Month view */}
      {view === 'month' && monthData && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Monthly Prayer Times
            </CardTitle>
            <Input type="month" value={currentMonth} onChange={(e) => setCurrentMonth(e.target.value)} className="w-40" />
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white shadow-sm">
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-semibold text-gray-700">Date</th>
                    <th className="text-center py-2 font-semibold text-gray-700">Fajr</th>
                    <th className="text-center py-2 font-semibold text-gray-700">Sunrise</th>
                    <th className="text-center py-2 font-semibold text-gray-700">Dhuhr</th>
                    <th className="text-center py-2 font-semibold text-gray-700">Asr</th>
                    <th className="text-center py-2 font-semibold text-gray-700">Maghrib</th>
                    <th className="text-center py-2 font-semibold text-gray-700">Isha</th>
                  </tr>
                </thead>
                <tbody>
                  {monthData.map((day) => (
                    <tr key={day.date} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 font-medium">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-2 text-center font-mono tabular-nums text-xs">{formatTime(day.prayerTimes.fajr)}</td>
                      <td className="py-2 text-center font-mono tabular-nums text-xs text-amber-700">{formatTime(day.prayerTimes.sunrise)}</td>
                      <td className="py-2 text-center font-mono tabular-nums text-xs">{formatTime(day.prayerTimes.dhuhr)}</td>
                      <td className="py-2 text-center font-mono tabular-nums text-xs">{formatTime(day.prayerTimes.asr)}</td>
                      <td className="py-2 text-center font-mono tabular-nums text-xs">{formatTime(day.prayerTimes.maghrib)}</td>
                      <td className="py-2 text-center font-mono tabular-nums text-xs">{formatTime(day.prayerTimes.isha)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Iqamah Times view */}
      {view === 'iqamah' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="w-4 h-4 text-emerald-600" />
              Iqamah Times (Congregation)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-gray-600">
              Set the iqamah (congregation) times for each prayer. These are displayed alongside the adhan times on the public prayer times page. Use &quot;+N&quot; format (e.g., &quot;+5&quot;) for Maghrib to add minutes after the adhan time.
            </p>
            {iqamahLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {([
                    { key: 'fajr', label: 'Fajr', hint: 'e.g., 6:45 AM' },
                    { key: 'dhuhr', label: 'Dhuhr', hint: 'e.g., 1:15 PM' },
                    { key: 'asr', label: 'Asr', hint: 'e.g., 4:15 PM' },
                    { key: 'maghrib', label: 'Maghrib', hint: 'e.g., +5 (minutes after adhan)' },
                    { key: 'isha', label: 'Isha', hint: 'e.g., 7:45 PM' },
                  ] as const).map(({ key, label, hint }) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={`iqamah-${key}`} className="font-semibold">{label}</Label>
                      <Input
                        id={`iqamah-${key}`}
                        value={iqamahTimes[key]}
                        onChange={(e) => setIqamahTimes((prev) => ({ ...prev, [key]: e.target.value }))}
                        placeholder={hint}
                      />
                      <p className="text-xs text-gray-400">{hint}</p>
                    </div>
                  ))}
                </div>
                {iqamahMessage && (
                  <div className={`px-4 py-2 rounded-md text-sm ${
                    iqamahMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {iqamahMessage.text}
                  </div>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    {iqamahTimes.updatedAt
                      ? `Last updated: ${new Date(iqamahTimes.updatedAt).toLocaleString()}`
                      : 'Using default iqamah times'}
                  </div>
                  <Button onClick={handleSaveIqamah} disabled={iqamahSaving} className="bg-emerald-600 hover:bg-emerald-700">
                    <Save className="w-4 h-4 mr-2" />
                    {iqamahSaving ? 'Saving...' : 'Save Iqamah Times'}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tarawih view */}
      {view === 'tarawih' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Moon className="w-4 h-4 text-amber-600" />
              Tarawih Prayer (Ramadan)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-gray-600">
              Configure Tarawih prayer time for Ramadan. By default, Tarawih is only shown during Ramadan (auto-detected from the Hijri calendar). Enable &quot;Always Show&quot; to display year-round.
            </p>
            {tarawihLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="tarawih-enabled"
                      checked={tarawihEnabled}
                      onChange={(e) => setTarawihEnabled(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <Label htmlFor="tarawih-enabled" className="font-semibold">Always Show Tarawih</Label>
                  </div>
                  <p className="text-xs text-gray-400 ml-7">When unchecked, Tarawih only displays during Ramadan (Hijri month 9).</p>
                  <div className="space-y-2 max-w-xs">
                    <Label htmlFor="tarawih-time" className="font-semibold">Tarawih Time</Label>
                    <Input id="tarawih-time" value={tarawihTime} onChange={(e) => setTarawihTime(e.target.value)} placeholder="e.g., 9:00 PM or +30" />
                    <p className="text-xs text-gray-400">
                      Fixed time (e.g., &quot;9:00 PM&quot;) or relative offset from Isha (e.g., &quot;+30&quot;).
                    </p>
                  </div>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm text-amber-900 font-medium mb-1">About Ramadan Auto-Detection</p>
                  <p className="text-xs text-amber-800">
                    The system auto-detects Ramadan via the Hijri calendar from the Aladhan API. When &quot;Always Show&quot; is off, the Tarawih time only appears during Ramadan (Hijri month 9).
                  </p>
                </div>
                {tarawihMessage && (
                  <div className={`px-4 py-2 rounded-md text-sm ${
                    tarawihMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {tarawihMessage.text}
                  </div>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    {tarawihUpdatedAt
                      ? `Last updated: ${new Date(tarawihUpdatedAt).toLocaleString()}`
                      : 'Using default tarawih config'}
                  </div>
                  <Button onClick={handleSaveTarawih} disabled={tarawihSaving} className="bg-emerald-600 hover:bg-emerald-700">
                    <Save className="w-4 h-4 mr-2" />
                    {tarawihSaving ? 'Saving...' : 'Save Tarawih Config'}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Overrides view */}
      {view === 'overrides' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Prayer Time Overrides
              {activeOverridesCount > 0 && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
                  {activeOverridesCount} active
                </Badge>
              )}
            </CardTitle>
            <Button size="sm" onClick={() => setShowOverrideForm(!showOverrideForm)} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Override
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {showOverrideForm && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-4">
                <h4 className="font-medium text-gray-900">New Override</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="override-date">Date</Label>
                    <Input id="override-date" type="date" value={overrideDate} onChange={(e) => setOverrideDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="override-prayer">Prayer</Label>
                    <select
                      id="override-prayer"
                      value={overridePrayer}
                      onChange={(e) => setOverridePrayer(e.target.value as PrayerName)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="fajr">Fajr</option>
                      <option value="sunrise">Sunrise</option>
                      <option value="dhuhr">Dhuhr</option>
                      <option value="asr">Asr</option>
                      <option value="maghrib">Maghrib</option>
                      <option value="isha">Isha</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="override-time">Override Time</Label>
                    <Input id="override-time" type="time" value={overrideTime} onChange={(e) => setOverrideTime(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="override-reason">Reason</Label>
                    <Input id="override-reason" value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} placeholder="e.g., Ramadan adjustment" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateOverride} disabled={createOverride.isPending} className="bg-emerald-600 hover:bg-emerald-700">
                    {createOverride.isPending ? 'Saving...' : 'Save Override'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowOverrideForm(false)}>Cancel</Button>
                </div>
              </div>
            )}

            {overridesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
              </div>
            ) : overridesData?.data && overridesData.data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-2 font-semibold text-gray-700">Prayer</th>
                      <th className="text-left py-2 font-semibold text-gray-700">Override Time</th>
                      <th className="text-left py-2 font-semibold text-gray-700">Reason</th>
                      <th className="text-left py-2 font-semibold text-gray-700">Status</th>
                      <th className="text-right py-2 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overridesData.data.map((override) => (
                      <tr key={override.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3">{new Date(override.date).toLocaleDateString()}</td>
                        <td className="py-3 capitalize font-medium">{override.prayer}</td>
                        <td className="py-3 font-mono tabular-nums">{override.overrideTime}</td>
                        <td className="py-3 text-gray-600">{override.reason || '—'}</td>
                        <td className="py-3">
                          <Badge variant={override.isActive ? 'default' : 'secondary'}>
                            {override.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 text-right">
                          <Button variant="outline" size="sm" onClick={() => handleDeleteOverride(override.id)} disabled={deleteOverride.isPending}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No prayer time overrides configured.</p>
                <p className="text-sm mt-1">Click &quot;Add Override&quot; to create one.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
