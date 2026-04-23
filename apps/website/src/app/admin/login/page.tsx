'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, AlertCircle, Shield } from 'lucide-react';
import { MOSQUE_INFO } from '@attaqwa/shared';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      router.push('/admin');
    }
  }, [isAuthenticated, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/admin');
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-islamic-green-50 via-white to-islamic-green-100 px-4 py-12">
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm text-islamic-green-700 hover:text-islamic-green-800 font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to public site
      </Link>

      <Card className="w-full max-w-md shadow-lg border-islamic-green-100">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-islamic-green-100 border border-islamic-green-200 flex items-center justify-center">
            <Shield className="h-6 w-6 text-islamic-green-700" />
          </div>
          <CardTitle className="text-2xl font-bold text-islamic-green-800">
            {MOSQUE_INFO.name}
          </CardTitle>
          <CardDescription className="text-sm">
            Admin Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <div
                role="alert"
                className="flex gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-islamic-green-600 hover:bg-islamic-green-700"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>

            <p className="text-xs text-gray-500 text-center pt-2">
              For staff use only. Contact the masjid office if you need access.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}