'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen, Clock, Calendar, Award, Bell,
  Users, MessageSquare, FileText,
  ChevronRight, ChevronDown, Home, User, LogOut,
  GraduationCap, CreditCard, Building2, Heart, Search
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

interface StudentLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function StudentLayout({ children, title, subtitle }: StudentLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentData');
    router.push('/student/login');
  };

  const studentName = 'Ahmed Hassan';

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64',
        'lg:relative'
      )}>
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
            <ChevronRight className={cn('h-5 w-5 transition-transform', !sidebarCollapsed && 'rotate-180')} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {/* Dashboard Link */}
          <Link
            href="/student/dashboard"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium',
              pathname === '/student/dashboard'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-gray-600 hover:bg-gray-100'
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
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
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
                          ? 'bg-emerald-50 text-emerald-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
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
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
              {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
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
                  {studentName.split(' ').map(n => n[0]).join('')}
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
