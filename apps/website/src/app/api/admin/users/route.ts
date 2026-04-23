/**
 * GET /api/admin/users
 * Lists BetterAuth users (admin-only). Read-only for now.
 */

import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { requireAdmin } from '../_lib/strapi-proxy';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response!;

  try {
    const result = await pool.query(
      `SELECT id, name, email, role, "emailVerified", banned, "createdAt", "updatedAt"
       FROM "user"
       ORDER BY "createdAt" DESC
       LIMIT 200`
    );
    return NextResponse.json({
      data: result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role || 'user',
        emailVerified: Boolean(row.emailVerified),
        banned: Boolean(row.banned),
        createdAt: row.createdAt?.toISOString?.() ?? row.createdAt,
        updatedAt: row.updatedAt?.toISOString?.() ?? row.updatedAt,
      })),
      total: result.rowCount ?? 0,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'DatabaseError',
          message: err instanceof Error ? err.message : 'Failed to query users',
        },
      },
      { status: 500 }
    );
  }
}
