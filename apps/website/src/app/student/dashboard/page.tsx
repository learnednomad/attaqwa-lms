'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, Clock, Calendar, Award, Bell, TrendingUp, 
  CheckCircle, AlertCircle, Users, MessageSquare, FileText,
  ChevronRight, Home, User, LogOut, Menu, X, Zap,
  GraduationCap, Target, Brain, Star
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StudentData {
  id: string;
  name: string;
  email: string;
  studentId: string;
  ageTier: string;
  enrolledCourses: number;
  completedCourses: number;
  averageGrade: number;
  attendanceRate: number;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  nextClass: string;
  assignments: number;
  grade?: number;
}

interface Assignment {
  id: string;
  courseTitle: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'grade' | 'announcement' | 'message';
  timestamp: string;
  read: boolean;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // Check authentication - only access localStorage in useEffect to avoid hydration issues
    if (typeof window !== 'undefined') {
      const studentData = localStorage.getItem('studentData');
      if (!studentData) {
        router.push('/student/login');
        return;
      }
    }

    // Load mock data
    setStudent({
      id: '1',
      name: 'Ahmed Hassan',
      email: 'student@attaqwa.org',
      studentId: 'STU2024001',
      ageTier: 'HIGH_SCHOOL',
      enrolledCourses: 6,
      completedCourses: 12,
      averageGrade: 85,
      attendanceRate: 92,
    });

    setCourses([
      {
        id: '1',
        title: 'Quran Memorization - Juz 30',
        instructor: 'Imam Mohammad',
        progress: 75,
        nextClass: 'Today, 4:00 PM',
        assignments: 2,
        grade: 88,
      },
      {
        id: '2',
        title: 'Islamic Studies - Fiqh',
        instructor: 'Sheikh Abdullah',
        progress: 60,
        nextClass: 'Tomorrow, 3:00 PM',
        assignments: 1,
        grade: 82,
      },
      {
        id: '3',
        title: 'Arabic Language - Level 2',
        instructor: 'Ustadh Omar',
        progress: 45,
        nextClass: 'Wed, 5:00 PM',
        assignments: 3,
        grade: 90,
      },
      {
        id: '4',
        title: 'Hadith Studies',
        instructor: 'Dr. Fatima Ali',
        progress: 80,
        nextClass: 'Thu, 4:30 PM',
        assignments: 0,
        grade: 86,
      },
    ]);

    setAssignments([
      {
        id: '1',
        courseTitle: 'Quran Memorization',
        title: 'Memorize Surah An-Naba',
        dueDate: '2024-03-25',
        status: 'pending',
      },
      {
        id: '2',
        courseTitle: 'Islamic Studies',
        title: 'Essay on Prayer Importance',
        dueDate: '2024-03-26',
        status: 'submitted',
      },
      {
        id: '3',
        courseTitle: 'Arabic Language',
        title: 'Vocabulary Quiz Chapter 5',
        dueDate: '2024-03-24',
        status: 'graded',
        grade: 92,
      },
    ]);

    setNotifications([
      {
        id: '1',
        title: 'New Assignment Posted',
        message: 'Quran Memorization: New surah assignment available',
        type: 'assignment',
        timestamp: '2 hours ago',
        read: false,
      },
      {
        id: '2',
        title: 'Grade Posted',
        message: 'Your Arabic Language quiz has been graded',
        type: 'grade',
        timestamp: '5 hours ago',
        read: false,
      },
      {
        id: '3',
        title: 'Upcoming Event',
        message: 'Youth Islamic Conference this Saturday',
        type: 'announcement',
        timestamp: '1 day ago',
        read: true,
      },
    ]);

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentData');
    router.push('/student/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'graded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assignment': return FileText;
      case 'grade': return Award;
      case 'announcement': return Bell;
      case 'message': return MessageSquare;
      default: return Bell;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-islamic-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-islamic-navy-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 bg-islamic-navy-900">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-white mr-2" />
            <span className="text-white font-semibold text-lg">Student Portal</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-8">
          <Link href="/student/dashboard" className="flex items-center px-4 py-3 text-white bg-islamic-green-600">
            <Home className="h-5 w-5 mr-3" />
            Dashboard
          </Link>
          <Link href="/student/courses" className="flex items-center px-4 py-3 text-gray-300 hover:bg-islamic-navy-700">
            <BookOpen className="h-5 w-5 mr-3" />
            My Courses
          </Link>
          <Link href="/student/assignments" className="flex items-center px-4 py-3 text-gray-300 hover:bg-islamic-navy-700">
            <FileText className="h-5 w-5 mr-3" />
            Assignments
          </Link>
          <Link href="/student/grades" className="flex items-center px-4 py-3 text-gray-300 hover:bg-islamic-navy-700">
            <Award className="h-5 w-5 mr-3" />
            Grades
          </Link>
          <Link href="/student/calendar" className="flex items-center px-4 py-3 text-gray-300 hover:bg-islamic-navy-700">
            <Calendar className="h-5 w-5 mr-3" />
            Calendar
          </Link>
          <Link href="/student/messages" className="flex items-center px-4 py-3 text-gray-300 hover:bg-islamic-navy-700">
            <MessageSquare className="h-5 w-5 mr-3" />
            Messages
          </Link>
          <Link href="/student/profile" className="flex items-center px-4 py-3 text-gray-300 hover:bg-islamic-navy-700">
            <User className="h-5 w-5 mr-3" />
            Profile
          </Link>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-islamic-navy-700 rounded"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 flex-1">
        {/* Top Bar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex-1 px-4">
              <h1 className="text-2xl font-semibold text-islamic-navy-800">
                Assalamu Alaikum, {student?.name}!
              </h1>
              <p className="text-sm text-gray-600">Student ID: {student?.studentId}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative">
                <Bell className="h-6 w-6 text-gray-600" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              
              {/* Profile */}
              <Avatar>
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback>{student?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                    <p className="text-3xl font-bold text-islamic-navy-800">{student?.enrolledCourses}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-islamic-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Grade</p>
                    <p className="text-3xl font-bold text-islamic-navy-800">{student?.averageGrade}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Attendance</p>
                    <p className="text-3xl font-bold text-islamic-navy-800">{student?.attendanceRate}%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-3xl font-bold text-islamic-navy-800">{student?.completedCourses}</p>
                  </div>
                  <Award className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Courses */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Current Courses</span>
                    <Link href="/student/courses">
                      <Button variant="ghost" size="sm">
                        View All
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div key={course.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-islamic-navy-800">{course.title}</h4>
                            <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
                            <p className="text-sm text-gray-500">Next class: {course.nextClass}</p>
                          </div>
                          {course.grade && (
                            <Badge variant="outline">Grade: {course.grade}%</Badge>
                          )}
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                        {course.assignments > 0 && (
                          <div className="mt-2">
                            <Badge className="bg-yellow-100 text-yellow-800">
                              {course.assignments} pending assignment{course.assignments > 1 ? 's' : ''}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Assignments */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Upcoming Assignments</span>
                    <Link href="/student/assignments">
                      <Button variant="ghost" size="sm">
                        View All
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{assignment.title}</h4>
                          <p className="text-sm text-gray-600">{assignment.courseTitle}</p>
                          <p className="text-sm text-gray-500">Due: {assignment.dueDate}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {assignment.grade && (
                            <span className="text-sm font-medium">{assignment.grade}%</span>
                          )}
                          <Badge className={getStatusColor(assignment.status)}>
                            {assignment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {notifications.map((notification) => {
                      const Icon = getNotificationIcon(notification.type);
                      return (
                        <div 
                          key={notification.id} 
                          className={`p-3 rounded-lg border ${notification.read ? 'bg-white' : 'bg-blue-50 border-blue-200'}`}
                        >
                          <div className="flex items-start space-x-3">
                            <Icon className="h-5 w-5 text-gray-600 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{notification.title}</h4>
                              <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-2">{notification.timestamp}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Brain className="h-4 w-4 mr-2" />
                      Start Quiz Practice
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Target className="h-4 w-4 mr-2" />
                      View Study Plan
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Star className="h-4 w-4 mr-2" />
                      Check Achievements
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Zap className="h-4 w-4 mr-2" />
                      Join Live Session
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Study Streak */}
              <Card>
                <CardHeader>
                  <CardTitle>Study Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-600 mb-2">
                      🔥 7
                    </div>
                    <p className="text-sm text-gray-600">Days in a row!</p>
                    <p className="text-xs text-gray-500 mt-2">Keep it up!</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}