# Changelog

All notable changes to the AttaqwaLMS project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
