'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, GraduationCap, User } from 'lucide-react';
import { useStudentAuth } from '@/contexts/StudentAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function StudentLoginPage() {
  const { login } = useStudentAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Context handles router.push('/student/dashboard')
    } catch (err: unknown) {
      // Better-Auth surfaces INVALID_EMAIL / INVALID_EMAIL_OR_PASSWORD codes,
      // both of which a student reads as "I typed something wrong." Collapse
      // to a single human-friendly line.
      const raw = err instanceof Error ? err.message : '';
      const looksLikeCreds = /invalid email|invalid email or password|invalid credentials/i.test(raw);
      setError(looksLikeCreds ? 'Invalid email or password. Please try again.' : raw || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-green-50 to-islamic-gold-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-islamic-green-600 rounded-full mb-4">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-islamic-navy-800">Student Portal</h1>
          <p className="text-gray-600 mt-2">Masjid At-Taqwa Learning Management System</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back, Student!</CardTitle>
            <CardDescription>
              Access your courses, assignments, and track your Islamic education journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@attaqwa.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                    disabled={loading}
                    autoComplete="email"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-islamic-green-600 focus:ring-islamic-green-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="remember" className="ml-2 text-sm">
                    Remember me
                  </Label>
                </div>
                <Link 
                  href="/student/forgot-password" 
                  className="text-sm text-islamic-green-600 hover:text-islamic-green-700"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-islamic-green-600 hover:bg-islamic-green-700"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login to Student Portal'}
              </Button>
            </form>

          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-gray-600 text-center">
              Need help? Contact the <Link href="/contact" className="text-islamic-green-600 hover:underline">IT Support</Link>
            </div>
            <div className="text-sm text-gray-600 text-center">
              Not a student? <Link href="/admin/login" className="text-islamic-green-600 hover:underline">Staff Login</Link>
            </div>
          </CardFooter>
        </Card>

        {/* Additional Information */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Masjid At-Taqwa. All rights reserved.</p>
          <p className="mt-2">
            <Link href="/privacy" className="hover:text-islamic-green-600">Privacy Policy</Link>
            {' • '}
            <Link href="/terms" className="hover:text-islamic-green-600">Terms of Service</Link>
          </p>
        </div>
      </div>
    </div>
  );
}