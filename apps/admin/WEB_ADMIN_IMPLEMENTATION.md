# Web Admin Portal Implementation Guide

Complete documentation for the AttaqwaMasjid LMS Web Admin Portal built with Next.js 15.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Features Implemented](#features-implemented)
4. [Authentication System](#authentication-system)
5. [Course Management](#course-management)
6. [API Integration](#api-integration)
7. [UI Components](#ui-components)
8. [Usage Guide](#usage-guide)
9. [Next Steps](#next-steps)

---

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 3.4
- **State Management**: Zustand with persist middleware
- **API Client**: Axios
- **Backend**: Strapi v5 (Headless CMS)
- **Icons**: Lucide React

### Design Patterns

- **Server Components**: Default for static content
- **Client Components**: For interactive UI (`'use client'`)
- **Route Groups**: Authentication (`(auth)`) and Dashboard (`(dashboard)`)
- **Protected Routes**: Layout-level authentication checks
- **Shared Types**: TypeScript types shared between mobile and web

---

## Project Structure

```
attaqwa-lms-admin/
├── app/
│   ├── (auth)/                    # Authentication routes (public)
│   │   └── login/
│   │       └── page.tsx           # Login page
│   ├── (dashboard)/               # Protected dashboard routes
│   │   ├── layout.tsx             # Dashboard layout with auth protection
│   │   ├── dashboard/
│   │   │   └── page.tsx           # Dashboard home with stats
│   │   └── courses/
│   │       ├── page.tsx           # Courses list with table
│   │       ├── new/
│   │       │   └── page.tsx       # Create course form
│   │       └── [id]/
│   │           └── page.tsx       # Edit course & manage lessons
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
├── components/
│   ├── dashboard/
│   │   ├── header.tsx             # Top navigation bar
│   │   ├── sidebar.tsx            # Main navigation sidebar
│   │   └── stats-card.tsx         # Metric display cards
│   ├── courses/
│   │   └── course-form.tsx        # Reusable course form
│   └── ui/
│       ├── button.tsx             # Button component
│       ├── input.tsx              # Text input component
│       ├── card.tsx               # Card container
│       ├── badge.tsx              # Status badges
│       └── table.tsx              # Data table
├── lib/
│   ├── api/
│   │   └── strapi-client.ts       # Strapi API client
│   ├── store/
│   │   └── auth-store.ts          # Zustand auth store
│   ├── hooks/
│   │   └── use-auth.ts            # Authentication hook
│   └── utils/
│       ├── cn.ts                  # Class name utility
│       └── formatters.ts          # Date/time formatters
├── types/
│   └── lms.ts                     # TypeScript type definitions (500+ lines)
├── tailwind.config.ts             # Tailwind configuration
└── tsconfig.json                  # TypeScript configuration
```

---

## Features Implemented

### ✅ Authentication System

- **Login Page**: Professional split-screen design with branding
- **JWT Authentication**: Token-based auth with Strapi
- **Role-Based Access Control**: Teacher and Admin roles
- **Protected Routes**: Automatic redirect for unauthenticated users
- **Persistent Sessions**: localStorage with Zustand persist
- **User Menu**: Profile dropdown with sign out

### ✅ Dashboard

- **Overview Stats**: 4 key metrics with trend indicators
  - Total Students (with 12% growth trend)
  - Active Courses (with 8% growth trend)
  - Total Lessons (with 15% growth trend)
  - Average Progress (67% with 5% improvement)
- **Recent Activity**: Latest student actions and milestones
- **Popular Courses**: Most enrolled courses with completion rates
- **Quick Actions**: Common tasks (Create Course, View Students, Analytics)

### ✅ Course Management

**Courses List Page**:
- Searchable table with real-time filtering
- Category filter (Quran, Hadith, Fiqh, Seerah, Aqeedah, General)
- Difficulty filter (Beginner, Intermediate, Advanced)
- Table columns: Course, Category, Difficulty, Students, Lessons, Duration, Status, Created, Actions
- Action buttons: View, Edit, Delete (with confirmation)
- Empty state handling

**Course Creation**:
- Complete form with validation
- Fields: Title, Description, Category, Difficulty, Age Group, Duration
- Cover image upload with preview (max 5MB, image validation)
- Publishing toggle (draft vs published)
- Real-time error validation
- Form sections: Basic Info, Cover Image, Publishing Settings

**Course Editing**:
- Pre-populated form with existing course data
- Same validation as creation form
- Lesson management section showing existing lessons
- Individual lesson cards with: Order number, Title, Type, Duration, Required status
- Lesson actions: Edit, Delete (placeholder for future implementation)
- Empty state for courses without lessons
- Loading states during data fetch

### ✅ UI Component Library

**Base Components**:
- `Button`: 5 variants (primary, secondary, outline, ghost, danger), 3 sizes, loading state
- `Input`: Label, error handling, helper text, controlled component
- `Card`: Container with header, content, description sections
- `Badge`: 5 color variants for status indicators
- `Table`: Responsive data table with header, body, footer

**Dashboard Components**:
- `Sidebar`: Role-filtered navigation with active state highlighting
- `Header`: Search bar, notifications, user menu
- `StatsCard`: Metrics with icons, values, trend indicators

**Course Components**:
- `CourseForm`: Reusable form for create/edit with validation

---

## Authentication System

### Login Flow

```typescript
// 1. User enters credentials
const { signIn } = useAuth();
await signIn('teacher@attaqwa.com', 'password');

// 2. API call to Strapi
POST /api/auth/local
{
  identifier: 'teacher@attaqwa.com',
  password: 'password'
}

// 3. Strapi responds with JWT and user data
{
  jwt: 'eyJhbGciOiJIUzI1...',
  user: {
    id: 1,
    username: 'teacher',
    email: 'teacher@attaqwa.com',
    role: { type: 'teacher' }
  }
}

// 4. Store in Zustand with localStorage persist
login(user, token);

// 5. Redirect to dashboard
router.push('/dashboard');
```

### Protected Routes

```typescript
// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login'); // Redirect if not authenticated
    }
  }, [isAuthenticated, isLoading]);

  return isAuthenticated ? (
    <div>
      <Sidebar />
      <Header />
      <main>{children}</main>
    </div>
  ) : null;
}
```

### Role-Based Access

```typescript
// Navigation filtering based on user role
const navigation = [
  { name: 'Dashboard', roles: ['teacher', 'admin'] },
  { name: 'Courses', roles: ['teacher', 'admin'] },
  { name: 'Students', roles: ['teacher', 'admin'] },
  { name: 'Analytics', roles: ['teacher', 'admin'] },
  { name: 'Settings', roles: ['admin'] }, // Admin only
];

const filteredNavigation = navigation.filter(item =>
  checkRole(item.roles)
);
```

---

## Course Management

### Create Course Workflow

```typescript
// 1. Navigate to /courses/new
// 2. Fill out CourseForm
const courseData: CourseFormData = {
  title: 'Introduction to Tajweed',
  description: 'Learn the rules of Quranic recitation...',
  category: 'quran',
  difficulty: 'beginner',
  ageTier: 'adults',
  duration: 180,
  coverImage: File, // Optional image upload
  isPublished: false, // Save as draft
};

// 3. Submit to Strapi
POST /api/courses
Content-Type: multipart/form-data

// FormData structure:
{
  data: JSON.stringify(courseData),
  files.coverImage: File
}

// 4. Redirect to courses list on success
router.push('/courses');
```

### Edit Course Workflow

```typescript
// 1. Navigate to /courses/[id]
// 2. Fetch existing course data
GET /api/courses/123?populate=*

// 3. Pre-populate CourseForm with initial data
<CourseForm initialData={course} />

// 4. User modifies form and submits
PUT /api/courses/123
Content-Type: multipart/form-data

// 5. Redirect to courses list
router.push('/courses');
```

### Form Validation

```typescript
const validateForm = (): boolean => {
  const errors = {};

  // Title validation
  if (!title.trim()) {
    errors.title = 'Course title is required';
  } else if (title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  // Description validation
  if (!description.trim()) {
    errors.description = 'Description is required';
  } else if (description.length < 20) {
    errors.description = 'Description must be at least 20 characters';
  }

  // Category and difficulty required
  if (!category) errors.category = 'Please select a category';
  if (!difficulty) errors.difficulty = 'Please select difficulty';

  return Object.keys(errors).length === 0;
};
```

### Image Upload Validation

```typescript
const handleImageUpload = (file: File) => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    setError('Please upload an image file');
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    setError('Image must be less than 5MB');
    return;
  }

  // Create preview
  const reader = new FileReader();
  reader.onloadend = () => {
    setCoverImagePreview(reader.result as string);
  };
  reader.readAsDataURL(file);
};
```

---

## API Integration

### Strapi Client

```typescript
// lib/api/strapi-client.ts
class StrapiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api',
      headers: { 'Content-Type': 'application/json' },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
  }

  // Authentication
  async login(identifier: string, password: string) {
    const response = await this.client.post('/auth/local', {
      identifier,
      password,
    });
    const { jwt, user } = response.data;
    this.setAuth(jwt);
    return { user, token: jwt };
  }

  // Generic CRUD methods
  async get(endpoint: string) {
    return await this.client.get(endpoint);
  }

  async post(endpoint: string, data: any, config?: any) {
    return await this.client.post(endpoint, data, config);
  }

  async put(endpoint: string, data: any, config?: any) {
    return await this.client.put(endpoint, data, config);
  }

  async delete(endpoint: string) {
    return await this.client.delete(endpoint);
  }
}

export const strapiClient = new StrapiClient();
```

### API Endpoints

```typescript
// Authentication
POST /api/auth/local
Body: { identifier, password }
Response: { jwt, user }

// Courses
GET    /api/courses                    // List all courses
GET    /api/courses?populate=*         // List with relations
GET    /api/courses/:id?populate=*     // Get single course
POST   /api/courses                    // Create course
PUT    /api/courses/:id                // Update course
DELETE /api/courses/:id                // Delete course

// Filters and Search
GET /api/courses?filters[category][$eq]=quran
GET /api/courses?filters[difficulty][$eq]=beginner
GET /api/courses?filters[title][$contains]=Tajweed

// Lessons (nested in courses)
GET    /api/courses/:id?populate=lessons
POST   /api/lessons                    // Create lesson
PUT    /api/lessons/:id                // Update lesson
DELETE /api/lessons/:id                // Delete lesson
```

---

## UI Components

### Button Component

```typescript
<Button variant="primary" size="md" isLoading={false}>
  Save Changes
</Button>

// Variants: primary, secondary, outline, ghost, danger
// Sizes: sm, md, lg
// States: normal, loading, disabled
```

### Input Component

```typescript
<Input
  label="Email Address"
  type="email"
  placeholder="teacher@attaqwa.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  helperText="We'll never share your email"
  required
/>
```

### Card Component

```typescript
<Card>
  <CardHeader>
    <CardTitle>Course Details</CardTitle>
    <CardDescription>Edit course information</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content here */}
  </CardContent>
</Card>
```

### Badge Component

```typescript
<Badge variant="success">Published</Badge>
<Badge variant="warning">Draft</Badge>
<Badge variant="danger">Archived</Badge>
<Badge variant="info">Quran Studies</Badge>
<Badge variant="default">General</Badge>
```

### Table Component

```typescript
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Introduction to Tajweed</TableCell>
      <TableCell><Badge>Published</Badge></TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## Usage Guide

### Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local

# Edit .env.local:
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api

# 3. Start development server
npm run dev

# 4. Open browser
# http://localhost:3000
```

### Login Credentials (Development)

```
Teacher Account:
Email: teacher@attaqwa.com
Password: Teacher123!

Admin Account:
Email: admin@attaqwa.com
Password: Admin123!
```

### Creating a Course

1. Navigate to `/courses`
2. Click "Create Course" button
3. Fill out form:
   - **Title**: "Introduction to Tajweed"
   - **Description**: Detailed course description (min 20 chars)
   - **Category**: Select "Quran Studies"
   - **Difficulty**: Select "Beginner"
   - **Age Group**: Select "All Ages"
   - **Duration**: Enter "180" (minutes)
   - **Cover Image**: Upload image (optional, max 5MB)
   - **Publishing**: Check to publish immediately
4. Click "Create Course"
5. Redirected to courses list

### Editing a Course

1. Navigate to `/courses`
2. Click "Edit" icon on any course row
3. Form pre-populated with existing data
4. Make changes
5. Click "Update Course"
6. View lesson management section below form
7. Click "Add Lesson" to add lessons (future implementation)

### Filtering Courses

1. Navigate to `/courses`
2. Use search bar to search by title
3. Select category from dropdown
4. Select difficulty from dropdown
5. Table updates in real-time

---

## Next Steps

### Immediate Priorities

1. **Lesson Builder** (`/courses/[id]/lessons/new`)
   - Drag-and-drop lesson ordering
   - Rich text editor for content
   - Video/audio upload
   - Quiz question builder
   - Interactive content creator

2. **Students Management** (`/students`)
   - Student list with search and filters
   - Individual student profiles
   - Enrollment management
   - Progress tracking dashboards
   - Communication tools

3. **Analytics Dashboard** (`/analytics`)
   - Course completion rates
   - Student engagement metrics
   - Quiz performance analytics
   - Popular content reports
   - Export functionality

### Future Enhancements

4. **Quiz Creator**
   - Multiple question types
   - Auto-grading configuration
   - Time limits and randomization
   - Question bank management

5. **User Management** (`/users`)
   - Create/edit teachers and admins
   - Role assignment
   - Permission management
   - Activity logs

6. **Settings** (`/settings`)
   - Platform configuration
   - Email templates
   - Notification preferences
   - Gamification settings

7. **Reports** (`/reports`)
   - Custom report builder
   - Scheduled reports
   - PDF/CSV export
   - Visual dashboards

---

## Type Definitions

All TypeScript types are defined in `/types/lms.ts` (500+ lines) and shared between mobile and web platforms.

### Core Types

```typescript
// Course
interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  difficulty: CourseDifficulty;
  ageTier: string;
  coverImage?: string;
  duration: number;
  isPublished: boolean;
  instructor?: Instructor;
  lessons?: Lesson[];
  students?: number;
  createdAt: string;
  updatedAt: string;
}

// Lesson
interface Lesson {
  id: string;
  title: string;
  description: string;
  type: LessonType;
  content: LessonContent;
  duration: number;
  order: number;
  isRequired: boolean;
  isLocked: boolean;
}

// User
interface User {
  id: string;
  username: string;
  email: string;
  role: {
    type: 'student' | 'teacher' | 'admin';
  };
}
```

---

## Design System

### Color Palette

```typescript
// Primary (Teal) - Main actions and links
primary: {
  50: '#f0fdfa',
  500: '#14b8a6',
  600: '#0d9488',
  700: '#0f766e',
}

// Secondary (Amber) - Highlights and accents
secondary: {
  50: '#fffbeb',
  500: '#f59e0b',
  600: '#d97706',
}

// Charcoal - Text and neutral elements
charcoal: {
  50: '#f9fafb',
  300: '#d1d5db',
  600: '#4b5563',
  900: '#111827',
}

// Status colors
green: Success states
yellow: Warning states
red: Error/danger states
blue: Info states
```

### Typography

```typescript
// Headings
h1: 'text-3xl font-bold text-charcoal-900'
h2: 'text-xl font-semibold text-charcoal-900'
h3: 'text-lg font-medium text-charcoal-900'

// Body
body: 'text-base text-charcoal-700'
small: 'text-sm text-charcoal-600'
tiny: 'text-xs text-charcoal-500'
```

### Spacing

```typescript
// Container padding
p-4: 16px
p-6: 24px

// Section spacing
space-y-4: 16px vertical
space-y-6: 24px vertical

// Grid gaps
gap-4: 16px
gap-6: 24px
```

---

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api
```

---

## Troubleshooting

### Common Issues

**Issue**: "Cannot find module 'next/link'"
**Solution**: Ensure `import Link from 'next/link'` (not `'link'`)

**Issue**: "Authentication failed"
**Solution**:
1. Check Strapi is running on port 1337
2. Verify credentials in Strapi admin panel
3. Check CORS settings in Strapi config

**Issue**: "Image upload fails"
**Solution**:
1. Check file size < 5MB
2. Verify file type is image/*
3. Check Strapi upload configuration

**Issue**: "Route not found"
**Solution**: Verify folder structure matches Next.js 15 App Router conventions

---

## Performance Optimization

### Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src={coverImage}
  alt="Course cover"
  fill
  className="object-cover"
  priority={false}
/>
```

### Code Splitting

```typescript
// Dynamic imports for heavy components
const LessonBuilder = dynamic(() => import('@/components/courses/lesson-builder'), {
  loading: () => <Spinner />,
  ssr: false,
});
```

### Caching Strategy

```typescript
// Strapi responses are cached client-side
// Use revalidation for fresh data
const response = await fetch('/api/courses', {
  next: { revalidate: 60 }, // Revalidate every 60 seconds
});
```

---

## Security Considerations

1. **JWT Token Storage**: Stored in localStorage (consider httpOnly cookies for production)
2. **CSRF Protection**: Enabled via Strapi middleware
3. **Input Validation**: Client-side + server-side validation
4. **File Upload**: Type and size restrictions enforced
5. **Role-Based Access**: Route-level and component-level checks
6. **XSS Prevention**: React auto-escapes by default

---

## Testing Strategy (Future)

```typescript
// Unit tests
describe('CourseForm', () => {
  it('validates required fields', () => {
    // Test validation logic
  });
});

// Integration tests
describe('Course CRUD', () => {
  it('creates course successfully', async () => {
    // Test full create workflow
  });
});

// E2E tests
describe('Course Management', () => {
  it('completes full course creation flow', () => {
    // Test user journey
  });
});
```

---

## Deployment (Future)

### Vercel Deployment

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel --prod

# 4. Set environment variables in Vercel dashboard
NEXT_PUBLIC_STRAPI_URL=https://api.attaqwa.com/api
```

### Docker Deployment

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

---

## Contributing Guidelines

1. Follow existing code structure and patterns
2. Use TypeScript for all new files
3. Add proper JSDoc comments to components
4. Follow Tailwind CSS class ordering conventions
5. Test thoroughly before committing
6. Update this documentation for new features

---

## License

Proprietary - AttaqwaMasjid LMS © 2025

---

## Support

For technical support or questions:
- **Email**: support@attaqwa.com
- **Documentation**: /docs
- **Issue Tracker**: GitHub Issues
