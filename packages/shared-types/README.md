# @attaqwa/shared-types

Shared TypeScript type definitions for the AttaqwaMasjid LMS system.

## Usage

This package provides comprehensive TypeScript interfaces for all LMS entities including:

- **User & Authentication**: User, UserRole, UserProfile
- **Courses**: Course, Instructor, CourseCategory
- **Lessons**: Lesson, LessonType, LessonContent
- **Quizzes**: Quiz, QuizQuestion, QuestionType
- **Progress Tracking**: UserProgress, CourseEnrollment, ProgressStats
- **Gamification**: Achievement, Leaderboard, Streak, Certificate
- **Analytics**: DashboardStats, CourseAnalytics, ActivityLog
- **Strapi**: StrapiMedia, StrapiResponse

### In Web Apps (Monorepo)

```typescript
import type { Course, Lesson, User } from '@attaqwa/shared-types';
```

### In Mobile App (External)

Copy `src/index.ts` to your mobile project as `src/types/lms.ts` and import directly:

```typescript
import type { Course, Lesson, User } from '@/types/lms';
```

## Type Synchronization

**Mobile App Sync Process:**
1. When types are updated in this package, manually copy to mobile app
2. Location: `/Users/saninabil/WebstormProjects/AttaqwaMasjid-Mobile/src/types/lms.ts`
3. Test both web and mobile apps after sync

## Strapi v5 Compatibility

All types are compatible with Strapi v5 conventions:
- `documentId` field for Strapi v5 document references
- Proper relation types (`Pick<>` for referenced entities)
- Media field structure matches Strapi upload plugin
