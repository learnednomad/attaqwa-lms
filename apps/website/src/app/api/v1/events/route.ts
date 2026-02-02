import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/middleware/auth';

// Mock events data - in production, this would come from Strapi
const mockEvents = [
  {
    documentId: 'evt-001',
    title: 'Jumah Prayer',
    description: 'Weekly Friday congregational prayer with khutbah (sermon)',
    date: '2025-01-17',
    startTime: '13:00',
    endTime: '14:00',
    location: 'Main Prayer Hall',
    category: 'prayer',
    isRecurring: true,
    recurrencePattern: 'weekly',
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    documentId: 'evt-002',
    title: 'Weekend Islamic School',
    description: 'Islamic education classes for children ages 5-15. Includes Quran recitation, Islamic studies, and Arabic.',
    date: '2025-01-18',
    startTime: '10:00',
    endTime: '13:00',
    location: 'Classroom Wing',
    category: 'education',
    isRecurring: true,
    recurrencePattern: 'weekly',
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    documentId: 'evt-003',
    title: 'Monthly Community Dinner',
    description: 'Monthly potluck dinner for the community to come together and socialize.',
    date: '2025-01-25',
    startTime: '18:30',
    endTime: '21:00',
    location: 'Community Hall',
    category: 'social',
    isRecurring: true,
    recurrencePattern: 'monthly',
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    documentId: 'evt-004',
    title: 'Tafsir Halaqa',
    description: 'Weekly Quran explanation and reflection session led by Imam Ahmad.',
    date: '2025-01-19',
    startTime: '19:30',
    endTime: '21:00',
    location: 'Main Prayer Hall',
    category: 'lecture',
    isRecurring: true,
    recurrencePattern: 'weekly',
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
];

/**
 * GET /api/v1/events
 * Returns community events
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const upcoming = searchParams.get('upcoming') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let filtered = mockEvents.filter((e) => e.isActive);

    // Filter by category
    if (category) {
      filtered = filtered.filter((e) => e.category === category);
    }

    // Filter upcoming events
    if (upcoming) {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter((e) => e.date >= today);
    }

    // Sort by date
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Paginate
    const paginated = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      data: paginated,
      meta: {
        pagination: {
          page: Math.floor(offset / limit) + 1,
          pageSize: limit,
          pageCount: Math.ceil(filtered.length / limit),
          total: filtered.length,
        },
        version: 'v1',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Failed to fetch events',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/events
 * Create a new event (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // SECURITY: Verify authentication and role
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: { status: 401, message: 'Authentication required' } },
        { status: 401 }
      );
    }
    if (!['ADMIN', 'MODERATOR', 'admin', 'moderator'].includes(user.role)) {
      return NextResponse.json(
        { error: { status: 403, message: 'Insufficient permissions' } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const newEvent = {
      documentId: `evt-${Date.now()}`,
      ...body,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        data: newEvent,
        meta: {
          version: 'v1',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Failed to create event',
        },
      },
      { status: 500 }
    );
  }
}
