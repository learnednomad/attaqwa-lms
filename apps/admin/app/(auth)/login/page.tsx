/**
 * Login Page
 * Authentication page for teachers and admins
 */

'use client';

import { BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/hooks/use-auth';

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await signIn(email, password);

    if (!result.success) {
      setError(result.error || 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 lg:flex lg:flex-col lg:justify-center lg:p-12">
        <div className="mx-auto max-w-md text-white">
          <div className="mb-8 flex items-center space-x-3">
            <div className="rounded-lg bg-white p-2">
              <BookOpen className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AttaqwaMasjid</h1>
              <p className="text-primary-100">Learning Management System</p>
            </div>
          </div>

          <h2 className="mb-4 text-4xl font-bold">
            Empower Islamic Education
          </h2>
          <p className="mb-8 text-lg text-primary-100">
            Create engaging courses, track student progress, and inspire learning
            with our comprehensive LMS platform.
          </p>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="mt-1 rounded-full bg-primary-500 p-1">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Comprehensive Course Builder</h3>
                <p className="text-sm text-primary-100">
                  Create courses with video, audio, quizzes, and interactive content
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="mt-1 rounded-full bg-primary-500 p-1">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Real-Time Analytics</h3>
                <p className="text-sm text-primary-100">
                  Track student progress, engagement, and performance metrics
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="mt-1 rounded-full bg-primary-500 p-1">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Gamification System</h3>
                <p className="text-sm text-primary-100">
                  Motivate students with badges, achievements, and leaderboards
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex w-full items-center justify-center bg-gray-50 p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
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
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>
                Sign in to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

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

                <Input
                  id="password"
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-charcoal-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-charcoal-600">
                      Remember me
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  Sign In
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-charcoal-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-charcoal-500">
                      Need access?
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-center text-sm text-charcoal-600">
                  Contact your administrator to request teacher or admin access.
                </p>
              </div>
            </CardContent>
          </Card>

          <p className="mt-8 text-center text-sm text-charcoal-500">
            © 2025 AttaqwaMasjid. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
