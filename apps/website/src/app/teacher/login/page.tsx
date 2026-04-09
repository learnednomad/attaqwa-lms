'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function TeacherLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: authError } = await authClient.signIn.email({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message || 'Invalid credentials');
      }

      router.push('/teacher/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Green Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: 'hsl(142, 76%, 36%)' }}>
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AttaqwaMasjid</h2>
              <p className="text-sm text-white/80">Learning Management System</p>
            </div>
          </div>

          {/* Tagline */}
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            Empower Islamic<br />Education
          </h1>
          <p className="text-lg text-white/80 mb-12 max-w-md">
            Create engaging courses, track student progress, and inspire learning with our comprehensive LMS platform.
          </p>

          {/* Feature Highlights */}
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-white/90 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white">Comprehensive Course Builder</h3>
                <p className="text-sm text-white/70">Create courses with video, audio, quizzes, and interactive content</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-white/90 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white">Real-Time Analytics</h3>
                <p className="text-sm text-white/70">Track student progress, engagement, and performance metrics</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-white/90 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white">Gamification System</h3>
                <p className="text-sm text-white/70">Motivate students with badges, achievements, and leaderboards</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gradient-to-b from-slate-50 to-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">Teacher Portal</span>
          </div>

          <Card className="border-0 shadow-xl shadow-slate-200/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-slate-900">Welcome Back</CardTitle>
              <CardDescription className="text-slate-500">
                Sign in to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="teacher@attaqwa.org"
                    className="h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-primary focus:ring-primary/20 transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="pr-10 h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-primary focus:ring-primary/20 transition-colors"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember me + Forgot password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 accent-primary focus:ring-primary/20"
                    />
                    <span className="text-sm text-slate-600">Remember me</span>
                  </label>
                  <Link
                    href="/teacher/forgot-password"
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-6 text-center space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-sm text-slate-400">Need access?</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <p className="text-sm text-slate-500">
              Contact your administrator to request teacher or admin access.
            </p>
          </div>

          {/* Copyright */}
          <p className="mt-8 text-center text-xs text-slate-400">
            &copy; {new Date().getFullYear()} AttaqwaMasjid. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
