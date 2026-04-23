# Masjid At-Taqwa Website — QA Report

**Date:** 2026-04-23
**Tested against:** local dev stack (`http://localhost:3001` + `http://localhost:1337`)
**Tooling:** Playwright (Chromium 1440×900) + manual API smoke tests
**Scope:** every public website route + admin login + both inquiry forms

---

## Headline

The site renders end-to-end and both inquiry forms submit successfully.
**Three concrete bugs** were surfaced during the walkthrough — none catastrophic, all fixable in <30 min each. The largest open block to launch readiness is **content**, not code: empty Strapi collections (events, announcements, library) and stale demo data on legacy LMS routes.

| Severity | Count | Examples |
|---|---|---|
| 🔴 Critical | 1 | Library page returns 400 because hook uses Strapi 5–incompatible `populate=file,coverImage` syntax |
| 🟠 High    | 1 | Funeral page shows placeholder phone `(555) 123-4567` as the 24/7 emergency line |
| 🟡 Medium  | 1 | Contact page "Getting Here" + "Nearby Landmarks" are fictional (Highway 101, Bus Route 42, Sunshine Elementary) |
| 🟢 Cosmetic / Content | several | Bare admin login, hardcoded stat counts, two routes for calendar downloads |

---

## What works

| Feature | Route | Notes |
|---|---|---|
| Home | `/` | Hero + immersive header, today's prayer times card, hadith of the day, services grid (7 cards), live announcements + events. 0 console errors. Hero still uses Unsplash stock — `TODO(hero)` marker in code. |
| Prayer times | `/prayer-times` | All 5 prayers + Sunrise highlight, qibla 52°, two Jumu'ah times (currently from fallback constants since dev iqamah-schedule is empty), parking + etiquette + facilities. |
| About | `/about` | Real leadership (6 team members), Five Pillars + Six Articles of Faith grids, history with Daarul Barzakh cemetery, WhatsApp links in Visit Us card. |
| Services | `/services` | Core services + 24/7 emergency block + Janaza Services of Georgia partnership block + Ask-an-Imam CTA banner + Online services grid. Contact phone + email all corrected. |
| Funeral services | `/services/funeral-services` | Renders Janaza partner block. **🟠 BUG:** 24/7 emergency phone shows `(555) 123-4567`. |
| Ask an Imam | `/services/ask-an-imam` | Routing-explainer for brothers vs sisters, full form (Fiqh / Halal-Haram / Family / Business / Ritual / Aqeedah). **End-to-end submission verified — 201 Created, success state rendered.** |
| Education | `/education` | Real schedule (Tahfeedh Mon-Thurs, Weekend Sat-Sun, Adult Brothers/Sisters, Daily Tafseer/Hadith, After-school, Adult Qur'an, Homeschooling), tuition figures, weekly schedule table. |
| Resources hub | `/resources` | 6 resource cards including Library + Calendar Downloads. Stats hardcoded. |
| Library | `/resources/library` | Page chrome renders, category chips work. **🔴 BUG:** API call fails with 400 — hook uses comma-separated `populate=file,coverImage` which Strapi 5 rejects. |
| Calendar Downloads | `/resources/calendar-downloads` | Same 400 root cause as library. |
| Community Hub | `/community` | WhatsApp Group + Channel cards, Upcoming Events list, Calendar Downloads CTA, Latest Announcements list. Empty states for events + announcements (dev DB has none). |
| Contact | `/contact` | Hero + stats + form + sidebar (quick contact, office hours, social, emergency contact) + Our Team (Imam Mohammad + Ustadh Abdullah + School Admin) + Location + FAQ. **End-to-end submission verified — 201 Created, success state rendered.** |
| Donate | `/donate` | Zakat calculator, contribution categories, payment methods, donor info form. Phone + email corrected from earlier placeholders. |
| Calendar (legacy) | `/calendar` | Different rendering of "Islamic Calendar Downloads" with hardcoded category buttons. Duplicates `/resources/calendar-downloads` purpose. |
| Announcements | `/announcements` | Page renders with empty state, search + filter chips. |
| Events | `/events` | Page renders with empty state. |
| Admin login | `/admin` → `/admin/login` | Plain centered card. Form posts work (not exercised in this pass). No branding/styling. |

All pages return HTTP 200 from the website. Header navigation present on every page. Footer present on every page. No 500s, no broken images.

---

## What's broken (with fix paths)

### 🔴 Critical — Library + Calendar Downloads return 400

- **What** Both `/resources/library` and `/resources/calendar-downloads` show their error state ("We couldn't reach the library right now").
- **Why** `apps/website/src/lib/hooks/useLibrary.ts:128` builds the query string with `'populate=file,coverImage'` (comma-separated). Strapi 5 rejects this with `400 ValidationError: Invalid key file,coverImage`.
- **Fix** Use the array syntax: replace the single line with two `parts.push('populate[0]=file')` and `parts.push('populate[1]=coverImage')`. Or use `populate=*` if you want everything populated. ~5 line change in one file.
- **Tracking:** task #16

### 🟠 High — Funeral services emergency phone is `(555) 123-4567`

- **What** Top-of-page red emergency contact card on `/services/funeral-services` shows a placeholder phone that no one will answer.
- **Why** Got missed in the Phase 1 corrections sweep (the `services/page.tsx` got fixed but the funeral sub-page didn't).
- **Fix** Search-and-replace `(555) 123-4567` → `(678) 896-9257` in `apps/website/src/app/(main)/services/funeral-services/page.tsx`.
- **Tracking:** task #17

### 🟡 Medium — Contact page directions + landmarks are fictional

- **What** "Getting Here" describes Highway 101, Bus Route 42 to "Islamic Center stop". "Nearby Landmarks" lists Sunshine Elementary School and Downtown Shopping District — none of which exist near 2674 Woodwin Rd, Doraville.
- **Why** Original boilerplate that never got replaced with real Doraville directions.
- **Fix** Either delete those two sections or rewrite with actual directions from I-285 and the real surrounding landmarks.
- **Tracking:** task #18

---

## Cosmetic / content gaps (non-blocking)

| Where | What |
|---|---|
| `/admin/login` | Bare unbranded card. No logo, no description, no error styling for failed logins (not tested), no "back to public site" link. |
| `/contact` "Team Members 3" + "Languages 3" stat cards | Hardcoded numbers that don't match the actual team list (6 leadership cards on About page, 2 imams + 1 admin on Contact). |
| `/calendar` (legacy route) | Duplicates `/resources/calendar-downloads` with a different (also empty) renderer + different category list. Pick one and redirect or delete. |
| `/community` | Empty states are clean but Upcoming Events + Latest Announcements both empty in dev because Strapi tables are empty. |
| Hero image | Still Unsplash stock — `TODO(hero)` marker is in `apps/website/src/components/features/hero/immersive-hero.tsx:42`. Pending photo from Labibah. |
| Library / Calendar Downloads | Will be empty even after the 400 bug is fixed — Strapi `library-resource` collection has no entries yet. |
| Default fallback announcement | Home page shows "Welcome to Masjid At-Taqwa" + "Jummah Prayer" because the dev DB has no events/announcements. The fallback strings are in `apps/website/src/app/(marketing)/page.tsx:40-67`. |
| Admin login uses `/admin` route on **website** | Confusing — there's also a separate Next.js admin app on port 3000. The two coexist and serve different purposes; users may not know which to use. |

---

## Form delivery verification

Both inquiry endpoints exercised through the actual UI via Playwright:

| Form | Endpoint | Result |
|---|---|---|
| `/contact` Send Message | `POST /api/v1/contact-inquiries` | **201 Created** — success state rendered, "JazakAllahu Khayran — we've received your message" with "Send another message" affordance. |
| `/services/ask-an-imam` Submit Question | `POST /api/v1/legal-inquiries` | **201 Created** — success state "Your question has been received" with category=halal-haram + audience=sisters preserved server-side. |

Email notifications were not exercised because no SMTP_HOST is configured in dev (graceful no-op as designed). Both records persist to Strapi admin.

---

## Console health summary

| Page | Errors | Warnings |
|---|---|---|
| `/` | 0 | 0 |
| `/prayer-times` | 0 | 0 |
| `/about` | 0 | 0 |
| `/services` | 0 | 0 |
| `/services/ask-an-imam` | 0 | 0 |
| `/services/funeral-services` | 0 | 0 |
| `/education` | 0 | 0 |
| `/resources` | 0 | 0 |
| `/resources/library` | **4** | 0 |
| `/resources/calendar-downloads` | **4** | 0 |
| `/community` | 0 | 0 |
| `/contact` | 0 | 0 |
| `/donate` | 0 | 0 |
| `/announcements` | 0 | 0 |
| `/events` | 0 | 0 |
| `/calendar` | 0 | 0 |
| `/admin/login` | 0 | 0 |

The 8 errors all originate from the same root cause (Strapi 5 populate syntax, see Critical bug above).

---

## Screenshots

All full-page screenshots in `docs/qa-2026-04-23/screenshots/`:

01. admin-login · 02. home · 03. prayer-times · 04. about · 05. services · 06. ask-an-imam · 07. education · 08. resources · 09. library · 10. calendar-downloads · 11. community · 12. contact · 13. donate · 14. funeral-services · 15. announcements · 16. events · 17. calendar · 18. contact-form-success · 19. ask-an-imam-success

---

---

## Admin walkthrough (`/admin`)

Logged in via `superadmin@attaqwa.org` / `SuperAdmin123!`. Login worked first try.

| Page | Route | Status | Notes |
|---|---|---|---|
| Login | `/admin/login` | ✅ works | Bare unbranded card. No "back to public site" link, no error styling tested. |
| Dashboard | `/admin` | ✅ renders | Sidebar with 9 sections + logout. 4 stat cards (all 0 in dev DB). Today's prayer schedule + qibla. Quick Actions menu. **🟠 2 console 403s** — `/api/v1/appeals` and `/api/v1/itikaf-registrations` fetched without admin auth header. |
| Announcements | `/admin/announcements` | ✅ renders | Empty state with category tabs (All / General / Ramadan / Eid / Urgent / Community / Fundraising). Create New CTA. |
| Events | `/admin/events` | ✅ renders | Empty state with All / Upcoming / Past tabs. Create New CTA. |
| Prayer Times | `/admin/prayer-times` | ✅ renders | City + Country + Calc Method form, today's schedule with Adhan + Iqama for each prayer, qibla 52°. Tabs: Today / This Week / This Month / Iqamah Times / Tarawih (Ramadan) / Overrides. Refresh + Export buttons. **Most polished admin page.** |
| I'tikaf | `/admin/itikaf` | 🔴 broken | Error state only — "Failed to load registrations. Please try again." No page chrome, no retry button. Cause: 403 from `/api/v1/itikaf-registrations`. |
| Appeals | `/admin/appeals` | 🔴 broken | Same — "Failed to load appeals. Please try again." No page chrome. Cause: 403 from `/api/v1/appeals`. |
| Users | `/admin/users` | ⚠️ stub | "User Management Coming Soon." Empty placeholder. |
| Education | `/admin/education` | ✅ renders | "Education Management" with 4 stat cards (all `--`/no data), Recent Content empty state, Top Performing Content empty state, Students Needing Help, Quick Actions: Create New Lesson / Create New Quiz / View Analytics / Export Reports. Has Import button. |
| Settings | `/admin/settings` | ⚠️ cosmetic | Renders but has fake/placeholder values (see below). |

### 🟠 Issues found in admin

1. **`/admin/itikaf` and `/admin/appeals` show only error states** — when the underlying API call fails, the entire page goes blank except for the error message. Sidebar shifts left, no header. The fetch doesn't include the admin auth cookie/token. Both endpoints exist in Strapi but require either admin role or Public-role grant. Until the API call is authenticated correctly, both pages are unusable.

2. **`/admin/settings` shows fictional system info** — System Information panel hardcodes "At-Taqwa LMS v2.1.0" (not real), "Next.js Version 15.x" (we're on 16.1.4 on the website, 15.x on admin app), "Node.js 20.x LTS" (we're on 22), "Uptime 99.9%" (no measurement). General Settings shows Contact Email `admin@attaqwa.org` (not the real `almaad2674@gmail.com`) and SMTP Server `smtp.sendgrid.net` (we're configured for nodemailer with whatever SMTP_HOST is set). The Save Changes button appears to be a no-op placeholder.

3. **`/admin/users` is a "Coming Soon" stub.** Should at minimum list the 4 seeded BetterAuth accounts (superadmin / masjidadmin / teacher / student).

4. **Login screen has no branding or recovery flow** — no logo, no "forgot password" link, no link back to the public site, no error styling tested. Functional but feels temporary.

5. **403 errors visible in console on dashboard** even before navigating — the dashboard's stat-card fetches for Active Appeals + Pending I'tikaf hit endpoints that require admin auth. They render `0` (which happens to be true in dev) but the underlying call is failing silently.

### What's solid

- Sidebar nav is clean and consistent.
- Empty states on Announcements + Events are clear with "Create your first ___" CTAs.
- Prayer Times admin is genuinely usable — could ship today.
- Education admin is well-structured even with no real data wired.
- Logout button at bottom of sidebar is discoverable.

### Recommendations

| Priority | Item |
|---|---|
| 🟠 High | Fix the auth header on `/admin/itikaf` and `/admin/appeals` fetches — currently the user can't access either feature even after logging in. |
| 🟠 High | Either wire `/admin/settings` System Info to real metrics or remove that panel. Same for fake values like Uptime 99.9%. |
| 🟡 Medium | Replace `admin@attaqwa.org` placeholder email in settings with `almaad2674@gmail.com`. |
| 🟡 Medium | Build out `/admin/users` past the "Coming Soon" stub — at minimum list seeded users with role badges. |
| 🟢 Low | Style the admin login (logo, branding, "back to site" link). |
| 🟢 Low | Add an `/admin/inquiries` page to view contact-inquiry + legal-inquiry submissions (currently you'd have to use Strapi admin at port 1337 to see them). |

---

## Recommended action order

1. **Fix `useLibrary.ts` populate syntax** (5 min, unblocks Library + Calendar Downloads on prod once redeployed)
2. **Fix funeral page placeholder phone** (1 min, sed replace)
3. **Decide fate of `/calendar` legacy route** — redirect to `/resources/calendar-downloads` or delete
4. **Deploy both fixes** (single PR)
5. **Coolify config** still pending: NEXT_PUBLIC_* build args + SMTP env + tick three Public role permissions in Strapi
6. **Then ask Labibah for** real masjid hero photograph + first batch of library content (so library page has something to show after the populate fix)
7. **Style the admin login** + reconcile `/admin` vs port-3000 admin portal (later, post-launch)

The site is structurally sound. The remaining work is surface-level fixes + content uploads, not architectural.
