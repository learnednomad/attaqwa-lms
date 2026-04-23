/**
 * GET  /api/admin/appeals  → list (admin-only proxy to Strapi)
 * POST /api/admin/appeals  → create (admin-only)
 */

import { NextRequest } from 'next/server';
import { proxyGet, proxyMutation } from '../_lib/strapi-proxy';

export async function GET(request: NextRequest) {
  return proxyGet(request, '/api/v1/appeals');
}

export async function POST(request: NextRequest) {
  return proxyMutation(request, '/api/v1/appeals', 'POST');
}
