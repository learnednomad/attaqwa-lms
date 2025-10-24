# Strapi v5 Backend Setup Guide

Complete guide for setting up and configuring the Strapi v5 backend for AttaqwaMasjid LMS.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Database Configuration](#database-configuration)
4. [Content Types](#content-types)
5. [Roles & Permissions](#roles--permissions)
6. [File Upload Configuration](#file-upload-configuration)
7. [API Integration](#api-integration)
8. [Seeding Data](#seeding-data)
9. [Testing](#testing)
10. [Deployment](#deployment)

---

## Prerequisites

### Required Software
- Node.js 20.x or later
- PostgreSQL 14.x or later
- npm or yarn package manager

### Check Versions
```bash
node --version    # Should be v20.x.x or higher
npm --version     # Should be 10.x.x or higher
psql --version    # Should be 14.x or higher
```

---

## Installation

### Step 1: Create Strapi Project

```bash
# Navigate to project root
cd /Users/saninabil/WebstormProjects/attaqwa-lms-admin

# Create Strapi backend (will create a 'backend' directory)
npx create-strapi-app@latest backend --quickstart --no-run

# Navigate to backend directory
cd backend
```

### Step 2: Install PostgreSQL Adapter

```bash
# Install PostgreSQL client
npm install pg
```

### Step 3: Environment Variables

Create `.env` file in the `backend` directory:

```env
# Server
HOST=0.0.0.0
PORT=1337

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=attaqwa_lms
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_secure_password
DATABASE_SSL=false

# Admin JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('base64'))")
ADMIN_JWT_SECRET=your_admin_jwt_secret_here

# API Token Salt
API_TOKEN_SALT=your_api_token_salt_here

# App Keys (generate with: node -e "console.log(require('crypto').randomBytes(16).toString('base64'))")
APP_KEYS=key1,key2,key3,key4

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Transfer Token Salt
TRANSFER_TOKEN_SALT=your_transfer_token_salt_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Step 4: Generate Secrets

```bash
# Generate secure secrets
node -e "console.log('ADMIN_JWT_SECRET=' + require('crypto').randomBytes(64).toString('base64'))"
node -e "console.log('API_TOKEN_SALT=' + require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('base64'))"
node -e "console.log('TRANSFER_TOKEN_SALT=' + require('crypto').randomBytes(32).toString('base64'))"

# Generate 4 app keys
node -e "for(let i=0; i<4; i++) console.log('APP_KEY_' + (i+1) + '=' + require('crypto').randomBytes(16).toString('base64'))"
```

---

## Database Configuration

### Step 1: Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE attaqwa_lms;

# Create user (optional, or use existing postgres user)
CREATE USER attaqwa_admin WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE attaqwa_lms TO attaqwa_admin;

# Exit PostgreSQL
\q
```

### Step 2: Configure Database Connection

Update `config/database.ts` in the backend directory:

```typescript
export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'attaqwa_lms'),
      user: env('DATABASE_USERNAME', 'postgres'),
      password: env('DATABASE_PASSWORD', ''),
      ssl: env.bool('DATABASE_SSL', false) && {
        rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false),
      },
    },
    debug: false,
  },
});
```

### Step 3: Test Database Connection

```bash
# Start Strapi development server
npm run develop

# If successful, you should see:
# "Project information"
# "Server running on http://localhost:1337"
```

---

## Content Types

### Creating Content Types via Admin Panel

1. Start Strapi: `npm run develop`
2. Open browser: `http://localhost:1337/admin`
3. Create admin account (first time only)
4. Navigate to **Content-Type Builder**

### Content Type 1: Course

**Display Name**: Course
**API ID (Singular)**: course
**API ID (Plural)**: courses

**Fields**:

| Field Name | Type | Options |
|------------|------|---------|
| title | Text | Required, Unique |
| description | Rich Text | Required |
| category | Enumeration | Values: quran, hadith, fiqh, seerah, aqeedah, general. Required |
| difficulty | Enumeration | Values: beginner, intermediate, advanced. Required |
| ageTier | Text | Default: "all" |
| coverImage | Media | Single image, Required |
| duration | Number | Integer, Required |
| isPublished | Boolean | Default: false |
| instructor | Relation | User (from users-permissions), Many-to-One |
| lessons | Relation | Lesson, One-to-Many |

**Settings**:
- Enable Draft & Publish
- Add createdAt and updatedAt timestamps

### Content Type 2: Lesson

**Display Name**: Lesson
**API ID (Singular)**: lesson
**API ID (Plural)**: lessons

**Fields**:

| Field Name | Type | Options |
|------------|------|---------|
| title | Text | Required |
| description | Rich Text | Optional |
| type | Enumeration | Values: video, audio, article, quiz, interactive. Required |
| content | JSON | Required |
| duration | Number | Integer, Required |
| order | Number | Integer, Required |
| isRequired | Boolean | Default: true |
| isLocked | Boolean | Default: false |
| course | Relation | Course, Many-to-One |

**Settings**:
- Enable Draft & Publish
- Add createdAt and updatedAt timestamps

### Content Type 3: Quiz

**Display Name**: Quiz
**API ID (Singular)**: quiz
**API ID (Plural)**: quizzes

**Fields**:

| Field Name | Type | Options |
|------------|------|---------|
| title | Text | Required |
| lesson | Relation | Lesson, One-to-One |
| questions | JSON | Required |
| passingScore | Number | Integer, Default: 70 |
| timeLimit | Number | Integer, Optional |
| randomizeQuestions | Boolean | Default: false |
| randomizeOptions | Boolean | Default: false |
| showAnswers | Boolean | Default: true |

**Settings**:
- Enable Draft & Publish

### Content Type 4: Enrollment

**Display Name**: Enrollment
**API ID (Singular)**: enrollment
**API ID (Plural)**: enrollments

**Fields**:

| Field Name | Type | Options |
|------------|------|---------|
| user | Relation | User (from users-permissions), Many-to-One |
| course | Relation | Course, Many-to-One |
| status | Enumeration | Values: enrolled, in_progress, completed. Default: enrolled |
| progress | Number | Integer, Default: 0 |
| enrolledAt | Date | Type: datetime, Required |
| completedAt | Date | Type: datetime, Optional |
| lastAccessedAt | Date | Type: datetime, Required |

### Content Type 5: LessonCompletion

**Display Name**: Lesson Completion
**API ID (Singular)**: lesson-completion
**API ID (Plural)**: lesson-completions

**Fields**:

| Field Name | Type | Options |
|------------|------|---------|
| user | Relation | User (from users-permissions), Many-to-One |
| lesson | Relation | Lesson, Many-to-One |
| enrollment | Relation | Enrollment, Many-to-One |
| completed | Boolean | Default: false |
| completedAt | Date | Type: datetime, Optional |
| quizScore | Number | Integer, Optional |

### Content Type 6: Achievement

**Display Name**: Achievement
**API ID (Singular)**: achievement
**API ID (Plural)**: achievements

**Fields**:

| Field Name | Type | Options |
|------------|------|---------|
| name | Text | Required, Unique |
| description | Rich Text | Required |
| icon | Text | Required |
| type | Enumeration | Values: bronze, silver, gold, platinum. Required |
| criteria | JSON | Required |
| rarity | Text | Optional |
| points | Number | Integer, Default: 0 |

### Content Type 7: UserAchievement

**Display Name**: User Achievement
**API ID (Singular)**: user-achievement
**API ID (Plural)**: user-achievements

**Fields**:

| Field Name | Type | Options |
|------------|------|---------|
| user | Relation | User (from users-permissions), Many-to-One |
| achievement | Relation | Achievement, Many-to-One |
| progress | Number | Integer, Default: 0 |
| isEarned | Boolean | Default: false |
| earnedAt | Date | Type: datetime, Optional |

### Content Type 8: Leaderboard

**Display Name**: Leaderboard
**API ID (Singular)**: leaderboard
**API ID (Plural)**: leaderboards

**Fields**:

| Field Name | Type | Options |
|------------|------|---------|
| user | Relation | User (from users-permissions), One-to-One |
| points | Number | Integer, Default: 0 |
| rank | Number | Integer, Default: 0 |
| level | Number | Integer, Default: 1 |
| currentStreak | Number | Integer, Default: 0 |
| longestStreak | Number | Integer, Default: 0 |
| totalDaysActive | Number | Integer, Default: 0 |
| lastActivityAt | Date | Type: datetime, Required |

---

## Roles & Permissions

### Step 1: Configure Public Role

Navigate to **Settings > Users & Permissions Plugin > Roles > Public**

**Allowed Permissions**:
- None (public users must authenticate)

### Step 2: Configure Authenticated Role (Students)

Navigate to **Settings > Users & Permissions Plugin > Roles > Authenticated**

**Allowed Permissions**:

**Course**:
- ✅ find (view all courses)
- ✅ findOne (view single course)

**Lesson**:
- ✅ find (view all lessons)
- ✅ findOne (view single lesson)

**Enrollment**:
- ✅ find (view own enrollments)
- ✅ findOne (view own enrollment)
- ✅ create (enroll in courses)

**LessonCompletion**:
- ✅ find (view own completions)
- ✅ create (mark lessons complete)
- ✅ update (update completion status)

**UserAchievement**:
- ✅ find (view own achievements)
- ✅ findOne (view own achievement)

**Leaderboard**:
- ✅ find (view leaderboard)
- ✅ findOne (view own leaderboard entry)

### Step 3: Create Teacher Role

Navigate to **Settings > Users & Permissions Plugin > Roles > Create New Role**

**Role Name**: Teacher
**Description**: Can create and manage courses and lessons

**Allowed Permissions**:

**Course**:
- ✅ find
- ✅ findOne
- ✅ create
- ✅ update
- ✅ delete

**Lesson**:
- ✅ find
- ✅ findOne
- ✅ create
- ✅ update
- ✅ delete

**Quiz**:
- ✅ find
- ✅ findOne
- ✅ create
- ✅ update
- ✅ delete

**Enrollment**:
- ✅ find (view all enrollments)
- ✅ findOne

**LessonCompletion**:
- ✅ find (view all completions)
- ✅ findOne

**Achievement**:
- ✅ find
- ✅ findOne

**UserAchievement**:
- ✅ find
- ✅ findOne

**Leaderboard**:
- ✅ find
- ✅ findOne

### Step 4: Create Admin Role

Navigate to **Settings > Users & Permissions Plugin > Roles > Create New Role**

**Role Name**: Admin
**Description**: Full system access

**Allowed Permissions**:
- ✅ Select All (full CRUD on all content types)

---

## File Upload Configuration

### Step 1: Install Upload Provider (Local)

The local upload provider is included by default. For production, consider cloud providers:

```bash
# AWS S3 (recommended for production)
npm install @strapi/provider-upload-aws-s3

# Cloudinary (alternative)
npm install @strapi/provider-upload-cloudinary
```

### Step 2: Configure Upload Plugin

Create/update `config/plugins.ts`:

```typescript
export default ({ env }) => ({
  upload: {
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: 10 * 1024 * 1024, // 10MB
      },
      // For AWS S3 (production):
      // provider: 'aws-s3',
      // providerOptions: {
      //   accessKeyId: env('AWS_ACCESS_KEY_ID'),
      //   secretAccessKey: env('AWS_ACCESS_SECRET'),
      //   region: env('AWS_REGION'),
      //   params: {
      //     Bucket: env('AWS_BUCKET'),
      //   },
      // },
    },
  },
});
```

### Step 3: Configure CORS

Update `config/middlewares.ts`:

```typescript
export default [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          'media-src': ["'self'", 'data:', 'blob:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'http://localhost:3000', // Next.js dev
        'http://localhost:8081', // Expo dev
        env('FRONTEND_URL', 'http://localhost:3000'),
      ],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

---

## API Integration

### Step 1: Update Next.js Environment Variables

Update `.env.local` in the Next.js project root:

```env
# Strapi API URL
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api
NEXT_PUBLIC_STRAPI_MEDIA_URL=http://localhost:1337

# For production:
# NEXT_PUBLIC_STRAPI_URL=https://api.attaqwa.com/api
# NEXT_PUBLIC_STRAPI_MEDIA_URL=https://api.attaqwa.com
```

### Step 2: Test API Connection

Create a test script `backend/test-connection.js`:

```javascript
const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337/api';

async function testConnection() {
  try {
    // Test health endpoint
    const health = await axios.get(`${STRAPI_URL}/_health`);
    console.log('✅ Strapi is running');

    // Test authentication
    const auth = await axios.post(`${STRAPI_URL}/auth/local`, {
      identifier: 'admin@attaqwa.com',
      password: 'Test1234!',
    });
    console.log('✅ Authentication successful');
    console.log('JWT Token:', auth.data.jwt.substring(0, 20) + '...');

    // Test courses endpoint
    const courses = await axios.get(`${STRAPI_URL}/courses`, {
      headers: {
        Authorization: `Bearer ${auth.data.jwt}`,
      },
    });
    console.log('✅ Courses endpoint accessible');
    console.log('Total courses:', courses.data.data.length);

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testConnection();
```

Run the test:
```bash
cd backend
node test-connection.js
```

### Step 3: Update Next.js API Client

The existing `lib/api/strapi-client.ts` should work, but verify the base URL:

```typescript
const strapiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

---

## Seeding Data

### Step 1: Create Seed Script

Create `backend/scripts/seed.js`:

```javascript
const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337/api';
let JWT_TOKEN = '';

async function authenticate() {
  try {
    const response = await axios.post(`${STRAPI_URL}/auth/local`, {
      identifier: process.env.ADMIN_EMAIL || 'admin@attaqwa.com',
      password: process.env.ADMIN_PASSWORD || 'Test1234!',
    });
    JWT_TOKEN = response.data.jwt;
    console.log('✅ Authenticated');
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    process.exit(1);
  }
}

async function seedCourses() {
  const courses = [
    {
      title: 'Quran Recitation Basics',
      description: 'Learn the fundamentals of Quran recitation with proper Tajweed rules.',
      category: 'quran',
      difficulty: 'beginner',
      ageTier: 'all',
      duration: 480, // 8 hours
      isPublished: true,
    },
    {
      title: 'Hadith Studies - Introduction',
      description: 'Comprehensive introduction to Hadith sciences and authentication.',
      category: 'hadith',
      difficulty: 'intermediate',
      ageTier: 'youth',
      duration: 600, // 10 hours
      isPublished: true,
    },
    {
      title: 'Islamic History & Seerah',
      description: 'Journey through the life of Prophet Muhammad (PBUH) and early Islamic history.',
      category: 'seerah',
      difficulty: 'beginner',
      ageTier: 'all',
      duration: 720, // 12 hours
      isPublished: true,
    },
  ];

  for (const course of courses) {
    try {
      const response = await axios.post(
        `${STRAPI_URL}/courses`,
        { data: course },
        {
          headers: {
            Authorization: `Bearer ${JWT_TOKEN}`,
          },
        }
      );
      console.log(`✅ Created course: ${course.title}`);
    } catch (error) {
      console.error(`❌ Failed to create course: ${course.title}`, error.response?.data || error.message);
    }
  }
}

async function seedAchievements() {
  const achievements = [
    {
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      type: 'bronze',
      criteria: { lessonsCompleted: 1 },
      rarity: 'common',
      points: 10,
    },
    {
      name: 'Week Warrior',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      type: 'silver',
      criteria: { streakDays: 7 },
      rarity: 'uncommon',
      points: 50,
    },
    {
      name: 'Course Master',
      description: 'Complete a course with 95%+ score',
      icon: '🏆',
      type: 'gold',
      criteria: { courseScore: 95 },
      rarity: 'rare',
      points: 100,
    },
    {
      name: 'Quran Scholar',
      description: 'Complete all Quran courses',
      icon: '📖',
      type: 'platinum',
      criteria: { categoryCompleted: 'quran' },
      rarity: 'legendary',
      points: 500,
    },
  ];

  for (const achievement of achievements) {
    try {
      const response = await axios.post(
        `${STRAPI_URL}/achievements`,
        { data: achievement },
        {
          headers: {
            Authorization: `Bearer ${JWT_TOKEN}`,
          },
        }
      );
      console.log(`✅ Created achievement: ${achievement.name}`);
    } catch (error) {
      console.error(`❌ Failed to create achievement: ${achievement.name}`, error.response?.data || error.message);
    }
  }
}

async function main() {
  console.log('🚀 Starting seed process...\n');

  await authenticate();
  await seedCourses();
  await seedAchievements();

  console.log('\n✅ Seed process completed!');
}

main();
```

### Step 2: Run Seed Script

```bash
cd backend
node scripts/seed.js
```

---

## Testing

### Step 1: Manual Testing Checklist

**Authentication**:
- [ ] Can register new user
- [ ] Can login with email/password
- [ ] JWT token is returned
- [ ] Token is valid for API requests

**Courses**:
- [ ] Can create course
- [ ] Can list all courses
- [ ] Can get single course
- [ ] Can update course
- [ ] Can delete course
- [ ] Can upload cover image

**Lessons**:
- [ ] Can create lesson
- [ ] Can list lessons by course
- [ ] Can get single lesson
- [ ] Can update lesson
- [ ] Can delete lesson

**Enrollments**:
- [ ] Can enroll in course
- [ ] Can view enrollments
- [ ] Can track progress

### Step 2: API Testing with Postman/Insomnia

**Collection Variables**:
- `baseUrl`: http://localhost:1337/api
- `token`: (JWT token from login)

**Test Requests**:

1. **Login**:
```
POST {{baseUrl}}/auth/local
Body: {
  "identifier": "admin@attaqwa.com",
  "password": "Test1234!"
}
```

2. **Get Courses**:
```
GET {{baseUrl}}/courses
Headers: Authorization: Bearer {{token}}
```

3. **Create Course**:
```
POST {{baseUrl}}/courses
Headers: Authorization: Bearer {{token}}
Body: {
  "data": {
    "title": "Test Course",
    "description": "Test description",
    "category": "quran",
    "difficulty": "beginner",
    "duration": 60,
    "isPublished": false
  }
}
```

---

## Deployment

### Production Checklist

**Security**:
- [ ] Change all default passwords
- [ ] Generate strong JWT secrets
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting

**Database**:
- [ ] Use managed PostgreSQL (AWS RDS, DigitalOcean, etc.)
- [ ] Enable SSL for database connection
- [ ] Set up automated backups
- [ ] Configure connection pooling

**File Storage**:
- [ ] Use cloud storage (AWS S3, Cloudinary)
- [ ] Configure CDN for media files
- [ ] Set up CORS for media URLs

**Server**:
- [ ] Use PM2 or similar for process management
- [ ] Set up reverse proxy (Nginx)
- [ ] Configure SSL certificates
- [ ] Set up monitoring and logging

### Deployment Platforms

**Option 1: Heroku**
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create attaqwa-lms-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set DATABASE_SSL=true
# ... (set all other env vars)

# Deploy
git push heroku main
```

**Option 2: DigitalOcean App Platform**
1. Connect GitHub repository
2. Select "backend" directory
3. Add PostgreSQL database
4. Set environment variables
5. Deploy

**Option 3: Railway**
1. Connect GitHub repository
2. Add PostgreSQL database
3. Set environment variables
4. Deploy automatically on push

---

## Troubleshooting

### Common Issues

**Issue**: Cannot connect to PostgreSQL
**Solution**:
1. Check PostgreSQL is running: `pg_isready`
2. Verify database credentials in `.env`
3. Ensure database exists: `psql -U postgres -l`
4. Check firewall settings

**Issue**: CORS errors from Next.js
**Solution**:
1. Check `config/middlewares.ts` has correct origin
2. Ensure credentials are enabled
3. Verify FRONTEND_URL environment variable

**Issue**: File upload not working
**Solution**:
1. Check file size limits in `config/plugins.ts`
2. Verify upload directory permissions
3. Check CORS settings for media URLs

**Issue**: JWT token invalid
**Solution**:
1. Verify JWT_SECRET is set correctly
2. Check token expiration settings
3. Ensure token is being sent in Authorization header

---

## Maintenance

### Regular Tasks

**Daily**:
- Monitor error logs
- Check API response times
- Review failed requests

**Weekly**:
- Database backups verification
- Security updates
- Performance monitoring

**Monthly**:
- Dependency updates
- Security audit
- Database optimization
- Storage cleanup

---

## Resources

- [Strapi Documentation](https://docs.strapi.io)
- [Strapi v5 Release Notes](https://strapi.io/five)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [API Security Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Ready for Implementation
