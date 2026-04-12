# Troubleshooting & Known Fixes

Record of non-obvious bugs encountered during local dev and the fix for each. Check here before debugging from scratch.

---

## File picker "browse" button does nothing when clicked

**Symptom**: Click the "browse" link in a file dropzone (lesson/course forms) and no native file picker opens. No console error.

**Root cause**: The hidden `<input type="file">` used Tailwind's `className="hidden"` (`display: none`). Chromium blocks programmatic `.click()` on a file input with `display: none` in some configurations (notably Chrome launched with `--no-sandbox`, and some fingerprinting-protection contexts). The click fires but no dialog appears.

**Fix**: Use `sr-only` instead of `hidden`. `sr-only` keeps the element in the layout (so programmatic click is honored) while hiding it visually and from screen-layout flow.

```diff
  <input
    ref={fileInputRef}
    type="file"
    accept={accept}
    onChange={...}
-   className="hidden"
+   className="sr-only"
  />
```

Files changed:
- `apps/admin/components/lessons/lesson-form.tsx`
- `apps/admin/components/courses/course-form.tsx`

**Repro note**: In Playwright MCP, the click WAS triggering file choosers (queue of pending dialogs was visible in modal state), but in the user's real Chrome window the dialog was silently suppressed.

---

## Strapi admin seed API errors

**Symptom**: On fresh DB boot, bootstrap logs one of:
- `adminService.findMany is not a function`
- `adminService.hashPassword is not a function`

**Root cause**: In Strapi 5, the admin user/role services do not expose `findMany`/`hashPassword` as service methods. These live on `strapi.db.query('admin::user')` and `strapi.service('admin::auth')` respectively.

**Fix** (`apps/api/src/bootstrap.ts` in `seedStrapiAdmin`):

```diff
- const existingAdmins = await adminService.findMany({ limit: 10 });
+ const existingAdmins = await strapi.db.query('admin::user').findMany({
+   limit: 10,
+   populate: ['roles'],
+ });

- const hashedPassword = await adminService.hashPassword(SEED_ADMIN.password);
- await adminService.create({ ...SEED_ADMIN, password: hashedPassword, ... });
+ const hashedPassword = await strapi.service('admin::auth').hashPassword(SEED_ADMIN.password);
+ await strapi.db.query('admin::user').create({
+   data: { ...SEED_ADMIN, password: hashedPassword, ... },
+ });
```

---

## Strapi fails to load: "Could not load the sharp module"

**Symptom**: `strapi develop` fails with:
```
Error: Could not load js config file .../@strapi/upload/dist/server/index.js:
Could not load the "sharp" module using the darwin-arm64 runtime
```

**Root cause**: `sharp` optional binaries for the current platform weren't installed (common when `node_modules` was populated on a different OS or with `--no-optional`).

**Fix**:
```bash
cd apps/api
npm install --os=darwin --cpu=arm64 sharp
```

Use the matching `--os`/`--cpu` pair for your platform.

---

## Admin auth proxy: `ECONNREFUSED` calling BetterAuth

**Symptom**: `apps/admin` logs `TypeError: fetch failed ... ECONNREFUSED` from `app/api/auth/[...all]/route.ts`, and sign-in returns 500.

**Root cause**: The admin's auth proxy defaulted to `http://localhost:3001`, but the website (BetterAuth host) runs on port **3003** in dev (`apps/website/package.json` → `"dev": "next dev --port 3003 --webpack"`).

**Fix**: Default URLs in the admin proxy should match the website's actual dev port:
- `apps/admin/app/api/auth/[...all]/route.ts`
- `apps/admin/app/api/v1/[...path]/route.ts`

```diff
- "http://localhost:3001"
+ "http://localhost:3003"
```

Or set `AUTH_INTERNAL_URL` / `NEXT_PUBLIC_AUTH_URL` in `apps/admin/.env.local`.

---

## BetterAuth: `relation "user" does not exist`

**Symptom**: Sign-in returns 500 with `error: relation "user" does not exist` from BetterAuth.

**Root cause**: BetterAuth doesn't auto-create its tables. On a fresh DB (e.g. after `docker compose down -v`) the `user`/`session`/`account`/`verification` tables must be created before any auth call.

**Fix**:
```bash
cd apps/website
npx @better-auth/cli migrate -y
```

Then reseed the default users:
```bash
PGPASSWORD="$(docker exec attaqwa-postgres-dev printenv POSTGRES_PASSWORD)" \
  psql -h localhost -U postgres -d attaqwa_lms \
  -f scripts/seed-auth-users.sql
```

---

## Dashboard/courses/students pages: all v1 endpoints return 500

**Symptom**: Admin dashboard API calls (`/api/v1/courses`, `/api/v1/lessons`, etc.) all return 500. The proxy error body reads:
```json
{"error":"STRAPI_API_TOKEN is not configured. Set it in your .env file."}
```

**Root cause**: `apps/admin/.env.local` is missing `STRAPI_API_TOKEN`. The admin proxy requires it to authenticate server-to-server calls to Strapi.

**Fix**: Bootstrap creates a full-access token on first boot and logs it:
```
🔑 API token created: <long hex string>
   Set STRAPI_API_TOKEN in your .env to this value
```

To force regeneration (token value is only logged once and never persisted in plaintext):
```bash
PGPASSWORD="..." psql ... -c "DELETE FROM strapi_api_tokens WHERE type = 'full-access';"
touch apps/api/src/bootstrap.ts   # triggers Strapi hot reload
# Grab the new token from apps/api logs, paste into apps/admin/.env.local
```

Then restart the admin dev server so Next.js picks up the env change.

---

## Dashboard: `TypeError: Cannot read properties of undefined (reading 'pagination')`

**Symptom**: Dashboard page errors on load at `admin-stats.ts:getResourceCount`.

**Root cause**: `strapiClient.get<T>()` returns the raw axios body (which is Strapi's `{ data, meta }`), **not** `{ data: T }` as its type signature implies. `admin-stats.ts` was destructuring `const { data } = await strapiClient.get(...)`, which pulled out the `data` array and dropped `meta`. Then `data.meta.pagination.total` threw because `meta` was undefined.

**Fix** (`apps/admin/lib/api/admin-stats.ts`):
```diff
- const { data } = await strapiClient.get<StrapiResponse<T>>(`/v1/${endpoint}${query}`);
- return data;
+ const response = await strapiClient.get<StrapiResponse<T>>(`/v1/${endpoint}${query}`);
+ return response as unknown as StrapiResponse<T>;
```

**Long-term**: the `strapiClient.get` return type is wrong — it claims `{ data: T }` but returns `T`. Worth fixing the client type so consumers don't have to cast.

---

## Postgres password special characters break `DATABASE_URL`

**Symptom**: BetterAuth logs `password authentication failed for user "postgres"` even though the password works from `psql`.

**Root cause**: The docker-compose-generated password ends with `=` (base64 padding). In a URL connection string, `=` is a reserved char and must be percent-encoded as `%3D`.

**Fix**: In `apps/website/.env.local` (and any other `DATABASE_URL`):
```
# WRONG
DATABASE_URL=postgresql://postgres:AbC=@localhost:5432/attaqwa_lms

# RIGHT
DATABASE_URL=postgresql://postgres:AbC%3D@localhost:5432/attaqwa_lms
```

General rule: URL-encode any of `:/?#[]@!$&'()*+,;=` appearing in the password.

---

## Moderation page returns 403 from `/api/v1/moderation-queues`

**Status**: Known issue, not yet fixed.

**Symptom**: `/moderation` in the admin portal logs 403 Forbidden even with the full-access token.

**Likely cause**: The `moderation-queue` content type has custom route policies that reject token auth (or expects an authenticated Strapi admin session instead of an API token). Needs review of `apps/api/src/api/moderation-queue/routes/*.ts` and any custom policies.
