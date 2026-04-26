# Changelog

All notable changes to the AttaqwaLMS project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed - 2026-04-26

#### CI: Strapi runs `NODE_ENV=production` for prod parity (PR [#30](https://github.com/learnednomad/attaqwa-lms/pull/30), merge commit `0ca6b96`, Step 3 of `docs/ci-strapi-e2e-handoff.md`)
- `.github/workflows/ci.yml` (`e2e-tests`) — `Start api (Strapi)` flips `NODE_ENV: development` → `production` and adds `STRAPI_PROXY: 'true'` so Koa trusts forwarded proto/host headers (otherwise admin login fails with `Cannot send secure cookie over unencrypted connection` because Strapi 5 forces `Secure` cookies in production). New step `Seed Strapi content (courses, lessons, quizzes)` runs `pnpm --filter api seed:bootstrap` after the existing `Bootstrap Strapi admin + API token` step and before `Seed Strapi content (users, ...)`.
- `apps/api/scripts/seed/seed-bootstrap.ts` (new; `pnpm --filter api seed:bootstrap`) — HTTP-based content seeder using `STRAPI_API_TOKEN`. Posts 15 courses → 60 lessons (`/api/v1/...`, versioned per `apps/api/src/api/<ct>/routes/<ct>.ts:prefix: '/v1'`) → 15 quizzes (one per assessment lesson). Idempotent: each phase short-circuits on existing rows. Replaces the in-bootstrap template seed that was gated on `NODE_ENV !== 'production'`.
- `apps/api/scripts/seed/templates.ts` + `apps/api/scripts/seed/lesson-quiz-templates.ts` (new) — pure-data extraction of the 15-course catalog, lesson-template generator, and quiz-question/template generators. Previously inlined in `apps/api/src/bootstrap.ts:9-698`.
- `apps/api/src/bootstrap.ts` — drops the moved-out template functions and the production-guarded content-seed block (now ~750 LOC lighter). Keeps admin seed (idempotent, prod-safe via `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD`), permissions config, and full-access API token creation — these still run on every boot in any `NODE_ENV`.
- `apps/api/scripts/seed/{ci-bootstrap,seed-complete}.ts` — base `fetch` helpers add `X-Forwarded-Proto: https` + `X-Forwarded-Host` so admin login/register over plain-HTTP localhost survives `NODE_ENV=production`. Pairs with the workflow's new `STRAPI_PROXY=true`. Mirrors what Caddy/Traefik do in real prod.
- `apps/api/package.json` — new `seed:bootstrap` script.

**CI verification:** 10/10 PR-blocking checks green; `E2E Tests` reports 33 passed / 1 self-skipped in 38.1s (seed:bootstrap step finishes in 4.4s). Matches the Step 1 baseline.

**Local-dev impact:** `pnpm --filter api dev` (NODE_ENV=development) no longer auto-seeds 15 courses on first boot. Run `pnpm --filter api seed:bootstrap` once after the first Strapi start (or use `docker compose -f docker-compose.dev.yml up -d`, which still wires its own init container).

### Added - 2026-04-26

#### CI: all-pages.spec.ts skip-gate retired — Step 1 of CI Strapi-in-E2E handoff (PR #25, commit `cdb3425`)
- `apps/website/src/components/layout/{header,floating-header}.tsx` — `<nav>` elements get `aria-label="Main navigation"` / `"Mobile navigation"`; mobile menu button gets `aria-expanded` reflecting open state. Lets the all-pages spec target landmarks via `getByRole` instead of brittle CSS selectors.
- `apps/website/src/lib/auth.ts` — Better Auth signin limiter (10/min/IP) trips Playwright's parallel workers from a single localhost; gate the disable on `E2E_DISABLE_RATE_LIMIT=1` so prod stays protected.
- `.github/workflows/ci.yml` — flip `E2E_FULL_STACK=1` and `E2E_DISABLE_RATE_LIMIT=1`, drop the `all-pages.spec.ts` skip gate. CI now runs 28/28 of all-pages.spec.ts against the real seeded stack in ~34s.
- `apps/website/tests/e2e/all-pages.spec.ts` — rewrite to ARIA-landmark assertions; `submitLogin` waits for hydration (networkidle) before clicking (else Playwright fires the click before React attaches `onSubmit` and the form falls back to a default GET that clears inputs); dashboard-redirect test gets a 30s timeout + `waitForLoadState` since Next.js 16 dev mode resolves `redirect()` through an RSC payload that's slower than a prod 307 hop.
- `apps/website/test-results/.last-run.json` untracked (was committed before `test-results/` landed in `.gitignore`).

#### Admin: production bug fixes surfaced during dev→main promotion (PRs #26, #27)
- `apps/admin/app/(dashboard)/library/new/page.tsx` (PR #26) — generate a `slug` from title + timestamp before POSTing to `/api/v1/library-resources`. Strapi's library-resource content type marks `slug` as `required: true`; the form was never setting it, so every submission 400'd with "slug must be defined" and surfaced as a generic "Could not save resource" / "Upload failed" in the UI. Mirrors the slug-from-title pattern already used in `apps/admin/app/(dashboard)/courses/new/page.tsx`.
- `apps/admin/lib/api/strapi-client.ts` (PR #27) — `listLessons` now filters by `filters[course][documentId][$eq]` instead of `filters[course][id][$eq]`. The URL param `[id]` from `/courses/[id]/lessons` is the Strapi 5 documentId string, not the numeric primary key, so the previous `id` filter caused an integer-cast 500 inside Strapi's SQL builder. Surfaced as `[CourseLessonsOutline] fetch failed → ERR_BAD_RESPONSE 500` on the deployed admin once the production `STRAPI_API_TOKEN` was set.

#### Promotion: development → main (PR #28, merge commit `7edc3b0`)
- 25 commits from `development` promoted to `main`. Resolution merge `1158e6c` took development's version for all 7 conflict files (CI workflow, jest config, playwright config, auth.ts, both e2e specs, library/new/page.tsx) since main had no substantive content not already reachable from dev — the conflicts arose from PR #23 landing the library feature on main separately while dev had the same change plus subsequent iterations.

#### Operational: production STRAPI_API_TOKEN minted
- Coolify production service `attaqwa-lms` (uuid `s40wwgww4oc8cc0gks08ko4g`) had `STRAPI_API_TOKEN=""` since deployment, root cause of three admin bugs Labibah reported (course creation 500, iqamah save fail, library upload 403 — see iMessage 2026-04-25). Mitigated by minting a full-access token in Strapi admin UI at `https://attaqwa-api.learnednomad.com/admin` and pasting into the Coolify env, then restarting the service. CI was never affected because `apps/api/scripts/seed/ci-bootstrap.ts` mints a fresh token on every run.

### Added - 2026-04-24

#### CI: full-stack E2E — Strapi + admin + website (PR #25, branch `fix/ci-strapi-e2e`)
- `.github/workflows/ci.yml` (`e2e-tests` job) — builds and starts api (Strapi, `NODE_ENV=development` so `apps/api/src/bootstrap.ts` seeds 15 courses + super-admin), admin (:3000), and website (:3003) alongside the existing Postgres service container. Adds health gates on `/_health`, `/` (website), and `/` (admin accepts 200/302/307 to handle the middleware redirect). Captures `/tmp/{website,admin,strapi,ci-bootstrap}.{log,out,err}` as a `service-logs` artifact on failure. Job timeout extended from 25 → 35 min to absorb the larger build graph.
- `apps/api/scripts/seed/ci-bootstrap.ts` (new; `pnpm --filter api seed:ci-bootstrap`) — logs in as the bootstrap-seeded `superadmin@attaqwa.org` super-admin via `/admin/login`, deletes any stale `ci-e2e-full-access` API token, mints a fresh full-access non-expiring token via `/admin/api-tokens`, and emits `STRAPI_ADMIN_JWT=…` / `STRAPI_API_TOKEN=…` on stdout (log chatter goes to stderr). The workflow greps only the `STRAPI_API_TOKEN=` line into `$GITHUB_ENV` so subsequent website/admin builds pick it up.
- `apps/api/scripts/seed/seed-complete.ts:125` — Phase 0 admin creds now default to `superadmin@attaqwa.org` / `SuperAdmin123!` (matching `apps/api/src/bootstrap.ts:DEV_SEED_ADMIN_DEFAULTS`) and accept `STRAPI_ADMIN_EMAIL` / `SEED_ADMIN_EMAIL` overrides. Eliminates the register-400 / login-400 deadlock that happened when the script's hardcoded `admin@attaqwa.local` collided with the idempotent bootstrap seeder.
- `apps/website/next.config.ts:39` — CSP `connect-src` now accepts `NEXT_PUBLIC_API_URL` when it matches `^https?://localhost(:\d+)?$`. Previously the localhost allowance was gated on `NODE_ENV === 'development'`, so production-mode E2E (`next start`) against a local Strapi was blocked with `Refused to connect to 'http://localhost:1337/api/v1/courses'`.
- `apps/website/src/app/(main)/education/browse/page.tsx:319-327` — added `data-testid="course-card"` to the course grid wrapper `<div>`, giving E2E a stable selector that survives class/markup churn.
- `apps/website/tests/e2e/critical-paths.spec.ts`:
  - `loginAsAdmin` now navigates to `/login` (admin's actual page; `/admin/login` bounces through the middleware redirect) and waits on `**/dashboard` (the real post-login destination set by `apps/admin/lib/hooks/use-auth.ts:30`), not `**/admin`.
  - CP1 / CP2 now `Promise.race` a `course-card` visible-wait against an empty-state visible-wait before deciding to skip — the browse page is client-rendered via React Query and `locator.count()` is 0 at DOMready.
  - CP3 rewritten end-to-end: direct-navigates to `/courses` and `/courses/new` (the sidebar is hydrated client-side from the BetterAuth session and was racing the `getByRole('link', { name: /Courses/i })` assertion), uses `getByLabel('Course Title')` instead of brittle `input[name="title"]`, and clicks the real `Create Course` submit button (was `Save|Submit`).

#### CI result on this PR
- 10/10 PR-blocking checks green on the first run: `validate` 6s, `Code Quality & Type Safety` 59s, `migrations` 53s, `Analyze Bundle Sizes` 2m41s, `Build Validation` 2m43s, `build (init)` 2m40s, `build (admin)` 3m59s, `build (website)` 4m15s, `E2E Tests` 4m43s, `build (api)` 6m51s.
- `E2E Tests` breakdown: 34 tests, 5 passed (CP1, CP3, CP4, CP5, System Health Check), 29 skipped (CP2 quiz UI isn't implemented so it self-skips per-test; the entire `all-pages.spec.ts` sweep stays gated on `E2E_FULL_STACK=1` — see Next Steps below).

### Next Steps

The green CI on `fix/ci-strapi-e2e` unblocks further work. Tracked items, ordered by ROI:

1. **Rewrite `apps/website/tests/e2e/all-pages.spec.ts` against current markup (~2 days).** 18 of 28 tests fail with `locator('nav[aria-label]') Expected 1 Received 0` and similar — the ARIA / role assertions were written against an older header and the page copy has drifted. The suite is gated on `E2E_FULL_STACK=1`; once it's green, set that env in `.github/workflows/ci.yml` `e2e-tests` job env and the full 28-test sweep runs per PR. Local verification loop: start the stack with `docker compose -f docker-compose.dev.yml up -d --wait`, then `E2E_FULL_STACK=1 PLAYWRIGHT_SKIP_WEBSERVER=1 ADMIN_URL=http://localhost:3000 pnpm --filter website exec playwright test tests/e2e/all-pages.spec.ts`.
2. **Implement the student quiz UI so CP2 can drop its self-skip (~1 day).** `apps/website/src/app/(main)/education/courses/[id]/page.tsx` doesn't expose a `Start Quiz` button today — the quiz journey is present in the data model (24 quizzes seeded, linked to lessons) but not rendered. When the course detail page gains a `Start Quiz` affordance + a `/education/.../quiz/[id]` route, CP2 will pass without any test edits.
3. **Switch `strapi start` back to `NODE_ENV=production` for CI (~2 hours).** Today CI runs Strapi in `development` so `bootstrap.ts` seeds the 15 courses + super-admin; prod skips seeding by design. Factor the seed block out of `bootstrap.ts` into an explicit `pnpm --filter api seed:bootstrap` script that CI runs after `strapi start` comes up. Matches prod wiring exactly and removes one meaningful dev/CI drift.
4. **Bake a GHCR CI image for Strapi (~3 hours, cuts ~2 min off every E2E run).** `build (api)` takes 6m51s in `docker.yml` already; we're building the same artifact twice per PR (once for the image, once inline in the e2e-tests job). Have `e2e-tests` `needs: [build]` on the docker workflow and `docker run` the pushed image instead of `pnpm --filter api start`. Saves build time and de-dupes the artifact.
5. **Rewrite the 5 drifted Jest suites (~2–4 hours each).** `EducationContentCard`, `AgeTierFilter`, `PrayerTimeCard`, `islamic-features`, `IslamicDashboard` are already deleted per `docs/ci-hardening-handoff.md` — CP already covers the same journeys in E2E. Re-add narrow unit tests only where CP can't catch a specific regression (e.g. pure utility functions or hook edge cases).
6. **Unify website port to 3003 in prod compose (~30 min).** `docker-compose.yml` still publishes website on 3001 in prod; dev + CI + Playwright all agree on 3003. Changing `PORT`, the `"3001:3001"` mapping, the admin's `AUTH_INTERNAL_URL`, and the Coolify service config unifies the whole stack — see `docs/ci-hardening-handoff.md` §2.3.
7. **Silence the ~430 React Compiler warnings (~4–6 hours).** Not a CI blocker (warnings, not errors) but drowns out real lint signal. Focus on `set-state-in-effect`, `cannot access variable before it is declared`, `cannot call impure function during render`.

### Added - 2026-04-23

#### Email notifications for inquiry forms (PR #11, #12)
- `apps/api/config/plugins.ts` - Conditional Strapi nodemailer email provider, sourced from `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` / `SMTP_USER` / `SMTP_PASS` env. Defaults `EMAIL_FROM` and `EMAIL_REPLY_TO` from env. If `SMTP_HOST` is unset, the email plugin is left unconfigured and inquiries persist to Strapi admin without firing — graceful degradation.
- `contact-inquiry` controller - After persisting, fires fire-and-forget notification email to `CONTACT_INQUIRY_NOTIFY_TO` (or `EMAIL_NOTIFY_TO` fallback). Subject: `[Masjid Contact] {category} — {name}`. Reply-To set to inquirer's email so imam can hit reply directly.
- `legal-inquiry` controller - Routes by `audience` field: sisters' questions go to `LEGAL_INQUIRY_SISTERS_NOTIFY_TO`, others to `LEGAL_INQUIRY_NOTIFY_TO`. Subject prefixed `[SISTERS]` / `[BROTHERS]` for visual triage.
- `.env.example` - Documents SMTP config block with copy-paste examples for Resend / SendGrid / Postmark.

### Added - 2026-04-22

#### Content pack from Masjid leadership — Phase 2 features (PRs #7, #8)
- **Five Pillars of Islam** + **Six Articles of Faith** + "About Our Faith: Islam" intro on `/about`
- **WhatsApp Community Group** + **WhatsApp Announcements Channel** links surfaced on About + Contact + new Community page
- **Janaza Services of Georgia** partner block on `/services` and `/services/funeral-services` (phone, email, partnership context)
- Dynamic Jumu'ah times on `/prayer-times` — now reads `prayerTimes.jummah[]` from the Strapi iqamah-schedule API instead of hardcoded `12:30 PM` / `1:15 PM`

#### New Strapi content types (PRs #7, #8)
- `apps/api/src/api/contact-inquiry/` - Public POST `/api/v1/contact-inquiries`, admin-only reads/mutations. Fields: firstName, lastName, email, phone, subject (enum), message, preferredContact, status (default new), submittedAt
- `apps/api/src/api/legal-inquiry/` - Public POST `/api/v1/legal-inquiries`. Fields include category (Fiqh / Halal-Haram / Family / Business / Ritual / Aqeedah / Other), audience (brothers / sisters / either), language (en / bn / ar), question, answer, answeredBy, answeredAt, status
- `apps/api/src/api/library-resource/` - Public reads, admin-only writes. Fields: title, slug, description, category (Books / Worksheets / Calendars / Ramadan / Hajj / Prayer-schedule / New-muslim / Other), language, file (media), coverImage (media), author, publishDate, isActive, displayOrder. MinIO-backed via existing aws-s3 upload provider.

#### New website routes (PRs #7, #8)
- `apps/website/src/app/(main)/services/ask-an-imam/page.tsx` - Routing-explainer page + AskAnImamForm (react-hook-form + zod). Sisters' questions can route to Ustadha Labibah; general questions route to Imams.
- `apps/website/src/app/(main)/resources/library/page.tsx` + `[slug]/page.tsx` - Library browser with category filter chips, MinIO-backed PDF downloads, individual resource detail pages
- `apps/website/src/app/(main)/resources/calendar-downloads/page.tsx` - Filtered library view for calendars / Ramadan / Hajj / prayer-schedule categories, grouped by sub-category
- `apps/website/src/app/(main)/community/page.tsx` - Merged Events + Announcements hub with prominent WhatsApp links. Existing `/events` and `/announcements` deep-links still work.

#### Working contact form (PR #7)
- `apps/website/src/components/features/contact/contact-form.tsx` - 'use client' react-hook-form + zod component replacing the previous static UI shell. Posts to `/api/v1/contact-inquiries`. Inline success / error states with retry affordance.

### Changed - 2026-04-22

#### Phase 1: corrections to placeholder content (PR #7)
- `apps/website/src/app/(main)/about/page.tsx` - Replaced 3 fictional leadership names ("Imam Abdullah Rahman", "Sister Aisha Mohamed", "Brother Omar Hassan") with the 6 real team members: Imam Mohammad Zahirul Islam, Ustadh Abdullah Khan, Ustadha Salina Sultana, Ustadha Labibah Islam, Ustadha Siddiqa Islam, Ustadha Maryam Islam. Tightened history prose. Preserved existing accurate "Daarul Barzakh" cemetery name.
- `apps/website/src/app/(main)/services/page.tsx` - Replaced wrong phone `(404) 244-9577` → `(678) 896-9257` and email `info@masjidattaqwaatlanta.org` → `almaad2674@gmail.com` (4 occurrences each). Added Janaza Services of Georgia to funeral service detail bullets.
- `apps/website/src/app/(main)/education/page.tsx` - Rewrote `educationalPrograms[]` and `weeklySchedule[]` arrays with real schedule from PDF: Tahfeedh (Mon-Thurs 7:30 AM – 12:00 PM, $100-150), Weekend Class (Sat-Sun 12:00-2:00 PM, $150/$125/$100 quarterly), Adult Brothers (Sat-Sun 9-11 AM), Adult Sisters Bengali (Sat-Sun Maghrib-Isha), Daily Tafseer (30 min before Isha), Daily Hadith (after Fajr), After-school Aqwam Academy (Mon/Tue/Thu 5-7 PM online Zoom, boys 7+), Adult Qur'an Aqwam Academy (Fri-Sat Maghrib-Isha brothers in-person), Homeschooling. Real instructor names. Schedule registration phones updated to `(470) 731-1314` / `(404) 936-7123` and email to `Attaqwa.du@gmail.com`.
- `apps/website/src/app/(main)/contact/page.tsx` - Updated primary email hierarchy. Ustadh Abdullah Khan's contact corrected to `faiysal_khan@icloud.com` / `(470) 731-1314`. WhatsApp links added to social block.
- `apps/website/src/app/(main)/donate/page.tsx` - Fixed broken `tel:+1-000-000-0000` placeholder and stale `info@masjidattaqwa.org` reference.
- `apps/website/src/constants/index.ts` - `MOSQUE_INFO` extended with `primaryEmail`, `adminPhone`, `educationPhoneBrothers`, `educationPhoneSisters`, `imamEmail`, `social.whatsappGroup`, `social.whatsappChannel`. New `JANAZA_PARTNER` export.
- `apps/website/src/components/features/prayer-times/PrayerTimesContent.tsx` - Jumu'ah times now driven by `prayerTimes.jummah[]` array.
- `apps/website/src/components/features/hero/immersive-hero.tsx` - Added `TODO(hero)` marker pending real masjid photograph from Labibah; Unsplash stock photo continues to render until then.
- `apps/website/src/lib/navigation.ts` - Added Community Hub, Library, Calendar Downloads to header nav.

### Fixed - 2026-04-22

#### Production build inlining of NEXT_PUBLIC_* URLs (PRs #9, #10)
- `Dockerfile` - Added `ARG` + `ENV` declarations for `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_AUTH_URL`, `NEXT_PUBLIC_ADMIN_URL`, `NEXT_PUBLIC_SUNNAH_API_KEY` in the website-builder stage. Without these, `pnpm build` saw the vars as undefined and the bundle baked in the `'http://localhost:1337'` fallback in 15+ client files (`apps/website/src/lib/strapi-api.ts:7`, `contact-form.tsx:44`, etc.) — causing the deployed prod site to POST to `https://localhost:1337/...` and fail with TLS errors.
- `docker-compose.yml` - Added `build.args` block to website service. Extended admin's existing args block to include `NEXT_PUBLIC_API_URL`.
- `.env.example` - Rewrote Public URLs section with explicit "INLINED into the Next.js bundle at BUILD time" warning and `attaqwa-*.learnednomad.com` examples for prod.

### Changed - 2026-04-23

#### LMS seed data (PR #13, #14)
- `apps/api/src/bootstrap.ts` - Replaced 14 fictional instructor names ("Ustadh Omar Hassan", "Sister Fatima Rahman", "Imam Abdul-Rahman", "Qari Abdullah Khan", "Dr. Ahmad Khalil", "Sheikh Muhammad Ali", "Dr. Aisha Mahmoud", "Sheikh Abdullah Yousef", "Dr. Ibrahim Hassan", "Sister Zainab Ahmad", "Sheikh Hassan Malik", "Imam Ali Rahman", "Dr. Omar Abdullah", "Sheikh Yusuf Ibrahim") with the generic `"Masjid At-Taqwa Education Team"` so demo seed data doesn't make false claims about who teaches which course. Real instructors get attached to actual courses when those launch.

#### ESLint 9 flat config (PR #13, #14)
- `apps/website/eslint.config.mjs` + `apps/admin/eslint.config.mjs` - New flat configs. ESLint 9.37 was installed but the repo had no config file at all, so `pnpm lint` failed at config-load time.
- Wires plugins (typescript-eslint, eslint-plugin-react, eslint-plugin-react-hooks, @next/eslint-plugin-next) directly against the flat-config API. Bypasses FlatCompat + eslint-config-next because Next 16's bundled config triggers a "Converting circular structure to JSON" error inside `@eslint/eslintrc` when normalised.
- Lint scripts updated: dropped deprecated `--ext` flag (flat config infers extensions from config), replaced admin's `next lint` with `eslint .` for consistency.
- Pragmatic rule config: bug-class rules stay enabled but downgraded to `'warn'` so the codebase passes lint while still surfacing the 316 + 111 pre-existing issues for follow-up cleanup. Promote `react-hooks/*` rules back to `'error'` as warnings are addressed.

### Infrastructure - 2026-04-22

#### Dev docker stack reliability (PR #7)
- `docker-compose.dev.yml` - First-boot of the dev stack on Apple Silicon + alpine was failing because `node:22-alpine` ships without `python3` / `make` / `g++`, so `better-sqlite3` (Strapi optional dep), `sharp` (image processing), and `lightningcss` (Next CSS) couldn't build their native bindings.
  - Added `apk add --no-cache python3 make g++` to admin + website startup commands; api also gets `vips-dev` for sharp/libvips
  - Switched per-container `pnpm install` to `pnpm install --filter <app>...` to stop concurrent-install workspace races corrupting `apps/*/node_modules`
  - Dropped api's `npm install --os=linux --libc=musl sharp` step (was triggering full native rebuild of better-sqlite3 inside alpine)
- `apps/website/package.json` - Dropped hardcoded `--port 3003` from dev script so PORT env var works; container now correctly listens on 3001 matching the compose mapping.
- `docker-compose.yml` - Added `NEXT_PUBLIC_ADMIN_URL` to website service env block.

### Security - 2026-01-30

- **Comprehensive security headers** (`next.config.ts`) - Added 8 security headers applied to all routes:
  - Content-Security-Policy (CSP) with strict directives for scripts, styles, fonts, images, connections
  - Strict-Transport-Security (HSTS) with 1-year max-age, includeSubDomains, preload
  - X-Frame-Options: DENY (prevents clickjacking)
  - X-Content-Type-Options: nosniff (prevents MIME sniffing)
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy: restricts camera, microphone, payment, USB, gyroscope, accelerometer
  - X-XSS-Protection: 1; mode=block
  - X-DNS-Prefetch-Control: on
  - API routes: Cache-Control no-store headers
  - CSP includes `localhost:1337` in development for Strapi
- **httpOnly cookie authentication** (`src/lib/auth-cookies.ts`) - Replaced all localStorage token storage with secure httpOnly cookies, preventing XSS token theft
  - Separate cookie namespaces: `student-auth-token`, `teacher-auth-token`, `admin-auth-token`
  - `httpOnly: true`, `secure: true` (production), `sameSite: 'strict'`
  - 7-day token expiration with configurable options
  - Convenience helpers: `studentAuth`, `teacherAuth`, `adminAuth` with `setToken/getToken/clearToken`
- **JWT middleware hardening** (`src/middleware/auth.ts`) - Major security improvements:
  - Removed hardcoded fallback JWT secret (`'your-secret-key-change-in-production'`)
  - Runtime validation: throws error if `JWT_SECRET` not set in production
  - Algorithm restriction: `algorithms: ['HS256']` prevents algorithm confusion attacks
  - Token expiration validation with `maxAge: '7d'`
  - Required claim validation (userId, email must exist)
  - Multi-cookie verification: checks student, teacher, admin, and generic auth cookies
  - Legacy Authorization header support preserved for API clients
- **API client security** (`src/lib/api.ts`) - Removed localStorage token reads; login/register no longer expose raw JWT to client code; all requests use `credentials: 'include'`
- **Student API client** (`src/lib/student-api.ts`) - Removed `getAuthToken()` from localStorage; all requests use cookie-based `credentials: 'include'`
- **Teacher API client** (`src/lib/teacher-api.ts`) - Same localStorage removal and cookie-based auth migration
- **StudentAuthContext** (`src/contexts/StudentAuthContext.tsx`) - Removed all `localStorage.setItem('studentToken', ...)` calls; token is server-managed via httpOnly cookie only
- **Input sanitization**: Added HTML sanitization utilities for user-generated content (`src/lib/sanitize.ts`)
- **Zod validation schemas**: Added runtime validation schemas for auth, announcements, and courses (`src/lib/schemas/`)
- **Gitignore hardening** (`.gitignore`) - Expanded secret exclusions:
  - `.env.*`, `apps/*/.env`, `packages/*/.env` patterns
  - `codex.mcp.json` (MCP tokens)
  - Credential files: `*.pem`, `*.key`, `*.p12`, `*.pfx`, `credentials.json`, `secrets.json`
  - Secret directories: `**/secrets/`, `**/.secrets/`
- **Security policy**: Added `SECURITY.md` with vulnerability reporting guidelines

### Added - 2026-01-30

#### Student Authentication API (BFF Pattern)
- `POST /api/student/auth/login` - Validates credentials against Strapi, sets httpOnly cookie, includes dev fallback when Strapi unavailable
- `GET /api/student/auth/me` - Returns authenticated user data from httpOnly cookie or 401
- `POST /api/student/auth/logout` - Clears student httpOnly auth cookie

#### Teacher Authentication API
- `POST /api/teacher/auth/login` - Teacher credential validation with httpOnly cookie
- `POST /api/teacher/auth/logout` - Clears teacher httpOnly auth cookie

#### Teacher Portal Pages (6 new)
- `/teacher/progress` - Student progress reports with search, filter toolbar, and mock data table
- `/teacher/attendance` - Class attendance tracking with per-student status cards (present/absent/late)
- `/teacher/materials` - Teaching materials library with file type grid and upload zone
- `/teacher/calendar` - Islamic calendar view with upcoming events and Hijri date sidebar
- `/teacher/certificates` - Certificate management with issue/approve workflow and status badges
- `/teacher/engagement` - Student engagement metrics with top-engaged list and low-engagement alerts

#### Teacher Course Sub-Pages (5 new)
- `/teacher/courses/new` - New course creation form
- `/teacher/courses/[id]` - Course detail view
- `/teacher/courses/[id]/edit` - Course editing form
- `/teacher/courses/[id]/students` - Course student roster
- `/teacher/courses/[id]/analytics` - Per-course analytics dashboard

#### Teacher Lesson Sub-Pages (2 new)
- `/teacher/lessons/[id]` - Lesson detail view
- `/teacher/lessons/[id]/edit` - Lesson editing form

#### Admin Pages (2 new)
- `/admin/users` - User management with role filters, search, stat cards, and CRUD table
- `/admin/settings` - System settings (general, security, notifications) with system info sidebar

#### Admin Education Sub-Pages (5 new)
- `/admin/education/students` - Education student list with progress bars and at-risk badges
- `/admin/education/analytics` - Education analytics with subject performance and age tier breakdown
- `/admin/education/quiz/new` - Quiz creation form with dynamic question builder and settings sidebar
- `/admin/education/content/new` - Content creation form with subject/type/age-tier selects and media upload
- `/admin/education/content/[id]/edit` - Content editing form pre-filled with existing data

#### Student Pages (1 new)
- `/student/forgot-password` - Password reset form with email input, success state, and back-to-login link

#### Education Pages (1 new)
- `/(main)/education/achievements` - Achievements page with earned/locked sections, category badges, and progress bars

#### API Detail Endpoints (2 new)
- `GET /api/v1/courses/[id]` - Individual course detail endpoint with Strapi integration and fallback
- `GET /api/v1/lessons/[id]` - Individual lesson detail endpoint with Strapi integration and fallback

### Changed - 2026-01-30

#### Framework Upgrade: Next.js 15 → 16, React 18 → 19
- **Next.js 16.1.4** (`package.json`) - Upgraded from Next.js 15.4.2
  - Turbopack is now the default bundler; using `--webpack` flag for custom splitChunks config
  - `revalidateTag()` now requires cacheLife profile as second argument
- **React 19** (`package.json`) - Upgraded from React 18.3.1 (`react`, `react-dom`, `@types/react`, `@types/react-dom`)
- **eslint-config-next 16.1.4** - Upgraded to match Next.js version
- **Build scripts** (`package.json`) - Added `--webpack` flag to `dev` and `build` commands
- **Lint scripts** - Changed from `next lint` to `eslint . --ext .js,.jsx,.ts,.tsx` for more control
- **Revalidation API** (`src/app/api/revalidate/route.ts`) - Updated `revalidateTag(tag)` to `revalidateTag(tag, 'max')` for Next.js 16 compatibility
- **Jest setup** (`jest.setup.js`) - Updated `createQueryClientWrapper` to use `React.createElement` instead of JSX; added proper React import and JSDoc types
- **next-env.d.ts** - Added routes type reference for Next.js 16

#### Authentication Migration (localStorage → httpOnly cookies)
- **StudentAuthContext** (`src/contexts/StudentAuthContext.tsx`) - Removed all `localStorage.setItem/removeItem` for tokens; logout uses `try/catch/finally` pattern to ensure local state cleanup even if API fails
- **API client** (`src/lib/api.ts`) - `authApi.login()` and `authApi.register()` no longer return or store tokens; `authApi.logout()` no longer clears localStorage
- **Student API client** (`src/lib/student-api.ts`) - Removed `getAuthToken()` function; dashboard no longer reads `studentData` from localStorage
- **Teacher API client** (`src/lib/teacher-api.ts`) - Removed `getAuthToken()` function; added `CourseFormData` interface; added `progress` alias on `StudentEnrollment`
- **Student data hook** (`src/hooks/use-student-data.ts`) - Fixed TypeScript type assertion for enrollment summary meta

#### Layout and UI Changes
- **Student layout** (`src/components/layout/student-layout.tsx`) - Removed broken `AvatarImage src="/placeholder-avatar.jpg"`, using `AvatarFallback` initials
- **Teacher layout** (`src/components/layout/teacher-layout.tsx`) - Removed broken avatar image; logout now calls `/api/teacher/auth/logout` to clear httpOnly cookie
- **Teacher login** (`src/app/teacher/login/page.tsx`) - Updated login flow for cookie-based authentication
- **Teacher courses page** (`src/app/teacher/courses/page.tsx`) - Added links to new course detail/edit/students/analytics sub-pages
- **Teacher lessons page** (`src/app/teacher/lessons/page.tsx`) - Added links to new lesson detail/edit sub-pages
- **Select component** (`src/components/ui/select.tsx`) - Updated Radix Select component

#### Configuration
- **.env.example** - Reorganized with section headers; added `JWT_SECRET` (must match API server); added `NEXT_PUBLIC_POSTHOG_HOST`; added optional Redis config (`UPSTASH_REDIS_URL/TOKEN`); updated port from 3000 to 3001; added security warnings

### Fixed - 2026-01-30

- **Quizzes API 500 error** (`src/app/api/v1/quizzes/route.ts`) - Fixed Strapi URL from `/api/v1/quizzes` to `/api/quizzes`; added mock data fallback; fixed boolean filter sent as string `'true'`
- **Announcements API** (`src/app/api/v1/announcements/route.ts`) - Improved error handling with fallback mock data
- **Lessons API** (`src/app/api/v1/lessons/route.ts`) - Added fallback mock data for development without Strapi
- **CSP blocking Strapi in dev** (`next.config.ts`) - Development requests to `localhost:1337` no longer blocked by Content Security Policy
- **Broken avatar images** - Both student and teacher layouts no longer reference missing `/placeholder-avatar.jpg`
- **22 broken navigation links** - All sidebar and in-page links now resolve to functional pages (53/53 routes verified via Playwright)
- **Documentation page crash** (`src/app/(main)/docs/page.tsx`) - Added optional chaining for `docs.meta.mosque?.email` and `docs.meta.mosque?.phone` with fallback values to prevent runtime errors when mosque data is undefined
- **Seerah module page** (`src/app/(main)/education/seerah/[moduleId]/page.tsx`) - Fixed component issues
- **Seerah module content** (`src/components/education/seerah-module-content.tsx`) - Fixed rendering issues
- **Enrollment data type** (`src/hooks/use-student-data.ts`) - Fixed TypeScript type assertion for `result.meta?.summary` with explicit cast to `EnrollmentsData['summary']`
- **Next.js 16 revalidation** (`src/app/api/revalidate/route.ts`) - Fixed `revalidateTag()` call to include required `'max'` cacheLife profile argument (Next.js 16 breaking change)

### Infrastructure - 2026-01-30

- **Next.js 16 + React 19 upgrade** - Major framework upgrade with all dependency updates (`pnpm-lock.yaml`)
- **Webpack fallback** - Build and dev scripts use `--webpack` flag since project has custom splitChunks config incompatible with Turbopack default
- **Docker Compose** - Updated `docker-compose.yml` and `docker-compose.dev.yml` with revised service configurations
- **.env.example** - Reorganized with section headers, added JWT_SECRET, Redis config, PostHog host
- **.gitignore** - Expanded to cover all `.env` variants, MCP tokens, credential files, and secret directories
- **Production source maps disabled** - `productionBrowserSourceMaps: false` with security note
- **Console removal** - `compiler.removeConsole` enabled for production builds

---

### Added - 2025-12-10

#### API Architecture & Versioning
- **Versioned API Endpoints (v1)**: All API endpoints now use `/api/v1/` prefix for proper versioning
- **API Configuration Constants**: Added `API_CONFIG` with version info and deprecation date
- **`API_V1_ENDPOINTS`**: New versioned endpoint constants in `@attaqwa/shared`:
  - LMS Core: `/api/v1/courses`, `/api/v1/lessons`, `/api/v1/quizzes`
  - User-Centric: `/api/v1/users/me/progress`, `/api/v1/users/me/enrollments`
  - Islamic Services: `/api/v1/prayer-times`, `/api/v1/ayahs`, `/api/v1/hadiths`
  - Community: `/api/v1/announcements`, `/api/v1/events`

#### v1 Route Implementations (Next.js BFF)
- `apps/website/src/app/api/v1/prayer-times/route.ts` - Versioned prayer times with Strapi v5 response format
- `apps/website/src/app/api/v1/ayahs/route.ts` - Quran ayahs (flattened from /islamic/ayah)
- `apps/website/src/app/api/v1/ayahs/daily/route.ts` - Daily featured ayah
- `apps/website/src/app/api/v1/hadiths/route.ts` - Hadiths with pagination
- `apps/website/src/app/api/v1/announcements/route.ts` - Announcements with Strapi v5 format
- `apps/website/src/app/api/v1/courses/route.ts` - Courses with filtering, pagination, caching
- `apps/website/src/app/api/v1/lessons/route.ts` - Lessons by course with order sorting
- `apps/website/src/app/api/v1/quizzes/route.ts` - Quizzes with lesson/course filtering
- `apps/website/src/app/api/v1/events/route.ts` - Community events with category filtering
- `apps/website/src/app/api/v1/users/me/progress/route.ts` - User progress tracking
- `apps/website/src/app/api/v1/users/me/enrollments/route.ts` - User course enrollments
- `apps/website/src/app/api/v1/users/me/achievements/route.ts` - User earned achievements

#### Strapi v1 Route Prefixes
- Updated `apps/api/src/api/course/routes/course.ts` with `/v1` prefix
- Updated `apps/api/src/api/lesson/routes/lesson.ts` with `/v1` prefix
- Updated `apps/api/src/api/quiz/routes/quiz.ts` with `/v1` prefix
- Created `apps/api/src/api/achievement/routes/achievement.ts` with `/v1` prefix
- Created `apps/api/src/api/course-enrollment/routes/course-enrollment.ts` with `/v1` prefix
- Created `apps/api/src/api/leaderboard/routes/leaderboard.ts` with `/v1` prefix
- Created `apps/api/src/api/streak/routes/streak.ts` with `/v1` prefix
- Created `apps/api/src/api/user-achievement/routes/user-achievement.ts` with `/v1` prefix
- Created `apps/api/src/api/user-progress/routes/user-progress.ts` with `/v1` prefix

#### Rate Limiting Middleware
- **Global rate limiter**: `apps/api/src/middlewares/rate-limit.ts`
  - Anonymous users: 100 requests/minute
  - Authenticated users: 500 requests/minute
  - Admin users: 1000 requests/minute
- Rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Per-entity middleware wrappers for all 9 content types (courses, lessons, quizzes, achievements, course-enrollments, leaderboards, streaks, user-achievements, user-progress)

#### OpenAPI Documentation
- **`docs/openapi.yaml`**: Complete OpenAPI 3.1.0 specification (800+ lines)
  - All v1 endpoints documented with schemas
  - Authentication, rate limiting, pagination
  - Request/response examples
- Updated `/api/docs` endpoint to serve OpenAPI info via `?format=openapi`
- Added **Swagger UI page** at `/docs/api` with interactive API explorer
  - Installed `swagger-ui-react` and `js-yaml` dependencies
  - Custom Islamic green theme styling
  - Try-it-out functionality enabled

#### Architecture Documentation
- **`docs/architecture.md`**: Full brownfield enhancement architecture document
- **`docs/api-migration-plan.md`**: 3-phase migration plan with rollback strategies
- **`docs/architect-checklist-results.md`**: 96% validation pass rate report

### Changed - 2025-12-10

#### API Client Updates
- Updated `apps/website/src/lib/api.ts` to use `API_V1_ENDPOINTS`
- All API methods now call versioned endpoints

#### Deprecation Headers
- Added deprecation headers to legacy endpoints (sunset: 2025-12-01):
  - `/api/prayer-times` → `/api/v1/prayer-times`
  - `/api/announcements` → `/api/v1/announcements`
  - `/api/islamic/ayah` → `/api/v1/ayahs`
  - `/api/islamic/hadith` → `/api/v1/hadiths`
- Headers: `Deprecation: true`, `Sunset`, `Link: rel="successor-version"`

### Deprecated - 2025-12-10

#### Legacy API Endpoints (Remove by 2025-12-01)
- `API_ENDPOINTS` constant - Use `API_V1_ENDPOINTS` instead
- `/api/prayer-times` - Use `/api/v1/prayer-times`
- `/api/announcements` - Use `/api/v1/announcements`
- `/api/islamic/ayah` - Use `/api/v1/ayahs`
- `/api/islamic/hadith` - Use `/api/v1/hadiths`

---

### Added - 2025-01-30

#### Strapi API Integration
- Complete Strapi v5 API client with query builder for REST API communication
- React Query hooks for efficient data fetching and caching
  - `useCourses()` - Fetch courses with filtering support
  - `useCourse()` - Fetch single course by slug
  - `useCourseById()` - Fetch course by ID
  - `useCourseWithDetails()` - Fetch course with lessons and quizzes
  - `useLessonsByCourse()` - Fetch lessons for a course
  - `useLesson()` - Fetch single lesson
  - `useQuiz()` - Fetch quiz data
  - `useMyEnrollments()` - Fetch user enrollments
  - `useEnrollmentByCourse()` - Check enrollment status
- Strapi query parameter builder supporting filters, populate, pagination, sorting

#### LMS Frontend Pages
- **Course Browse Page** (`/education/browse`)
  - Displays all 15 courses from Strapi with grid/list view toggle
  - Advanced filtering: subject, age tier, difficulty, search
  - Sorting options: newest, oldest, shortest duration
  - Real-time course count and filter indicators
- **Course Detail Page** (`/education/courses/[id]`)
  - Complete course metadata display
  - Course statistics: lessons, duration, difficulty, progress
  - Learning objectives and prerequisites sections
  - Full curriculum with lesson cards
  - Enrollment action with sidebar
- **Lesson Viewer Page** (`/education/lessons/[id]`)
  - Lesson content display with rich text support
  - Progress tracking interface
  - Navigation to previous/next lessons
  - Quiz integration
- **Quiz Page** (`/education/quizzes/[id]`)
  - Quiz interface with question display
  - Answer submission and scoring
  - Results and explanations

#### Type System Improvements
- Local type definitions for LMS entities (AgeTier, IslamicSubject, DifficultyLevel)
- Fixed enum vs string literal issues throughout components
- Added null-safe data transformations

### Fixed - 2025-01-30

#### Bug Fixes
- Fixed "NaNh" duration display in course detail page by calculating from lesson durations
- Corrected field name mismatches: `difficulty_level` → `difficulty`, `estimated_duration` → `duration_weeks`
- Fixed `AgeTierFilter` component to use string literals instead of enum-style access
- Added fallback handling in `AgeTierBadge` for unmatched age tier values
- Updated age tier values to match Strapi schema: children, youth, adults, all
- Fixed type import errors by defining types locally instead of importing from `@attaqwa/shared`
- Added defensive null checks for course subject, age_tier, and difficulty fields

#### Component Updates
- `EducationContentCard`: Updated subject, difficulty, and content type display functions
- `AgeTierFilter`: Changed from enum-based config to string literal keys
- `browse/page.tsx`: Integrated with Strapi API and fixed filter parameters

### Changed - 2025-01-30

#### Data Flow
- Migrated from mock data to Strapi CMS backend
- Implemented React Query for server state management with 5-minute stale time
- Added proper loading and error states for all data fetching

#### Architecture
- Established clear separation between API client (`strapi-api.ts`) and React hooks (`use-strapi-courses.ts`)
- Standardized query key structure for React Query cache management
- Implemented consistent error handling and retry logic

## [0.1.0] - Initial Development

### Added
- Monorepo setup with pnpm workspaces
- Next.js 15 website application
- Strapi v5 CMS backend
- PostgreSQL database with Islamic education schema
- Seeded 15 courses, 120 lessons, and 30 quizzes covering Islamic subjects
- Islamic design system with custom color palette
- Age-tier content filtering system
- UI components with Shadcn/UI and Radix primitives

---

## Version History

- **Unreleased (2026-01-30)**: Next.js 16 + React 19 upgrade, security hardening (8 headers, httpOnly cookies, JWT hardening, .gitignore), cookie-based auth migration, 22 broken link fixes, 22 new pages
- **Unreleased (2025-12-10)**: API v1 versioning, rate limiting, OpenAPI docs
- **Unreleased (2025-01-30)**: Strapi API integration and LMS frontend pages
- **0.1.0**: Initial project setup and data seeding
