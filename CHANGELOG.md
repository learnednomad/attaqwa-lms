# Changelog

All notable changes to the AttaqwaLMS project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - 2025-12-10

#### API Architecture & Versioning
- **Versioned API Endpoints (v1)**: All API endpoints now use `/api/v1/` prefix for proper versioning
- **API Configuration Constants**: Added `API_CONFIG` with version info and deprecation date
- **`API_V1_ENDPOINTS`**: New versioned endpoint constants in `@attaqwa/shared`:
  - LMS Core: `/api/v1/courses`, `/api/v1/lessons`, `/api/v1/quizzes`
  - User-Centric: `/api/v1/users/me/progress`, `/api/v1/users/me/enrollments`
  - Islamic Services: `/api/v1/prayer-times`, `/api/v1/ayahs`, `/api/v1/hadiths`
  - Community: `/api/v1/announcements`, `/api/v1/events`

#### v1 Route Implementations (Next.js BFF)
- `apps/website/src/app/api/v1/prayer-times/route.ts` - Versioned prayer times with Strapi v5 response format
- `apps/website/src/app/api/v1/ayahs/route.ts` - Quran ayahs (flattened from /islamic/ayah)
- `apps/website/src/app/api/v1/ayahs/daily/route.ts` - Daily featured ayah
- `apps/website/src/app/api/v1/hadiths/route.ts` - Hadiths with pagination
- `apps/website/src/app/api/v1/announcements/route.ts` - Announcements with Strapi v5 format
- `apps/website/src/app/api/v1/courses/route.ts` - Courses with filtering, pagination, caching
- `apps/website/src/app/api/v1/lessons/route.ts` - Lessons by course with order sorting
- `apps/website/src/app/api/v1/quizzes/route.ts` - Quizzes with lesson/course filtering
- `apps/website/src/app/api/v1/events/route.ts` - Community events with category filtering
- `apps/website/src/app/api/v1/users/me/progress/route.ts` - User progress tracking
- `apps/website/src/app/api/v1/users/me/enrollments/route.ts` - User course enrollments
- `apps/website/src/app/api/v1/users/me/achievements/route.ts` - User earned achievements

#### Strapi v1 Route Prefixes
- Updated `apps/api/src/api/course/routes/course.ts` with `/v1` prefix
- Updated `apps/api/src/api/lesson/routes/lesson.ts` with `/v1` prefix
- Updated `apps/api/src/api/quiz/routes/quiz.ts` with `/v1` prefix
- Created `apps/api/src/api/achievement/routes/achievement.ts` with `/v1` prefix
- Created `apps/api/src/api/course-enrollment/routes/course-enrollment.ts` with `/v1` prefix
- Created `apps/api/src/api/leaderboard/routes/leaderboard.ts` with `/v1` prefix
- Created `apps/api/src/api/streak/routes/streak.ts` with `/v1` prefix
- Created `apps/api/src/api/user-achievement/routes/user-achievement.ts` with `/v1` prefix
- Created `apps/api/src/api/user-progress/routes/user-progress.ts` with `/v1` prefix

#### Rate Limiting Middleware
- **Global rate limiter**: `apps/api/src/middlewares/rate-limit.ts`
  - Anonymous users: 100 requests/minute
  - Authenticated users: 500 requests/minute
  - Admin users: 1000 requests/minute
- Rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Per-entity middleware wrappers for all 9 content types (courses, lessons, quizzes, achievements, course-enrollments, leaderboards, streaks, user-achievements, user-progress)

#### OpenAPI Documentation
- **`docs/openapi.yaml`**: Complete OpenAPI 3.1.0 specification (800+ lines)
  - All v1 endpoints documented with schemas
  - Authentication, rate limiting, pagination
  - Request/response examples
- Updated `/api/docs` endpoint to serve OpenAPI info via `?format=openapi`
- Added **Swagger UI page** at `/docs/api` with interactive API explorer
  - Installed `swagger-ui-react` and `js-yaml` dependencies
  - Custom Islamic green theme styling
  - Try-it-out functionality enabled

#### Architecture Documentation
- **`docs/architecture.md`**: Full brownfield enhancement architecture document
- **`docs/api-migration-plan.md`**: 3-phase migration plan with rollback strategies
- **`docs/architect-checklist-results.md`**: 96% validation pass rate report

### Changed - 2025-12-10

#### API Client Updates
- Updated `apps/website/src/lib/api.ts` to use `API_V1_ENDPOINTS`
- All API methods now call versioned endpoints

#### Deprecation Headers
- Added deprecation headers to legacy endpoints (sunset: 2025-12-01):
  - `/api/prayer-times` → `/api/v1/prayer-times`
  - `/api/announcements` → `/api/v1/announcements`
  - `/api/islamic/ayah` → `/api/v1/ayahs`
  - `/api/islamic/hadith` → `/api/v1/hadiths`
- Headers: `Deprecation: true`, `Sunset`, `Link: rel="successor-version"`

### Deprecated - 2025-12-10

#### Legacy API Endpoints (Remove by 2025-12-01)
- `API_ENDPOINTS` constant - Use `API_V1_ENDPOINTS` instead
- `/api/prayer-times` - Use `/api/v1/prayer-times`
- `/api/announcements` - Use `/api/v1/announcements`
- `/api/islamic/ayah` - Use `/api/v1/ayahs`
- `/api/islamic/hadith` - Use `/api/v1/hadiths`

---

### Added - 2025-01-30

#### Strapi API Integration
- Complete Strapi v5 API client with query builder for REST API communication
- React Query hooks for efficient data fetching and caching
  - `useCourses()` - Fetch courses with filtering support
  - `useCourse()` - Fetch single course by slug
  - `useCourseById()` - Fetch course by ID
  - `useCourseWithDetails()` - Fetch course with lessons and quizzes
  - `useLessonsByCourse()` - Fetch lessons for a course
  - `useLesson()` - Fetch single lesson
  - `useQuiz()` - Fetch quiz data
  - `useMyEnrollments()` - Fetch user enrollments
  - `useEnrollmentByCourse()` - Check enrollment status
- Strapi query parameter builder supporting filters, populate, pagination, sorting

#### LMS Frontend Pages
- **Course Browse Page** (`/education/browse`)
  - Displays all 15 courses from Strapi with grid/list view toggle
  - Advanced filtering: subject, age tier, difficulty, search
  - Sorting options: newest, oldest, shortest duration
  - Real-time course count and filter indicators
- **Course Detail Page** (`/education/courses/[id]`)
  - Complete course metadata display
  - Course statistics: lessons, duration, difficulty, progress
  - Learning objectives and prerequisites sections
  - Full curriculum with lesson cards
  - Enrollment action with sidebar
- **Lesson Viewer Page** (`/education/lessons/[id]`)
  - Lesson content display with rich text support
  - Progress tracking interface
  - Navigation to previous/next lessons
  - Quiz integration
- **Quiz Page** (`/education/quizzes/[id]`)
  - Quiz interface with question display
  - Answer submission and scoring
  - Results and explanations

#### Type System Improvements
- Local type definitions for LMS entities (AgeTier, IslamicSubject, DifficultyLevel)
- Fixed enum vs string literal issues throughout components
- Added null-safe data transformations

### Fixed - 2025-01-30

#### Bug Fixes
- Fixed "NaNh" duration display in course detail page by calculating from lesson durations
- Corrected field name mismatches: `difficulty_level` → `difficulty`, `estimated_duration` → `duration_weeks`
- Fixed `AgeTierFilter` component to use string literals instead of enum-style access
- Added fallback handling in `AgeTierBadge` for unmatched age tier values
- Updated age tier values to match Strapi schema: children, youth, adults, all
- Fixed type import errors by defining types locally instead of importing from `@attaqwa/shared`
- Added defensive null checks for course subject, age_tier, and difficulty fields

#### Component Updates
- `EducationContentCard`: Updated subject, difficulty, and content type display functions
- `AgeTierFilter`: Changed from enum-based config to string literal keys
- `browse/page.tsx`: Integrated with Strapi API and fixed filter parameters

### Changed - 2025-01-30

#### Data Flow
- Migrated from mock data to Strapi CMS backend
- Implemented React Query for server state management with 5-minute stale time
- Added proper loading and error states for all data fetching

#### Architecture
- Established clear separation between API client (`strapi-api.ts`) and React hooks (`use-strapi-courses.ts`)
- Standardized query key structure for React Query cache management
- Implemented consistent error handling and retry logic

## [0.1.0] - Initial Development

### Added
- Monorepo setup with pnpm workspaces
- Next.js 15 website application
- Strapi v5 CMS backend
- PostgreSQL database with Islamic education schema
- Seeded 15 courses, 120 lessons, and 30 quizzes covering Islamic subjects
- Islamic design system with custom color palette
- Age-tier content filtering system
- UI components with Shadcn/UI and Radix primitives

---

## Version History

- **Unreleased**: Strapi API integration and LMS frontend pages
- **0.1.0**: Initial project setup and data seeding
