/**
 * Sidebar Navigation Component
 * Main navigation for dashboard
 */

'use client';

import {
  BarChart3,
  BookOpen,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  GraduationCap,
  Home,
  Library,
  Shield,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/lib/hooks/use-auth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['teacher', 'admin'] },
  { name: 'Courses', href: '/courses', icon: BookOpen, roles: ['teacher', 'admin'] },
  { name: 'Library', href: '/library', icon: Library, roles: ['admin'] },
  { name: 'Users', href: '/students', icon: Users, roles: ['teacher', 'admin'] },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['teacher', 'admin'] },
  { name: 'Prayer Times', href: '/prayer-times', icon: Clock, roles: ['admin'] },
  { name: 'Moderation', href: '/moderation', icon: Shield, roles: ['admin'] },
];

const COLLAPSE_STORAGE_KEY = 'admin-sidebar-collapsed';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { user, checkRole } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Restore collapsed preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(COLLAPSE_STORAGE_KEY);
      if (saved === '1') setCollapsed(true);
    } catch {}
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_STORAGE_KEY, next ? '1' : '0');
      } catch {}
      return next;
    });
  };

  const filteredNavigation = navigation.filter((item) => {
    if (!user) return false;
    return checkRole(item.roles);
  });

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-charcoal-200 bg-white transition-all duration-300 ease-in-out lg:relative lg:translate-x-0',
        // Width: collapsed only applies on lg+ (always full on mobile drawer)
        collapsed ? 'w-64 lg:w-[72px]' : 'w-64',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center justify-between border-b border-charcoal-200',
          collapsed ? 'px-3 py-4 lg:justify-center' : 'p-6'
        )}
      >
        <div className={cn('flex items-center min-w-0', collapsed ? 'lg:justify-center' : 'space-x-2')}>
          <div className="rounded-lg bg-primary-600 p-2 flex-shrink-0">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div className={cn('min-w-0', collapsed && 'lg:hidden')}>
            <h1 className="text-lg font-bold text-primary-600 leading-tight truncate">
              Masjid At-Taqwa
            </h1>
            <p className="text-xs text-charcoal-600">LMS Admin</p>
          </div>
        </div>
        <button
          onClick={onCloseMobile}
          className="rounded-md p-1.5 text-charcoal-500 hover:bg-charcoal-100 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className={cn('flex-1 space-y-1 overflow-y-auto', collapsed ? 'lg:px-2 p-4' : 'p-4')}>
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={cn(
                'flex items-center rounded-lg text-sm font-medium transition-colors',
                collapsed ? 'px-3 py-2.5 lg:justify-center lg:px-2.5' : 'px-3 py-2.5',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-charcoal-700 hover:bg-charcoal-50 hover:text-charcoal-900'
              )}
            >
              <item.icon className={cn('h-5 w-5 flex-shrink-0', !collapsed && 'mr-3', collapsed && 'mr-3 lg:mr-0')} />
              <span className={cn(collapsed && 'lg:hidden')}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle (desktop only) */}
      <div className="hidden lg:block border-t border-charcoal-200 p-2">
        <button
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'flex w-full items-center rounded-lg px-3 py-2 text-xs font-medium text-charcoal-500 transition-colors hover:bg-charcoal-50 hover:text-charcoal-900',
            collapsed && 'justify-center'
          )}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronsLeft className="mr-2 h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* User Info */}
      <div className={cn('border-t border-charcoal-200', collapsed ? 'p-2 lg:p-2' : 'p-4')}>
        <div
          className={cn(
            'flex items-center',
            collapsed ? 'lg:justify-center space-x-3 lg:space-x-0' : 'space-x-3'
          )}
          title={collapsed ? `${user?.name} (${user?.role})` : undefined}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700 flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className={cn('flex-1 overflow-hidden', collapsed && 'lg:hidden')}>
            <p className="truncate text-sm font-medium text-charcoal-900">
              {user?.name || 'User'}
            </p>
            <p className="truncate text-xs text-charcoal-500">
              {user?.role || 'Teacher'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
