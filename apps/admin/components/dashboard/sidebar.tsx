/**
 * Sidebar Navigation Component
 * Main navigation for dashboard
 */

'use client';

import {
  BarChart3,
  BookOpen,
  GraduationCap,
  Home,
  Settings,
  Trophy,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/lib/hooks/use-auth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['teacher', 'admin'] },
  { name: 'Courses', href: '/courses', icon: BookOpen, roles: ['teacher', 'admin'] },
  { name: 'Students', href: '/students', icon: Users, roles: ['teacher', 'admin'] },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['teacher', 'admin'] },
  { name: 'Achievements', href: '/achievements', icon: Trophy, roles: ['admin'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, checkRole } = useAuth();

  const filteredNavigation = navigation.filter((item) => {
    if (!user) return false;
    return checkRole(item.roles);
  });

  return (
    <div className="flex h-screen w-64 flex-col border-r border-charcoal-200 bg-white">
      {/* Logo */}
      <div className="border-b border-charcoal-200 p-6">
        <div className="flex items-center space-x-2">
          <div className="rounded-lg bg-primary-600 p-2">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary-600">AttaqwaMasjid</h1>
            <p className="text-xs text-charcoal-600">LMS Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-charcoal-700 hover:bg-charcoal-50 hover:text-charcoal-900'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="border-t border-charcoal-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-charcoal-900">
              {user?.username || 'User'}
            </p>
            <p className="truncate text-xs text-charcoal-500">
              {user?.role?.name || 'Teacher'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
