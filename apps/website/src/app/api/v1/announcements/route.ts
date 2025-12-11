import { NextRequest, NextResponse } from 'next/server';

/**
 * Announcements API v1
 * GET /api/v1/announcements
 * POST /api/v1/announcements
 *
 * Versioned announcements endpoint with Strapi v5 response format.
 */

const mockAnnouncements = [
  {
    documentId: 'ann-001',
    title: 'Jumah Prayer Time Change',
    content:
      'Starting next week, Jumah prayer will be at 1:30 PM instead of 1:00 PM.',
    type: 'prayer',
    priority: 'high',
    isActive: true,
    createdAt: new Date('2024-12-15').toISOString(),
    updatedAt: new Date('2024-12-15').toISOString(),
    author: {
      name: 'Admin',
      role: 'ADMIN',
    },
  },
  {
    documentId: 'ann-002',
    title: 'Ramadan Programs Registration Open',
    content:
      'Register now for our special Ramadan programs including Tarawih, Iftar, and Quran recitation.',
    type: 'event',
    priority: 'medium',
    isActive: true,
    createdAt: new Date('2024-12-10').toISOString(),
    updatedAt: new Date('2024-12-10').toISOString(),
    author: {
      name: 'Education Team',
      role: 'MODERATOR',
    },
  },
  {
    documentId: 'ann-003',
    title: 'Weekend Islamic School',
    content:
      'Weekend Islamic school for children ages 5-15. Classes start at 10 AM every Saturday.',
    type: 'education',
    priority: 'normal',
    isActive: true,
    createdAt: new Date('2024-12-05').toISOString(),
    updatedAt: new Date('2024-12-05').toISOString(),
    author: {
      name: 'Education Team',
      role: 'MODERATOR',
    },
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const type = searchParams.get('type');
    const active = searchParams.get('active') !== 'false';

    // Filter announcements
    let filtered = mockAnnouncements.filter((a) => a.isActive === active);
    if (type) {
      filtered = filtered.filter((a) => a.type === type);
    }

    // Apply pagination
    const paginated = filtered.slice(offset, offset + limit);

    // Strapi v5 response format (flattened)
    return NextResponse.json({
      data: paginated,
      meta: {
        version: 'v1',
        pagination: {
          page: Math.floor(offset / limit) + 1,
          pageSize: limit,
          pageCount: Math.ceil(filtered.length / limit),
          total: filtered.length,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'ServerError',
          message: 'Failed to fetch announcements',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // In production, validate admin authentication here
    // Then save to database

    const newAnnouncement = {
      documentId: `ann-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        name: 'Admin',
        role: 'ADMIN',
      },
    };

    return NextResponse.json(
      {
        data: newAnnouncement,
        meta: {
          version: 'v1',
          message: 'Announcement created successfully',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'ServerError',
          message: 'Failed to create announcement',
        },
      },
      { status: 500 }
    );
  }
}
