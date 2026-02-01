# CI/CD Setup Guide

**Created**: 2025-11-01
**Purpose**: Document CI guardrails configuration for refactoring safety
**Epic**: 0.5 - Add Basic CI Guardrails

---

## ✅ Automated CI Workflows

### GitHub Actions Workflows Created

#### 1. **Quality Checks Workflow** (`.github/workflows/ci.yml`)

**Triggers**: Pull requests and pushes to `main` and `develop` branches

**Jobs**:

**Quality Checks:**
- ✅ ESLint validation (blocking - must pass)
- ⚠️ TypeScript type checking (non-blocking until Epic 1 - React alignment)
- ⚠️ Jest tests with coverage (non-blocking until module resolution fixed)
- 📊 Coverage report artifacts uploaded (7-day retention)

**Build Validation:**
- ⚠️ Admin app build (non-blocking until Priority #0 type errors fixed)
- ⚠️ Website app build (non-blocking until Priority #0 module exports fixed)
- 📝 Build status summary with failure explanations

**E2E Tests:**
- 🎭 Playwright tests on Chromium (non-blocking until apps fully working)
- 📊 Test report artifacts uploaded (7-day retention)

**Current Status:**
```yaml
Blocking Checks:
  - ESLint: ENABLED (must pass)

Non-Blocking Checks (will become blocking after fixes):
  - TypeScript: After Epic 1.2 (React alignment)
  - Build Admin: After Priority #0 type errors fixed
  - Build Website: After Priority #0 module exports fixed
  - Tests: After module resolution issues resolved
  - E2E Tests: After apps fully functional
```

#### 2. **Bundle Size Tracking Workflow** (`.github/workflows/bundle-size.yml`)

**Triggers**: Pull requests and pushes to `main` and `develop` branches

**Features**:
- 📦 Tracks total `.next` build directory size
- 📊 Analyzes individual JavaScript chunk sizes
- 📄 Generates detailed bundle size reports
- 💬 Automatic PR comments with bundle size comparison
- 🗄️ 30-day retention of bundle analysis artifacts

**Analysis Includes**:
- Total build size for admin and website apps
- Individual chunk sizes (sorted by size)
- Page-specific bundle sizes
- Build failure notifications with links to documentation

**Current Status:**
- ⚠️ Will produce accurate data once build issues resolved (Epic 1+)
- Captures build failures with explanations
- Stores build logs for debugging

---

## 🛡️ GitHub Branch Protection Rules

### Required Configuration

These rules must be configured manually in GitHub repository settings:

**Path**: Repository Settings → Branches → Branch protection rules

### Protection for `main` branch

#### Basic Rules
```yaml
Branch name pattern: main

Protect matching branches:
  ✅ Require a pull request before merging
    - Require approvals: 1 (minimum)
    - Dismiss stale pull request approvals when new commits are pushed
    - Require review from Code Owners (if CODEOWNERS file added)

  ✅ Require status checks to pass before merging
    - Require branches to be up to date before merging

  ✅ Require conversation resolution before merging

  ✅ Include administrators (recommend enabling after team familiarization)
```

#### Status Checks to Require

**Currently Required:**
```
- quality-checks / Code Quality & Type Safety / Run ESLint
```

**To Enable After Fixes:**
```
Phase 1 (After Epic 1.2 - React alignment):
- quality-checks / Code Quality & Type Safety / Run TypeScript type checking

Phase 2 (After Priority #0 build fixes):
- build-validation / Build Validation / Build admin app
- build-validation / Build Validation / Build website app

Phase 3 (After module resolution fixes):
- quality-checks / Code Quality & Type Safety / Run tests (website)

Phase 4 (After apps fully functional):
- e2e-tests / E2E Tests / Run Playwright E2E tests
```

### Protection for `develop` branch

Same rules as `main` with optional differences:
- Approvals: 1 (same as main for consistency)
- Can optionally allow force pushes for development flexibility
- Should still require status checks

---

## 📋 Setup Checklist

### Immediate Actions (Done)
- [x] Create `.github/workflows/ci.yml`
- [x] Create `.github/workflows/bundle-size.yml`
- [x] Configure ESLint check as blocking
- [x] Configure other checks as non-blocking with explanations
- [x] Add coverage and test report artifacts
- [x] Add bundle size PR comments

### Manual Configuration Required
- [ ] **Configure branch protection for `main`** (see rules above)
- [ ] **Configure branch protection for `develop`** (see rules above)
- [ ] **Enable GitHub Actions** in repository settings (if not already enabled)
- [ ] **Review workflow permissions** (Settings → Actions → General)
  - [ ] Ensure workflows can create comments on PRs
  - [ ] Ensure workflows can upload artifacts

### Post-Fix Actions (Phased Approach)

#### After Epic 1.2 (React Alignment)
- [ ] Enable TypeScript check as blocking in branch protection
- [ ] Remove `continue-on-error: true` from typecheck job in ci.yml

#### After Priority #0 Fixes (Build Issues)
- [ ] Enable build checks as blocking in branch protection
- [ ] Remove `continue-on-error: true` from build jobs in ci.yml
- [ ] Verify bundle size tracking produces accurate data

#### After Module Resolution Fixes
- [ ] Enable test checks as blocking in branch protection
- [ ] Remove `continue-on-error: true` from test job in ci.yml

#### After Apps Fully Functional
- [ ] Enable E2E tests as blocking in branch protection
- [ ] Remove `continue-on-error: true` from e2e-tests job in ci.yml

---

## 🔍 Workflow Details

### CI Quality Checks Workflow

**File**: `.github/workflows/ci.yml`

**Caching Strategy**:
- pnpm store cache with hash-based keys
- Speeds up dependency installation significantly

**Artifact Uploads**:
- Test coverage reports (7-day retention)
- Playwright HTML reports (7-day retention)

**Failure Handling**:
- ESLint failures block the workflow immediately
- TypeScript errors logged but allow workflow to continue
- Build failures documented with links to BASELINES.md
- Test failures captured with coverage data

### Bundle Size Tracking Workflow

**File**: `.github/workflows/bundle-size.yml`

**Process**:
1. Attempts to build both apps
2. Analyzes bundle sizes if builds succeed
3. Generates comprehensive reports
4. Posts summary as PR comment
5. Stores detailed artifacts for 30 days

**Report Includes**:
- Total `.next` directory size
- Top JavaScript chunks by size
- Page-specific bundles
- Build failure status with explanation links

---

## 🎯 Success Criteria

### Epic 0.5 Complete When:
- [x] CI workflows created and committed
- [x] Workflows run on PR and push to main/develop
- [x] ESLint configured as blocking check
- [x] Bundle size tracking active
- [ ] Branch protection rules configured (manual step)

### Future Success (Phased):
- [ ] All quality checks passing (after Epic 1-2)
- [ ] Builds successful (after Priority #0 fixes)
- [ ] All checks enabled as blocking
- [ ] Bundle sizes tracked accurately
- [ ] Coverage maintained at ≥70%

---

## 📚 References

### Related Documentation
- **BASELINES.md**: Current state metrics and build failure details
- **REFACTORING_PLAN.md**: Overall refactoring strategy and phasing
- **INVESTIGATION_FINDINGS.md**: Architectural decisions context

### GitHub Actions Documentation
- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Status Checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks)

### Tools Used
- **pnpm**: Package manager with workspace support
- **ESLint**: Code quality linting
- **TypeScript**: Static type checking
- **Jest**: Unit testing with coverage
- **Playwright**: E2E browser testing

---

## 🔄 Maintenance

### Regular Reviews
- **Weekly**: Review failed checks and update non-blocking decisions
- **After Each Epic**: Update blocking checks based on fixes
- **Monthly**: Review artifact retention and storage usage

### Updating Workflows
- Modify `.github/workflows/ci.yml` for quality check changes
- Modify `.github/workflows/bundle-size.yml` for bundle analysis changes
- Update this guide when changing branch protection rules

### Troubleshooting
- Check workflow logs in GitHub Actions tab
- Review artifact uploads for detailed reports
- Verify branch protection rule configuration
- Ensure repository has Actions enabled

---

**Last Updated**: 2025-11-01
**Next Review**: After Epic 1.2 completion (React alignment)
