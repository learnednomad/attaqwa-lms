# CHANGELOG - Navigation & System Completeness Fixes

## [Unreleased] - 2026-01-31

### Summary
Comprehensive navigation audit and system completeness pass across student, teacher, and admin portals. Fixed cross-portal navigation leaks, missing pages, dead links, inconsistent ID patterns, and dead authentication code.

---

### New Pages Created

#### `/student/lessons/page.tsx` - Student Lesson List
**Reasoning**: The student sidebar had a "My Lessons" link but no corresponding page existed, resulting in a 404. Students had no way to view their lessons outside of course context.
- Full lesson list with search, course filter, and status filter
- Fetches from `studentApi.lessons.getAll()` with progress tracking
- Shows lesson type icons, completion status, duration
- Mock data fallback when Strapi API is unavailable

#### `/student/lessons/[id]/page.tsx` - Student Lesson Detail
**Reasoning**: Students clicking on a lesson had nowhere to go. This page provides the full lesson viewing experience within the student portal namespace.
- Video player with YouTube embed support
- HTML content rendering with prose styling
- "Mark as Complete" button calling `studentApi.progress.updateLesson()`
- Previous/Next lesson navigation using course curriculum
- Sidebar showing course curriculum with current lesson highlighted
- Quiz link navigates to `/student/quizzes/[id]` (within portal)

#### `/student/courses/[id]/page.tsx` - Student Course Detail
**Reasoning**: Student course cards navigated to `/education/courses/[id]` which uses the public education layout, not the student portal layout with sidebar and auth context.
- Course info, progress bar, full curriculum with per-lesson completion
- Enrollment info sidebar
- "Continue Learning" quick action to next incomplete lesson
- All lesson links stay within `/student/lessons/[id]`

#### `/student/browse/page.tsx` - Student Course Browsing
**Reasoning**: The "Browse Courses" links in student pages navigated to `/education/browse` which breaks the student portal context (no sidebar, no auth header). Students need to browse courses without leaving their portal.
- Mirrors `/education/browse` functionality within `StudentLayout`
- Course click navigates to `/student/courses/[id]`
- Uses same `useCourses` hook and `EducationContentCard` component

#### `/student/quizzes/[id]/page.tsx` - Student Quiz Page
**Reasoning**: Student lesson detail linked to `/education/quizzes/[id]` which is a standalone page without `StudentLayout`. This breaks the portal context and loses sidebar navigation.
- Full quiz experience wrapped in `StudentLayout`
- Start screen with instructions, timer, passing score info
- Question navigation (multiple choice, true/false, short answer)
- Results screen with pass/fail, score breakdown, answer review
- "Back to Lesson" navigates to `/student/lessons/[id]` (within portal)

#### `/teacher/lessons/new/page.tsx` - Lesson Creation Form
**Reasoning**: The "Create Lesson" button on the teacher lessons page linked to `/teacher/lessons/new` which didn't exist, resulting in a 404.
- Full lesson creation form with course selector dropdown
- Fields: title, course, description, type, order, duration, content, video URL
- Calls `teacherApi.lessons.createLesson()`
- Redirects to lesson detail after creation

---

### Bug Fixes

#### Fixed: Cross-Portal Navigation Leaks
**Reasoning**: Portal pages must stay within their namespace (`/student/*`, `/teacher/*`) to maintain layout context (sidebar, auth header, notifications). Navigating to `/education/*` breaks this context.

| File | Before | After | Reason |
|------|--------|-------|--------|
| `student/courses/page.tsx` | `href="/education/browse"` | `href="/student/browse"` | Stay in student portal |
| `student/lessons/page.tsx` | `href="/education/browse"` | `href="/student/browse"` | Stay in student portal |
| `student/lessons/[id]/page.tsx` | `href="/education/quizzes/${id}"` | `href="/student/quizzes/${id}"` | Stay in student portal |

#### Fixed: Inconsistent Strapi v5 DocumentId Usage
**Reasoning**: Strapi v5 uses `documentId` (string) as the primary document identifier, distinct from numeric `id`. When the API returns data, `documentId` is the stable identifier. Using only `id` or only `documentId` without fallback causes navigation failures when one is unavailable.

| File | Before | After |
|------|--------|-------|
| `student/courses/page.tsx` | `course.id` | `course.documentId \|\| course.id` |
| `teacher/lessons/page.tsx` (3 locations) | `lesson.documentId` | `lesson.documentId \|\| lesson.id` |

Also added `documentId` to the `CourseData` interface and transform in `student/courses/page.tsx`.

#### Fixed: Admin Content Link to Public Route
**Reasoning**: The admin education content page's "View" button navigated to `/education/content/${item.id}` (public route), taking admins out of the admin panel. Should stay within admin namespace.

| File | Before | After |
|------|--------|-------|
| `admin/education/content/page.tsx` | `/education/content/${item.id}` | `/admin/education/content/${item.id}/edit` |

#### Fixed: Dead localStorage Authentication Code
**Reasoning**: Both portals use httpOnly cookie-based authentication. The logout handlers were calling `localStorage.removeItem()` which was dead code since tokens are never stored in localStorage.

| File | Before | After |
|------|--------|-------|
| `student-layout.tsx` | `localStorage.removeItem('studentToken')` | `fetch('/api/student/auth/logout', { method: 'POST', credentials: 'include' })` |
| `teacher-layout.tsx` | `localStorage.removeItem('teacherData')` | Removed dead code (cookie logout already handled by API) |

#### Fixed: Mobile Sidebar Not Working
**Reasoning**: Both portal layouts had sidebars with `fixed inset-y-0 left-0` positioning but no mechanism to show/hide on mobile. On small screens the sidebar overlapped content permanently.

Changes to both `student-layout.tsx` and `teacher-layout.tsx`:
- Added `mobileSidebarOpen` state
- Added `-translate-x-full lg:translate-x-0` to hide sidebar on mobile by default
- Added overlay backdrop when mobile sidebar is open
- Added hamburger menu button in header (visible on `lg:hidden`)

#### Fixed: Student Layout Missing "My Lessons" Sidebar Link
**Reasoning**: The `/student/lessons` page existed but wasn't accessible from the sidebar navigation. Added to the Academic section.

---

### Audit Results (Post-Fix)

#### Portal Isolation Status
- **Student Portal**: All links stay within `/student/*` namespace
- **Teacher Portal**: All links stay within `/teacher/*` namespace
- **Admin Portal**: All links stay within `/admin/*` namespace
- **Auth cross-links**: Student login links to admin login (acceptable for auth routing)

#### Page Existence (Student Portal)
All 20+ student sidebar routes have corresponding `page.tsx` files.

#### Page Existence (Teacher Portal)
All 15+ teacher sidebar routes have corresponding `page.tsx` files.

#### ID Pattern Compliance
All dynamic routes use the `documentId || id` fallback pattern consistently.

#### Known Acceptable Cross-Portal Links
- Login pages link to `/contact`, `/privacy`, `/terms` (main site pages) - acceptable for legal/support
- Student login links to `/admin/login` - acceptable auth bridge
- Teacher login links to `/student/login` - acceptable auth bridge
