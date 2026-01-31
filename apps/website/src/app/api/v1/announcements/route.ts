/**
 * Announcements API v1
 * GET /api/v1/announcements
 * POST /api/v1/announcements
 *
 * SECURITY IMPROVEMENTS:
 * - Added Zod input validation
 * - Sanitized error responses (no stack traces)
 * - Added authentication check for POST
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  createAnnouncementSchema,
  announcementQuerySchema,
  validateBody,
  validateQuery,
} from '@/lib/schemas';
import { verifyAuth } from '@/middleware/auth';

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
    // Validate query parameters
    const query = validateQuery(announcementQuerySchema, request.nextUrl.searchParams);
    const { limit, offset, type, active } = query;

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
    // SECURITY: Log full error server-side, return generic message to client
    console.error('[API] Announcements GET error:', error);

    return NextResponse.json(
      {
        error: {
          status: 500,
          message: 'Failed to fetch announcements. Please try again later.',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Verify authentication
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        {
          error: {
            status: 401,
            message: 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    // SECURITY: Check authorization (only admins and moderators can create)
    if (!['ADMIN', 'MODERATOR', 'admin', 'moderator'].includes(user.role)) {
      return NextResponse.json(
        {
          error: {
            status: 403,
            message: 'Insufficient permissions',
          },
        },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = validateBody(createAnnouncementSchema, body);

    if (!validation.success) {
      return validation.response;
    }

    const validatedData = validation.data;

    // Create the announcement (in production, save to database)
    const newAnnouncement = {
      documentId: `ann-${Date.now()}`,
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        name: user.name,
        role: user.role,
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
    // SECURITY: Log full error server-side, return generic message to client
    console.error('[API] Announcements POST error:', error);

    // Handle JSON parse errors specifically
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: {
            status: 400,
            message: 'Invalid JSON in request body',
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: {
          status: 500,
          message: 'Failed to create announcement. Please try again later.',
        },
      },
      { status: 500 }
    );
  }
}
