'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Mail, Lock, Loader2, BookOpen, Users, BarChart3, Eye, EyeOff } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function TeacherLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900" />

        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        {/* Decorative Gradient Orbs */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-islamic-green-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-islamic-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-islamic-green-600/30">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AttaqwaMasjid</h2>
              <p className="text-sm text-islamic-green-300">Teacher Portal</p>
            </div>
          </div>

          {/* Tagline */}
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            Inspire the Next<br />
            <span className="bg-gradient-to-r from-islamic-green-400 to-purple-400 bg-clip-text text-transparent">
              Generation of Scholars
            </span>
          </h1>
          <p className="text-lg text-slate-400 mb-12 max-w-md">
            Manage your courses, track student progress, and nurture Islamic knowledge with powerful teaching tools.
          </p>

          {/* Feature Highlights */}
          <div className="space-y-6">
            <div className="flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-lg bg-islamic-green-600/20 border border-islamic-green-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-islamic-green-600/30 transition-colors">
                <BookOpen className="h-5 w-5 text-islamic-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Course Management</h3>
                <p className="text-sm text-slate-400">Create lessons, quizzes, and track curriculum progress</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600/30 transition-colors">
                <Users className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Student Insights</h3>
                <p className="text-sm text-slate-400">Monitor attendance, grades, and identify students needing support</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600/30 transition-colors">
                <BarChart3 className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Real-Time Analytics</h3>
                <p className="text-sm text-slate-400">Engagement trends, quiz performance, and completion rates</p>
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
            <div className="w-10 h-10 bg-islamic-green-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">Teacher Portal</span>
          </div>

          <Card className="border-0 shadow-xl shadow-slate-200/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-slate-900">Welcome Back</CardTitle>
              <CardDescription className="text-slate-500">
                Sign in to your teaching dashboard
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
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="teacher@attaqwa.org"
                      className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-islamic-green-500 focus:ring-islamic-green-500/20 transition-colors"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                      Password
                    </Label>
                    <Link
                      href="/teacher/forgot-password"
                      className="text-xs text-islamic-green-600 hover:text-islamic-green-700 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-islamic-green-500 focus:ring-islamic-green-500/20 transition-colors"
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

                <Button
                  type="submit"
                  className="w-full h-11 bg-islamic-green-600 hover:bg-islamic-green-700 text-white font-medium shadow-lg shadow-islamic-green-600/25 hover:shadow-islamic-green-600/40 transition-all"
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

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-slate-500">
              Need help?{' '}
              <Link href="/contact" className="text-islamic-green-600 hover:text-islamic-green-700 font-medium">
                Contact Administration
              </Link>
            </p>
            <div className="pt-3 border-t border-slate-200">
              <Link
                href="/student/login"
                className="text-sm text-slate-500 hover:text-slate-700 font-medium"
              >
                Student? Go to Student Portal &rarr;
              </Link>
            </div>
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
