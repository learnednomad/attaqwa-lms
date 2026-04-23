/**
 * GET    /api/admin/appeals/[id]
 * PUT    /api/admin/appeals/[id]
 * DELETE /api/admin/appeals/[id]
 */

import { NextRequest } from 'next/server';
import { proxyGet, proxyMutation } from '../../_lib/strapi-proxy';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return proxyGet(request, `/api/v1/appeals/${id}`);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return proxyMutation(request, `/api/v1/appeals/${id}`, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return proxyMutation(request, `/api/v1/appeals/${id}`, 'DELETE');
}
