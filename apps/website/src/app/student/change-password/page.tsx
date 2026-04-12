'use client';

/**
 * Forced password change — landing page for users whose account was created
 * with a temp password (bulk import). Cannot proceed to the rest of the app
 * until a new password is set and the `requiresPasswordChange` flag is
 * cleared.
 */

import { Eye, EyeOff, KeyRound, ShieldCheck } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';

export default function ChangePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If a logged-in user reached this page but doesn't actually need to
  // change their password, send them back to the dashboard so they can't
  // get stuck here.
  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace('/student/login');
      return;
    }
    const requires =
      (session.user as unknown as { requiresPasswordChange?: boolean })
        .requiresPasswordChange === true;
    if (!requires) {
      const next = searchParams.get('next') || '/student/dashboard';
      router.replace(next);
    }
  }, [isPending, session, router, searchParams]);

  const validate = (): string | null => {
    if (!currentPassword) return 'Please enter your temporary password.';
    if (newPassword.length < 8) return 'New password must be at least 8 characters.';
    if (newPassword === currentPassword)
      return 'New password must be different from the temporary password.';
    if (newPassword !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      // Step 1 — change the password (verifies the current/temp password).
      const change = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      if ((change as { error?: { message?: string } })?.error) {
        setError(
          (change as { error?: { message?: string } }).error?.message ||
            'Current password is incorrect.'
        );
        return;
      }

      // Step 2 — clear the flag so we don't land here again on next login.
      try {
        await authClient.updateUser({
          requiresPasswordChange: false,
        } as unknown as { name?: string });
      } catch (flagErr) {
        // Non-fatal: the password is changed. The flag will still exist
        // until an admin clears it, which is a recoverable state.
        console.warn('[change-password] could not clear flag', flagErr);
      }

      const next = searchParams.get('next') || '/student/dashboard';
      router.replace(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-green-50 to-islamic-gold-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-islamic-green-600 rounded-full mb-4">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-islamic-navy-800">Set your password</h1>
          <p className="text-gray-600 mt-2">
            Your account was created with a temporary password. Please choose a new one
            before continuing.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New password</CardTitle>
            <CardDescription>
              Minimum 8 characters. Use something you&apos;ll remember.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="current-password">Temporary password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="current-password"
                    type={show ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    disabled={submitting}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="new-password">New password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={show ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type={show ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              {error ? (
                <Alert className="bg-red-50 border-red-200">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              ) : null}

              <Button
                type="submit"
                className="w-full bg-islamic-green-600 hover:bg-islamic-green-700"
                disabled={submitting}
              >
                {submitting ? 'Saving…' : 'Set new password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
