# Architecture Investigation Findings

**Created**: 2025-11-01
**Epic**: 0.4 - Investigate Current Architecture
**Purpose**: Document rationale behind architectural decisions to inform refactoring

---

## 🔍 Investigation 1: Dual Auth Contexts

**Question**: Why do TWO auth contexts exist?

**Files Investigated**:
- `apps/website/src/lib/hooks/useAuth.tsx`
- `apps/website/src/contexts/StudentAuthContext.tsx`

### Findings

**Status**: ✅ **INTENTIONAL** - Multi-tenant architecture

**Rationale**:
The dual auth contexts serve different user segments with distinct requirements:

#### `useAuth` (Generic Auth Context)
```yaml
Purpose: General authentication for admins and public users
User Type:
  id: string
  email: string
  name: string
  role: 'admin' | 'user'

Methods:
  - login(email, password)
  - logout()
  - isAdmin boolean check

Usage Locations:
  - apps/website/src/app/admin/login/page.tsx
  - apps/website/src/app/dashboard/page.tsx (mock version)
  - apps/website/src/components/features/dashboard/IslamicDashboard.tsx
```

#### `StudentAuthContext` (LMS-Specific Auth)
```yaml
Purpose: Student portal with extended LMS features
User Type:
  id: string
  email: string
  studentId: string (additional field)
  name: string
  role: string (more flexible)
  enrolledCourses: Array (LMS data)
  recentSubmissions: Array (LMS data)
  unreadNotifications: number (LMS data)

Methods:
  - login(email, password)
  - loginWithStudentId(studentId, password) (additional method)
  - logout()
  - refreshUser() (additional method)

Usage Locations:
  - apps/website/src/app/student/layout.tsx (wraps all /student/* routes)
```

### Architecture Pattern

This follows a **Bounded Context** pattern from Domain-Driven Design:

```
/admin/* routes → useAuth → Generic user authentication
/student/* routes → StudentAuthContext → LMS-specific features
/public routes → No auth required
```

### Recommendation

**✅ KEEP SEPARATE** - Do NOT consolidate these contexts.

**Reasons**:
1. Different data requirements (students need enrolledCourses, submissions, etc.)
2. Different authentication flows (email vs studentId login)
3. Clear separation of concerns by route prefix
4. Follows DDD Bounded Context pattern

**Refactoring Action**:
- Move both to `packages/shared` as `@attaqwa/auth` package
- Export both: `AdminAuthProvider` and `StudentAuthProvider`
- Document the multi-tenant architecture decision

---

## 🔍 Investigation 2: Custom Webpack splitChunks Configuration

**Question**: Why was custom splitChunks configuration added?

**File Investigated**:
- `apps/website/next.config.ts:20-58`

### Findings

**Status**: ✅ **INTENTIONAL** - Performance optimization

**Configuration Details**:
```yaml
Strategy: Advanced code splitting for optimal bundle loading

framework chunk:
  Purpose: Separate React framework (react, react-dom, scheduler)
  Priority: 40 (highest)
  Benefit: React updates don't invalidate app code cache

lib chunk:
  Purpose: Large libraries (>160KB) get separate chunks
  Naming: SHA1 hash-based (cache-friendly)
  Priority: 30
  Benefit: Big dependencies load independently

commons chunk:
  Purpose: Code shared across 2+ pages
  Priority: 20
  Benefit: Reduces duplication across pages
```

### Performance Impact

**Benefits**:
- Better long-term caching (framework changes don't invalidate app code)
- Parallel loading of large dependencies
- Reduced total bytes transferred on navigation
- Optimal cache invalidation strategy

**Trade-offs**:
- More HTTP requests (mitigated by HTTP/2)
- Slightly more complex bundle structure
- Requires understanding for debugging

### Recommendation

**✅ KEEP CONFIGURATION** - This is a best-practice optimization.

**Refactoring Action**:
- Document the chunking strategy in code comments
- Add bundle size monitoring to CI
- Consider extracting to shared Next.js config in monorepo

---

## 🔍 Investigation 3: Tailwind Version Mismatch

**Question**: Was the version mismatch (v3 vs v4) intentional?

### Findings

**Status**: ❌ **ACCIDENTAL** - No intentional rationale found

**Current State**:
```yaml
Admin App: Tailwind v3.4.13 (stable, mature ecosystem)
Website App: Tailwind v4.x (beta/canary, cutting-edge features)
```

**Evidence of Accident**:
- No git commit message explaining upgrade
- No usage of v4-specific features in website codebase
- No documentation justifying the difference
- Shallow git history (5 commits) suggests initial setup confusion

### Impact Analysis

**Blocks Shared UI**:
- Cannot extract shared components to `packages/ui`
- Design token drift between apps
- Different configuration syntax
- Plugin compatibility issues

### Recommendation

**⚠️ ALIGN ON SINGLE VERSION** - Priority #2 in refactoring plan

**Decision Required**: Team must choose v3 or v4

**Option A: Align on v3 (RECOMMENDED)**
```yaml
Pros:
  - Stable, production-tested
  - Mature ecosystem, all plugins compatible
  - Better TypeScript support
  - Easier to find solutions to problems

Cons:
  - Missing v4 features (if any are needed)
  - Will need migration later when v4 is stable

Action: Downgrade website to v3.4.13
Timeline: Epic 1 (React alignment) or Epic 2
```

**Option B: Align on v4**
```yaml
Pros:
  - Future-proof, modern architecture
  - Performance improvements
  - New features (if needed)

Cons:
  - Beta/canary instability
  - Ecosystem catching up (plugins, tools)
  - Less documentation and community support
  - Potential breaking changes before stable release

Action: Upgrade admin to v4
Timeline: Epic 1 (after React alignment)
Risk: HIGH - could introduce new issues
```

**Recommended Decision**: **Align on Tailwind v3** for stability during refactoring.

---

## 🔍 Investigation 4: Type System Duplication

**Question**: Are type differences intentional or accidental?

**Files Investigated**:
- `apps/admin/lib/types/lms.ts` (394 lines)
- `packages/shared-types/src/index.ts` (394 lines)

### Findings

**Status**: ❌ **100% DUPLICATE** - Pure accidental duplication

**Evidence**:
```bash
$ diff apps/admin/lib/types/lms.ts packages/shared-types/src/index.ts
# NO OUTPUT - Files are identical

$ wc -l apps/admin/lib/types/lms.ts packages/shared-types/src/index.ts
 394 apps/admin/lib/types/lms.ts
 394 packages/shared-types/src/index.ts
```

**Impact**:
- Same types defined in two locations
- Risk of drift if one is updated without the other
- Violates DRY principle
- Confusion about canonical source of truth

### Recommendation

**🚨 CONSOLIDATE IMMEDIATELY** - Pure duplication, no reason to keep both

**Refactoring Action** (Epic 2):
1. Delete `apps/admin/lib/types/lms.ts`
2. Update admin imports to use `@attaqwa/shared-types`
3. Verify no type drift occurred between copies
4. Add lint rule to prevent future duplication

**Migration Pattern**:
```typescript
// Before (admin app)
import { Course, Lesson, Quiz } from '@/lib/types/lms';

// After (admin app)
import { Course, Lesson, Quiz } from '@attaqwa/shared-types';
```

---

## 🔍 Investigation 5: Puppeteer Dependency

**Question**: Who uses Puppeteer and why?

### Findings

**Status**: ❌ **UNUSED** - Dead dependency

**Evidence**:
```bash
# Puppeteer is declared in package.json
$ grep puppeteer apps/website/package.json
"puppeteer": "^24.22.0"

# But has ZERO usage in codebase
$ grep -r "puppeteer" apps/website/src
# NO RESULTS

# Playwright is the active E2E framework
$ find apps/website -name "*.spec.ts"
apps/website/tests/e2e/all-pages.spec.ts
apps/website/tests/e2e/critical-paths.spec.ts
```

**Why It Exists**:
- Likely added during initial setup
- Playwright replaced it as E2E framework
- Never removed from dependencies

**Impact**:
- Unnecessary dependency increasing `node_modules` size
- Potential security vulnerabilities in unused package
- Confusion about which E2E framework to use

### Recommendation

**🗑️ REMOVE PUPPETEER** - Safe to delete, no usage

**Refactoring Action** (Epic 5 - Cleanup):
```bash
# Remove from package.json
cd apps/website
pnpm remove puppeteer

# Verify no breakage
pnpm run build
pnpm run test
```

**Verification**:
- Confirm Playwright handles all E2E testing needs
- Check if any scripts depend on it (none found)

---

## 📊 Investigation Summary

| Item | Status | Action | Priority | Epic |
|------|--------|--------|----------|------|
| Dual Auth Contexts | ✅ Intentional | Keep separate, move to packages | Medium | Epic 4 |
| Webpack splitChunks | ✅ Intentional | Keep, add documentation | Low | Epic 5 |
| Tailwind v3/v4 Mismatch | ❌ Accidental | Align on v3 | **HIGH** | Epic 1 |
| Type System Duplication | ❌ Accidental | Delete admin copy | **HIGH** | Epic 2 |
| Puppeteer Dependency | ❌ Unused | Remove from package.json | Low | Epic 5 |

---

## 🎯 Key Decisions Required

### Decision 1: Tailwind Version (URGENT)

**Team must decide before Epic 1.2 completion**

**Options**:
- **A) Align on v3** (RECOMMENDED): Stable, safe, blocks no current work
- **B) Align on v4**: Future-proof but risky during refactoring

**Impact**: Blocks shared UI component extraction (Epic 4)

**Recommendation**: Align on v3 for stability, upgrade to v4 later when stable

### Decision 2: Auth Context Architecture (INFORMATIONAL)

**No decision needed** - Current multi-tenant architecture is correct

**Action**: Document the pattern and move to shared packages

---

## 🔄 Refactoring Impact

### Updates to REFACTORING_PLAN.md

**Epic 1 (React Alignment)**:
- Add Story 1.5: Decide Tailwind version and align

**Epic 2 (Type Consolidation)**:
- Simplified: Types are identical, just delete and re-import

**Epic 4 (Constants & Utilities)**:
- Add auth context extraction to `@attaqwa/auth` package

**Epic 5 (Cleanup)**:
- Add Puppeteer removal
- No need to consolidate auth contexts

---

**Investigation Complete**: 2025-11-01
**Next Step**: Epic 1.1 - Team Decision on React Version
