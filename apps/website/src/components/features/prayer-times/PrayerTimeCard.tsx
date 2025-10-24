'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PrayerTimes {
  fajr: string;
  sunrise?: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  qibla?: number;
}

interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
}

interface PrayerTimeCardProps {
  prayerTimes: PrayerTimes;
  showNextPrayer?: boolean;
  variant?: 'default' | 'compact' | 'premium';
  showArabic?: boolean;
  timeFormat?: '12h' | '24h';
  location?: string;
  method?: string;
  showCountdown?: boolean;
  animated?: boolean;
  className?: string;
}

export function PrayerTimeCard({
  prayerTimes,
  showNextPrayer = false,
  variant = 'default',
  showArabic = false,
  timeFormat = '12h',
  location = 'New York, US',
  method = 'ISNA',
  showCountdown = true,
  animated = true,
  className,
}: PrayerTimeCardProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [nextPrayerCountdown, setNextPrayerCountdown] = useState<CountdownTime>({ hours: 0, minutes: 0, seconds: 0 });
  const prayers = [
    { name: 'Fajr', time: prayerTimes.fajr, arabic: 'الفجر', icon: '🌅' },
    ...(prayerTimes.sunrise ? [{ name: 'Sunrise', time: prayerTimes.sunrise, arabic: 'الشروق', icon: '☀️' }] : []),
    { name: 'Dhuhr', time: prayerTimes.dhuhr, arabic: 'الظهر', icon: '🌞' },
    { name: 'Asr', time: prayerTimes.asr, arabic: 'العصر', icon: '🌇' },
    { name: 'Maghrib', time: prayerTimes.maghrib, arabic: 'المغرب', icon: '🌆' },
    { name: 'Isha', time: prayerTimes.isha, arabic: 'العشاء', icon: '🌙' },
  ];

  // Initialize current time on client side to prevent hydration mismatch
  useEffect(() => {
    setCurrentTime(new Date());
  }, []);

  // Update current time every second
  useEffect(() => {
    if (!showCountdown || !currentTime) return;
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [showCountdown, currentTime]);

  // Calculate countdown to next prayer
  useEffect(() => {
    if (!showCountdown || !currentTime) return;

    const calculateCountdown = () => {
      const now = currentTime;
      const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      // Find next prayer
      let nextPrayerTime = '';
      for (const prayer of prayers) {
        if (prayer.time > currentTimeStr) {
          nextPrayerTime = prayer.time;
          break;
        }
      }
      
      // If no prayer found today, next prayer is Fajr tomorrow
      if (!nextPrayerTime) {
        nextPrayerTime = prayers[0].time;
      }
      
      // Calculate time difference
      const [hours, minutes] = nextPrayerTime.split(':').map(Number);
      const nextPrayerDate = new Date();
      nextPrayerDate.setHours(hours, minutes, 0, 0);
      
      // If prayer is tomorrow
      if (nextPrayerDate <= now) {
        nextPrayerDate.setDate(nextPrayerDate.getDate() + 1);
      }
      
      const diff = nextPrayerDate.getTime() - now.getTime();
      const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);
      
      setNextPrayerCountdown({ 
        hours: hoursLeft, 
        minutes: minutesLeft, 
        seconds: secondsLeft 
      });
    };

    calculateCountdown();
  }, [currentTime, prayers, showCountdown]);

  const formatTime = (time: string) => {
    if (timeFormat === '12h') {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    }
    return time;
  };

  const getCurrentTime = () => {
    const now = currentTime || new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const getNextPrayer = () => {
    const currentTimeStr = getCurrentTime();
    for (const prayer of prayers) {
      if (prayer.time > currentTimeStr) {
        return prayer;
      }
    }
    return prayers[0]; // Next day's first prayer
  };

  const nextPrayer = getNextPrayer();
  const currentTimeStr = getCurrentTime();

  const getCardClassName = () => {
    const baseClasses = 'transition-all duration-300';
    
    switch (variant) {
      case 'premium':
        return cn('card-prayer-time', baseClasses, animated && 'fade-in', className);
      case 'compact':
        return cn('border border-border rounded-lg bg-card', baseClasses, className);
      default:
        return cn('card-premium', baseClasses, animated && 'slide-up', className);
    }
  };

  return (
    <Card 
      className={getCardClassName()}
      role="article"
      aria-label="Prayer times for today"
      tabIndex={0}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold" style={{ color: 'hsl(var(--islamic-green-700))' }}>
            🕌 Prayer Times
          </CardTitle>
          {variant === 'premium' && (
            <div className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200">
              Live
            </div>
          )}
        </div>
        {showCountdown && nextPrayer && (
          <div className="text-sm font-medium" style={{ color: 'hsl(var(--islamic-gold-700))' }}>
            Next: {showArabic ? nextPrayer.arabic : nextPrayer.name} in {nextPrayerCountdown.hours}h {nextPrayerCountdown.minutes}m {nextPrayerCountdown.seconds}s
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2">
          {prayers.map((prayer, index) => {
            const isNext = showNextPrayer && prayer.name === nextPrayer.name;
            const isPast = prayer.time < currentTimeStr;
            
            return (
              <div
                key={prayer.name}
                data-testid="prayer-time-item"
                className={cn(
                  'flex justify-between items-center p-3 rounded-lg transition-all duration-200',
                  'hover:bg-opacity-80',
                  isNext && [
                    'next-prayer-indicator',
                    variant === 'premium' ? 'prayer-glow pulse-prayer' : 'bg-gradient-to-r from-green-50 to-green-100',
                    'border border-green-200 shadow-sm'
                  ],
                  isPast && 'opacity-60',
                  !isNext && !isPast && 'hover:bg-gray-50'
                )}
                style={{
                  animationDelay: animated ? `${index * 100}ms` : '0ms'
                }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg" role="img" aria-hidden="true">
                    {prayer.icon}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {showArabic ? prayer.arabic : prayer.name}
                    </span>
                    {isNext && (
                      <span className="text-xs font-medium" style={{ color: 'hsl(var(--islamic-green-600))' }}>
                        Next Prayer
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={cn(
                    'prayer-time text-lg font-semibold',
                    isNext && 'text-green-700',
                    isPast && 'text-gray-500'
                  )}>
                    {formatTime(prayer.time)}
                  </div>
                  {isNext && showCountdown && (
                    <div className="text-xs text-green-600 font-medium mt-1">
                      {nextPrayerCountdown.hours > 0 && `${nextPrayerCountdown.hours}h `}
                      {nextPrayerCountdown.minutes}m {nextPrayerCountdown.seconds}s
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {variant === 'premium' && prayerTimes.qibla && (
          <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🧭</span>
                <span className="font-medium text-amber-800">Qibla Direction</span>
              </div>
              <span className="text-lg font-semibold text-amber-700">
                {prayerTimes.qibla}°
              </span>
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>📍 {location}</span>
              <span>📋 {method}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}