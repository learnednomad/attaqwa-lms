/**
 * GET  /api/admin/itikaf-registrations  → list (admin-only proxy to Strapi)
 * POST /api/admin/itikaf-registrations  → create (admin-only)
 *
 * The browser cannot use STRAPI_API_TOKEN directly, so the admin pages call
 * these BFF routes instead of Strapi `/api/v1/itikaf-registrations`.
 */

import { NextRequest } from 'next/server';
import { proxyGet, proxyMutation } from '../_lib/strapi-proxy';

export async function GET(request: NextRequest) {
  return proxyGet(request, '/api/v1/itikaf-registrations');
}

export async function POST(request: NextRequest) {
  return proxyMutation(request, '/api/v1/itikaf-registrations', 'POST');
}
