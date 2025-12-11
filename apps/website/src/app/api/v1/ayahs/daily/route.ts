import { NextRequest, NextResponse } from 'next/server';

/**
 * Daily Ayah API v1
 * GET /api/v1/ayahs/daily
 *
 * Returns the daily featured ayah.
 */

const getDailyAyah = () => {
  // In production, this would rotate daily based on date
  const dailyAyahs = [
    {
      number: 255,
      surah: 2,
      text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
      translation:
        'Allah! There is no deity except Him, the Ever-Living, the Sustainer of existence.',
      surahName: 'Al-Baqarah',
      reference: '2:255',
    },
    {
      number: 286,
      surah: 2,
      text: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
      translation: 'Allah does not burden a soul beyond that it can bear.',
      surahName: 'Al-Baqarah',
      reference: '2:286',
    },
    {
      number: 185,
      surah: 2,
      text: 'شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ',
      translation:
        'The month of Ramadan in which was revealed the Quran, a guidance for the people.',
      surahName: 'Al-Baqarah',
      reference: '2:185',
    },
  ];

  // Select based on day of year
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return dailyAyahs[dayOfYear % dailyAyahs.length];
};

export async function GET(request: NextRequest) {
  try {
    const dailyAyah = getDailyAyah();
    const today = new Date().toISOString().split('T')[0];

    return NextResponse.json({
      data: {
        ...dailyAyah,
        date: today,
        audio: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${dailyAyah.number}.mp3`,
      },
      meta: {
        version: 'v1',
        feature: 'daily-ayah',
        date: today,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching daily ayah:', error);
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'ServerError',
          message: 'Failed to fetch daily ayah',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
