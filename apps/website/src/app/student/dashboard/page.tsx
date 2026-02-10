'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen, Clock, Calendar, Award, Bell, TrendingUp,
  CheckCircle, Users, MessageSquare, FileText,
  ChevronRight, ChevronDown, Home, User, LogOut, Menu, X,
  GraduationCap, CreditCard, Building2, Heart, Search,
  Settings, ExternalLink, MoreHorizontal, AlertCircle
} from 'lucide-react';
import { useCourses, useEnrollments, useProgress } from '@/hooks/use-student-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NotificationPanel, NotificationItem, generateMockNotifications } from '@/components/notifications/notification-panel';
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

interface PaymentRecord {
  id: string;
  paymentId: string;
  category: string;
  date: string;
  status: 'completed' | 'on-verification' | 'pending';
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [scheduleView, setScheduleView] = useState<'daily' | 'weekly'>('daily');
  const [semesterFilter, setSemesterFilter] = useState('all');

  // Notification state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(generateMockNotifications());
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
  const { data: apiCourses = [], isLoading: coursesLoading, isError: coursesError } = useCourses();
  const { data: enrollmentsData } = useEnrollments();
  const { data: allProgress = [] } = useProgress();

  const enrollments = enrollmentsData?.enrollments || [];
  const loading = coursesLoading;

  // Mock data constants
  const mockStudent: StudentData = {
    id: '1',
    name: 'Ahmed Hassan',
    email: 'student@attaqwa.org',
    studentId: 'STU2024001',
    ageTier: 'HIGH_SCHOOL',
    enrolledCourses: 6,
    completedCourses: 120,
    totalCourses: 144,
    averageGrade: 3.75,
    maxGrade: 4.00,
    activeClasses: 15,
    totalClasses: 18,
    attendanceRate: 92,
  };

  const mockCourses: Course[] = [
    { id: '1', title: 'Quran Memorization - Juz 30', instructor: 'Imam Mohammad', instructorTitle: 'Hafiz', progress: 75, nextClass: 'Today', classTime: '08:30 AM - 09:30 AM', room: 'QUR-201', credits: 4, assignments: 2, grade: 88 },
    { id: '2', title: 'Islamic Studies - Fiqh', instructor: 'Sheikh Abdullah', instructorTitle: 'Ph.D', progress: 60, nextClass: 'Today', classTime: '09:30 AM - 01:30 PM', room: 'ISL-303', credits: 4, assignments: 1, grade: 82 },
    { id: '3', title: 'Arabic Language - Level 2', instructor: 'Ustadh Omar', instructorTitle: 'Ph.D', progress: 45, nextClass: 'Today', classTime: '01:30 PM - 03:30 PM', room: 'ARB-401', credits: 4, assignments: 3, grade: 90 },
    { id: '4', title: 'Hadith Studies', instructor: 'Dr. Fatima Ali', instructorTitle: 'Ph.D', progress: 80, nextClass: 'Tomorrow', classTime: '04:30 PM - 06:00 PM', room: 'HAD-102', credits: 3, assignments: 0, grade: 86 },
  ];

  const mockPayments: PaymentRecord[] = [
    { id: '1', paymentId: 'PID-331829', category: '6th Semester Tuition', date: '23 October 2024', status: 'on-verification' },
    { id: '2', paymentId: 'PID-331828', category: 'Quran Program 2025', date: '24 August 2024', status: 'completed' },
    { id: '3', paymentId: 'PID-331827', category: '5th Semester Tuition', date: '20 May 2024', status: 'completed' },
    { id: '4', paymentId: 'PID-331826', category: '4th Semester Tuition', date: '22 October 2023', status: 'completed' },
  ];

  // Derive dashboard data from TQ results
  const { student, courses, payments, dataSource } = useMemo(() => {
    if (coursesError || apiCourses.length === 0) {
      return {
        student: mockStudent,
        courses: mockCourses,
        payments: mockPayments,
        dataSource: 'mock' as const,
      };
    }

    // Get student data from localStorage if available
    const storedStudent = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('studentData') || '{}')
      : {};

    // Calculate real lesson progress stats
    const lessonsCompleted = allProgress.filter(p => p.status === 'completed').length;

    // Transform API courses to match UI interface
    const transformedCourses: Course[] = apiCourses.slice(0, 4).map((course, index) => {
      const enrollment = enrollments.find(e => e.course?.id === course.id);
      return {
        id: String(course.id),
        title: course.title,
        instructor: course.instructor,
        instructorTitle: course.subject === 'quran' ? 'Hafiz' : 'Ph.D',
        progress: enrollment?.overall_progress || 0,
        nextClass: index < 3 ? 'Today' : 'Tomorrow',
        classTime: ['08:30 AM - 09:30 AM', '09:30 AM - 01:30 PM', '01:30 PM - 03:30 PM', '04:30 PM - 06:00 PM'][index] || '08:00 AM',
        room: `${course.subject.substring(0, 3).toUpperCase()}-${201 + index}`,
        credits: course.duration_weeks > 20 ? 4 : 3,
        assignments: 0,
        grade: enrollment?.average_quiz_score || 0,
      };
    });

    // Calculate stats from enrollments
    const activeEnrollments = enrollments.filter(e => e.enrollment_status === 'active');
    const completedEnrollments = enrollments.filter(e => e.enrollment_status === 'completed');

    const derivedStudent: StudentData = {
      id: storedStudent.id?.toString() || '1',
      name: storedStudent.username || storedStudent.name || 'Student',
      email: storedStudent.email || 'student@attaqwa.org',
      studentId: `STU${new Date().getFullYear()}${String(storedStudent.id || 1).padStart(3, '0')}`,
      ageTier: 'HIGH_SCHOOL',
      enrolledCourses: apiCourses.length,
      completedCourses: lessonsCompleted,
      totalCourses: allProgress.length || apiCourses.length,
      averageGrade: enrollments.length > 0
        ? enrollments.reduce((sum, e) => sum + (e.average_quiz_score || 0), 0) / enrollments.length / 25
        : 3.5,
      maxGrade: 4.00,
      activeClasses: activeEnrollments.length || apiCourses.length,
      totalClasses: apiCourses.length + 2,
      attendanceRate: 92,
    };

    return {
      student: derivedStudent,
      courses: transformedCourses,
      payments: mockPayments,
      dataSource: 'api' as const,
    };
  }, [apiCourses, enrollments, allProgress, coursesError]);

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentData');
    router.push('/student/login');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-verification':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">On-Verification</Badge>;
      case 'completed':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
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
      {/* Sidebar - Enlight Style */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} lg:relative`}>
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
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome Back, {student?.name}
              </h1>
              {dataSource === 'api' ? (
                <Badge className="mt-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Live Data from Strapi
                </Badge>
              ) : (
                <Badge className="mt-1 bg-amber-100 text-amber-700 hover:bg-amber-100">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Demo Mode (Mock Data)
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4">
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
        <main className="p-6">
          {/* Top Stats - 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                  <span className="text-sm text-gray-500">Compared To Last Semester</span>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">+24 Courses</Badge>
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
                  <span className="text-sm text-gray-500">Compared To Last Semester</span>
                  <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">-0.25 Points</Badge>
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
                  <span className="text-sm text-gray-500">Active Course This Semester</span>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">+3 Active Course</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Course Recommendations */}
          <div className="mb-6">
            <Recommendations token={typeof window !== 'undefined' ? localStorage.getItem('studentToken') : null} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Grade Chart + Payment Table */}
            <div className="lg:col-span-7 space-y-6">
              {/* Grade Point Average Chart */}
              <Card className="bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">Grade Point Average</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">Comparison between your GPA and Average Student GPA</p>
                    </div>
                    <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="All Semesters" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Semesters</SelectItem>
                        <SelectItem value="current">Current</SelectItem>
                        <SelectItem value="previous">Previous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Simple Chart Placeholder - You can integrate a real chart library */}
                  <div className="h-64 relative">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 py-4">
                      <span>4.0</span>
                      <span>3.5</span>
                      <span>3.0</span>
                      <span>2.5</span>
                      <span>2.0</span>
                      <span>1.5</span>
                      <span>1.0</span>
                    </div>

                    {/* Chart Area */}
                    <div className="ml-8 h-full border-l border-b border-gray-200 relative">
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex flex-col justify-between">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="border-t border-gray-100 w-full"></div>
                        ))}
                      </div>

                      {/* Chart visualization - placeholder SVG */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                        {/* Your GPA line - purple dashed */}
                        <path
                          d="M 50 100 Q 150 90, 200 95 T 350 80 T 500 70"
                          fill="none"
                          stroke="#a855f7"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                        />
                        {/* Average GPA line - emerald solid */}
                        <path
                          d="M 50 120 Q 150 115, 200 110 T 350 100 T 500 85"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                        />
                        {/* Data points */}
                        <circle cx="350" cy="80" r="4" fill="#a855f7" />
                        <circle cx="350" cy="100" r="4" fill="#10b981" />
                      </svg>

                      {/* Legend tooltip */}
                      <div className="absolute top-1/4 left-1/2 bg-white shadow-lg rounded-lg p-3 text-xs border">
                        <p className="font-medium text-gray-700 mb-2">2nd Semester 2025</p>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                          <span className="text-gray-600">Your GPA</span>
                          <span className="font-semibold ml-auto">2.33</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span className="text-gray-600">Average GPA</span>
                          <span className="font-semibold ml-auto">2.49</span>
                        </div>
                      </div>

                      {/* X-axis labels */}
                      <div className="absolute bottom-0 left-0 right-0 translate-y-6 flex justify-between text-xs text-gray-400 px-4">
                        <span>1st Sem</span>
                        <span>2nd Sem</span>
                        <span>3rd Sem</span>
                        <span>4th Sem</span>
                        <span>5th Sem</span>
                        <span>6th Sem</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment & Tuition History */}
              <Card className="bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">Payment & Tuition History</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">Complete data about your payment and tuition history</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View All Payment
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Payment ID</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Payment Category</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Payment Status</th>
                          <th className="py-3 px-4 text-sm font-medium text-gray-500">...</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment) => (
                          <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-900">{payment.paymentId}</td>
                            <td className="py-3 px-4 text-sm text-gray-900">{payment.category}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">{payment.date}</td>
                            <td className="py-3 px-4">{getStatusBadge(payment.status)}</td>
                            <td className="py-3 px-4">
                              <button className="text-gray-400 hover:text-gray-600">
                                <ExternalLink className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                  {courses.map((course) => {
                    // Generate course code from title (e.g., "Stories of Prophets" -> "SFR")
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
                            <span className="ml-auto text-gray-900">{course.instructor}, {course.instructorTitle}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-500">Room</span>
                            <span className="ml-auto text-gray-900">{course.room}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-500">Course Credits</span>
                            <span className="ml-auto text-emerald-600 font-medium">{course.credits} Credits</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
