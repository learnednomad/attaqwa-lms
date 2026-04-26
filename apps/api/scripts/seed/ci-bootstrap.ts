/**
 * CI Bootstrap — Strapi super-admin + API token
 *
 * Run AFTER Strapi is up on $STRAPI_URL. Idempotent.
 *
 * Outputs on stdout, one per line:
 *   STRAPI_ADMIN_JWT=...
 *   STRAPI_API_TOKEN=...
 *
 * CI captures these via `grep ... >> "$GITHUB_ENV"` so later steps see them.
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

// Strapi's own bootstrap (apps/api/src/bootstrap.ts:seedStrapiAdmin) already
// creates this super-admin on every boot. Reuse those credentials so we don't
// fight with the idempotent seeder.
const ADMIN_EMAIL = process.env.STRAPI_ADMIN_EMAIL || process.env.SEED_ADMIN_EMAIL || 'superadmin@attaqwa.org';
const ADMIN_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD || process.env.SEED_ADMIN_PASSWORD || 'SuperAdmin123!';
const TOKEN_NAME = process.env.STRAPI_TOKEN_NAME || 'ci-e2e-full-access';

interface Json {
  [k: string]: unknown;
}

async function http(path: string, init: RequestInit = {}): Promise<{ ok: boolean; status: number; body: Json | null }> {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      // Strapi 5 admin auth issues `Secure` cookies when NODE_ENV=production.
      // We hit Strapi over plain HTTP in CI, so without these headers Koa
      // refuses ("Cannot send secure cookie over unencrypted connection").
      // Combined with `STRAPI_PROXY=true` (config/server.ts), Koa trusts
      // these forwarded headers and treats the request as TLS-terminated
      // upstream. Mirrors what Caddy/Traefik would set in prod.
      'X-Forwarded-Proto': 'https',
      'X-Forwarded-Host': new URL(STRAPI_URL).host,
      ...(init.headers || {}),
    },
  });
  const body = (await res.json().catch(() => null)) as Json | null;
  return { ok: res.ok, status: res.status, body };
}

async function ensureAdmin(): Promise<string> {
  const creds = {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    firstname: 'CI',
    lastname: 'Bootstrap',
  };

  const reg = await http('/admin/register-admin', {
    method: 'POST',
    body: JSON.stringify(creds),
  });

  if (reg.ok) {
    const token = (reg.body as any)?.data?.token as string | undefined;
    if (token) {
      console.error('  + Strapi super-admin registered');
      return token;
    }
  }

  const login = await http('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email: creds.email, password: creds.password }),
  });

  const token = (login.body as any)?.data?.token as string | undefined;
  if (!login.ok || !token) {
    throw new Error(
      `Could not obtain admin JWT (register=${reg.status}, login=${login.status}, body=${JSON.stringify(login.body)})`,
    );
  }

  console.error('  = Strapi super-admin already exists, logged in');
  return token;
}

async function ensureApiToken(adminJwt: string): Promise<string> {
  // List existing — if our named token exists we can't fetch its accessKey back
  // (Strapi only returns the plaintext accessKey once at creation). Delete and recreate.
  const list = await http('/admin/api-tokens', {
    headers: { Authorization: `Bearer ${adminJwt}` },
  });

  if (list.ok) {
    const tokens = (list.body as any)?.data as Array<{ id: number; name: string }> | undefined;
    const existing = tokens?.find((t) => t.name === TOKEN_NAME);
    if (existing) {
      const del = await http(`/admin/api-tokens/${existing.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminJwt}` },
      });
      if (!del.ok) {
        throw new Error(`Failed to delete existing token id=${existing.id} status=${del.status}`);
      }
      console.error(`  - deleted stale token "${TOKEN_NAME}"`);
    }
  }

  const create = await http('/admin/api-tokens', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminJwt}` },
    body: JSON.stringify({
      name: TOKEN_NAME,
      description: 'CI e2e — delete freely',
      type: 'full-access',
      lifespan: null, // non-expiring; fine for ephemeral CI DB
    }),
  });

  const accessKey = (create.body as any)?.data?.accessKey as string | undefined;
  if (!create.ok || !accessKey) {
    throw new Error(
      `Failed to create API token (status=${create.status}, body=${JSON.stringify(create.body)})`,
    );
  }

  console.error(`  + created API token "${TOKEN_NAME}"`);
  return accessKey;
}

async function main() {
  console.error(`[ci-bootstrap] Strapi=${STRAPI_URL}`);
  const adminJwt = await ensureAdmin();
  const apiToken = await ensureApiToken(adminJwt);

  // Machine-readable output on stdout — one KEY=value pair per line.
  process.stdout.write(`STRAPI_ADMIN_JWT=${adminJwt}\n`);
  process.stdout.write(`STRAPI_API_TOKEN=${apiToken}\n`);
}

main().catch((err) => {
  console.error('[ci-bootstrap] FAILED:', err?.message || err);
  process.exit(1);
});
