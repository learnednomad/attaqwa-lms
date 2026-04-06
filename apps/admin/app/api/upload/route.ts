import { NextRequest, NextResponse } from 'next/server';

// Server-side Strapi URL (uses Docker internal DNS)
const STRAPI_URL = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * POST /api/upload
 * Proxies file uploads to Strapi using an API token.
 * Strapi stores files in MinIO (S3) when configured.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const headers: Record<string, string> = {};
    if (STRAPI_API_TOKEN) {
      headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
    }

    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi upload error:', response.status, errorText);
      return NextResponse.json(
        { error: `Upload failed: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Upload proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
