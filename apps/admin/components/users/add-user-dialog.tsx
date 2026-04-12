/**
 * Add User Dialog
 * Creates a user via BetterAuth's admin plugin. Supports the three roles
 * the rest of the app understands (student / teacher / admin).
 */

'use client';

import { Loader2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';

type Role = 'student' | 'teacher' | 'admin';

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  defaultRole?: Role;
}

interface FormState {
  name: string;
  email: string;
  password: string;
  role: Role;
}

const INITIAL: FormState = {
  name: '',
  email: '',
  password: '',
  role: 'student',
};

export function AddUserDialog({
  open,
  onClose,
  onCreated,
  defaultRole = 'student',
}: AddUserDialogProps) {
  const [form, setForm] = useState<FormState>({ ...INITIAL, role: defaultRole });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  // Reset and focus when opened
  useEffect(() => {
    if (!open) return;
    setForm({ ...INITIAL, role: defaultRole });
    setErrors({});
    setServerError(null);
    setSubmitting(false);
    setShowPassword(false);
    setTimeout(() => nameRef.current?.focus(), 0);
  }, [open, defaultRole]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, submitting]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const generatePassword = () => {
    const alphabet =
      'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pass = '';
    const buf = new Uint32Array(14);
    crypto.getRandomValues(buf);
    for (const n of buf) pass += alphabet[n % alphabet.length];
    update('password', pass);
    setShowPassword(true);
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = 'Name is required';
    else if (form.name.trim().length < 2) next.name = 'Name is too short';

    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = 'Enter a valid email';

    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 8)
      next.password = 'Password must be at least 8 characters';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || submitting) return;
    setSubmitting(true);
    setServerError(null);
    try {
      // BetterAuth's client types restrict `role` to 'admin' | 'user',
      // but the server (and the existing seeded users) accept custom roles
      // like 'teacher' / 'student'. Cast to bypass the narrow client typing.
      const res = await authClient.admin.createUser({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role as unknown as 'admin' | 'user',
      });
      if ((res as any)?.error) {
        const msg =
          (res as any).error?.message ||
          (res as any).error?.statusText ||
          'Could not create user.';
        setServerError(msg);
        return;
      }
      onCreated();
      onClose();
    } catch (err) {
      console.error('[AddUserDialog] createUser failed', err);
      const msg =
        err instanceof Error
          ? err.message
          : 'Unexpected error while creating user.';
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-user-title"
      className="fixed inset-0 z-50 flex items-start justify-center bg-charcoal-900/50 px-4 pt-20"
      onClick={() => !submitting && onClose()}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-xl border border-charcoal-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-charcoal-200 px-5 py-4">
          <div>
            <h2 id="add-user-title" className="text-base font-semibold text-charcoal-900">
              Add user
            </h2>
            <p className="mt-0.5 text-xs text-charcoal-500">
              Creates the account immediately. Share the credentials with the user yourself.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-1 text-charcoal-500 hover:bg-charcoal-100 hover:text-charcoal-900 disabled:opacity-40"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 px-5 py-5">
          {serverError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {serverError}
            </div>
          ) : null}

          <Input
            ref={nameRef}
            label="Full name"
            placeholder="e.g., Amina Yusuf"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            error={errors.name}
            required
          />

          <Input
            label="Email"
            type="email"
            placeholder="user@example.com"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            error={errors.email}
            required
          />

          <div>
            <label
              htmlFor="add-user-role"
              className="mb-1.5 block text-sm font-medium text-charcoal-700"
            >
              Role
            </label>
            <select
              id="add-user-role"
              value={form.role}
              onChange={(e) => update('role', e.target.value as Role)}
              className="w-full rounded-lg border border-charcoal-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="add-user-password"
              className="mb-1.5 flex items-center justify-between text-sm font-medium text-charcoal-700"
            >
              <span>
                Password <span className="text-red-500">*</span>
              </span>
              <button
                type="button"
                onClick={generatePassword}
                className="text-xs font-medium text-primary-600 hover:text-primary-700"
              >
                Generate
              </button>
            </label>
            <div className="relative">
              <input
                id="add-user-password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="At least 8 characters"
                className={`w-full rounded-lg border px-3 py-2 pr-20 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                  errors.password ? 'border-red-500' : 'border-charcoal-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-charcoal-600 hover:bg-charcoal-100"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password ? (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            ) : (
              <p className="mt-1 text-xs text-charcoal-500">
                Minimum 8 characters. Use Generate for a strong random password.
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-charcoal-200 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating…
                </>
              ) : (
                'Create user'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
