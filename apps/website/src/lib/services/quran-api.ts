import 'server-only';

const QURAN_API_BASE = 'https://api.alquran.cloud/v1';

export interface DailyAyah {
  number: number;
  numberInSurah: number;
  text: string;
  translation: string;
  surahNumber: number;
  surahName: string;
  surahEnglishName: string;
  revelationType: string;
  juz: number;
  audio: string;
}

export interface MushafPageAyah {
  number: number;
  numberInSurah: number;
  text: string;
  surahNumber: number;
  surahName: string;
  surahEnglishName: string;
  juz: number;
  hizbQuarter: number;
}

export interface MushafPage {
  pageNumber: number;
  ayahs: MushafPageAyah[];
  juz: number;
  /** distinct surahs that appear on this page */
  surahs: { number: number; name: string; englishName: string }[];
}

export interface ContextGroup {
  title: string;
  ayahRange: [number, number];
  theme: string;
}

export interface PopularSurah {
  number: number;
  name: string;
  verses: number;
  theme: string;
}

export async function fetchDailyAyah(): Promise<DailyAyah | null> {
  try {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const ayahNumber = (dayOfYear % 6236) + 1;

    const [arabicRes, translationRes] = await Promise.all([
      fetch(`${QURAN_API_BASE}/ayah/${ayahNumber}`, { next: { revalidate: 3600 } }),
      fetch(`${QURAN_API_BASE}/ayah/${ayahNumber}/en.sahih`, { next: { revalidate: 3600 } }),
    ]);

    if (!arabicRes.ok || !translationRes.ok) {
      throw new Error(`API returned ${arabicRes.status}/${translationRes.status}`);
    }

    const arabic = await arabicRes.json();
    const translation = await translationRes.json();

    return {
      number: arabic.data.number,
      numberInSurah: arabic.data.numberInSurah,
      text: arabic.data.text,
      translation: translation.data.text,
      surahNumber: arabic.data.surah.number,
      surahName: arabic.data.surah.name,
      surahEnglishName: arabic.data.surah.englishName,
      revelationType: arabic.data.surah.revelationType,
      juz: arabic.data.juz,
      audio: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${arabic.data.number}.mp3`,
    };
  } catch (error) {
    console.error('[quran-api] Error fetching daily ayah:', error);
    return null;
  }
}

export async function fetchMushafPage(page?: number): Promise<MushafPage | null> {
  try {
    let pageNumber: number;
    if (page && page >= 1 && page <= 604) {
      pageNumber = page;
    } else {
      const today = new Date();
      const dayOfYear = Math.floor(
        (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
      );
      pageNumber = (dayOfYear % 604) + 1;
    }

    const res = await fetch(
      `${QURAN_API_BASE}/page/${pageNumber}/quran-uthmani`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const json = await res.json();
    const ayahsData = json.data.ayahs;

    const ayahs: MushafPageAyah[] = ayahsData.map((a: any) => ({
      number: a.number,
      numberInSurah: a.numberInSurah,
      text: a.text,
      surahNumber: a.surah.number,
      surahName: a.surah.name,
      surahEnglishName: a.surah.englishName,
      juz: a.juz,
      hizbQuarter: a.hizbQuarter,
    }));

    const surahMap = new Map<number, { number: number; name: string; englishName: string }>();
    for (const a of ayahs) {
      if (!surahMap.has(a.surahNumber)) {
        surahMap.set(a.surahNumber, {
          number: a.surahNumber,
          name: a.surahName,
          englishName: a.surahEnglishName,
        });
      }
    }

    return {
      pageNumber,
      ayahs,
      juz: ayahs[0]?.juz ?? 1,
      surahs: Array.from(surahMap.values()),
    };
  } catch (error) {
    console.error('[quran-api] Error fetching mushaf page:', error);
    return null;
  }
}

export const popularSurahs: PopularSurah[] = [
  { number: 1, name: 'Al-Fatihah', verses: 7, theme: 'The Opening' },
  { number: 2, name: 'Al-Baqarah', verses: 286, theme: 'The Cow' },
  { number: 18, name: 'Al-Kahf', verses: 110, theme: 'The Cave' },
  { number: 36, name: 'Ya-Sin', verses: 83, theme: 'Heart of the Quran' },
  { number: 55, name: 'Ar-Rahman', verses: 78, theme: 'The Merciful' },
  { number: 56, name: 'Al-Waqiah', verses: 96, theme: 'The Event' },
  { number: 67, name: 'Al-Mulk', verses: 30, theme: 'The Kingdom' },
  { number: 112, name: 'Al-Ikhlas', verses: 4, theme: 'The Sincerity' },
];

export const baqarahGroups: ContextGroup[] = [
  {
    title: 'Opening - Three Types of People',
    ayahRange: [1, 20],
    theme: 'Believers, disbelievers, and hypocrites - their characteristics and fate',
  },
  {
    title: 'Creation Story & Divine Guidance',
    ayahRange: [21, 39],
    theme: "Adam's creation, the test in Paradise, and descent to Earth",
  },
  {
    title: 'Children of Israel - Part 1',
    ayahRange: [40, 86],
    theme: 'Covenant with Bani Israel, Moses and the cow, breaking of promises',
  },
  {
    title: 'Children of Israel - Part 2',
    ayahRange: [87, 121],
    theme: 'Rejection of prophets, distortion of scripture, jealousy towards Muslims',
  },
  {
    title: "Abraham's Legacy & The Kaaba",
    ayahRange: [122, 141],
    theme: "Abraham's trials, building of Kaaba, prayer for the final messenger",
  },
  {
    title: 'Change of Qiblah',
    ayahRange: [142, 152],
    theme: 'From Jerusalem to Makkah - test of faith and unity of Ummah',
  },
  {
    title: 'Patience, Life & Death',
    ayahRange: [153, 177],
    theme: 'Tests through fear and loss, laws of retribution (Qisas), wills and inheritance',
  },
  {
    title: 'Fasting & Ramadan',
    ayahRange: [183, 187],
    theme: 'Obligation of fasting, rules, exceptions, and spiritual benefits',
  },
  {
    title: "Striving in Allah's Path",
    ayahRange: [190, 195],
    theme: "Rules of defensive warfare and spending in Allah's cause",
  },
  {
    title: 'Hajj & Umrah',
    ayahRange: [196, 203],
    theme: 'Pilgrimage rites, sacred months, and remembrance of Allah',
  },
  {
    title: 'Social Laws - Part 1',
    ayahRange: [204, 242],
    theme: 'Fighting injustice, charity, prohibition of interest (riba), contracts',
  },
  {
    title: 'Social Laws - Part 2',
    ayahRange: [243, 252],
    theme: "Story of Talut (Saul) and Jalut (Goliath), David's kingdom",
  },
  {
    title: 'Ayatul Kursi & Core Beliefs',
    ayahRange: [253, 260],
    theme: "Allah's throne verse, no compulsion in religion, Abraham and resurrection",
  },
  {
    title: 'Charity & Economic Justice',
    ayahRange: [261, 274],
    theme: 'Rewards of charity, sincerity in giving, prohibition of usury',
  },
  {
    title: 'Financial Transactions',
    ayahRange: [275, 283],
    theme: 'Laws of trade, debts, witnesses, longest verse on documentation',
  },
  {
    title: 'Conclusion - Declaration of Faith',
    ayahRange: [284, 286],
    theme: "Accountability, the Prophet and believers' prayer, no burden beyond capacity",
  },
];
