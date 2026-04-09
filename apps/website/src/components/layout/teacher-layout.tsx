'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen, Clock, Calendar, Award, Bell,
  Users, MessageSquare, FileText,
  ChevronDown, Home, LogOut,
  GraduationCap, BarChart3, Settings, Search,
  PenTool, ClipboardList, BookMarked, Menu, X,
  Sun, Moon, LayoutGrid
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { NotificationPanel, NotificationItem } from '@/components/notifications/notification-panel';
import { authClient } from '@/lib/auth-client';

// ─── Theme Context ───────────────────────────────────────────────
type SidebarTheme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: SidebarTheme;
  toggle: () => void;
}>({ theme: 'light', toggle: () => {} });

function useSidebarTheme() {
  return useContext(ThemeContext);
}

// ─── Types ───────────────────────────────────────────────────────
interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface SidebarSection {
  title: string;
  items: NavItem[];
  isOpen: boolean;
}

interface TeacherLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

// ─── Theme Toggle ────────────────────────────────────────────────
function ThemeToggle({ collapsed }: { collapsed: boolean }) {
  const { theme, toggle } = useSidebarTheme();

  if (collapsed) {
    return (
      <button
        onClick={toggle}
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 mx-auto',
          theme === 'light'
            ? 'text-slate-500 hover:bg-slate-100'
            : 'text-slate-400 hover:bg-white/10'
        )}
        title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <div className={cn(
      'flex items-center justify-center gap-1 p-1 rounded-full mx-4',
      theme === 'light' ? 'bg-slate-100' : 'bg-white/10'
    )}>
      <button
        onClick={() => theme === 'dark' && toggle()}
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200',
          theme === 'light'
            ? 'bg-white text-slate-700 shadow-sm'
            : 'text-slate-500 hover:text-slate-300'
        )}
        title="Light mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => theme === 'light' && toggle()}
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200',
          theme === 'dark'
            ? 'bg-white/15 text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-600'
        )}
        title="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── Sidebar Nav Item ────────────────────────────────────────────
function SidebarNavItem({
  item,
  isActive,
  collapsed,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
}) {
  const { theme } = useSidebarTheme();

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={cn(
        'flex items-center gap-3 rounded-xl transition-all duration-150',
        collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5',
        isActive && theme === 'light' && 'bg-islamic-green-600 text-white shadow-md shadow-islamic-green-600/20',
        isActive && theme === 'dark' && 'bg-islamic-green-600 text-white shadow-md shadow-islamic-green-600/25',
        !isActive && theme === 'light' && 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        !isActive && theme === 'dark' && 'text-slate-400 hover:bg-white/8 hover:text-white',
      )}
    >
      <item.icon className={cn('flex-shrink-0', collapsed ? 'h-5 w-5' : 'h-[18px] w-[18px]')} />
      {!collapsed && <span className="text-[14px] font-medium">{item.label}</span>}
    </Link>
  );
}

// ─── Sidebar Section Group ───────────────────────────────────────
function SidebarSectionGroup({
  section,
  collapsed,
  onToggle,
  pathname,
}: {
  section: SidebarSection;
  collapsed: boolean;
  onToggle: () => void;
  pathname: string;
}) {
  const { theme } = useSidebarTheme();

  return (
    <div className="mt-6">
      {/* Section Header */}
      {!collapsed ? (
        <button
          onClick={onToggle}
          className={cn(
            'flex items-center justify-between w-full px-3 py-1.5 mb-1',
            'text-[11px] font-semibold uppercase tracking-wider transition-colors',
            theme === 'light'
              ? 'text-slate-400 hover:text-slate-600'
              : 'text-slate-500 hover:text-slate-300'
          )}
        >
          <span>{section.title}</span>
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 transition-transform duration-200',
              !section.isOpen && '-rotate-90'
            )}
          />
        </button>
      ) : (
        <div className={cn(
          'text-[9px] font-semibold uppercase tracking-wider text-center px-1 py-1.5 mb-1 truncate',
          theme === 'light' ? 'text-slate-400' : 'text-slate-600'
        )}>
          {section.title.substring(0, 4)}...
        </div>
      )}

      {/* Section Items */}
      {section.isOpen && (
        <div className={cn('space-y-0.5', !collapsed && 'ml-0')}>
          {section.items.map((item) => (
            <SidebarNavItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              collapsed={collapsed}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Layout ─────────────────────────────────────────────────
export function TeacherLayout({ children, title, subtitle }: TeacherLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [theme, setTheme] = useState<SidebarTheme>('light');

  // Persist theme preference
  useEffect(() => {
    const saved = localStorage.getItem('teacher-sidebar-theme') as SidebarTheme | null;
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('teacher-sidebar-theme', next);
      return next;
    });
  };

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
      isOpen: false,
      items: [
        { label: 'Teaching Materials', href: '/teacher/materials', icon: BookOpen },
        { label: 'Islamic Calendar', href: '/teacher/calendar', icon: Calendar },
        { label: 'Certificates', href: '/teacher/certificates', icon: Award },
      ]
    },
    {
      title: 'Analytics',
      isOpen: false,
      items: [
        { label: 'Course Analytics', href: '/teacher/analytics', icon: BarChart3 },
        { label: 'Engagement', href: '/teacher/engagement', icon: Users },
      ]
    },
  ]);

  const toggleSection = (index: number) => {
    setSidebarSections(prev => prev.map((section, i) =>
      i === index ? { ...section, isOpen: !section.isOpen } : section
    ));
  };

  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/teacher/login');
  };

  const teacherName = session?.user?.name || 'Teacher';

  return (
    <ThemeContext.Provider value={{ theme, toggle: toggleTheme }}>
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
          'fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out flex flex-col',
          sidebarCollapsed ? 'w-[72px]' : 'w-[264px]',
          'lg:relative',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          // Theme styles
          theme === 'light'
            ? 'bg-white border-r border-slate-200'
            : 'bg-[#1a1a2e] border-r border-white/5',
        )}>
          {/* Logo Header */}
          <div className={cn(
            'flex items-center justify-between h-16 px-4 flex-shrink-0',
            'border-b',
            theme === 'light' ? 'border-slate-200' : 'border-white/5'
          )}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 bg-gradient-to-br from-islamic-green-500 to-islamic-green-700 rounded-xl flex items-center justify-center shadow-lg shadow-islamic-green-600/20 flex-shrink-0">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <span className={cn(
                  'font-semibold text-[15px] tracking-tight truncate',
                  theme === 'light' ? 'text-slate-800' : 'text-white'
                )}>
                  Teacher Portal
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setSidebarCollapsed(!sidebarCollapsed);
                setMobileSidebarOpen(false);
              }}
              className={cn(
                'transition-colors hidden lg:block flex-shrink-0',
                theme === 'light'
                  ? 'text-slate-400 hover:text-slate-600'
                  : 'text-slate-500 hover:text-slate-300'
              )}
            >
              <Menu className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className={cn(
                'transition-colors lg:hidden',
                theme === 'light'
                  ? 'text-slate-400 hover:text-slate-600'
                  : 'text-slate-500 hover:text-slate-300'
              )}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
            {/* Dashboard Link */}
            <SidebarNavItem
              item={{ label: 'Dashboard', href: '/teacher/dashboard', icon: LayoutGrid }}
              isActive={pathname === '/teacher/dashboard'}
              collapsed={sidebarCollapsed}
            />

            {/* Section Groups */}
            {sidebarSections.map((section, index) => (
              <SidebarSectionGroup
                key={section.title}
                section={section}
                collapsed={sidebarCollapsed}
                onToggle={() => toggleSection(index)}
                pathname={pathname}
              />
            ))}
          </nav>

          {/* Theme Toggle */}
          <div className={cn(
            'flex-shrink-0 py-3',
            'border-t',
            theme === 'light' ? 'border-slate-200' : 'border-white/5'
          )}>
            <ThemeToggle collapsed={sidebarCollapsed} />
          </div>

          {/* Bottom Actions */}
          <div className={cn(
            'flex-shrink-0 p-3 space-y-0.5',
            'border-t',
            theme === 'light' ? 'border-slate-200' : 'border-white/5'
          )}>
            <SidebarNavItem
              item={{ label: 'Settings', href: '/teacher/settings', icon: Settings }}
              isActive={pathname === '/teacher/settings'}
              collapsed={sidebarCollapsed}
            />
            <button
              onClick={handleLogout}
              title={sidebarCollapsed ? 'Logout' : undefined}
              className={cn(
                'flex items-center gap-3 w-full rounded-xl transition-all duration-150',
                sidebarCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5',
                theme === 'light'
                  ? 'text-slate-500 hover:bg-red-50 hover:text-red-600'
                  : 'text-slate-500 hover:bg-red-500/10 hover:text-red-400'
              )}
            >
              <LogOut className={cn('flex-shrink-0', sidebarCollapsed ? 'h-5 w-5' : 'h-[18px] w-[18px]')} />
              {!sidebarCollapsed && <span className="text-[14px] font-medium">Logout</span>}
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
    </ThemeContext.Provider>
  );
}
