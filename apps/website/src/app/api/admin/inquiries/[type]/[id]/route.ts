/**
 * PATCH /api/admin/inquiries/[type]/[id]
 * Update status / answer fields on a contact-inquiry or legal-inquiry.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, strapiFetch } from '../../../_lib/strapi-proxy';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ type: string; id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response!;

  const { type, id } = await context.params;
  if (type !== 'contact' && type !== 'legal') {
    return NextResponse.json(
      { error: { status: 400, message: 'type must be contact or legal' } },
      { status: 400 }
    );
  }

  const path =
    type === 'legal'
      ? `/api/v1/legal-inquiries/${id}`
      : `/api/v1/contact-inquiries/${id}`;

  const body = await request.json().catch(() => ({}));
  const upstream = await strapiFetch(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

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

  const responseBody = await upstream.json();
  return NextResponse.json(responseBody);
}
