import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/middleware/auth';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * GET /api/v1/courses/[id]
 * Fetch a single course by documentId from Strapi v1 API
 * Note: v1 API doesn't support populate params, returns flat course data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Use v1 API with direct documentId fetch
    // Note: v1 API doesn't support populate - returns flat data with denormalized fields
    const url = `${STRAPI_URL}/api/v1/courses/${id}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          {
            error: {
              status: 404,
              name: 'NotFoundError',
              message: 'Course not found',
            },
          },
          { status: 404 }
        );
      }
      throw new Error(`Strapi error: ${response.status}`);
    }

    const data = await response.json();

    // Extract course data (handle both single and array response)
    const course = Array.isArray(data.data) ? data.data[0] : data.data;

    if (!course) {
      return NextResponse.json(
        {
          error: {
            status: 404,
            name: 'NotFoundError',
            message: 'Course not found',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: course,
      meta: {
        version: 'v1',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Failed to fetch course',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/v1/courses/[id]
 * Update a course by documentId
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

    // Use Strapi API token for server-to-server requests
    const token = STRAPI_API_TOKEN;

    // Try v1 API first, fall back to standard Strapi API
    let response = await fetch(`${STRAPI_URL}/api/v1/courses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: body.data || body }),
    });

    // If v1 API fails with 4xx, try standard Strapi API
    if (!response.ok && response.status >= 400 && response.status < 500) {
      response = await fetch(`${STRAPI_URL}/api/courses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: body.data || body }),
      });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: {
            status: response.status,
            name: response.status === 404 ? 'NotFoundError' : 'UpdateError',
            message: errorData.error?.message || 'Failed to update course',
          },
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      data: data.data,
      meta: {
        version: 'v1',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Failed to update course',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/courses/[id]
 * Delete a course by documentId
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

    // Use Strapi API token for server-to-server requests
    const token = STRAPI_API_TOKEN;

    // Try v1 API first, fall back to standard Strapi API
    let response = await fetch(`${STRAPI_URL}/api/v1/courses/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    // If v1 API fails with 4xx, try standard Strapi API
    if (!response.ok && response.status >= 400 && response.status < 500) {
      response = await fetch(`${STRAPI_URL}/api/courses/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: {
            status: response.status,
            name: response.status === 404 ? 'NotFoundError' : 'DeleteError',
            message: errorData.error?.message || 'Failed to delete course',
          },
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      data: { id, deleted: true },
      meta: {
        version: 'v1',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Failed to delete course',
        },
      },
      { status: 500 }
    );
  }
}
