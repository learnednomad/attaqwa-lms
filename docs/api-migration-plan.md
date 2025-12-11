# API Migration Plan: v1 Versioning Implementation

> **Version:** 1.0.0
> **Last Updated:** December 2024
> **Timeline:** 3-Phase Implementation

---

## Executive Summary

This document outlines the migration plan from unversioned API endpoints (`/api/*`) to versioned endpoints (`/api/v1/*`) for the At-Taqwa Islamic LMS platform.

### Goals

1. Implement URL-based API versioning for future-proofing
2. Flatten nested Islamic content endpoints
3. Maintain 100% backward compatibility during transition
4. Zero downtime deployment

---

## Phase 1: Infrastructure Setup (Week 1-2)

### 1.1 Create Versioned Route Structure

**Task:** Add v1 route infrastructure without changing existing endpoints

#### Strapi Routes (apps/api)

```typescript
// apps/api/src/routes/v1.ts (NEW FILE)
export default {
  routes: [
    {
      method: 'GET',
      path: '/v1/courses',
      handler: 'course.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    // ... mirror all existing routes with /v1/ prefix
  ],
};
```

#### Next.js BFF Routes (apps/website)

```
apps/website/src/app/api/
├── v1/                          # NEW: Versioned routes
│   ├── prayer-times/
│   │   └── route.ts            # Copy from ../prayer-times/route.ts
│   ├── ayahs/                   # NEW: Renamed from islamic/ayah
│   │   ├── route.ts
│   │   └── daily/
│   │       └── route.ts
│   └── hadiths/                 # NEW: Renamed from islamic/hadith
│       └── route.ts
├── prayer-times/                # Keep legacy
├── islamic/                     # Keep legacy
└── announcements/               # Keep legacy
```

### 1.2 Update Shared Constants

**File:** `packages/shared/src/index.ts`

```typescript
// ============================================================================
// API ENDPOINTS - VERSIONED (v1)
// ============================================================================
export const API_V1_ENDPOINTS = {
  // Auth (Strapi standard - no version prefix)
  LOGIN: '/api/auth/local',
  REGISTER: '/api/auth/local/register',
  ME: '/api/users/me',
  LOGOUT: '/api/auth/logout',

  // LMS Core
  COURSES: '/api/v1/courses',
  LESSONS: '/api/v1/lessons',
  QUIZZES: '/api/v1/quizzes',
  ACHIEVEMENTS: '/api/v1/achievements',
  LEADERBOARDS: '/api/v1/leaderboards',
  STREAKS: '/api/v1/streaks',

  // User Resources
  USER_PROGRESS: '/api/v1/users/me/progress',
  USER_ENROLLMENTS: '/api/v1/users/me/enrollments',
  USER_ACHIEVEMENTS: '/api/v1/users/me/achievements',

  // Islamic Content (flattened)
  PRAYER_TIMES: '/api/v1/prayer-times',
  AYAHS: '/api/v1/ayahs',
  AYAH_DAILY: '/api/v1/ayahs/daily',
  HADITHS: '/api/v1/hadiths',

  // Community
  ANNOUNCEMENTS: '/api/v1/announcements',
  EVENTS: '/api/v1/events',
} as const;

// ============================================================================
// API ENDPOINTS - LEGACY (deprecated)
// ============================================================================
/** @deprecated Use API_V1_ENDPOINTS instead. Will be removed in v2.0 */
export const API_ENDPOINTS = {
  LOGIN: '/api/auth/local',
  REGISTER: '/api/auth/local/register',
  ME: '/api/users/me',
  LOGOUT: '/api/auth/logout',
  ANNOUNCEMENTS: '/api/announcements',
  EVENTS: '/api/events',
  PRAYER_TIMES: '/api/prayer-times',
  EDUCATION_CONTENT: '/api/education-contents',
  QUIZZES: '/api/quizzes',
  USER_PROGRESS: '/api/user-progress',
} as const;

// ============================================================================
// API VERSION CONFIGURATION
// ============================================================================
export const API_CONFIG = {
  CURRENT_VERSION: 'v1',
  SUPPORTED_VERSIONS: ['v1'] as const,
  DEPRECATION_DATE: '2025-12-01', // 12 months from now
} as const;
```

### 1.3 Add Feature Flag

**File:** `packages/shared/src/feature-flags.ts`

```typescript
// Add to existing feature flags
export const FEATURE_FLAGS = {
  // ... existing flags
  API_V1_ENABLED: true, // Enable v1 endpoints
  API_LEGACY_DEPRECATION_WARNINGS: true, // Show deprecation headers
} as const;
```

---

## Phase 2: Route Implementation (Week 3-4)

### 2.1 Next.js v1 Route Files

#### Prayer Times

**File:** `apps/website/src/app/api/v1/prayer-times/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Same implementation as legacy route
  // ... copy from apps/website/src/app/api/prayer-times/route.ts
}

// Add deprecation notice to legacy route
// In apps/website/src/app/api/prayer-times/route.ts:
export async function GET(request: NextRequest) {
  const response = await getOriginalResponse(request);

  // Add deprecation headers
  response.headers.set('Deprecation', 'true');
  response.headers.set('Sunset', 'Sat, 01 Dec 2025 00:00:00 GMT');
  response.headers.set('Link', '</api/v1/prayer-times>; rel="successor-version"');

  return response;
}
```

#### Ayahs (Renamed from islamic/ayah)

**File:** `apps/website/src/app/api/v1/ayahs/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Implementation from apps/website/src/app/api/islamic/ayah/route.ts
  // With updated endpoint references
}
```

**File:** `apps/website/src/app/api/v1/ayahs/daily/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Daily ayah feature endpoint
}
```

#### Hadiths (Renamed from islamic/hadith)

**File:** `apps/website/src/app/api/v1/hadiths/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Implementation from apps/website/src/app/api/islamic/hadith/route.ts
}
```

### 2.2 Strapi Custom Routes

**Option A: Route Prefix Configuration**

In Strapi v5, configure route prefixes in the content type configuration:

```typescript
// apps/api/src/api/course/routes/course.ts
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::course.course', {
  prefix: '/v1', // Add version prefix
  config: {
    find: {},
    findOne: {},
    create: {},
    update: {},
    delete: {},
  },
});
```

**Option B: Custom Route File (Recommended)**

```typescript
// apps/api/src/api/course/routes/01-custom-course.ts
export default {
  routes: [
    {
      method: 'GET',
      path: '/v1/courses',
      handler: 'course.find',
      config: { auth: false }, // or appropriate auth
    },
    {
      method: 'GET',
      path: '/v1/courses/:id',
      handler: 'course.findOne',
    },
    // ... other CRUD operations
  ],
};
```

---

## Phase 3: Client Migration (Week 5-8)

### 3.1 Update Website API Client

**File:** `apps/website/src/lib/api.ts`

```typescript
import { API_V1_ENDPOINTS, API_CONFIG } from '@attaqwa/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

// Update all API calls to use v1 endpoints
export const announcementsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Announcement>> => {
    const endpoint = API_V1_ENDPOINTS.ANNOUNCEMENTS; // Changed from API_ENDPOINTS
    // ... rest of implementation
  },
};
```

### 3.2 Update Admin API Client

**File:** `apps/admin/lib/api/strapi-client.ts`

```typescript
// Update to use versioned endpoints
// No changes to authentication - uses same JWT system
```

### 3.3 Mobile App Updates (Separate Repository)

```typescript
// In mobile app API configuration
const API_CONFIG = {
  BASE_URL: 'https://api.attaqwa.org',
  VERSION: 'v1',
  ENDPOINTS: {
    COURSES: '/api/v1/courses',
    PRAYER_TIMES: '/api/v1/prayer-times',
    AYAHS: '/api/v1/ayahs', // Updated from /api/islamic/ayah
    HADITHS: '/api/v1/hadiths', // Updated from /api/islamic/hadith
    // ... other endpoints
  },
};
```

---

## Deprecation Timeline

| Date | Action |
|------|--------|
| **Month 0** | Deploy v1 endpoints alongside legacy |
| **Month 1** | Add deprecation headers to legacy routes |
| **Month 3** | Begin logging legacy endpoint usage |
| **Month 6** | Send notification to API consumers |
| **Month 9** | Increase deprecation warning visibility |
| **Month 12** | Remove legacy endpoints |

### Deprecation Headers

All legacy endpoints should return these headers:

```http
Deprecation: true
Sunset: Sat, 01 Dec 2025 00:00:00 GMT
Link: </api/v1/{resource}>; rel="successor-version"
```

---

## Rollback Plan

### If Issues Arise in Phase 1 (Infrastructure)

1. Remove v1 route files
2. Revert shared constants changes
3. No impact to existing functionality

### If Issues Arise in Phase 2 (Route Implementation)

1. Disable `API_V1_ENABLED` feature flag
2. Routes remain but return 404
3. Legacy routes unaffected

### If Issues Arise in Phase 3 (Client Migration)

1. Revert API client to use `API_ENDPOINTS` (legacy)
2. v1 routes remain available for manual testing
3. Restart migration after fixes

---

## Testing Checklist

### Phase 1 Tests

- [ ] v1 route infrastructure created
- [ ] Shared constants updated and exported
- [ ] Feature flag functional
- [ ] Legacy routes unchanged

### Phase 2 Tests

- [ ] All v1 routes return correct data
- [ ] Response format matches Strapi v5 standard
- [ ] Deprecation headers on legacy routes
- [ ] Sub-resources work (`/courses/{id}/lessons`)

### Phase 3 Tests

- [ ] Website uses v1 endpoints
- [ ] Admin dashboard functional
- [ ] Mobile app updated and tested
- [ ] No regressions in existing features

### Integration Tests

- [ ] Authentication works with v1 routes
- [ ] CORS configuration correct
- [ ] Rate limiting applied
- [ ] Error responses consistent

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **v1 Adoption Rate** | 100% new requests | API analytics |
| **Legacy Usage** | 0% by sunset date | API analytics |
| **Error Rate** | < 0.1% | Error tracking |
| **Response Time** | No degradation | APM monitoring |
| **Mobile App Crashes** | No increase | Crash analytics |

---

## Communication Plan

| Audience | Channel | Timing |
|----------|---------|--------|
| Development Team | Slack, GitHub | Immediately |
| Mobile App Users | In-app notification | Month 6 |
| API Documentation | docs.attaqwa.org | Month 0 |
| Release Notes | GitHub Releases | Each phase |

---

## References

- [Architecture Document](./architecture.md)
- [API Versioning Best Practices](https://liblab.com/blog/api-versioning-best-practices)
- [Strapi v5 Documentation](https://docs.strapi.io/cms/api/rest)
- [REST API Naming Conventions](https://restfulapi.net/resource-naming/)
