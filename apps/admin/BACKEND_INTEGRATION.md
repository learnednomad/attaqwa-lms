# Backend Integration Guide

Complete guide for integrating the Next.js admin portal with Strapi v5 backend.

## Quick Start

### 1. Automated Setup (Recommended)

```bash
# Run the automated setup script
./setup-backend.sh

# Follow the prompts to configure database and secrets
```

### 2. Manual Setup

If you prefer manual setup, follow the detailed instructions in `BACKEND_SETUP_GUIDE.md`.

---

## Post-Installation Steps

### Step 1: Start Strapi

```bash
cd backend
npm run develop
```

This will start Strapi on `http://localhost:1337` and open the admin panel.

### Step 2: Create Admin Account

1. Open `http://localhost:1337/admin`
2. Fill in the admin registration form:
   - **First name**: Your name
   - **Last name**: Your surname
   - **Email**: admin@attaqwa.com (or your preferred email)
   - **Password**: Strong password (min 8 characters)
3. Click "Let's start"

### Step 3: Create Content Types

Follow the content type creation instructions in `BACKEND_SETUP_GUIDE.md` or use the Content-Type Builder in Strapi admin panel.

**Quick Links**:
- Navigate to: Content-Type Builder (left sidebar)
- Create Collection Types for:
  - Course
  - Lesson
  - Quiz
  - Enrollment
  - LessonCompletion
  - Achievement
  - UserAchievement
  - Leaderboard

See `BACKEND_SETUP_GUIDE.md` for detailed field specifications.

### Step 4: Configure Permissions

Navigate to **Settings > Users & Permissions Plugin > Roles**

**Public Role**: Disable all permissions (require authentication)

**Authenticated Role** (Students):
- Course: find, findOne
- Lesson: find, findOne
- Enrollment: find, findOne, create
- LessonCompletion: find, create, update
- UserAchievement: find, findOne
- Leaderboard: find, findOne

**Teacher Role** (Create new):
- Course: All operations
- Lesson: All operations
- Quiz: All operations
- Enrollment: find, findOne
- LessonCompletion: find, findOne
- Achievement: find, findOne
- UserAchievement: find, findOne
- Leaderboard: find, findOne

**Admin Role** (Create new):
- All content types: All operations

### Step 5: Test Backend Connection

```bash
# Test connectivity and authentication
node test-backend-connection.js
```

This will verify:
- ✅ Strapi server is running
- ✅ Authentication works
- ✅ Content types are accessible
- ✅ File upload is enabled
- ✅ CRUD operations work

### Step 6: Seed Sample Data

```bash
# Populate database with sample courses and achievements
node seed-data.js
```

This will create:
- 6 sample courses (across all categories)
- 15+ sample lessons
- 7 achievements

---

## Testing Integration with Next.js

### Step 1: Start Both Servers

**Terminal 1 - Strapi Backend**:
```bash
cd backend
npm run develop
```

**Terminal 2 - Next.js Admin**:
```bash
npm run dev
```

### Step 2: Login to Admin Portal

1. Open `http://localhost:3000/login`
2. Use your admin credentials
3. You should be redirected to the dashboard

### Step 3: Test Course Management

1. Navigate to **Courses** in the sidebar
2. Click **Create Course**
3. Fill in the form:
   - Title: Test Course
   - Description: This is a test
   - Category: General
   - Difficulty: Beginner
   - Duration: 60 minutes
   - Upload a cover image
4. Click **Create**
5. Verify the course appears in the list

### Step 4: Test Lesson Creation

1. Click on your test course
2. Click **Add Lesson**
3. Select lesson type (Video, Audio, Article, Quiz)
4. Fill in the details
5. Save and verify

---

## API Endpoints Reference

### Authentication

**Register**:
```bash
POST /api/auth/local/register
Body: {
  "username": "student1",
  "email": "student@example.com",
  "password": "password123"
}
```

**Login**:
```bash
POST /api/auth/local
Body: {
  "identifier": "admin@attaqwa.com",
  "password": "your_password"
}
Response: {
  "jwt": "token_here",
  "user": { ... }
}
```

### Courses

**Get All Courses**:
```bash
GET /api/courses
Headers: Authorization: Bearer {jwt}
Query: ?filters[category][$eq]=quran&filters[isPublished][$eq]=true
```

**Get Single Course**:
```bash
GET /api/courses/:id
Headers: Authorization: Bearer {jwt}
Query: ?populate=lessons
```

**Create Course**:
```bash
POST /api/courses
Headers: Authorization: Bearer {jwt}
Body: {
  "data": {
    "title": "Course Title",
    "description": "Description",
    "category": "quran",
    "difficulty": "beginner",
    "duration": 480,
    "isPublished": true
  }
}
```

**Update Course**:
```bash
PUT /api/courses/:id
Headers: Authorization: Bearer {jwt}
Body: {
  "data": {
    "title": "Updated Title"
  }
}
```

**Delete Course**:
```bash
DELETE /api/courses/:id
Headers: Authorization: Bearer {jwt}
```

### Lessons

**Get Lessons by Course**:
```bash
GET /api/lessons
Headers: Authorization: Bearer {jwt}
Query: ?filters[course][id][$eq]=1&sort=order:asc
```

**Create Lesson**:
```bash
POST /api/lessons
Headers: Authorization: Bearer {jwt}
Body: {
  "data": {
    "title": "Lesson Title",
    "description": "Description",
    "type": "video",
    "content": {
      "url": "https://youtube.com/watch?v=xxx"
    },
    "duration": 30,
    "order": 1,
    "isRequired": true,
    "course": 1
  }
}
```

### File Upload

**Upload Image**:
```bash
POST /api/upload
Headers: Authorization: Bearer {jwt}
Content-Type: multipart/form-data
Body: FormData with file
```

**Get Uploaded Files**:
```bash
GET /api/upload/files
Headers: Authorization: Bearer {jwt}
```

---

## Strapi Query Filters

### Basic Filters

```javascript
// Exact match
?filters[category][$eq]=quran

// Not equal
?filters[isPublished][$ne]=false

// Greater than / Less than
?filters[duration][$gte]=60
?filters[duration][$lte]=120

// Contains (case insensitive)
?filters[title][$containsi]=introduction

// Multiple conditions (AND)
?filters[category][$eq]=quran&filters[difficulty][$eq]=beginner

// Multiple conditions (OR)
?filters[$or][0][category][$eq]=quran&filters[$or][1][category][$eq]=hadith
```

### Population

```javascript
// Populate relations
?populate=lessons

// Deep populate
?populate[lessons][populate]=quiz

// Select specific fields
?populate[lessons][fields][0]=title&populate[lessons][fields][1]=type

// Populate multiple relations
?populate[0]=lessons&populate[1]=instructor
```

### Sorting

```javascript
// Ascending
?sort=title:asc

// Descending
?sort=createdAt:desc

// Multiple sorts
?sort[0]=category:asc&sort[1]=title:asc
```

### Pagination

```javascript
// Page-based
?pagination[page]=1&pagination[pageSize]=25

// Offset-based
?pagination[start]=0&pagination[limit]=25
```

### Example Complex Query

```javascript
// Get published Quran courses for beginners, sorted by title, with lessons
GET /api/courses?filters[category][$eq]=quran&filters[difficulty][$eq]=beginner&filters[isPublished][$eq]=true&populate=lessons&sort=title:asc&pagination[page]=1&pagination[pageSize]=10
```

---

## Troubleshooting

### Issue: "Cannot connect to Strapi"

**Solutions**:
1. Verify Strapi is running: `cd backend && npm run develop`
2. Check Strapi URL in `.env.local`: `NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api`
3. Verify no firewall blocking port 1337

### Issue: "403 Forbidden"

**Solutions**:
1. Check user role permissions in Strapi admin
2. Verify JWT token is valid and not expired
3. Ensure the authenticated user has the correct role
4. Check role permissions for the specific content type

### Issue: "404 Not Found - Content Type"

**Solutions**:
1. Verify content types are created in Strapi
2. Check API ID matches exactly (singular vs plural)
3. Restart Strapi after creating content types

### Issue: "File upload fails"

**Solutions**:
1. Check file size limits in `config/plugins.ts`
2. Verify upload permissions for user role
3. Check CORS settings in `config/middlewares.ts`
4. Ensure Content-Type header is `multipart/form-data`

### Issue: "CORS errors"

**Solutions**:
1. Update `backend/config/middlewares.ts`:
```typescript
origin: ['http://localhost:3000', 'http://localhost:8081']
```
2. Restart Strapi after changes
3. Clear browser cache

### Issue: "Authentication token expired"

**Solutions**:
1. Implement token refresh logic in Next.js
2. Set longer JWT expiration in Strapi settings
3. Handle 401 responses and redirect to login

---

## Production Deployment

### Environment Variables

**Next.js (.env.production)**:
```env
NEXT_PUBLIC_STRAPI_URL=https://api.attaqwa.com/api
NEXT_PUBLIC_STRAPI_MEDIA_URL=https://api.attaqwa.com
```

**Strapi (.env)**:
```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=production_keys
DATABASE_CLIENT=postgres
DATABASE_HOST=your_db_host
DATABASE_PORT=5432
DATABASE_NAME=attaqwa_lms_prod
DATABASE_USERNAME=prod_user
DATABASE_PASSWORD=secure_password
DATABASE_SSL=true
JWT_SECRET=production_jwt_secret
ADMIN_JWT_SECRET=production_admin_secret
API_TOKEN_SALT=production_salt
TRANSFER_TOKEN_SALT=production_transfer_salt
FRONTEND_URL=https://admin.attaqwa.com
```

### Deployment Checklist

**Security**:
- [ ] Change all default passwords
- [ ] Generate production secrets (don't reuse development secrets)
- [ ] Enable HTTPS
- [ ] Configure CORS for production domains only
- [ ] Set up rate limiting
- [ ] Enable database SSL

**Database**:
- [ ] Use managed PostgreSQL service (AWS RDS, DigitalOcean, etc.)
- [ ] Enable automated backups
- [ ] Configure connection pooling
- [ ] Set up monitoring

**Storage**:
- [ ] Configure cloud storage (AWS S3, Cloudinary)
- [ ] Set up CDN for media files
- [ ] Configure CORS for media URLs

**Monitoring**:
- [ ] Set up error logging (Sentry, LogRocket)
- [ ] Configure uptime monitoring
- [ ] Set up performance monitoring
- [ ] Enable database query logging

### Deployment Platforms

**Recommended Stack**:
- **Next.js**: Vercel
- **Strapi**: Railway, Heroku, or DigitalOcean App Platform
- **Database**: DigitalOcean Managed PostgreSQL or AWS RDS
- **Media**: AWS S3 + CloudFront CDN

**Estimated Monthly Costs**:
- Next.js (Vercel): $0-20 (Pro plan if needed)
- Strapi (Railway): $5-20 (depending on usage)
- PostgreSQL (DigitalOcean): $15 (Basic plan)
- S3 + CloudFront: $5-15 (depending on storage/bandwidth)
- **Total**: ~$25-70/month

---

## Performance Optimization

### Caching Strategy

**Client-Side (Next.js)**:
```typescript
// Use SWR or React Query for client-side caching
import { useQuery } from '@tanstack/react-query';

const { data } = useQuery({
  queryKey: ['courses'],
  queryFn: fetchCourses,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

**Server-Side (Strapi)**:
- Enable REST cache plugin
- Configure Redis for session storage
- Use CDN for static assets

### Database Optimization

**Indexing**:
```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_published ON courses(is_published);
CREATE INDEX idx_lessons_course ON lessons(course_id);
```

**Query Optimization**:
- Use field selection to limit data transfer
- Implement pagination for large datasets
- Use populate wisely (don't over-populate)

---

## Useful Commands

```bash
# Development
npm run develop      # Start Strapi in development mode
npm run build        # Build Strapi for production
npm run start        # Start Strapi in production mode

# Database
npm run strapi       # Strapi CLI
npm run strapi export # Export data
npm run strapi import # Import data

# Content Types
npm run strapi generate # Generate content type, controller, service

# Testing
node test-backend-connection.js  # Test backend connectivity
node seed-data.js                # Seed sample data
```

---

## Additional Resources

- [Strapi Documentation](https://docs.strapi.io)
- [Strapi v5 Migration Guide](https://docs.strapi.io/developer-docs/latest/update-migration-guides/migration-guides/v4-to-v5.html)
- [REST API Documentation](https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest-api.html)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Don%27t_Do_This)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Production Ready
