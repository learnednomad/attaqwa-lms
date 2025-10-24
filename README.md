# AttaqwaMasjid LMS - Web Monorepo

> Unified workspace for AttaqwaMasjid Learning Management System web applications

## 📦 Project Structure

```
attaqwa-lms/
├── apps/
│   ├── admin/          # Next.js admin portal
│   ├── website/        # Public website
│   └── api/            # Strapi v5 backend
├── packages/
│   ├── shared-types/   # Shared TypeScript types
│   └── api-client/     # Shared Strapi API client
└── package.json        # Root workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (recommended: 20.x)
- pnpm 10+ (package manager)
- PostgreSQL 14+ (for Strapi backend)

### Installation

```bash
# Install all dependencies
pnpm install

# Start all services in development
pnpm dev

# Or start individually:
pnpm dev:api        # Strapi backend (http://localhost:1337)
pnpm dev:admin      # Admin portal (http://localhost:3000)
pnpm dev:website    # Public website (http://localhost:3001)
```

## 📱 Mobile App Integration

The React Native mobile app (`AttaqwaMasjid-Mobile`) is **separate** from this monorepo and connects to the backend via HTTP/HTTPS.

**Mobile Location:** `/Users/saninabil/WebstormProjects/AttaqwaMasjid-Mobile`

**Connection:**
```
Mobile App → URL → Strapi Backend (apps/api)
```

**Environment Variables:**
- Development: `EXPO_PUBLIC_STRAPI_URL=http://localhost:1337`
- Production: `EXPO_PUBLIC_STRAPI_URL=https://api.attaqwa.com`

## 🔄 Type Synchronization

### Web Apps (This Monorepo)
Web apps (admin, website) automatically share types via `@attaqwa/shared-types` package.

### Mobile App (Separate)
Mobile app maintains its own copy of types at `src/types/lms.ts`.

**When types change:**
1. Update types in `packages/shared-types/src/index.ts`
2. Manually sync to mobile: Copy to `AttaqwaMasjid-Mobile/src/types/lms.ts`
3. Test both web and mobile apps

**Future:** Consider publishing types as npm package for automatic sync.

## 🏗️ Apps

### Admin Portal (`apps/admin`)
Next.js 15 admin interface for teachers and administrators.
- Create and manage courses
- Build lessons (video, audio, article, quiz, interactive)
- Track student progress
- View analytics

### Website (`apps/website`)
Public-facing website for AttaqwaMasjid.
- Course catalog
- About pages
- Contact information
- Islamic education resources

### API (`apps/api`)
Strapi v5 headless CMS backend serving all platforms.
- RESTful API
- Authentication (JWT)
- File uploads
- PostgreSQL database

## 📦 Shared Packages

### `@attaqwa/shared-types`
TypeScript type definitions shared across web apps.
- Course, Lesson, Quiz types
- User and authentication types
- Media and file types
- Progress tracking types

### `@attaqwa/api-client`
Shared Strapi API client with:
- HTTP client (axios)
- Authentication handling
- Error handling
- Request/response interceptors

## 🛠️ Development Commands

```bash
# Development
pnpm dev              # Start all apps
pnpm dev:admin        # Start admin only
pnpm dev:website      # Start website only
pnpm dev:api          # Start Strapi only

# Building
pnpm build            # Build all apps
pnpm build:admin      # Build admin only
pnpm build:website    # Build website only
pnpm build:api        # Build Strapi only

# Quality
pnpm lint             # Lint all apps
pnpm type-check       # TypeScript check all apps
pnpm clean            # Clean all node_modules
```

## 🔐 Environment Variables

Each app has its own `.env` file:

### `apps/admin/.env.local`
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api
NEXT_PUBLIC_STRAPI_MEDIA_URL=http://localhost:1337
```

### `apps/website/.env.local`
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api
NEXT_PUBLIC_STRAPI_MEDIA_URL=http://localhost:1337
```

### `apps/api/.env`
```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=attaqwa_lms
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
```

## 📚 Documentation

- **[Backend Setup Guide](apps/api/BACKEND_SETUP_GUIDE.md)** - Strapi installation and configuration
- **[Admin Implementation](apps/admin/WEB_ADMIN_IMPLEMENTATION.md)** - Admin portal architecture
- **[API Integration](apps/api/BACKEND_INTEGRATION.md)** - API usage and endpoints

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes
3. Run quality checks: `pnpm lint && pnpm type-check`
4. Commit changes: `git commit -m "feat: description"`
5. Push branch: `git push origin feature/my-feature`
6. Create pull request

## 📄 License

Copyright © 2025 AttaqwaMasjid. All rights reserved.

---

**Status:** ✅ Active Development
**Version:** 1.0.0
**Last Updated:** October 2025
