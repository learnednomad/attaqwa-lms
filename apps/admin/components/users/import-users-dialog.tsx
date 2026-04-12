/**
 * Import Users Dialog
 * Upload a spreadsheet (xlsx / xls / csv), preview detected rows, then
 * bulk-create users with a shared temp password. Shows a per-row report
 * after submission and offers a CSV download of the credentials.
 */

'use client';

import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  Upload,
  X,
  XCircle,
} from 'lucide-react';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

import {
  createImportedUsers,
  defaultTempPassword,
  type CreatedEntry,
} from './import-users-creator';
import {
  buildCredentialsCsv,
  parseUsersSpreadsheet,
  type ParseResult,
  type ParsedRow,
} from './import-users-parse';

type Step = 'pick' | 'preview' | 'importing' | 'done';

interface ImportUsersDialogProps {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
}

export function ImportUsersDialog({ open, onClose, onImported }: ImportUsersDialogProps) {
  const [step, setStep] = useState<Step>('pick');
  const [fileName, setFileName] = useState<string | null>(null);
  const [parse, setParse] = useState<ParseResult | null>(null);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [tempPassword, setTempPassword] = useState(defaultTempPassword());
  const [progress, setProgress] = useState<{ done: number; total: number }>({
    done: 0,
    total: 0,
  });
  const [report, setReport] = useState<CreatedEntry[] | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const reset = () => {
    setStep('pick');
    setFileName(null);
    setParse(null);
    setRows([]);
    setTempPassword(defaultTempPassword());
    setProgress({ done: 0, total: 0 });
    setReport(null);
    setParseError(null);
  };

  const handleClose = () => {
    if (step === 'importing') return; // don't close mid-import
    onClose();
    // delay reset so the closing animation doesn't show a flashed "pick" state
    setTimeout(reset, 200);
  };

  const handleFile = async (file: File) => {
    setParseError(null);
    setFileName(file.name);
    try {
      const result = await parseUsersSpreadsheet(file);
      setParse(result);
      setRows(result.rows);
      if (result.rows.length === 0) {
        setStep('pick');
        setParseError(
          result.warnings[0] || 'No user rows found. Make sure the first row has column headers.'
        );
      } else {
        setStep('preview');
      }
    } catch (err) {
      console.error('[ImportUsers] parse failed', err);
      setParseError(
        err instanceof Error ? err.message : 'Could not read that file. Is it a valid spreadsheet?'
      );
    }
  };

  const submitImport = async () => {
    if (!rows.length) return;
    setStep('importing');
    const results = await createImportedUsers(rows, {
      tempPassword,
      onProgress: (done, total) => setProgress({ done, total }),
    });
    setReport(results);
    setStep('done');
    onImported();
  };

  const downloadReport = () => {
    if (!report) return;
    const csv = buildCredentialsCsv(report);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `imported-users-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-users-title"
      className="fixed inset-0 z-50 flex items-start justify-center bg-charcoal-900/50 px-4 pt-12"
      onClick={handleClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-charcoal-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-charcoal-200 px-5 py-4">
          <div>
            <h2 id="import-users-title" className="text-base font-semibold text-charcoal-900">
              Import users from spreadsheet
            </h2>
            <p className="mt-0.5 text-xs text-charcoal-500">
              Upload an Excel or CSV file with at least an <code>Email</code> column.
              Optional: <code>Name</code>, <code>Role</code>.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={step === 'importing'}
            className="rounded-lg p-1 text-charcoal-500 hover:bg-charcoal-100 hover:text-charcoal-900 disabled:opacity-40"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {step === 'pick' ? (
            <PickStep onFile={handleFile} error={parseError} />
          ) : step === 'preview' ? (
            <PreviewStep
              fileName={fileName}
              parse={parse!}
              rows={rows}
              tempPassword={tempPassword}
              setTempPassword={setTempPassword}
              onReset={reset}
            />
          ) : step === 'importing' ? (
            <ImportingStep progress={progress} />
          ) : (
            <DoneStep report={report!} onDownload={downloadReport} />
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-charcoal-200 bg-charcoal-50 px-5 py-3">
          {step === 'preview' ? (
            <>
              <Button variant="ghost" onClick={reset}>
                Choose a different file
              </Button>
              <Button
                onClick={submitImport}
                disabled={parse?.valid === 0 || tempPassword.length < 8}
              >
                Import {parse?.valid ?? 0} user{(parse?.valid ?? 0) === 1 ? '' : 's'}
              </Button>
            </>
          ) : step === 'done' ? (
            <>
              <Button variant="ghost" onClick={reset}>
                Import another file
              </Button>
              <Button onClick={handleClose}>Done</Button>
            </>
          ) : step === 'importing' ? (
            <span className="text-xs text-charcoal-500">Please don&apos;t close this window…</span>
          ) : (
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step components
// ---------------------------------------------------------------------------

function PickStep({
  onFile,
  error,
}: {
  onFile: (file: File) => void;
  error: string | null;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed p-10 text-center transition-colors',
          dragOver
            ? 'border-primary-400 bg-primary-50'
            : 'border-charcoal-300 hover:border-charcoal-400 hover:bg-charcoal-50/50'
        )}
      >
        <FileSpreadsheet
          className={cn('h-10 w-10', dragOver ? 'text-primary-500' : 'text-charcoal-400')}
        />
        <p className="mt-3 text-sm font-medium text-charcoal-800">
          Drop your spreadsheet here or <span className="text-primary-600">browse</span>
        </p>
        <p className="mt-1 text-xs text-charcoal-500">
          .xlsx, .xls, or .csv · first row must be column headers
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
          className="sr-only"
        />
      </div>

      <div className="rounded-lg border border-charcoal-200 bg-charcoal-50/60 p-3 text-xs text-charcoal-600">
        <p className="font-medium text-charcoal-800">Expected columns</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5">
          <li>
            <strong>Email</strong> — required
          </li>
          <li>
            <strong>Name</strong> — optional; will be derived from the email if missing
          </li>
          <li>
            <strong>Role</strong> — optional; student / teacher / admin (default: student)
          </li>
        </ul>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}
    </div>
  );
}

function PreviewStep({
  fileName,
  parse,
  rows,
  tempPassword,
  setTempPassword,
  onReset,
}: {
  fileName: string | null;
  parse: ParseResult;
  rows: ParsedRow[];
  tempPassword: string;
  setTempPassword: (s: string) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-charcoal-200 bg-white p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-charcoal-900">
            {fileName || 'Uploaded file'}
          </p>
          <p className="mt-0.5 text-xs text-charcoal-500">
            {parse.valid} valid · {parse.invalid} skipped · {parse.total} total
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium text-primary-600 hover:underline"
        >
          Replace file
        </button>
      </div>

      {parse.warnings.length > 0 ? (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Heads up</p>
            <ul className="mt-1 list-inside list-disc">
              {parse.warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <div>
        <label
          htmlFor="import-temp-password"
          className="mb-1.5 flex items-center justify-between text-sm font-medium text-charcoal-700"
        >
          <span>Temporary password for everyone in this import</span>
          <span className="text-xs font-normal text-charcoal-500">
            Users are flagged to change it on first login
          </span>
        </label>
        <input
          id="import-temp-password"
          type="text"
          value={tempPassword}
          onChange={(e) => setTempPassword(e.target.value)}
          className={cn(
            'w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
            tempPassword.length < 8 ? 'border-red-400' : 'border-charcoal-300'
          )}
        />
        {tempPassword.length < 8 ? (
          <p className="mt-1 text-xs text-red-600">Minimum 8 characters.</p>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-lg border border-charcoal-200">
        <div className="max-h-[280px] overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-charcoal-50 text-xs uppercase tracking-wide text-charcoal-500">
              <tr>
                <th className="px-3 py-2 text-left">#</th>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Role</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100">
              {rows.map((row, i) => (
                <tr
                  key={`${row.email}-${i}`}
                  className={row.error ? 'bg-red-50/40' : ''}
                >
                  <td className="px-3 py-1.5 text-xs text-charcoal-400">{i + 1}</td>
                  <td className="px-3 py-1.5 text-charcoal-800">{row.name}</td>
                  <td className="px-3 py-1.5 text-charcoal-600">{row.email}</td>
                  <td className="px-3 py-1.5 text-xs capitalize text-charcoal-600">
                    {row.role}
                  </td>
                  <td className="px-3 py-1.5 text-xs">
                    {row.error ? (
                      <span className="inline-flex items-center gap-1 text-red-600">
                        <XCircle className="h-3.5 w-3.5" /> {row.error}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Ready
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ImportingStep({ progress }: { progress: { done: number; total: number } }) {
  const pct =
    progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      <div className="w-full max-w-sm">
        <div className="h-2 w-full overflow-hidden rounded-full bg-charcoal-100">
          <div
            className="h-full bg-primary-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-charcoal-600">
          Creating {progress.done} of {progress.total}… ({pct}%)
        </p>
      </div>
      <p className="text-xs text-charcoal-400">Please keep this window open.</p>
    </div>
  );
}

function DoneStep({
  report,
  onDownload,
}: {
  report: CreatedEntry[];
  onDownload: () => void;
}) {
  const created = report.filter((r) => r.status === 'created').length;
  const errored = report.filter((r) => r.status === 'error').length;
  const skipped = report.filter((r) => r.status === 'skipped').length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Created" value={created} tone="success" />
        <Stat label="Skipped" value={skipped} tone="warning" />
        <Stat label="Errors" value={errored} tone="danger" />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-primary-200 bg-primary-50 p-3 text-sm">
        <div>
          <p className="font-medium text-primary-900">
            <Upload className="mr-1 inline h-4 w-4" />
            Download credentials
          </p>
          <p className="text-xs text-primary-900/80">
            CSV includes every email, the temp password, and the status of each row.
          </p>
        </div>
        <Button size="sm" onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-charcoal-200">
        <div className="max-h-[260px] overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-charcoal-50 text-xs uppercase tracking-wide text-charcoal-500">
              <tr>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Role</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100">
              {report.map((r) => (
                <tr
                  key={`${r.email}-${r.status}`}
                  className={
                    r.status === 'error'
                      ? 'bg-red-50/40'
                      : r.status === 'skipped'
                        ? 'bg-amber-50/30'
                        : ''
                  }
                >
                  <td className="px-3 py-1.5 text-charcoal-800">{r.email}</td>
                  <td className="px-3 py-1.5 text-xs capitalize text-charcoal-600">
                    {r.role}
                  </td>
                  <td className="px-3 py-1.5 text-xs capitalize">
                    {r.status === 'created' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Created
                      </span>
                    ) : r.status === 'skipped' ? (
                      <span className="inline-flex items-center gap-1 text-amber-700">
                        <AlertTriangle className="h-3.5 w-3.5" /> Skipped
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600">
                        <XCircle className="h-3.5 w-3.5" /> Error
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-1.5 text-xs text-charcoal-500">
                    {r.reason || ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'success' | 'warning' | 'danger';
}) {
  return (
    <div
      className={cn(
        'rounded-lg border p-3',
        tone === 'success' && 'border-emerald-200 bg-emerald-50',
        tone === 'warning' && 'border-amber-200 bg-amber-50',
        tone === 'danger' && 'border-red-200 bg-red-50'
      )}
    >
      <p
        className={cn(
          'text-xs font-medium uppercase tracking-wide',
          tone === 'success' && 'text-emerald-700',
          tone === 'warning' && 'text-amber-700',
          tone === 'danger' && 'text-red-700'
        )}
      >
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-charcoal-900">{value}</p>
    </div>
  );
}
