import { NextRequest, NextResponse } from 'next/server';

/**
 * Hadith API Proxy v1
 * Proxies requests to hadithapi.com keeping the API key server-side.
 *
 * Query params:
 *   type: 'books' | 'chapters' | 'hadiths' (required)
 *   book: book slug (required for chapters/hadiths)
 *   chapter: chapter number (optional, for hadiths)
 *   paginate: results per page (optional, default 15)
 *   page: page number (optional)
 *   status: 'Sahih' | 'Hasan' | 'Da\'eef' (optional)
 *   hadithNumber: specific hadith number (optional)
 */

const API_BASE = process.env.HADITH_BASE_URL || 'https://hadithapi.com/api';
const API_KEY = process.env.HADITH_API_KEY ?? '';

export async function GET(request: NextRequest) {
  const apiKey = API_KEY;

  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');

  if (!type || !['books', 'chapters', 'hadiths'].includes(type)) {
    return NextResponse.json(
      { error: 'Invalid type. Must be: books, chapters, or hadiths' },
      { status: 400 }
    );
  }

  try {
    let url: string;

    if (type === 'books') {
      url = `${API_BASE}/books?apiKey=${apiKey}`;
    } else if (type === 'chapters') {
      const book = searchParams.get('book');
      if (!book) {
        return NextResponse.json(
          { error: 'book param required for chapters' },
          { status: 400 }
        );
      }
      const paginate = searchParams.get('paginate') || '100';
      url = `${API_BASE}/${book}/chapters?apiKey=${apiKey}&paginate=${paginate}`;
    } else {
      // hadiths
      const params = new URLSearchParams();
      params.set('apiKey', apiKey);

      const book = searchParams.get('book');
      if (book) params.set('book', book);

      const chapter = searchParams.get('chapter');
      if (chapter) params.set('chapter', chapter);

      const paginate = searchParams.get('paginate') || '15';
      params.set('paginate', paginate);

      const page = searchParams.get('page');
      if (page) params.set('page', page);

      const status = searchParams.get('status');
      if (status) params.set('status', status);

      const hadithNumber = searchParams.get('hadithNumber');
      if (hadithNumber) params.set('hadithNumber', hadithNumber);

      url = `${API_BASE}/hadiths/?${params.toString()}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // cache for 1 hour
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Hadith API returned ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Hadith API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from Hadith API' },
      { status: 500 }
    );
  }
}
