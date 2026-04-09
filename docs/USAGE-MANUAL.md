# AttaqwaMasjid LMS - Complete Usage Manual

**Version:** 1.0 | **Date:** April 6, 2026 | **Branch:** feat/platform-enhancements

---

## Table of Contents

1. [Quick Start](#1-quick-start)
2. [Development Credentials](#2-development-credentials)
3. [Public Website](#3-public-website)
4. [Student Portal](#4-student-portal)
5. [Teacher Portal](#5-teacher-portal)
6. [Admin Portal](#6-admin-portal)
7. [Strapi CMS](#7-strapi-cms)
8. [API Reference](#8-api-reference)
9. [Infrastructure Services](#9-infrastructure-services)
10. [Known Issues](#10-known-issues)
11. [Testing Results Summary](#11-testing-results-summary)

---

## 1. Quick Start

### Start the Development Stack

```bash
# Start infrastructure (Postgres, MinIO, Strapi)
docker compose -f docker-compose.dev.yml up -d

# Start Next.js apps on host (recommended for Apple Silicon)
pnpm --filter website dev   # http://localhost:3003
pnpm --filter admin dev     # http://localhost:3000
```

### Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| Website | http://localhost:3003 | Public site + Student/Teacher portals |
| Admin Portal | http://localhost:3000 | Masjid admin dashboard |
| Strapi API | http://localhost:1337 | Backend CMS API |
| Strapi Admin | http://localhost:1337/admin | CMS content management |
| MinIO Console | http://localhost:9001 | S3-compatible file storage |
| PostgreSQL | localhost:5432 | Database |

---

## 2. Development Credentials

### Application Users (BetterAuth)

| Role | Email | Password | Portal |
|------|-------|----------|--------|
| Super Admin | superadmin@attaqwa.org | See below | Admin (localhost:3000) |
| Masjid Admin | masjidadmin@attaqwa.org | See below | Admin (localhost:3000) |
| Teacher / Imam | teacher@attaqwa.org | See below | Teacher (localhost:3003/teacher) |
| Student | student@attaqwa.org | See below | Student (localhost:3003/student) |

> See your team lead for development credentials. Never commit passwords to version control.

### Infrastructure

| Service | Username | Password |
|---------|----------|----------|
| MinIO | attaqwa | See your team lead for development credentials. Never commit passwords to version control. |
| PostgreSQL | postgres | See your team lead for development credentials. Never commit passwords to version control. |

---

## 3. Public Website

**URL:** http://localhost:3003

The public website is accessible without login and serves the community with Islamic services, prayer times, educational content, and resources.

### 3.1 Homepage (`/`)

The main landing page displays:
- **Islamic date** in both Gregorian and Hijri calendars with Arabic text
- **Today's Prayer Times** widget with Fajr, Dhuhr, Asr, Maghrib, Isha times
- **Jumu'ah times** (1st: 1:15 PM, 2nd: 2:15 PM)
- **Hadith of the Day** with Arabic text and English translation
- **Services grid** (7 cards) linking to detailed service pages
- **Community Announcements** and **Upcoming Events** sections

**Screenshot:** `docs/screenshots/01-homepage.png`

### 3.2 Prayer Times (`/prayer-times`)

Comprehensive prayer schedule page with:
- Today's adhan and iqamah times for all 5 daily prayers
- Current prayer highlighted with "Live" badge
- Qibla Direction (52 degrees Northwest toward Mecca)
- Mosque location: 2674 Woodwin Rd, Doraville, GA (wheelchair accessible)
- Prayer etiquette checklist
- Jummah prayer schedule
- Prayer facility information (Main Hall, Women's Area, Wudu Facilities)

**Screenshot:** `docs/screenshots/02-prayer-times.png`

### 3.3 Services (`/services`)

Community services hub featuring:
- **24/7 Emergency Services** with phone contact
- **Core Services:** Nikah (Islamic Weddings), Funeral & Burial, Islamic Counseling
- **Additional Services:** Community Support, Legal/Religious Consultation, Youth & Family
- **Online/Digital Services:** Prayer Times, Ramadan, Donate, Quran Learning, Education, Events

**Service Subpages:**
| Page | URL | Description |
|------|-----|-------------|
| Funeral Services | `/services/funeral-services` | Ghusl, Janazah, burial assistance, grief counseling |
| Help the Poor | `/services/help-the-poor` | Food pantry, rent assistance, medical support (1,200+ families helped) |
| Quran Learning | `/services/quran-learning` | Recitation, Hifz program, Islamic studies with weekly schedule |
| Ramadan Services | `/services/ramadan-services` | Taraweeh, Tahajjud, Iftar, Tafseer, I'tikaf, Zakat ul-Fitr |
| Salah Prayer | `/services/salah-prayer` | Redirects to Prayer Times page |
| Zakat & Charity | `/services/zakat-charity` | Redirects to Donate page |

### 3.4 Resources (`/resources`)

Islamic resource hub with:

| Resource | URL | Features |
|----------|-----|----------|
| Quran Study & Tafsir | `/resources/quran-study` | Mushaf viewer with Uthmani script, Surah navigation, thematic study |
| Hadith Collections | `/resources/hadith-collections` | 7 collections, 40,465+ hadiths (Bukhari, Muslim, Tirmidhi, Abu Dawood, Ibn Majah, Nasa'i, Mishkat) |
| Qibla Direction | `/resources/qibla-direction` | Compass-based Qibla finder (requires geolocation) |
| New Muslim Guide | `/resources/new-muslim` | 12 essential topics with downloadable PDF guides |
| Islamic Calendar | `/calendar` | Calendar downloads for Ramadan, Prayer Times, Islamic Holidays, Hajj |

### 3.5 Other Public Pages

| Page | URL | Description |
|------|-----|-------------|
| About | `/about` | Mission, vision, history, leadership team, values |
| Events | `/events` | Community events with categories (Religious, Educational, Family) |
| Announcements | `/announcements` | Community news with search, category filters, email subscription |
| Contact | `/contact` | Contact form, office hours, staff profiles, FAQ, emergency contact |
| Donate | `/donate` | Zakat calculator, donation categories, payment methods, impact display |
| Education | `/education` | Educational programs (Tahfeedul Quran, Weekend School), class schedule |
| Privacy Policy | `/privacy` | GDPR-compliant privacy policy |
| Terms of Service | `/terms` | Legal terms and conditions |

---

## 4. Student Portal

**URL:** http://localhost:3003/student  
**Login:** http://localhost:3003/student/login  
**Credentials:** student@attaqwa.org / (see your team lead for password)

### 4.1 Login Flow

1. Navigate to `/student/login`
2. Enter email and password (or use Student ID tab)
3. Optionally check "Remember me"
4. Click "Login to Student Portal"
5. Redirects to Student Dashboard on success

**Features:** Email login, Student ID login, password show/hide toggle, forgot password link, staff login link

### 4.2 Dashboard (`/student/dashboard`)

After login, the dashboard displays:
- **Stats cards:** Courses Completed (0/6), GPA (3.50/4.00), Active Classes (6/8)
- **GPA comparison chart** (Your GPA vs Average GPA per semester)
- **Daily Class Schedule** with course details
- **Payment & Tuition History** table
- **"Live Data from Strapi"** badge confirms real data connection

### 4.3 Academic Pages

| Page | URL | Key Features |
|------|-----|-------------|
| My Courses | `/student/courses` | 6 active courses with progress tracking, lesson counts, instructor info |
| My Lessons | `/student/lessons` | 25 lessons with search, filters, duration, type labels, Start buttons |
| Browse Courses | `/student/browse` | Course catalog with category filters (Quran, Hadith, Fiqh, Seerah, Arabic, etc.) |
| Assignments | `/student/assignments` | 8 assignments across Pending/Submitted/Graded tabs with point values |
| Grades | `/student/grades` | Cumulative GPA 3.77, semester breakdown, course-by-course scores |
| Transcript | `/student/transcript` | Official transcript with PDF download, program info, grading scale |
| Class Schedule | `/student/schedule` | Weekly grid view with color-coded classes (Mon-Sun) |
| Islamic Calendar | `/student/calendar` | Dual Gregorian/Hijri calendar with Islamic and academic events |

### 4.4 Student Life Pages

| Page | URL | Key Features |
|------|-----|-------------|
| Certificates | `/student/certificates` | 4 earned certificates with download/preview, credential IDs |
| Community | `/student/community` | 320 active students, announcements, study groups, resources |
| Events | `/student/events` | Event registration (Jummah, celebrations, halaqah), RSVP management |
| Study Groups | `/student/groups` | 3 groups, messaging, meeting schedules, Create Group option |

### 4.5 Financial Pages

| Page | URL | Key Features |
|------|-----|-------------|
| Payments | `/student/payments` | Transaction history with search/filter, CSV export, receipt downloads |
| Tuition | `/student/tuition` | $2,750 total with itemized breakdown, payment progress (55%), auto-pay |
| Financial Aid | `/student/financial-aid` | Zakat Aid status ($625 award), eligibility checklist, application portal |

### 4.6 Sidebar Navigation Structure

```
Dashboard
Academic
  - My Courses
  - Class Schedule
  - Grades & Transcript
  - Assignments
  - Islamic Calendar
Documents
Financial
  - Payments
  - Tuition
  - Financial Aid
Student Life
  - Community
  - Events
  - Study Groups
  - Certificates
Logout
```

---

## 5. Teacher Portal

**URL:** http://localhost:3003/teacher  
**Login:** http://localhost:3003/teacher/login  
**Design:** Dark navy/indigo theme (distinct from student green theme)

> **Note:** Teacher login credentials (`teacher@attaqwa.org`) are not yet configured in the auth system. Teacher pages currently render with "Demo Mode (Mock Data)".

### 5.1 Dashboard (`/teacher/dashboard`)

- **Stats:** 57 Total Students, 3 Active Courses, 16 Pending Grading, 60% Avg Progress
- **My Courses:** Fiqh of Worship, Hadith Studies, Arabic Grammar Level 2
- **Students Needing Attention:** Alert cards for at-risk students
- **Today's Schedule** and **Recent Student Activity** feed

### 5.2 Teaching Pages

| Page | URL | Key Features |
|------|-----|-------------|
| My Courses | `/teacher/courses` | 6 courses in card grid, Active/Draft/Archived tabs, action menus |
| Lesson Content | `/teacher/lessons` | 27 lessons, search/filter, Create Lesson button, drag-reorder |
| Create Lesson | `/teacher/lessons/new` | Rich lesson editor |
| Assignments | `/teacher/assignments` | Assignment creation and grading |
| Materials | `/teacher/materials` | Teaching materials management |

### 5.3 Student Management Pages

| Page | URL | Key Features |
|------|-----|-------------|
| Student Roster | `/teacher/students` | 8 students with progress, quiz averages, risk status indicators |
| Grades & Assessment | `/teacher/grades` | Grade entry and assessment tools |
| Progress Reports | `/teacher/progress` | Student progress tracking |
| Attendance | `/teacher/attendance` | Per-section attendance (42 students, 37 present, 3 absent, 2 late) |

### 5.4 Analytics & Settings

| Page | URL | Key Features |
|------|-----|-------------|
| Analytics | `/teacher/analytics` | Completion rates, quiz scores, engagement, top performers, weekly trends |
| Calendar | `/teacher/calendar` | Upcoming exams, lectures, quizzes, parent-teacher conferences |
| Engagement | `/teacher/engagement` | Student engagement metrics |
| Settings | `/teacher/settings` | Profile, Notifications, Security, Preferences tabs |

### 5.5 Sidebar Navigation Structure

```
Teaching
  - My Courses
  - Class Schedule
  - Lesson Content
  - Assignments
Students
  - Student Roster
  - Grades & Assessment
  - Progress Reports
  - Attendance
Resources
  - Materials
Analytics
Settings
Logout
```

---

## 6. Admin Portal

**URL:** http://localhost:3000  
**Login:** http://localhost:3000/login  
**Credentials:** superadmin@attaqwa.org / (see your team lead for password)

### 6.1 Login Flow

1. Navigate to http://localhost:3000 (redirects to `/login`)
2. Left panel shows branding with feature highlights (Course Builder, Analytics, Gamification)
3. Enter email and password
4. Click "Sign In" -> redirects to `/dashboard`

### 6.2 Dashboard (`/dashboard`)

- **Stats:** 1,247 Students (+12%), 24 Courses (+8%), 156 Lessons (+15%), 67% Avg Progress (+5%)
- **Recent Activity** feed showing student actions
- **Popular Courses:** Quran Recitation (342 students), Hadith Studies (256), Islamic History (198), Arabic Grammar (176)
- **Quick Actions** section

### 6.3 Admin Pages

| Page | URL | Key Features |
|------|-----|-------------|
| Courses | `/courses` | Data table with 6 courses, search/filter, Create/Edit/Delete actions |
| New Course | `/courses/new` | Form: Title, Description, Category, Difficulty, Age Group, Duration, Cover Image, Publishing Settings |
| Students | `/students` | Student table with enrollments, progress, points, levels, streaks, status |
| Analytics | `/analytics` | Course performance, student engagement, quiz scores, CSV/PDF export |
| Moderation | `/moderation` | AI-flagged content review queue with status/type filters |
| Prayer Times | `/prayer-times` | Iqamah schedule manager, month selector (Jan-Dec), Add Entry |

### 6.4 Sidebar Navigation

```
Dashboard
Courses
Students
Analytics
Prayer Times
Moderation
```

---

## 7. Strapi CMS

**URL:** http://localhost:1337/admin  
**First-time setup:** Create admin account on first visit

### 7.1 Content Types

| Content Type | API Endpoint | Description |
|-------------|-------------|-------------|
| Course | `/api/v1/courses` | Courses with title, slug, subject, difficulty, age_tier, instructor |
| Lesson | `/api/v1/lessons` | Lessons with content (HTML), order, type, duration |
| Quiz | `/api/v1/quizzes` | Quizzes with questions, time limits, passing scores |
| Announcement | `/api/v1/announcements` | Community announcements with type and priority |
| Event | `/api/v1/events` | Community events with recurring support |
| Achievement | `/api/v1/achievements` | Gamification achievements |
| User Achievement | `/api/v1/user-achievements` | User-earned achievements |
| User Progress | `/api/v1/user-progresses` | Learning progress tracking |
| Course Enrollment | `/api/v1/course-enrollments` | Student course enrollments |
| Streak | `/api/v1/streaks` | Learning streak tracking |
| Leaderboard | `/api/v1/leaderboards` | Gamification leaderboards |
| Prayer Time Override | `/api/v1/prayer-time-overrides` | Admin prayer time overrides (restricted) |
| Iqamah Schedule | `/api/v1/iqamah-schedules` | Iqamah time management |
| Moderation Queue | `/api/v1/moderation-queues` | Content moderation (restricted) |
| Itikaf Registration | `/api/v1/itikaf-registrations` | Ramadan itikaf signups (restricted) |
| Appeal | `/api/v1/appeals` | Student appeals |

### 7.2 Access Control

- **Public:** Courses, Lessons, Quizzes, Announcements, Events, Achievements, Enrollments, Streaks, Leaderboards
- **Restricted (403):** Prayer Time Overrides, Moderation Queues, Itikaf Registrations

---

## 8. API Reference

### 8.1 Website API (localhost:3003)

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/health` | GET | Health check with uptime and version | No |
| `/api/docs` | GET | Full API documentation (JSON) | No |
| `/api/v1/prayer-times` | GET | Today's prayer + iqamah times | No |
| `/api/v1/iqamah-times` | GET | Iqamah times with Jummah schedule | No |
| `/api/v1/courses` | GET | All courses with nested lessons | No |
| `/api/v1/courses/[id]` | GET | Single course details | No |
| `/api/v1/lessons` | GET | All lessons with content | No |
| `/api/v1/lessons/[id]` | GET | Single lesson details | No |
| `/api/v1/announcements` | GET | Community announcements | No |
| `/api/v1/events` | GET | Community events | No |
| `/api/v1/ayahs/daily` | GET | Daily Quran verse with audio | No |
| `/api/v1/ayahs` | GET | Quran verse with tafsir | No |
| `/api/v1/hadiths` | GET | Hadith collection (3 available) | No |
| `/api/v1/quizzes` | GET | Quizzes (answers stripped) | No |
| `/api/v1/mushaf` | GET | Quran page with ayahs | No |
| `/api/v1/tarawih-config` | GET | Tarawih prayer config | No |
| `/api/auth/[...all]` | * | BetterAuth endpoints | Varies |
| `/api/v1/users/me/achievements` | GET | User achievements | Yes |
| `/api/v1/users/me/enrollments` | GET | User enrollments | Yes |
| `/api/v1/users/me/progress` | GET | User progress | Yes |

### 8.2 Example Responses

**Prayer Times:**
```json
{
  "prayerTimes": {
    "date": "2026-04-06",
    "fajr": "05:52", "sunrise": "07:18", "dhuhr": "13:39",
    "asr": "17:14", "maghrib": "20:02", "isha": "21:22",
    "qibla": 52,
    "iqama": { "fajr": "6:45 AM", "dhuhr": "1:15 PM", "asr": "4:15 PM", "maghrib": "8:07 PM", "isha": "8:45 PM" },
    "jummah": ["1:15 PM", "2:15 PM"]
  }
}
```

**Courses:**
```json
{
  "data": [{
    "id": 12, "title": "Stories of the Prophets for Kids",
    "subject": "seerah", "difficulty": "beginner", "age_tier": "children",
    "instructor": "Sister Fatima Rahman", "duration_weeks": 16,
    "lessons": [{ "id": 36, "title": "...", "slug": "..." }]
  }],
  "meta": { "pagination": { "page": 1, "pageSize": 25, "total": 6 } }
}
```

---

## 9. Infrastructure Services

### 9.1 MinIO (S3 Storage)

- **Console:** http://localhost:9001 (see your team lead for credentials)
- **API:** http://localhost:9000
- **Bucket:** `uploads-public` (public read access)
- **Usage:** Strapi media uploads, course cover images, documents

### 9.2 PostgreSQL

- **Host:** localhost:5432
- **Database:** attaqwa_lms
- **Connection:** `postgresql://postgres:<PASSWORD>@localhost:5432/attaqwa_lms` (See your team lead for development credentials)
- **Extensions:** pgcrypto (bcrypt), pgvector (embeddings)

### 9.3 Docker Services

```bash
# View running containers
docker ps

# View logs
docker logs attaqwa-api-dev -f        # Strapi logs
docker logs attaqwa-postgres-dev -f   # Database logs

# Restart a service
docker compose -f docker-compose.dev.yml restart api

# Full stack teardown
docker compose -f docker-compose.dev.yml down -v
```

---

## 10. Known Issues

### Critical

| ID | Area | Issue |
|----|------|-------|
| C1 | API Security | Strapi `/api/v1/quizzes` exposes `correct_answer` and `explanation` fields publicly. Students can see quiz answers via direct Strapi API access. Website API correctly strips these fields. |

### Major

| ID | Area | Issue |
|----|------|-------|
| M1 | Auth | Teacher login credentials (`teacher@attaqwa.org`) not configured in BetterAuth. Teacher portal shows "Demo Mode (Mock Data)". |
| M2 | Routing | `/terms` and `/resources/new-muslim` intermittently redirect to `/student/login`. Middleware routing issue -- these must remain public. |
| M3 | API | Jummah times mismatch: `/api/v1/iqamah-times` returns 1:00 PM/2:00 PM vs `/api/v1/prayer-times` returns 1:15 PM/2:15 PM. |
| M4 | API | `/api/v1/appeals` is publicly accessible without authentication on Strapi. |

### Minor

| ID | Area | Issue |
|----|------|-------|
| m1 | SEO | Generic page titles on Events, Announcements, Donate, Privacy, Terms pages. |
| m2 | UX | Qibla Direction page has no fallback when geolocation is denied. |
| m3 | Data | Calendar data shows 2025 instead of 2026. |
| m4 | Data | Student assignments show Dec 2024 due dates (all overdue). |
| m5 | Data | Teacher calendar stuck at Jan-Feb 2025 (mock data not date-aware). |
| m6 | Data | GPA inconsistency: Dashboard shows 3.50, Grades/Transcript show 3.77. |
| m7 | UX | Dashboard greets "Student" instead of actual name (Ahmed Hassan). |
| m8 | API | Console 401 errors on public pages from unauthenticated `/users/me/*` calls. |
| m9 | API | Auth session endpoint returns bare 404 instead of structured JSON. |
| m10 | Performance | Lesson list endpoints return full HTML content (~134KB responses). |

---

## 11. Testing Results Summary

**Testing Date:** April 6, 2026  
**Tools Used:** Playwright MCP, curl  
**Total Tests:** 97 (23 public pages + 27 student/teacher pages + 14 admin pages + 33 API endpoints)

### Results by Area

| Area | Tests | Passed | Issues |
|------|-------|--------|--------|
| Public Website | 23 pages | 20 pass, 2 redirects, 1 intermittent | 3 major, 7 minor, 1 cosmetic |
| Student Portal | 18 pages | 18 pass | 0 major, 4 minor |
| Teacher Portal | 9 pages | 9 pass | 1 major (auth), 2 minor |
| Admin Portal | 14 tests | 14 pass | 0 major, 2 minor |
| API Endpoints | 33 endpoints | 26 pass (78.8%) | 1 critical, 4 moderate |

### Screenshots Index

All screenshots saved to `docs/screenshots/`:

| Range | Area |
|-------|------|
| 01-23 | Public website pages |
| 30-47 | Student portal pages |
| 50-58 | Teacher portal pages |
| 60-71 | Admin portal + Strapi |

### Detailed Reports

- `docs/screenshots/PUBLIC-PAGES-REPORT.md` - Full public pages analysis
- `docs/screenshots/STUDENT-TEACHER-REPORT.md` - Student & teacher portal analysis
- `docs/screenshots/ADMIN-REPORT.md` - Admin portal & Strapi analysis
- `docs/screenshots/API-ENDPOINTS-REPORT.md` - API endpoint testing results

---

*Generated by automated Playwright MCP testing on April 6, 2026*
