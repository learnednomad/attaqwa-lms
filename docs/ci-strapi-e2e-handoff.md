# CI Strapi-in-E2E — Handoff

**Branch:** `fix/ci-strapi-e2e` (off `development`) — **MERGED**
**PR:** [#25](https://github.com/learnednomad/attaqwa-lms/pull/25) — merged into `development` 2026-04-26, promoted to `main` via [#28](https://github.com/learnednomad/attaqwa-lms/pull/28).
**Written:** 2026-04-24, **last updated 2026-04-26**. Supersedes the "Decide Strapi-in-CI" action item in `docs/ci-hardening-handoff.md` §2.2.

## Status updates (2026-04-26)

- **Step 1 — DONE.** All-pages skip-gate retired in `cdb3425`; 28/28 pass against the seeded stack on CI in ~34s. Final fixes were two test-helper hardenings: `submitLogin` waits for hydration before clicking; the dashboard-redirect test gets a 30s timeout because Next.js 16 dev mode resolves `redirect()` through an RSC payload slower than a prod 307 hop.
- **Two production admin bugs surfaced + fixed during the dev→main promotion:**
  - PR [#26](https://github.com/learnednomad/attaqwa-lms/pull/26) — library new-resource form now generates a slug (was 400ing on Strapi's "slug must be defined" validator).
  - PR [#27](https://github.com/learnednomad/attaqwa-lms/pull/27) — `listLessons` filter switched from numeric `id` to `documentId` (Strapi 5 type mismatch was 500ing the lessons tab).
- **Production env gap fixed:** Coolify env `STRAPI_API_TOKEN` was empty for weeks — the root cause of the three admin bugs Labibah reported on 2026-04-25. Token has been minted in the Strapi admin UI and pasted into the Coolify service.
- **Promotion to main:** PR #28 landed; `main` is at commit `7edc3b0`. Next Coolify auto-deploy of `main` rolls all of the above out.

## 1. Where CI stands today

All 10 PR-blocking checks green on first run:

| Check | Result | Duration |
| --- | --- | --- |
| validate | ✅ | 6s |
| Code Quality & Type Safety | ✅ | 59s |
| migrations | ✅ | 53s |
| Analyze Bundle Sizes | ✅ | 2m41s |
| Build Validation | ✅ | 2m43s |
| build (init) | ✅ | 2m40s |
| build (admin) | ✅ | 3m59s |
| build (website) | ✅ | 4m15s |
| E2E Tests | ✅ | 4m43s |
| build (api) | ✅ | 6m51s |

**E2E breakdown** as of `cdb3425`: critical-paths.spec.ts → 5 passed / 1 self-skipped (CP2, quiz UI not built); all-pages.spec.ts → 28 passed (skip-gate retired). Total: 33 passed / 1 skipped on CI.

## 2. How the e2e-tests job works now

`.github/workflows/ci.yml:86-265`:

1. Postgres service container (pgvector/pgvector:pg16) on :5432.
2. `pnpm install --frozen-lockfile` + `playwright install chromium` + `postgresql-client`.
3. `better-auth migrate --yes` against the service postgres.
4. `psql -f scripts/seed-auth-users.sql` — seeds BetterAuth users (`superadmin@attaqwa.org`, `student@attaqwa.org`, etc.).
5. `pnpm --filter api build` — compiles Strapi + admin panel.
6. `pnpm --filter api start` in the background with `NODE_ENV=development` so `apps/api/src/bootstrap.ts` seeds 15 courses + `superadmin@attaqwa.org` Strapi admin.
7. Curl-poll `http://localhost:1337/_health` until 204.
8. `pnpm --filter api seed:ci-bootstrap` → logs in as the Strapi super-admin, mints a deterministic full-access token, emits `STRAPI_API_TOKEN=...` on stdout; workflow greps that into `$GITHUB_ENV`.
9. `pnpm --filter api seed:complete` — seeds enrollments, progress, achievements, announcements, events, etc.
10. `pnpm --filter website build` + `pnpm --filter admin build` (both now see `STRAPI_API_TOKEN`).
11. Start website on :3003 and admin on :3000 as nohup processes, wait until both respond.
12. `playwright test --project=chromium` — all specs in `tests/e2e/`.
13. On failure: upload `/tmp/{website,admin,strapi,ci-bootstrap}.{log,out,err}` as `service-logs`.

Key commands you can run locally to reproduce the flow:

```bash
# 1. Postgres
docker run -d --name ci-test-postgres \
  -e POSTGRES_DB=attaqwa_lms -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 pgvector/pgvector:pg16

# 2. Migrate + seed auth
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/attaqwa_lms \
  BETTER_AUTH_SECRET=test BETTER_AUTH_BASE_URL=http://localhost:3003 \
  pnpm --filter website exec better-auth migrate --yes
psql 'postgresql://postgres:postgres@localhost:5432/attaqwa_lms' -v ON_ERROR_STOP=1 -f scripts/seed-auth-users.sql

# 3. Build + start Strapi (see docs/OPERATIONS.md for the full env block)
APP_KEYS=k1,k2,k3,k4 API_TOKEN_SALT=test ADMIN_JWT_SECRET=test \
  TRANSFER_TOKEN_SALT=test ENCRYPTION_KEY=test JWT_SECRET=test \
  DATABASE_CLIENT=postgres DATABASE_HOST=localhost DATABASE_PORT=5432 \
  DATABASE_NAME=attaqwa_lms DATABASE_USERNAME=postgres DATABASE_PASSWORD=postgres DATABASE_SSL=false \
  pnpm --filter api build
NODE_ENV=development HOST=0.0.0.0 PORT=1337 \
  APP_KEYS=k1,k2,k3,k4 API_TOKEN_SALT=test ADMIN_JWT_SECRET=test \
  TRANSFER_TOKEN_SALT=test ENCRYPTION_KEY=test JWT_SECRET=test \
  DATABASE_CLIENT=postgres DATABASE_HOST=localhost DATABASE_PORT=5432 \
  DATABASE_NAME=attaqwa_lms DATABASE_USERNAME=postgres DATABASE_PASSWORD=postgres DATABASE_SSL=false \
  nohup pnpm --filter api start > /tmp/strapi.log 2>&1 &

# 4. CI bootstrap (mints STRAPI_API_TOKEN)
pnpm --filter api exec tsx scripts/seed/ci-bootstrap.ts > /tmp/ci-bootstrap.out
export STRAPI_API_TOKEN=$(grep '^STRAPI_API_TOKEN=' /tmp/ci-bootstrap.out | cut -d= -f2)

# 5. Content seed
STRAPI_URL=http://localhost:1337 DATABASE_HOST=localhost DATABASE_PORT=5432 \
  DATABASE_NAME=attaqwa_lms DATABASE_USERNAME=postgres DATABASE_PASSWORD=postgres \
  pnpm --filter api exec tsx scripts/seed/seed-complete.ts

# 6. Website + admin with the token baked in
NEXT_PUBLIC_API_URL=http://localhost:1337 STRAPI_API_TOKEN="$STRAPI_API_TOKEN" \
  BETTER_AUTH_SECRET=test BETTER_AUTH_BASE_URL=http://localhost:3003 \
  DATABASE_URL=postgresql://postgres:postgres@localhost:5432/attaqwa_lms \
  pnpm --filter website build
# (same build + start for apps/admin, then nohup each with PORT=3003 / PORT=3000)

# 7. Run the tests
E2E_FULL_STACK=1 PLAYWRIGHT_SKIP_WEBSERVER=1 ADMIN_URL=http://localhost:3000 \
  PLAYWRIGHT_BASE_URL=http://localhost:3003 \
  pnpm --filter website exec playwright test --project=chromium tests/e2e/critical-paths.spec.ts
```

## 3. Next steps — pick one up and go

Each entry is self-contained: what to do, which files, verification. Pulled from CHANGELOG.md's Next Steps section but with more breadcrumbs.

### Step 1 — Rewrite `all-pages.spec.ts` ✅ DONE (PR #25, commit `cdb3425`, 2026-04-26)

Outcome: ARIA landmarks added to `header.tsx` / `floating-header.tsx`, `E2E_DISABLE_RATE_LIMIT` escape hatch in `auth.ts`, all-pages.spec.ts rewritten to assert via `getByRole`, and the skip-gate removed from `.github/workflows/ci.yml`. CI now runs 28/28 against the real stack in ~34s.

### Step 2 — Student quiz UI so CP2 drops its self-skip (~1 day)

**Why.** 24 quizzes are seeded, linked to lessons, but `apps/website/src/app/(main)/education/courses/[id]/page.tsx` renders no `Start Quiz` button. CP2 skips with `test.skip(true, 'Course has no quiz')`.

**What to do.**
1. The course detail page already fetches via `useCourseById`. Extend its render to list lessons (most courses have 1–3 seeded), and for each lesson with a quiz, render a `<button>Start Quiz</button>` linking to `/education/courses/[courseId]/quiz/[quizId]`.
2. Create `apps/website/src/app/(main)/education/courses/[id]/quiz/[quizId]/page.tsx` that fetches the quiz, renders questions (the Strapi schema already has `questions: QuizQuestion[]` — see `apps/website/src/lib/strapi-api.ts:63`), accepts answers, POSTs to a scoring endpoint.
3. Scoring endpoint: add a website API route at `apps/website/src/app/api/v1/quizzes/[id]/submit/route.ts` that receives `{ answers: {...} }`, fetches the quiz with answers via Strapi (server-side with `STRAPI_API_TOKEN`), computes the score, returns `{ score, passed, resultsByQuestion }`.
4. Results screen: render `/education/courses/[courseId]/quiz/[quizId]/results?score=X` or stateful on the same page. CP2 looks for `text=/Results|Score|Complete/i` — keep one of those in the heading.

**Verification.** CP2 passes; test log shows `6 passed / 0 skipped` for critical-paths.

### Step 3 — `NODE_ENV=production` for Strapi in CI (~2 hours)

**Why.** Today CI runs Strapi in `NODE_ENV=development` because `apps/api/src/bootstrap.ts:951` guards seed with `if (process.env.NODE_ENV === 'production') { skip }`. That means CI and prod diverge on one env bit.

**What to do.**
1. In `apps/api/src/bootstrap.ts`, split the file into two:
   - Keep the permissions / public role config in `bootstrap.ts`.
   - Move `seedStrapiAdmin()`, `seedCoursesIfEmpty()`, `seedLessonsIfEmpty()`, `seedQuizzesIfEmpty()`, and `runComprehensiveSeed()` logic into a new `apps/api/scripts/seed/seed-bootstrap.ts`.
2. Add `"seed:bootstrap": "tsx scripts/seed/seed-bootstrap.ts"` to `apps/api/package.json`.
3. In `.github/workflows/ci.yml`, change `NODE_ENV: development` on the Strapi start step to `NODE_ENV: production`. Add a new step after "Wait for Strapi" and before "Bootstrap Strapi admin + API token": `run: pnpm --filter api seed:bootstrap`.

**Verification.** CI stays green with `NODE_ENV=production` on every service; `docker-compose.dev.yml` still self-seeds via the inline `init` container (unchanged).

### Step 4 — Reuse `build (api)` GHCR image in e2e (~3 hours, saves ~2 min/run)

**Why.** `docker.yml`'s `build (api)` (6m51s) produces a `ghcr.io/learnednomad/attaqwa-lms/api` image. `ci.yml`'s `e2e-tests` then rebuilds Strapi inline (~2 min). Same artifact twice.

**What to do.**
1. In `.github/workflows/ci.yml`, add `needs: [<docker-workflow-build-api>]` to `e2e-tests`. This is cross-workflow — easier to move the build step into `ci.yml` as a dedicated `build-api-image` job that pushes to GHCR with a `pr-${PR_NUMBER}` tag, and have `e2e-tests` depend on it.
2. Replace the "Build api (Strapi)" + "Start api (Strapi) in background" steps with:
   ```yaml
   - name: Start Strapi container
     run: |
       docker run -d --name attaqwa-api \
         --network host \
         -e NODE_ENV=production \
         -e DATABASE_CLIENT=postgres -e DATABASE_HOST=localhost ... \
         ghcr.io/learnednomad/attaqwa-lms/api:pr-${{ github.event.number }}
   ```
3. Same pattern for admin + website.
4. Log capture changes: `docker logs attaqwa-api > /tmp/strapi.log` on failure.

**Verification.** `E2E Tests` drops from 4m43s to ~2m30s. Confirm that the GHCR image boots with the same seed behavior as local `pnpm start`.

### Step 5 — Narrow Jest re-adds (~2–4 hours each, pick per need)

**Why.** Five Jest suites were deleted in `fix/ci-hardening` (see `docs/ci-hardening-handoff.md` §1.2). CP now covers the same journeys end-to-end. Re-add Jest only for things CP can't catch: pure utility edge cases, hook state transitions, accessibility regressions that are hard to E2E.

**What to do.** Candidates:
- `src/lib/utils.test.ts` already has a stub. Extend it with tests for date/prayer-time helpers when you touch those.
- Add a narrow test for `useStrapiCourses` error paths when the API is offline — CP only covers the happy path.
- Skip component tests for `EducationContentCard`, `AgeTierFilter`, `PrayerTimeCard` — browse/CP1 exercises them.

**Verification.** `cd apps/website && pnpm test --ci --maxWorkers=2` completes in <30s, covers >10% of `src/lib/**`.

### Step 6 — Unify website port to 3003 in prod compose (~30 min)

**Why.** `docker-compose.yml` still binds website on 3001 for prod; dev + CI + Playwright all use 3003. Low-value drift.

**What to do.** See `docs/ci-hardening-handoff.md` §2.3 — exact files and env flips already documented there. Coordinate with whoever owns Coolify before merging.

### Step 7 — React Compiler warning cleanup (~4–6 hours)

**Why.** ~430 warnings in admin + website lint output. Not a CI blocker (warnings only) but drowns out real signal.

**What to do.**
1. `pnpm lint --filter website 2>&1 | grep 'set-state-in-effect' | sort -u > /tmp/effect-warnings.txt`
2. Work through the list, converting `useEffect(() => setX(y))` patterns to derived state or event handlers per the React Compiler docs.
3. Repeat for `cannot access variable before it is declared` and `cannot call impure function during render`.

## 4. Files / locations quick reference

| What | Where |
| --- | --- |
| E2E CI job | `.github/workflows/ci.yml:86-265` |
| CI bootstrap script | `apps/api/scripts/seed/ci-bootstrap.ts` |
| Content seed | `apps/api/scripts/seed/seed-complete.ts` |
| Strapi bootstrap (auto-seed admin + courses) | `apps/api/src/bootstrap.ts` |
| BetterAuth user seed | `scripts/seed-auth-users.sql` |
| Critical-paths tests | `apps/website/tests/e2e/critical-paths.spec.ts` |
| All-pages tests (gated) | `apps/website/tests/e2e/all-pages.spec.ts` |
| CSP config (localhost allow-list) | `apps/website/next.config.ts:39-52` |
| Course-card testid | `apps/website/src/app/(main)/education/browse/page.tsx:320` |
| Admin sidebar nav | `apps/admin/components/dashboard/sidebar.tsx:29-35` |
| Admin course form labels | `apps/admin/components/courses/course-form.tsx:237-273` |

## 5. Rollback

```bash
git checkout pre-ci-hardening-development   # from the fix/ci-hardening snapshot
# or
git revert <commit-sha-from-pr-25>
```

## 6. Known traps for future-me

- **Strapi `/_health` returns 204 early.** The endpoint is up before bootstrap.ts finishes seeding. If a test hits `/api/v1/courses` during the 2–3s seed window, it'll see 0 results. The current seed-complete step acts as a natural barrier — but if you reorder steps, add an explicit "wait for bootstrap complete" probe (poll `/api/v1/courses?pagination[pageSize]=1` for data count > 0).
- **`admin_users` table vs BetterAuth `user` table.** Two separate user stores. Strapi admin (`superadmin@attaqwa.org`, password `SuperAdmin123!`, seeded by `bootstrap.ts`) is ONLY used for Strapi's own admin UI + API tokens. Browser tests log into the **BetterAuth** `user` table (same email, same password — by design, seeded by `scripts/seed-auth-users.sql`).
- **Admin app proxies BetterAuth to website.** `apps/admin/app/api/auth/[...all]/route.ts` forwards `/api/auth/*` to `AUTH_INTERNAL_URL=http://localhost:3003`. So the website must be up before admin login works. CI start order is strapi → website → admin.
- **`NEXT_PUBLIC_API_URL` is inlined at build time.** Changing it between build and runtime does nothing — bundle already has the build-time value baked in. CI sets it identically at build + runtime.
- **The `fetch` API inside Playwright Node tests shares nothing with the browser context.** `adminReachable()` uses Node fetch; `page.goto` uses the browser. If you're debugging CORS/CSP, always reproduce in the browser context (e.g. `page.evaluate(() => fetch(...))`), not via `fetch` at the top of the spec.
