"use client";

import { useState, useEffect } from 'react';
import { Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DailyPrayerTimes } from '@/types';
import { cn } from '@/lib/utils';

interface PrayerTimesWidgetProps {
  prayerTimes: DailyPrayerTimes;
  className?: string;
  compact?: boolean;
  currentPrayer?: string;
  variant?: 'default' | 'glass';
}

function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return -1;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'AM' && hours === 12) hours = 0;
  if (period === 'PM' && hours !== 12) hours += 12;
  return hours * 60 + minutes;
}

function detectCurrentPrayer(prayerTimes: DailyPrayerTimes): string {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const prayers = [
    { key: 'fajr', time: parseTimeToMinutes(prayerTimes.fajr) },
    { key: 'dhuhr', time: parseTimeToMinutes(prayerTimes.dhuhr) },
    { key: 'asr', time: parseTimeToMinutes(prayerTimes.asr) },
    { key: 'maghrib', time: parseTimeToMinutes(prayerTimes.maghrib) },
    { key: 'isha', time: parseTimeToMinutes(prayerTimes.isha) },
  ];
  let current = 'isha';
  for (const prayer of prayers) {
    if (prayer.time >= 0 && currentMinutes >= prayer.time) {
      current = prayer.key;
    }
  }
  return current;
}

export function PrayerTimesWidget({
  prayerTimes,
  className,
  compact = false,
  currentPrayer: currentPrayerProp,
  variant = 'default'
}: PrayerTimesWidgetProps) {
  const [detectedPrayer, setDetectedPrayer] = useState('');
  const [hijriDate, setHijriDate] = useState({ en: '', ar: '' });
  const g = variant === 'glass';

  useEffect(() => {
    const update = () => setDetectedPrayer(detectCurrentPrayer(prayerTimes));
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  useEffect(() => {
    try {
      const now = new Date();
      const en = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
        day: 'numeric', month: 'long', year: 'numeric',
      }).format(now);
      const ar = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
        day: 'numeric', month: 'long', year: 'numeric',
      }).format(now);
      setHijriDate({ en, ar });
    } catch {
      // Fallback for browsers without islamic-umalqura support
    }
  }, []);

  const currentPrayer = currentPrayerProp || detectedPrayer;
  const prayers = [
    {
      name: 'Fajr',
      time: prayerTimes.fajr,
      iqama: prayerTimes.iqama?.fajr,
      key: 'fajr'
    },
    {
      name: 'Sunrise',
      time: prayerTimes.sunrise,
      key: 'sunrise',
      isShurooq: true
    },
    {
      name: 'Dhuhr',
      time: prayerTimes.dhuhr,
      iqama: prayerTimes.iqama?.dhuhr,
      key: 'dhuhr'
    },
    {
      name: 'Asr',
      time: prayerTimes.asr,
      iqama: prayerTimes.iqama?.asr,
      key: 'asr'
    },
    {
      name: 'Maghrib',
      time: prayerTimes.maghrib,
      iqama: prayerTimes.iqama?.maghrib,
      key: 'maghrib'
    },
    {
      name: 'Isha',
      time: prayerTimes.isha,
      iqama: prayerTimes.iqama?.isha,
      key: 'isha'
    },
  ];

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (compact) {
    return (
      <Card className={cn('', className)}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-islamic-green-700">
              Today&apos;s Prayer Times
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {prayers.filter(prayer => !prayer.isShurooq).map((prayer) => (
              <div
                key={prayer.key}
                className={cn(
                  'flex justify-between rounded-md p-2',
                  currentPrayer === prayer.key
                    ? 'bg-islamic-green-100 text-islamic-green-800'
                    : 'bg-gray-50'
                )}
              >
                <span className="font-medium">{prayer.name}</span>
                <span className="prayer-time font-bold">{prayer.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      g
        ? 'bg-white/10 backdrop-blur-xl border-white/30 shadow-2xl'
        : 'bg-gradient-to-br from-white via-islamic-green-50/30 to-islamic-gold-50/20 shadow-lg border border-islamic-green/10',
      className
    )}>
      <CardHeader className="px-3 pt-3 pb-2">
        <CardTitle className={cn(
          'flex items-center justify-between text-sm font-bold',
          g ? 'text-white' : 'text-islamic-green-700'
        )}>
          <span>Today&apos;s Prayer Times</span>
          <Badge className={cn(
            'text-[10px] px-1.5 py-0',
            g
              ? 'bg-white/15 text-white/90 border-white/25 hover:bg-white/20'
              : 'bg-islamic-green-100 text-islamic-green-700 border-islamic-green-200 hover:bg-islamic-green-200'
          )}>
            Live
          </Badge>
        </CardTitle>
        {!g && (
          <div className="flex flex-col gap-0.5 text-xs mt-1 text-islamic-navy-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              <span className="font-medium">{formatDate(prayerTimes.date)}</span>
            </div>
            {hijriDate.en && (
              <div className="flex items-center gap-1.5 ml-[18px]">
                <span className="text-[10px] font-medium text-islamic-green-600">{hijriDate.en}</span>
                <div className="w-1 h-1 rounded-full bg-islamic-gold-400"></div>
                <span className="text-[10px] opacity-75" dir="rtl">{hijriDate.ar}</span>
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-1 px-3 pt-0 pb-3">
        {/* Prayer times grid */}
        <div className="space-y-0.5">
          {prayers.map((prayer, index) => (
            <div key={prayer.key}>
              <div
                className={cn(
                  'flex items-center justify-between rounded-lg px-2 py-1.5 border',
                  prayer.isShurooq
                    ? g
                      ? 'bg-amber-500/15 border-amber-400/25'
                      : 'bg-gradient-to-r from-orange-50 to-orange-100/50 border-orange-200'
                    : currentPrayer === prayer.key
                    ? g
                      ? 'bg-white/15 border-white/30'
                      : 'bg-gradient-to-r from-islamic-green-100 to-islamic-green-200/50 border-islamic-green-300 shadow-sm shadow-islamic-green/10'
                    : g
                      ? 'bg-white/5 border-white/10'
                      : 'bg-gradient-to-r from-white to-islamic-navy-50/30 border-gray-200'
                )}
              >
                {/* Prayer name and status */}
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'w-1.5 h-5 rounded-full',
                    prayer.isShurooq
                      ? 'bg-orange-400'
                      : currentPrayer === prayer.key
                      ? g ? 'bg-emerald-400' : 'bg-islamic-green-500'
                      : g ? 'bg-white/30' : 'bg-islamic-navy-300'
                  )}></div>
                  <div>
                    <span
                      className={cn(
                        'font-bold text-xs',
                        prayer.isShurooq
                          ? g ? 'text-amber-300' : 'text-orange-700'
                          : currentPrayer === prayer.key
                          ? g ? 'text-white' : 'text-islamic-green-800'
                          : g ? 'text-white/90' : 'text-islamic-navy-700'
                      )}
                    >
                      {prayer.name}
                    </span>
                    {prayer.isShurooq && (
                      <Badge variant="outline" className={cn(
                        'ml-1.5 text-[9px] px-1 py-0',
                        g
                          ? 'border-amber-400/40 text-amber-300 bg-amber-500/10'
                          : 'border-orange-300 text-orange-700 bg-orange-50'
                      )}>
                        Shurooq
                      </Badge>
                    )}
                    {currentPrayer === prayer.key && !prayer.isShurooq && (
                      <Badge className={cn(
                        'ml-1.5 text-[9px] px-1 py-0',
                        g ? 'bg-emerald-500/80' : 'bg-islamic-green-600'
                      )}>
                        Current
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Prayer times */}
                <div className="text-right space-y-0">
                  <div className="flex items-center gap-1.5">
                    <span className={cn('text-[10px]', g ? 'text-white/40' : 'text-gray-400')}>Adhan</span>
                    <span
                      className={cn(
                        'prayer-time text-sm font-bold font-mono',
                        prayer.isShurooq
                          ? g ? 'text-amber-300' : 'text-orange-700'
                          : currentPrayer === prayer.key
                          ? g ? 'text-white' : 'text-islamic-green-700'
                          : g ? 'text-white/90' : 'text-islamic-navy-700'
                      )}
                    >
                      {prayer.time}
                    </span>
                  </div>
                  {prayer.iqama && (
                    <div className="flex items-center gap-1.5">
                      <span className={cn('text-[10px]', g ? 'text-emerald-400/70' : 'text-islamic-green-600')}>Iqama</span>
                      <span
                        className={cn(
                          'prayer-time text-xs font-bold font-mono',
                          g ? 'text-emerald-300' : currentPrayer === prayer.key
                            ? 'text-islamic-green-600'
                            : 'text-islamic-green-700'
                        )}
                      >
                        {prayer.iqama}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {index < prayers.length - 1 && (
                <div className={cn(
                  'h-px bg-gradient-to-r from-transparent to-transparent',
                  g ? 'via-white/10' : 'via-islamic-navy-200/30'
                )}></div>
              )}
            </div>
          ))}
        </div>

        {/* Jummah Prayer Times */}
        {prayerTimes.jummah && prayerTimes.jummah.length > 0 && (
          <>
            <div className={cn(
              'h-px bg-gradient-to-r from-transparent to-transparent',
              g ? 'via-white/20' : 'via-islamic-gold-300/50'
            )}></div>
            <div className={cn(
              'rounded-lg px-2 py-2 border',
              g
                ? 'bg-amber-500/10 border-amber-400/20'
                : 'bg-gradient-to-r from-islamic-gold-50 via-islamic-gold-100/50 to-islamic-gold-50 border-islamic-gold-300'
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 rounded-full bg-islamic-gold-500"></div>
                  <div>
                    <span className={cn('font-bold text-xs', g ? 'text-amber-200' : 'text-islamic-gold-800')}>
                      Jumu&apos;ah Prayer
                    </span>
                    <div className={cn('text-[9px] opacity-75', g ? 'text-amber-300/60' : 'text-islamic-gold-600')}>صلاة الجمعة</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {prayerTimes.jummah.map((time, index) => (
                    <div key={index} className="text-center">
                      <div className={cn('text-[9px]', g ? 'text-amber-300/60' : 'text-islamic-gold-600')}>
                        {index === 0 ? '1st' : '2nd'} Khutbah
                      </div>
                      <span className={cn('prayer-time text-sm font-bold font-mono block', g ? 'text-amber-200' : 'text-islamic-gold-700')}>
                        {time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

      </CardContent>
    </Card>
  );
}
