import { NextRequest, NextResponse } from 'next/server';

const QURAN_API_BASE = 'https://api.alquran.cloud/v1';

/**
 * Mushaf Page API v1
 * GET /api/v1/mushaf?page=1
 *
 * Returns a full page of ayahs from the Mushaf Hafs Al-Madinah (Uthmani script).
 * Pages range from 1 to 604.
 */
export async function GET(request: NextRequest) {
  const pageParam = request.nextUrl.searchParams.get('page');
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  if (isNaN(page) || page < 1 || page > 604) {
    return NextResponse.json(
      { error: { status: 400, message: 'Page must be between 1 and 604' } },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${QURAN_API_BASE}/page/${page}/quran-uthmani`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      throw new Error(`Upstream API returned ${res.status}`);
    }

    const json = await res.json();
    const ayahsData = json.data.ayahs;

    const ayahs = ayahsData.map((a: any) => ({
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

    return NextResponse.json({
      data: {
        pageNumber: page,
        ayahs,
        juz: ayahs[0]?.juz ?? 1,
        surahs: Array.from(surahMap.values()),
      },
    });
  } catch (error) {
    console.error('[mushaf-api] Error fetching page:', error);
    return NextResponse.json(
      { error: { status: 500, message: 'Failed to fetch Mushaf page' } },
      { status: 500 }
    );
  }
}
