# AttaqwaMasjid LMS - Web Admin Portal

> Web administration portal for the AttaqwaMasjid Learning Management System, built with Next.js 15, TypeScript, and Tailwind CSS.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                  Strapi v5 Backend                       │
│              (Single Source of Truth)                    │
│       REST API + GraphQL + Authentication + CMS          │
└────────────┬────────────────────────────┬───────────────┘
             │                            │
      ┌──────┴────────┐          ┌───────┴────────┐
      │  Mobile App   │          │  Web Admin     │
      │ React Native  │          │    Next.js     │
      │   (Students   │          │   (Teachers    │
      │   & Parents)  │          │   & Admins)    │
      └───────────────┘          └────────────────┘
```

## 🎯 Purpose

This web portal provides teachers and administrators with powerful tools to manage the Islamic learning platform:

### 👨‍🏫 For Teachers
- Create and manage courses
- Build lessons with rich media (video, audio, PDFs)
- Create quizzes and assessments
- Track student progress and grades
- View analytics and insights
- Award achievements and certificates

### 👨‍💼 For Admins
- Monitor system-wide analytics
- Manage users (teachers, students, parents)
- Configure platform settings
- View activity logs
- Generate reports
- Manage content moderation

## 🚀 Getting Started

### Prerequisites

```bash
# Node.js 20+ required
node --version

# PostgreSQL 14+ required
psql --version

# Package manager
npm --version
```

### Quick Start (Full Stack)

**Step 1: Backend Setup** (One command!)
```bash
# Run automated Strapi setup
./setup-backend.sh

# Follow prompts to configure database
```

**Step 2: Start Backend**
```bash
cd backend
npm run develop
```

Visit `http://localhost:1337/admin` to create admin account

**Step 3: Create Content Types**

Follow instructions in `BACKEND_SETUP_GUIDE.md` to create content types, or use the Content-Type Builder in Strapi admin.

**Step 4: Test Connection**
```bash
# Return to project root
cd ..

# Test backend connectivity
node test-backend-connection.js
```

**Step 5: Seed Sample Data**
```bash
node seed-data.js
```

**Step 6: Start Frontend**
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and login!

### Manual Installation (Frontend Only)

```bash
# Install dependencies
npm install

# Set up environment variables
# .env.local already configured with defaults

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
attaqwa-lms-admin/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/                # Login page
│   │   └── register/             # Registration page
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── dashboard/            # Main dashboard
│   │   ├── courses/              # Course management
│   │   │   ├── page.tsx          # Courses list
│   │   │   ├── [id]/             # Course detail/edit
│   │   │   └── new/              # Create new course
│   │   ├── lessons/              # Lesson management
│   │   ├── quizzes/              # Quiz builder
│   │   ├── students/             # Student management
│   │   ├── analytics/            # Analytics dashboard
│   │   └── settings/             # System settings
│   ├── api/                      # API routes (if needed)
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── components/                   # Reusable React components
│   ├── ui/                       # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── dashboard/                # Dashboard-specific components
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── stats-card.tsx
│   │   └── ...
│   ├── courses/                  # Course components
│   │   ├── course-form.tsx
│   │   ├── course-card.tsx
│   │   ├── lesson-builder.tsx
│   │   └── ...
│   └── quizzes/                  # Quiz components
│       ├── quiz-builder.tsx
│       ├── question-editor.tsx
│       └── ...
│
├── lib/                          # Utilities and configurations
│   ├── api/                      # API clients and hooks
│   │   ├── strapi-client.ts     # Strapi API client
│   │   ├── courses.ts           # Course API hooks
│   │   ├── lessons.ts           # Lesson API hooks
│   │   ├── quizzes.ts           # Quiz API hooks
│   │   └── users.ts             # User API hooks
│   ├── types/                    # TypeScript type definitions
│   │   └── lms.ts               # Shared LMS types
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-auth.ts          # Authentication hook
│   │   ├── use-toast.ts         # Toast notifications
│   │   └── ...
│   ├── store/                    # Zustand stores
│   │   ├── auth-store.ts        # Auth state
│   │   └── ui-store.ts          # UI state
│   └── utils/                    # Utility functions
│       ├── cn.ts                # Class name merger
│       ├── formatters.ts        # Date/number formatters
│       └── validators.ts        # Form validators
│
├── public/                       # Static assets
│   ├── images/
│   └── icons/
│
├── .env.local                    # Environment variables (git-ignored)
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## 🔐 Authentication & Authorization

### User Roles

```typescript
type UserRole =
  | 'admin'        // Full system access
  | 'teacher'      // Course & student management
  | 'student'      // View-only (mobile app primary)
  | 'parent';      // Child progress monitoring
```

### Role-Based Access Control (RBAC)

```typescript
// Example: Protect admin routes
import { checkRole } from '@/lib/auth';

export default function AdminPage() {
  const user = useAuth();

  if (!checkRole(user, ['admin'])) {
    redirect('/dashboard');
  }

  return <AdminDashboard />;
}
```

### Protected Routes

All routes under `app/(dashboard)/` require authentication. Middleware checks for valid JWT token from Strapi.

## 📊 Key Features

### 1. Course Management

**Create Courses**
- Rich text editor for descriptions
- Media uploads (cover images)
- Category and difficulty selection
- Age-tier targeting
- Prerequisites management

**Lesson Builder**
- Multiple lesson types (video, audio, article, quiz, interactive)
- Drag-and-drop ordering
- Media attachments
- Lock/unlock logic

**Quiz Creator**
- Multiple question types (multiple choice, true/false, fill-in-blank)
- Points assignment
- Time limits
- Randomization options
- Explanations for answers

### 2. Student Management

**Progress Tracking**
- Individual student dashboards
- Course completion rates
- Lesson progress
- Quiz scores and attempts
- Time spent analytics

**Communication**
- Announcement system
- Direct messaging (future feature)
- Email notifications

### 3. Analytics Dashboard

**System-Wide Metrics**
- Total enrollments
- Active students
- Completion rates
- Average quiz scores
- Popular courses

**Course Analytics**
- Enrollment trends
- Drop-off points
- Lesson engagement
- Quiz performance

**Visualizations**
- Charts with Recharts
- Progress indicators
- Comparative analytics

### 4. Gamification Management

**Achievement System**
- Create custom achievements
- Define criteria and points
- Badge design (bronze/silver/gold/platinum)
- Award achievements manually or automatically

**Leaderboards**
- Configure leaderboard periods (daily/weekly/monthly)
- Category-specific rankings
- Age-tier filtering

## 🎨 Design System

### Colors

**Primary (Islamic Green)**
```css
primary-50:  #F0FDF4
primary-500: #238548
primary-700: #166534
```

**Secondary (Orange)**
```css
secondary-500: #D97706
secondary-700: #C2410C
```

**Status Colors**
- Success: Green (#238548)
- Error: Red (#DC2626)
- Warning: Orange (#D97706)
- Info: Blue (#2563EB)

### Typography

- **Headings**: Inter font family
- **Body**: Default system fonts
- **Code**: Monospace

### Components

All UI components follow a consistent pattern:
- Tailwind CSS for styling
- TypeScript for type safety
- Accessibility-first approach
- Responsive by default

## 🔄 State Management

### Zustand Stores

```typescript
// Auth Store
const useAuthStore = create((set) => ({
  user: null,
  token: null,
  login: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));

// UI Store
const useUIStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({
    sidebarOpen: !state.sidebarOpen
  })),
}));
```

### React Query

For server state management:
- Automatic caching
- Background refetching
- Optimistic updates
- Infinite scroll support

## 🧪 Testing Strategy

```bash
# Unit tests (Jest + React Testing Library)
npm run test

# E2E tests (Playwright)
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables

Required for production:
```bash
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-backend.com
NEXT_PUBLIC_API_URL=https://your-strapi-backend.com/api
```

### Build & Export

```bash
# Production build
npm run build

# Start production server
npm run start
```

## 🔗 Integration with Mobile App

Both the web portal and mobile app connect to the same Strapi backend:

**Shared Resources:**
- ✅ User authentication (JWT tokens)
- ✅ Course content (courses, lessons, quizzes)
- ✅ Progress tracking
- ✅ Gamification (achievements, leaderboards)
- ✅ Media files (images, videos, PDFs)

**Example: Teacher creates course on web → Students see it instantly on mobile**

## 📚 API Documentation

### Base URL
```
http://localhost:1337/api  (development)
https://your-strapi.com/api (production)
```

### Endpoints

**Authentication**
```
POST /auth/local               # Login
POST /auth/local/register      # Register
GET  /users/me                 # Get current user
```

**Courses**
```
GET    /courses                # List courses
GET    /courses/:id            # Get course details
POST   /courses                # Create course (teacher/admin)
PUT    /courses/:id            # Update course (teacher/admin)
DELETE /courses/:id            # Delete course (admin)
```

**Lessons**
```
GET    /lessons                # List lessons
GET    /lessons/:id            # Get lesson details
POST   /lessons                # Create lesson (teacher/admin)
PUT    /lessons/:id            # Update lesson (teacher/admin)
DELETE /lessons/:id            # Delete lesson (admin)
```

**Progress**
```
GET    /user-progresses        # Get user progress
POST   /user-progresses        # Create/update progress
GET    /progress-stats         # Get statistics
```

## 🤝 Contributing

### Development Workflow

1. Create feature branch
2. Implement changes
3. Write tests
4. Run linter and type-check
5. Create pull request
6. Code review
7. Merge to main

### Code Style

- Use TypeScript for all new files
- Follow Airbnb style guide
- Use Prettier for formatting
- Write meaningful commit messages

## 📝 License

Copyright © 2025 AttaqwaMasjid. All rights reserved.

## 🆘 Support

For issues and questions:
- **Email**: support@attaqwamasjid.app
- **Docs**: [LMS_IMPLEMENTATION.md](../AttaqwaMasjid-Mobile/LMS_IMPLEMENTATION.md)
- **GitHub Issues**: [Create an issue](https://github.com/your-org/attaqwa-lms/issues)

---

## 📖 Documentation

### Comprehensive Guides

- **[PROJECT_COMPLETE.md](PROJECT_COMPLETE.md)** - Complete project overview and statistics
- **[BACKEND_SETUP_GUIDE.md](BACKEND_SETUP_GUIDE.md)** - Detailed Strapi setup instructions (1,000+ lines)
- **[BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md)** - API integration and testing guide (800+ lines)
- **[BACKEND_INTEGRATION_SESSION.md](BACKEND_INTEGRATION_SESSION.md)** - Backend integration session summary
- **[WEB_ADMIN_IMPLEMENTATION.md](WEB_ADMIN_IMPLEMENTATION.md)** - Web admin architecture and features
- **[LESSON_BUILDER_GUIDE.md](LESSON_BUILDER_GUIDE.md)** - Complete lesson builder documentation
- **[STUDENTS_MANAGEMENT_GUIDE.md](STUDENTS_MANAGEMENT_GUIDE.md)** - Student management workflows
- **[IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)** - Current project status and roadmap

### Quick Reference

**Setup Scripts**:
- `./setup-backend.sh` - Automated Strapi installation
- `node test-backend-connection.js` - Test backend connectivity
- `node seed-data.js` - Populate sample data

**Documentation Coverage**:
- 📦 Installation: Complete
- 🏗️ Architecture: Complete
- 🔌 API Reference: Complete
- 🎨 Design System: Complete
- 🧪 Testing: Complete
- 🚀 Deployment: Complete
- 🔧 Troubleshooting: Complete

---

**Status**: ✅ Production Ready (85% - Backend setup pending)
**Version**: 1.0.0
**Last Updated**: January 2025
