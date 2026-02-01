# At-Taqwa LMS Brownfield Enhancement Architecture

> **Document Version:** 1.0.0
> **Last Updated:** December 2024
> **Author:** Winston (Architect Agent)

---

## 1. Introduction

This document outlines the architectural approach for enhancing the **At-Taqwa Islamic LMS** with **API versioning and endpoint restructuring**. Its primary goal is to serve as the guiding architectural blueprint for AI-driven development while ensuring seamless integration with the existing Strapi v5 + Next.js system.

### 1.1 Existing Project Analysis

| Attribute | Current State |
|-----------|---------------|
| **Primary Purpose** | Islamic community platform with LMS, prayer times, and educational content |
| **Current Tech Stack** | Strapi v5 (CMS), Next.js 15 (Web), React Native (Mobile), PostgreSQL, Redis |
| **Architecture Style** | Monorepo (Turborepo) with BFF pattern |
| **Deployment Method** | Docker Compose with optional Coolify integration |

### 1.2 Available Documentation

- `CLAUDE.md` - Project overview and development commands
- `packages/shared/src/index.ts` - Shared constants and types
- `apps/api/src/api/*/` - Strapi content types and routes

### 1.3 Identified Constraints

- Strapi v5 uses `documentId` instead of `id` for document access
- Response format is flattened (no `data.attributes` nesting)
- Mobile app requires backward compatibility during migration
- Prayer times use external Aladhan API integration

---

## 2. Enhancement Scope and Integration Strategy

### 2.1 Enhancement Overview

| Attribute | Value |
|-----------|-------|
| **Enhancement Type** | API Restructuring & Versioning |
| **Scope** | All API endpoints across Strapi and Next.js BFF |
| **Integration Impact** | Medium - requires coordinated frontend/mobile updates |

### 2.2 Integration Approach

| Layer | Strategy |
|-------|----------|
| **Code Integration** | Add versioned routes alongside existing (non-breaking) |
| **Database Integration** | No schema changes required |
| **API Integration** | URL-based versioning with `/api/v1/` prefix |
| **UI Integration** | Update API client configurations |

### 2.3 Compatibility Requirements

- **Existing API Compatibility:** Maintain `/api/*` routes during 12-month deprecation period
- **Database Schema Compatibility:** No changes - API layer only
- **UI/UX Consistency:** No visual changes required
- **Performance Impact:** Minimal - routing layer change only

---

## 3. Tech Stack Alignment

### 3.1 Existing Technology Stack

| Category | Technology | Version | Usage in Enhancement |
|----------|------------|---------|---------------------|
| CMS/Backend | Strapi | 5.27.0 | Custom route configuration |
| Web Frontend | Next.js | 15.4.2 | API route handlers |
| Mobile | React Native/Expo | Latest | API client updates |
| Database | PostgreSQL | 14+ | No changes |
| Cache | Redis | 7+ | No changes |
| Package Manager | pnpm | 8+ | Monorepo management |

### 3.2 New Technology Additions

**None required** - Enhancement uses existing stack capabilities.

---

## 4. API Design and Integration

### 4.1 API Integration Strategy

| Aspect | Approach |
|--------|----------|
| **Versioning Strategy** | URL-based: `/api/v1/*` |
| **Authentication** | Existing Strapi JWT (unchanged) |
| **Deprecation Policy** | 12-month sunset with `Deprecation` headers |

### 4.2 Versioned Endpoint Structure

#### Strapi-Managed Resources (LMS Core)

```
/api/v1/courses                    GET, POST
/api/v1/courses/{documentId}       GET, PUT, DELETE
/api/v1/courses/{documentId}/lessons    GET (sub-resource)
/api/v1/courses/{documentId}/enrollments GET, POST

/api/v1/lessons                    GET, POST
/api/v1/lessons/{documentId}       GET, PUT, DELETE
/api/v1/lessons/{documentId}/progress   GET, PUT

/api/v1/quizzes                    GET, POST
/api/v1/quizzes/{documentId}       GET, PUT, DELETE
/api/v1/quizzes/{documentId}/submissions GET, POST

/api/v1/achievements               GET
/api/v1/leaderboards               GET
/api/v1/streaks                    GET
```

#### User-Centric Resources

```
/api/v1/users/me                   GET, PUT
/api/v1/users/me/enrollments       GET
/api/v1/users/me/progress          GET
/api/v1/users/me/achievements      GET
/api/v1/users/me/streaks           GET
```

#### Islamic Services (Next.js BFF)

```
/api/v1/prayer-times               GET
/api/v1/prayer-times/week          GET
/api/v1/prayer-times/month         GET

/api/v1/ayahs                      GET (was: /api/islamic/ayah)
/api/v1/ayahs/daily                GET
/api/v1/ayahs/{surah}:{ayah}       GET

/api/v1/hadiths                    GET (was: /api/islamic/hadith)
/api/v1/hadiths/{collection}/{number}  GET
```

#### Community Resources

```
/api/v1/announcements              GET, POST
/api/v1/announcements/{id}         GET, PUT, DELETE

/api/v1/events                     GET, POST
/api/v1/events/{id}                GET, PUT, DELETE
```

### 4.3 Response Format (Strapi v5 Standard)

```json
{
  "data": {
    "documentId": "abc123",
    "title": "Introduction to Quran",
    "description": "...",
    "age_tier": "adults",
    "subject": "quran"
  },
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 4,
      "total": 100
    }
  }
}
```

### 4.4 Error Response Format

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Invalid input",
    "details": {}
  }
}
```

---

## 5. External API Integration

### 5.1 Aladhan Prayer Times API

| Attribute | Value |
|-----------|-------|
| **Purpose** | Prayer time calculations |
| **Documentation** | https://aladhan.com/prayer-times-api |
| **Base URL** | https://api.aladhan.com/v1 |
| **Authentication** | None required |
| **Integration** | Proxy through Next.js BFF |

**Key Endpoints Used:**
- `GET /timings/{date}` - Daily prayer times
- `GET /calendar/{year}/{month}` - Monthly calendar

**Error Handling:** 5-layer fallback system (Aladhan -> IslamicFinder -> Local Calculations -> Manual Overrides -> Offline Schedules)

---

## 6. Source Tree Integration

### 6.1 Existing Project Structure (Relevant Parts)

```
attaqwa-lms/
├── apps/
│   ├── api/                       # Strapi CMS
│   │   └── src/api/               # Content types
│   ├── website/                   # Next.js frontend
│   │   └── src/app/api/           # BFF routes
│   └── admin/                     # Admin dashboard
├── packages/
│   ├── shared/                    # Shared constants
│   └── shared-types/              # TypeScript types
└── docs/                          # Documentation
```

### 6.2 New File Organization

```
attaqwa-lms/
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── api/
│   │       │   ├── course/
│   │       │   │   └── routes/
│   │       │   │       └── course.ts      # Add v1 prefix config
│   │       │   └── ...
│   │       └── routes/
│   │           └── v1.ts                  # NEW: Version routing
│   └── website/
│       └── src/
│           └── app/
│               └── api/
│                   └── v1/                # NEW: Versioned routes
│                       ├── prayer-times/
│                       ├── ayahs/         # Renamed from islamic/ayah
│                       └── hadiths/       # Renamed from islamic/hadith
├── packages/
│   └── shared/
│       └── src/
│           ├── index.ts                   # Update API_ENDPOINTS
│           └── api-versions.ts            # NEW: Version constants
└── docs/
    ├── architecture.md                    # This document
    └── api-migration-plan.md              # Migration guide
```

---

## 7. Infrastructure and Deployment

### 7.1 Existing Infrastructure

| Aspect | Current Setup |
|--------|---------------|
| **Deployment** | Docker Compose (dev/staging), Coolify (production) |
| **Infrastructure Tools** | Docker, Nginx, PostgreSQL, Redis |
| **Environments** | Development, Staging, Production |

### 7.2 Enhancement Deployment Strategy

| Phase | Approach |
|-------|----------|
| **Deployment** | Rolling update - add v1 routes alongside existing |
| **Infrastructure Changes** | None - routing layer only |
| **Pipeline Integration** | Existing CI/CD unchanged |

### 7.3 Rollback Strategy

- **Method:** Remove v1 route configurations, revert shared constants
- **Risk Mitigation:** Feature flag for gradual v1 rollout
- **Monitoring:** Track v1 vs legacy endpoint usage

---

## 8. Coding Standards and Conventions

### 8.1 Existing Standards Compliance

| Standard | Current Implementation |
|----------|----------------------|
| **Code Style** | ESLint + Prettier |
| **Linting** | @typescript-eslint, Next.js rules |
| **Testing** | Jest + Testing Library |
| **Documentation** | TypeScript JSDoc comments |

### 8.2 Enhancement-Specific Standards

- **Endpoint Naming:** Lowercase, plural nouns, hyphens for multi-word (`/prayer-times`)
- **Version Prefix:** Always `/api/v1/` - never mix versioning strategies
- **Deprecation Headers:** Include `Deprecation: true` and `Sunset: <date>` on legacy endpoints

---

## 9. Testing Strategy

### 9.1 Existing Test Integration

| Aspect | Approach |
|--------|----------|
| **Framework** | Jest |
| **Organization** | Co-located `*.test.ts` files |
| **Coverage Target** | 70%+ |

### 9.2 New Testing Requirements

#### Unit Tests
- Test new route handlers in `apps/website/src/app/api/v1/`
- Verify response format matches Strapi v5 standard

#### Integration Tests
- Verify v1 and legacy endpoints return identical data
- Test deprecation headers on legacy routes

#### Regression Tests
- Ensure existing mobile app continues working
- Verify admin dashboard functionality unchanged

---

## 10. Security Integration

### 10.1 Existing Security Measures

| Aspect | Implementation |
|--------|----------------|
| **Authentication** | Strapi JWT via users-permissions plugin |
| **Authorization** | Role-based (Admin, Instructor, Student) |
| **Data Protection** | HTTPS, JWT token rotation |
| **Security Tools** | Helmet.js, CORS configuration |

### 10.2 Enhancement Security Requirements

- **No new security measures required** - uses existing auth system
- **Integration Points:** Versioned routes inherit existing middleware
- **Compliance:** No changes to data handling

---

## 11. Checklist Results Summary

See `docs/architect-checklist-results.md` for detailed validation.

**Overall Readiness:** HIGH

| Section | Status |
|---------|--------|
| Requirements Alignment | PASS |
| Architecture Fundamentals | PASS |
| Technical Stack | PASS |
| API Design | PASS (with recommendations) |
| Security | PASS |
| Implementation Guidance | PASS |

---

## 12. Next Steps

### 12.1 Story Manager Handoff

> Implement API versioning for At-Taqwa LMS following this architecture document. Key requirements:
> 1. Add `/api/v1/` prefix to all routes
> 2. Flatten `/api/islamic/*` to `/api/v1/ayahs` and `/api/v1/hadiths`
> 3. Maintain backward compatibility with legacy routes
> 4. Update `packages/shared` with new endpoint constants
>
> **First Story:** Implement versioned endpoint routing infrastructure

### 12.2 Developer Handoff

> Reference this architecture document for all implementation decisions. Key technical constraints:
> 1. Strapi v5 uses `documentId` - update all queries accordingly
> 2. Response format is flattened - no `data.attributes` nesting
> 3. Mobile app requires 12-month backward compatibility
> 4. Use feature flag `API_V1_ENABLED` for gradual rollout
>
> **Implementation Order:**
> 1. Create route infrastructure
> 2. Update shared constants
> 3. Migrate Next.js BFF routes
> 4. Add deprecation headers to legacy routes
> 5. Update frontend API clients
