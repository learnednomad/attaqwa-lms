'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, BookOpen, GraduationCap, User } from 'lucide-react';
import { useStudentAuth } from '@/contexts/StudentAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function StudentLoginPage() {
  const { login, loginWithStudentId } = useStudentAuth();
  const [email, setEmail] = useState('student1@attaqwa.test');
  const [password, setPassword] = useState('Student123!');
  const [studentId, setStudentId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginMethod, setLoginMethod] = useState<'email' | 'studentId'>('email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (loginMethod === 'email') {
        await login(email, password);
      } else {
        await loginWithStudentId(studentId, password);
      }
      // Context handles router.push('/student/dashboard')
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoginMethod('email');
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
              {/* Login Method Tabs */}
              <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as 'email' | 'studentId')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email">Email Login</TabsTrigger>
                  <TabsTrigger value="studentId">Student ID</TabsTrigger>
                </TabsList>
                
                <TabsContent value="email" className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="student@attaqwa.org"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required={loginMethod === 'email'}
                        className="pl-10"
                        disabled={loading}
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="studentId" className="space-y-4">
                  <div>
                    <Label htmlFor="studentId">Student ID</Label>
                    <div className="relative">
                      <Input
                        id="studentId"
                        type="text"
                        placeholder="STU2024001"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        required={loginMethod === 'studentId'}
                        className="pl-10"
                        disabled={loading}
                      />
                      <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

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

            {/* Demo Accounts */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Demo Student Accounts:</p>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleDemoLogin('student1@attaqwa.test', 'Student123!')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Ahmed Abdullah (student1@attaqwa.test)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleDemoLogin('student2@attaqwa.test', 'Student123!')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Fatima Hassan (student2@attaqwa.test)
                </Button>
              </div>
            </div>
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
          <p>© 2024 Masjid At-Taqwa. All rights reserved.</p>
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