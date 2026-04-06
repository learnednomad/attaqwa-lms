'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen, Clock, Calendar, Award, Bell,
  Users, MessageSquare, FileText,
  ChevronRight, ChevronDown, Home, LogOut,
  GraduationCap, BarChart3, Settings, Search,
  PenTool, ClipboardList, BookMarked, Menu, X
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
    await fetch('/api/teacher/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/teacher/login');
  };

  const teacherName = 'Sheikh Abdullah';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out',
        'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950',
        'border-r border-white/5',
        sidebarCollapsed ? 'w-[68px]' : 'w-[260px]',
        'lg:relative',
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-islamic-green-500 to-islamic-green-700 rounded-xl flex items-center justify-center shadow-lg shadow-islamic-green-600/20">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="font-semibold text-white text-[15px] tracking-tight">
                Teacher Portal
              </span>
            )}
          </div>
          <button
            onClick={() => {
              setSidebarCollapsed(!sidebarCollapsed);
              setMobileSidebarOpen(false);
            }}
            className="text-slate-500 hover:text-slate-300 transition-colors hidden lg:block"
          >
            <ChevronRight className={cn('h-4 w-4 transition-transform duration-200', !sidebarCollapsed && 'rotate-180')} />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="text-slate-500 hover:text-slate-300 transition-colors lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)] scrollbar-thin scrollbar-thumb-slate-700">
          {/* Dashboard Link */}
          <Link
            href="/teacher/dashboard"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[14px] transition-all duration-150',
              pathname === '/teacher/dashboard'
                ? 'bg-islamic-green-600 text-white shadow-lg shadow-islamic-green-600/25'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            )}
          >
            <Home className="h-[18px] w-[18px] flex-shrink-0" />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </Link>

          {/* Collapsible Sections */}
          {sidebarSections.map((section, index) => (
            <div key={section.title} className="mt-5">
              <button
                onClick={() => toggleSection(index)}
                className={cn(
                  'flex items-center justify-between w-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors',
                  'text-slate-500 hover:text-slate-300'
                )}
              >
                <div className="flex items-center gap-2">
                  {!sidebarCollapsed && <span>{section.title}</span>}
                </div>
                {!sidebarCollapsed && (
                  <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', section.isOpen && 'rotate-180')} />
                )}
              </button>

              {section.isOpen && !sidebarCollapsed && (
                <div className="mt-1 space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 text-[13px] rounded-lg transition-all duration-150 ml-1',
                          isActive
                            ? 'bg-islamic-green-600/15 text-islamic-green-400 font-medium border-l-2 border-islamic-green-400 -ml-0'
                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                        )}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {sidebarCollapsed && section.isOpen && (
                <div className="mt-1 space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={item.label}
                        className={cn(
                          'flex items-center justify-center p-2 rounded-lg transition-all duration-150',
                          isActive
                            ? 'bg-islamic-green-600/15 text-islamic-green-400'
                            : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 w-full p-3 border-t border-white/5 bg-slate-950/50 backdrop-blur-sm space-y-0.5">
          <Link
            href="/teacher/settings"
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2 text-[13px] rounded-lg transition-all duration-150',
              pathname === '/teacher/settings'
                ? 'bg-white/10 text-white'
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
            )}
          >
            <Settings className="h-[18px] w-[18px]" />
            {!sidebarCollapsed && <span>Settings</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-[13px] text-slate-500 hover:bg-white/5 hover:text-red-400 rounded-lg transition-all duration-150"
          >
            <LogOut className="h-[18px] w-[18px]" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/80">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 -ml-2 text-slate-500 hover:text-slate-700 lg:hidden rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 tracking-tight">{title}</h1>
                {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search students, courses..."
                  className="pl-9 w-64 h-9 text-sm bg-slate-50 border-slate-200 rounded-lg focus:bg-white focus:border-islamic-green-500 focus:ring-islamic-green-500/20"
                />
              </div>

              {/* Action Icons */}
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <MessageSquare className="h-[18px] w-[18px]" />
              </button>
              <button
                onClick={() => setNotificationsOpen(true)}
                className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Bell className="h-[18px] w-[18px]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                )}
              </button>

              {/* Divider */}
              <div className="w-px h-6 bg-slate-200 mx-1" />

              {/* User */}
              <div className="flex items-center gap-2.5 pl-1">
                <Avatar className="h-8 w-8 ring-2 ring-slate-100">
                  <AvatarFallback className="bg-gradient-to-br from-islamic-green-500 to-islamic-green-700 text-white text-xs font-medium">
                    {teacherName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-700 leading-none">{teacherName}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Teacher</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6">
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
