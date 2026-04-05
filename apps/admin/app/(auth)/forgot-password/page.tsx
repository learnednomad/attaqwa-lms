'use client';

import { BookOpen, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Integrate with auth provider's forgot password API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitted(true);
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <div className="mb-4 flex justify-center">
            <div className="rounded-lg bg-primary-600 p-3">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-center text-2xl font-bold text-charcoal-900">
            AttaqwaMasjid LMS
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              {submitted
                ? 'Check your email for reset instructions.'
                : "Enter your email and we'll send you a link to reset your password."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="rounded-full bg-primary-100 p-3">
                    <Mail className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <p className="text-center text-sm text-charcoal-600">
                  If an account exists for <strong>{email}</strong>, you will
                  receive a password reset email shortly.
                </p>
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  id="email"
                  type="email"
                  label="Email Address"
                  placeholder="teacher@attaqwamasjid.app"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>

                <Link
                  href="/login"
                  className="flex items-center justify-center text-sm text-charcoal-600 hover:text-primary-600"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back to Login
                </Link>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-sm text-charcoal-500">
          © {new Date().getFullYear()} AttaqwaMasjid. All rights reserved.
        </p>
      </div>
    </div>
  );
}
