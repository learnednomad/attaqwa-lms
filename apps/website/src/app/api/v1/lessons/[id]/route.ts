import { NextRequest, NextResponse } from 'next/server';
import { getAnyAuthToken } from '@/lib/auth-cookies';
import { verifyAuth } from '@/middleware/auth';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

async function getToken(): Promise<string | null> {
  const result = await getAnyAuthToken();
  return result?.token || null;
}

/**
 * GET /api/v1/lessons/[id]
 * Fetch a single lesson by documentId from Strapi v1 API
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const response = await fetch(`${STRAPI_URL}/api/v1/lessons/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: { status: 404, name: 'NotFoundError', message: 'Lesson not found' } },
          { status: 404 }
        );
      }
      throw new Error(`Strapi error: ${response.status}`);
    }

    const data = await response.json();
    const lesson = Array.isArray(data.data) ? data.data[0] : data.data;

    if (!lesson) {
      return NextResponse.json(
        { error: { status: 404, name: 'NotFoundError', message: 'Lesson not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: lesson,
      meta: { version: 'v1', timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Failed to fetch lesson',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/v1/lessons/[id]
 * Update a lesson by documentId
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // SECURITY: Verify authentication and role
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: { status: 401, message: 'Authentication required' } },
        { status: 401 }
      );
    }
    if (!['ADMIN', 'TEACHER', 'admin', 'teacher'].includes(user.role)) {
      return NextResponse.json(
        { error: { status: 403, message: 'Insufficient permissions' } },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const token = await getToken();
    const authHeader = request.headers.get('authorization');

    const response = await fetch(`${STRAPI_URL}/api/v1/lessons/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader || `Bearer ${token}`,
      },
      body: JSON.stringify({ data: body.data || body }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: {
            status: response.status,
            name: response.status === 404 ? 'NotFoundError' : 'UpdateError',
            message: errorData.error?.message || 'Failed to update lesson',
          },
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      data: data.data,
      meta: { version: 'v1', timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json(
      { error: { status: 500, name: 'InternalServerError', message: 'Failed to update lesson' } },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/lessons/[id]
 * Delete a lesson by documentId
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // SECURITY: Verify authentication and role
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: { status: 401, message: 'Authentication required' } },
        { status: 401 }
      );
    }
    if (!['ADMIN', 'TEACHER', 'admin', 'teacher'].includes(user.role)) {
      return NextResponse.json(
        { error: { status: 403, message: 'Insufficient permissions' } },
        { status: 403 }
      );
    }

    const { id } = await params;

    const token = await getToken();
    const authHeader = request.headers.get('authorization');

    const response = await fetch(`${STRAPI_URL}/api/v1/lessons/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader || `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: {
            status: response.status,
            name: response.status === 404 ? 'NotFoundError' : 'DeleteError',
            message: errorData.error?.message || 'Failed to delete lesson',
          },
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      data: { id, deleted: true },
      meta: { version: 'v1', timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { error: { status: 500, name: 'InternalServerError', message: 'Failed to delete lesson' } },
      { status: 500 }
    );
  }
}
