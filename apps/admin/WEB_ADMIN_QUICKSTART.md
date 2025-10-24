# Web Admin Portal - Quick Start Guide

## ✅ What's Been Built (Current Status)

### Foundation Complete (100%)

```
✅ Project Setup
├── Next.js 15 with App Router
├── TypeScript configuration
├── Tailwind CSS styling
├── Environment variables
└── Git ignore

✅ API Integration
├── Strapi client with authentication
├── Request/response handling
├── Error handling
├── File upload support
└── Shared type system (500+ lines)

✅ Authentication System
├── Auth store (Zustand with persistence)
├── useAuth hook with sign in/out
├── Role-based access checking
└── Token management

✅ UI Components
├── Button (5 variants, 3 sizes)
├── Input (with label, error, helper text)
├── Card (with header, content, footer)
└── Utility functions (cn, formatters)

✅ Pages
├── Home page (redirect logic)
├── Login page (complete UI)
└── Auth layout
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd attaqwa-lms-admin

npm install
# or
pnpm install
```

### 2. Configure Environment

```bash
# Already created: .env.local
# Verify it has:
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_API_URL=http://localhost:1337/api
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📋 Next Steps to Complete

### Phase 1: Dashboard Layout (2-3 hours)

**Create Files:**

```typescript
// 1. Dashboard Layout
app/(dashboard)/layout.tsx
├── Sidebar navigation
├── Header with user menu
├── Protected route wrapper
└── Breadcrumbs

// 2. Sidebar Component
components/dashboard/sidebar.tsx
├── Navigation links
├── Logo
├── Role-based menu items
└── Collapse/expand

// 3. Header Component
components/dashboard/header.tsx
├── User avatar
├── Notifications
├── Logout button
└── Search bar (optional)

// 4. Stats Card Component
components/dashboard/stats-card.tsx
├── Icon
├── Label
├── Value
└── Trend indicator
```

**Dashboard Page:**
```typescript
app/(dashboard)/dashboard/page.tsx
├── Overview stats (4 cards)
├── Recent activity
├── Quick actions
└── Charts (optional)
```

### Phase 2: Course Management (4-5 hours)

```typescript
// 1. Courses List Page
app/(dashboard)/courses/page.tsx
├── Table with courses
├── Filters (category, difficulty)
├── Search
├── "Create Course" button
└── Actions (edit, delete, view)

// 2. Create Course Page
app/(dashboard)/courses/new/page.tsx
├── Course form with validation
├── Image upload
├── Rich text editor
├── Category/difficulty selectors
└── Submit/cancel buttons

// 3. Edit Course Page
app/(dashboard)/courses/[id]/page.tsx
├── Same as create, pre-filled
└── Additional: lesson management

// 4. Course Form Component
components/courses/course-form.tsx
├── Reusable form logic
├── Field validation
└── Submission handling
```

### Phase 3: Lesson Builder (3-4 hours)

```typescript
// 1. Lesson Builder Component
components/courses/lesson-builder.tsx
├── Drag-and-drop lesson ordering
├── Add lesson button
├── Lesson type selector
├── Quick edit inline
└── Delete confirmation

// 2. Lesson Editor Modal
components/courses/lesson-editor.tsx
├── Title & description
├── Content (rich text)
├── Media upload
├── Quiz assignment
└── Lock/unlock toggle

// 3. Media Upload Component
components/ui/media-upload.tsx
├── Drag-and-drop zone
├── File validation
├── Progress bar
├── Preview
└── Delete option
```

### Phase 4: Quiz Creator (3-4 hours)

```typescript
// 1. Quiz Builder Page
app/(dashboard)/quizzes/new/page.tsx
├── Quiz settings (time limit, passing score)
├── Question list
├── Add question button
└── Save quiz

// 2. Question Editor Component
components/quizzes/question-editor.tsx
├── Question type selector
├── Question text (rich text)
├── Options editor (for multiple choice)
├── Correct answer selector
├── Explanation field
└── Points assignment

// 3. Question List Component
components/quizzes/question-list.tsx
├── Sortable questions
├── Quick preview
├── Edit/delete actions
└── Reorder drag handles
```

### Phase 5: Analytics Dashboard (2-3 hours)

```typescript
// 1. Analytics Page
app/(dashboard)/analytics/page.tsx
├── Date range selector
├── Overview metrics
├── Enrollment chart
├── Completion rates
└── Popular courses

// 2. Charts Component
components/analytics/charts.tsx
├── Line chart (enrollment trends)
├── Bar chart (course completion)
├── Pie chart (category distribution)
└── Using Recharts library
```

### Phase 6: Student Management (2-3 hours)

```typescript
// 1. Students List Page
app/(dashboard)/students/page.tsx
├── Student table
├── Search & filters
├── Enrollment status
└── View details action

// 2. Student Detail Page
app/(dashboard)/students/[id]/page.tsx
├── Student info
├── Enrolled courses
├── Progress overview
├── Quiz scores
└── Activity timeline
```

---

## 🎨 Component Library Expansion

### Additional UI Components Needed

```typescript
// 1. components/ui/select.tsx
// Dropdown select with search

// 2. components/ui/textarea.tsx
// Multi-line text input

// 3. components/ui/badge.tsx
// Status badges (published, draft, etc.)

// 4. components/ui/table.tsx
// Data table with sorting/filtering

// 5. components/ui/modal.tsx
// Dialog/modal component

// 6. components/ui/toast.tsx
// Notification system

// 7. components/ui/avatar.tsx
// User avatar component

// 8. components/ui/dropdown.tsx
// Dropdown menu
```

---

## 📊 API Hooks to Create

### Course Management

```typescript
// lib/api/courses.ts
import { useQuery, useMutation } from '@tanstack/react-query';

export const useCourses = (filters) => {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: () => strapiClient.get('/courses', { params: filters }),
  });
};

export const useCreateCourse = () => {
  return useMutation({
    mutationFn: (data) => strapiClient.post('/courses', { data }),
    onSuccess: () => {
      // Invalidate courses list
    },
  });
};

export const useUpdateCourse = () => {
  // Similar to create
};

export const useDeleteCourse = () => {
  // Delete mutation
};
```

### Similar patterns for:
- `lib/api/lessons.ts`
- `lib/api/quizzes.ts`
- `lib/api/students.ts`
- `lib/api/analytics.ts`

---

## 🔐 Protected Routes Implementation

```typescript
// middleware.ts (root level)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-storage')?.value;

  if (!token && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/courses/:path*', '/students/:path*'],
};
```

---

## 🎯 Implementation Priority

### Week 1: Core Functionality
1. ✅ Login page (DONE)
2. Dashboard layout with sidebar
3. Dashboard home page
4. Courses list page
5. Create course form

### Week 2: Content Creation
6. Lesson builder
7. Quiz creator
8. Media upload system
9. Rich text editor integration

### Week 3: Management & Analytics
10. Student management pages
11. Analytics dashboard
12. Progress monitoring
13. Reports generation

---

## 🧪 Testing Checklist

### Before Production

- [ ] Authentication flow (login, logout, session persistence)
- [ ] Course CRUD operations
- [ ] Lesson management
- [ ] Quiz creation and editing
- [ ] File uploads (images, videos, PDFs)
- [ ] Permissions (teacher vs admin access)
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Error handling and validation
- [ ] Loading states
- [ ] Empty states

---

## 📦 Additional Dependencies Needed

```bash
# Rich Text Editor
npm install @tiptap/react @tiptap/starter-kit

# Drag and Drop
npm install @dnd-kit/core @dnd-kit/sortable

# Charts
npm install recharts

# Date Picker
npm install react-day-picker date-fns

# Icons (already have lucide-react)
# Form Validation
npm install zod react-hook-form @hookform/resolvers
```

---

## 🚀 Quick Win: Complete Dashboard in 1 Day

### Morning (4 hours):
1. Create sidebar component (1 hour)
2. Create header component (1 hour)
3. Create dashboard layout (1 hour)
4. Create 4 stats cards (1 hour)

### Afternoon (4 hours):
5. Create courses list page (2 hours)
6. Create course table component (1 hour)
7. Add filters and search (1 hour)

**Result**: Working admin with login, dashboard, and course listing

---

## 📝 Code Templates

### Dashboard Stats Card Example

```typescript
// components/dashboard/stats-card.tsx
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-charcoal-600">{title}</p>
            <p className="text-3xl font-bold text-charcoal-900">{value}</p>
            {trend && (
              <div className="mt-2 flex items-center text-sm">
                {trend.isPositive ? (
                  <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="mr-1 h-4 w-4 text-red-600" />
                )}
                <span className={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
                  {trend.value}%
                </span>
                <span className="ml-1 text-charcoal-500">vs last month</span>
              </div>
            )}
          </div>
          <div className="rounded-lg bg-primary-100 p-3">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### Sidebar Navigation Example

```typescript
// components/dashboard/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Users, BarChart, Settings } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-charcoal-200 bg-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary-600">AttaqwaMasjid</h1>
        <p className="text-sm text-charcoal-600">LMS Admin</p>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-charcoal-700 hover:bg-charcoal-50'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
```

---

## 🎓 Resources

- **Next.js App Router**: https://nextjs.org/docs/app
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Strapi API Reference**: https://docs.strapi.io/dev-docs/api/rest
- **React Query**: https://tanstack.com/query/latest/docs/react
- **Zustand**: https://docs.pmnd.rs/zustand

---

**Current Status**: Foundation Complete ✅
**Next Milestone**: Dashboard Layout + Course List (1 day)
**Full Completion**: 2-3 weeks of development

**Ready to continue? Let me know which component you'd like me to build next!**
