'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen, Clock, Calendar, Award, Bell, TrendingUp,
  CheckCircle, Users, MessageSquare, FileText,
  ChevronRight, ChevronDown, Home, User, LogOut,
  GraduationCap, CreditCard, Building2, Heart, Search,
  ExternalLink, MoreHorizontal, Menu, X
} from 'lucide-react';
import { useCourses, useEnrollments, useProgress } from '@/hooks/use-student-data';
import { useStudentAuth } from '@/contexts/StudentAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NotificationPanel, NotificationItem } from '@/components/notifications/notification-panel';
import { Recommendations } from '@/components/education/Recommendations';

interface StudentData {
  id: string;
  name: string;
  email: string;
  studentId: string;
  ageTier: string;
  enrolledCourses: number;
  completedCourses: number;
  totalCourses: number;
  averageGrade: number;
  maxGrade: number;
  activeClasses: number;
  totalClasses: number;
  attendanceRate: number;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorTitle: string;
  progress: number;
  nextClass: string;
  classTime: string;
  room: string;
  credits: number;
  assignments: number;
  grade?: number;
  avatarUrl?: string;
}

interface SidebarSection {
  title: string;
  icon: React.ElementType;
  items: {
    label: string;
    href: string;
    icon: React.ElementType;
  }[];
  isOpen: boolean;
}

export default function StudentDashboard() {
  const router = useRouter();
  const { user, logout } = useStudentAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [scheduleView, setScheduleView] = useState<'daily' | 'weekly'>('daily');
  // Notification state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Sidebar sections state
  const [sidebarSections, setSidebarSections] = useState<SidebarSection[]>([
    {
      title: 'Academic',
      icon: GraduationCap,
      isOpen: true,
      items: [
        { label: 'My Courses', href: '/student/courses', icon: BookOpen },
        { label: 'Class Schedule', href: '/student/schedule', icon: Clock },
        { label: 'Grades & Transcript', href: '/student/grades', icon: Award },
        { label: 'Assignments', href: '/student/assignments', icon: FileText },
        { label: 'Islamic Calendar', href: '/student/calendar', icon: Calendar },
      ]
    },
    {
      title: 'Documents',
      icon: FileText,
      isOpen: false,
      items: [
        { label: 'Official Transcript', href: '/student/transcript', icon: FileText },
        { label: 'Certificates', href: '/student/certificates', icon: Award },
      ]
    },
    {
      title: 'Financial',
      icon: CreditCard,
      isOpen: false,
      items: [
        { label: 'Tuition & Fees', href: '/student/tuition', icon: CreditCard },
        { label: 'Payment History', href: '/student/payments', icon: Clock },
        { label: 'Zakat Aid', href: '/student/financial-aid', icon: Heart },
      ]
    },
    {
      title: 'Student Life',
      icon: Users,
      isOpen: false,
      items: [
        { label: 'Study Groups', href: '/student/groups', icon: Users },
        { label: 'Masjid Events', href: '/student/events', icon: Calendar },
        { label: 'Community', href: '/student/community', icon: Building2 },
      ]
    },
  ]);

  const toggleSection = (index: number) => {
    setSidebarSections(prev => prev.map((section, i) =>
      i === index ? { ...section, isOpen: !section.isOpen } : section
    ));
  };

  // TanStack Query hooks
  const { data: apiCourses = [], isLoading: coursesLoading } = useCourses();
  const { data: enrollmentsData } = useEnrollments();
  const { data: allProgress = [] } = useProgress();

  const enrollments = enrollmentsData?.enrollments || [];
  const loading = coursesLoading;

  // Derive dashboard data from API results — no mock fallbacks
  const { student, courses } = useMemo(() => {
    // Calculate real lesson progress stats
    const lessonsCompleted = allProgress.filter(p => p.status === 'completed').length;

    // Transform API courses to match UI interface
    const transformedCourses: Course[] = apiCourses.slice(0, 4).map((course) => {
      const enrollment = enrollments.find(e => e.course?.id === course.id);
      return {
        id: String(course.id),
        title: course.title,
        instructor: course.instructor,
        instructorTitle: (course as unknown as Record<string, unknown>).instructor_title as string || '',
        progress: enrollment?.overall_progress || 0,
        nextClass: 'Not scheduled',
        classTime: 'Not scheduled',
        room: 'TBD',
        credits: 0,
        assignments: 0,
        grade: enrollment?.average_quiz_score || 0,
      };
    });

    // Calculate stats from enrollments
    const activeEnrollments = enrollments.filter(e => e.enrollment_status === 'active');

    const derivedStudent: StudentData = {
      id: user?.id || '',
      name: user?.name || 'Student',
      email: user?.email || '',
      studentId: user?.id || '',
      ageTier: '',
      enrolledCourses: apiCourses.length,
      completedCourses: lessonsCompleted,
      totalCourses: allProgress.length || apiCourses.length,
      averageGrade: enrollments.length > 0
        ? enrollments.reduce((sum, e) => sum + (e.average_quiz_score || 0), 0) / enrollments.length / 25
        : 0,
      maxGrade: 4.00,
      activeClasses: activeEnrollments.length || apiCourses.length,
      totalClasses: apiCourses.length,
      attendanceRate: 0,
    };

    return {
      student: derivedStudent,
      courses: transformedCourses,
    };
  }, [apiCourses, enrollments, allProgress, user]);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Enlight Style */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} lg:relative ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            {!sidebarCollapsed && <span className="font-semibold text-gray-900">At-Taqwa</span>}
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-gray-400 hover:text-gray-600"
          >
            <ChevronRight className={`h-5 w-5 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {/* Dashboard Link */}
          <Link
            href="/student/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-emerald-50 text-emerald-700 font-medium"
          >
            <Home className="h-5 w-5" />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </Link>

          {/* Collapsible Sections */}
          {sidebarSections.map((section, index) => (
            <div key={section.title} className="mt-4">
              <button
                onClick={() => toggleSection(index)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                <div className="flex items-center gap-2">
                  <section.icon className="h-4 w-4" />
                  {!sidebarCollapsed && <span>{section.title}</span>}
                </div>
                {!sidebarCollapsed && (
                  <ChevronDown className={`h-4 w-4 transition-transform ${section.isOpen ? 'rotate-180' : ''}`} />
                )}
              </button>

              {section.isOpen && !sidebarCollapsed && (
                <div className="mt-1 ml-4 space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 w-full p-2 border-t border-gray-200 bg-white">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <LogOut className="h-5 w-5" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 -ml-2 text-gray-500 hover:text-gray-700 lg:hidden flex-shrink-0"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 truncate">
                  Welcome Back, {student?.name}
                </h1>
                {apiCourses.length > 0 && (
                  <Badge className="mt-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search Here"
                  className="pl-9 w-64 bg-gray-50 border-gray-200"
                />
              </div>

              {/* Icons */}
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <MessageSquare className="h-5 w-5" />
              </button>
              <button
                onClick={() => setNotificationsOpen(true)}
                className="relative p-2 text-gray-500 hover:text-gray-700"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Avatar */}
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-emerald-100 text-emerald-700">
                  {student?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 sm:p-6">
          {/* Top Stats - 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
            {/* Courses Completed */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Award className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Courses Completed</span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">{student?.completedCourses}</span>
                  <span className="text-lg text-gray-400">/{student?.totalCourses}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-gray-500">Lessons completed</span>
                </div>
              </CardContent>
            </Card>

            {/* Grade Point Average */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Grade Point Average</span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">{student?.averageGrade.toFixed(2)}</span>
                  <span className="text-lg text-gray-400">/{student?.maxGrade.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-gray-500">Current average</span>
                </div>
              </CardContent>
            </Card>

            {/* Active Classes */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Active Classes</span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">{student?.activeClasses}</span>
                  <span className="text-lg text-gray-400">/{student?.totalClasses}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-gray-500">Currently enrolled</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Course Recommendations */}
          <div className="mb-6">
            <Recommendations />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Grade Chart + Payment Table */}
            <div className="lg:col-span-7 space-y-6">
              {/* Grade Point Average Chart — Coming Soon */}
              <Card className="bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Grade Point Average</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">GPA tracking over semesters</p>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                    <TrendingUp className="h-12 w-12 mb-3 opacity-40" />
                    <p className="text-sm font-medium text-gray-500">GPA tracking coming soon</p>
                    <p className="text-xs text-gray-400 mt-1">Grade history will appear here once available</p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment & Tuition History — Empty State */}
              <Card className="bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Payment & Tuition History</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Your payment and tuition records</p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <CreditCard className="h-12 w-12 mb-3 opacity-40" />
                    <p className="text-sm font-medium text-gray-500">No payment records found</p>
                    <p className="text-xs text-gray-400 mt-1">Payment history will appear here when available</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Daily Class Schedule */}
            <div className="lg:col-span-5">
              <Card className="bg-white shadow-sm h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">Daily Class Schedule</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">Schedule for your class in weekly & daily</p>
                    </div>
                    <Select value={scheduleView} onValueChange={(v) => setScheduleView(v as 'daily' | 'weekly')}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {courses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                      <Calendar className="h-12 w-12 mb-3 opacity-40" />
                      <p className="text-sm font-medium text-gray-500">No classes scheduled</p>
                      <p className="text-xs text-gray-400 mt-1">Enroll in courses to see your schedule</p>
                    </div>
                  ) : (
                    courses.map((course) => {
                      const getCourseCode = (title: string) => {
                        const words = title.split(' ').filter(w => w.length > 2);
                        if (words.length >= 2) {
                          return words.slice(0, 3).map(w => w[0]).join('').toUpperCase();
                        }
                        return title.substring(0, 3).toUpperCase();
                      };
                      const courseCode = getCourseCode(course.title);

                      return (
                        <div key={course.id} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <span className="text-emerald-700 font-bold text-xs">{courseCode}</span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{course.title}</h4>
                                <p className="text-sm text-gray-500">{course.classTime}</p>
                              </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-4 space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-500">Instructor</span>
                              <span className="ml-auto text-gray-900">
                                {course.instructor}{course.instructorTitle ? `, ${course.instructorTitle}` : ''}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-500">Room</span>
                              <span className="ml-auto text-gray-900">{course.room}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onMarkAsRead={handleMarkAsRead}
      />
    </div>
  );
}
