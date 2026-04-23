/**
 * GET /api/admin/inquiries?type=contact|legal
 * Lists submissions from the public contact form or ask-an-imam form.
 * Both content types live in Strapi; this BFF wraps them so the admin UI
 * doesn't need its own API token.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, strapiFetch } from '../_lib/strapi-proxy';

export async function GET(request: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response!;

  const type = request.nextUrl.searchParams.get('type') ?? 'contact';
  const path =
    type === 'legal'
      ? '/api/v1/legal-inquiries'
      : '/api/v1/contact-inquiries';

  // Forward pagination + sort params, default to newest first
  const params = new URLSearchParams(request.nextUrl.searchParams);
  params.delete('type');
  if (!params.has('sort[0]')) params.set('sort[0]', 'submittedAt:desc');
  if (!params.has('pagination[pageSize]')) {
    params.set('pagination[pageSize]', '50');
  }

  const upstream = await strapiFetch(`${path}?${params.toString()}`);

  if (!upstream.ok) {
    return NextResponse.json(
      {
        error: {
          status: upstream.status,
          name: 'UpstreamError',
          message: `Strapi responded ${upstream.status}`,
        },
      },
      { status: upstream.status }
    );
  }

  const body = await upstream.json();
  return NextResponse.json(body);
}
