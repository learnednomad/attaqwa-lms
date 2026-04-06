import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const prayerTimesQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format').optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  method: z.coerce.number().int().min(1).max(15).optional(),
  range: z.enum(['day', 'week', 'month']).optional(),
});

/**
 * Prayer Times API v1
 * GET /api/v1/prayer-times
 *
 * Fetches adhan times from Aladhan API.
 * Fetches iqamah times from Strapi iqamah-schedule content type.
 * Default location: Masjid At-Taqwa, Doraville, GA
 *
 * Query params:
 *   - latitude (default: 33.9114)
 *   - longitude (default: -84.2614)
 *   - date (YYYY-MM-DD, default: today)
 *   - method (1-15, default: 3 = MWL, matching mosque's existing configuration)
 *   - range ('day' | 'week' | 'month', default: 'day')
 */

const DEFAULT_LAT = 33.9114;
const DEFAULT_LNG = -84.2614;
const DEFAULT_METHOD = 3; // Muslim World League - matches mosque's WordPress config

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

// Fallback iqamah times if Strapi is unavailable
// Fallback values must match src/data/iqamah-times.json
const FALLBACK_IQAMAH = {
  fajr: '6:45 AM',
  dhuhr: '1:15 PM',
  asr: '4:15 PM',
  maghrib: '+5',
  isha: '8:45 PM',
  jumuah1: '1:00 PM',
  jumuah2: '2:00 PM',
};

interface IqamahSchedule {
  month: number;
  dayRangeStart: number;
  dayRangeEnd: number;
  isDst: boolean;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jumuah1: string | null;
  jumuah2: string | null;
  isActive: boolean;
}

// Cache iqamah schedules for 1 hour
let iqamahCache: { data: IqamahSchedule[]; fetchedAt: number } | null = null;
const IQAMAH_CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function fetchIqamahSchedules(): Promise<IqamahSchedule[]> {
  if (iqamahCache && Date.now() - iqamahCache.fetchedAt < IQAMAH_CACHE_TTL) {
    return iqamahCache.data;
  }

  try {
    const res = await fetch(
      `${STRAPI_URL}/api/v1/iqamah-schedules?pagination[pageSize]=100&filters[isActive][$eq]=true`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
    const json = await res.json();
    const schedules: IqamahSchedule[] = (json.data || []).map((item: { id?: number; attributes?: IqamahSchedule } & IqamahSchedule) => {
      // Strapi v5 returns flat data, v4 wraps in attributes
      const attrs = item.attributes || item;
      return {
        month: attrs.month,
        dayRangeStart: attrs.dayRangeStart,
        dayRangeEnd: attrs.dayRangeEnd,
        isDst: attrs.isDst,
        fajr: attrs.fajr,
        dhuhr: attrs.dhuhr,
        asr: attrs.asr,
        maghrib: attrs.maghrib,
        isha: attrs.isha,
        jumuah1: attrs.jumuah1,
        jumuah2: attrs.jumuah2,
        isActive: attrs.isActive,
      };
    });
    iqamahCache = { data: schedules, fetchedAt: Date.now() };
    return schedules;
  } catch (error) {
    console.warn('Failed to fetch iqamah schedules from Strapi, using fallback:', error);
    return [];
  }
}

function isDST(date: Date): boolean {
  const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
  const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  return date.getTimezoneOffset() < Math.max(jan, jul);
}

function getIqamahForDate(schedules: IqamahSchedule[], dateStr: string) {
  const date = new Date(dateStr + 'T12:00:00');
  const month = date.getMonth() + 1; // 1-indexed
  const day = date.getDate();
  const dst = isDST(date);

  // Find matching schedule: correct month, day in range, matching DST
  // For months with DST variants (March, November), prefer the matching DST entry
  const candidates = schedules.filter(
    s => s.month === month && day >= s.dayRangeStart && day <= s.dayRangeEnd
  );

  // Try to find exact DST match first
  let match = candidates.find(s => s.isDst === dst);
  // Fall back to any match for this month/day
  if (!match) match = candidates[0];

  if (match) {
    return {
      fajr: match.fajr,
      dhuhr: match.dhuhr,
      asr: match.asr,
      maghrib: match.maghrib,
      isha: match.isha,
      jumuah1: match.jumuah1,
      jumuah2: match.jumuah2,
    };
  }

  return FALLBACK_IQAMAH;
}

function resolveIqamahTime(iqamahValue: string, adhanTime: string): string {
  if (iqamahValue.startsWith('+')) {
    const offsetMinutes = parseInt(iqamahValue.slice(1), 10);
    if (isNaN(offsetMinutes)) return iqamahValue;

    let hours: number, minutes: number;
    const match12 = adhanTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    const match24 = adhanTime.match(/^(\d{1,2}):(\d{2})$/);

    if (match12) {
      hours = parseInt(match12[1], 10);
      minutes = parseInt(match12[2], 10);
      const period = match12[3].toUpperCase();
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
    } else if (match24) {
      hours = parseInt(match24[1], 10);
      minutes = parseInt(match24[2], 10);
    } else {
      return iqamahValue;
    }

    minutes += offsetMinutes;
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;
    hours = hours % 24;

    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  return iqamahValue;
}

// Kaaba coordinates for Qibla calculation
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function calculateQibla(lat: number, lng: number): number {
  const phiK = (KAABA_LAT * Math.PI) / 180;
  const lambdaK = (KAABA_LNG * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const lambda = (lng * Math.PI) / 180;
  const psi =
    (180 / Math.PI) *
    Math.atan2(
      Math.sin(lambdaK - lambda),
      Math.cos(phi) * Math.tan(phiK) -
        Math.sin(phi) * Math.cos(lambdaK - lambda)
    );
  return Math.round(psi < 0 ? psi + 360 : psi);
}

function formatDateForAladhan(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
}

function transformTimings(timings: Record<string, string>) {
  const clean = (t: string) => t.replace(/\s*\(.*\)$/, '');
  return {
    fajr: clean(timings.Fajr),
    sunrise: clean(timings.Sunrise),
    dhuhr: clean(timings.Dhuhr),
    asr: clean(timings.Asr),
    maghrib: clean(timings.Maghrib),
    isha: clean(timings.Isha),
  };
}

async function fetchDayFromAladhan(
  date: string,
  lat: number,
  lng: number,
  method: number
) {
  const aladhanDate = formatDateForAladhan(date);
  const url = `https://api.aladhan.com/v1/timings/${aladhanDate}?latitude=${lat}&longitude=${lng}&method=${method}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Aladhan API error: ${res.status}`);
  const json = await res.json();
  return json.data;
}

async function fetchMonthFromAladhan(
  year: number,
  month: number,
  lat: number,
  lng: number,
  method: number
) {
  const url = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${lat}&longitude=${lng}&method=${method}`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`Aladhan calendar API error: ${res.status}`);
  const json = await res.json();
  return json.data;
}

function buildIqamaObject(iqamah: ReturnType<typeof getIqamahForDate>, timings: Record<string, string>) {
  return {
    fajr: resolveIqamahTime(iqamah.fajr, timings.fajr),
    dhuhr: resolveIqamahTime(iqamah.dhuhr, timings.dhuhr),
    asr: resolveIqamahTime(iqamah.asr, timings.asr),
    maghrib: resolveIqamahTime(iqamah.maghrib, timings.maghrib),
    isha: resolveIqamahTime(iqamah.isha, timings.isha),
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const rawParams: Record<string, string> = {};
    for (const key of ['date', 'latitude', 'longitude', 'method', 'range']) {
      const val = searchParams.get(key);
      if (val !== null) rawParams[key] = val;
    }
    const validation = prayerTimesQuerySchema.safeParse(rawParams);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: {
            status: 400,
            name: 'ValidationError',
            message: 'Invalid query parameters',
            details: validation.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const validated = validation.data;
    const dateParam = validated.date || new Date().toISOString().split('T')[0];
    const lat = validated.latitude ?? DEFAULT_LAT;
    const lng = validated.longitude ?? DEFAULT_LNG;
    const method = validated.method ?? DEFAULT_METHOD;
    const range = validated.range || 'day';

    const qibla = calculateQibla(lat, lng);
    const iqamahSchedules = await fetchIqamahSchedules();

    if (range === 'week') {
      const startDate = new Date(dateParam);
      const days = [];

      for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        const data = await fetchDayFromAladhan(dateStr, lat, lng, method);
        const timings = transformTimings(data.timings);
        const iqamah = getIqamahForDate(iqamahSchedules, dateStr);
        const dayEntry: Record<string, unknown> = {
          date: dateStr,
          prayerTimes: timings,
          iqama: buildIqamaObject(iqamah, timings),
        };
        days.push(dayEntry);
      }

      return NextResponse.json({ data: days, qibla });
    }

    if (range === 'month') {
      const [year, month] = dateParam.split('-').map(Number);
      const monthData = await fetchMonthFromAladhan(year, month, lat, lng, method);

      const days = monthData.map(
        (day: { timings: Record<string, string>; date: { gregorian: { date: string } } }) => {
          const timings = transformTimings(day.timings);
          const dateStr = day.date.gregorian.date.split('-').reverse().join('-');
          const iqamah = getIqamahForDate(iqamahSchedules, dateStr);
          const dayEntry: Record<string, unknown> = {
            date: dateStr,
            prayerTimes: timings,
            iqama: buildIqamaObject(iqamah, timings),
          };
          return dayEntry;
        }
      );

      return NextResponse.json({ data: days, qibla });
    }

    // Single day (default)
    const data = await fetchDayFromAladhan(dateParam, lat, lng, method);
    const timings = transformTimings(data.timings);
    const iqamah = getIqamahForDate(iqamahSchedules, dateParam);
    const prayerTimes: Record<string, unknown> = {
      date: dateParam,
      ...timings,
      qibla,
      iqama: buildIqamaObject(iqamah, timings),
    };

    // Add jummah times if available
    if (iqamah.jumuah1) {
      const jummahTimes = [iqamah.jumuah1];
      if (iqamah.jumuah2) jummahTimes.push(iqamah.jumuah2);
      prayerTimes.jummah = jummahTimes;
    }

    return NextResponse.json({ prayerTimes });
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'ServerError',
          message: 'Failed to fetch prayer times',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
