#!/bin/sh
# =============================================================================
# Init Container Entrypoint - AttaqwaMasjid LMS
# =============================================================================
# Runs all first-time setup tasks against the database. Safe to run on every
# deploy — each step is idempotent.
#
#   1. Wait for PostgreSQL to be ready
#   2. Run BetterAuth migrations (user / session / account / verification +
#      any additionalFields like requiresPasswordChange)
#   3. Seed default user accounts (development environments only)
#   4. Migrate legacy Strapi `up_users` rows into BetterAuth, if present
#
# Strapi content-type tables (courses, lessons, enrollments, etc.) are
# created by Strapi itself on boot — this container intentionally does
# NOT touch them.
# =============================================================================

set -e

echo "=== AttaqwaMasjid LMS Init ==="
echo "Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "Environment: ${NODE_ENV:-unknown}"

# ---------------------------------------------------------------------------
# 1. Wait for PostgreSQL
# ---------------------------------------------------------------------------
echo ""
echo "[1/4] Waiting for PostgreSQL..."

RETRIES=30
until pg_isready -h "$DATABASE_HOST" -p "${DATABASE_PORT:-5432}" -U "${DATABASE_USERNAME:-postgres}" > /dev/null 2>&1; do
  RETRIES=$((RETRIES - 1))
  if [ "$RETRIES" -le 0 ]; then
    echo "FATAL: PostgreSQL not reachable after 30 attempts. Exiting."
    exit 1
  fi
  echo "  Waiting for postgres ($RETRIES retries left)..."
  sleep 2
done
echo "  PostgreSQL is ready."

# ---------------------------------------------------------------------------
# 2. BetterAuth schema migration
#    Uses the locally-installed @better-auth/cli (added as a dev dependency
#    of apps/website). The CLI inspects apps/website/src/lib/auth.ts and
#    applies any pending ALTER TABLEs via DATABASE_URL.
# ---------------------------------------------------------------------------
echo ""
echo "[2/4] Running BetterAuth migrations..."

cd /app/apps/website
pnpm exec better-auth migrate --yes
echo "  BetterAuth migration complete."

# ---------------------------------------------------------------------------
# 3. Seed default user accounts
#    Gated on SEED_USERS (explicit opt-in) rather than NODE_ENV, so staging
#    and other non-prod deploys can run with NODE_ENV=production (correct
#    runtime behavior) while still seeding demo accounts.
# ---------------------------------------------------------------------------
echo ""
echo "[3/4] Seeding default user accounts..."

if [ "${SEED_USERS:-false}" = "true" ]; then
  cd /app
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/seed-auth-users.sql
else
  echo "  SKIP: SEED_USERS != true — create accounts via the admin UI."
fi

# ---------------------------------------------------------------------------
# 4. Migrate Strapi users to BetterAuth (idempotent, no-op if already done)
# ---------------------------------------------------------------------------
echo ""
echo "[4/4] Checking for legacy Strapi user migration..."

STRAPI_USERS=$(psql "$DATABASE_URL" -tAc \
  "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'up_users');" 2>/dev/null || echo "f")

if [ "$STRAPI_USERS" = "t" ]; then
  UNMIGRATED=$(psql "$DATABASE_URL" -tAc \
    "SELECT COUNT(*) FROM up_users u WHERE NOT EXISTS (SELECT 1 FROM \"user\" ba WHERE ba.email = u.email);" 2>/dev/null || echo "0")

  if [ "$UNMIGRATED" -gt 0 ]; then
    echo "  Found $UNMIGRATED unmigrated Strapi users. Migrating..."
    cd /app
    node --import tsx scripts/migrate-users-to-betterauth.ts
    echo "  Strapi user migration complete."
  else
    echo "  All Strapi users already migrated. Skipping."
  fi
else
  echo "  No Strapi up_users table found. Skipping."
fi

echo ""
echo "=== Init complete ==="
