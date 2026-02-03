/**
 * Tafseer API Fetcher
 * Fetches Tafseer Ibn Kathir and Baghawi from available sources
 */

import { fetchJSON, fetchWithRetry } from '../utils/api-client';
import { toRichText, truncate, estimateReadingTime } from '../utils/content-processor';

const TAFSIR_API_BASE = 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir';

export interface TafseerEntry {
  surahNumber: number;
  surahName: string;
  source: 'ibn-kathir' | 'baghawi';
  tafseerText: string;
  language: 'en' | 'ar';
}

/**
 * Fetch Ibn Kathir Tafseer for a Surah
 */
async function fetchIbnKathirSurah(surahNumber: number): Promise<TafseerEntry | null> {
  try {
    console.log(`Fetching Ibn Kathir Tafseer for Surah ${surahNumber}...`);

    // Try English version
    const url = `${TAFSIR_API_BASE}/en-tafisr-ibn-kathir/${surahNumber}.json`;
    const response = await fetchWithRetry<any>(url);

    if (!response || !response.text) {
      console.warn(`No Ibn Kathir data for Surah ${surahNumber}`);
      return null;
    }

    return {
      surahNumber,
      surahName: response.sura_name || `Surah ${surahNumber}`,
      source: 'ibn-kathir',
      tafseerText: response.text,
      language: 'en'
    };
  } catch (error) {
    console.error(`Error fetching Ibn Kathir for Surah ${surahNumber}:`, error);
    return null;
  }
}

/**
 * Fetch all Ibn Kathir Tafseer
 */
export async function fetchAllIbnKathir(): Promise<TafseerEntry[]> {
  console.log('Starting Ibn Kathir Tafseer fetch...');
  const tafseerEntries: TafseerEntry[] = [];

  for (let i = 1; i <= 114; i++) {
    const entry = await fetchIbnKathirSurah(i);
    if (entry) {
      tafseerEntries.push(entry);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`Successfully fetched ${tafseerEntries.length} Ibn Kathir entries`);
  return tafseerEntries;
}

/**
 * Fetch Baghawi Tafseer (placeholder - would need actual API)
 * For now, we'll create a simplified version based on available data
 */
export async function fetchBaghawiTafseer(surahNumber: number): Promise<TafseerEntry | null> {
  try {
    console.log(`Fetching Baghawi Tafseer for Surah ${surahNumber}...`);

    // Try to fetch from alternative source
    // Note: This may need to be updated based on actual available APIs
    const url = `${TAFSIR_API_BASE}/ar-tafsir-al-baghawi/${surahNumber}.json`;
    const response = await fetchWithRetry<any>(url);

    if (!response || !response.text) {
      return null;
    }

    return {
      surahNumber,
      surahName: response.sura_name || `Surah ${surahNumber}`,
      source: 'baghawi',
      tafseerText: response.text,
      language: 'ar'
    };
  } catch (error) {
    // Baghawi might not be available via API, we'll handle this gracefully
    console.warn(`Baghawi Tafseer not available for Surah ${surahNumber}`);
    return null;
  }
}

/**
 * Fetch all available Baghawi Tafseer
 */
export async function fetchAllBaghawi(): Promise<TafseerEntry[]> {
  console.log('Starting Baghawi Tafseer fetch...');
  const tafseerEntries: TafseerEntry[] = [];

  for (let i = 1; i <= 114; i++) {
    const entry = await fetchBaghawiTafseer(i);
    if (entry) {
      tafseerEntries.push(entry);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`Successfully fetched ${tafseerEntries.length} Baghawi entries`);
  return tafseerEntries;
}

/**
 * Combine Tafseer from multiple sources for a Surah
 */
export async function fetchCombinedTafseer(surahNumber: number) {
  const [ibnKathir, baghawi] = await Promise.all([
    fetchIbnKathirSurah(surahNumber),
    fetchBaghawiTafseer(surahNumber)
  ]);

  return {
    surahNumber,
    ibnKathir: ibnKathir?.tafseerText || null,
    baghawi: baghawi?.tafseerText || null
  };
}

/**
 * Generate Tafseer summary for lesson content
 */
export function generateTafseerContent(
  ibnKathirText: string | null,
  baghawiText: string | null,
  surahName: string
): string {
  let content = `# Tafseer of ${surahName}\n\n`;

  if (ibnKathirText) {
    content += `## Tafseer Ibn Kathir\n\n`;
    content += toRichText(ibnKathirText);
    content += `\n\n`;
  }

  if (baghawiText) {
    content += `## Tafseer al-Baghawi\n\n`;
    content += toRichText(baghawiText);
    content += `\n\n`;
  }

  if (!ibnKathirText && !baghawiText) {
    content += `<p><em>Tafseer content will be added soon, Insha'Allah.</em></p>`;
  }

  return content;
}

/**
 * Extract key themes from Tafseer text
 */
export function extractKeyThemes(tafseerText: string): string[] {
  const themes: string[] = [];
  const text = tafseerText.toLowerCase();

  const themeKeywords = {
    'Tawheed and Monotheism': ['allah', 'oneness', 'monotheism', 'tawheed', 'worship'],
    'Prophethood': ['prophet', 'messenger', 'revelation', 'prophecy'],
    'Hereafter': ['paradise', 'hell', 'judgment', 'resurrection', 'hereafter'],
    'Guidance': ['guidance', 'straight path', 'righteousness', 'piety'],
    'Prayer and Worship': ['prayer', 'salah', 'worship', 'devotion'],
    'Social Justice': ['justice', 'equality', 'rights', 'oppression'],
    'Family': ['family', 'parents', 'children', 'marriage'],
    'Patience and Trust': ['patience', 'sabr', 'trust', 'tawakkul']
  };

  for (const [theme, keywords] of Object.entries(themeKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      themes.push(theme);
    }
  }

  return themes.slice(0, 5); // Return top 5 themes
}
