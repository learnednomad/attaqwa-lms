# AttaqwaMasjid LMS - Complete Architecture Guide

## 🏛️ System Architecture Overview

### Three-Tier Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                        │
├────────────────────┬─────────────────────────────────────────┤
│   Mobile Apps      │         Web Portal                      │
│  (React Native)    │         (Next.js)                       │
├────────────────────┼─────────────────────────────────────────┤
│  iOS App           │  Teacher Dashboard                      │
│  Android App       │  Admin Panel                            │
│  - Students        │  Student Progress Monitor               │
│  - Parents         │  Content Management                     │
│  - Offline-first   │  Analytics & Reports                    │
│  - Push notifs     │  System Configuration                   │
└────────────────────┴─────────────────────────────────────────┘
                              ↓ REST API / GraphQL
┌──────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                         │
│                     Strapi v5 (Headless CMS)                 │
├──────────────────────────────────────────────────────────────┤
│  Authentication & Authorization (JWT)                        │
│  Content Management (Courses, Lessons, Quizzes)             │
│  User Management (Students, Teachers, Admins)               │
│  Media Management (Images, Videos, PDFs)                     │
│  API Routes (REST + GraphQL)                                 │
│  Business Logic & Webhooks                                   │
│  Role-Based Access Control (RBAC)                            │
└──────────────────────────────────────────────────────────────┘
                              ↓ ORM (PostgreSQL)
┌──────────────────────────────────────────────────────────────┐
│                        DATA LAYER                             │
│                   PostgreSQL Database                         │
├──────────────────────────────────────────────────────────────┤
│  Users & Profiles       │  Content Tables                    │
│  Courses & Lessons      │  Progress Tracking                 │
│  Quizzes & Questions    │  Achievements & Gamification       │
│  Enrollments            │  Analytics & Logs                  │
│  Media Files (S3/CDN)   │  Certificates & Badges             │
└──────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### 1. Course Creation Flow (Web → Mobile)

```
Teacher (Web Portal)
    ↓ Create Course
Strapi Backend
    ↓ Save to PostgreSQL
    ↓ Trigger Webhook (optional)
Mobile App Refresh
    ↓ Fetch via API
Student Sees New Course
```

### 2. Learning Progress Flow (Mobile → Web)

```
Student (Mobile App)
    ↓ Complete Lesson
Strapi API (Progress Update)
    ↓ Update Database
    ↓ Check Achievement Criteria
    ↓ Award Badges (if applicable)
Teacher Dashboard Refresh
    ↓ View Updated Progress
Analytics Charts Update
```

### 3. Quiz Submission Flow

```
Student (Mobile)
    ↓ Submit Quiz Answers
Strapi (Auto-Grade)
    ↓ Calculate Score
    ↓ Update UserProgress
    ↓ Record xAPI Statement
    ↓ Check for Achievements
Mobile App
    ↓ Display Results
    ↓ Show Earned Badges
Teacher Dashboard
    ↓ View Quiz Performance
    ↓ See Class Analytics
```

## 🗄️ Database Schema

### Core Entities

```sql
-- Users Table (Strapi Built-in)
users
├── id (PK)
├── username
├── email
├── password (hashed)
├── confirmed
├── blocked
├── role_id (FK → roles)
└── timestamps

-- User Profiles (Extended)
user_profiles
├── id (PK)
├── user_id (FK → users)
├── full_name
├── avatar_id (FK → files)
├── bio
├── date_of_birth
├── phone
├── age_tier (enum)
└── timestamps

-- Courses
courses
├── id (PK)
├── document_id
├── title
├── description (rich text)
├── category (enum: quran, hadith, fiqh, seerah, aqeedah, general)
├── age_tier (enum: children, youth, adults, all)
├── difficulty (enum: beginner, intermediate, advanced)
├── cover_image_id (FK → files)
├── instructor_id (FK → instructors)
├── is_published (boolean)
├── estimated_duration (integer)
├── tags (json)
└── timestamps

-- Lessons
lessons
├── id (PK)
├── document_id
├── title
├── content (rich text)
├── type (enum: article, video, audio, quiz, interactive)
├── course_id (FK → courses)
├── order (integer)
├── duration (integer)
├── media_id (FK → files)
├── quiz_id (FK → quizzes)
├── is_locked (boolean)
└── timestamps

-- Quizzes
quizzes
├── id (PK)
├── title
├── lesson_id (FK → lessons)
├── questions (json array of QuizQuestion)
├── time_limit (integer, nullable)
├── passing_score (integer, 0-100)
├── randomize_questions (boolean)
└── timestamps

-- User Progress
user_progresses
├── id (PK)
├── user_id (FK → users)
├── lesson_id (FK → lessons)
├── progress (integer, 0-100)
├── completed (boolean)
├── quiz_score (integer, nullable)
├── time_spent (integer)
├── last_accessed (datetime)
└── timestamps

-- Course Enrollments
course_enrollments
├── id (PK)
├── user_id (FK → users)
├── course_id (FK → courses)
├── enrolled_at (datetime)
├── completed_at (datetime, nullable)
├── status (enum: enrolled, in_progress, completed, dropped)
├── progress (integer, 0-100)
└── timestamps

-- Achievements
achievements
├── id (PK)
├── title
├── description
├── icon_id (FK → files)
├── criteria (json)
├── points (integer)
├── badge_type (enum: bronze, silver, gold, platinum)
├── category (enum: course_completion, quiz_mastery, streak, participation)
└── timestamps

-- User Achievements
user_achievements
├── id (PK)
├── user_id (FK → users)
├── achievement_id (FK → achievements)
├── earned_at (datetime)
├── progress (integer, 0-100)
├── metadata (json)
└── timestamps

-- Streaks
streaks
├── id (PK)
├── user_id (FK → users)
├── type (enum: daily_login, lesson_completion)
├── current_streak (integer)
├── longest_streak (integer)
├── last_activity_date (datetime)
├── streak_start_date (datetime, nullable)
└── timestamps

-- Certificates
certificates
├── id (PK)
├── user_id (FK → users)
├── course_id (FK → courses)
├── issued_at (datetime)
├── certificate_number (string, unique)
├── pdf_url (string, nullable)
├── verification_code (string, unique)
└── timestamps

-- Instructors
instructors
├── id (PK)
├── name
├── bio
├── photo_id (FK → files)
├── qualifications (json array)
├── email
└── timestamps

-- Files (Strapi Media Library)
files
├── id (PK)
├── name
├── alternative_text
├── caption
├── width
├── height
├── formats (json)
├── hash
├── ext
├── mime
├── size
├── url
├── preview_url
├── provider
└── timestamps
```

### Relationships

```
users ──┬─── (1:1) ─── user_profiles
        ├─── (1:N) ─── course_enrollments
        ├─── (1:N) ─── user_progresses
        ├─── (1:N) ─── user_achievements
        ├─── (1:N) ─── streaks
        └─── (1:N) ─── certificates

courses ──┬─── (1:N) ─── lessons
          ├─── (1:N) ─── course_enrollments
          ├─── (N:1) ─── instructors
          ├─── (N:N) ─── prerequisites (self-referencing)
          └─── (1:1) ─── cover_image

lessons ──┬─── (N:1) ─── courses
          ├─── (1:N) ─── user_progresses
          ├─── (1:1) ─── quizzes (nullable)
          ├─── (1:1) ─── media (nullable)
          └─── (1:N) ─── attachments

achievements ──┬─── (1:N) ─── user_achievements
               └─── (1:1) ─── icon
```

## 🔐 Security Architecture

### Authentication Flow

```
┌─────────┐                 ┌─────────┐                 ┌──────────┐
│  Client │                 │ Strapi  │                 │ Database │
└────┬────┘                 └────┬────┘                 └─────┬────┘
     │                           │                            │
     │ 1. POST /auth/local       │                            │
     │   { email, password }     │                            │
     ├──────────────────────────>│                            │
     │                           │ 2. Hash password           │
     │                           │ 3. Query user              │
     │                           ├───────────────────────────>│
     │                           │ 4. Return user             │
     │                           │<───────────────────────────┤
     │                           │ 5. Compare password        │
     │                           │ 6. Generate JWT            │
     │ 7. Return JWT + user      │                            │
     │<──────────────────────────┤                            │
     │                           │                            │
     │ 8. Subsequent requests    │                            │
     │   Authorization: Bearer   │                            │
     ├──────────────────────────>│                            │
     │                           │ 9. Verify JWT              │
     │                           │ 10. Check permissions      │
     │                           │ 11. Process request        │
     │                           ├───────────────────────────>│
     │ 12. Return data           │                            │
     │<──────────────────────────┤                            │
```

### Role-Based Permissions

```typescript
permissions = {
  student: {
    courses: ['find', 'findOne'],
    lessons: ['find', 'findOne'],
    userProgress: ['find', 'create', 'update'], // only own
    achievements: ['find'],
    userAchievements: ['find'], // only own
  },
  teacher: {
    courses: ['find', 'findOne', 'create', 'update'],
    lessons: ['find', 'findOne', 'create', 'update', 'delete'],
    quizzes: ['find', 'findOne', 'create', 'update', 'delete'],
    userProgress: ['find', 'findOne'], // all students
    students: ['find', 'findOne'],
    achievements: ['find', 'create'],
    userAchievements: ['find', 'create'], // can award
  },
  admin: {
    '*': ['*'], // Full access to all resources
  },
};
```

## 📡 API Communication

### REST API Endpoints

```typescript
// Authentication
POST   /api/auth/local               // Login
POST   /api/auth/local/register      // Register
GET    /api/users/me                 // Current user

// Courses (Public read, authenticated write)
GET    /api/courses                  // List courses
GET    /api/courses/:id              // Course details
POST   /api/courses                  // Create (teacher/admin)
PUT    /api/courses/:id              // Update (teacher/admin)
DELETE /api/courses/:id              // Delete (admin)

// Lessons
GET    /api/lessons                  // List lessons
POST   /api/lessons                  // Create lesson
PUT    /api/lessons/:id              // Update lesson

// Progress Tracking
GET    /api/user-progresses          // Get progress
POST   /api/user-progresses          // Update progress
GET    /api/progress-stats           // Statistics

// Gamification
GET    /api/achievements             // All achievements
GET    /api/user-achievements        // User's achievements
POST   /api/user-achievements        // Award achievement
GET    /api/leaderboards             // Rankings
GET    /api/streaks                  // Streak data

// Media Upload
POST   /api/upload                   // Upload files
```

### Query Parameters (Strapi Format)

```typescript
// Filtering
GET /api/courses?filters[category][$eq]=quran&filters[isPublished][$eq]=true

// Pagination
GET /api/courses?pagination[page]=1&pagination[pageSize]=10

// Sorting
GET /api/courses?sort[0]=createdAt:desc

// Population
GET /api/courses?populate[instructor]=*&populate[lessons]=*

// Combination
GET /api/courses?
    filters[category][$eq]=quran&
    populate[instructor]=*&
    pagination[pageSize]=20&
    sort[0]=createdAt:desc
```

## 🎯 State Management Strategy

### Client-Side State (Web Portal)

```typescript
// Auth State (Zustand)
- User information
- JWT token
- Role & permissions

// UI State (Zustand)
- Sidebar open/closed
- Theme (light/dark)
- Active filters

// Server State (React Query)
- Courses data
- Students data
- Analytics data
- Auto-caching (5-15 min)
- Background refetch
- Optimistic updates
```

### Mobile State (React Native)

```typescript
// Offline-First (WatermelonDB + React Query)
- Course content cached locally
- Progress synced when online
- Media files downloaded for offline
- Queue for pending uploads
```

## 🚀 Deployment Architecture

### Production Setup

```
┌──────────────────────────────────────────────────────────┐
│                    CDN (Cloudflare)                       │
│              Static Assets + Image Optimization          │
└────────────────┬─────────────────────────────────────────┘
                 │
       ┌─────────┴──────────┐
       │                    │
       ▼                    ▼
┌─────────────┐      ┌─────────────┐
│  Vercel     │      │   Expo      │
│  (Web App)  │      │ (Mobile App)│
└──────┬──────┘      └──────┬──────┘
       │                    │
       └──────────┬─────────┘
                  │ API Requests
                  ▼
         ┌────────────────┐
         │  Strapi (AWS)  │
         │  Load Balanced │
         └────┬───────┬───┘
              │       │
              ▼       ▼
      ┌───────────┐ ┌─────────┐
      │PostgreSQL │ │  S3     │
      │  (RDS)    │ │ (Media) │
      └───────────┘ └─────────┘
```

### Scaling Strategy

**Vertical Scaling (Initial)**
- Single Strapi instance
- Managed PostgreSQL (AWS RDS)
- S3 for media storage

**Horizontal Scaling (Growth)**
- Multiple Strapi instances behind load balancer
- Redis for session management
- CDN for media delivery
- Database read replicas

## 📊 Performance Optimization

### Web Portal
- Server-side rendering (Next.js SSR)
- Static generation for public pages
- Code splitting & lazy loading
- Image optimization (Next.js Image)
- React Query caching

### Mobile App
- Offline-first architecture
- Lazy loading images
- Video streaming (adaptive bitrate)
- Background sync
- Push notifications (Firebase)

### Backend
- Database indexing
- Query optimization
- API response caching (Redis)
- CDN for static assets
- Webhook debouncing

## 🔍 Monitoring & Analytics

### Application Monitoring
- **Error Tracking**: Sentry
- **Performance**: Vercel Analytics
- **Uptime**: UptimeRobot
- **Logs**: CloudWatch / Logstash

### Business Analytics
- Course completion rates
- Student engagement metrics
- Quiz performance analysis
- Content popularity
- User retention

### Custom Dashboards
- Real-time enrollment stats
- Teacher activity logs
- System health metrics
- API usage statistics

## 🧪 Testing Strategy

### Unit Tests
- React components (Jest + RTL)
- API client functions
- Utility functions
- Hooks

### Integration Tests
- API endpoint testing
- Database operations
- File upload/download
- Authentication flow

### E2E Tests
- User registration & login
- Course creation workflow
- Quiz submission
- Progress tracking
- Mobile app flows (Detox)

## 📦 Backup & Recovery

### Database Backups
- Daily automated backups
- 30-day retention
- Point-in-time recovery
- Geo-redundant storage

### Media Backups
- S3 versioning enabled
- Cross-region replication
- Lifecycle policies

### Disaster Recovery
- RTO: 4 hours
- RPO: 15 minutes
- Documented runbooks
- Regular recovery drills

---

**Version**: 1.0.0
**Last Updated**: October 2025
**Status**: Production-Ready Architecture
