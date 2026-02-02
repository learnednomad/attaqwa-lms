import 'server-only';

import type { HadithBook, HadithChapter, HadithEntry, PaginationMeta } from '@/types/hadith';

const API_BASE = process.env.HADITH_BASE_URL || 'https://hadithapi.com/api';

function getApiKey(): string {
  const key = process.env.HADITH_API_KEY;
  if (!key) {
    console.error('[hadith-api] HADITH_API_KEY environment variable is not set');
    return '';
  }
  return key;
}

export async function fetchBooks(): Promise<HadithBook[]> {
  try {
    const res = await fetch(`${API_BASE}/books?apiKey=${getApiKey()}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) {
      console.error(`[hadith-api] Failed to fetch books: ${res.status}`);
      return [];
    }
    const data = await res.json();
    return data.books ?? [];
  } catch (err) {
    console.error('[hadith-api] Error fetching books:', err);
    return [];
  }
}

export async function fetchBook(slug: string): Promise<HadithBook | null> {
  const books = await fetchBooks();
  return books.find((b) => b.bookSlug === slug) ?? null;
}

export async function fetchChapters(bookSlug: string): Promise<HadithChapter[]> {
  try {
    const res = await fetch(
      `${API_BASE}/${bookSlug}/chapters?apiKey=${getApiKey()}&paginate=200`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) {
      console.error(`[hadith-api] Failed to fetch chapters: ${res.status}`);
      return [];
    }
    const data = await res.json();
    return data.chapters?.data ?? [];
  } catch (err) {
    console.error('[hadith-api] Error fetching chapters:', err);
    return [];
  }
}

export async function fetchHadiths(opts: {
  bookSlug: string;
  chapterNumber?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ data: HadithEntry[]; pagination: PaginationMeta }> {
  const { bookSlug, chapterNumber, page = 1, pageSize = 20 } = opts;

  const empty = {
    data: [] as HadithEntry[],
    pagination: { current_page: 1, last_page: 1, per_page: pageSize, total: 0 },
  };

  try {
    // Build URL with string concat — URLSearchParams encodes $ in the API key
    // which the hadith API rejects
    let url = `${API_BASE}/hadiths/?apiKey=${getApiKey()}&book=${bookSlug}&paginate=${pageSize}&page=${page}`;
    if (chapterNumber) {
      url += `&chapter=${chapterNumber}`;
    }

    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error(`[hadith-api] Failed to fetch hadiths: ${res.status}`);
      return empty;
    }
    const data = await res.json();

    return {
      data: data.hadiths?.data ?? [],
      pagination: {
        current_page: data.hadiths?.current_page ?? 1,
        last_page: data.hadiths?.last_page ?? 1,
        per_page: data.hadiths?.per_page ?? pageSize,
        total: data.hadiths?.total ?? 0,
      },
    };
  } catch (err) {
    console.error('[hadith-api] Error fetching hadiths:', err);
    return empty;
  }
}

export async function fetchDailyHadith(): Promise<HadithEntry | null> {
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const bookSlugs = ['sahih-bukhari', 'sahih-muslim'];
  const slug = bookSlugs[dayOfYear % 2];
  const page = (dayOfYear % 50) + 1;

  try {
    const url = `${API_BASE}/hadiths/?apiKey=${getApiKey()}&book=${slug}&paginate=1&page=${page}&status=Sahih`;
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.hadiths?.data?.[0] ?? null;
  } catch {
    return null;
  }
}
