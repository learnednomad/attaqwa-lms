/**
 * Quran API Fetcher
 * Fetches complete Quran with English translation from AlQuran Cloud API
 */

import { fetchJSON, fetchWithRetry } from '../utils/api-client';
import { cleanArabicText, estimateReadingTime } from '../utils/content-processor';

const QURAN_API_BASE = 'https://api.alquran.cloud/v1';
const ARABIC_EDITION = 'quran-uthmani'; // Uthmani script
const ENGLISH_EDITION = 'en.sahih'; // Saheeh International translation

export interface QuranSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  arabicText: string;
  englishTranslation: string;
  ayahs: QuranAyah[];
}

export interface QuranAyah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  hizbQuarter: number;
  translation?: string;
}

export interface QuranJuz {
  number: number;
  surahs: number[];
  arabicText: string;
  englishTranslation: string;
  ayahCount: number;
}

/**
 * Fetch complete Quran metadata
 */
async function fetchQuranMetadata() {
  console.log('Fetching Quran metadata...');
  const response = await fetchJSON<any>(`${QURAN_API_BASE}/surah`);
  return response.data;
}

/**
 * Fetch Surah with Arabic and English
 */
async function fetchSurah(surahNumber: number): Promise<QuranSurah> {
  console.log(`Fetching Surah ${surahNumber}...`);

  const [arabicResponse, englishResponse] = await Promise.all([
    fetchWithRetry<any>(`${QURAN_API_BASE}/surah/${surahNumber}/${ARABIC_EDITION}`),
    fetchWithRetry<any>(`${QURAN_API_BASE}/surah/${surahNumber}/${ENGLISH_EDITION}`)
  ]);

  const arabicSurah = arabicResponse.data;
  const englishSurah = englishResponse.data;

  const arabicText = arabicSurah.ayahs.map((a: any) => a.text).join(' ');
  const englishTranslation = englishSurah.ayahs.map((a: any) => a.text).join(' ');

  return {
    number: arabicSurah.number,
    name: arabicSurah.name,
    englishName: arabicSurah.englishName,
    englishNameTranslation: arabicSurah.englishNameTranslation,
    numberOfAyahs: arabicSurah.numberOfAyahs,
    revelationType: arabicSurah.revelationType,
    arabicText: cleanArabicText(arabicText),
    englishTranslation,
    ayahs: arabicSurah.ayahs.map((ayah: any, index: number) => ({
      number: ayah.number,
      text: ayah.text,
      numberInSurah: ayah.numberInSurah,
      juz: ayah.juz,
      manzil: ayah.manzil,
      page: ayah.page,
      hizbQuarter: ayah.hizbQuarter,
      translation: englishSurah.ayahs[index].text
    }))
  };
}

/**
 * Fetch all Surahs
 */
export async function fetchAllSurahs(): Promise<QuranSurah[]> {
  console.log('Starting Quran fetch...');
  const metadata = await fetchQuranMetadata();
  const surahs: QuranSurah[] = [];

  for (let i = 1; i <= 114; i++) {
    const surah = await fetchSurah(i);
    surahs.push(surah);

    // Rate limiting - wait 100ms between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`Successfully fetched ${surahs.length} Surahs`);
  return surahs;
}

/**
 * Group Surahs by Juz (30 parts)
 */
export function groupByJuz(surahs: QuranSurah[]): QuranJuz[] {
  const juzMap = new Map<number, QuranSurah[]>();

  surahs.forEach(surah => {
    const juzNumber = surah.ayahs[0].juz;
    if (!juzMap.has(juzNumber)) {
      juzMap.set(juzNumber, []);
    }
    juzMap.get(juzNumber)!.push(surah);
  });

  const juzArray: QuranJuz[] = [];
  for (let i = 1; i <= 30; i++) {
    const surahsInJuz = juzMap.get(i) || [];
    const arabicText = surahsInJuz.map(s => s.arabicText).join(' ');
    const englishTranslation = surahsInJuz.map(s => s.englishTranslation).join(' ');
    const ayahCount = surahsInJuz.reduce((sum, s) => sum + s.numberOfAyahs, 0);

    juzArray.push({
      number: i,
      surahs: surahsInJuz.map(s => s.number),
      arabicText,
      englishTranslation,
      ayahCount
    });
  }

  return juzArray;
}

/**
 * Group Surahs thematically for advanced study
 */
export function groupByTheme(surahs: QuranSurah[]) {
  return {
    tawheed: {
      name: 'Tawheed and Belief',
      description: 'Surahs focusing on the Oneness of Allah and core Islamic beliefs',
      surahs: [1, 112, 113, 114, 109, 2] // Al-Fatiha, Ikhlas, Falaq, Nas, Kafirun, Al-Baqarah
    },
    stories: {
      name: 'Stories of the Prophets',
      description: 'Narratives of Prophets and their communities',
      surahs: [12, 18, 19, 20, 21, 26, 27, 28, 71] // Yusuf, Kahf, Maryam, Ta-Ha, Anbiya, Shu\'ara, Naml, Qasas, Nuh
    },
    laws: {
      name: 'Islamic Jurisprudence',
      description: 'Legal rulings and guidance for Muslim life',
      surahs: [2, 4, 5, 24] // Al-Baqarah, An-Nisa, Al-Ma\'idah, An-Nur
    },
    meccan: {
      name: 'Meccan Revelation',
      description: 'Surahs revealed in Mecca - focus on faith and spirituality',
      surahs: surahs.filter(s => s.revelationType === 'Meccan').map(s => s.number)
    },
    medinan: {
      name: 'Medinan Revelation',
      description: 'Surahs revealed in Medina - focus on community and law',
      surahs: surahs.filter(s => s.revelationType === 'Medinan').map(s => s.number)
    },
    eschatology: {
      name: 'Day of Judgment',
      description: 'Surahs about the Hereafter and accountability',
      surahs: [75, 77, 78, 79, 80, 81, 82, 83, 84, 99, 101] // Qiyamah, Mursalat, Naba, etc.
    },
    worship: {
      name: 'Acts of Worship',
      description: 'Guidance on prayer, fasting, charity, and pilgrimage',
      surahs: [2, 107, 108] // Al-Baqarah, Ma\'un, Kawthar
    }
  };
}

/**
 * Get short Surahs for children/beginners (Juz 30)
 */
export function getShortSurahs(surahs: QuranSurah[]): QuranSurah[] {
  return surahs.filter(s => s.number >= 78); // From Surah An-Naba onwards (Juz 30)
}
