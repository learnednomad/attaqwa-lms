import { NextRequest, NextResponse } from 'next/server';

/**
 * @deprecated This endpoint is deprecated. Use /api/v1/ayahs instead.
 * This endpoint will be removed on 2025-12-01.
 * See: docs/api-migration-plan.md
 */

// Helper to add deprecation headers
function addDeprecationHeaders(response: NextResponse): NextResponse {
  response.headers.set('Deprecation', 'true');
  response.headers.set('Sunset', 'Mon, 01 Dec 2025 00:00:00 GMT');
  response.headers.set('Link', '</api/v1/ayahs>; rel="successor-version"');
  return response;
}

// Mock Ayah data
const getMockAyahData = () => ({
  number: 255,
  text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
  translation: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of existence.',
  tafsir: 'This is Ayat al-Kursi, one of the most powerful verses in the Quran, describing Allah\'s absolute sovereignty and attributes.',
  surah: {
    number: 2,
    name: 'Al-Baqarah',
    englishName: 'The Cow',
    revelationType: 'Medinan'
  },
  juz: 3,
  page: 42,
  audio: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/255.mp3'
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'daily';

    // For now, return mock data
    // In production, this would fetch from Al-Quran Cloud API
    const ayahData = getMockAyahData();

    const response = NextResponse.json({
      success: true,
      data: ayahData
    });
    return addDeprecationHeaders(response);
  } catch (error) {
    console.error('Error fetching ayah:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch ayah',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}