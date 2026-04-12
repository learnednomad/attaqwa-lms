/**
 * Parse an uploaded spreadsheet into a normalized list of user rows.
 * Handles .xlsx / .xls / .csv. Column order doesn't matter — we match
 * header names fuzzily (email / e-mail / mail, name / full name, role).
 */

import * as XLSX from 'xlsx';

export interface ParsedRow {
  index: number;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  error?: string;
}

export interface ParseResult {
  rows: ParsedRow[];
  total: number;
  valid: number;
  invalid: number;
  warnings: string[];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normHeader(s: string): string {
  return s.trim().toLowerCase().replace(/[\s_\-]+/g, '');
}

function pickColumn(headers: string[], candidates: string[]): number {
  const norm = headers.map(normHeader);
  for (const cand of candidates) {
    const idx = norm.indexOf(cand);
    if (idx >= 0) return idx;
  }
  return -1;
}

function deriveNameFromEmail(email: string): string {
  const local = email.split('@')[0] || '';
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function coerceRole(value: unknown): ParsedRow['role'] {
  const v = String(value ?? '').trim().toLowerCase();
  if (v === 'admin') return 'admin';
  if (v === 'teacher' || v === 'instructor') return 'teacher';
  return 'student';
}

export async function parseUsersSpreadsheet(file: File): Promise<ParseResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return {
      rows: [],
      total: 0,
      valid: 0,
      invalid: 0,
      warnings: ['The file has no sheets.'],
    };
  }
  const sheet = workbook.Sheets[sheetName];
  // header: 1 gives us an array-of-arrays; we pick headers from row 0
  const aoa: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    blankrows: false,
  });

  if (aoa.length === 0) {
    return {
      rows: [],
      total: 0,
      valid: 0,
      invalid: 0,
      warnings: ['The first sheet is empty.'],
    };
  }

  const headers = (aoa[0] as unknown[]).map((h) => String(h ?? ''));
  const emailCol = pickColumn(headers, ['email', 'emailaddress', 'mail', 'e-mail']);
  const nameCol = pickColumn(headers, ['name', 'fullname', 'studentname', 'displayname']);
  const roleCol = pickColumn(headers, ['role', 'type']);

  const warnings: string[] = [];
  if (emailCol < 0) {
    warnings.push(
      'No "Email" column detected. Add a header row with at least an "Email" column.'
    );
    return { rows: [], total: 0, valid: 0, invalid: 0, warnings };
  }
  if (nameCol < 0) {
    warnings.push(
      'No "Name" column detected — we will derive names from the email prefix.'
    );
  }

  const seenEmails = new Set<string>();
  const rows: ParsedRow[] = [];
  for (let i = 1; i < aoa.length; i += 1) {
    const raw = aoa[i];
    const emailRaw = String(raw[emailCol] ?? '').trim().toLowerCase();
    if (!emailRaw) continue; // skip fully blank rows
    const nameRaw = nameCol >= 0 ? String(raw[nameCol] ?? '').trim() : '';
    const roleRaw = roleCol >= 0 ? raw[roleCol] : 'student';

    const row: ParsedRow = {
      index: rows.length,
      email: emailRaw,
      name: nameRaw || deriveNameFromEmail(emailRaw),
      role: coerceRole(roleRaw),
    };

    if (!EMAIL_RE.test(emailRaw)) {
      row.error = 'Invalid email format';
    } else if (seenEmails.has(emailRaw)) {
      row.error = 'Duplicate email in this file';
    } else {
      seenEmails.add(emailRaw);
    }

    rows.push(row);
  }

  return {
    rows,
    total: rows.length,
    valid: rows.filter((r) => !r.error).length,
    invalid: rows.filter((r) => !!r.error).length,
    warnings,
  };
}

/** Build a downloadable CSV of generated credentials. */
export function buildCredentialsCsv(
  entries: Array<{ name: string; email: string; password: string; role: string; status: string }>
): string {
  const header = ['Name', 'Email', 'Password', 'Role', 'Status'];
  const rows = entries.map((e) =>
    [e.name, e.email, e.password, e.role, e.status]
      .map((v) => {
        const s = String(v ?? '');
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      })
      .join(',')
  );
  return [header.join(','), ...rows].join('\n');
}
