'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTodayPrayerTimes, useWeekPrayerTimes, useMonthPrayerTimes } from '@/lib/hooks/usePrayerTimes';
import { usePrayerTimeOverrides, useCreatePrayerTimeOverride, useDeletePrayerTimeOverride } from '@/lib/hooks/usePrayerTimeOverrides';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  MapPin,
  Calendar,
  Settings,
  Download,
  RefreshCw,
  Plus,
  Trash2,
  AlertTriangle,
  Save,
  Users,
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

export default function PrayerTimesPage() {
  const [city, setCity] = useState('Doraville');
  const [country, setCountry] = useState('USA');
  const [method, setMethod] = useState('2'); // ISNA method
  const [view, setView] = useState<'today' | 'week' | 'month' | 'overrides' | 'iqamah' | 'tarawih'>('today');
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));

  // Override form state
  const [showOverrideForm, setShowOverrideForm] = useState(false);
  const [overrideDate, setOverrideDate] = useState('');
  const [overridePrayer, setOverridePrayer] = useState<PrayerName>('fajr');
  const [overrideTime, setOverrideTime] = useState('');
  const [overrideReason, setOverrideReason] = useState('');

  // Iqamah times state
  const [iqamahTimes, setIqamahTimes] = useState<IqamahTimes>({
    fajr: '6:45 AM',
    dhuhr: '1:15 PM',
    asr: '4:15 PM',
    maghrib: '+5',
    isha: '7:45 PM',
    updatedAt: null,
  });
  const [iqamahLoading, setIqamahLoading] = useState(false);
  const [iqamahSaving, setIqamahSaving] = useState(false);
  const [iqamahMessage, setIqamahMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Tarawih config state
  const [tarawihEnabled, setTarawihEnabled] = useState(false);
  const [tarawihTime, setTarawihTime] = useState('9:00 PM');
  const [tarawihUpdatedAt, setTarawihUpdatedAt] = useState<string | null>(null);
  const [tarawihLoading, setTarawihLoading] = useState(false);
  const [tarawihSaving, setTarawihSaving] = useState(false);
  const [tarawihMessage, setTarawihMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchIqamahTimes = useCallback(async () => {
    setIqamahLoading(true);
    try {
      const res = await fetch('/api/v1/iqamah-times');
      if (res.ok) {
        const data = await res.json();
        setIqamahTimes(data);
      }
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
        const data = await res.json();
        setIqamahTimes(data);
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

  const { data: todayData, isLoading: todayLoading, refetch: refetchToday } = useTodayPrayerTimes(latitude, longitude);
  const { data: weekData, isLoading: weekLoading, refetch: refetchWeek } = useWeekPrayerTimes(latitude, longitude);
  const { data: monthData, isLoading: monthLoading, refetch: refetchMonth } = useMonthPrayerTimes(latitude, longitude);
  const { data: overridesData, isLoading: overridesLoading } = usePrayerTimeOverrides();
  const createOverride = useCreatePrayerTimeOverride();
  const deleteOverride = useDeletePrayerTimeOverride();

  const handleSettingsUpdate = () => {
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

  const isLoading = todayLoading || weekLoading || monthLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prayer Times</h1>
          <p className="text-gray-600 mt-2">
            Manage and view prayer times for the community
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={handleSettingsUpdate} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => handleExport('pdf')} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Enter country"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Calculation Method</Label>
              <select
                id="method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-islamic-green-500"
              >
                <option value="1">University of Islamic Sciences, Karachi</option>
                <option value="2">Islamic Society of North America (ISNA)</option>
                <option value="3">Muslim World League (MWL)</option>
                <option value="4">Umm al-Qura, Makkah</option>
                <option value="5">Egyptian General Authority of Survey</option>
              </select>
            </div>

            <Button
              onClick={handleSettingsUpdate}
              className="w-full bg-islamic-green-600 hover:bg-islamic-green-700"
            >
              Update Prayer Times
            </Button>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{city}, {country}</span>
              </div>
              {todayData && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                  <span>Qibla: {todayData.qibla}&deg;</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* View Toggle */}
          <div className="flex space-x-2">
            <Button
              variant={view === 'today' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('today')}
            >
              Today
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('week')}
            >
              This Week
            </Button>
            <Button
              variant={view === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('month')}
            >
              This Month
            </Button>
            <Button
              variant={view === 'iqamah' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('iqamah')}
            >
              <Users className="w-4 h-4 mr-1" />
              Iqamah Times
            </Button>
            <Button
              variant={view === 'tarawih' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('tarawih')}
            >
              <Clock className="w-4 h-4 mr-1" />
              Tarawih (Ramadan)
            </Button>
            <Button
              variant={view === 'overrides' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('overrides')}
            >
              <AlertTriangle className="w-4 h-4 mr-1" />
              Overrides
            </Button>
          </div>

          {isLoading && view !== 'overrides' && view !== 'iqamah' && view !== 'tarawih' && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-islamic-green-600"></div>
            </div>
          )}

          {/* Today's Prayer Times */}
          {view === 'today' && todayData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Today&apos;s Prayer Times</span>
                  <Badge variant="secondary">
                    {new Date().toLocaleDateString()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Object.entries(todayData)
                    .filter(([key]) => ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'].includes(key))
                    .map(([prayer, time]) => {
                      const iqamaTime = prayer !== 'sunrise' && todayData.iqama
                        ? (todayData.iqama as Record<string, string>)[prayer]
                        : undefined;
                      return (
                        <Card key={prayer} className="text-center">
                          <CardContent className="py-4">
                            <h3 className="font-semibold text-gray-900 capitalize mb-2">
                              {PRAYER_NAMES[prayer.toUpperCase() as keyof typeof PRAYER_NAMES] || prayer}
                            </h3>
                            <div className="text-xs text-gray-400 mb-0.5">Adhan</div>
                            <p className="text-2xl font-mono text-islamic-green-600">
                              {formatTime(time as string)}
                            </p>
                            {iqamaTime && (
                              <>
                                <div className="text-xs text-emerald-500 mt-1">Iqama</div>
                                <p className="text-lg font-mono text-emerald-600">
                                  {formatTime(iqamaTime)}
                                </p>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Week View */}
          {view === 'week' && weekData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>This Week&apos;s Prayer Times</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-semibold">Date</th>
                        <th className="text-center py-2 font-semibold">Fajr</th>
                        <th className="text-center py-2 font-semibold">Sunrise</th>
                        <th className="text-center py-2 font-semibold">Dhuhr</th>
                        <th className="text-center py-2 font-semibold">Asr</th>
                        <th className="text-center py-2 font-semibold">Maghrib</th>
                        <th className="text-center py-2 font-semibold">Isha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weekData.map((day) => (
                        <tr key={day.date} className="border-b hover:bg-gray-50">
                          <td className="py-3 font-medium">
                            {new Date(day.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="py-3 text-center font-mono">{formatTime(day.prayerTimes.fajr)}</td>
                          <td className="py-3 text-center font-mono">{formatTime(day.prayerTimes.sunrise)}</td>
                          <td className="py-3 text-center font-mono">{formatTime(day.prayerTimes.dhuhr)}</td>
                          <td className="py-3 text-center font-mono">{formatTime(day.prayerTimes.asr)}</td>
                          <td className="py-3 text-center font-mono">{formatTime(day.prayerTimes.maghrib)}</td>
                          <td className="py-3 text-center font-mono">{formatTime(day.prayerTimes.isha)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Month View */}
          {view === 'month' && monthData && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Monthly Prayer Times</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Input
                    type="month"
                    value={currentMonth}
                    onChange={(e) => setCurrentMonth(e.target.value)}
                    className="w-40"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b">
                        <th className="text-left py-2 font-semibold">Date</th>
                        <th className="text-center py-2 font-semibold">Fajr</th>
                        <th className="text-center py-2 font-semibold">Sunrise</th>
                        <th className="text-center py-2 font-semibold">Dhuhr</th>
                        <th className="text-center py-2 font-semibold">Asr</th>
                        <th className="text-center py-2 font-semibold">Maghrib</th>
                        <th className="text-center py-2 font-semibold">Isha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthData.map((day) => (
                        <tr key={day.date} className="border-b hover:bg-gray-50">
                          <td className="py-2 font-medium">
                            {new Date(day.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="py-2 text-center font-mono text-xs">{formatTime(day.prayerTimes.fajr)}</td>
                          <td className="py-2 text-center font-mono text-xs">{formatTime(day.prayerTimes.sunrise)}</td>
                          <td className="py-2 text-center font-mono text-xs">{formatTime(day.prayerTimes.dhuhr)}</td>
                          <td className="py-2 text-center font-mono text-xs">{formatTime(day.prayerTimes.asr)}</td>
                          <td className="py-2 text-center font-mono text-xs">{formatTime(day.prayerTimes.maghrib)}</td>
                          <td className="py-2 text-center font-mono text-xs">{formatTime(day.prayerTimes.isha)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Iqamah Times View */}
          {view === 'iqamah' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Iqamah Times (Congregation)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-gray-600">
                  Set the iqamah (congregation) times for each prayer. These are displayed alongside the adhan times on the public prayer times page. Use &quot;+N&quot; format (e.g., &quot;+5&quot;) for Maghrib to automatically add minutes after the adhan time.
                </p>

                {iqamahLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-islamic-green-600"></div>
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
                            onChange={(e) =>
                              setIqamahTimes((prev) => ({ ...prev, [key]: e.target.value }))
                            }
                            placeholder={hint}
                          />
                          <p className="text-xs text-gray-400">{hint}</p>
                        </div>
                      ))}
                    </div>

                    {iqamahMessage && (
                      <div
                        className={`px-4 py-2 rounded-md text-sm ${
                          iqamahMessage.type === 'success'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {iqamahMessage.text}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500">
                        {iqamahTimes.updatedAt
                          ? `Last updated: ${new Date(iqamahTimes.updatedAt).toLocaleString()}`
                          : 'Using default iqamah times'}
                      </div>
                      <Button
                        onClick={handleSaveIqamah}
                        disabled={iqamahSaving}
                        className="bg-islamic-green-600 hover:bg-islamic-green-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {iqamahSaving ? 'Saving...' : 'Save Iqamah Times'}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tarawih Config View */}
          {view === 'tarawih' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Tarawih Prayer (Ramadan)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-gray-600">
                  Configure Tarawih prayer time for Ramadan. By default, Tarawih is only shown during Ramadan (auto-detected from the Hijri calendar). Enable &quot;Always Show&quot; to display it year-round.
                </p>

                {tarawihLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-islamic-green-600"></div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="tarawih-enabled"
                          checked={tarawihEnabled}
                          onChange={(e) => setTarawihEnabled(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-islamic-green-600 focus:ring-islamic-green-500"
                        />
                        <Label htmlFor="tarawih-enabled" className="font-semibold">
                          Always Show Tarawih
                        </Label>
                      </div>
                      <p className="text-xs text-gray-400 ml-7">
                        When unchecked, Tarawih is only displayed during Ramadan (Hijri month 9).
                      </p>

                      <div className="space-y-2 max-w-xs">
                        <Label htmlFor="tarawih-time" className="font-semibold">Tarawih Time</Label>
                        <Input
                          id="tarawih-time"
                          value={tarawihTime}
                          onChange={(e) => setTarawihTime(e.target.value)}
                          placeholder="e.g., 9:00 PM or +30 (after Isha)"
                        />
                        <p className="text-xs text-gray-400">
                          Enter a fixed time (e.g., &quot;9:00 PM&quot;) or a relative offset from Isha (e.g., &quot;+30&quot; for 30 minutes after Isha).
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                      <p className="text-sm text-purple-800 font-medium mb-1">About Ramadan Auto-Detection</p>
                      <p className="text-xs text-purple-600">
                        The system automatically detects Ramadan using the Hijri calendar from the Aladhan API. When &quot;Always Show&quot; is unchecked, the Tarawih time will only appear in the prayer schedule during the month of Ramadan (Hijri month 9).
                      </p>
                    </div>

                    {tarawihMessage && (
                      <div
                        className={`px-4 py-2 rounded-md text-sm ${
                          tarawihMessage.type === 'success'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {tarawihMessage.text}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500">
                        {tarawihUpdatedAt
                          ? `Last updated: ${new Date(tarawihUpdatedAt).toLocaleString()}`
                          : 'Using default tarawih config'}
                      </div>
                      <Button
                        onClick={handleSaveTarawih}
                        disabled={tarawihSaving}
                        className="bg-islamic-green-600 hover:bg-islamic-green-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {tarawihSaving ? 'Saving...' : 'Save Tarawih Config'}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Overrides View */}
          {view === 'overrides' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Prayer Time Overrides</span>
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => setShowOverrideForm(!showOverrideForm)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Override
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Override Form */}
                {showOverrideForm && (
                  <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
                    <h4 className="font-medium text-gray-900">New Override</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="override-date">Date</Label>
                        <Input
                          id="override-date"
                          type="date"
                          value={overrideDate}
                          onChange={(e) => setOverrideDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="override-prayer">Prayer</Label>
                        <select
                          id="override-prayer"
                          value={overridePrayer}
                          onChange={(e) => setOverridePrayer(e.target.value as PrayerName)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-islamic-green-500"
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
                        <Input
                          id="override-time"
                          type="time"
                          value={overrideTime}
                          onChange={(e) => setOverrideTime(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="override-reason">Reason</Label>
                        <Input
                          id="override-reason"
                          value={overrideReason}
                          onChange={(e) => setOverrideReason(e.target.value)}
                          placeholder="e.g., Ramadan adjustment"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleCreateOverride}
                        disabled={createOverride.isPending}
                        className="bg-islamic-green-600 hover:bg-islamic-green-700"
                      >
                        {createOverride.isPending ? 'Saving...' : 'Save Override'}
                      </Button>
                      <Button variant="outline" onClick={() => setShowOverrideForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Overrides List */}
                {overridesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-islamic-green-600"></div>
                  </div>
                ) : overridesData?.data && overridesData.data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-semibold">Date</th>
                          <th className="text-left py-2 font-semibold">Prayer</th>
                          <th className="text-left py-2 font-semibold">Override Time</th>
                          <th className="text-left py-2 font-semibold">Reason</th>
                          <th className="text-left py-2 font-semibold">Status</th>
                          <th className="text-right py-2 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {overridesData.data.map((override) => (
                          <tr key={override.id} className="border-b hover:bg-gray-50">
                            <td className="py-3">
                              {new Date(override.date).toLocaleDateString()}
                            </td>
                            <td className="py-3 capitalize font-medium">{override.prayer}</td>
                            <td className="py-3 font-mono">{override.overrideTime}</td>
                            <td className="py-3 text-gray-600">{override.reason || '—'}</td>
                            <td className="py-3">
                              <Badge variant={override.isActive ? 'default' : 'secondary'}>
                                {override.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td className="py-3 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteOverride(override.id)}
                                disabled={deleteOverride.isPending}
                              >
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
      </div>
    </div>
  );
}
