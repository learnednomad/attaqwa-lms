import { useQuery } from '@tanstack/react-query';
import type { DailyPrayerTimes } from '@/types';

const API_BASE = '/api/v1/prayer-times';

// Default: Masjid At-Taqwa, Doraville, GA
const DEFAULT_LAT = 33.9114;
const DEFAULT_LNG = -84.2614;

export function usePrayerTimes(latitude?: number, longitude?: number) {
  const lat = latitude || DEFAULT_LAT;
  const lng = longitude || DEFAULT_LNG;

  return useQuery<DailyPrayerTimes>({
    queryKey: ['prayer-times', lat, lng],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE}?latitude=${lat}&longitude=${lng}`
      );
      if (!response.ok) throw new Error('Failed to fetch prayer times');
      const result = await response.json();
      return result.prayerTimes;
    },
  });
}

// Hook for today's prayer times
export function useTodayPrayerTimes(latitude?: number, longitude?: number) {
  const lat = latitude || DEFAULT_LAT;
  const lng = longitude || DEFAULT_LNG;

  return useQuery<DailyPrayerTimes>({
    queryKey: ['prayer-times-today', lat, lng],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(
        `${API_BASE}?latitude=${lat}&longitude=${lng}&date=${today}`
      );
      if (!response.ok) throw new Error("Failed to fetch today's prayer times");
      const result = await response.json();
      return result.prayerTimes;
    },
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
  });
}

interface WeekDayData {
  date: string;
  prayerTimes: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
}

// Hook for week's prayer times (single API call)
export function useWeekPrayerTimes(latitude?: number, longitude?: number) {
  const lat = latitude || DEFAULT_LAT;
  const lng = longitude || DEFAULT_LNG;

  return useQuery<WeekDayData[]>({
    queryKey: ['prayer-times-week', lat, lng],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(
        `${API_BASE}?latitude=${lat}&longitude=${lng}&date=${today}&range=week`
      );
      if (!response.ok) throw new Error("Failed to fetch week's prayer times");
      const result = await response.json();
      return result.data;
    },
    refetchInterval: 1000 * 60 * 60 * 24, // Refetch daily
  });
}

// Hook for month's prayer times (single API call via Aladhan calendar endpoint)
export function useMonthPrayerTimes(latitude?: number, longitude?: number) {
  const lat = latitude || DEFAULT_LAT;
  const lng = longitude || DEFAULT_LNG;

  return useQuery<WeekDayData[]>({
    queryKey: ['prayer-times-month', lat, lng],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(
        `${API_BASE}?latitude=${lat}&longitude=${lng}&date=${today}&range=month`
      );
      if (!response.ok)
        throw new Error("Failed to fetch month's prayer times");
      const result = await response.json();
      return result.data;
    },
    refetchInterval: 1000 * 60 * 60 * 24, // Refetch daily
  });
}
