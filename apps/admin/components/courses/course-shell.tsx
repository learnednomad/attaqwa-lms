/**
 * Course Shell
 * Shared header + tabbed chrome for the course detail surface.
 * Presents the course identity and lets users switch between the
 * lessons outline (primary work surface) and metadata settings.
 */

'use client';

import { ArrowLeft, FileText, Settings } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils/cn';

 type CourseShellTab = 'lessons' | 'settings';

interface CourseShellProps {
  courseId: string;
  courseTitle?: string | null;
  courseInstructor?: string | null;
  activeTab: CourseShellTab;
  children: React.ReactNode;
}

export function CourseShell({
  courseId,
  courseTitle,
  courseInstructor,
  activeTab,
  children,
}: CourseShellProps) {
  const tabs: Array<{
    id: CourseShellTab;
    label: string;
    href: string;
    Icon: typeof FileText;
  }> = [
    {
      id: 'lessons',
      label: 'Lessons',
      href: `/courses/${courseId}/lessons`,
      Icon: FileText,
    },
    {
      id: 'settings',
      label: 'Settings',
      href: `/courses/${courseId}/settings`,
      Icon: Settings,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Breadcrumb + identity */}
      <div className="flex items-start gap-3">
        <Link
          href="/courses"
          aria-label="Back to courses"
          className="mt-1 rounded-lg p-2 text-charcoal-500 transition-colors hover:bg-charcoal-50 hover:text-charcoal-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-charcoal-400">
            Course
          </p>
          <h1 className="truncate text-2xl font-bold text-charcoal-900">
            {courseTitle || 'Untitled course'}
          </h1>
          {courseInstructor ? (
            <p className="mt-0.5 truncate text-sm text-charcoal-500">
              by {courseInstructor}
            </p>
          ) : null}
        </div>
      </div>

      {/* Tabs */}
      <nav
        aria-label="Course sections"
        className="flex items-center gap-1 border-b border-charcoal-200"
      >
        {tabs.map((tab) => {
          const Icon = tab.Icon;
          const active = tab.id === activeTab;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative -mb-px inline-flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'border-primary-600 text-primary-700'
                  : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* Body */}
      <div>{children}</div>
    </div>
  );
}
