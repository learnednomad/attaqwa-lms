import { NextRequest, NextResponse } from 'next/server';

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

    return NextResponse.json({
      success: true,
      data: ayahData
    });
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