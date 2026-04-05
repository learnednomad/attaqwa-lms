/**
 * Iqamah Schedule Seeder
 * Seeds iqamah times from the mosque's existing schedule (migrated from GitLab)
 *
 * USAGE:
 * 1. Start Strapi: npm run dev
 * 2. Run this script: npx tsx scripts/seed/seed-iqamah.ts
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';

interface IqamahEntry {
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

function parseJumuah(jumuahStr: string): { jumuah1: string | null; jumuah2: string | null } {
  if (!jumuahStr) return { jumuah1: null, jumuah2: null };
  // GitLab format uses <br><br> to separate two times
  const parts = jumuahStr.split(/<br\s*\/?>\s*<br\s*\/?>/i).map(s => s.trim()).filter(Boolean);
  return {
    jumuah1: parts[0] || null,
    jumuah2: parts[1] || null,
  };
}

function parseDayRange(dayRange: string): { start: number; end: number } {
  const [start, end] = dayRange.split('-').map(Number);
  return { start, end };
}

// Full yearly iqamah schedule - migrated from GitLab repository
// Source: gitlab.com project 47105733, iqaamah/*.json files
const IQAMAH_DATA: Record<string, { isDst: boolean; entries: Array<{ dayRange: string; Fajr: string; Dhuhr: string; Jumuah: string; Asr: string; Ishaa: string }> }> = {
  January: {
    isDst: false,
    entries: [
      { dayRange: "1-10", Fajr: "6:45 AM", Dhuhr: "1:00 PM", Jumuah: "1:15 PM<br><br>2:15 PM", Asr: "4:30 PM", Ishaa: "7:30 PM" },
      { dayRange: "11-19", Fajr: "6:45 AM", Dhuhr: "1:00 PM", Jumuah: "1:15 PM<br><br>2:15 PM", Asr: "4:30 PM", Ishaa: "7:45 PM" },
      { dayRange: "20-31", Fajr: "6:45 AM", Dhuhr: "1:00 PM", Jumuah: "1:15 PM<br><br>2:15 PM", Asr: "4:30 PM", Ishaa: "8:00 PM" },
    ],
  },
  February: {
    isDst: false,
    entries: [
      { dayRange: "1-10", Fajr: "6:35 AM", Dhuhr: "1:00 PM", Jumuah: "1:15 PM<br><br>2:15 PM", Asr: "4:45 PM", Ishaa: "8:00 PM" },
      { dayRange: "11-20", Fajr: "6:35 AM", Dhuhr: "1:00 PM", Jumuah: "1:15 PM<br><br>2:15 PM", Asr: "5:00 PM", Ishaa: "8:00 PM" },
      { dayRange: "21-31", Fajr: "6:35 AM", Dhuhr: "1:00 PM", Jumuah: "1:15 PM<br><br>2:15 PM", Asr: "5:00 PM", Ishaa: "8:15 PM" },
    ],
  },
  March: {
    isDst: false,
    entries: [
      { dayRange: "1-31", Fajr: "6:15 AM", Dhuhr: "1:00 PM", Jumuah: "1:15 PM<br><br>2:15 PM", Asr: "5:15 PM", Ishaa: "8:30 PM" },
    ],
  },
  MarchDST: {
    isDst: true,
    entries: [
      { dayRange: "1-20", Fajr: "6:45 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "6:15 PM", Ishaa: "9:15 PM" },
      { dayRange: "21-31", Fajr: "6:45 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "6:30 PM", Ishaa: "9:30 PM" },
    ],
  },
  April: {
    isDst: true,
    entries: [
      { dayRange: "1-10", Fajr: "6:30 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "6:30 PM", Ishaa: "9:30 PM" },
      { dayRange: "11-20", Fajr: "6:15 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "6:30 PM", Ishaa: "9:45 PM" },
      { dayRange: "21-31", Fajr: "6:15 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "6:45 PM", Ishaa: "10:00 PM" },
    ],
  },
  May: {
    isDst: true,
    entries: [
      { dayRange: "1-10", Fajr: "6:00 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "6:45 PM", Ishaa: "10:00 PM" },
      { dayRange: "11-28", Fajr: "5:45 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "6:45 PM", Ishaa: "10:15 PM" },
      { dayRange: "29-31", Fajr: "5:45 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "6:45 PM", Ishaa: "10:30 PM" },
    ],
  },
  June: {
    isDst: true,
    entries: [
      { dayRange: "1-10", Fajr: "05:30 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "7:00 PM", Ishaa: "10:30 PM" },
      { dayRange: "11-20", Fajr: "05:30 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "7:00 PM", Ishaa: "10:30 PM" },
      { dayRange: "21-31", Fajr: "05:30 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "7:00 PM", Ishaa: "10:30 PM" },
    ],
  },
  July: {
    isDst: true,
    entries: [
      { dayRange: "1-10", Fajr: "5:45 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "7:00 PM", Ishaa: "10:30 PM" },
      { dayRange: "11-20", Fajr: "5:45 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "7:00 PM", Ishaa: "10:30 PM" },
      { dayRange: "21-24", Fajr: "5:45 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "7:00 PM", Ishaa: "10:30 PM" },
      { dayRange: "25-31", Fajr: "6:00 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "6:45 PM", Ishaa: "10:15 PM" },
    ],
  },
  August: {
    isDst: true,
    entries: [
      { dayRange: "1-10", Fajr: "6:00 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "6:45 PM", Ishaa: "10:15 PM" },
      { dayRange: "11-20", Fajr: "6:15 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "6:30 PM", Ishaa: "10:00 PM" },
      { dayRange: "21-31", Fajr: "6:15 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "6:30 PM", Ishaa: "10:00 PM" },
    ],
  },
  September: {
    isDst: true,
    entries: [
      { dayRange: "1-10", Fajr: "6:30 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "6:15 PM", Ishaa: "9:45 PM" },
      { dayRange: "11-20", Fajr: "6:30 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "6:15 PM", Ishaa: "9:30 PM" },
      { dayRange: "21-27", Fajr: "6:30 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "6:00 PM", Ishaa: "9:15 PM" },
      { dayRange: "28-31", Fajr: "6:45 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "6:00 PM", Ishaa: "9:15 PM" },
    ],
  },
  October: {
    isDst: true,
    entries: [
      { dayRange: "1-10", Fajr: "6:45 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "5:45 PM", Ishaa: "9:00 PM" },
      { dayRange: "11-20", Fajr: "6:45 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "5:45 PM", Ishaa: "8:45 PM" },
      { dayRange: "21-31", Fajr: "7:00 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "5:30 PM", Ishaa: "8:30 PM" },
    ],
  },
  November: {
    isDst: true,
    entries: [
      { dayRange: "1-20", Fajr: "6:15 AM", Dhuhr: "1:00 PM", Jumuah: "1:15 PM<br><br>2:15 PM", Asr: "4:15 PM", Ishaa: "7:30 PM" },
      { dayRange: "21-30", Fajr: "6:30 AM", Dhuhr: "1:00 PM", Jumuah: "1:15 PM<br><br>2:15 PM", Asr: "4:15 PM", Ishaa: "7:30 PM" },
    ],
  },
  NovemberDST: {
    isDst: false,
    entries: [
      { dayRange: "1-31", Fajr: "7:00 AM", Dhuhr: "2:00 PM", Jumuah: "2:00 PM<br><br>2:30 PM", Asr: "5:30 PM", Ishaa: "8:30 PM" },
    ],
  },
  December: {
    isDst: false,
    entries: [
      { dayRange: "1-10", Fajr: "6:30 AM", Dhuhr: "1:00 PM", Jumuah: "1:20 PM<br><br>2:15 PM", Asr: "4:15 PM", Ishaa: "7:30 PM" },
      { dayRange: "11-20", Fajr: "6:30 AM", Dhuhr: "1:00 PM", Jumuah: "1:20 PM<br><br>2:15 PM", Asr: "4:15 PM", Ishaa: "7:30 PM" },
      { dayRange: "21-31", Fajr: "6:45 AM", Dhuhr: "1:00 PM", Jumuah: "1:20 PM<br><br>2:15 PM", Asr: "4:15 PM", Ishaa: "7:30 PM" },
    ],
  },
};

// Map month names to numbers
const MONTH_MAP: Record<string, number> = {
  January: 1, February: 2, March: 3, MarchDST: 3,
  April: 4, May: 5, June: 6, July: 7,
  August: 8, September: 9, October: 10,
  November: 11, NovemberDST: 11, December: 12,
};

function buildEntries(): IqamahEntry[] {
  const entries: IqamahEntry[] = [];

  for (const [monthName, data] of Object.entries(IQAMAH_DATA)) {
    const month = MONTH_MAP[monthName];
    for (const entry of data.entries) {
      const { start, end } = parseDayRange(entry.dayRange);
      const { jumuah1, jumuah2 } = parseJumuah(entry.Jumuah);
      entries.push({
        month,
        dayRangeStart: start,
        dayRangeEnd: end,
        isDst: data.isDst,
        fajr: entry.Fajr,
        dhuhr: entry.Dhuhr,
        asr: entry.Asr,
        maghrib: '+5',
        isha: entry.Ishaa,
        jumuah1,
        jumuah2,
        isActive: true,
      });
    }
  }

  return entries;
}

async function createEntry(entry: IqamahEntry): Promise<void> {
  const res = await fetch(`${STRAPI_URL}/api/v1/iqamah-schedules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
    },
    body: JSON.stringify({ data: entry }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create entry for month ${entry.month} (${entry.dayRangeStart}-${entry.dayRangeEnd}): ${err}`);
  }
}

async function main() {
  console.log('🕌 Seeding Iqamah Schedules for Masjid At-Taqwa...\n');

  // Test connection
  try {
    const health = await fetch(`${STRAPI_URL}/_health`);
    if (!health.ok) throw new Error();
  } catch {
    console.error('❌ Strapi is not running. Start it with: npm run dev');
    process.exit(1);
  }

  if (!API_TOKEN) {
    console.warn('⚠️  No STRAPI_API_TOKEN set. Using unauthenticated requests (may fail if auth is required).\n');
  }

  const entries = buildEntries();
  console.log(`📋 Generated ${entries.length} iqamah schedule entries across 12 months\n`);

  let created = 0;
  let failed = 0;

  for (const entry of entries) {
    try {
      await createEntry(entry);
      created++;
      const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      console.log(`  ✅ ${monthNames[entry.month]} ${entry.dayRangeStart}-${entry.dayRangeEnd}${entry.isDst ? ' (DST)' : ''}: Fajr ${entry.fajr}, Isha ${entry.isha}`);
    } catch (err) {
      failed++;
      console.error(`  ❌ ${err}`);
    }
  }

  console.log(`\n🏁 Done! Created: ${created}, Failed: ${failed}`);
}

main().catch(console.error);
