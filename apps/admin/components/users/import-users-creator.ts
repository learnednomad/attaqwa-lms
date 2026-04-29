/**
 * Bulk-create users via BetterAuth's admin plugin. One request per user —
 * the admin plugin has no bulk endpoint and the dataset is small (dozens
 * to low hundreds). Each user is tagged with a `requiresPasswordChange`
 * flag in their `data` field for enforcement by the login flow.
 */

import { authClient } from '@/lib/auth-client';

import type { ParsedRow } from './import-users-parse';

export interface CreatedEntry {
  name: string;
  email: string;
  password: string;
  role: string;
  status: 'created' | 'skipped' | 'error';
  reason?: string;
}

 interface CreateOptions {
  tempPassword: string;
  onProgress?: (done: number, total: number) => void;
}

export async function createImportedUsers(
  rows: ParsedRow[],
  opts: CreateOptions
): Promise<CreatedEntry[]> {
  const eligible = rows.filter((r) => !r.error);
  const results: CreatedEntry[] = [];

  // Always include invalid rows in the report so the admin sees what was skipped.
  for (const skipped of rows.filter((r) => r.error)) {
    results.push({
      name: skipped.name,
      email: skipped.email,
      password: '',
      role: skipped.role,
      status: 'skipped',
      reason: skipped.error,
    });
  }

  let done = 0;
  const total = eligible.length;
  opts.onProgress?.(done, total);

  for (const row of eligible) {
    try {
      const res = await authClient.admin.createUser({
        name: row.name,
        email: row.email,
        password: opts.tempPassword,
        role: row.role as unknown as 'admin' | 'user',
        // Persist the flag so the student login flow can force a password
        // change on first login. Schema is declared as a BetterAuth
        // additionalField on the server — see apps/website/src/lib/auth.ts.
        data: { requiresPasswordChange: true } as unknown as Record<string, unknown>,
      });

      if ((res as any)?.error) {
        results.push({
          name: row.name,
          email: row.email,
          password: '',
          role: row.role,
          status: 'error',
          reason:
            (res as any).error?.message ||
            (res as any).error?.statusText ||
            'Server rejected request',
        });
      } else {
        results.push({
          name: row.name,
          email: row.email,
          password: opts.tempPassword,
          role: row.role,
          status: 'created',
        });
      }
    } catch (err) {
      results.push({
        name: row.name,
        email: row.email,
        password: '',
        role: row.role,
        status: 'error',
        reason: err instanceof Error ? err.message : 'Unexpected error',
      });
    } finally {
      done += 1;
      opts.onProgress?.(done, total);
    }
  }

  return results;
}

export function defaultTempPassword(): string {
  // Deterministic, memorable, easy to paste into the Excel of credentials.
  // Admin can override in the UI before submitting.
  const year = new Date().getFullYear();
  return `Welcome${year}!`;
}
