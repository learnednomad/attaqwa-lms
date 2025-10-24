'use client';

import { useState } from 'react';
import { useTodayPrayerTimes, useWeekPrayerTimes, useMonthPrayerTimes } from '@/lib/hooks/usePrayerTimes';
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
  RefreshCw 
} from 'lucide-react';
import { formatTime, PRAYER_NAMES } from '@attaqwa/shared';

export default function PrayerTimesPage() {
  const [city, setCity] = useState('Toronto');
  const [country, setCountry] = useState('Canada');
  const [method, setMethod] = useState('2'); // ISNA method
  const [view, setView] = useState<'today' | 'week' | 'month'>('today');
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));

  const { data: todayData, isLoading: todayLoading, refetch: refetchToday } = useTodayPrayerTimes({ city, country, method });
  const { data: weekData, isLoading: weekLoading, refetch: refetchWeek } = useWeekPrayerTimes({ city, country, method });
  const { data: monthData, isLoading: monthLoading, refetch: refetchMonth } = useMonthPrayerTimes(currentMonth, { city, country, method });

  const handleSettingsUpdate = () => {
    refetchToday();
    refetchWeek();
    refetchMonth();
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    // Mock export functionality
    alert(`Export to ${format.toUpperCase()} functionality would be implemented here`);
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
              {todayData?.data && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                  <span>Qibla: {todayData.data.qibla}°</span>
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
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-islamic-green-600"></div>
            </div>
          )}

          {/* Today's Prayer Times */}
          {view === 'today' && todayData?.data && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Today's Prayer Times</span>
                  <Badge variant="secondary">
                    {new Date().toLocaleDateString()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Object.entries(todayData.data)
                    .filter(([key]) => key !== 'date' && key !== 'qibla')
                    .map(([prayer, time]) => (
                      <Card key={prayer} className="text-center">
                        <CardContent className="py-4">
                          <h3 className="font-semibold text-gray-900 capitalize mb-2">
                            {PRAYER_NAMES[prayer.toUpperCase() as keyof typeof PRAYER_NAMES] || prayer}
                          </h3>
                          <p className="text-2xl font-mono text-islamic-green-600">
                            {formatTime(time as string)}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Week View */}
          {view === 'week' && weekData?.data && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>This Week's Prayer Times</span>
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
                      {weekData.data.map((day) => (
                        <tr key={day.date} className="border-b hover:bg-gray-50">
                          <td className="py-3 font-medium">
                            {new Date(day.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="py-3 text-center font-mono">{formatTime(day.fajr)}</td>
                          <td className="py-3 text-center font-mono">{formatTime(day.sunrise)}</td>
                          <td className="py-3 text-center font-mono">{formatTime(day.dhuhr)}</td>
                          <td className="py-3 text-center font-mono">{formatTime(day.asr)}</td>
                          <td className="py-3 text-center font-mono">{formatTime(day.maghrib)}</td>
                          <td className="py-3 text-center font-mono">{formatTime(day.isha)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Month View */}
          {view === 'month' && monthData?.data && (
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
                      {monthData.data.map((day) => (
                        <tr key={day.date} className="border-b hover:bg-gray-50">
                          <td className="py-2 font-medium">
                            {new Date(day.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="py-2 text-center font-mono text-xs">{formatTime(day.fajr)}</td>
                          <td className="py-2 text-center font-mono text-xs">{formatTime(day.sunrise)}</td>
                          <td className="py-2 text-center font-mono text-xs">{formatTime(day.dhuhr)}</td>
                          <td className="py-2 text-center font-mono text-xs">{formatTime(day.asr)}</td>
                          <td className="py-2 text-center font-mono text-xs">{formatTime(day.maghrib)}</td>
                          <td className="py-2 text-center font-mono text-xs">{formatTime(day.isha)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}