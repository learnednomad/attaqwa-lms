import { NextRequest, NextResponse } from 'next/server';

/**
 * Hadiths API v1
 * GET /api/v1/hadiths
 *
 * Returns hadith data. Replaces /api/islamic/hadith with flattened structure.
 */

const mockHadithData = [
  {
    id: '1',
    collection: 'bukhari',
    bookNumber: '1',
    hadithNumber: '1',
    hadith: {
      arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
      english:
        'Actions are judged by intentions, and every person will get what they intended.',
      narrator: 'Umar ibn al-Khattab',
    },
    grade: 'Sahih (Authentic)',
    reference: 'Sahih al-Bukhari 1',
  },
  {
    id: '2',
    collection: 'muslim',
    bookNumber: '1',
    hadithNumber: '2',
    hadith: {
      arabic: 'الدِّينُ النَّصِيحَةُ',
      english: 'The religion is sincerity/good advice.',
      narrator: 'Tamim al-Dari',
    },
    grade: 'Sahih (Authentic)',
    reference: 'Sahih Muslim 95',
  },
  {
    id: '3',
    collection: 'bukhari',
    bookNumber: '1',
    hadithNumber: '3',
    hadith: {
      arabic: 'بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ',
      english: 'Islam is built upon five pillars.',
      narrator: 'Abdullah ibn Umar',
    },
    grade: 'Sahih (Authentic)',
    reference: 'Sahih al-Bukhari 8',
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const collection = searchParams.get('collection');
    const book = searchParams.get('book');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Filter by collection and book
    let filtered = mockHadithData;
    if (collection) {
      filtered = filtered.filter((h) => h.collection === collection);
    }
    if (book) {
      filtered = filtered.filter((h) => h.bookNumber === book);
    }

    // Apply pagination
    const paginated = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      data: paginated,
      meta: {
        version: 'v1',
        pagination: {
          total: filtered.length,
          limit,
          offset,
          hasMore: offset + limit < filtered.length,
        },
        filters: {
          collection: collection || 'all',
          book: book || 'all',
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching hadith:', error);
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'ServerError',
          message: 'Failed to fetch hadith',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
