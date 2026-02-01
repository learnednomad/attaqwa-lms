"use client";

import { useState, useEffect } from 'react';
import { Clock, MapPin } from 'lucide-react';
import { DailyPrayerTimes } from '@/types';
import { cn } from '@/lib/utils';

interface PrayerTimesWidgetProps {
  prayerTimes: DailyPrayerTimes;
  className?: string;
  compact?: boolean;
  currentPrayer?: string;
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
}: PrayerTimesWidgetProps) {
  const [detectedPrayer, setDetectedPrayer] = useState('');
  const [hijriDate, setHijriDate] = useState({ en: '', ar: '' });

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
    { name: 'Fajr', time: prayerTimes.fajr, iqama: prayerTimes.iqama?.fajr, key: 'fajr' },
    { name: 'Sunrise', time: prayerTimes.sunrise, key: 'sunrise', isShurooq: true },
    { name: 'Dhuhr', time: prayerTimes.dhuhr, iqama: prayerTimes.iqama?.dhuhr, key: 'dhuhr' },
    { name: 'Asr', time: prayerTimes.asr, iqama: prayerTimes.iqama?.asr, key: 'asr' },
    { name: 'Maghrib', time: prayerTimes.maghrib, iqama: prayerTimes.iqama?.maghrib, key: 'maghrib' },
    { name: 'Isha', time: prayerTimes.isha, iqama: prayerTimes.iqama?.isha, key: 'isha' },
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
      <div className={cn('rounded-xl border border-neutral-200 bg-white p-5', className)}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-neutral-900">Today&apos;s Prayer Times</h3>
          <Clock className="h-4 w-4 text-neutral-400" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {prayers.filter(prayer => !prayer.isShurooq).map((prayer) => (
            <div
              key={prayer.key}
              className={cn(
                'flex justify-between rounded-lg px-3 py-2 text-xs',
                currentPrayer === prayer.key
                  ? 'bg-emerald-50 border border-emerald-200'
                  : 'bg-neutral-50 border border-neutral-100'
              )}
            >
              <span className={cn(
                'font-medium',
                currentPrayer === prayer.key ? 'text-emerald-700' : 'text-neutral-700'
              )}>{prayer.name}</span>
              <span className={cn(
                'font-bold font-mono',
                currentPrayer === prayer.key ? 'text-emerald-700' : 'text-neutral-900'
              )}>{prayer.time}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl border border-neutral-200 bg-white', className)}>
      {/* Header */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900">Today&apos;s Prayer Times</h3>
          <span className="text-[10px] font-medium text-emerald-600 border border-emerald-200 bg-emerald-50 rounded-full px-2 py-0.5">
            Live
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-neutral-400">
          <MapPin className="h-3 w-3" />
          <span>{formatDate(prayerTimes.date)}</span>
          {hijriDate.en && (
            <>
              <span>&middot;</span>
              <span className="text-emerald-600">{hijriDate.en}</span>
            </>
          )}
        </div>
      </div>

      {/* Prayer rows */}
      <div className="px-3 pb-3 space-y-1">
        {prayers.map((prayer) => (
          <div
            key={prayer.key}
            className={cn(
              'flex items-center justify-between rounded-lg px-3 py-2 border',
              prayer.isShurooq
                ? 'bg-amber-50/50 border-amber-200'
                : currentPrayer === prayer.key
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-neutral-50/30 border-neutral-100'
            )}
          >
            {/* Name */}
            <div className="flex items-center gap-2">
              <div className={cn(
                'w-1.5 h-5 rounded-full',
                prayer.isShurooq
                  ? 'bg-amber-400'
                  : currentPrayer === prayer.key
                  ? 'bg-emerald-500'
                  : 'bg-neutral-300'
              )} />
              <span className={cn(
                'text-[15px] font-bold',
                prayer.isShurooq ? 'text-amber-700' : currentPrayer === prayer.key ? 'text-emerald-700' : 'text-neutral-800'
              )}>
                {prayer.name}
              </span>
              {prayer.isShurooq && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border border-amber-200 text-amber-500 bg-amber-50">Shurooq</span>
              )}
              {currentPrayer === prayer.key && !prayer.isShurooq && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-600 text-white">Current</span>
              )}
            </div>

            {/* Times */}
            <div className="text-right">
              <div className="flex items-baseline gap-1.5 justify-end">
                <span className="text-[11px] text-neutral-400">Adhan</span>
                <span className={cn(
                  'text-[15px] font-bold font-mono',
                  prayer.isShurooq ? 'text-amber-700' : currentPrayer === prayer.key ? 'text-emerald-700' : 'text-neutral-900'
                )}>
                  {prayer.time}
                </span>
              </div>
              {prayer.iqama && (
                <div className="flex items-baseline gap-1.5 justify-end -mt-0.5">
                  <span className="text-[11px] text-emerald-500">Iqama</span>
                  <span className="text-[15px] font-bold font-mono text-emerald-600">
                    {prayer.iqama}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Jummah */}
        {prayerTimes.jummah && prayerTimes.jummah.length > 0 && (
          <div className="rounded-lg px-3 py-2 border border-amber-200 bg-amber-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 rounded-full bg-amber-500" />
                <div>
                  <span className="text-[15px] font-bold text-amber-800">Jumu&apos;ah Prayer</span>
                  <div className="text-[10px] text-amber-500 -mt-0.5">&#1589;&#1604;&#1575;&#1577; &#1575;&#1604;&#1580;&#1605;&#1593;&#1577;</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {prayerTimes.jummah.map((time, index) => (
                  <div key={index} className="text-center">
                    <div className="text-[10px] text-amber-500">{index === 0 ? '1st' : '2nd'} Khutbah</div>
                    <span className="text-[15px] font-bold font-mono text-amber-700 block -mt-0.5">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
