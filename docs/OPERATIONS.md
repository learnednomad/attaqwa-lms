# Operations Guide - AttaqwaMasjid LMS

How every service connects, which env vars matter, and how to deploy.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (User)                            │
├────────────┬──────────────────┬──────────────────────────────┤
│ :3000      │ :3003            │ :1337                        │
│ Admin      │ Website          │ Strapi Admin UI              │
│ (Next.js)  │ (Next.js)        │ (built-in)                   │
└─────┬──────┴────────┬─────────┴──────┬───────────────────────┘
      │               │                │
      │  Browser-side │                │
      │  fetch to     │                │
      │  localhost:1337│                │
      │  ◄────────────┘                │
      │               │                │
      │          Server-side           │
      │          BFF routes            │
      │          (/api/v1/*)           │
      │               │                │
      │               ▼                │
      │    ┌──────────────────┐        │
      │    │   Strapi API     │◄───────┘
      │    │   (api:1337)     │
      │    │   /api/v1/*      │
      └───►│                  │
           └────────┬─────────┘
                    │
           ┌────────┴─────────┐
           │   PostgreSQL     │◄──── Website (BetterAuth)
           │   (postgres:5432)│
           └──────────────────┘
```

## Service Roles

| Service | Port | Role | Source |
|---------|------|------|--------|
| **postgres** | 5432 | Database (pgvector) | `pgvector/pgvector:pg16` |
| **api** | 1337 | Strapi CMS - content API and admin UI | `apps/api` |
| **admin** | 3000 | LMS admin panel - course/lesson/quiz CRUD | `apps/admin` |
| **website** | 3003 (dev) / 3001 (prod) | Student portal + public site | `apps/website` |
| **init** | — | One-shot: DB migrations, user seeding | `scripts/` |
| **redis** | 6379 | Caching (production only) | `redis:7-alpine` |
| **caddy** | 80/443 | Reverse proxy + auto-TLS (production only) | `caddy:2-alpine` |

## How Services Talk to Each Other

### The URL Problem

Docker containers can't reach each other at `localhost`. Each container's `localhost` is itself. Services must use **Docker service names** as hostnames.

| From | To | Hostname | Env Var |
|------|----|----------|---------|
| Admin (browser JS) | Strapi | `localhost:1337` | `NEXT_PUBLIC_API_URL` |
| Website (browser JS) | Website BFF | `localhost:3003` | (same origin) |
| Website (server-side BFF) | Strapi | `api:1337` | `STRAPI_URL` |
| Website (server-side auth) | PostgreSQL | `postgres:5432` | `DATABASE_URL` |
| API (Strapi) | PostgreSQL | `postgres:5432` | `DATABASE_HOST` |
| Admin panel has no server-side proxy | — uses browser fetch | `localhost:1337` | `NEXT_PUBLIC_API_URL` |

### Critical: Two URL contexts

```
NEXT_PUBLIC_API_URL = http://localhost:1337    ← browser-side (user's machine)
STRAPI_URL          = http://api:1337          ← server-side (Docker network)
```

The admin panel only makes browser-side requests, so `NEXT_PUBLIC_API_URL` is enough.
The website has both browser-side code AND server-side BFF API routes (`/api/v1/*`), so it needs BOTH.

### API Routing

All Strapi content types use versioned routes with prefix `/v1`:

```
Strapi endpoint:  http://api:1337/api/v1/courses
                  http://api:1337/api/v1/lessons
                  http://api:1337/api/v1/quizzes

Website BFF:      http://localhost:3003/api/v1/courses  (proxies to Strapi)
                  http://localhost:3003/api/v1/lessons
                  http://localhost:3003/api/v1/quizzes

Admin (direct):   http://localhost:1337/api/v1/courses  (browser → Strapi)
```

## Data Model (Strapi Content Types)

### Course → Lesson → Quiz

```
Course (api::course.course)
├── title (string, required)
├── slug (uid, required, unique)
├── description (text, required)
├── subject (enum: quran|arabic|fiqh|hadith|seerah|aqeedah|akhlaq|tajweed)
├── difficulty (enum: beginner|intermediate|advanced)
├── age_tier (enum: children|youth|adults|seniors)
├── duration_weeks (integer, required, min 1)
├── schedule (string, required)
├── instructor (string, required)
├── is_featured (boolean)
├── lessons → Lesson (oneToMany)
└── enrollments → CourseEnrollment (oneToMany)

Lesson (api::lesson.lesson)
├── title (string, required)
├── slug (uid, required, unique)
├── description (text)
├── lesson_type (enum: video|reading|interactive|quiz|practice)
├── lesson_order (integer, required, min 1)
├── duration_minutes (integer, required, min 1)
├── content (richtext)
├── video_url (string)
├── course → Course (manyToOne)
├── quiz → Quiz (oneToOne)
└── user_progress → UserProgress (oneToMany)

Quiz (api::quiz.quiz)
├── title (string, required)
├── slug (uid, required, unique)
├── quiz_type (enum: practice|assessment|final)
├── passing_score (integer, required, 0-100, default 70)
├── time_limit_minutes (integer)
├── questions (json, required)
├── total_points (integer, required)
├── lesson → Lesson (oneToOne)
└── user_progress → UserProgress (oneToMany)
```

### Field Name Mapping (Admin UI → Strapi)

The admin panel uses human-friendly names; Strapi uses snake_case:

| Admin Form Field | Strapi Schema Field | Notes |
|-----------------|---------------------|-------|
| `category` | `subject` | Enum values must match exactly |
| `ageTier` / `All Ages` | `age_tier` / no `all` value | Map `all` → `adults` |
| `type` (article) | `lesson_type` (reading) | `article`→`reading`, `audio`→`reading` |
| `order` | `lesson_order` | |
| `duration` | `duration_minutes` | |
| `estimatedDuration` | `duration_weeks` | Minutes ÷ 60, min 1 |

## Authentication

### Two Auth Systems

1. **BetterAuth** (website) — Student/user authentication
   - Stored in PostgreSQL directly (`user`, `account`, `session` tables)
   - Website server-side connects to DB via `DATABASE_URL`
   - Client uses `authClient.signIn.email()` → `POST /api/auth/sign-in/email`

2. **Strapi Admin** (API `/admin`) — CMS content management
   - Managed by Strapi's built-in admin auth
   - Seeded automatically by `bootstrap.ts` on first boot (idempotent)
   - Bootstrap script also auto-configures public API permissions on startup
   - Dev mode: `find`, `findOne`, `create`, `update`, `delete` for courses/lessons/quizzes
   - Prod mode: `find`, `findOne` only (write operations require Strapi admin token)

### Seed Users

#### Strapi Admin (seeded by `apps/api/src/bootstrap.ts` on first boot)

| Role | Email | Password | Login URL |
|------|-------|----------|-----------|
| Super Admin | `superadmin@attaqwa.org` | `SuperAdmin123!` | `/admin` |

#### BetterAuth Users (seeded by init container via `scripts/seed-auth-users.sql`)

| Role | Email | Password | Login URL |
|------|-------|----------|-----------|
| Admin | `superadmin@attaqwa.org` | `SuperAdmin123!` | Website `/login` |
| Admin | `masjidadmin@attaqwa.org` | `MasjidAdmin123!` | Website `/login` |
| Teacher | `teacher@attaqwa.org` | `Teacher123!` | Website `/login` |
| Student | `student@attaqwa.org` | `Student123!` | Website `/login` |

**These accounts are seeded in development only. Change passwords after first use.**

#### Production First Deploy

In production (`NODE_ENV=production`), no default accounts are created. After first deploy:

1. **Strapi Admin**: Navigate to `https://yourdomain.com/admin` — Strapi shows the registration form on first visit. Create your admin account there.
2. **BetterAuth Users**: Create user accounts through the admin panel or directly in the database. The init container skips `seed-auth-users.sql` in production.

## Development Setup

### Prerequisites

- Docker Desktop
- Git

### One Command Start

```bash
git clone <repo>
cd attaqwa-lms
docker compose -f docker-compose.dev.yml up -d
```

Wait ~60 seconds for all services to initialize. The init container runs migrations and seeds data automatically.

### Access Points

| Service | URL |
|---------|-----|
| Admin Panel | http://localhost:3000 |
| Website (Student Portal) | http://localhost:3003 |
| Strapi Admin | http://localhost:1337/admin |
| API Health | http://localhost:1337/_health |

### Hot Reload

All three apps have volume mounts (`.:/app`) so code changes reflect immediately:
- **Admin/Website**: Next.js HMR handles it automatically
- **API (Strapi)**: Auto-restarts on file changes in dev mode

### With AI Features (Ollama)

```bash
docker compose -f docker-compose.dev.yml --profile ai up -d
```

This pulls ~4GB model on first run. Set `OLLAMA_ENABLED=true` in `.env`.

## Production Deployment

### 1. Generate Secrets

```bash
# Generate all required secrets
for var in POSTGRES_PASSWORD APP_KEYS API_TOKEN_SALT ADMIN_JWT_SECRET \
           TRANSFER_TOKEN_SALT ENCRYPTION_KEY JWT_SECRET BETTER_AUTH_SECRET \
           REDIS_PASSWORD; do
  echo "${var}=$(openssl rand -base64 32)"
done > .env
```

### 2. Configure Domain

Add to `.env`:

```env
DOMAIN=yourdomain.com
BETTER_AUTH_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

### 3. Deploy

```bash
# Build and start
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Check health
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps
```

### 4. Production Architecture

```
Internet → Caddy (:80/:443 with auto-TLS)
           ├── /admin/*     → admin:3000    (frontend network)
           ├── /api/*       → api:1337      (backend network)
           └── /*           → website:3001  (frontend network)

Internal:
           website:3001 ──STRAPI_URL──→ api:1337     (backend network)
           website:3001 ──DATABASE_URL─→ postgres:5432 (database network)
           api:1337     ──────────────→ postgres:5432 (database network)
           api:1337     ──────────────→ redis:6379    (database network)
```

Three-tier network isolation:
- `frontend`: Caddy ↔ admin, website
- `backend`: Caddy ↔ API, website BFF ↔ API
- `database`: API ↔ PostgreSQL ↔ Redis (internal, no external access)

### 5. Production Environment Variables

```env
# === REQUIRED (no defaults) ===
POSTGRES_PASSWORD=<strong-password>
APP_KEYS=<key1>,<key2>,<key3>,<key4>
API_TOKEN_SALT=<random-32-char>
ADMIN_JWT_SECRET=<random-32-char>
TRANSFER_TOKEN_SALT=<random-32-char>
ENCRYPTION_KEY=<random-32-char>
JWT_SECRET=<random-32-char>
BETTER_AUTH_SECRET=<random-32-char>
REDIS_PASSWORD=<strong-password>

# === NETWORKING ===
DOMAIN=yourdomain.com
BETTER_AUTH_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com

# === DEFAULTS (usually fine) ===
# STRAPI_URL=http://api:1337          # internal Docker hostname, rarely change
# CADDY_HTTP_PORT=80
# CADDY_HTTPS_PORT=443
# NODE_ENV=production

# === AI (optional) ===
# OLLAMA_ENABLED=false
# OLLAMA_MODEL=mistral:7b-instruct-q4_K_M
# OLLAMA_EMBED_MODEL=nomic-embed-text
```

## Coolify / VPS Deployment

If using Coolify or a similar PaaS:

1. Set the Docker Compose file to `docker-compose.yml` (base)
2. Add `docker-compose.prod.yml` as override
3. Set all `REQUIRED` env vars in Coolify's environment settings
4. Ensure `STRAPI_URL=http://api:1337` is set (critical for website BFF)
5. Set `BETTER_AUTH_BASE_URL` to your public domain
6. Coolify handles TLS — you may not need the Caddy service

## Troubleshooting

### "Request failed with status code 405" on course creation

The admin panel is sending to the wrong API path. Ensure admin pages use:
```js
fetch(`${API_URL}/api/v1/courses`, { method: 'POST', ... })
```
NOT `strapiClient.post('/courses', ...)` which misses the `/api` prefix.

### "500 Internal Server Error" on student portal courses

The website's server-side BFF can't reach Strapi. Check:
```bash
# Inside website container:
docker exec attaqwa-website-dev wget -qO- http://api:1337/api/v1/courses
```
If this fails, `STRAPI_URL` is not set. Add `STRAPI_URL=http://api:1337` to the website service environment.

### Courses show as "Demo Mode" in student portal

The `/api/v1/courses` BFF route is failing. Check website container logs:
```bash
docker logs attaqwa-website-dev 2>&1 | grep courses
```
You should see `GET /api/v1/courses 200`. If you see 500, fix `STRAPI_URL`.

### Student login doesn't redirect

BetterAuth requires `DATABASE_URL` and `BETTER_AUTH_SECRET` to be set on the website container. Also ensure the init container ran successfully:
```bash
docker logs attaqwa-init-dev
```

### "This attribute must be unique" on course creation

The auto-generated slug already exists. The admin panel appends a timestamp to slugs to prevent collisions, but if creating a course with the exact same title multiple times in rapid succession, wait a second between creates.

### Lesson created but not showing in course

Ensure the course edit page fetches with `?populate=*` to include the lessons relation:
```
GET /api/v1/courses/{documentId}?populate=*
```

## Backup & Recovery

### Database Backup

```bash
docker exec attaqwa-postgres-dev pg_dump -U postgres attaqwa_lms > backup.sql
```

### Database Restore

```bash
cat backup.sql | docker exec -i attaqwa-postgres-dev psql -U postgres attaqwa_lms
```

### Upload Files

Strapi uploads are stored in the `api_uploads` Docker volume. Back up with:
```bash
docker run --rm -v attaqwa-lms_api_uploads:/data -v $(pwd):/backup alpine tar czf /backup/uploads.tar.gz /data
```
