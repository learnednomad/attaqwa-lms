import { useQuery } from '@tanstack/react-query';

interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface UsePrayerTimesResult {
  data: PrayerTimes | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function usePrayerTimes(latitude?: number, longitude?: number): UsePrayerTimesResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ['prayer-times', latitude, longitude],
    queryFn: async () => {
      if (!latitude || !longitude) {
        throw new Error('Latitude and longitude are required');
      }
      
      const response = await fetch(`/api/prayer-times?latitude=${latitude}&longitude=${longitude}`);
      if (!response.ok) {
        throw new Error('Failed to fetch prayer times');
      }
      
      const result = await response.json();
      return result.prayerTimes;
    },
    enabled: !!(latitude && longitude),
  });

  return {
    data,
    isLoading,
    error,
  };
}

// Hook for today's prayer times
export function useTodayPrayerTimes(latitude?: number, longitude?: number): UsePrayerTimesResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ['prayer-times-today', latitude, longitude],
    queryFn: async () => {
      if (!latitude || !longitude) {
        throw new Error('Latitude and longitude are required');
      }
      
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/prayer-times?latitude=${latitude}&longitude=${longitude}&date=${today}`);
      if (!response.ok) {
        throw new Error('Failed to fetch today\'s prayer times');
      }
      
      const result = await response.json();
      return result.prayerTimes;
    },
    enabled: !!(latitude && longitude),
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
  });

  return {
    data,
    isLoading,
    error,
  };
}

// Hook for week's prayer times
export function useWeekPrayerTimes(latitude?: number, longitude?: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['prayer-times-week', latitude, longitude],
    queryFn: async () => {
      if (!latitude || !longitude) {
        throw new Error('Latitude and longitude are required');
      }
      
      const today = new Date();
      const weekData = [];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        const response = await fetch(`/api/prayer-times?latitude=${latitude}&longitude=${longitude}&date=${dateStr}`);
        if (response.ok) {
          const result = await response.json();
          weekData.push({
            date: dateStr,
            prayerTimes: result.prayerTimes,
          });
        }
      }
      
      return weekData;
    },
    enabled: !!(latitude && longitude),
    refetchInterval: 1000 * 60 * 60 * 24, // Refetch daily
  });

  return {
    data,
    isLoading,
    error,
  };
}

// Hook for month's prayer times
export function useMonthPrayerTimes(latitude?: number, longitude?: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['prayer-times-month', latitude, longitude],
    queryFn: async () => {
      if (!latitude || !longitude) {
        throw new Error('Latitude and longitude are required');
      }
      
      const today = new Date();
      const monthData = [];
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(today.getFullYear(), today.getMonth(), i);
        const dateStr = date.toISOString().split('T')[0];
        
        const response = await fetch(`/api/prayer-times?latitude=${latitude}&longitude=${longitude}&date=${dateStr}`);
        if (response.ok) {
          const result = await response.json();
          monthData.push({
            date: dateStr,
            prayerTimes: result.prayerTimes,
          });
        }
      }
      
      return monthData;
    },
    enabled: !!(latitude && longitude),
    refetchInterval: 1000 * 60 * 60 * 24, // Refetch daily
  });

  return {
    data,
    isLoading,
    error,
  };
}