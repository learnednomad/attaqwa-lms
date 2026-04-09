# Changelog — 2026-04-07

## Teacher Login Page Redesign (website)
**File**: `apps/website/src/app/teacher/login/page.tsx`
- Replaced dark slate gradient left panel with solid Islamic green background
- Changed tagline from "Inspire the Next Generation of Scholars" to "Empower Islamic Education"
- Changed subtitle from "Teacher Portal" to "Learning Management System"
- Replaced colored icon feature boxes with simple checkmark list (Comprehensive Course Builder, Real-Time Analytics, Gamification System)
- Removed Mail/Lock icons from form inputs
- Added red asterisks on required field labels
- Added "Remember me" checkbox alongside "Forgot password?" link
- Replaced "Student Portal" link with "Need access?" divider and admin contact message
- Used `bg-primary` and inline HSL styles instead of non-functional `bg-islamic-green-*` Tailwind classes (Tailwind v4 has no `@theme` mapping for custom CSS vars)

## Admin App CSS Fix
**File**: `apps/admin/tailwind.config.ts`
- Added `charcoal` color palette (mapped to gray scale) to fix `text-charcoal-900` and other `charcoal-*` classes used across 26+ admin files that were causing build errors on localhost:3000

**File**: `apps/admin/app/globals.css`
- No changes needed — `charcoal` now resolves via tailwind config

## CORS Fix for Admin-to-Website Auth
**File**: `apps/website/src/app/api/auth/[...all]/route.ts`
- Added `OPTIONS` handler for CORS preflight requests
- Added `getCorsHeaders()` helper with allowed origins (localhost:3000, localhost:3003)
- Wrapped all POST responses with `addCorsHeaders()` to include CORS headers
- Fixed: admin app (port 3000) was blocked from calling auth API on website (port 3003) due to missing CORS preflight support

## Admin Dashboard — Real Data
**File**: `apps/admin/app/(dashboard)/dashboard/page.tsx`
- Replaced all hardcoded mock data with real API calls
- Stats now show actual counts: users (from BetterAuth), published courses, total lessons, enrollments (all from Strapi API)
- "Recent Activity" shows real enrollments or empty state ("No enrollments yet")
- "Courses" section shows real published courses with actual student/lesson counts
- Quick Actions now link to actual routes (`/courses/new`, `/students`, `/analytics`)

**File**: `apps/admin/lib/api/admin-stats.ts` (new)
- Shared API helper for fetching real stats from Strapi and BetterAuth
- Functions: `getDashboardStats()`, `getCoursesWithStats()`, `getRecentEnrollments()`, `getRecentProgress()`, `getLessonsWithStats()`, `getAchievements()`, `getUserAchievements()`

## Admin Students Page — Real Data
**File**: `apps/admin/app/(dashboard)/students/page.tsx`
- Renamed from "Students" to "Users" to reflect all user types
- Fetches real users from BetterAuth admin API (`authClient.admin.listUsers`)
- Stats cards show real counts: Total Users, Students, Teachers, Admins
- Table shows real user data: name, email, role (with color-coded badges), enrollment count, join date
- Supports search and role filtering
- Removed all mock student data (fake names, points, streaks, levels)

## Admin Analytics Page — Real Data
**File**: `apps/admin/app/(dashboard)/analytics/page.tsx`
- Replaced all mock data with real API calls
- Stats: real user count, published courses (with draft count), total lessons, enrollments
- Course Breakdown table: real courses with instructor, subject, difficulty, age tier, lesson count, enrollment count, duration
- Distribution charts: By Subject, By Difficulty, By Age Tier — all computed from real course data
- Removed fake engagement metrics, popular lessons, achievement distribution, and AI insights

## Teacher Layout — Real User Name
**File**: `apps/website/src/components/layout/teacher-layout.tsx`
- Replaced hardcoded `teacherName = 'Sheikh Abdullah'` with `session?.user?.name` from BetterAuth session
- Added `authClient.useSession()` hook
- Logout now uses `authClient.signOut()` instead of custom fetch call
- Mock notifications replaced with empty array (per linter change)

**File**: `apps/website/src/app/teacher/dashboard/page.tsx`
- Added `authClient.useSession()` to get real user name
- Dashboard subtitle now shows `Welcome back, {firstName}` using session data

## Strapi API Token Fix
**File**: `docker-compose.dev.yml`
- Added fallback token in `STRAPI_API_TOKEN` env var for dev environment

**File**: `.env`
- Updated `STRAPI_API_TOKEN` with newly generated valid token matching the database hash

**Database**: Updated `strapi_api_tokens` table (id=2, "Full Access") with new access_key hash matching the generated raw token

**Impact**: Fixed 401 errors on file uploads (video/audio) in admin lesson creation at localhost:3000
