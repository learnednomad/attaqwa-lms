/**
 * GET    /api/admin/itikaf-registrations/[id]  → fetch one
 * PUT    /api/admin/itikaf-registrations/[id]  → update
 * DELETE /api/admin/itikaf-registrations/[id]  → delete
 */

import { NextRequest } from 'next/server';
import { proxyGet, proxyMutation } from '../../_lib/strapi-proxy';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return proxyGet(request, `/api/v1/itikaf-registrations/${id}`);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return proxyMutation(request, `/api/v1/itikaf-registrations/${id}`, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return proxyMutation(request, `/api/v1/itikaf-registrations/${id}`, 'DELETE');
}
