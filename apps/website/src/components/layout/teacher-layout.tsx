'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen, Clock, Calendar, Award, Bell,
  Users, MessageSquare, FileText,
  ChevronRight, ChevronDown, Home, LogOut,
  GraduationCap, BarChart3, Settings, Search,
  PenTool, ClipboardList, BookMarked, Menu
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { NotificationPanel, NotificationItem, generateMockNotifications } from '@/components/notifications/notification-panel';

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

interface TeacherLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function TeacherLayout({ children, title, subtitle }: TeacherLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(generateMockNotifications());

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const [sidebarSections, setSidebarSections] = useState<SidebarSection[]>([
    {
      title: 'Teaching',
      icon: BookMarked,
      isOpen: true,
      items: [
        { label: 'My Courses', href: '/teacher/courses', icon: BookOpen },
        { label: 'Class Schedule', href: '/teacher/schedule', icon: Clock },
        { label: 'Lesson Content', href: '/teacher/lessons', icon: FileText },
        { label: 'Assignments', href: '/teacher/assignments', icon: ClipboardList },
      ]
    },
    {
      title: 'Students',
      icon: Users,
      isOpen: true,
      items: [
        { label: 'Student Roster', href: '/teacher/students', icon: Users },
        { label: 'Grades & Assessment', href: '/teacher/grades', icon: PenTool },
        { label: 'Progress Reports', href: '/teacher/progress', icon: BarChart3 },
        { label: 'Attendance', href: '/teacher/attendance', icon: ClipboardList },
      ]
    },
    {
      title: 'Resources',
      icon: FileText,
      isOpen: false,
      items: [
        { label: 'Teaching Materials', href: '/teacher/materials', icon: BookOpen },
        { label: 'Islamic Calendar', href: '/teacher/calendar', icon: Calendar },
        { label: 'Certificates', href: '/teacher/certificates', icon: Award },
      ]
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      isOpen: false,
      items: [
        { label: 'Course Analytics', href: '/teacher/analytics', icon: BarChart3 },
        { label: 'Student Engagement', href: '/teacher/engagement', icon: Users },
      ]
    },
  ]);

  const toggleSection = (index: number) => {
    setSidebarSections(prev => prev.map((section, i) =>
      i === index ? { ...section, isOpen: !section.isOpen } : section
    ));
  };

  const handleLogout = async () => {
    // Clear httpOnly cookie via API
    await fetch('/api/teacher/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/teacher/login');
  };

  const teacherName = 'Sheikh Abdullah';

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 bg-slate-900 border-r border-slate-800 transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64',
        'lg:relative',
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            {!sidebarCollapsed && <span className="font-semibold text-white">Teacher Portal</span>}
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-slate-400 hover:text-slate-200"
          >
            <ChevronRight className={cn('h-5 w-5 transition-transform', !sidebarCollapsed && 'rotate-180')} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {/* Dashboard Link */}
          <Link
            href="/teacher/dashboard"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium',
              pathname === '/teacher/dashboard'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-300 hover:bg-slate-800'
            )}
          >
            <Home className="h-5 w-5" />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </Link>

          {/* Collapsible Sections */}
          {sidebarSections.map((section, index) => (
            <div key={section.title} className="mt-4">
              <button
                onClick={() => toggleSection(index)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-200"
              >
                <div className="flex items-center gap-2">
                  <section.icon className="h-4 w-4" />
                  {!sidebarCollapsed && <span>{section.title}</span>}
                </div>
                {!sidebarCollapsed && (
                  <ChevronDown className={cn('h-4 w-4 transition-transform', section.isOpen && 'rotate-180')} />
                )}
              </button>

              {section.isOpen && !sidebarCollapsed && (
                <div className="mt-1 ml-4 space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 text-sm rounded-lg',
                        pathname === item.href
                          ? 'bg-indigo-600/20 text-indigo-400 font-medium'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      )}
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

        {/* Bottom Actions */}
        <div className="absolute bottom-0 w-full p-2 border-t border-slate-800 bg-slate-900 space-y-1">
          <Link
            href="/teacher/settings"
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-lg"
          >
            <Settings className="h-5 w-5" />
            {!sidebarCollapsed && <span>Settings</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-lg"
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 text-gray-500 hover:text-gray-700 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students, courses..."
                  className="pl-9 w-72 bg-gray-50 border-gray-200"
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
                <AvatarFallback className="bg-indigo-100 text-indigo-700">
                  {teacherName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        notifications={notifications}
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onMarkAllRead={handleMarkAllRead}
        onMarkAsRead={handleMarkAsRead}
      />
    </div>
  );
}
