import { NextRequest, NextResponse } from 'next/server';

/**
 * @deprecated This endpoint is deprecated. Use /api/v1/announcements instead.
 * This endpoint will be removed on 2025-12-01.
 * See: docs/api-migration-plan.md
 */

// Helper to add deprecation headers
function addDeprecationHeaders(response: NextResponse): NextResponse {
  response.headers.set('Deprecation', 'true');
  response.headers.set('Sunset', 'Mon, 01 Dec 2025 00:00:00 GMT');
  response.headers.set('Link', '</api/v1/announcements>; rel="successor-version"');
  return response;
}

// Mock announcements data - in production, this would come from a database
const mockAnnouncements = [
  {
    id: '1',
    title: 'Jumah Prayer Time Change',
    content: 'Starting next week, Jumah prayer will be at 1:30 PM instead of 1:00 PM.',
    type: 'prayer',
    priority: 'high',
    isActive: true,
    createdAt: new Date('2024-12-15').toISOString(),
    updatedAt: new Date('2024-12-15').toISOString(),
    author: {
      name: 'Admin',
      role: 'ADMIN'
    }
  },
  {
    id: '2',
    title: 'Ramadan Programs Registration Open',
    content: 'Register now for our special Ramadan programs including Tarawih, Iftar, and Quran recitation.',
    type: 'event',
    priority: 'medium',
    isActive: true,
    createdAt: new Date('2024-12-10').toISOString(),
    updatedAt: new Date('2024-12-10').toISOString(),
    author: {
      name: 'Education Team',
      role: 'MODERATOR'
    }
  },
  {
    id: '3',
    title: 'Weekend Islamic School',
    content: 'Weekend Islamic school for children ages 5-15. Classes start at 10 AM every Saturday.',
    type: 'education',
    priority: 'normal',
    isActive: true,
    createdAt: new Date('2024-12-05').toISOString(),
    updatedAt: new Date('2024-12-05').toISOString(),
    author: {
      name: 'Education Team',
      role: 'MODERATOR'
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const type = searchParams.get('type');
    const active = searchParams.get('active') === 'false' ? false : true;

    // Filter announcements
    let filtered = mockAnnouncements.filter(a => a.isActive === active);
    if (type) {
      filtered = filtered.filter(a => a.type === type);
    }

    // Apply pagination
    const paginatedAnnouncements = filtered.slice(offset, offset + limit);

    const response = NextResponse.json({
      success: true,
      data: paginatedAnnouncements,
      pagination: {
        total: filtered.length,
        limit,
        offset,
        hasMore: offset + limit < filtered.length
      }
    });
    return addDeprecationHeaders(response);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch announcements',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Create new announcement (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In production, validate admin authentication here
    // Then save to database
    
    const newAnnouncement = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        name: 'Admin',
        role: 'ADMIN'
      }
    };

    const response = NextResponse.json({
      success: true,
      message: 'Announcement created successfully',
      data: newAnnouncement
    });
    return addDeprecationHeaders(response);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create announcement'
      },
      { status: 500 }
    );
  }
}