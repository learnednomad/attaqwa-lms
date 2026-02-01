import { NextRequest, NextResponse } from 'next/server';

/**
 * @deprecated This endpoint is deprecated. Use /api/v1/hadiths instead.
 * This endpoint will be removed on 2025-12-01.
 * See: docs/api-migration-plan.md
 */

// Helper to add deprecation headers
function addDeprecationHeaders(response: NextResponse): NextResponse {
  response.headers.set('Deprecation', 'true');
  response.headers.set('Sunset', 'Mon, 01 Dec 2025 00:00:00 GMT');
  response.headers.set('Link', '</api/v1/hadiths>; rel="successor-version"');
  return response;
}

// Mock hadith data - in production, this would come from a proper Islamic API
const mockHadithData = [
  {
    collection: 'bukhari',
    bookNumber: '1',
    hadithNumber: '1',
    hadith: {
      arab: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
      english: 'Actions are judged by intentions, and every person will get what they intended.',
      narrator: 'Umar ibn al-Khattab'
    },
    grade: 'Sahih (Authentic)',
    reference: 'Sahih al-Bukhari 1'
  },
  {
    collection: 'muslim',
    bookNumber: '1',
    hadithNumber: '2',
    hadith: {
      arab: 'الدِّينُ النَّصِيحَةُ',
      english: 'The religion is sincerity/good advice.',
      narrator: 'Tamim al-Dari'
    },
    grade: 'Sahih (Authentic)',
    reference: 'Sahih Muslim 95'
  },
  {
    collection: 'bukhari',
    bookNumber: '1',
    hadithNumber: '3',
    hadith: {
      arab: 'بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ',
      english: 'Islam is built upon five pillars.',
      narrator: 'Abdullah ibn Umar'
    },
    grade: 'Sahih (Authentic)',
    reference: 'Sahih al-Bukhari 8'
  }
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const collection = searchParams.get('collection') || 'bukhari';
    const bookNumber = searchParams.get('book') || '1';

    // Filter by collection and book
    const filtered = mockHadithData.filter(h => 
      (!collection || h.collection === collection) &&
      (!bookNumber || h.bookNumber === bookNumber.toString())
    );

    const response = NextResponse.json({
      success: true,
      data: filtered
    });
    return addDeprecationHeaders(response);
  } catch (error) {
    console.error('Error fetching hadith:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch hadith',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}