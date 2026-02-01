# Attaqwa LMS - Baseline Metrics (Pre-Refactoring)

**Date Captured**: 2025-01-XX
**Purpose**: Document current state before Tier 1 refactoring begins
**Status**: ✅ Baseline Captured

---

## 🔴 Critical Issues Identified

### 1. Production Builds Failing (CRITICAL - NEW FINDING)
```yaml
Admin Build:   ❌ FAILS (TypeScript compilation error)
Website Build: ❌ FAILS (Module resolution error)

Impact: ZERO apps can be deployed to production
Priority: #0 - IMMEDIATE BLOCKER

Root Causes:
  Admin: 'response.data' type unknown errors
  Website: @attaqwa/shared/feature-flags not exported
```

### 2. React Version Mismatch (CRITICAL)
```yaml
Admin:   React 18.3.1
Website: React 19.1.0

Impact: Type conflicts, hydration issues, shared component breakage
Priority: #1 - Must fix before any other refactoring
```

### 3. Tailwind Version Mismatch (HIGH)
```yaml
Admin:   Tailwind 3.4.13
Website: Tailwind 4.x

Impact: Design token drift, blocks shared UI extraction
Priority: #2 - Decide in Phase 1
```

### 4. TypeScript Errors (HIGH)
```yaml
Total Errors: 40+ in website app
Status: Build fails on typecheck
Major Issues:
  - DOM type errors (document, localStorage, window)
  - React 19 type incompatibilities
  - Missing module: @attaqwa/shared
  - Unknown type errors in Strapi API
```

---

## 📊 Detailed Metrics

### TypeScript Health
```yaml
Command: pnpm -r run typecheck
Status: FAILING

Breakdown by App:
  - Admin: ✅ PASSING
  - Website: ❌ FAILING (40+ errors)
  - API: ✅ PASSING (Strapi - no typecheck)
  - Packages: ✅ PASSING

Website Errors by Category:
  - DOM Type Errors: ~15 (document, localStorage, window not found)
  - React 19 Type Errors: ~5 (Suspense, ReactNode incompatibilities)
  - Missing Modules: 1 (@attaqwa/shared not found)
  - Unknown Type Errors: ~15 (API responses, 'unknown' types)
  - Module Resolution: 2 (tailwindcss module not found)

Error Examples:
  1. "Cannot find name 'document'" (performance.ts, ui-utils.ts)
  2. "Suspense cannot be used as JSX component" (providers.tsx)
  3. "Cannot find module '@attaqwa/shared'" (seo.ts)
  4. "data is of type 'unknown'" (islamic-api.ts, strapi-api.ts)
```

### Dependencies

#### React Versions
```yaml
Admin:
  react: "^18.3.1"
  react-dom: "^18.3.1"
  @types/react: "^18.x"

Website:
  react: "19.1.0"
  react-dom: "19.1.0"
  @types/react: "19.2.2"

Packages/Shared:
  Peer deps: Need audit

Status: ❌ MISMATCHED (CRITICAL)
```

#### Tailwind Versions
```yaml
Admin:
  tailwindcss: "^3.4.13"

Website:
  tailwindcss: "^4"

Status: ❌ MISMATCHED (HIGH)
Impact: Blocks shared UI component extraction
```

### Build Configuration

#### Package Manager
```yaml
Primary: pnpm (pnpm-lock.yaml exists)
Inconsistencies Found:
  - ./package-lock.json (root)
  - ./apps/api/package-lock.json

Action Required: Remove npm lockfiles, standardize on pnpm only
```

### Code Duplication

#### Strapi Client Implementations
```yaml
Count: 2 (should be 1)

Locations:
  1. apps/website/src/lib/strapi-api.ts
  2. apps/admin/lib/api/strapi-client.ts

Canonical Version:
  - packages/api-client (@attaqwa/api-client)

Status: ❌ DUPLICATED
Action: Migrate both apps to packages/api-client
```

#### Dead/Backup Files
```yaml
Count: 3 files identified

Files:
  1. ./package-lock.json (root - should use pnpm only)
  2. ./apps/website/src/lib/hooks/useAuth.ts.bak (backup file)
  3. ./apps/api/package-lock.json (should use pnpm only)

Status: ❌ NEEDS CLEANUP
Action: Delete all identified files
```

#### Type Definitions
```yaml
Audit Pending: Need to compare
  - apps/admin/lib/types/lms.ts
  - packages/shared-types

Expected: Significant duplication based on proposal
Status: ⏳ PENDING AUDIT (Story 2.1)
```

#### Constants
```yaml
Audit Pending: Need to compare
  - apps/website/src/constants/index.ts
  - packages/shared/src/index.ts
  - apps/admin/constants/ (if exists)

Expected Overlaps:
  - MOSQUE_INFO
  - PRAYER_NAMES
  - API_ENDPOINTS
  - CACHE_KEYS / CACHE_TTL

Status: ⏳ PENDING AUDIT (Story 4.1)
```

---

## 📦 Bundle Size (Baseline)

**Status**: ❌ CANNOT BE CAPTURED (Builds Failing)

**Reason**: Both admin and website builds fail before bundle generation
- Admin fails during TypeScript compilation
- Website fails during webpack module resolution
- Bundle analyzer requires successful production build

**Action Required**: Fix build errors in Epic 1 before capturing bundle metrics

---

## ⚡ Build Times (Baseline)

**Status**: ❌ BOTH BUILDS FAILING

**Measured Times** (Before Failure):
```yaml
Admin Build: ~7.7 seconds (FAILED)
  Failure Reason: TypeScript compilation errors
  Error: 'response.data' is of type 'unknown' in apps/admin/app/(dashboard)/courses/[id]/lessons/new/page.tsx:33

Website Build: ~5.5 seconds (FAILED)
  Failure Reason: Module resolution errors
  Error: Package path './feature-flags' is not exported from @attaqwa/shared
  Affected Files:
    - src/app/education/content/[id]/page.tsx
    - src/app/education/progress/page.tsx
    - src/app/education/quiz/[id]/page.tsx
```

**Critical Finding**: ❌ **NEITHER APP BUILDS SUCCESSFULLY**
- Admin: TypeScript type errors block production builds
- Website: Module exports missing from @attaqwa/shared package
- Implication: Current main branch is NOT deployable to production

---

## 🔍 Lighthouse Scores (Baseline)

**Status**: ⏳ NOT YET CAPTURED

**Action Required**:
```bash
# Admin (staging)
npx lighthouse https://staging-admin.attaqwa.com --view

# Website (staging)
npx lighthouse https://staging-website.attaqwa.com --view
```

**Metrics to Capture**:
- Performance Score
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)

---

## 🧪 Test Coverage (Baseline)

**Status**: ⏳ IN PROGRESS (Tests Running with Failures)

**Initial Findings** (Website App Only):
```yaml
Test Infrastructure:
  - Admin: No test scripts configured
  - Website: Jest configured with coverage
  - Packages: No test scripts found

Test Failures Detected:
  - Module Resolution: Cannot locate @attaqwa/shared (mapped incorrectly in Jest)
  - Component Tests: IslamicDashboard tests failing (expectations don't match implementation)
  - E2E Tests: Islamic features tests failing (mock data mismatches)

Failing Test Suites:
  ❌ src/__tests__/components/AgeTierFilter.test.tsx (module resolution)
  ❌ src/__tests__/components/EducationContentCard.test.tsx (module resolution)
  ❌ src/components/features/dashboard/IslamicDashboard.test.tsx (component behavior)
  ❌ src/__tests__/e2e/islamic-features.test.tsx (E2E scenarios)

Status: Awaiting final coverage report...
```

**Coverage Metrics**: [Pending - will update when tests complete]

**Critical Finding**: Test infrastructure has configuration issues preventing accurate coverage measurement

---

## 🔎 Investigations Required (Story 0.4)

### 1. Auth Context Duplication
**Question**: Why do TWO auth contexts exist?

**Files to Investigate**:
- `apps/website/src/lib/hooks/useAuth.tsx`
- `apps/website/src/contexts/StudentAuthContext.tsx`
- `apps/website/src/lib/hooks/useAuth.ts.bak` (backup)

**Actions**:
- [ ] Git blame on both files
- [ ] Interview team about rationale
- [ ] Document if intentional (multi-tenancy) or accidental
- [ ] Decision: Consolidate or keep separate?

---

### 2. Webpack Chunking Strategy
**Question**: Why was custom splitChunks configuration added?

**File to Investigate**:
- `apps/website/next.config.ts`

**Actions**:
- [ ] Git blame on webpack configuration
- [ ] Review PR that added custom chunking
- [ ] Measure current bundle performance
- [ ] Document rationale
- [ ] Decision: Keep, modify, or remove?

---

### 3. Tailwind Version Differences
**Question**: Was the version mismatch intentional?

**Current State**:
- Admin: v3.4.13 (stable)
- Website: v4.x (newer)

**Actions**:
- [ ] Interview team about Tailwind upgrade
- [ ] Check if v4 features are actively used
- [ ] Assess migration effort v3→v4 or v4→v3
- [ ] Decision: Align on v3 or v4?

**Recommendation**: Align on v3 (more stable) or wait for v4 ecosystem maturity

---

### 4. Type System Differences
**Question**: Are type differences intentional or accidental?

**Actions**:
- [ ] Compare `apps/admin/lib/types/lms.ts` with `packages/shared-types`
- [ ] Document intentional differences (admin-only fields)
- [ ] Document accidental duplicates
- [ ] Create migration plan

**Hypothesis**: Mix of intentional (admin draft/publish fields) and accidental (core entity types)

---

### 5. Puppeteer Usage
**Question**: Who uses Puppeteer and why?

**Actions**:
- [ ] Search codebase: `rg -g '!node_modules' puppeteer`
- [ ] Check if Playwright covers same use cases
- [ ] Interview team about Puppeteer tests
- [ ] Decision: Remove or keep?

**Expected**: Likely unused, Playwright handles E2E testing

---

## 📋 Summary for Team

### Current State (Pre-Refactoring)
```yaml
Production Builds: ❌ BOTH APPS FAIL (IMMEDIATE BLOCKER)
React Versions: ❌ Mismatched (18 vs 19)
Tailwind Versions: ❌ Mismatched (3 vs 4)
TypeScript Errors: ❌ 40+ errors in website
Strapi Clients: ❌ 2 implementations (should be 1)
Dead Files: ❌ 3 files (.bak, package-lock.json)
Package Manager: ⚠️ Mixed (pnpm + npm lockfiles)
Build Status: ❌ NEITHER APP BUILDS FOR PRODUCTION
Test Coverage: ⚠️ Tests running but failing (module resolution)
Bundle Size: ❌ Cannot capture (builds fail)
Build Times: ❌ ~7.7s admin, ~5.5s website (both fail before completion)
```

### Critical Path Issues
1. **PRODUCTION BUILDS FAILING**: Neither app can be deployed (IMMEDIATE)
   - Admin: Type errors in Strapi client usage
   - Website: Missing exports from @attaqwa/shared package
2. **React 18 vs 19**: Blocks all type-related work
3. **TypeScript Errors**: 40+ errors prevent clean builds
4. **Tailwind 3 vs 4**: Blocks shared UI component extraction

### Quick Wins Available
1. Remove 3 dead files (5 minutes)
2. Standardize on pnpm (remove package-lock.json files)
3. Add knip/ts-prune for automated dead code detection

---

## 🛡️ CI/CD Guardrails (Epic 0.5)

**Status**: ✅ **COMPLETE** - GitHub Actions workflows configured

**Created**: 2025-11-01

### GitHub Actions Workflows

#### 1. Quality Checks Workflow (`.github/workflows/ci.yml`)
```yaml
Jobs:
  - quality-checks: ESLint ✅ | TypeScript ⚠️ | Tests ⚠️
  - build-validation: Admin build ⚠️ | Website build ⚠️
  - e2e-tests: Playwright tests ⚠️

Blocking Checks:
  - ESLint: ENABLED (must pass to merge)

Non-Blocking (until fixed):
  - TypeScript: After Epic 1.2 (React alignment)
  - Builds: After Priority #0 fixes
  - Tests: After module resolution fixes
  - E2E: After apps fully functional

Artifacts:
  - Test coverage reports (7-day retention)
  - Playwright HTML reports (7-day retention)
```

#### 2. Bundle Size Tracking (`.github/workflows/bundle-size.yml`)
```yaml
Features:
  - Tracks .next directory sizes
  - Analyzes JavaScript chunk sizes
  - Generates bundle size reports
  - Posts PR comments with size comparison
  - 30-day artifact retention

Status: Will produce accurate data once builds succeed
```

### Branch Protection Rules

**Manual Configuration Required**:
- Protected branches: `main` and `develop`
- Require 1 approval before merge
- Require ESLint check to pass (currently blocking)
- Require conversation resolution
- Dismiss stale approvals on new commits

**See**: `CI_SETUP_GUIDE.md` for detailed setup instructions

### Phased Rollout Strategy

```yaml
Phase 1 (Current - Epic 0.5):
  Blocking: ESLint only
  Non-blocking: TypeScript, builds, tests, E2E

Phase 2 (After Epic 1.2):
  Blocking: ESLint + TypeScript
  Non-blocking: Builds, tests, E2E

Phase 3 (After Priority #0):
  Blocking: ESLint + TypeScript + Builds
  Non-blocking: Tests, E2E

Phase 4 (After fixes complete):
  Blocking: All checks
```

---

## Next Steps

### ✅ Completed (Epic 0 - Foundation)
- [x] Capture baseline metrics (Story 0.2)
- [x] Add E2E tests for critical paths (Story 0.3)
- [x] Complete architecture investigations (Story 0.4)
- [x] Set up CI guardrails (Story 0.5)

### Immediate (Epic 1 - React Alignment)

### Week 1-2 (Epic 1)
- [ ] Team decision: React 18 or 19
- [ ] Align React versions across apps
- [ ] Fix TypeScript errors
- [ ] Deploy to staging, test 24h

### Week 2+ (Epics 2-6)
- [ ] Type system consolidation
- [ ] Strapi client migration
- [ ] Constants consolidation
- [ ] Dead code cleanup
- [ ] Final validation

---

## Comparison After Refactoring

**Target State (Post-Refactoring)**:
```yaml
React Versions: ✅ Aligned (single version)
Tailwind Versions: ✅ Aligned (single version)
TypeScript Errors: ✅ 0 errors
Strapi Clients: ✅ 1 implementation (@attaqwa/api-client)
Dead Files: ✅ 0 files
Package Manager: ✅ pnpm only
Build Status: ✅ All apps build cleanly
Test Coverage: ✅ ≥80%
Bundle Size: ✅ Within 5% of baseline
Build Times: ✅ Maintained or improved
```

**Metrics Comparison**: Will be documented in `METRICS_COMPARISON.md` after refactoring completion.

---

**Last Updated**: 2025-11-01
**Next Review**: After Epic 1 completion (React alignment and build fixes)
