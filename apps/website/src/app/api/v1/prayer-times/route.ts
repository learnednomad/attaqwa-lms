import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Prayer Times API v1
 * GET /api/v1/prayer-times
 *
 * Fetches real prayer times from the Aladhan API.
 * Default location: Masjid At-Taqwa, Doraville, GA
 *
 * Query params:
 *   - latitude (default: 33.9114)
 *   - longitude (default: -84.2614)
 *   - date (YYYY-MM-DD, default: today)
 *   - method (1-15, default: 2 = ISNA)
 *   - range ('day' | 'week' | 'month', default: 'day')
 */

const DEFAULT_LAT = 33.9114;
const DEFAULT_LNG = -84.2614;
const DEFAULT_METHOD = 2; // ISNA

// Default iqamah times (fallback if config file is missing)
const DEFAULT_IQAMAH: IqamahConfig = {
  fajr: '6:45 AM',
  dhuhr: '1:15 PM',
  asr: '4:15 PM',
  maghrib: '+5', // 5 minutes after adhan
  isha: '7:45 PM',
  updatedAt: null,
};

interface IqamahConfig {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  updatedAt: string | null;
}

interface TarawihConfig {
  enabled: boolean;
  time: string;
  updatedAt: string | null;
}

const DEFAULT_TARAWIH: TarawihConfig = {
  enabled: false,
  time: '9:00 PM',
  updatedAt: null,
};

const IQAMAH_CONFIG_PATH = path.join(process.cwd(), 'src/data/iqamah-times.json');
const TARAWIH_CONFIG_PATH = path.join(process.cwd(), 'src/data/tarawih-config.json');

async function getIqamahTimes(): Promise<IqamahConfig> {
  try {
    const data = await fs.readFile(IQAMAH_CONFIG_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return DEFAULT_IQAMAH;
  }
}

async function getTarawihConfig(): Promise<TarawihConfig> {
  try {
    const data = await fs.readFile(TARAWIH_CONFIG_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return DEFAULT_TARAWIH;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isRamadan(data: any): boolean {
  return data?.date?.hijri?.month?.number === 9;
}

function resolveIqamahTime(iqamahValue: string, adhanTime: string): string {
  // If iqamah is a relative offset like "+5" or "+10", add minutes to adhan time
  if (iqamahValue.startsWith('+')) {
    const offsetMinutes = parseInt(iqamahValue.slice(1), 10);
    if (isNaN(offsetMinutes)) return iqamahValue;

    // Parse adhan time (24h format "HH:MM" or 12h format "H:MM AM/PM")
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

    // Format back to 12h
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  return iqamahValue;
}

function buildIqamaObject(iqamahConfig: IqamahConfig, timings: Record<string, string>) {
  return {
    fajr: resolveIqamahTime(iqamahConfig.fajr, timings.fajr),
    dhuhr: resolveIqamahTime(iqamahConfig.dhuhr, timings.dhuhr),
    asr: resolveIqamahTime(iqamahConfig.asr, timings.asr),
    maghrib: resolveIqamahTime(iqamahConfig.maghrib, timings.maghrib),
    isha: resolveIqamahTime(iqamahConfig.isha, timings.isha),
  };
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
  // Convert YYYY-MM-DD to DD-MM-YYYY
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
}

function transformTimings(timings: Record<string, string>) {
  // Aladhan returns times like "06:18 (EST)" — strip timezone suffix
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
  const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1 hour
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
  const res = await fetch(url, { next: { revalidate: 86400 } }); // cache 24 hours
  if (!res.ok) throw new Error(`Aladhan calendar API error: ${res.status}`);
  const json = await res.json();
  return json.data; // array of day objects
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateParam =
      searchParams.get('date') || new Date().toISOString().split('T')[0];
    const lat = parseFloat(
      searchParams.get('latitude') || String(DEFAULT_LAT)
    );
    const lng = parseFloat(
      searchParams.get('longitude') || String(DEFAULT_LNG)
    );
    const method = parseInt(
      searchParams.get('method') || String(DEFAULT_METHOD),
      10
    );
    const range = searchParams.get('range') || 'day';

    const qibla = calculateQibla(lat, lng);
    const iqamahConfig = await getIqamahTimes();
    const tarawihConfig = await getTarawihConfig();

    if (range === 'week') {
      // Fetch 7 days starting from the given date
      const startDate = new Date(dateParam);
      const days = [];

      for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        const data = await fetchDayFromAladhan(dateStr, lat, lng, method);
        const timings = transformTimings(data.timings);
        const dayEntry: Record<string, unknown> = {
          date: dateStr,
          prayerTimes: timings,
          iqama: buildIqamaObject(iqamahConfig, timings),
        };
        if (tarawihConfig.enabled || isRamadan(data)) {
          dayEntry.tarawih = resolveIqamahTime(tarawihConfig.time, timings.isha);
        }
        days.push(dayEntry);
      }

      return NextResponse.json({ data: days, qibla });
    }

    if (range === 'month') {
      const [year, month] = dateParam.split('-').map(Number);
      const monthData = await fetchMonthFromAladhan(
        year,
        month,
        lat,
        lng,
        method
      );

      const days = monthData.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (day: any) => {
          const timings = transformTimings(day.timings);
          const dayEntry: Record<string, unknown> = {
            date: day.date.gregorian.date
              .split('-')
              .reverse()
              .join('-'), // DD-MM-YYYY → YYYY-MM-DD
            prayerTimes: timings,
            iqama: buildIqamaObject(iqamahConfig, timings),
          };
          if (tarawihConfig.enabled || isRamadan(day)) {
            dayEntry.tarawih = resolveIqamahTime(tarawihConfig.time, timings.isha);
          }
          return dayEntry;
        }
      );

      return NextResponse.json({ data: days, qibla });
    }

    // Single day (default)
    const data = await fetchDayFromAladhan(dateParam, lat, lng, method);
    const timings = transformTimings(data.timings);
    const prayerTimes: Record<string, unknown> = {
      date: dateParam,
      ...timings,
      qibla,
      iqama: buildIqamaObject(iqamahConfig, timings),
    };

    if (tarawihConfig.enabled || isRamadan(data)) {
      prayerTimes.tarawih = resolveIqamahTime(tarawihConfig.time, timings.isha);
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
