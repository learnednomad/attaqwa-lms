# Attaqwa LMS Refactoring - Implementation Plan (Tier 1)

**Timeline**: 5-6 weeks
**Scope**: Core Refactoring (Required)
**Last Updated**: 2025-01-XX

---

## 📋 Table of Contents

- [Overview](#overview)
- [Success Metrics](#success-metrics)
- [Epic Breakdown](#epic-breakdown)
- [Implementation Order](#implementation-order)
- [Risk Mitigation](#risk-mitigation)
- [Daily Standup Template](#daily-standup-template)

---

## Overview

This implementation plan covers **Tier 1 (Core Refactoring)** from the suggestions.md document. It breaks down the 5-6 week refactoring initiative into concrete epics, stories, and tasks with clear acceptance criteria.

**Commitment Level**: Full team commitment required
**Expected Outcome**: Technical debt removed, development unblocked, single source of truth established

---

## Success Metrics

**Before Refactoring** (Baseline - Week 0):
```yaml
TypeScript Errors: [TBD]
Build Time (admin): [TBD]
Build Time (website): [TBD]
Bundle Size (admin): [TBD]
Bundle Size (website): [TBD]
Test Coverage: [TBD]
Duplicate Files: 8+ identified
React Versions: 2 (mismatched)
Strapi Clients: 3 implementations
Type Sources: 2+ sources
```

**After Refactoring** (Target - Week 6):
```yaml
TypeScript Errors: 0
Build Time (admin): Maintained or improved
Build Time (website): Maintained or improved
Bundle Size: Within 5% of baseline
Test Coverage: ≥80%
Duplicate Files: 0
React Versions: 1 (aligned)
Strapi Clients: 1 (@attaqwa/api-client)
Type Sources: 1 (@attaqwa/shared-types)
```

---

## Epic Breakdown

### Epic 0: Foundation & Baselines (Week 0-1)
**Goal**: Establish safety net and measurement infrastructure
**Duration**: 1 week
**Priority**: CRITICAL - Must complete before any code changes

#### Story 0.1: Project Setup & Tracking
**Points**: 2
**Owner**: TBD

**Tasks**:
- [ ] Create GitHub Project or Jira board
- [ ] Set up epics and stories from this document
- [ ] Create `#refactor-attaqwa` Slack channel
- [ ] Schedule daily standups (15 min)
- [ ] Schedule weekly retros (Friday, 30 min)
- [ ] Document rollback procedures

**Acceptance Criteria**:
- ✅ Project board visible to all team members
- ✅ All stories estimated and assigned
- ✅ Communication channels active
- ✅ Rollback procedure documented in wiki/Notion

---

#### Story 0.2: Capture Baseline Metrics
**Points**: 3
**Owner**: TBD

**Tasks**:
- [ ] Run `npx @next/bundle-analyzer` on admin and website
- [ ] Run Lighthouse on staging URLs (admin + website)
- [ ] Measure build times: `time pnpm --filter admin run build`
- [ ] Measure build times: `time pnpm --filter website run build`
- [ ] Run `pnpm -r run typecheck` and count errors
- [ ] Run `pnpm test -- --coverage` and capture coverage %
- [ ] Document all metrics in `BASELINES.md`

**Acceptance Criteria**:
- ✅ `BASELINES.md` created with all metrics
- ✅ Bundle size for each app documented
- ✅ Lighthouse scores captured (Performance, FCP, LCP, TTI)
- ✅ Build times documented
- ✅ TypeScript error count documented
- ✅ Test coverage % documented

**Commands**:
```bash
# Bundle analysis
cd apps/admin && npx @next/bundle-analyzer
cd apps/website && npx @next/bundle-analyzer

# Lighthouse
npx lighthouse https://staging-admin.attaqwa.com --view
npx lighthouse https://staging-website.attaqwa.com --view

# Build times
time pnpm --filter admin run build
time pnpm --filter website run build

# TypeScript
pnpm -r run typecheck 2>&1 | tee typecheck-errors.log

# Coverage
pnpm test -- --coverage
```

---

#### Story 0.3: Add E2E Tests for Critical Paths
**Points**: 5
**Owner**: TBD

**Tasks**:
- [ ] Set up Playwright test structure if not exists
- [ ] Write E2E: Student login → browse courses → view course
- [ ] Write E2E: Student take quiz → submit → view results
- [ ] Write E2E: Admin login → create course → publish
- [ ] Write E2E: Public pages (prayer times, homepage)
- [ ] Ensure tests run in CI/locally
- [ ] Document test running instructions in README

**Acceptance Criteria**:
- ✅ 5+ E2E tests covering critical user journeys
- ✅ All tests passing on current codebase
- ✅ Tests run successfully in CI
- ✅ README updated with test commands

**Test Files**:
```
tests/e2e/
├── student-journey.spec.ts
├── quiz-flow.spec.ts
├── admin-course-management.spec.ts
└── public-pages.spec.ts
```

---

#### Story 0.4: Investigate Current Architecture
**Points**: 3
**Owner**: TBD

**Investigation Questions**:
1. **Auth Contexts**: Why do TWO exist? (StudentAuthContext vs useAuth)
2. **Webpack Chunking**: Why was custom splitChunks added? (Git blame)
3. **Tailwind Versions**: Confirm v3 vs v4 across apps
4. **Type Differences**: Are differences intentional or accidental?
5. **Puppeteer Usage**: Who uses it and why?

**Tasks**:
- [ ] Git blame `apps/website/src/contexts/StudentAuthContext.tsx`
- [ ] Git blame `apps/website/src/lib/hooks/useAuth.tsx`
- [ ] Interview team members about auth separation
- [ ] Git blame `apps/website/next.config.ts` (webpack config)
- [ ] Check Tailwind versions: `pnpm list tailwindcss`
- [ ] Review type files for intentional differences
- [ ] Search codebase for Puppeteer usage: `rg -g '!node_modules' puppeteer`
- [ ] Document findings in `INVESTIGATION_FINDINGS.md`

**Acceptance Criteria**:
- ✅ All 5 questions answered with evidence
- ✅ `INVESTIGATION_FINDINGS.md` created
- ✅ Team consensus on intentional vs accidental duplication
- ✅ Go/no-go decision on each consolidation

---

#### Story 0.5: Add Basic CI Guardrails
**Points**: 3
**Owner**: TBD

**Tasks**:
- [ ] Ensure CI runs: `pnpm -r run lint`
- [ ] Ensure CI runs: `pnpm -r run typecheck`
- [ ] Ensure CI runs: `pnpm test`
- [ ] Add CI job: Bundle size tracking (comment on PR)
- [ ] Add CI job: Build time tracking
- [ ] Set up branch protection (require checks to pass)

**Acceptance Criteria**:
- ✅ Lint failures block PR merge
- ✅ TypeScript errors block PR merge
- ✅ Test failures block PR merge
- ✅ Bundle size changes visible in PR comments
- ✅ Build times tracked per PR

---

### Epic 1: React Version Alignment (Week 1-2)
**Goal**: Fix foundational React 18 vs 19 mismatch
**Duration**: 1 week
**Priority**: CRITICAL - Blocks all other work

#### Story 1.1: Team Decision - React Version
**Points**: 1
**Owner**: TBD

**Tasks**:
- [ ] Schedule 30-min team meeting
- [ ] Present options: React 18 (safer) vs React 19 (future-forward)
- [ ] Review breaking changes in React 19
- [ ] Team votes on version
- [ ] Document decision in ADR (Architecture Decision Record)

**Acceptance Criteria**:
- ✅ Team vote completed
- ✅ Decision documented in `docs/adr/001-react-version.md`
- ✅ Rationale clearly explained

**Recommendation**: React 18 (more stable, better ecosystem support)

---

#### Story 1.2: Align React Versions in package.json
**Points**: 2
**Owner**: TBD

**Tasks**:
- [ ] Update `apps/admin/package.json` React version
- [ ] Update `apps/website/package.json` React version
- [ ] Update `@types/react` and `@types/react-dom` consistently
- [ ] Update `packages/shared/package.json` peer dependencies
- [ ] Run `pnpm install` to update lockfile
- [ ] Commit changes to feature branch

**Acceptance Criteria**:
- ✅ All apps use same React version
- ✅ All apps use matching `@types/react*`
- ✅ `pnpm-lock.yaml` updated
- ✅ No version conflicts in lockfile

**Example (if React 18)**:
```json
// apps/admin/package.json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0"
  }
}
```

---

#### Story 1.3: Fix TypeScript Errors from Alignment
**Points**: 5
**Owner**: TBD

**Tasks**:
- [ ] Run `pnpm -r run typecheck`
- [ ] Fix type errors in `packages/shared`
- [ ] Fix type errors in `apps/admin`
- [ ] Fix type errors in `apps/website`
- [ ] Update React component patterns if needed (forwardRef, etc.)
- [ ] Ensure all tests still pass

**Acceptance Criteria**:
- ✅ Zero TypeScript errors across monorepo
- ✅ All unit tests passing
- ✅ E2E tests still passing
- ✅ No regression in functionality

---

#### Story 1.4: Test React Alignment in Staging
**Points**: 3
**Owner**: TBD

**Tasks**:
- [ ] Build both apps: `pnpm -r run build`
- [ ] Deploy to staging environment
- [ ] Run E2E test suite against staging
- [ ] Smoke test all major features manually
- [ ] Check browser console for hydration warnings
- [ ] Monitor for 24 hours (no incidents)

**Acceptance Criteria**:
- ✅ Both apps build successfully
- ✅ E2E tests pass on staging
- ✅ No hydration warnings in console
- ✅ No production incidents for 24 hours
- ✅ Manual smoke tests pass

**Smoke Test Checklist**:
```
Admin:
- [ ] Login works
- [ ] Create course works
- [ ] Upload file works
- [ ] Dashboard loads

Website:
- [ ] Homepage loads
- [ ] Student login works
- [ ] Course browsing works
- [ ] Quiz submission works
- [ ] Prayer times display
```

---

### Epic 2: Type System Consolidation (Week 2-3)
**Goal**: Single source of truth for types
**Duration**: 1 week
**Priority**: HIGH

#### Story 2.1: Audit Type Duplication
**Points**: 2
**Owner**: TBD

**Tasks**:
- [ ] List all types in `apps/admin/lib/types/lms.ts`
- [ ] List all types in `packages/shared-types`
- [ ] Compare and identify duplicates
- [ ] Identify intentional differences (admin-only fields)
- [ ] Document consolidation plan
- [ ] Create type migration spreadsheet

**Acceptance Criteria**:
- ✅ Complete list of duplicated types
- ✅ Intentional differences documented
- ✅ Migration plan approved by team
- ✅ Spreadsheet tracks: Type name, Current location, Target location, Status

---

#### Story 2.2: Consolidate Types to @attaqwa/shared-types
**Points**: 5
**Owner**: TBD

**Tasks**:
- [ ] Move unique types from admin to `packages/shared-types`
- [ ] Merge duplicated types (keep most complete version)
- [ ] Add JSDoc comments for clarity
- [ ] Export types from `packages/shared-types/src/index.ts`
- [ ] Update package version if needed
- [ ] Test that types build correctly

**Acceptance Criteria**:
- ✅ All shared types in `@attaqwa/shared-types`
- ✅ Admin-specific types remain in admin (if any)
- ✅ Website-specific types remain in website (if any)
- ✅ JSDoc comments added for complex types
- ✅ Package builds without errors

**Example Structure**:
```typescript
// packages/shared-types/src/course.ts
export interface Course {
  id: string
  title: string
  // ... shared fields
}

// packages/shared-types/src/admin.ts (if needed)
export interface CourseAdmin extends Course {
  draft: boolean      // Admin-only
  publishedAt: string // Admin-only
}
```

---

#### Story 2.3: Update Imports Across Apps
**Points**: 5
**Owner**: TBD

**Tasks**:
- [ ] Update admin imports: Replace `lib/types/lms` with `@attaqwa/shared-types`
- [ ] Update website imports if needed
- [ ] Use find-replace cautiously: `from './lib/types/lms'` → `from '@attaqwa/shared-types'`
- [ ] Run typecheck after each file update
- [ ] Fix any import errors
- [ ] Delete old type files

**Acceptance Criteria**:
- ✅ All imports updated to use `@attaqwa/shared-types`
- ✅ Zero TypeScript errors
- ✅ Old type files deleted (`apps/admin/lib/types/lms.ts`)
- ✅ All tests passing

**Commands**:
```bash
# Find all imports of old types
rg "from.*lib/types/lms" apps/admin

# After manual update, verify
pnpm -r run typecheck
pnpm test
```

---

### Epic 3: Strapi Client Migration (Week 3-4)
**Goal**: Single source of truth for Strapi API calls
**Duration**: 2 weeks
**Priority**: HIGH

#### Story 3.1: Create @attaqwa/shared-env Package
**Points**: 3
**Owner**: TBD

**Tasks**:
- [ ] Create `packages/shared-env` directory
- [ ] Set up package.json with zod dependency
- [ ] Create env validation schema
- [ ] Add validation function with fail-fast
- [ ] Export typed env object
- [ ] Write tests for env validation
- [ ] Update monorepo to include new package

**Acceptance Criteria**:
- ✅ Package builds successfully
- ✅ Validates required env vars (NEXT_PUBLIC_STRAPI_URL, etc.)
- ✅ Fails fast with clear error messages
- ✅ Exports TypeScript types for env
- ✅ Tests cover validation logic

**Example**:
```typescript
// packages/shared-env/src/index.ts
import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_STRAPI_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
  // ... other env vars
})

export const env = envSchema.parse(process.env)
export type Env = z.infer<typeof envSchema>
```

---

#### Story 3.2: Add Feature Flag Infrastructure
**Points**: 3
**Owner**: TBD

**Tasks**:
- [ ] Create feature flag configuration file
- [ ] Add flag: `REFACTOR_CLIENT_ENABLED` (default: false)
- [ ] Create helper function to check flags
- [ ] Document feature flag usage in README
- [ ] Add flag toggle to admin UI (optional)

**Acceptance Criteria**:
- ✅ Feature flag config file created
- ✅ Helper function to read flags
- ✅ Flags can be toggled via env var
- ✅ Documentation updated

**Example**:
```typescript
// packages/shared/src/feature-flags.ts
export const featureFlags = {
  refactorClientEnabled: process.env.NEXT_PUBLIC_REFACTOR_CLIENT === 'true',
}
```

---

#### Story 3.3: Audit Current Strapi API Usage
**Points**: 3
**Owner**: TBD

**Tasks**:
- [ ] List all files using `apps/website/src/lib/strapi-api.ts`
- [ ] List all files using `apps/admin/lib/api/strapi-client.ts`
- [ ] Document API patterns (GET, POST, PUT, DELETE)
- [ ] Identify unique features in each client
- [ ] Create migration checklist spreadsheet
- [ ] Prioritize by risk: GET (low) → POST/PUT/DELETE (high)

**Acceptance Criteria**:
- ✅ Complete inventory of Strapi API calls
- ✅ Migration checklist created (File, Endpoint, Method, Risk, Status)
- ✅ Risk-based prioritization documented
- ✅ Team aligned on migration order

---

#### Story 3.4: Migrate GET Endpoints (Read-Only)
**Points**: 8
**Owner**: TBD

**Strategy**: Start with lowest-risk read-only operations

**Phase 1 - Courses API**:
- [ ] Update course list fetching to use `@attaqwa/api-client`
- [ ] Update course detail fetching
- [ ] Add feature flag toggle
- [ ] Test both paths (old + new) work
- [ ] Deploy to staging, enable flag for 10% users
- [ ] Monitor error rates for 24 hours
- [ ] Increase to 50%, then 100%

**Phase 2 - Quizzes API**:
- [ ] Update quiz fetching to use `@attaqwa/api-client`
- [ ] Same gradual rollout process

**Phase 3 - Other GET Endpoints**:
- [ ] Migrate remaining GET calls
- [ ] Same gradual rollout

**Acceptance Criteria**:
- ✅ All GET endpoints migrated to `@attaqwa/api-client`
- ✅ Feature flag controls old vs new
- ✅ No increase in error rates
- ✅ Performance metrics stable
- ✅ E2E tests passing with new client

---

#### Story 3.5: Migrate Write Endpoints (POST/PUT/DELETE)
**Points**: 8
**Owner**: TBD

**Strategy**: Higher risk, more testing required

**Phase 1 - Course Creation**:
- [ ] Update course creation to use `@attaqwa/api-client`
- [ ] Add comprehensive tests
- [ ] Feature flag toggle
- [ ] Gradual rollout: 10% → 50% → 100%

**Phase 2 - Quiz Submission**:
- [ ] Update quiz submission
- [ ] Add comprehensive tests
- [ ] Feature flag toggle
- [ ] Gradual rollout

**Phase 3 - Other Write Operations**:
- [ ] Migrate remaining POST/PUT/DELETE
- [ ] Extra caution with auth operations

**Acceptance Criteria**:
- ✅ All write endpoints migrated
- ✅ Feature flag controls old vs new
- ✅ No data corruption
- ✅ No auth issues
- ✅ Comprehensive test coverage
- ✅ E2E tests passing

---

#### Story 3.6: Remove Old Strapi Clients
**Points**: 2
**Owner**: TBD

**Tasks**:
- [ ] Verify all API calls use `@attaqwa/api-client`
- [ ] Remove feature flags (after 1 week stable in prod)
- [ ] Delete `apps/admin/lib/api/strapi-client.ts`
- [ ] Delete `apps/website/src/lib/strapi-api.ts`
- [ ] Delete related helper functions
- [ ] Update imports across codebase
- [ ] Run full test suite

**Acceptance Criteria**:
- ✅ Old client files deleted
- ✅ No imports of old clients remain
- ✅ All tests passing
- ✅ No TypeScript errors
- ✅ Deployed to production successfully

---

### Epic 4: Constants & Utilities Consolidation (Week 4-5)
**Goal**: Single source of truth for shared constants
**Duration**: 1 week
**Priority**: MEDIUM

#### Story 4.1: Audit Constants Duplication
**Points**: 2
**Owner**: TBD

**Tasks**:
- [ ] List constants in `apps/website/src/constants/index.ts`
- [ ] List constants in `packages/shared/src/index.ts`
- [ ] List constants in `apps/admin/constants/` (if exists)
- [ ] Identify overlaps (MOSQUE_INFO, PRAYER_NAMES, API_ENDPOINTS)
- [ ] Identify app-specific constants
- [ ] Create consolidation plan

**Acceptance Criteria**:
- ✅ Complete inventory of constants
- ✅ Overlaps identified
- ✅ App-specific constants documented
- ✅ Consolidation plan approved

---

#### Story 4.2: Move Shared Constants to @attaqwa/shared
**Points**: 3
**Owner**: TBD

**Tasks**:
- [ ] Move `MOSQUE_INFO` to `@attaqwa/shared`
- [ ] Move `PRAYER_NAMES` to `@attaqwa/shared`
- [ ] Move `API_ENDPOINTS` to `@attaqwa/shared`
- [ ] Move `CACHE_KEYS` and `CACHE_TTL` to `@attaqwa/shared`
- [ ] Keep app-specific constants in apps
- [ ] Add clear naming for app-specific vs shared

**Acceptance Criteria**:
- ✅ Genuinely shared constants in `@attaqwa/shared`
- ✅ App-specific constants remain in apps
- ✅ Clear naming convention established
- ✅ Package builds successfully

---

#### Story 4.3: Update Imports Across Apps
**Points**: 3
**Owner**: TBD

**Tasks**:
- [ ] Update admin imports to use `@attaqwa/shared`
- [ ] Update website imports to use `@attaqwa/shared`
- [ ] Run typecheck after updates
- [ ] Run full test suite
- [ ] Deploy to staging and test

**Acceptance Criteria**:
- ✅ All imports updated
- ✅ Zero TypeScript errors
- ✅ All tests passing
- ✅ Staging deployment successful

---

#### Story 4.4: Centralize `cn` Utility (Optional)
**Points**: 1
**Owner**: TBD

**Decision**: Only if team agrees this adds value

**Tasks**:
- [ ] Move `cn` utility to `@attaqwa/shared/cn`
- [ ] Set up subpath exports in package.json
- [ ] Update imports in admin: `@attaqwa/shared/cn`
- [ ] Update imports in website: `@attaqwa/shared/cn`
- [ ] Delete local `cn` implementations
- [ ] Test tree-shaking works

**Acceptance Criteria**:
- ✅ `cn` utility in `@attaqwa/shared`
- ✅ Subpath exports configured
- ✅ All imports updated
- ✅ Bundle size unchanged (tree-shaking works)

---

### Epic 5: Cleanup & Hygiene (Week 5-6)
**Goal**: Remove dead code and improve standards
**Duration**: 1 week
**Priority**: LOW (but easy wins)

#### Story 5.1: Remove Dead Files
**Points**: 1
**Owner**: TBD

**Tasks**:
- [ ] Delete `apps/website/src/lib/hooks/useAuth.ts.bak`
- [ ] Delete `apps/admin/lib/api/strapi-client.ts` (if not already done)
- [ ] Search for all `.bak` files: `find . -name "*.bak"`
- [ ] Search for all `.tmp` files: `find . -name "*.tmp"`
- [ ] Delete identified files
- [ ] Commit cleanup

**Acceptance Criteria**:
- ✅ No `.bak` files in source directories
- ✅ No `.tmp` files in source directories
- ✅ Old API client files deleted
- ✅ Git history preserved

---

#### Story 5.2: Standardize on pnpm
**Points**: 1
**Owner**: TBD

**Tasks**:
- [ ] Find all `package-lock.json`: `find . -name "package-lock.json"`
- [ ] Delete `apps/api/package-lock.json`
- [ ] Delete any other `package-lock.json` files
- [ ] Ensure `pnpm-lock.yaml` is the only lockfile
- [ ] Update CI/CD to use pnpm only
- [ ] Update README with pnpm-only instructions

**Acceptance Criteria**:
- ✅ No `package-lock.json` files exist
- ✅ Only `pnpm-lock.yaml` in root
- ✅ CI uses pnpm
- ✅ Documentation updated

---

#### Story 5.3: Add knip for Dead Code Detection
**Points**: 2
**Owner**: TBD

**Tasks**:
- [ ] Install knip: `pnpm add -D knip`
- [ ] Create `knip.config.ts`
- [ ] Run knip: `npx knip`
- [ ] Review and fix dead code
- [ ] Add knip to CI (warnings only for 2 weeks)
- [ ] After 2 weeks, make it block PRs

**Acceptance Criteria**:
- ✅ knip installed and configured
- ✅ Initial dead code cleaned up
- ✅ knip runs in CI
- ✅ After grace period, blocks PRs on dead code

---

#### Story 5.4: SEO Module Consolidation
**Points**: 3
**Owner**: TBD

**Tasks**:
- [ ] Create `apps/website/src/lib/seo/` directory
- [ ] Merge `seo.ts` and `arabic-seo.ts` into `seo/index.ts`
- [ ] Create sub-exports: `seo/arabic.ts`, `seo/islamic-dates.ts`
- [ ] Remove duplicated constants
- [ ] Update imports across website
- [ ] Test SEO generation still works

**Acceptance Criteria**:
- ✅ SEO modules consolidated
- ✅ Sub-exports for different concerns
- ✅ No duplicated code
- ✅ All imports updated
- ✅ SEO still generates correctly

---

#### Story 5.5: Remove Puppeteer (If Unused)
**Points**: 1
**Owner**: TBD

**Decision**: Only if investigation confirms it's unused

**Tasks**:
- [ ] Verify Puppeteer not used (from investigation)
- [ ] Remove from package.json
- [ ] Remove any Puppeteer test files
- [ ] Ensure Playwright covers same use cases
- [ ] Run `pnpm install` to clean lockfile

**Acceptance Criteria**:
- ✅ Puppeteer removed if unused
- ✅ All E2E tests still passing with Playwright
- ✅ Lockfile cleaned

---

### Epic 6: Final Validation & Documentation (Week 6)
**Goal**: Ensure refactoring is complete and documented
**Duration**: 3-4 days
**Priority**: CRITICAL

#### Story 6.1: Run Complete Test Suite
**Points**: 2
**Owner**: TBD

**Tasks**:
- [ ] Run unit tests: `pnpm test -- --coverage`
- [ ] Run E2E tests: `pnpm test:e2e`
- [ ] Run typecheck: `pnpm -r run typecheck`
- [ ] Run lint: `pnpm -r run lint`
- [ ] Build all apps: `pnpm -r run build`
- [ ] Deploy to staging
- [ ] Run E2E against staging
- [ ] Manual smoke testing

**Acceptance Criteria**:
- ✅ All unit tests passing
- ✅ All E2E tests passing
- ✅ Zero TypeScript errors
- ✅ Zero lint errors
- ✅ All apps build successfully
- ✅ Staging deployment successful
- ✅ Manual smoke tests pass

---

#### Story 6.2: Capture "After" Metrics
**Points**: 2
**Owner**: TBD

**Tasks**:
- [ ] Run bundle analyzer (same as baseline)
- [ ] Run Lighthouse (same as baseline)
- [ ] Measure build times (same as baseline)
- [ ] Count TypeScript errors (should be 0)
- [ ] Measure test coverage
- [ ] Create comparison report: Before vs After
- [ ] Document improvements in `METRICS_COMPARISON.md`

**Acceptance Criteria**:
- ✅ All metrics recaptured
- ✅ Comparison report created
- ✅ Improvements documented
- ✅ Regressions identified (if any)
- ✅ Performance within 5% of baseline

---

#### Story 6.3: Update Documentation
**Points**: 3
**Owner**: TBD

**Tasks**:
- [ ] Update CLAUDE.md with new architecture
- [ ] Update README with import patterns
- [ ] Document `@attaqwa/shared-types` usage
- [ ] Document `@attaqwa/api-client` usage
- [ ] Document `@attaqwa/shared-env` usage
- [ ] Create ADRs for major decisions
- [ ] Update contribution guide

**ADRs to Create**:
- `001-react-version-alignment.md`
- `002-strapi-client-consolidation.md`
- `003-type-system-consolidation.md`
- `004-shared-package-boundaries.md`

**Acceptance Criteria**:
- ✅ All documentation updated
- ✅ ADRs created for key decisions
- ✅ README has clear setup instructions
- ✅ Import patterns documented

---

#### Story 6.4: Production Deployment & Monitoring
**Points**: 3
**Owner**: TBD

**Tasks**:
- [ ] Create production deployment plan
- [ ] Schedule deployment (low-traffic time)
- [ ] Deploy to production
- [ ] Monitor error rates for 24 hours
- [ ] Monitor performance metrics
- [ ] Monitor user feedback
- [ ] Be ready to rollback if needed

**Acceptance Criteria**:
- ✅ Deployed to production successfully
- ✅ No increase in error rates
- ✅ Performance metrics stable
- ✅ No critical user complaints
- ✅ 24 hours stable in production

---

## Implementation Order

### Week 0-1: Foundation (Epic 0)
```
Day 1-2: Project setup, baselines
Day 3-4: E2E tests, investigations
Day 5: CI guardrails, week planning
```

### Week 1-2: React Alignment (Epic 1)
```
Day 1: Team decision on React version
Day 2: Update package.json, install
Day 3-4: Fix TypeScript errors
Day 5: Deploy to staging, test, monitor
```

### Week 2-3: Type Consolidation (Epic 2)
```
Day 1-2: Audit types, plan migration
Day 3-4: Consolidate types
Day 5: Update imports, test
```

### Week 3-4: Strapi Client Migration (Epic 3)
```
Week 3:
  Day 1-2: Env package, feature flags
  Day 3: Audit API usage
  Day 4-5: Migrate GET endpoints

Week 4:
  Day 1-3: Migrate write endpoints
  Day 4-5: Test, gradual rollout
```

### Week 4-5: Constants & Cleanup (Epic 4-5)
```
Week 4:
  Day 1-2: Consolidate constants
  Day 3-4: Update imports
  Day 5: Dead file removal

Week 5:
  Day 1-2: knip setup, SEO consolidation
  Day 3-5: Cleanup, polish
```

### Week 5-6: Final Validation (Epic 6)
```
Week 6:
  Day 1: Full test suite
  Day 2: Capture metrics, comparison
  Day 3: Update documentation
  Day 4-5: Production deployment, monitoring
```

---

## Risk Mitigation

### High-Risk Stories
| Story | Risk | Mitigation |
|-------|------|------------|
| 1.2 React Alignment | Breaking changes, hydration issues | Comprehensive E2E tests first, gradual rollout |
| 3.4 GET Migration | API errors, data fetching breaks | Feature flags, 10%→50%→100% rollout |
| 3.5 Write Migration | Data corruption, auth issues | Extra testing, canary deployment |
| 6.4 Production Deploy | Production incidents | Deploy off-peak, monitor 24h, rollback ready |

### Rollback Plan
```yaml
If Issues Occur:
  1. Identify affected epic/story
  2. Check feature flags (can disable instantly)
  3. Review git tags (revert to previous phase)
  4. Run: git revert <commit> or git reset --hard <tag>
  5. Redeploy previous version
  6. Document incident
  7. Plan fix before retrying
```

---

## Daily Standup Template

**Format**: 15 minutes, async in Slack or sync meeting

```markdown
## Refactoring Standup - [Date]

**Epic/Story**: [Current epic and story]

**Yesterday**:
- ✅ Completed: [What was finished]
- 🔄 In Progress: [What's ongoing]

**Today**:
- 🎯 Goal: [What will be completed today]
- 🚧 Blockers: [Any blockers]

**Risks**:
- ⚠️ [Any risks or concerns]

**Metrics**:
- TypeScript errors: [Current count]
- Tests passing: [Yes/No]
- Staging status: [Deployed/Testing/Stable]
```

---

## Next Steps

**Immediate Actions**:
1. [ ] Review this implementation plan with team
2. [ ] Assign owners to each epic
3. [ ] Create project board from epics/stories
4. [ ] Schedule kickoff meeting
5. [ ] Begin Epic 0: Foundation work

**Ready to Start?**
- Once this plan is approved, we'll create the project board and begin execution with Epic 0.
